import { FilterFormProps } from '../../types/FilterTypes';


export default function FilterForm({values, onChange }: FilterFormProps) {
    return (
        <>
        <form>
            <div className="filterForm">
                <h2>Filters:</h2>
                
                <label>
                    <input 
                        type="radio"
                        name="mediaType"
                        value="video"
                        checked = {values.mediaType === 'video'}
                        onChange={() => onChange({...values, mediaType: 'video' })}
                    />Video
                </label>

                <label>
                    <input 
                        type="radio"
                        name="mediaType"
                        value="audio"
                        checked = {values.mediaType === 'audio'}
                        onChange={() => onChange({...values, mediaType: 'audio'})}
                    />Audio
                </label>
            </div>
        </form>
        </>
    )
}