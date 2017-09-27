/**
* @Author: Brian Thurlow
* @Date:   03/29/2016 04:03:50 PM
* @Last modified by:   Brian Thurlow
* @Last modified time: 03/30/2016 02:04:35 PM
*/



var cameraModule = require("nativescript-camera");
var icModule = require("nativescript-imagecropper");

var _page,_image1;
function onNavigatingTo(args) {
    _page = args.object;
    // page.bindingContext = vmModule.mainViewModel;
    _image1 = _page.getViewById("image1");
}
exports.onNavigatingTo = onNavigatingTo;

exports.tapCameraAction = function (args) {
  let perm = cameraModule.requestPermissions();
  console.log('perm:', perm);
  cameraModule.takePicture({width:300,height:300,keepAspectRatio:true})
    .then(function (picture) {
      console.log(picture.nativeImage);
      console.log(picture.constructor.name);
    var cropper = new icModule.ImageCropper();
    cropper.show(picture).then(function (args) {
      console.log('ios:');
      console.log(args.image.ios);
      console.log('android:');
      console.log(args.image.android);
      if(args.image !== null){
        _image1.visibility = "visible";
        _image1.imageSource = args.image;
      }
      else{
        _image1.visibility = "collapsed";
      }
    })
    .catch(function(e){
      console.log(e);
    });
  })
  .catch(function(e){
    console.log(e);
  })
};
exports.tapCameraActionResize = function (args) {
  cameraModule.requestPermissions();
  cameraModule.takePicture({width:300,height:300,keepAspectRatio:true})
  .then(function(picture){
    var cropper = new icModule.ImageCropper();
    cropper.show(picture,{width:100,height:100}).then(function(args){
      console.log(JSON.stringify(args));
      if(args.image !== null){
        _image1.visibility = "visible";
        _image1.imageSource = args.image;
      }
      else{
        _image1.visibility = "collapsed";
      }
    })
    .catch(function(e){
      console.log(e);
    });
  })
  .catch(function(e){
    console.log(e);
  })
};
