import * as frame from 'tns-core-modules/ui/frame';
import * as imageSource from 'tns-core-modules/image-source';
import * as imageAsset from 'tns-core-modules/image-asset';
import { OptionsCommon, Result } from './interfaces';

export class TOCropViewControllerDelegateImpl extends NSObject {
  private _resolve: any;
  private _reject: any;
  private _options: OptionsCommon;
  private _owner: WeakRef<TOCropViewController>;

  public static ObjCProtocols = [TOCropViewControllerDelegate];

  public static initWithOwner(owner: WeakRef<TOCropViewController>, options: OptionsCommon, success: (result: any) => void, error: (err: any) => void): TOCropViewControllerDelegateImpl {
    // console.log("TOCropViewControllerDelegateImpl.initWithOwner");
    const handler = <TOCropViewControllerDelegateImpl>super.new();
    handler._owner = owner;
    handler._options = options;
    handler._resolve = success;
    handler._reject = error;
    return handler;
  }

  public cropViewControllerDidCropToImageWithRectAngle(cropViewController: TOCropViewController, image: UIImage, cropRect: CGRect, angle: number): void {
    // console.log("TOCropViewControllerDelegateImpl.cropViewControllerDidCropToImageWithRectAngle");
    // cropViewController.dismissViewControllerAnimatedCompletion(true, null);
    if (image) {
      var imgSrc = new imageSource.ImageSource();
      if (this._options && this._options.maxWidth && this._options.maxHeight) {
        //Resize Image
        const rect: CGRect = CGRectMake(0, 0, this._options.maxWidth, this._options.maxHeight);
        UIGraphicsBeginImageContext(rect.size);
        image.drawInRect(rect);
        const resizedImage = UIGraphicsGetImageFromCurrentImageContext();
        UIGraphicsEndImageContext();

        if (imgSrc.setNativeSource(resizedImage)) {

          this._resolve({
            response: "Success",
            image: imgSrc
          });
        } else {
          this._reject({
            response: "Error",
            image: null
          });
        }
      }
      else {
        //Use Cropped Image w/o Resize
        if (imgSrc.setNativeSource(image)) {
          this._resolve({
            response: "Success",
            image: imgSrc
          });
        } else {
          this._reject({
            response: "Error",
            image: null
          });
        }
      }
    }
    rootVC().dismissViewControllerAnimatedCompletion(true, null);
    // CFRelease(cropViewController.delegate);
    // return;
  }

  public cropViewControllerDidFinishCancelled(cropViewController: TOCropViewController, cancelled: boolean): void { //Promise<Result>
    // console.log("TOCropViewControllerDelegateImpl.cropViewControllerDidFinishCancelled");
    this._resolve({
      response: "Cancelled",
      image: null
    });
    rootVC().dismissViewControllerAnimatedCompletion(true, null);
    // CFRelease(cropViewController.delegate);
    // return;
  }
}

export class ImageCropper {
  private _viewController: TOCropViewController;
  private _delegate: TOCropViewControllerDelegateImpl;

  public show(image: imageAsset.ImageAsset, options?: OptionsCommon): Promise<Result> {
    // console.log("ImageCropper.show");
    return new Promise<Result>((resolve, reject) => {
      if (image.nativeImage) {
        this._viewController = TOCropViewController.alloc().initWithImage(image.nativeImage);
        this._delegate = TOCropViewControllerDelegateImpl.initWithOwner(
          new WeakRef(this._viewController),
          options,
          (result) => {
            this._viewController = null;
            this._delegate = null;
            resolve(result);
          }, (err) => {
            this._viewController = null;
            this._delegate = null;
            reject(err);
        });

        // CFRetain(delegate);
        this._viewController.delegate = this._delegate;
        if (options.lockAspect) {
          this._viewController.aspectRatioPickerButtonHidden = true;
        }

        // var page = frame.topmost().ios.controller;
        rootVC().presentViewControllerAnimatedCompletion(this._viewController, true, () => {
          //Set Fixed Crop Size
          if (options && options.origWidth && options.origHeight && options.maxWidth && options.maxHeight) {

            const isPortrait = options.origHeight > options.origWidth; 
            const portraitAspect = CGSizeMake(3, 4);

            // default landscape
            let aspect = TOCropViewControllerAspectRatioPreset.Preset4x3;
            
            if (options.aspect) {
              // force an aspect
              switch (options.aspect) {
                case 'portrait':  
                  this._viewController.customAspectRatio = portraitAspect; 
                  aspect = TOCropViewControllerAspectRatioPreset.PresetCustom;
                  break;
              }
            } else {
              // look at original height and width to determine if it should be portrait
              if (isPortrait) {
                // should be portrait
                this._viewController.customAspectRatio = portraitAspect; 
                aspect = TOCropViewControllerAspectRatioPreset.PresetCustom;
              }
            }
            // viewController.cropView.aspectRatioLockEnabled = true;
            // viewController.cropView.resetAspectRatioEnabled = false;
            if (options.lockAspect) {
              // viewController.aspectRatioPickerButtonHidden = true;
              this._viewController.aspectRatioLockEnabled = true;
              // viewController.cropView.resetAspectRatioEnabled = false;
              // viewController.toolbar.clampButtonHidden = true;
              if (this._viewController.toolbar.clampButton) {
                this._viewController.toolbar.clampButton.removeFromSuperview();
              }
              if (this._viewController.toolbar.resetButton) {
                this._viewController.toolbar.resetButton.removeFromSuperview();
              }
              // viewController.toolbar.clampButtonGlowing = false;
              // viewController.toolbar.setNeedsLayout();
            }
            // viewController.toolbar.clampButtonGlowing = false;
            this._viewController.setAspectRatioPresetAnimated(aspect, true);


            // var gcd = _that._gcd(_options.maxWidth, _options.maxHeight);
            // viewController.cropView.setAspectRatioAnimated(CGSizeMake(_options.maxWidth / gcd, _options.maxHeight / gcd), false);
          }
        });
      } else {
        reject({
          response: "Error",
          image: null
        });
      }
    });
  }
  private _gcd(width: number, height: number): number {
    if (height == 0) {
      return width;
    } else {
      return this._gcd(height, width % height);
    }
  }
}

const rootVC = function() {
  let appWindow = UIApplication.sharedApplication.keyWindow;
  return appWindow.rootViewController;
}
