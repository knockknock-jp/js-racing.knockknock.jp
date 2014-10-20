/// <reference path="../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../lib/three.d.ts"/>
/// <reference path="../../../../lib/lib.ts"/>
/// <reference path="../../../../imjcart/logic/utility/Util.ts"/>
/// <reference path="../../../../imjcart/logic/value/Const.ts"/>

module imjcart.display.main.view3d {

    export class OtherCar extends lib.event.EventDispacher {

        private _scene:THREE.Scene = null;
        private _id:string = null;
        private _group:THREE.Object3D = null;
        private _body:THREE.Mesh = null;
        private _handle:THREE.Mesh = null;
        private _driver:THREE.Mesh = null;
        private _wheelFL:THREE.Mesh = null;
        private _wheelFR:THREE.Mesh = null;
        private _wheelBL:THREE.Mesh = null;
        private _wheelBR:THREE.Mesh = null;
        private _x:number = null;
        private _z:number = null;
        private _bodyAngle:number = null;
        private _wheelAngle:number = null;
        private _speed:number = null;
        private _lastX:number = null;
        private _lastZ:number = null;
        private _lastBodyAngle:number = null;
        private _lastWheelAngle:number = null;
        private _lastSpeed:number = null;
        private _subX:number = null;
        private _subZ:number = null;
        private _subBodyAngle:number = null;
        private _subWheelAngle:number = null;
        private _subSpeed:number = null;
        private _step:number = null;
        private _intervalId:number = null;

        constructor(scene:THREE.Scene, id:string) {
            super();
            this._scene = scene;
            this._id = id;
            this._createBody();
        }

        public get id():string {
            return this._id;
        }

        public remove() :void {
            this._scene.remove(this._group);
            this._body = null;
            this._wheelFL = null;
            this._wheelFR = null;
            this._wheelBL = null;
            this._wheelBR = null;
            this._group = null;
            if (this._intervalId) clearInterval(this._intervalId);
        }

        private _createBody() {
            var colorBody = null;
            var colorWing = null;
            var colorDriver = null;
            var values:imjcart.logic.value.GlobalValue = imjcart.logic.value.GlobalValue.getInstance();
            var i = 0, max;
            for (i = 0, max = values.otherCarInfoArr.length; i < max; i = i + 1) {
                var info:imjcart.logic.info.OtherCarInfo = values.otherCarInfoArr[i];
                if (info.id == this._id) {
                    colorBody = info.colorBody;
                    colorWing = info.colorWing;
                    colorDriver = info.colorDriver;
                    break;
                }
            }
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
            // 受け取った姿勢をフレームレートで配分
            this._intervalId = setInterval(() => {
                this._onSmoothPosture();
            }, 1000 / imjcart.logic.value.Const.FPS)
        }

        public get group():THREE.Object3D {
            return this._group;
        }

        // 姿勢設定
        public setPosture(x:number, z:number, bodyAngle:number, wheelAngle:number, speed:number):void {
            bodyAngle = bodyAngle - (((wheelAngle - imjcart.logic.utility.Util.getAngleByRotation(90)) * 0.2) * speed);
            wheelAngle = -wheelAngle + imjcart.logic.utility.Util.getAngleByRotation(90);
            // 初回
            if (this._x == null || this._z == null || this._bodyAngle == null || this._wheelAngle == null) {
                this._x = x;
                this._z = z;
                this._bodyAngle = bodyAngle;
                this._wheelAngle = wheelAngle;
                this._speed = speed;
            }
            //
            this._lastX = this._x;
            this._lastZ = this._z;
            this._lastBodyAngle = this._bodyAngle;
            this._lastWheelAngle = this._wheelAngle;
            this._lastSpeed = this._speed;
            this._x = x;
            this._z = z;
            this._bodyAngle = bodyAngle;
            this._wheelAngle = wheelAngle;
            this._speed = speed;
            // 差分抽出
            this._subX = x - this._lastX;
            this._subZ = z - this._lastZ;
            this._subBodyAngle = bodyAngle - this._lastBodyAngle;
            this._subWheelAngle = wheelAngle - this._lastWheelAngle;
            this._subSpeed = speed - this._lastSpeed;
            //
            this._step = 0;
        }

        // 姿勢更新
        private _onSmoothPosture() {
            var parcent = (imjcart.logic.value.Const.SOCKET_EMIT_OTHER_CARS_CONDITION_FPS / imjcart.logic.value.Const.FPS) * this._step;
            this._step = this._step + 1;
            //
            if (this._group) {
                this._group.position.x = this._lastX + (this._subX * parcent);
                this._group.position.z = this._lastZ + (this._subZ * parcent);
                this._group.rotation.y = this._lastBodyAngle + (this._subBodyAngle * parcent);
            }
            if (this._wheelFL && this._wheelFR) {
                this._wheelFL.rotation.y = this._lastWheelAngle + (this._subWheelAngle * parcent);
                this._wheelFR.rotation.y = this._lastWheelAngle + (this._subWheelAngle * parcent);
            }
            if (this._body) {
                // ボディの振動
                this._body.position.y = (Math.random() * 0.005 * (this._lastSpeed + (this._subSpeed * parcent)));
            }
        }

    }

}