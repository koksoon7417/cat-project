

import Request from './Request';

export interface BreedType {
    id: string;
    name: string;
    weight: {
        imperial: string;
        metric: string;
    };
    life_span: string;
    reference_image_id: string;
    images: ImageType;
}

export interface ImageType {
    height: number;
    id: string;
    url: string;
    width: number;
}

export class Services {
    static getBreedsSearch(name: string) {
        return Request<BreedType[]>("/breeds/search", {
            q: name,
        });
    }

    static getImagesSearch(image_id: string) {
        return Request<ImageType>("/images/" + image_id);
    }
}