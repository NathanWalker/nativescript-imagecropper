import * as imageSource from 'image-source';
export interface OptionsCommon {
    maxWidth?: number;
    maxHeight?: number;
    origWidth?: number;
    origHeight?: number;
    lockAspect?: boolean;
    aspect?: 'landscape' | 'portrait';
}
export interface Result {
    response: string;
    image: imageSource.ImageSource;
}
