import { 
    ContentStatus, GetPostsRequest, GetPostsResponse, StatusProps
} from "../../types/ContentTypes";
import { PostInfo } from "../../types/VideoList.types";

export default function CollectButton({ states: states, onChange }: StatusProps) {

    const handleStatusChange = (status: ContentStatus) => onChange({...states, status});
    const handlePostChange = (posts: PostInfo[]) => onChange({...states, posts});
    const handleError = (error: Error) => onChange({...states, error})

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
            states.status === 'loading' ? 
                <p>Getting playlist content...</p> : 
                <button onClick={handleExtraction}>Collect Playlist</button>
            }
        </>
    )
}