/// <reference path="../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../lib/three.d.ts"/>
/// <reference path="../../../../lib/lib.ts"/>

module imjcart.display.main.view3d {

    export class Light extends lib.event.EventDispacher {

        private _scene:THREE.Scene = null;
        private _light:THREE.DirectionalLight = null;
        private _spotLight:THREE.SpotLight = null;
        private _mode:string = null;
        private _carX:number = null;
        private _carZ:number = null;
        private _rotationCount:number = 0;

        constructor(scene:THREE.Scene) {
            super();
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

        public set mode(value:string) {
            this._mode = value;
        }

        public get light():THREE.DirectionalLight {
            return this._light;
        }

        public get spotLight():THREE.SpotLight {
            return this._spotLight;
        }

        // 更新
        public update():void {
            switch (this._mode) {
                case value.View3dConst.CAMERA_MODE_OPENING:
                    this._setOpeningMode();
                    break;
                case value.View3dConst.CAMERA_MODE_TIMEATACK_RUN:
                    this._setTimeAtackRunMode();
                    break;
            }
        }

        // 車位置変更
        public setCarPosition(x:number, z:number):void {
            this._carX = x;
            this._carZ = z;
        }

        private _setOpeningMode() {
            this._spotLight.target.position.set(imjcart.logic.map.value.MapConst.MAP_CENTER_X, 0, imjcart.logic.map.value.MapConst.MAP_CENTER_Z);
            this._spotLight.position.set(imjcart.logic.map.value.MapConst.MAP_CENTER_X + (400 * Math.sin(this._rotationCount)), 1500, imjcart.logic.map.value.MapConst.MAP_CENTER_Z + (400 * Math.cos(this._rotationCount)));
            this._rotationCount += imjcart.logic.value.Const.FPS / 1000 / imjcart.logic.value.Const.FPS;
        }

        private _setTimeAtackRunMode() {
            this._spotLight.position.set(imjcart.logic.map.value.MapConst.MAP_CENTER_X, 1000, imjcart.logic.map.value.MapConst.MAP_CENTER_Z);
            this._spotLight.target.position.set(this._carX, 0, this._carZ);
        }

    }

}