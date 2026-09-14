import { MediaType } from "./FilterTypes";

export type ContentStatus = 'loading' | 'done' | 'error'

export interface StateValues {
    status: ContentStatus;
    posts: PostInfo[];
    error: Error;
}

export interface StatusProps {
    states: StateValues;
    onChange: (state: StateValues) => void;
}

export interface GetPostsRequest {
    type: 'GET_POSTS';
}

export interface GetPostsResponse {
    posts: PostInfo[];
}

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