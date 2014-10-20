/// <reference path="../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../lib/three.d.ts"/>
/// <reference path="../../../../lib/lib.ts"/>
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
                var Light = (function (_super) {
                    __extends(Light, _super);
                    function Light(scene) {
                        _super.call(this);
                        this._scene = null;
                        this._light = null;
                        this._spotLight = null;
                        this._mode = null;
                        this._carX = null;
                        this._carZ = null;
                        this._rotationCount = 0;
                        this._scene = scene;

                        //
                        if (imjcart.logic.value.Const.IS_SHADOW_ENABLED) {
                            this._light = new THREE.DirectionalLight(0x999999, 1);
                            this._light.position.set(1000, 1000, 1000);
                            this._light.shadowCameraLeft = -1000;
                            this._light.shadowCameraRight = 1000;
                            this._light.shadowCameraTop = -1000;
                            this._light.shadowCameraBottom = 1000;
                            this._light.shadowDarkness = 0.7;
                            this._light.shadowMapWidth = 5000;
                            this._light.shadowMapHeight = 5000;
                            this._scene.add(this._light);

                            //
                            this._spotLight = new THREE.SpotLight(0x999999, 1);
                            this._spotLight.position.set(imjcart.logic.map.value.MapConst.MAP_CENTER_X, 1000, imjcart.logic.map.value.MapConst.MAP_CENTER_Z);
                            this._spotLight.castShadow = true;
                            this._spotLight.shadowMapWidth = 10000;
                            this._spotLight.shadowMapHeight = 10000;
                            this._spotLight.shadowCameraNear = 900;
                            this._spotLight.shadowCameraFar = 1700;
                            this._spotLight.shadowCameraFov = 30;
                            this._spotLight.target.position.set(imjcart.logic.map.value.MapConst.MAP_CENTER_X, 0, imjcart.logic.map.value.MapConst.MAP_CENTER_Z);
                            this._scene.add(this._spotLight);
                        } else {
                            this._light = new THREE.DirectionalLight(0xFFFFFF, 1);
                            this._light.position.set(1000, 1000, 1000);
                            this._light.shadowCameraLeft = -1000;
                            this._light.shadowCameraRight = 1000;
                            this._light.shadowCameraTop = -1000;
                            this._light.shadowCameraBottom = 1000;
                            this._light.shadowDarkness = 0.7;
                            this._light.shadowMapWidth = 5000;
                            this._light.shadowMapHeight = 5000;
                            this._scene.add(this._light);
                        }
                    }
                    Object.defineProperty(Light.prototype, "mode", {
                        set: function (value) {
                            this._mode = value;
                        },
                        enumerable: true,
                        configurable: true
                    });

                    Object.defineProperty(Light.prototype, "light", {
                        get: function () {
                            return this._light;
                        },
                        enumerable: true,
                        configurable: true
                    });

                    Object.defineProperty(Light.prototype, "spotLight", {
                        get: function () {
                            return this._spotLight;
                        },
                        enumerable: true,
                        configurable: true
                    });

                    // 更新
                    Light.prototype.update = function () {
                        switch (this._mode) {
                            case view3d.value.View3dConst.CAMERA_MODE_OPENING:
                                this._setOpeningMode();
                                break;
                            case view3d.value.View3dConst.CAMERA_MODE_TIMEATACK_RUN:
                                this._setTimeAtackRunMode();
                                break;
                        }
                    };

                    // 車位置変更
                    Light.prototype.setCarPosition = function (x, z) {
                        this._carX = x;
                        this._carZ = z;
                    };

                    Light.prototype._setOpeningMode = function () {
                        this._spotLight.target.position.set(imjcart.logic.map.value.MapConst.MAP_CENTER_X, 0, imjcart.logic.map.value.MapConst.MAP_CENTER_Z);
                        this._spotLight.position.set(imjcart.logic.map.value.MapConst.MAP_CENTER_X + (400 * Math.sin(this._rotationCount)), 1500, imjcart.logic.map.value.MapConst.MAP_CENTER_Z + (400 * Math.cos(this._rotationCount)));
                        this._rotationCount += imjcart.logic.value.Const.FPS / 1000 / imjcart.logic.value.Const.FPS;
                    };

                    Light.prototype._setTimeAtackRunMode = function () {
                        this._spotLight.position.set(imjcart.logic.map.value.MapConst.MAP_CENTER_X, 1000, imjcart.logic.map.value.MapConst.MAP_CENTER_Z);
                        this._spotLight.target.position.set(this._carX, 0, this._carZ);
                    };
                    return Light;
                })(lib.event.EventDispacher);
                view3d.Light = Light;
            })(main.view3d || (main.view3d = {}));
            var view3d = main.view3d;
        })(display.main || (display.main = {}));
        var main = display.main;
    })(imjcart.display || (imjcart.display = {}));
    var display = imjcart.display;
})(imjcart || (imjcart = {}));
