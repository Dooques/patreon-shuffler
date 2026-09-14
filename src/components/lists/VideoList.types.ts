import { MediaType } from "../forms/FilterForm.types";

export interface PostInfo {
    videoId: string;
    url: string;
    title: string;
    mediaType: MediaType;
}

export interface PostList {
    posts: PostInfo[];
}

export interface PostListProps {
    postList: PostInfo[];
}