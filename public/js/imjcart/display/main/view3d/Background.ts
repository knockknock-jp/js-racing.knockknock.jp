/// <reference path="../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../lib/three.d.ts"/>
/// <reference path="../../../../lib/lib.ts"/>
/// <reference path="../../../../imjcart/logic/map/value/MapConst.ts"/>
/// <reference path="../../../../imjcart/logic/utility/Util.ts"/>

module imjcart.display.main.view3d {

    export class Background extends lib.event.EventDispacher {

        private _scene:THREE.Scene = null;
        private _field:THREE.Mesh = null;
        private _sky:THREE.Mesh = null;

        constructor(scene:THREE.Scene) {
            super();
            this._scene = scene;
            //
            this._createField();
            this._createSky();
        }

        private _createField() {
            var geometry = new THREE.CircleGeometry(2500, 30);
            var texture = THREE.ImageUtils.loadTexture("img/field.jpg");
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(500, 500);
            var material = new THREE.MeshBasicMaterial({map: texture});
            this._field = new THREE.Mesh(geometry, material);
            this._field.position.set(imjcart.logic.map.value.MapConst.MAP_CENTER_X, 0, imjcart.logic.map.value.MapConst.MAP_CENTER_Z);
            this._field.rotation.x = imjcart.logic.utility.Util.getAngleByRotation(-90);
            this._scene.add(this._field);
        }

        private _createSky() {
            var geometry = new THREE.CylinderGeometry(2500, 2500, 750, 30, 1, true);
            var texture = THREE.ImageUtils.loadTexture("img/sky.jpg");
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(5, 1);
            var material = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide});
            this._sky = new THREE.Mesh(geometry, material);
            this._sky.position.set(imjcart.logic.map.value.MapConst.MAP_CENTER_X, 375, imjcart.logic.map.value.MapConst.MAP_CENTER_Z);
            this._scene.add(this._sky);
        }

    }

}