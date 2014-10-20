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

module imjcart.display.main.view3d {

    export class View3d extends lib.base.BaseDisplay implements lib.display.IDisplay, lib.responisive.IResize {

        private _displayImpl:lib.display.IDisplay = null;
        private _scene:THREE.Scene = null;
        private _renderer:THREE.WebGLRenderer = null;
        private _axis:THREE.AxisHelper = null;
        private _controls:any = null;
        //
        private _light:Light = null;
        private _camera:Camera = null;
        private _background:Background = null;
        private _cource:Cource = null;
        private _car:Car = null;
        private _icon:Icon = null;
        private _otherCarArr:OtherCar[] = [];
        //
        private _carX:number = null;
        private _carZ:number = null;
        private _carBodyAngle:number = null;
        private _carWheelAngle:number = null;
        private _carSpeed:number = null;
        private _cameraAngle:string = value.View3dConst.CAMERA_ANGLE_DEFAULT;
        //
        private _ghostCarArr:imjcart.display.main.view3d.GhostCar[] = [];

        constructor(target:JQuery) {
            super(target);
            // シーン
            this._scene = new THREE.Scene();
            //this._scene.fog = new THREE.FogExp2(0xFFFFFF, 0.001);
            // 環境光
            var ambient = new THREE.AmbientLight(imjcart.display.main.view3d.value.View3dConst.AMBIENT_COLOR);
            this._scene.add(ambient);
            // レンダラ―
            //this._renderer = new THREE.WebGLRenderer();
            this._renderer = new THREE.WebGLRenderer({antialias: true});
            this._renderer.setSize(window.innerWidth, window.innerHeight - imjcart.logic.value.Const.FOOTER_HEIGHT - imjcart.logic.value.Const.RANKING_HEIGHT);
            this._renderer.setClearColor(0x2077ab, 1);
            if (imjcart.logic.value.Const.IS_SHADOW_ENABLED) {
                this._renderer.shadowMapEnabled = true;
            }
            this.$target.append(this._renderer.domElement);
            // ライト
            this._light = new Light(this._scene);
            // カメラ
            this._camera = new Camera(this._scene);
            // 背景
            this._background = new Background(this._scene);
            // コース
            this._cource = new Cource(this._scene);
            // 車
            this._car = new Car(this._scene);
            // アイコン
            this._icon = new Icon(this._scene);
            //
            this._displayImpl = new lib.display.SimpleDisplayImpl(this.$target);
            this._displayImpl.addEventListener(lib.event.Event.DISPLAY_START_OPEN_EVENT, () => {
                lib.responisive.ResizeManager.getInstance().addEventListener(this);
                lib.responisive.ResizeManager.getInstance().dispatchEvent(this);
            });
            this._displayImpl.addEventListener(lib.event.Event.DISPLAY_COMPLETE_OPEN_EVENT, () => {
                this._completeOpen();
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

        private _completeOpen() {
            this._render();
            setInterval(() => {
                // ゴーストカー更新
                var i = 0, max;
                for (i = 0, max = this._ghostCarArr.length; i < max; i = i + 1) {
                    var ghost:imjcart.display.main.view3d.GhostCar = this._ghostCarArr[i];
                    ghost.update();
                }
            }, 1000 / imjcart.logic.value.Const.FPS)
        }

        private _render() {
            window.requestAnimationFrame(() => {
                this._render();
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
        }

        public open() {
            this._displayImpl.open(0);
        }

        public close() {
            this._displayImpl.close(0);
        }

        public onResize(width:number, height:number):void {
            if (width < imjcart.logic.value.Const.STAGE_WIDTH) width = imjcart.logic.value.Const.STAGE_WIDTH;
            if (height < imjcart.logic.value.Const.STAGE_HEIGHT) height = imjcart.logic.value.Const.STAGE_HEIGHT;
            this.$target.css({
                width: width,
                height: height - imjcart.logic.value.Const.FOOTER_HEIGHT - imjcart.logic.value.Const.RANKING_HEIGHT
            });
            this._renderer.setSize(width, height - imjcart.logic.value.Const.FOOTER_HEIGHT - imjcart.logic.value.Const.RANKING_HEIGHT);
        }

        // 車の姿勢更新
        public updateCarPosture():void {
            var values:imjcart.logic.value.GlobalValue = imjcart.logic.value.GlobalValue.getInstance();
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
        }

        // 他の車追加
        public addOtherCar(id:string):void {
            var otherCar:OtherCar = new OtherCar(this._scene, id);
            this._otherCarArr.push(otherCar);
        }

        // 他の車削除
        public removeOtherCar(id:string):void {
            var arr = [];
            var i = 0, max;
            for (i = 0, max = this._otherCarArr.length; i < max; i = i + 1) {
                var otherCar:OtherCar = this._otherCarArr[i];
                if (id != otherCar.id) {
                    arr.push(otherCar);
                } else {
                    otherCar.remove();
                }
            }
            this._otherCarArr = arr;
        }

        // 他の車の姿勢更新
        public updateOtherCarPosture():void {
            var values:imjcart.logic.value.GlobalValue = imjcart.logic.value.GlobalValue.getInstance();
            var i = 0, max;
            for (i = 0, max = values.otherCarInfoArr.length; i < max; i = i + 1) {
                var info:imjcart.logic.info.OtherCarInfo = values.otherCarInfoArr[i];
                var j = 0, max2;
                for (j = 0, max2 = this._otherCarArr.length; j < max2; j = j + 1) {
                    var otherCar:OtherCar = this._otherCarArr[j];
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
        }

        // シーン変更
        public changeScene():void {
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
        }

        // タイムアタックシーン変更
        public changeTimeAtackScene():void {
            this._changeCameraMode();
        }

        private _changeCameraMode():void {
            var values:imjcart.logic.value.GlobalValue = imjcart.logic.value.GlobalValue.getInstance();
            switch(values.currentSceneId) {
                case imjcart.logic.value.Const.ID_SCENE_OPENING:
                    // カメラモード設定
                    this._camera.mode = value.View3dConst.CAMERA_MODE_OPENING;
                    this._icon.mode = value.View3dConst.CAMERA_MODE_OPENING;
                    this._light.mode = value.View3dConst.CAMERA_MODE_OPENING;
                    break;
                case imjcart.logic.value.Const.ID_SCENE_TIMEATACK:
                    switch (values.currentTimeAtackSceneId) {
                        case imjcart.logic.value.Const.ID_SCENE_TIMEATACK_RUN:
                            // カメラモード設定
                            this._camera.mode = value.View3dConst.CAMERA_MODE_TIMEATACK_RUN;
                            this._icon.mode = value.View3dConst.CAMERA_MODE_TIMEATACK_RUN;
                            this._light.mode = value.View3dConst.CAMERA_MODE_TIMEATACK_RUN;
                            break;
                    }
                    break;
            }
        }

        // カメラアングル変更
        public changeCameraAngle():void {
            switch (this._cameraAngle) {
                case value.View3dConst.CAMERA_ANGLE_TOP:
                    this._cameraAngle = value.View3dConst.CAMERA_ANGLE_BACK;
                    this._car.showDriver();
                    break;
                case value.View3dConst.CAMERA_ANGLE_BACK:
                    this._cameraAngle = value.View3dConst.CAMERA_ANGLE_INSIDE;
                    this._car.hideDriver();
                    break;
                case value.View3dConst.CAMERA_ANGLE_INSIDE:
                    this._cameraAngle = value.View3dConst.CAMERA_ANGLE_TOP;
                    this._car.showDriver();
                    break;
            }
            this._camera.angle = this._cameraAngle;
            this._icon.angle = this._cameraAngle;
        }

        // ゴーストカー設置
        public setGhostCars():void {
            if (1 <= this._ghostCarArr.length) return;
            var infoArr = [];
            var values = imjcart.logic.value.GlobalValue.getInstance();
            var i = 0, max;
            for (i = 0, max = values.lapTimeInfoArr.length; i < max; i = i + 1) {
                var info:imjcart.logic.info.LapTimeInfo = values.lapTimeInfoArr[i];
                if (info.runningPath && info.runningPath.collection.length) {
                    infoArr.push(info);
                }
            }
            infoArr = imjcart.logic.utility.Util.shuffle(infoArr);
            for (i = 0, max = imjcart.logic.value.Const.MAX_GHOST_COUNT; i < max; i = i + 1) {
                var ghostCar:imjcart.display.main.view3d.GhostCar = new imjcart.display.main.view3d.GhostCar(this._scene, infoArr[i], i * (1800 / imjcart.logic.value.Const.MAX_GHOST_COUNT));
                this._ghostCarArr.push(ghostCar);
            }
        }

    }

}