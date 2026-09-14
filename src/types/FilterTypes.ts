export type MediaType = 'video' | 'audio' | 'unknown';

export interface FilterValues {
    mediaType: MediaType;
    collectionId: string;
}

export interface FilterFormProps {
    values: FilterValues;
    onChange: (values: FilterValues) => void;
}