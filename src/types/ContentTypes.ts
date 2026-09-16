import { MediaType } from "./FilterTypes";

export type ContentStatus = 'loading' | 'done' | 'error'

export interface StateValues {
    status: ContentStatus;
    error: Error;
}


export interface CollectionProps {
    states: StateValues;
    posts: PostInfo[];
    onCollection: (posts: PostInfo[]) => void;
    onStateChange: (state: StateValues) => void;
}

export interface ShuffleProps {
    post: PostInfo;
    posts: PostInfo[];
    state: StateValues;
    onStateChange: (states: StateValues) => void;
    updatePostList: (posts: PostInfo[]) => void;
    onShuffle: (post: PostInfo) => void;
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
    played: boolean;
}

export interface PostList {
    posts: PostInfo[];
}

export interface PostListProps {
    postList: PostInfo[];
}

export interface PersistedState {
    mediaFilter: MediaType;
    postList: PostInfo[];
}