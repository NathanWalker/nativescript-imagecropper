import * as imageSource from 'tns-core-modules/image-source';
import * as imageAsset from 'tns-core-modules/image-asset';
import { OptionsCommon, Result } from './interfaces';
export declare class ImageCropper {
    show(image: imageAsset.ImageAsset, options?: OptionsCommon): Promise<Result>;
}

export interface OptionsCommon{
  maxWidth?: number,
  maxHeight?: number,
  origWidth?: number,
  origHeight?: number,
  lockAspect?: boolean,
  aspect?: 'landscape' | 'portrait'
}

export interface Result{
  response:string;
  image:imageSource.ImageSource;
}
