/// <reference path="../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../lib/three.d.ts"/>
/// <reference path="../../../../lib/lib.ts"/>
/// <reference path="../../../../imjcart/logic/map/value/MapConst.ts"/>
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
                var Background = (function (_super) {
                    __extends(Background, _super);
                    function Background(scene) {
                        _super.call(this);
                        this._scene = null;
                        this._field = null;
                        this._sky = null;
                        this._scene = scene;

                        //
                        this._createField();
                        this._createSky();
                    }
                    Background.prototype._createField = function () {
                        var geometry = new THREE.CircleGeometry(2500, 30);
                        var texture = THREE.ImageUtils.loadTexture("img/field.jpg");
                        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                        texture.repeat.set(500, 500);
                        var material = new THREE.MeshBasicMaterial({ map: texture });
                        this._field = new THREE.Mesh(geometry, material);
                        this._field.position.set(imjcart.logic.map.value.MapConst.MAP_CENTER_X, 0, imjcart.logic.map.value.MapConst.MAP_CENTER_Z);
                        this._field.rotation.x = imjcart.logic.utility.Util.getAngleByRotation(-90);
                        this._scene.add(this._field);
                    };

                    Background.prototype._createSky = function () {
                        var geometry = new THREE.CylinderGeometry(2500, 2500, 750, 30, 1, true);
                        var texture = THREE.ImageUtils.loadTexture("img/sky.jpg");
                        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                        texture.repeat.set(5, 1);
                        var material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
                        this._sky = new THREE.Mesh(geometry, material);
                        this._sky.position.set(imjcart.logic.map.value.MapConst.MAP_CENTER_X, 375, imjcart.logic.map.value.MapConst.MAP_CENTER_Z);
                        this._scene.add(this._sky);
                    };
                    return Background;
                })(lib.event.EventDispacher);
                view3d.Background = Background;
            })(main.view3d || (main.view3d = {}));
            var view3d = main.view3d;
        })(display.main || (display.main = {}));
        var main = display.main;
    })(imjcart.display || (imjcart.display = {}));
    var display = imjcart.display;
})(imjcart || (imjcart = {}));
