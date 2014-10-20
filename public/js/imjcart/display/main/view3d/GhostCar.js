/// <reference path="../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../lib/three.d.ts"/>
/// <reference path="../../../../lib/lib.ts"/>
/// <reference path="../../../../imjcart/logic/utility/Util.ts"/>
/// <reference path="../../../../imjcart/logic/value/Const.ts"/>
/// <reference path="../../../../imjcart/logic/value/GlobalValue.ts"/>
/// <reference path="../../../../imjcart/logic/info/LapTimeInfo.ts"/>
/// <reference path="../../../../imjcart/logic/info/RunningPath.ts"/>
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
                var GhostCar = (function (_super) {
                    __extends(GhostCar, _super);
                    function GhostCar(scene, info, currentIndex) {
                        if (typeof currentIndex === "undefined") { currentIndex = 0; }
                        _super.call(this);
                        this._scene = null;
                        this._info = null;
                        this._runningPath = null;
                        this._group = null;
                        this._body = null;
                        this._handle = null;
                        this._driver = null;
                        this._wheelFL = null;
                        this._wheelFR = null;
                        this._wheelBL = null;
                        this._wheelBR = null;
                        this._scene = scene;
                        this._info = info;
                        this._runningPath = this._info.runningPath;
                        this._runningPath.currentIndex = currentIndex;
                        this._createBody();
                    }
                    Object.defineProperty(GhostCar.prototype, "id", {
                        get: function () {
                            return this._info.id;
                        },
                        enumerable: true,
                        configurable: true
                    });

                    GhostCar.prototype.remove = function () {
                        this._scene.remove(this._group);
                        this._body = null;
                        this._wheelFL = null;
                        this._wheelFR = null;
                        this._wheelBL = null;
                        this._wheelBR = null;
                        this._group = null;
                    };

                    GhostCar.prototype._createBody = function () {
                        var _this = this;
                        var colorBody = this._info.colorBody;
                        var colorWing = this._info.colorWing;
                        var colorDriver = this._info.colorDriver;

                        // 車
                        this._group = new THREE.Object3D();
                        this._group.position.set(0, 0.5, 0);
                        this._scene.add(this._group);

                        // ボディ
                        var loader = new THREE.OBJMTLLoader();
                        loader.load("models/car03/car03.obj", "models/car03/car03.mtl", function (object) {
                            object.traverse(function (child) {
                                if (child instanceof THREE.Mesh) {
                                    switch (child.material.name) {
                                        case "Body":
                                            child.material.ambient = new THREE.Color(colorBody);
                                            child.material.color = new THREE.Color(colorBody);
                                            break;
                                        case "Wing":
                                            child.material.ambient = new THREE.Color(colorWing);
                                            child.material.color = new THREE.Color(colorWing);
                                            break;
                                        case "Chassis":
                                            child.material.ambient = new THREE.Color(0x111111);
                                            child.material.color = new THREE.Color(0x111111);
                                            break;
                                        case "Handle":
                                            child.material.ambient = new THREE.Color(0x333333);
                                            child.material.color = new THREE.Color(0x333333);
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
                                            child.material.ambient = new THREE.Color(colorDriver);
                                            child.material.color = new THREE.Color(colorDriver);
                                            break;
                                        case "DriverBody":
                                            child.material.ambient = new THREE.Color(colorDriver);
                                            child.material.color = new THREE.Color(colorDriver);
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

                    Object.defineProperty(GhostCar.prototype, "group", {
                        get: function () {
                            return this._group;
                        },
                        enumerable: true,
                        configurable: true
                    });

                    GhostCar.prototype.update = function () {
                        var path = this._runningPath.currentPath;
                        if (this._group) {
                            this._group.position.x = path.x * imjcart.logic.map.value.MapConst.MAP_SCALE;
                            this._group.position.z = path.y * imjcart.logic.map.value.MapConst.MAP_SCALE;
                            this._group.rotation.y = -path.bodyAngle + imjcart.logic.utility.Util.getAngleByRotation(180);
                        }
                    };
                    return GhostCar;
                })(lib.event.EventDispacher);
                view3d.GhostCar = GhostCar;
            })(main.view3d || (main.view3d = {}));
            var view3d = main.view3d;
        })(display.main || (display.main = {}));
        var main = display.main;
    })(imjcart.display || (imjcart.display = {}));
    var display = imjcart.display;
})(imjcart || (imjcart = {}));
