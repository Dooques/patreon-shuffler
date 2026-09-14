import './App.scss';
import FilterForm from './components/forms/FilterForm';
import { useState } from 'react';
import { FilterValues } from './types/FilterTypes.ts';
import VideoList from './components/lists/VideoList';
import { PostValues, StateValues, PostInfo } from './types/ContentTypes.ts';
import CollectButton from './components/buttons/CollectButton.tsx';
import ShuffleButton from './components/buttons/ShuffleButton.tsx';

const STORAGE_KEY = 'filters';
const DEFAULT_FILTERS: FilterValues = { mediaType: 'video', collectionId: "" }
const DEFAULT_STATES: StateValues = { status: 'done', posts: [], error: new Error()}
const DEFAULT_POST: PostInfo = {
  videoId: '',
  url: '',
  title: '',
  mediaType: 'unknown',
  played: false
}
const DEFAULT_POSTS: PostValues = { post: DEFAULT_POST, postList: [] }

function App() {
  const [filters, setFilters] = useState<FilterValues>(DEFAULT_FILTERS);
  const [states, setStates] = useState<StateValues>(DEFAULT_STATES);
  const [posts, setPosts] = useState<PostValues>(DEFAULT_POSTS);

  useState(() => {
    chrome.storage.local.get(STORAGE_KEY, (result) => {
      if (result[STORAGE_KEY]) {
        setFilters(result[STORAGE_KEY] as FilterValues)
      }});
  });

  const handleFilterChanges = ((values: FilterValues) => {
    setFilters(values);
    chrome.storage.local.set({ [STORAGE_KEY]: values });
  });


  return (
    <>
      <div>
      <h1>Patreon Shuffler</h1>
        <FilterForm
          values={ filters }
          onChange={ handleFilterChanges }/>
        <br/>

        <CollectButton 
          states={states}
          onChange={setStates}/>

        { states?.error.message.length > 0 ? <p>{states.error.message}</p> : <></> }
        
        <p>
          <span>When you click collect, a new tab will open and collect all the videos for the collection you entered.</span>
          <span> Once this process has finished, you can use the shuffle button to load a random video.</span>
        </p>

        <ShuffleButton
          posts={posts}
          onShuffle={setPosts}/>

          <h2>{posts.post.title}</h2>
        
        { 
          states.posts.length <= 0 ? 
          <></> : 
          <VideoList postList={ 
            states.posts.filter((p) => p.mediaType === filters.mediaType)}/> 
        }
      </div>
    </>
  )
}

export default App
