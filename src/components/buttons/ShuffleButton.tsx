import { ShuffleProps } from "../../types/ContentTypes"

export default function ShuffleButton(
    { post, posts, state, onStateChange, updatePostList, onShuffle}: ShuffleProps
) {
    const handleShuffle = async () => {
        console.log("starting shuffle function");
        onStateChange({...state, status: 'loading'});
        
        let postList = posts;
        console.log(`Post count: ${postList.length}`);
        if (postList.length <= 0) {
            console.log("No posts found, returning.");
            onStateChange({...state, status: 'done'});
            return;
        }

        if (postList.length > 0 && postList.every((p) => p.played)) {
            console.log("All posts are already watched, resetting the list");
            postList.map((p) => p.played = false);
            updatePostList(postList);
        }

        let newPost = post;
        console.log("finding next unplayed post");
        while (newPost.played)
        {
            const randomIndex = Math.floor(Math.random() * posts.length);
            newPost = posts[randomIndex];
            console.log(`found: ${newPost.title}`);
        }
        
        newPost.played = true;
        console.log(`returning with new post URL: ${newPost.url}`);
        onShuffle(newPost);
        onStateChange({...state, status: 'done'});
    }

    return (
        <>
        <div>
            <button onClick={handleShuffle}>Shuffle</button>
        </div>
        </>
    )
}