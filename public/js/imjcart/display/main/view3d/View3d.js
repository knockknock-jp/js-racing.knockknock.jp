/// <reference path="../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../lib/three.d.ts"/>
/// <reference path="../../../../lib/lib.ts"/>
/// <reference path="../../../../imjcart/display/main/view3d/Car.ts"/>
/// <reference path="../../../../imjcart/display/main/view3d/OtherCar.ts"/>
/// <reference path="../../../../imjcart/display/main/view3d/Camera.ts"/>
/// <reference path="../../../../imjcart/display/main/view3d/Cource.ts"/>
/// <reference path="../../../../imjcart/display/main/view3d/Light.ts"/>
/// <reference path="../../../../imjcart/display/main/view3d/Icon.ts"/>
/// <reference path="../../../../imjcart/display/main/view3d/Background.ts"/>
/// <reference path="../../../../imjcart/display/main/view3d/GhostCar.ts"/>
/// <reference path="../../../../imjcart/logic/value/GlobalValue.ts"/>
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
                var View3d = (function (_super) {
                    __extends(View3d, _super);
                    function View3d(target) {
                        var _this = this;
                        _super.call(this, target);
                        this._displayImpl = null;
                        this._scene = null;
                        this._renderer = null;
                        this._axis = null;
                        this._controls = null;
                        //
                        this._light = null;
                        this._camera = null;
                        this._background = null;
                        this._cource = null;
                        this._car = null;
                        this._icon = null;
                        this._otherCarArr = [];
                        //
                        this._carX = null;
                        this._carZ = null;
                        this._carBodyAngle = null;
                        this._carWheelAngle = null;
                        this._carSpeed = null;
                        this._cameraAngle = view3d.value.View3dConst.CAMERA_ANGLE_DEFAULT;
                        //
                        this._ghostCarArr = [];

                        // シーン
                        this._scene = new THREE.Scene();

                        //this._scene.fog = new THREE.FogExp2(0xFFFFFF, 0.001);
                        // 環境光
                        var ambient = new THREE.AmbientLight(imjcart.display.main.view3d.value.View3dConst.AMBIENT_COLOR);
                        this._scene.add(ambient);

                        // レンダラ―
                        //this._renderer = new THREE.WebGLRenderer();
                        this._renderer = new THREE.WebGLRenderer({ antialias: true });
                        this._renderer.setSize(window.innerWidth, window.innerHeight - imjcart.logic.value.Const.FOOTER_HEIGHT - imjcart.logic.value.Const.RANKING_HEIGHT);
                        this._renderer.setClearColor(0x2077ab, 1);
                        if (imjcart.logic.value.Const.IS_SHADOW_ENABLED) {
                            this._renderer.shadowMapEnabled = true;
                        }
                        this.$target.append(this._renderer.domElement);

                        // ライト
                        this._light = new view3d.Light(this._scene);

                        // カメラ
                        this._camera = new view3d.Camera(this._scene);

                        // 背景
                        this._background = new view3d.Background(this._scene);

                        // コース
                        this._cource = new view3d.Cource(this._scene);

                        // 車
                        this._car = new view3d.Car(this._scene);

                        // アイコン
                        this._icon = new view3d.Icon(this._scene);

                        //
                        this._displayImpl = new lib.display.SimpleDisplayImpl(this.$target);
                        this._displayImpl.addEventListener(lib.event.Event.DISPLAY_START_OPEN_EVENT, function () {
                            lib.responisive.ResizeManager.getInstance().addEventListener(_this);
                            lib.responisive.ResizeManager.getInstance().dispatchEvent(_this);
                        });
                        this._displayImpl.addEventListener(lib.event.Event.DISPLAY_COMPLETE_OPEN_EVENT, function () {
                            _this._completeOpen();
                        });

                        // デバッグモード
                        if (imjcart.logic.value.Const.IS_VIEW3D_DEBUG_MODE) {
                            if (imjcart.logic.value.Const.IS_SHADOW_ENABLED) {
                                this._light.spotLight.shadowCameraVisible = true;
                            } else {
                                this._light.light.shadowCameraVisible = true;
                            }
                            this._axis = new THREE.AxisHelper(1000);
                            this._axis.position.set(0, 0, 0);
                            this._scene.add(this._axis);
                            this._controls = new THREE.OrbitControls(this._camera.camera);
                        }
                    }
                    View3d.prototype._completeOpen = function () {
                        var _this = this;
                        this._render();
                        setInterval(function () {
                            // ゴーストカー更新
                            var i = 0, max;
                            for (i = 0, max = _this._ghostCarArr.length; i < max; i = i + 1) {
                                var ghost = _this._ghostCarArr[i];
                                ghost.update();
                            }
                        }, 1000 / imjcart.logic.value.Const.FPS);
                    };

                    View3d.prototype._render = function () {
                        var _this = this;
                        window.requestAnimationFrame(function () {
                            _this._render();
                        });

                        // カメラ更新
                        this._camera.update();

                        // レンダリング
                        this._renderer.render(this._scene, this._camera.camera);

                        // スポットライト更新
                        if (imjcart.logic.value.Const.IS_SHADOW_ENABLED) {
                            this._light.update();
                        }

                        // デバッグモード
                        if (imjcart.logic.value.Const.IS_VIEW3D_DEBUG_MODE && this._controls) {
                            this._controls.update();
                        }
                    };

                    View3d.prototype.open = function () {
                        this._displayImpl.open(0);
                    };

                    View3d.prototype.close = function () {
                        this._displayImpl.close(0);
                    };

                    View3d.prototype.onResize = function (width, height) {
                        if (width < imjcart.logic.value.Const.STAGE_WIDTH)
                            width = imjcart.logic.value.Const.STAGE_WIDTH;
                        if (height < imjcart.logic.value.Const.STAGE_HEIGHT)
                            height = imjcart.logic.value.Const.STAGE_HEIGHT;
                        this.$target.css({
                            width: width,
                            height: height - imjcart.logic.value.Const.FOOTER_HEIGHT - imjcart.logic.value.Const.RANKING_HEIGHT
                        });
                        this._renderer.setSize(width, height - imjcart.logic.value.Const.FOOTER_HEIGHT - imjcart.logic.value.Const.RANKING_HEIGHT);
                    };

                    // 車の姿勢更新
                    View3d.prototype.updateCarPosture = function () {
                        var values = imjcart.logic.value.GlobalValue.getInstance();
                        this._carX = values.carInfo.x * imjcart.logic.map.value.MapConst.MAP_SCALE;
                        this._carZ = values.carInfo.y * imjcart.logic.map.value.MapConst.MAP_SCALE;
                        this._carBodyAngle = -values.carInfo.bodyAngle + imjcart.logic.utility.Util.getAngleByRotation(180);
                        this._carWheelAngle = values.carInfo.wheelAngle + imjcart.logic.utility.Util.getAngleByRotation(90);
                        this._carSpeed = values.carInfo.speed;

                        // 車姿勢変更
                        this._car.setPosture(this._carX, this._carZ, this._carBodyAngle, this._carWheelAngle, this._carSpeed);

                        // 車姿勢変更
                        this._camera.setCarPosture(this._carX, this._carZ, this._carBodyAngle);

                        // アイコン
                        this._icon.setPosture(this._carX, this._carZ, this._carBodyAngle);

                        // スポットライト
                        if (imjcart.logic.value.Const.IS_SHADOW_ENABLED) {
                            this._light.setCarPosition(this._carX, this._carZ);
                        }
                    };

                    // 他の車追加
                    View3d.prototype.addOtherCar = function (id) {
                        var otherCar = new view3d.OtherCar(this._scene, id);
                        this._otherCarArr.push(otherCar);
                    };

                    // 他の車削除
                    View3d.prototype.removeOtherCar = function (id) {
                        var arr = [];
                        var i = 0, max;
                        for (i = 0, max = this._otherCarArr.length; i < max; i = i + 1) {
                            var otherCar = this._otherCarArr[i];
                            if (id != otherCar.id) {
                                arr.push(otherCar);
                            } else {
                                otherCar.remove();
                            }
                        }
                        this._otherCarArr = arr;
                    };

                    // 他の車の姿勢更新
                    View3d.prototype.updateOtherCarPosture = function () {
                        var values = imjcart.logic.value.GlobalValue.getInstance();
                        var i = 0, max;
                        for (i = 0, max = values.otherCarInfoArr.length; i < max; i = i + 1) {
                            var info = values.otherCarInfoArr[i];
                            var j = 0, max2;
                            for (j = 0, max2 = this._otherCarArr.length; j < max2; j = j + 1) {
                                var otherCar = this._otherCarArr[j];
                                if (otherCar.id == info.id) {
                                    var x = info.x * imjcart.logic.map.value.MapConst.MAP_SCALE;
                                    var y = info.y * imjcart.logic.map.value.MapConst.MAP_SCALE;
                                    var bodyAngle = -info.bodyAngle + imjcart.logic.utility.Util.getAngleByRotation(180);
                                    var wheelAngle = info.wheelAngle + imjcart.logic.utility.Util.getAngleByRotation(90);
                                    var speed = info.speed;
                                    otherCar.setPosture(x, y, bodyAngle, wheelAngle, speed);
                                    break;
                                }
                            }
                        }
                    };

                    // シーン変更
                    View3d.prototype.changeScene = function () {
                        this._changeCameraMode();

                        //
                        var values = imjcart.logic.value.GlobalValue.getInstance();
                        switch (values.currentSceneId) {
                            case imjcart.logic.value.Const.ID_SCENE_TIMEATACK:
                                // 車生成
                                this._car.createBody({
                                    body: values.colorBody,
                                    wing: values.colorWing,
                                    driverHead: values.colorDriver,
                                    driverBody: values.colorDriver
                                });
                                break;
                        }
                    };

                    // タイムアタックシーン変更
                    View3d.prototype.changeTimeAtackScene = function () {
                        this._changeCameraMode();
                    };

                    View3d.prototype._changeCameraMode = function () {
                        var values = imjcart.logic.value.GlobalValue.getInstance();
                        switch (values.currentSceneId) {
                            case imjcart.logic.value.Const.ID_SCENE_OPENING:
                                // カメラモード設定
                                this._camera.mode = view3d.value.View3dConst.CAMERA_MODE_OPENING;
                                this._icon.mode = view3d.value.View3dConst.CAMERA_MODE_OPENING;
                                this._light.mode = view3d.value.View3dConst.CAMERA_MODE_OPENING;
                                break;
                            case imjcart.logic.value.Const.ID_SCENE_TIMEATACK:
                                switch (values.currentTimeAtackSceneId) {
                                    case imjcart.logic.value.Const.ID_SCENE_TIMEATACK_RUN:
                                        // カメラモード設定
                                        this._camera.mode = view3d.value.View3dConst.CAMERA_MODE_TIMEATACK_RUN;
                                        this._icon.mode = view3d.value.View3dConst.CAMERA_MODE_TIMEATACK_RUN;
                                        this._light.mode = view3d.value.View3dConst.CAMERA_MODE_TIMEATACK_RUN;
                                        break;
                                }
                                break;
                        }
                    };

                    // カメラアングル変更
                    View3d.prototype.changeCameraAngle = function () {
                        switch (this._cameraAngle) {
                            case view3d.value.View3dConst.CAMERA_ANGLE_TOP:
                                this._cameraAngle = view3d.value.View3dConst.CAMERA_ANGLE_BACK;
                                this._car.showDriver();
                                break;
                            case view3d.value.View3dConst.CAMERA_ANGLE_BACK:
                                this._cameraAngle = view3d.value.View3dConst.CAMERA_ANGLE_INSIDE;
                                this._car.hideDriver();
                                break;
                            case view3d.value.View3dConst.CAMERA_ANGLE_INSIDE:
                                this._cameraAngle = view3d.value.View3dConst.CAMERA_ANGLE_TOP;
                                this._car.showDriver();
                                break;
                        }
                        this._camera.angle = this._cameraAngle;
                        this._icon.angle = this._cameraAngle;
                    };

                    // ゴーストカー設置
                    View3d.prototype.setGhostCars = function () {
                        if (1 <= this._ghostCarArr.length)
                            return;
                        var infoArr = [];
                        var values = imjcart.logic.value.GlobalValue.getInstance();
                        var i = 0, max;
                        for (i = 0, max = values.lapTimeInfoArr.length; i < max; i = i + 1) {
                            var info = values.lapTimeInfoArr[i];
                            if (info.runningPath && info.runningPath.collection.length) {
                                infoArr.push(info);
                            }
                        }
                        infoArr = imjcart.logic.utility.Util.shuffle(infoArr);
                        for (i = 0, max = imjcart.logic.value.Const.MAX_GHOST_COUNT; i < max; i = i + 1) {
                            var ghostCar = new imjcart.display.main.view3d.GhostCar(this._scene, infoArr[i], i * (1800 / imjcart.logic.value.Const.MAX_GHOST_COUNT));
                            this._ghostCarArr.push(ghostCar);
                        }
                    };
                    return View3d;
                })(lib.base.BaseDisplay);
                view3d.View3d = View3d;
            })(main.view3d || (main.view3d = {}));
            var view3d = main.view3d;
        })(display.main || (display.main = {}));
        var main = display.main;
    })(imjcart.display || (imjcart.display = {}));
    var display = imjcart.display;
})(imjcart || (imjcart = {}));
