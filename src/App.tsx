import './App.scss';
import FilterForm from './components/forms/FilterForm';
import { useEffect, useState } from 'react';
import { FilterValues } from './types/FilterTypes.ts';
import VideoList from './components/lists/VideoList';
import {StateValues, PostInfo, PersistedState} from './types/ContentTypes.ts';
import CollectButton from './components/buttons/CollectButton.tsx';
import ShuffleButton from './components/buttons/ShuffleButton.tsx';

const STORAGE_KEY = 'filters';
const DEFAULT_FILTERS: FilterValues = { mediaType: 'video', collectionId: "" }
const DEFAULT_STATES: StateValues = { status: 'done', error: new Error() }
const DEFAULT_POST: PostInfo = {
  videoId: '',
  url: '',
  title: 'Nothing found yet...',
  mediaType: 'unknown',
  played: true
}
const DEFAULT_STATE: PersistedState = { mediaFilter: 'video', postList: [] }

function App() {
  const [filters, setFilters] = useState<FilterValues>(DEFAULT_FILTERS);
  const [states, setStates] = useState<StateValues>(DEFAULT_STATES);
  const [persistedState, setPersistedState] = useState<PersistedState>(DEFAULT_STATE);
  const [collectedPosts, setCollectedPosts] = useState<PostInfo[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<PostInfo[]>([]);
  const [shuffledPost, setShuffledPost] = useState(DEFAULT_POST);
  const [hasLoaded, setHasLoaded] = useState(false);
  
  useEffect(() => {
    console.log("extension started, getting data from chrome storage")
    chrome.storage.local.get(STORAGE_KEY, (result) => {
      if (result[STORAGE_KEY]) {setPersistedState(result[STORAGE_KEY] as PersistedState)}});
    setHasLoaded(true);
  }, []);

  const handleFilterChanges = ((filters: FilterValues) => {
    console.log("updating filters")
    setFilters(filters);
  });

  useEffect(() => {
    if (!hasLoaded) return;
    
    const filterResult= collectedPosts.filter(
        (p) => p.mediaType == filters.mediaType);
    setFilteredPosts(filterResult);
  }, [collectedPosts])
  
  useEffect(() => {
    if (!hasLoaded) return;
    
    const newState = {...persistedState, postList: filteredPosts};
    setPersistedState(newState);
    chrome.storage.local.set({[STORAGE_KEY]: newState});
  }, [filteredPosts]);
  
  return (
    <>
      <div>
      <h1>Patreon Shuffler</h1>
        <FilterForm
          values={filters}
          onChange={handleFilterChanges}/>
        <br/>

        <CollectButton 
          states={states}
          posts={collectedPosts}
          onCollection={setCollectedPosts}
          onStateChange={setStates}/>

        { states?.error.message.length > 0 ? <p>{states.error.message}</p> : <></> }
        
        <p>
          <span>When you click collect, a new tab will open and collect all the videos for the collection you entered.</span>
          <span> Once this process has finished, you can use the shuffle button to load a random video.</span>
        </p>

        <ShuffleButton 
            post={shuffledPost} 
            posts={persistedState.postList}
            state={states} 
            onStateChange={setStates} 
            onShuffle={setShuffledPost}
            updatePostList={setFilteredPosts}/>

        <a href={shuffledPost.url}><h2>{shuffledPost.title}</h2></a>
        
        { 
          persistedState.postList.length <= 0 ? 
          <></> : 
          <VideoList postList={persistedState.postList}/>
        }
      </div>
    </>
  )
}

export default App
