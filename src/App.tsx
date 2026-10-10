import './App.scss';
import { useEffect, useState } from 'react';
import { FilterValues } from './types/FilterTypes.ts';
import VideoList from './components/lists/VideoList';
import {StateValues, PostInfo, PersistedState} from './types/ContentTypes.ts';
import CollectButton from './components/buttons/CollectButton.tsx';
import ShuffleButton from './components/buttons/ShuffleButton.tsx';
import {isExtension} from "./utils/isExtension.ts";
import {Instructions} from "./components/instructions/instructions.tsx";
import FilterForm from "./components/forms/FilterForm.tsx";

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
  const [showInstructions, setShowInstructions] = useState(false);
  
  useEffect(() => {
    console.log("extension started, getting data from chrome storage")
    if (isExtension) {
      chrome.storage.local.get(STORAGE_KEY, (result) => {
        if (result[STORAGE_KEY]) { setPersistedState(result[STORAGE_KEY] as PersistedState) }});
    }
    setHasLoaded(true);
  }, []);


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

  const handleFilterChanges = ((values: FilterValues) => {
    console.log("updating filters")
    setFilters(values);
  });
  
  return (
    <>
      <div>
        <h1>Patreon Shuffler</h1>

        <FilterForm
            values={filters}
            onChange={handleFilterChanges}
        />
        <div>
          { showInstructions ? 
              <div>
                <Instructions/>
                <a className={"instructionButton"} 
                   href={"#"}
                   onClick={(e) => {
                     e.preventDefault()
                     setShowInstructions(!showInstructions)}
                }>Hide Instructions</a>
              </div> :
              <div>
                <a className={"instructionButton"} 
                   href={"#"} 
                   onClick={(e) => {
                     e.preventDefault()
                     setShowInstructions(!showInstructions)}
                }>Show Instructions</a> 
              </div>
          }
        </div>

        <div className={"buttonContainer"}>
          <CollectButton
              states={states}
              posts={collectedPosts}
              onCollection={setCollectedPosts}
              onStateChange={setStates}
          />

          <ShuffleButton
              post={shuffledPost}
              posts={persistedState.postList}
              state={states}
              onStateChange={setStates}
              onShuffle={setShuffledPost}
              updatePostList={setFilteredPosts}/>
        </div>

        <a href={shuffledPost.url}
           onClick={(e) => {
             e.preventDefault();
             chrome.tabs.create({ url: shuffledPost.url });
           }}>
          <h2>{shuffledPost.title}</h2>
        </a>
        
        { states?.error.message.length > 0 ? <p>{states.error.message}</p> : <></> }
        
        { persistedState.postList.length <= 0 ? <></> : 
            <VideoList postList={persistedState.postList}/> }
      </div>
    </>
  )
}

export default App
