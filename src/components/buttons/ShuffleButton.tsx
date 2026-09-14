import { ShuffleProps } from "../../types/ContentTypes"

export default function ShuffleButton({ posts, onShuffle }: ShuffleProps) {

    if (posts.postList.every((p) => p.played)) {
        posts.postList.map((p) => p.played = false);
    }

    const handleShuffle = () => {
        let newPost = posts.post;
        while (!newPost.played)
        {
            const randomIndex = Math.random() * posts.postList.length;
            newPost = posts.postList[randomIndex];
        }
        newPost.played = true;
        onShuffle({...posts, post: newPost});
    }

    return (
        <>
        <div>
            <button onClick={handleShuffle}>Shuffle</button>
        </div>
        </>
    )
}