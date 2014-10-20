/// <reference path="../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../lib/three.d.ts"/>
/// <reference path="../../../../lib/lib.ts"/>
/// <reference path="../../../../imjcart/logic/map/value/MapConst.ts"/>
/// <reference path="../../../../imjcart/logic/value/Const.ts"/>
/// <reference path="../../../../imjcart/display/main/view3d/value/View3dConst.ts"/>
/// <reference path="../../../../imjcart/logic/utility/Util.ts"/>

module imjcart.display.main.view3d {

    export class Camera extends lib.event.EventDispacher {

        private _scene:THREE.Scene = null;
        private _camera:THREE.PerspectiveCamera = null;
        private _angle:string = value.View3dConst.CAMERA_ANGLE_DEFAULT;
        private _mode:string = null;
        //
        private _carX:number = null;
        private _carZ:number = null;
        private _carBodyAngle:number = null;
        private _rotationCount:number = 0;
        private _isStarted:boolean = false;
        private _isStarted2:boolean = false;

        constructor(scene:THREE.Scene) {
            super();
            this._scene = scene;
            //
            var fov = 45; // 視野角
            var aspect = window.innerWidth / (window.innerHeight - imjcart.logic.value.Const.FOOTER_HEIGHT - imjcart.logic.value.Const.RANKING_HEIGHT);	// 描画範囲の縦横比
            var near = 1; // 視点からどれだけ離れた位置から表示するか
            var far = 20000; // 視点からどれだけ離れた位置まで表示するか
            this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
            this._camera.position.x = imjcart.logic.map.value.MapConst.MAP_CENTER_X;
            this._camera.position.y = 200;
            this._camera.position.z = imjcart.logic.map.value.MapConst.MAP_CENTER_Z;
            this._camera.lookAt(new THREE.Vector3(0, 0, 0));
            this._scene.add(this._camera);
        }

        public get camera():THREE.PerspectiveCamera {
            return this._camera;
        }

        // カメラモード
        public set mode(value:string) {
            this._mode = value;
        }

        // カメラアングル
        public set angle(value:string) {
            this._angle = value;
        }

        // 車姿勢変更
        public setCarPosture(x:number, z:number, bodyAngle:number):void {
            this._carX = x;
            this._carZ = z;
            this._carBodyAngle = bodyAngle;
        }

        // 更新
        public update():void {
            if (imjcart.logic.value.Const.IS_VIEW3D_DEBUG_MODE) return;
            switch (this._mode) {
                case value.View3dConst.CAMERA_MODE_OPENING:
                    this._setOpeningMode();
                    break;
                case value.View3dConst.CAMERA_MODE_TIMEATACK_RUN:
                    if (!this._isStarted) {
                        this._startTimeAtackRunMode();
                    } else {
                        this._setTimeAtackRunMode();
                    }
                    break;
            }
        }

        private _setOpeningMode() {
            this._camera.position.x = imjcart.logic.map.value.MapConst.MAP_CENTER_X + (400 * Math.sin(this._rotationCount));
            this._camera.position.y = 300;
            this._camera.position.z = imjcart.logic.map.value.MapConst.MAP_CENTER_Z + (400 * Math.cos(this._rotationCount));
            this._camera.lookAt(new THREE.Vector3(imjcart.logic.map.value.MapConst.MAP_CENTER_X, 0, imjcart.logic.map.value.MapConst.MAP_CENTER_Z));
            this._rotationCount += imjcart.logic.value.Const.FPS / 1000 / imjcart.logic.value.Const.FPS;
        }

        private _startTimeAtackRunMode() {
            if (!this._carX || !this._carZ || !this._carBodyAngle) return;
            if (this._isStarted2) return;
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
                complete: () => {
                    this._isStarted = true;
                },
                progress: () => {
                    this._camera.lookAt(new THREE.Vector3(this._carX, 7, this._carZ));
                }
            });
        }

        private _setTimeAtackRunMode() {
            if (this._angle == value.View3dConst.CAMERA_ANGLE_TOP) {
                this._camera.position.x = this._carX - (70 * Math.sin(this._carBodyAngle));
                this._camera.position.y = 150;
                this._camera.position.z = this._carZ - (70 * Math.cos(this._carBodyAngle));
                this._camera.lookAt(new THREE.Vector3(this._carX, 75, this._carZ));
            } else if (this._angle == value.View3dConst.CAMERA_ANGLE_INSIDE) {
                this._camera.position.x = this._carX - (3.9 * Math.sin(this._carBodyAngle));
                this._camera.position.y = 3.4;
                this._camera.position.z = this._carZ - (3.9 * Math.cos(this._carBodyAngle));
                this._camera.rotation.y = this._carBodyAngle - imjcart.logic.utility.Util.getAngleByRotation(180);
                this._camera.rotation.x = 0;
                this._camera.rotation.z = 0;
            } else if (this._angle == value.View3dConst.CAMERA_ANGLE_BACK) {
                this._camera.position.x = this._carX - (23 * Math.sin(this._carBodyAngle));
                this._camera.position.y = 14;
                this._camera.position.z = this._carZ - (23 * Math.cos(this._carBodyAngle));
                this._camera.lookAt(new THREE.Vector3(this._carX, 7, this._carZ));
            }
        }

    }

}