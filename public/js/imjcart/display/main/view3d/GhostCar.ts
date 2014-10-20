/// <reference path="../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../lib/three.d.ts"/>
/// <reference path="../../../../lib/lib.ts"/>
/// <reference path="../../../../imjcart/logic/utility/Util.ts"/>
/// <reference path="../../../../imjcart/logic/value/Const.ts"/>
/// <reference path="../../../../imjcart/logic/value/GlobalValue.ts"/>
/// <reference path="../../../../imjcart/logic/info/LapTimeInfo.ts"/>
/// <reference path="../../../../imjcart/logic/info/RunningPath.ts"/>

module imjcart.display.main.view3d {

    export class GhostCar extends lib.event.EventDispacher {

        private _scene:THREE.Scene = null;
        private _info:imjcart.logic.info.LapTimeInfo = null;
        private _runningPath:imjcart.logic.info.RunningPath = null;
        private _group:THREE.Object3D = null;
        private _body:THREE.Mesh = null;
        private _handle:THREE.Mesh = null;
        private _driver:THREE.Mesh = null;
        private _wheelFL:THREE.Mesh = null;
        private _wheelFR:THREE.Mesh = null;
        private _wheelBL:THREE.Mesh = null;
        private _wheelBR:THREE.Mesh = null;

        constructor(scene:THREE.Scene, info:imjcart.logic.info.LapTimeInfo, currentIndex:number = 0) {
            super();
            this._scene = scene;
            this._info = info;
            this._runningPath = this._info.runningPath;
            this._runningPath.currentIndex = currentIndex;
            this._createBody();
        }

        public get id():string {
            return this._info.id;
        }

        public remove() :void {
            this._scene.remove(this._group);
            this._body = null;
            this._wheelFL = null;
            this._wheelFR = null;
            this._wheelBL = null;
            this._wheelBR = null;
            this._group = null;
        }

        private _createBody() {
            var colorBody = this._info.colorBody;
            var colorWing = this._info.colorWing;
            var colorDriver = this._info.colorDriver;
            // 車
            this._group = new THREE.Object3D();
            this._group.position.set(0, 0.5, 0);
            this._scene.add(this._group);
            // ボディ
            var loader = new THREE.OBJMTLLoader();
            loader.load("models/car03/car03.obj", "models/car03/car03.mtl", (object) => {
                object.traverse(function (child) {
                    if (child instanceof THREE.Mesh) {
                        switch(child.material.name) {
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
                this._body = object;
                this._group.add(this._body);
            });
            // ドライバー
            var loader = new THREE.OBJMTLLoader();
            loader.load("models/car02/driver01.obj", "models/car02/driver01.mtl", (object) => {
                object.traverse(function (child) {
                    if (child instanceof THREE.Mesh) {
                        switch(child.material.name) {
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
                this._driver = object;
                this._group.add(this._driver);
            });
            // ハンドル
            var loader = new THREE.OBJMTLLoader();
            loader.load("models/car02/handle01.obj", "models/car02/handle01.mtl", (object) => {
                object.traverse(function (child) {
                    if (child instanceof THREE.Mesh) {
                        switch(child.material.name) {
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
                this._handle = object;
                this._handle.position.set(0, 2, -1.3);
                this._group.add(this._handle);
            });
            // タイヤ
            loader = new THREE.OBJMTLLoader();
            loader.load("models/wheel01/wheel01.obj", "models/wheel01/wheel01.mtl", (object) => {
                object.traverse(function (child) {
                    if (child instanceof THREE.Mesh) {
                        switch(child.material.name) {
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
                this._wheelFL = object.clone();
                this._wheelFL.position.set(2.6, 1, 3.5);
                this._group.add(this._wheelFL);
                //
                this._wheelFR = object.clone();
                this._wheelFR.position.set(-2.6, 1, 3.5);
                this._group.add(this._wheelFR);
                //
                this._wheelBL = object.clone();
                this._wheelBL.position.set(2.6, 1, -7);
                this._group.add(this._wheelBL);
                //
                this._wheelBR = object.clone();
                this._wheelBR.position.set(-2.6, 1, -7);
                this._group.add(this._wheelBR);
            });
        }

        public get group():THREE.Object3D {
            return this._group;
        }

        public update():void {
            var path = this._runningPath.currentPath;
            if (this._group) {
                this._group.position.x = path.x * imjcart.logic.map.value.MapConst.MAP_SCALE;
                this._group.position.z = path.y * imjcart.logic.map.value.MapConst.MAP_SCALE;
                this._group.rotation.y = -path.bodyAngle + imjcart.logic.utility.Util.getAngleByRotation(180);
            }
        }

    }

}