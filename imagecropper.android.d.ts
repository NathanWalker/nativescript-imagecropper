import * as imageAsset from 'tns-core-modules/image-asset';
import { OptionsCommon, Result } from './interfaces';
export declare class ImageCropper {
    show(image: imageAsset.ImageAsset, options?: OptionsCommon): Promise<Result>;
    private _gcd(width, height);
    private _storeImageSource(image);
    private _cleanFiles();
    private _getContext();
}
