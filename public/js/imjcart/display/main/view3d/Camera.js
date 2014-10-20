/// <reference path="../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../lib/three.d.ts"/>
/// <reference path="../../../../lib/lib.ts"/>
/// <reference path="../../../../imjcart/logic/map/value/MapConst.ts"/>
/// <reference path="../../../../imjcart/logic/value/Const.ts"/>
/// <reference path="../../../../imjcart/display/main/view3d/value/View3dConst.ts"/>
/// <reference path="../../../../imjcart/logic/utility/Util.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var imjcart;
(function (imjcart) {
    (function (display) {
        (function (main) {
            (function (view3d) {
                var Camera = (function (_super) {
                    __extends(Camera, _super);
                    function Camera(scene) {
                        _super.call(this);
                        this._scene = null;
                        this._camera = null;
                        this._angle = view3d.value.View3dConst.CAMERA_ANGLE_DEFAULT;
                        this._mode = null;
                        //
                        this._carX = null;
                        this._carZ = null;
                        this._carBodyAngle = null;
                        this._rotationCount = 0;
                        this._isStarted = false;
                        this._isStarted2 = false;
                        this._scene = scene;

                        //
                        var fov = 45;
                        var aspect = window.innerWidth / (window.innerHeight - imjcart.logic.value.Const.FOOTER_HEIGHT - imjcart.logic.value.Const.RANKING_HEIGHT);
                        var near = 1;
                        var far = 20000;
                        this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
                        this._camera.position.x = imjcart.logic.map.value.MapConst.MAP_CENTER_X;
                        this._camera.position.y = 200;
                        this._camera.position.z = imjcart.logic.map.value.MapConst.MAP_CENTER_Z;
                        this._camera.lookAt(new THREE.Vector3(0, 0, 0));
                        this._scene.add(this._camera);
                    }
                    Object.defineProperty(Camera.prototype, "camera", {
                        get: function () {
                            return this._camera;
                        },
                        enumerable: true,
                        configurable: true
                    });

                    Object.defineProperty(Camera.prototype, "mode", {
                        // カメラモード
                        set: function (value) {
                            this._mode = value;
                        },
                        enumerable: true,
                        configurable: true
                    });

                    Object.defineProperty(Camera.prototype, "angle", {
                        // カメラアングル
                        set: function (value) {
                            this._angle = value;
                        },
                        enumerable: true,
                        configurable: true
                    });

                    // 車姿勢変更
                    Camera.prototype.setCarPosture = function (x, z, bodyAngle) {
                        this._carX = x;
                        this._carZ = z;
                        this._carBodyAngle = bodyAngle;
                    };

                    // 更新
                    Camera.prototype.update = function () {
                        if (imjcart.logic.value.Const.IS_VIEW3D_DEBUG_MODE)
                            return;
                        switch (this._mode) {
                            case view3d.value.View3dConst.CAMERA_MODE_OPENING:
                                this._setOpeningMode();
                                break;
                            case view3d.value.View3dConst.CAMERA_MODE_TIMEATACK_RUN:
                                if (!this._isStarted) {
                                    this._startTimeAtackRunMode();
                                } else {
                                    this._setTimeAtackRunMode();
                                }
                                break;
                        }
                    };

                    Camera.prototype._setOpeningMode = function () {
                        this._camera.position.x = imjcart.logic.map.value.MapConst.MAP_CENTER_X + (400 * Math.sin(this._rotationCount));
                        this._camera.position.y = 300;
                        this._camera.position.z = imjcart.logic.map.value.MapConst.MAP_CENTER_Z + (400 * Math.cos(this._rotationCount));
                        this._camera.lookAt(new THREE.Vector3(imjcart.logic.map.value.MapConst.MAP_CENTER_X, 0, imjcart.logic.map.value.MapConst.MAP_CENTER_Z));
                        this._rotationCount += imjcart.logic.value.Const.FPS / 1000 / imjcart.logic.value.Const.FPS;
                    };

                    Camera.prototype._startTimeAtackRunMode = function () {
                        var _this = this;
                        if (!this._carX || !this._carZ || !this._carBodyAngle)
                            return;
                        if (this._isStarted2)
                            return;
                        this._isStarted2 = true;

                        //
                        this._camera.position.x = this._carX - (400 * Math.sin(this._carBodyAngle));
                        this._camera.position.y = 100;
                        this._camera.position.z = this._carZ - (400 * Math.cos(this._carBodyAngle));

                        //
                        $(this._camera.position).animate({
                            x: this._carX - (23 * Math.sin(this._carBodyAngle)),
                            y: 14,
                            z: this._carZ - (23 * Math.cos(this._carBodyAngle))
                        }, {
                            duration: 5000,
                            easing: "swing",
                            complete: function () {
                                _this._isStarted = true;
                            },
                            progress: function () {
                                _this._camera.lookAt(new THREE.Vector3(_this._carX, 7, _this._carZ));
                            }
                        });
                    };

                    Camera.prototype._setTimeAtackRunMode = function () {
                        if (this._angle == view3d.value.View3dConst.CAMERA_ANGLE_TOP) {
                            this._camera.position.x = this._carX - (70 * Math.sin(this._carBodyAngle));
                            this._camera.position.y = 150;
                            this._camera.position.z = this._carZ - (70 * Math.cos(this._carBodyAngle));
                            this._camera.lookAt(new THREE.Vector3(this._carX, 75, this._carZ));
                        } else if (this._angle == view3d.value.View3dConst.CAMERA_ANGLE_INSIDE) {
                            this._camera.position.x = this._carX - (3.9 * Math.sin(this._carBodyAngle));
                            this._camera.position.y = 3.4;
                            this._camera.position.z = this._carZ - (3.9 * Math.cos(this._carBodyAngle));
                            this._camera.rotation.y = this._carBodyAngle - imjcart.logic.utility.Util.getAngleByRotation(180);
                            this._camera.rotation.x = 0;
                            this._camera.rotation.z = 0;
                        } else if (this._angle == view3d.value.View3dConst.CAMERA_ANGLE_BACK) {
                            this._camera.position.x = this._carX - (23 * Math.sin(this._carBodyAngle));
                            this._camera.position.y = 14;
                            this._camera.position.z = this._carZ - (23 * Math.cos(this._carBodyAngle));
                            this._camera.lookAt(new THREE.Vector3(this._carX, 7, this._carZ));
                        }
                    };
                    return Camera;
                })(lib.event.EventDispacher);
                view3d.Camera = Camera;
            })(main.view3d || (main.view3d = {}));
            var view3d = main.view3d;
        })(display.main || (display.main = {}));
        var main = display.main;
    })(imjcart.display || (imjcart.display = {}));
    var display = imjcart.display;
})(imjcart || (imjcart = {}));
