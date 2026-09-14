import { ShuffleProps, PostInfo } from "../../types/ContentTypes"

export default function ShuffleButton({ posts, onShuffle }: ShuffleProps) {
    const updatePost = (post: PostInfo) => onShuffle({...posts, post})

    const handleShuffle = () => {
        let post = posts.post;
        while (!post.played)
        {
            const randomIndex = Math.random() * posts.postList.length;
            post = posts.postList[randomIndex];
        }
        post.played = true;
        updatePost(post)
    }

    return (
        <>
        <div>
            <button onClick={handleShuffle}>Shuffle</button>
        </div>
        </>
    )
}