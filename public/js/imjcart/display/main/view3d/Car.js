/// <reference path="../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../lib/three.d.ts"/>
/// <reference path="../../../../lib/lib.ts"/>
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
                var Car = (function (_super) {
                    __extends(Car, _super);
                    function Car(scene) {
                        _super.call(this);
                        this._scene = null;
                        this._group = null;
                        this._body = null;
                        this._handle = null;
                        this._driver = null;
                        this._wheelFL = null;
                        this._wheelFR = null;
                        this._wheelBL = null;
                        this._wheelBR = null;
                        this._isShowDriver = true;
                        this._scene = scene;
                    }
                    Car.prototype.createBody = function (colors) {
                        var _this = this;
                        var bodyColor = colors.body || 0x990000;
                        var windColor = colors.wing || 0xFFFFFF;
                        var driverHeadColor = colors.driverHead || 0xFFCC00;
                        var driverBodyColor = colors.driverBody || 0xFFFFFF;

                        // 車
                        this._group = new THREE.Object3D();
                        this._group.position.set(0, 0.3, 0);
                        this._scene.add(this._group);

                        // ボディ
                        var loader = new THREE.OBJMTLLoader();

                        //loader.load("models/car02/car02.obj", "models/car02/car02.mtl", (object) => {
                        loader.load("models/car03/car03.obj", "models/car03/car03.mtl", function (object) {
                            object.traverse(function (child) {
                                if (child instanceof THREE.Mesh) {
                                    switch (child.material.name) {
                                        case "Body":
                                            child.material.ambient = new THREE.Color(bodyColor);
                                            child.material.color = new THREE.Color(bodyColor);
                                            break;
                                        case "Wing":
                                            child.material.ambient = new THREE.Color(windColor);
                                            child.material.color = new THREE.Color(windColor);
                                            break;
                                        case "Chassis":
                                            child.material.ambient = new THREE.Color(0x111111);
                                            child.material.color = new THREE.Color(0x111111);
                                            break;
                                        default:
                                            child.material.ambient = new THREE.Color(imjcart.display.main.view3d.value.View3dConst.AMBIENT_COLOR);
                                            break;
                                    }
                                    child.material.side = THREE.DoubleSide;
                                    child.material.specular = 0xffffff;
                                    child.material.shininess = 200;
                                    child.material.metal = true;

                                    //child.material = new THREE.MeshLambertMaterial(child.material);
                                    child.material = new THREE.MeshPhongMaterial(child.material);
                                    if (imjcart.logic.value.Const.IS_SHADOW_ENABLED) {
                                        child.castShadow = true;
                                    }
                                }
                            });
                            _this._body = object;
                            _this._group.add(_this._body);
                        });

                        // ドライバー
                        var loader = new THREE.OBJMTLLoader();
                        loader.load("models/car02/driver01.obj", "models/car02/driver01.mtl", function (object) {
                            object.traverse(function (child) {
                                if (child instanceof THREE.Mesh) {
                                    switch (child.material.name) {
                                        case "DriverHead":
                                            child.material.ambient = new THREE.Color(driverHeadColor);
                                            child.material.color = new THREE.Color(driverHeadColor);
                                            break;
                                        case "DriverBody":
                                            child.material.ambient = new THREE.Color(driverBodyColor);
                                            child.material.color = new THREE.Color(driverBodyColor);
                                            break;
                                        default:
                                            child.material.ambient = new THREE.Color(imjcart.display.main.view3d.value.View3dConst.AMBIENT_COLOR);
                                            break;
                                    }
                                    child.material.side = THREE.DoubleSide;
                                    child.material = new THREE.MeshLambertMaterial(child.material);
                                }
                            });
                            _this._driver = object;
                            _this._group.add(_this._driver);
                        });

                        // ハンドル
                        var loader = new THREE.OBJMTLLoader();
                        loader.load("models/car02/handle01.obj", "models/car02/handle01.mtl", function (object) {
                            object.traverse(function (child) {
                                if (child instanceof THREE.Mesh) {
                                    switch (child.material.name) {
                                        case "Body":
                                            child.material.ambient = new THREE.Color(0x333333);
                                            child.material.color = new THREE.Color(0x333333);
                                            break;
                                        case "Screen":
                                            child.material.ambient = new THREE.Color(0x339999);
                                            child.material.color = new THREE.Color(0x339999);
                                            break;
                                        case "ButtonR":
                                            child.material.ambient = new THREE.Color(0xFF0000);
                                            child.material.color = new THREE.Color(0xFF0000);
                                            break;
                                        case "ButtonB":
                                            child.material.ambient = new THREE.Color(0x0000FF);
                                            child.material.color = new THREE.Color(0x0000FF);
                                            break;
                                        case "ButtonY":
                                            child.material.ambient = new THREE.Color(0xFFCC00);
                                            child.material.color = new THREE.Color(0xFFCC00);
                                            break;
                                        default:
                                            child.material.ambient = new THREE.Color(imjcart.display.main.view3d.value.View3dConst.AMBIENT_COLOR);
                                            break;
                                    }
                                    child.material.side = THREE.DoubleSide;
                                    child.material = new THREE.MeshLambertMaterial(child.material);
                                }
                            });
                            _this._handle = object;
                            _this._handle.position.set(0, 2, -1.3);
                            _this._group.add(_this._handle);
                        });

                        // タイヤ
                        loader = new THREE.OBJMTLLoader();
                        loader.load("models/wheel01/wheel01.obj", "models/wheel01/wheel01.mtl", function (object) {
                            object.traverse(function (child) {
                                if (child instanceof THREE.Mesh) {
                                    switch (child.material.name) {
                                        case "Wheel":
                                            child.material.ambient = new THREE.Color(0x333333);
                                            child.material.color = new THREE.Color(0x333333);
                                            break;
                                        case "Tire":
                                            child.material.ambient = new THREE.Color(0x000000);
                                            child.material.color = new THREE.Color(0x000000);
                                            break;
                                        default:
                                            child.material.ambient = new THREE.Color(imjcart.display.main.view3d.value.View3dConst.AMBIENT_COLOR);
                                            break;
                                    }
                                    child.material.side = THREE.DoubleSide;
                                    child.material = new THREE.MeshLambertMaterial(child.material);
                                    if (imjcart.logic.value.Const.IS_SHADOW_ENABLED) {
                                        child.castShadow = true;
                                    }
                                }
                            });
                            _this._wheelFL = object.clone();
                            _this._wheelFL.position.set(2.6, 1, 3.5);
                            _this._group.add(_this._wheelFL);

                            //
                            _this._wheelFR = object.clone();
                            _this._wheelFR.position.set(-2.6, 1, 3.5);
                            _this._group.add(_this._wheelFR);

                            //
                            _this._wheelBL = object.clone();
                            _this._wheelBL.position.set(2.6, 1, -7);
                            _this._group.add(_this._wheelBL);

                            //
                            _this._wheelBR = object.clone();
                            _this._wheelBR.position.set(-2.6, 1, -7);
                            _this._group.add(_this._wheelBR);
                        });
                    };

                    Object.defineProperty(Car.prototype, "group", {
                        get: function () {
                            return this._group;
                        },
                        enumerable: true,
                        configurable: true
                    });

                    // 姿勢設定
                    Car.prototype.setPosture = function (x, z, bodyAngle, wheelAngle, speed) {
                        if (!this._group)
                            return;
                        this._group.position.x = x;
                        this._group.position.z = z;
                        this._group.rotation.y = bodyAngle - (((wheelAngle - imjcart.logic.utility.Util.getAngleByRotation(90)) * 0.2) * speed);
                        if (this._wheelFL && this._wheelFL.rotation)
                            this._wheelFL.rotation.y = -wheelAngle + imjcart.logic.utility.Util.getAngleByRotation(90);
                        if (this._wheelFR && this._wheelFR.rotation)
                            this._wheelFR.rotation.y = -wheelAngle + imjcart.logic.utility.Util.getAngleByRotation(90);
                        this._handle.rotation.x = imjcart.logic.utility.Util.getAngleByRotation(180);
                        this._handle.rotation.z = -wheelAngle + imjcart.logic.utility.Util.getAngleByRotation(-90);

                        // ボディの振動
                        this._body.position.y = (Math.random() * 0.005 * speed);
                    };

                    // ドライバー表示
                    Car.prototype.showDriver = function () {
                        if (!this._group)
                            return;
                        if (this._isShowDriver)
                            return;
                        this._isShowDriver = true;
                        this._group.add(this._driver);
                    };

                    // ドライバー非表示
                    Car.prototype.hideDriver = function () {
                        if (!this._group)
                            return;
                        if (!this._isShowDriver)
                            return;
                        this._isShowDriver = false;
                        this._group.remove(this._driver);
                    };
                    return Car;
                })(lib.event.EventDispacher);
                view3d.Car = Car;
            })(main.view3d || (main.view3d = {}));
            var view3d = main.view3d;
        })(display.main || (display.main = {}));
        var main = display.main;
    })(imjcart.display || (imjcart.display = {}));
    var display = imjcart.display;
})(imjcart || (imjcart = {}));
