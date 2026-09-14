import { 
    GetPostsRequest, GetPostsResponse, StatusProps
} from "../../types/ContentTypes";

export default function CollectButton({ states: states, onChange }: StatusProps) {

    const handleCollection = async () => {
        onChange({...states, status:'loading'})
        try {
            const [tab] = await chrome.tabs.query({ active:true, currentWindow:true });
            if (!tab?.id) throw new Error('No active tab found');
            
            const response = await chrome.tabs.sendMessage<GetPostsRequest, GetPostsResponse>(
                tab.id,
                {type: 'GET_POSTS'});
            
            onChange({...states, posts: response.posts, status: 'done'});
        } catch (e) {
            onChange({...states, status: 'error', error: e instanceof Error ? 
                e : new Error('Something went wrong')});
        }};

    return (
        <>
            { states.status === 'loading' ? 
                <p>Getting playlist content...</p> : 
                <button onClick={handleCollection}>Collect Playlist</button> }
        </>
    )
}