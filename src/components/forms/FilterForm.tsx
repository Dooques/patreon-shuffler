import { FilterFormProps } from '../../types/FilterTypes';


export default function FilterForm({values, onChange }: FilterFormProps) {
    return (
        <>
        <form>
            <h2>Filters</h2>

            <div className="filter-form">
                <div className="media-filters">
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
            </div>
        </form>
        </>
    )
}