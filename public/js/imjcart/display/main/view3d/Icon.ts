/// <reference path="../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../lib/three.d.ts"/>
/// <reference path="../../../../lib/lib.ts"/>
/// <reference path="../../../../imjcart/logic/map/value/MapConst.ts"/>
/// <reference path="../../../../imjcart/logic/utility/Util.ts"/>
/// <reference path="../../../../imjcart/display/main/view3d/value/View3dConst.ts"/>

module imjcart.display.main.view3d {

    export class Icon extends lib.event.EventDispacher {

        private _scene:THREE.Scene = null;
        private _icon:THREE.Mesh = null;
        private _angle:string = value.View3dConst.CAMERA_ANGLE_DEFAULT;
        private _mode:string = null;

        constructor(scene:THREE.Scene) {
            super();
            this._scene = scene;
            //
            //this._createIcon();
        }

        private _createIcon() {
            var geometry = new THREE.PlaneGeometry(2, 2);
            var texture = THREE.ImageUtils.loadTexture("img/icon.png");
            var material = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide, bumpScale: 0});
            this._icon = new THREE.Mesh(geometry, material);
            //this._scene.add(this._icon);
        }

        // カメラモード
        public set mode(value:string) {
            this._mode = value;
        }

        // カメラアングル
        public set angle(value:string) {
            this._angle = value;
        }

        // 姿勢変更
        public setPosture(x:number, z:number, bodyAngle:number):void {
            return;
            if (this._mode == value.View3dConst.CAMERA_MODE_TIMEATACK_RUN) {
                if (this._angle == value.View3dConst.CAMERA_ANGLE_TOP) {
                    this._icon.position.x = x + (39 * Math.sin(bodyAngle));
                    this._icon.position.y = 250;
                    this._icon.position.z = z + (39 * Math.cos(bodyAngle));
                    this._icon.rotation.x = imjcart.logic.utility.Util.getAngleByRotation(-90);
                    this._icon.rotation.y = 0;
                    this._icon.rotation.z = bodyAngle - imjcart.logic.utility.Util.getAngleByRotation(180);
                } else if (this._angle == value.View3dConst.CAMERA_ANGLE_BACK) {
                    this._icon.position.x = x;
                    this._icon.position.y = 5;
                    this._icon.position.z = z;
                    this._icon.rotation.y = bodyAngle - imjcart.logic.utility.Util.getAngleByRotation(180);
                    this._icon.rotation.x = 0;
                    this._icon.rotation.z = 0;
                }
            }
        }

    }

}