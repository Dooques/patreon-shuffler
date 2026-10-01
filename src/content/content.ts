import { MediaType } from "../types/FilterTypes";
import { GetPostsRequest, GetPostsResponse, PostInfo } from "../types/ContentTypes";

function getMediaType(el: HTMLAnchorElement): MediaType {
    if (el.querySelector('svg[data-tag="IconVideoCamera"]')) return 'video';
    if (el.querySelector('svg[data-tag="IconPodcastAlt"]')) return 'audio';
    return 'unknown'
}

function findLoadMoreButton(): HTMLElement | null {
    const candidates = Array.from(document.querySelectorAll<HTMLDivElement>('div'))
        .filter((div) => div.textContent?.trim() === 'Load more');
    if (candidates.length === 0) return null;

    return candidates.reduce((deepest, el) =>
        el.querySelectorAll('*').length < deepest.querySelectorAll('*').length ? el : deepest
    );
}

function waitForMorePosts(previousCount: number, timeoutMs = 4000, intervalMs = 200): Promise<void> {
    return new Promise((resolve) => {
        const start = Date.now();
        const check = () => {
            if (countPosts() > previousCount || Date.now() - start > timeoutMs) {
                resolve();
                return;
            }
            setTimeout(check, intervalMs);
        };
        check();
    });
}

async function loadAllPosts(): Promise<void> {
    console.log("Loading all posts...")
    let loadMoreButton = findLoadMoreButton();
    console.log("Load button found, looping to end")
    while (loadMoreButton !== null) {
        const previousCount = countPosts();
        console.log(`loaded ${previousCount} posts...`)
        loadMoreButton.click();
        await waitForMorePosts(previousCount);
        loadMoreButton = findLoadMoreButton();
    }
    console.log("Load more button not found, starting collection logic...");
}

export function extractContent(): PostInfo[] {
    const seen = new Set<string>();
    const posts: PostInfo[] = [];
    console.log("Collecting loaded posts...")

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
                mediaType: getMediaType(element),
                played: false
            });
        });
    
    return posts;
}

function countPosts(): number {
    let count = 0; 
    
    document.querySelectorAll<HTMLAnchorElement>('a[href*="/posts/"]')
        .forEach((element) => {
            if (element.href.match(/\/posts\/(\d+)/)) {
                count++;
            }
        })
    return count;
}

chrome.runtime.onMessage.addListener((
    message: GetPostsRequest,
    _sender,
    sendResponse: (response: GetPostsResponse) => void) => {
        if (message.type === 'GET_POSTS') {
            console.log(`Received ${JSON.stringify(message)}`);
            console.log("Loading posts...");
            loadAllPosts().then(
                () => sendResponse({ posts: extractContent() }));
            return true;
        }
    }
);