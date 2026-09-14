import { MediaType } from "../components/forms/FilterForm.types";
import { PostInfo } from "../components/lists/VideoList.types";
import { GetPostsRequest, GetPostsResponse } from "./Content.types";

function getMediaType(el: HTMLAnchorElement): MediaType {
    if (el.querySelector('svg[data-tag="IconVideoCamera"]')) return 'video';
    if (el.querySelector('svg[data-tag="IconPodcastAlt"]')) return 'audio';
    return 'unknown'
}

export function extractContent(): PostInfo[] {
    const seen = new Set<string>();
    const posts: PostInfo[] = [];

    document.querySelectorAll<HTMLAnchorElement>('a[href*="/posts/"]')
        .forEach((element) => {
            const match = element.href.match(/\/posts\/(\d+)/);
            const videoId = match?.[1];
            if (!videoId || seen.has(videoId)) return;
            seen.add(videoId);

            posts.push({
                videoId,
                url: element.href.split('?')[0],
                title: element.querySelector('h3')?.textContent?.trim() ?? '',
                mediaType: getMediaType(element)
            });
        });
    
    return posts;
}

chrome.runtime.onMessage.addListener((
    message: GetPostsRequest, 
    _sender, 
    sendResponse: (response: GetPostsResponse) => void) => {
        if (message.type === 'GET_POSTS') {
            sendResponse({ posts: extractContent() });
        }
    }
);