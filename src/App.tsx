import './App.scss';
import FilterForm from './components/forms/FilterForm';
import { useState } from 'react';
import { FilterValues } from './components/forms/FilterForm.types';
import { PostInfo } from './components/lists/VideoList.types.ts';
import VideoList from './components/lists/VideoList';
import { GetPostsResponse, GetPostsRequest, ContentStatus, StateValues } from './content/Content.types.ts';
import CollectButton from './components/buttons/Collect.tsx';

const STORAGE_KEY = 'filters';
const DEFAULT_FILTERS: FilterValues = { mediaType: 'video', collectionId: "" }

function App() {
  const [filters, setFilters] = useState<FilterValues>(DEFAULT_FILTERS);
  const [states, setStates] = useState<StateValues>();

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
          onChange={ handleFilterChanges }
        />
        <br/>

        <CollectButton 
          states={states}
          onChange={setStates}/>

        { error.length > 0 ? <p>{error}</p> : <></> }
        
        <p>
          <span>When you click collect, a new tab will open and collect all the videos for the collection you entered.</span>
          <span> Once this process has finished, you can use the shuffle button to load a random video.</span>
        </p>

        <button>Shuffle</button>
        
        { posts.length <= 0 ? <></> : <VideoList postList={ posts }></VideoList> }
      </div>
    </>
  )
}

export default App
