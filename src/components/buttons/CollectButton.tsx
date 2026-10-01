import {
    GetPostsRequest, GetPostsResponse, CollectionProps 
} from "../../types/ContentTypes";

export default function CollectButton({ states, onStateChange, onCollection }: CollectionProps) {

    const handleCollection = async () => {
        onStateChange({...states, status:'loading'})
        try {
            const [tab] = await chrome.tabs.query({ active:true, currentWindow:true });
            if (!tab?.id) throw new Error('No active tab found');
            
            const response = 
                await chrome.tabs.sendMessage<GetPostsRequest, GetPostsResponse>(
                    tab.id, 
                    {type: 'GET_POSTS'});
            onStateChange({...states, status: 'done'});
            onCollection(response.posts);
        } catch (e) {
            onStateChange({...states, status: 'error', error: e instanceof Error ? 
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