import { 
    ContentStatus, GetPostsRequest, GetPostsResponse, StatusProps
} from "../../content/Content.types";
import { PostInfo } from "../lists/VideoList.types";

export default function CollectButton({ states: state, onChange }: StatusProps) {

    const handleStatusChange = (status: ContentStatus) => onChange({...state, status});
    const handlePostChange = (posts: PostInfo[]) => onChange({...state, posts});
    const handleError = (error: Error) => onChange({...state, error})

    const handleExtraction = async () => {
        handleStatusChange('loading');
        try {
        const [tab] = await chrome.tabs.query({ active:true, currentWindow:true })
        if (!tab?.id) throw new Error('No active tab found');
        const response = await chrome.tabs.sendMessage<GetPostsRequest, GetPostsResponse>(
            tab.id,
            {type: 'GET_POSTS'}
        );
        handlePostChange(response.posts);
        handleStatusChange('done');
        } catch (e) {
        handleStatusChange('error');
        handleError(e instanceof Error ? e : new Error('Something went wrong'));
    }};

    return (
        <>
            { 
            state.status === 'loading' ? 
                <p>Getting playlist content...</p> : 
                <button onClick={handleExtraction}>Collect Playlist</button>
            }
        </>
    )
}