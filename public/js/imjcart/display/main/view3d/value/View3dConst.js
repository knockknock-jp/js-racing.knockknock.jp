/// <reference path="../../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../../lib/three.d.ts"/>
/// <reference path="../../../../../lib/lib.ts"/>
var imjcart;
(function (imjcart) {
    (function (display) {
        (function (main) {
            (function (view3d) {
                (function (value) {
                    var View3dConst = (function () {
                        function View3dConst() {
                        }
                        View3dConst.CAMERA_MODE_OPENING = "camera_mode_opening";
                        View3dConst.CAMERA_MODE_TIMEATACK_RUN = "camera_mode_timeatack_run";

                        View3dConst.CAMERA_ANGLE_TOP = "camera_angle_top";
                        View3dConst.CAMERA_ANGLE_BACK = "camera_angle_back";
                        View3dConst.CAMERA_ANGLE_INSIDE = "camera_angle_inside";
                        View3dConst.CAMERA_ANGLE_DEFAULT = View3dConst.CAMERA_ANGLE_BACK;

                        View3dConst.AMBIENT_COLOR = 0x666666;
                        return View3dConst;
                    })();
                    value.View3dConst = View3dConst;
                })(view3d.value || (view3d.value = {}));
                var value = view3d.value;
            })(main.view3d || (main.view3d = {}));
            var view3d = main.view3d;
        })(display.main || (display.main = {}));
        var main = display.main;
    })(imjcart.display || (imjcart.display = {}));
    var display = imjcart.display;
})(imjcart || (imjcart = {}));
