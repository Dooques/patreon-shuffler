import './VideoList.scss'
import { useState } from "react"
import { PostInfo, PostListProps } from "../../types/ContentTypes";

export default function({postList}: PostListProps) {
    const [listState, setListState] = useState(false);

    const handleListState = () => {
        setListState(!listState)
    };

    return (
        <>
            <div>
                <ul>
                    <li>
                        Playlist Count: {postList.length}
                    </li>
                    <br/>
                    <li>
                        <button onClick={ handleListState }>
                            {listState ? "Hide Playlist" : "Show Playlist"}
                        </button>
                    </li>
                    {listState ? postList.map((post: PostInfo) =>
                        <li>
                            <a href={post.url} onClick={(e) => {
                                e.preventDefault();
                                chrome.tabs.create({ url: post.url });
                            }}>{post.title}</a>
                        </li>
                        ) : <></>}
                </ul>
            </div>
        </>
    )
}