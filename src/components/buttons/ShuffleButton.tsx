import { ShuffleProps } from "../../types/ContentTypes"

export default function ShuffleButton({ post, states, onChange, onShuffle }: ShuffleProps) {
    const handleShuffle = () => {
        console.log("starting shuffle function");
        let postList = states.posts;
        console.log(`Post count: ${postList.length}`);
        if (postList.length <= 0) {
            console.log("No posts found, returning.");
            return;
        }

        if (postList.length > 0 && postList.every((p) => p.played)) {
            console.log("All posts are already watched, resetting the list");
            postList.map((p) => p.played = false);
            onChange({...states, posts: postList});
        }

        let newPost = post.post;
        console.log("finding next unplayed post");
        while (newPost.played)
        {
            const randomIndex = Math.floor(Math.random() * states.posts.length);
            newPost = states.posts[randomIndex];
            console.log(`found: ${newPost.title}`);
        }
        
        newPost.played = true;
        console.log(`returning with new post URL: ${newPost.url}`);
        onShuffle({...post, post: newPost});
    }

    return (
        <>
        <div>
            <button onClick={handleShuffle}>Shuffle</button>
        </div>
        </>
    )
}