import type { PostInfo } from "../components/lists/VideoList.types";

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