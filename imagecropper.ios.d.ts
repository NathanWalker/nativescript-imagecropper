import * as imageAsset from 'tns-core-modules/image-asset';
import { OptionsCommon, Result } from './interfaces';
export declare class TOCropViewControllerDelegateImpl extends NSObject {
    private _resolve;
    private _reject;
    private _options;
    private _owner;
    static ObjCProtocols: {
        prototype: TOCropViewControllerDelegate;
    }[];
    static initWithOwner(owner: WeakRef<TOCropViewController>, options: OptionsCommon, success: (result: any) => void, error: (err: any) => void): TOCropViewControllerDelegateImpl;
    cropViewControllerDidCropToImageWithRectAngle(cropViewController: TOCropViewController, image: UIImage, cropRect: CGRect, angle: number): void;
    cropViewControllerDidFinishCancelled(cropViewController: TOCropViewController, cancelled: boolean): void;
}
export declare class ImageCropper {
    private _viewController;
    private _delegate;
    show(image: imageAsset.ImageAsset, options?: OptionsCommon): Promise<Result>;
    private _gcd(width, height);
}
