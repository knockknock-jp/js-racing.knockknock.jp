/// <reference path="../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../lib/three.d.ts"/>
/// <reference path="../../../../lib/lib.ts"/>
/// <reference path="../../../../imjcart/logic/map/value/MapConst.ts"/>
/// <reference path="../../../../imjcart/logic/utility/Util.ts"/>

module imjcart.display.main.view3d {

    export class Cource extends lib.event.EventDispacher {

        private _scene:THREE.Scene = null;
        private _startline:THREE.Mesh = null;
        private _carLine:THREE.Mesh = null;
        private _base:THREE.Mesh = null;
        private _grass:THREE.Mesh = null;
        private _grassLT:THREE.Mesh = null;
        private _grassLB:THREE.Mesh = null;
        private _grassRT:THREE.Mesh = null;
        private _grassRB:THREE.Mesh = null;
        private _sand:THREE.Mesh = null;
        private _tree:THREE.Mesh = null;
        private _tire:THREE.Mesh = null;
        private _wall:THREE.Mesh = null;
        private _block:THREE.Mesh = null;
        private _map:any = null;
        private _sandMap:any = null;
        private _grassMap:any = null;
        private _roadMap:any = null;
        private _goal:THREE.Mesh = null;

        constructor(scene:THREE.Scene) {
            super();
            this._scene = scene;
            //
            this._initGrassMap();
            this._initRoadMap();
            this._initSandMap();
            //
            this._createBase();
            this._createRoadLine();
            this._createCarLine();
            this._createGrass();
            this._createGrassLT();
            this._createGrassLB();
            this._createGrassRT();
            this._createGrassRB();
            this._createStartline();
            this._createWall();
            this._createBlock();
            this._createTire();
            this._createTree();
            this._createSand();
            this._createSandLine();
            this._createSandLine2();
            this._createGoal();
        }

        // 道路端の線を作るマップを作成
        private _initRoadMap() {
            this._map = imjcart.logic.map.value.MapConst.MAP.concat();
            this._roadMap = [];
            var i, j, max, max2;
            for (i = 0, max = imjcart.logic.map.value.MapConst.MAP.length; i < max; i = i + 1) {
                var arr = [];
                for (j = 0, max2 = imjcart.logic.map.value.MapConst.MAP[i].length; j < max2; j = j + 1) {
                    if (
                        imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_GRASS
                        || imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_TIRE
                        || imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_TREE
                        || imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_BLOCK
                        || imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_WALL
                        ) {
                        arr.push(null);
                    } else {
                        arr.push("C");
                    }
                }
                this._roadMap.push(arr);
            }
            for (i = 0, max = this._roadMap.length; i < max; i = i + 1) {
                for (j = 0, max2 = this._roadMap[i].length; j < max2; j = j + 1) {
                    var current = this._roadMap[i][j] || null;
                    if (current != null) {
                        var left = this._roadMap[i][j - 1] || null;
                        var right = this._roadMap[i][j + 1] || null;
                        var top = null;
                        if (1 <= i) {
                            top = this._roadMap[i - 1][j] || null;
                        }
                        var bottom = null;
                        if (i <= max - 2) {
                            bottom = this._roadMap[i + 1][j] || null;
                        }
                        if (left == null && right != null && top != null && bottom != null) {
                            this._roadMap[i][j] = "L";
                        } else if (left != null && right == null && top != null && bottom != null) {
                            this._roadMap[i][j] = "R";
                        } else if (left != null && right != null && top == null && bottom != null) {
                            this._roadMap[i][j] = "T";
                        } else if (left != null && right != null && top != null && bottom == null) {
                            this._roadMap[i][j] = "B";
                        }
                    }
                }
            }
        }

        // 芝生同士を斜めにつないで、芝生マップを作成
        private _initGrassMap() {
            this._map = imjcart.logic.map.value.MapConst.MAP.concat();
            this._grassMap = [];
            var i, j, max, max2;
            for (i = 0, max = imjcart.logic.map.value.MapConst.MAP.length; i < max; i = i + 1) {
                var arr = [];
                for (j = 0, max2 = imjcart.logic.map.value.MapConst.MAP[i].length; j < max2; j = j + 1) {
                    if (
                        imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_GRASS
                        || imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_TIRE
                        || imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_TREE
                        || imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_SAND
                        ) {
                        arr.push("G");
                    } else {
                        arr.push(null);
                    }
                }
                this._grassMap.push(arr);
            }
            for (i = 0, max = imjcart.logic.map.value.MapConst.MAP.length; i < max; i = i + 1) {
                for (j = 0, max2 = imjcart.logic.map.value.MapConst.MAP[i].length; j < max2; j = j + 1) {
                    if (imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_GRASS) {
                        // 左上
                        if (imjcart.logic.map.value.MapConst.MAP[i - 1][j - 1] && imjcart.logic.map.value.MapConst.MAP[i - 1][j - 1] == imjcart.logic.map.value.MapConst.MAP_KEY_GRASS
                            || imjcart.logic.map.value.MapConst.MAP[i - 1][j - 1] && imjcart.logic.map.value.MapConst.MAP[i - 1][j - 1] == imjcart.logic.map.value.MapConst.MAP_KEY_TIRE
                            || imjcart.logic.map.value.MapConst.MAP[i - 1][j - 1] && imjcart.logic.map.value.MapConst.MAP[i - 1][j - 1] == imjcart.logic.map.value.MapConst.MAP_KEY_BLOCK
                            || imjcart.logic.map.value.MapConst.MAP[i - 1][j - 1] && imjcart.logic.map.value.MapConst.MAP[i - 1][j - 1] == imjcart.logic.map.value.MapConst.MAP_KEY_WALL
                            || imjcart.logic.map.value.MapConst.MAP[i - 1][j - 1] && imjcart.logic.map.value.MapConst.MAP[i - 1][j - 1] == imjcart.logic.map.value.MapConst.MAP_KEY_TREE) {
                            if (this._grassMap[i - 1][j] == "LT" || this._grassMap[i - 1][j] == "RT" || this._grassMap[i - 1][j] == "RB") {
                                this._grassMap[i - 1][j] = "G";
                            } else if (this._grassMap[i - 1][j] != "G") {
                                this._grassMap[i - 1][j] = "LB";
                            }
                            if (this._grassMap[i][j - 1] == "LT" || this._grassMap[i][j - 1] == "LB" || this._grassMap[i][j - 1] == "RB") {
                                this._grassMap[i][j - 1] = "G";
                            } else if (this._grassMap[i][j - 1] != "G") {
                                this._grassMap[i][j - 1] = "RT";
                            }
                        }
                        // 左下
                        if (imjcart.logic.map.value.MapConst.MAP[i + 1][j - 1] && imjcart.logic.map.value.MapConst.MAP[i + 1][j - 1] == imjcart.logic.map.value.MapConst.MAP_KEY_GRASS
                            || imjcart.logic.map.value.MapConst.MAP[i + 1][j - 1] && imjcart.logic.map.value.MapConst.MAP[i + 1][j - 1] == imjcart.logic.map.value.MapConst.MAP_KEY_TIRE
                            || imjcart.logic.map.value.MapConst.MAP[i + 1][j - 1] && imjcart.logic.map.value.MapConst.MAP[i + 1][j - 1] == imjcart.logic.map.value.MapConst.MAP_KEY_BLOCK
                            || imjcart.logic.map.value.MapConst.MAP[i + 1][j - 1] && imjcart.logic.map.value.MapConst.MAP[i + 1][j - 1] == imjcart.logic.map.value.MapConst.MAP_KEY_WALL
                            || imjcart.logic.map.value.MapConst.MAP[i + 1][j - 1] && imjcart.logic.map.value.MapConst.MAP[i + 1][j - 1] == imjcart.logic.map.value.MapConst.MAP_KEY_TREE) {
                            if (this._grassMap[i + 1][j] == "LB" || this._grassMap[i][j + 1] == "RT" || this._grassMap[i][j + 1] == "RB") {
                                this._grassMap[i + 1][j] = "G";
                            } else if (this._grassMap[i + 1][j] != "G") {
                                this._grassMap[i + 1][j] = "LT";
                            }
                            if (this._grassMap[i][j - 1] == "LT" || this._grassMap[i][j - 1] == "LB" || this._grassMap[i][j - 1] == "RT") {
                                this._grassMap[i][j - 1] = "G";
                            } else if (this._grassMap[i][j - 1] != "G") {
                                this._grassMap[i][j - 1] = "RB";
                            }
                        }
                        // 右上
                        if (imjcart.logic.map.value.MapConst.MAP[i - 1][j + 1] && imjcart.logic.map.value.MapConst.MAP[i - 1][j + 1] == imjcart.logic.map.value.MapConst.MAP_KEY_GRASS
                            || imjcart.logic.map.value.MapConst.MAP[i - 1][j + 1] && imjcart.logic.map.value.MapConst.MAP[i - 1][j + 1] == imjcart.logic.map.value.MapConst.MAP_KEY_TIRE
                            || imjcart.logic.map.value.MapConst.MAP[i - 1][j + 1] && imjcart.logic.map.value.MapConst.MAP[i - 1][j + 1] == imjcart.logic.map.value.MapConst.MAP_KEY_BLOCK
                            || imjcart.logic.map.value.MapConst.MAP[i - 1][j + 1] && imjcart.logic.map.value.MapConst.MAP[i - 1][j + 1] == imjcart.logic.map.value.MapConst.MAP_KEY_WALL
                            || imjcart.logic.map.value.MapConst.MAP[i - 1][j + 1] && imjcart.logic.map.value.MapConst.MAP[i - 1][j + 1] == imjcart.logic.map.value.MapConst.MAP_KEY_TREE) {
                            if (this._grassMap[i][j + 1] == "LB" || this._grassMap[i][j + 1] == "LB" || this._grassMap[i][j + 1] == "RB") {
                                this._grassMap[i][j + 1] = "G";
                            } else if (this._grassMap[i][j + 1] != "G") {
                                this._grassMap[i][j + 1] = "LT";
                            }
                            if (this._grassMap[i - 1][j] == "LB" || this._grassMap[i - 1][j] == "LB" || this._grassMap[i - 1][j] == "RT") {
                                this._grassMap[i - 1][j] = "G";
                            } else if (this._grassMap[i - 1][j] != "G") {
                                this._grassMap[i - 1][j] = "RB";
                            }
                        }
                        // 右下
                        if (imjcart.logic.map.value.MapConst.MAP[i + 1][j + 1] && imjcart.logic.map.value.MapConst.MAP[i + 1][j + 1] == imjcart.logic.map.value.MapConst.MAP_KEY_GRASS
                            || imjcart.logic.map.value.MapConst.MAP[i + 1][j + 1] && imjcart.logic.map.value.MapConst.MAP[i + 1][j + 1] == imjcart.logic.map.value.MapConst.MAP_KEY_TIRE
                            || imjcart.logic.map.value.MapConst.MAP[i + 1][j + 1] && imjcart.logic.map.value.MapConst.MAP[i + 1][j + 1] == imjcart.logic.map.value.MapConst.MAP_KEY_BLOCK
                            || imjcart.logic.map.value.MapConst.MAP[i + 1][j + 1] && imjcart.logic.map.value.MapConst.MAP[i + 1][j + 1] == imjcart.logic.map.value.MapConst.MAP_KEY_WALL
                            || imjcart.logic.map.value.MapConst.MAP[i + 1][j + 1] && imjcart.logic.map.value.MapConst.MAP[i + 1][j + 1] == imjcart.logic.map.value.MapConst.MAP_KEY_TREE) {
                            if (this._grassMap[i + 1][j] == "LT" || this._grassMap[i + 1][j] == "LB" || this._grassMap[i + 1][j] == "RB") {
                                this._grassMap[i + 1][j] = "G";
                            } else if (this._grassMap[i + 1][j] != "G") {
                                this._grassMap[i + 1][j] = "RT";
                            }
                            if (this._grassMap[i][j + 1] == "LT" || this._grassMap[i][j + 1] == "RT" || this._grassMap[i][j + 1] == "RB") {
                                this._grassMap[i][j + 1] = "G";
                            } else if (this._grassMap[i][j + 1] != "G") {
                                this._grassMap[i][j + 1] = "LB";
                            }
                        }
                    }
                }
            }
        }

        // 砂地同士を斜めにつないで、砂地マップを作成
        private _initSandMap() {
            this._map = imjcart.logic.map.value.MapConst.MAP.concat();
            this._sandMap = [];
            var i, j, max, max2;
            for (i = 0, max = imjcart.logic.map.value.MapConst.MAP.length; i < max; i = i + 1) {
                var arr = [];
                for (j = 0, max2 = imjcart.logic.map.value.MapConst.MAP[i].length; j < max2; j = j + 1) {
                    if (imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_SAND) {
                        arr.push("S");
                    } else {
                        arr.push(null);
                    }
                }
                this._sandMap.push(arr);
            }
            for (i = 0, max = imjcart.logic.map.value.MapConst.MAP.length; i < max; i = i + 1) {
                for (j = 0, max2 = imjcart.logic.map.value.MapConst.MAP[i].length; j < max2; j = j + 1) {
                    if (imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_SAND) {
                        // 左上
                        if (imjcart.logic.map.value.MapConst.MAP[i - 1][j - 1] && imjcart.logic.map.value.MapConst.MAP[i - 1][j - 1] == imjcart.logic.map.value.MapConst.MAP_KEY_SAND
                            || imjcart.logic.map.value.MapConst.MAP[i - 1][j - 1] && imjcart.logic.map.value.MapConst.MAP[i - 1][j - 1] == imjcart.logic.map.value.MapConst.MAP_KEY_BLOCK
                            || imjcart.logic.map.value.MapConst.MAP[i - 1][j - 1] && imjcart.logic.map.value.MapConst.MAP[i - 1][j - 1] == imjcart.logic.map.value.MapConst.MAP_KEY_WALL
                            ) {
                            if (this._sandMap[i - 1][j] == "LT" || this._sandMap[i - 1][j] == "RT" || this._sandMap[i - 1][j] == "RB") {
                                this._sandMap[i - 1][j] = "S";
                            } else if (this._sandMap[i - 1][j] != "S") {
                                this._sandMap[i - 1][j] = "LB";
                            }
                            if (this._sandMap[i][j - 1] == "LT" || this._sandMap[i][j - 1] == "LB" || this._sandMap[i][j - 1] == "RB") {
                                this._sandMap[i][j - 1] = "S";
                            } else if (this._sandMap[i][j - 1] != "S") {
                                this._sandMap[i][j - 1] = "RT";
                            }
                        }
                        // 左下
                        if (imjcart.logic.map.value.MapConst.MAP[i + 1][j - 1] && imjcart.logic.map.value.MapConst.MAP[i + 1][j - 1] == imjcart.logic.map.value.MapConst.MAP_KEY_SAND
                            || imjcart.logic.map.value.MapConst.MAP[i + 1][j - 1] && imjcart.logic.map.value.MapConst.MAP[i + 1][j - 1] == imjcart.logic.map.value.MapConst.MAP_KEY_BLOCK
                            || imjcart.logic.map.value.MapConst.MAP[i + 1][j - 1] && imjcart.logic.map.value.MapConst.MAP[i + 1][j - 1] == imjcart.logic.map.value.MapConst.MAP_KEY_WALL
                            ) {
                            if (this._sandMap[i + 1][j] == "LB" || this._sandMap[i][j + 1] == "RT" || this._sandMap[i][j + 1] == "RB") {
                                this._sandMap[i + 1][j] = "S";
                            } else if (this._sandMap[i + 1][j] != "S") {
                                this._sandMap[i + 1][j] = "LT";
                            }
                            if (this._sandMap[i][j - 1] == "LT" || this._sandMap[i][j - 1] == "LB" || this._sandMap[i][j - 1] == "RT") {
                                this._sandMap[i][j - 1] = "S";
                            } else if (this._sandMap[i][j - 1] != "S") {
                                this._sandMap[i][j - 1] = "RB";
                            }
                        }
                        // 右上
                        if (imjcart.logic.map.value.MapConst.MAP[i - 1][j + 1] && imjcart.logic.map.value.MapConst.MAP[i - 1][j + 1] == imjcart.logic.map.value.MapConst.MAP_KEY_SAND
                            || imjcart.logic.map.value.MapConst.MAP[i - 1][j + 1] && imjcart.logic.map.value.MapConst.MAP[i - 1][j + 1] == imjcart.logic.map.value.MapConst.MAP_KEY_BLOCK
                            || imjcart.logic.map.value.MapConst.MAP[i - 1][j + 1] && imjcart.logic.map.value.MapConst.MAP[i - 1][j + 1] == imjcart.logic.map.value.MapConst.MAP_KEY_WALL
                            ) {
                            if (this._sandMap[i][j + 1] == "LB" || this._sandMap[i][j + 1] == "LB" || this._sandMap[i][j + 1] == "RB") {
                                this._sandMap[i][j + 1] = "S";
                            } else if (this._sandMap[i][j + 1] != "S") {
                                this._sandMap[i][j + 1] = "LT";
                            }
                            if (this._sandMap[i - 1][j] == "LB" || this._sandMap[i - 1][j] == "LB" || this._sandMap[i - 1][j] == "RT") {
                                this._sandMap[i - 1][j] = "S";
                            } else if (this._sandMap[i - 1][j] != "S") {
                                this._sandMap[i - 1][j] = "RB";
                            }
                        }
                        // 右下
                        if (imjcart.logic.map.value.MapConst.MAP[i + 1][j + 1] && imjcart.logic.map.value.MapConst.MAP[i + 1][j + 1] == imjcart.logic.map.value.MapConst.MAP_KEY_SAND
                            || imjcart.logic.map.value.MapConst.MAP[i + 1][j + 1] && imjcart.logic.map.value.MapConst.MAP[i + 1][j + 1] == imjcart.logic.map.value.MapConst.MAP_KEY_BLOCK
                            || imjcart.logic.map.value.MapConst.MAP[i + 1][j + 1] && imjcart.logic.map.value.MapConst.MAP[i + 1][j + 1] == imjcart.logic.map.value.MapConst.MAP_KEY_WALL
                            ) {
                            if (this._sandMap[i + 1][j] == "LT" || this._sandMap[i + 1][j] == "LB" || this._sandMap[i + 1][j] == "RB") {
                                this._sandMap[i + 1][j] = "S";
                            } else if (this._sandMap[i + 1][j] != "S") {
                                this._sandMap[i + 1][j] = "RT";
                            }
                            if (this._sandMap[i][j + 1] == "LT" || this._sandMap[i][j + 1] == "RT" || this._sandMap[i][j + 1] == "RB") {
                                this._sandMap[i][j + 1] = "S";
                            } else if (this._sandMap[i][j + 1] != "S") {
                                this._sandMap[i][j + 1] = "LB";
                            }
                        }
                    }
                }
            }
        }

        // コース土台
        private _createBase() {
            var geometry = new THREE.Geometry();
            var texture = THREE.ImageUtils.loadTexture("img/base.jpg");
            //texture.minFilter = THREE.NearestFilter;
            //texture.magFilter = THREE.LinearMipMapLinearFilter;
            var material = null;
            if (imjcart.logic.value.Const.IS_BUMPMAP_ENABLED) {
                material = new THREE.MeshPhongMaterial({
                    color: 0xffffff,
                    specular: 0x999999,
                    shininess: 10,
                    ambient: imjcart.display.main.view3d.value.View3dConst.AMBIENT_COLOR,
                    map: texture,
                    bumpMap: texture,
                    bumpScale: 0.1
                });
            } else {
                material = new THREE.MeshBasicMaterial({map: texture});
            }
            var i, j, max, max2;
            for (i = 0, max = imjcart.logic.map.value.MapConst.MAP.length; i < max; i = i + 1) {
                for (j = 0, max2 = imjcart.logic.map.value.MapConst.MAP[i].length; j < max2; j = j + 1) {
                    var mesh = new THREE.Mesh(new THREE.PlaneGeometry(imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE, imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE, 1, 1), new THREE.MeshBasicMaterial());
                    mesh.rotation.x = imjcart.logic.utility.Util.getAngleByRotation(-90);
                    mesh.position.set(imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * j + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2), 0.2, imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * i + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2));
                    THREE.GeometryUtils.merge(geometry, mesh);
                }
            }
            this._base = new THREE.Mesh(geometry, material);
            if (imjcart.logic.value.Const.IS_SHADOW_ENABLED) {
                this._base.receiveShadow = true;
            }
            this._scene.add(this._base);
        }

        // コースライン
        private _createRoadLine() {
            var geometry = new THREE.Geometry();
            var texture = THREE.ImageUtils.loadTexture("img/base2.png");
            texture.minFilter = THREE.NearestFilter;
            texture.magFilter = THREE.LinearMipMapLinearFilter;
            var material = new THREE.MeshBasicMaterial({map: texture, transparent: true, blending: THREE.NormalBlending});
            var i, j, max, max2;
            for (i = 0, max = this._roadMap.length; i < max; i = i + 1) {
                for (j = 0, max2 = this._roadMap[i].length; j < max2; j = j + 1) {
                    if (this._roadMap[i][j] != null && this._roadMap[i][j] != "C") {
                        var tagX = imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * j + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2);
                        var tagY = 0.4;
                        var tagZ = imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * i + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2);
                        var mesh = new THREE.Mesh(new THREE.PlaneGeometry(imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE, imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE, 1, 1), new THREE.MeshBasicMaterial());
                        mesh.position.set(tagX, tagY, tagZ);
                        mesh.rotation.x = imjcart.logic.utility.Util.getAngleByRotation(-90);
                        if (this._roadMap[i][j] == "L") {
                            THREE.GeometryUtils.merge(geometry, mesh);
                        } else if (this._roadMap[i][j] == "R") {
                            mesh.rotation.z = imjcart.logic.utility.Util.getAngleByRotation(-180);
                            THREE.GeometryUtils.merge(geometry, mesh);
                        } else if (this._roadMap[i][j] == "T") {
                            mesh.rotation.z = imjcart.logic.utility.Util.getAngleByRotation(-90);
                            THREE.GeometryUtils.merge(geometry, mesh);
                        } else if (this._roadMap[i][j] == "B") {
                            mesh.rotation.z = imjcart.logic.utility.Util.getAngleByRotation(90);
                            THREE.GeometryUtils.merge(geometry, mesh);
                        }
                    }
                }
            }
            var mesh = new THREE.Mesh(geometry, material);
            if (imjcart.logic.value.Const.IS_SHADOW_ENABLED) {
                mesh.receiveShadow = true;
            }
            this._scene.add(mesh);
        }

        // 車ライン
        private _createCarLine() {
            var geometry = new THREE.Geometry();
            var texture = THREE.ImageUtils.loadTexture("img/base3.png");
            texture.minFilter = THREE.NearestFilter;
            texture.magFilter = THREE.LinearMipMapLinearFilter;
            var material = null;
            if (imjcart.logic.value.Const.IS_BUMPMAP_ENABLED) {
                material = new THREE.MeshPhongMaterial({
                    color: 0xffffff,
                    specular: 0x999999,
                    shininess: 10,
                    ambient: imjcart.display.main.view3d.value.View3dConst.AMBIENT_COLOR,
                    map: texture,
                    bumpMap: texture,
                    bumpScale: 0.1,
                    transparent: true,
                    blending: THREE.NormalBlending
                });
            } else {
                material = new THREE.MeshBasicMaterial({map: texture, transparent: true, blending: THREE.NormalBlending});
            }
            var i, j, max, max2;
            for (i = 0, max = imjcart.logic.map.value.MapConst.MAP.length; i < max; i = i + 1) {
                for (j = 0, max2 = imjcart.logic.map.value.MapConst.MAP[i].length; j < max2; j = j + 1) {
                    if (imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_CAR_START_POSITION) {
                        var y = 0;
                        var k = 0, max3;
                        for (k = 0, max3 = 12; k < max3; k = k + 1) {
                            var x = 0;
                            if (k % 2) {
                                x = 6;
                            } else {
                                x = 0;
                            }
                            var mesh = new THREE.Mesh(new THREE.PlaneGeometry(imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE, imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE, 1, 1), new THREE.MeshBasicMaterial());
                            mesh.rotation.x = imjcart.logic.utility.Util.getAngleByRotation(-90);
                            mesh.position.set(imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * (j + x), 0.4, imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * (i + y) - 4);
                            THREE.GeometryUtils.merge(geometry, mesh);
                            y = y + 2;
                        }
                    }
                }
            }
            this._carLine = new THREE.Mesh(geometry, material);
            if (imjcart.logic.value.Const.IS_SHADOW_ENABLED) {
                this._carLine.receiveShadow = true;
            }
            this._scene.add(this._carLine);
        }

        // 芝生
        private _createGrass() {
            var geometry = new THREE.Geometry();
            var texture = THREE.ImageUtils.loadTexture("img/grass.jpg");
            //texture.minFilter = THREE.NearestFilter;
            //texture.magFilter = THREE.LinearMipMapLinearFilter;
            var material = new THREE.MeshBasicMaterial({map: texture});
            var i, j, max, max2;
            for (i = 0, max = this._grassMap.length; i < max; i = i + 1) {
                for (j = 0, max2 = this._grassMap[i].length; j < max2; j = j + 1) {
                    if (this._grassMap[i][j] == "G") {
                        var mesh = new THREE.Mesh(new THREE.PlaneGeometry(imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE, imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE, 1, 1), new THREE.MeshBasicMaterial());
                        mesh.rotation.x = imjcart.logic.utility.Util.getAngleByRotation(-90);
                        mesh.position.set(imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * j + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2), 0.6, imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * i + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2));
                        THREE.GeometryUtils.merge(geometry, mesh);
                    }
                }
            }
            this._grass = new THREE.Mesh(geometry, material);
            if (imjcart.logic.value.Const.IS_SHADOW_ENABLED) {
                this._grass.receiveShadow = true;
            }
            this._scene.add(this._grass);
        }

        // 芝生
        private _createGrassLT() {
            var geometry = new THREE.Geometry();
            var texture = THREE.ImageUtils.loadTexture("img/grassLT.png");
            //texture.minFilter = THREE.NearestFilter;
            //texture.magFilter = THREE.LinearMipMapLinearFilter;
            var material = new THREE.MeshBasicMaterial({map: texture, transparent: true, blending: THREE.NormalBlending});
            var i, j, max, max2;
            for (i = 0, max = this._grassMap.length; i < max; i = i + 1) {
                for (j = 0, max2 = this._grassMap[i].length; j < max2; j = j + 1) {
                    if (this._grassMap[i][j] == "LT") {
                        var mesh = new THREE.Mesh(new THREE.PlaneGeometry(imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE, imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE, 1, 1), new THREE.MeshBasicMaterial());
                        mesh.rotation.x = imjcart.logic.utility.Util.getAngleByRotation(-90);
                        mesh.position.set(imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * j + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2), 0.6, imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * i + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2));
                        THREE.GeometryUtils.merge(geometry, mesh);
                    }
                }
            }
            this._grassLT = new THREE.Mesh(geometry, material);
            if (imjcart.logic.value.Const.IS_SHADOW_ENABLED) {
                this._grassLT.receiveShadow = true;
            }
            this._scene.add(this._grassLT);
        }

        // 芝生
        private _createGrassLB() {
            var geometry = new THREE.Geometry();
            var texture = THREE.ImageUtils.loadTexture("img/grassLB.png");
            //texture.minFilter = THREE.NearestFilter;
            //texture.magFilter = THREE.LinearMipMapLinearFilter;
            var material = new THREE.MeshBasicMaterial({map: texture, transparent: true, blending: THREE.NormalBlending});
            var i, j, max, max2;
            for (i = 0, max = this._grassMap.length; i < max; i = i + 1) {
                for (j = 0, max2 = this._grassMap[i].length; j < max2; j = j + 1) {
                    if (this._grassMap[i][j] == "LB") {
                        var mesh = new THREE.Mesh(new THREE.PlaneGeometry(imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE, imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE, 1, 1), new THREE.MeshBasicMaterial());
                        mesh.rotation.x = imjcart.logic.utility.Util.getAngleByRotation(-90);
                        mesh.position.set(imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * j + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2), 0.6, imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * i + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2));
                        THREE.GeometryUtils.merge(geometry, mesh);
                    }
                }
            }
            this._grassLB = new THREE.Mesh(geometry, material);
            if (imjcart.logic.value.Const.IS_SHADOW_ENABLED) {
                this._grassLB.receiveShadow = true;
            }
            this._scene.add(this._grassLB);
        }

        // 芝生
        private _createGrassRT() {
            var geometry = new THREE.Geometry();
            var texture = THREE.ImageUtils.loadTexture("img/grassRT.png");
            //texture.minFilter = THREE.NearestFilter;
            //texture.magFilter = THREE.LinearMipMapLinearFilter;
            var material = new THREE.MeshBasicMaterial({map: texture, transparent: true, blending: THREE.NormalBlending});
            var i, j, max, max2;
            for (i = 0, max = this._grassMap.length; i < max; i = i + 1) {
                for (j = 0, max2 = this._grassMap[i].length; j < max2; j = j + 1) {
                    if (this._grassMap[i][j] == "RT") {
                        var mesh = new THREE.Mesh(new THREE.PlaneGeometry(imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE, imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE, 1, 1), new THREE.MeshBasicMaterial());
                        mesh.rotation.x = imjcart.logic.utility.Util.getAngleByRotation(-90);
                        mesh.position.set(imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * j + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2), 0.6, imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * i + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2));
                        THREE.GeometryUtils.merge(geometry, mesh);
                    }
                }
            }
            this._grassRT = new THREE.Mesh(geometry, material);
            if (imjcart.logic.value.Const.IS_SHADOW_ENABLED) {
                this._grassRT.receiveShadow = true;
            }
            this._scene.add(this._grassRT);
        }

        // 芝生
        private _createGrassRB() {
            var geometry = new THREE.Geometry();
            var texture = THREE.ImageUtils.loadTexture("img/grassRB.png");
            //texture.minFilter = THREE.NearestFilter;
            //texture.magFilter = THREE.LinearMipMapLinearFilter;
            var material = new THREE.MeshBasicMaterial({map: texture, transparent: true, blending: THREE.NormalBlending});
            var i, j, max, max2;
            for (i = 0, max = this._grassMap.length; i < max; i = i + 1) {
                for (j = 0, max2 = this._grassMap[i].length; j < max2; j = j + 1) {
                    if (this._grassMap[i][j] == "RB") {
                        var mesh = new THREE.Mesh(new THREE.PlaneGeometry(imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE, imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE, 1, 1), new THREE.MeshBasicMaterial());
                        mesh.rotation.x = imjcart.logic.utility.Util.getAngleByRotation(-90);
                        mesh.position.set(imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * j + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2), 0.6, imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * i + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2));
                        THREE.GeometryUtils.merge(geometry, mesh);
                    }
                }
            }
            this._grassRB = new THREE.Mesh(geometry, material);
            if (imjcart.logic.value.Const.IS_SHADOW_ENABLED) {
                this._grassRB.receiveShadow = true;
            }
            this._scene.add(this._grassRB);
        }

        // スタートライン
        private _createStartline() {
            var texture = THREE.ImageUtils.loadTexture("img/startline.png");
            //texture.minFilter = THREE.NearestFilter;
            //texture.magFilter = THREE.LinearMipMapLinearFilter;
            var geometry = new THREE.Geometry();
            var material = new THREE.MeshBasicMaterial({map: texture, transparent: true, blending: THREE.NormalBlending});
            var i, j, max, max2;
            for (i = 0, max = imjcart.logic.map.value.MapConst.MAP.length; i < max; i = i + 1) {
                for (j = 0, max2 = imjcart.logic.map.value.MapConst.MAP[i].length; j < max2; j = j + 1) {
                    if (imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_LAP_START_POINT) {
                        var mesh = new THREE.Mesh(new THREE.PlaneGeometry(imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE, imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE, 1, 1), new THREE.MeshBasicMaterial());
                        mesh.rotation.x = imjcart.logic.utility.Util.getAngleByRotation(-90);
                        mesh.position.set(imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * j + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2), 0.8, imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * i + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2));
                        THREE.GeometryUtils.merge(geometry, mesh);
                    }
                }
            }
            this._startline = new THREE.Mesh(geometry, material);
            if (imjcart.logic.value.Const.IS_SHADOW_ENABLED) {
                this._startline.receiveShadow = true;
            }
            this._scene.add(this._startline);
        }

        // 壁
        private _createWall() {
            var geometry = new THREE.Geometry();
            var meshArr = [];
            var loader = new THREE.OBJMTLLoader();
            loader.load("models/wall01/wall01.obj", "models/wall01/wall01.mtl", (object) => {
                object.traverse(function (child) {
                    if (child instanceof THREE.Mesh) {
                        //var texture = child.material.map;
                        //child.material = new THREE.MeshPhongMaterial(child.material);
                        child.material = new THREE.MeshLambertMaterial(child.material);
                        //child.material.shininess = 3;
                        //child.material.bumpMap = texture;
                        //child.material.bumpScale = 0.05;
                        //child.castShadow = true;
                        child.material.ambient = new THREE.Color(imjcart.display.main.view3d.value.View3dConst.AMBIENT_COLOR);
                        meshArr.push({
                            mesh: child,
                            material: child.material
                        });
                    }
                });
                // 配置
                var i, j, max, max2;
                for (i = 0, max = imjcart.logic.map.value.MapConst.MAP.length; i < max; i = i + 1) {
                    for (j = 0, max2 = imjcart.logic.map.value.MapConst.MAP[i].length; j < max2; j = j + 1) {
                        if (imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_WALL) {
                            var tagX = imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * j + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2);
                            var tagY = 0.6;
                            var tagZ = imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * i + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2);
                            var mesh = meshArr[1].mesh.clone();
                            mesh.position.set(tagX, tagY, tagZ);
                            THREE.GeometryUtils.merge(geometry, mesh);
                        }
                    }
                }
                this._wall = new THREE.Mesh(geometry, meshArr[1].material);
                if (imjcart.logic.value.Const.IS_SHADOW_ENABLED) {
                    this._wall.castShadow = true;
                }
                this._scene.add(this._wall);
            });
        }

        // ブロック
        private _createBlock() {
            var geometry = new THREE.Geometry();
            var meshArr = [];
            var loader = new THREE.OBJMTLLoader();
            loader.load("models/block03/block03.obj", "models/block03/block03.mtl", (object) => {
                object.traverse(function (child) {
                    if (child instanceof THREE.Mesh) {
                        //var texture = child.material.map;
                        //child.material = new THREE.MeshPhongMaterial(child.material);
                        child.material = new THREE.MeshLambertMaterial(child.material);
                        //child.material.shininess = 3;
                        //child.material.bumpMap = texture;
                        //child.material.bumpScale = 0.05;
                        //child.castShadow = true;
                        child.material.ambient = new THREE.Color(imjcart.display.main.view3d.value.View3dConst.AMBIENT_COLOR);
                        meshArr.push({
                            mesh: child,
                            material: child.material
                        });
                    }
                });
                // 配置
                var i, j, max, max2;
                for (i = 0, max = imjcart.logic.map.value.MapConst.MAP.length; i < max; i = i + 1) {
                    for (j = 0, max2 = imjcart.logic.map.value.MapConst.MAP[i].length; j < max2; j = j + 1) {
                        if (imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_BLOCK) {
                            var tagX = imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * j + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2);
                            var tagY = 1;
                            var tagZ = imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * i + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2);
                            var mesh = meshArr[1].mesh.clone();
                            mesh.position.set(tagX, tagY, tagZ);
                            THREE.GeometryUtils.merge(geometry, mesh);
                        }
                    }
                }
                this._block = new THREE.Mesh(geometry, meshArr[1].material);
                if (imjcart.logic.value.Const.IS_SHADOW_ENABLED) {
                    this._block.castShadow = true;
                }
                this._scene.add(this._block);
            });
        }

        // タイヤ
        private _createTire() {
            var geometry = new THREE.Geometry();
            var meshArr = [];
            var loader = new THREE.OBJMTLLoader();
            loader.load("models/tire02/tire02.obj", "models/tire02/tire02.mtl", (object) => {
                object.traverse(function (child) {
                    if (child instanceof THREE.Mesh) {
                        //var texture = child.material.map;
                        //child.material = new THREE.MeshPhongMaterial(child.material);
                        child.material = new THREE.MeshLambertMaterial(child.material);
                        //child.material.shininess = 3;
                        //child.material.bumpMap = texture;
                        //child.material.bumpScale = 0.05;
                        //child.castShadow = true;
                        child.material.ambient = new THREE.Color(imjcart.display.main.view3d.value.View3dConst.AMBIENT_COLOR);
                        meshArr.push({
                            mesh: child,
                            material: child.material
                        });
                    }
                });
                // 配置
                var i, j, max, max2;
                for (i = 0, max = imjcart.logic.map.value.MapConst.MAP.length; i < max; i = i + 1) {
                    for (j = 0, max2 = imjcart.logic.map.value.MapConst.MAP[i].length; j < max2; j = j + 1) {
                        if (imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_TIRE) {
                            var tagX = imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * j + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2);
                            var tagY = 0.6;
                            var tagZ = imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * i + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2);
                            var mesh = meshArr[1].mesh.clone();
                            mesh.position.set(tagX, tagY, tagZ);
                            THREE.GeometryUtils.merge(geometry, mesh);
                        }
                    }
                }
                this._tire = new THREE.Mesh(geometry, meshArr[1].material);
                if (imjcart.logic.value.Const.IS_SHADOW_ENABLED) {
                    this._tire.castShadow = true;
                }
                this._scene.add(this._tire);
            });
        }

        // 木
        private _createTree() {
            var geometry = new THREE.Geometry();
            var meshArr = [];
            var loader = new THREE.OBJMTLLoader();
            loader.load("models/tree02/tree02.obj", "models/tree02/tree02.mtl", (object) => {
                object.traverse(function (child) {
                    if (child instanceof THREE.Mesh) {
                        //var texture = child.material.map;
                        //child.material = new THREE.MeshPhongMaterial(child.material);
                        child.material = new THREE.MeshLambertMaterial(child.material);
                        //child.material.shininess = 3;
                        //child.material.bumpMap = texture;
                        //child.material.bumpScale = 0.05;
                        //child.castShadow = true;
                        child.material.ambient = new THREE.Color(imjcart.display.main.view3d.value.View3dConst.AMBIENT_COLOR);
                        meshArr.push({
                            mesh: child,
                            material: child.material
                        });
                    }
                });
                // 配置
                var i, j, max, max2;
                for (i = 0, max = imjcart.logic.map.value.MapConst.MAP.length; i < max; i = i + 1) {
                    for (j = 0, max2 = imjcart.logic.map.value.MapConst.MAP[i].length; j < max2; j = j + 1) {
                        if (imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_TREE) {
                            var tagX = imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * j + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2);
                            var tagY = 0.6;
                            var tagZ = imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * i + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2);
                            var mesh = meshArr[1].mesh.clone();
                            mesh.position.set(tagX, tagY, tagZ);
                            THREE.GeometryUtils.merge(geometry, mesh);
                        }
                    }
                }
                this._tree = new THREE.Mesh(geometry, meshArr[1].material);
                if (imjcart.logic.value.Const.IS_SHADOW_ENABLED) {
                    this._tree.castShadow = true;
                }
                this._scene.add(this._tree);
            });
        }

        // ゴール
        private _createGoal() {
            var loader = new THREE.OBJMTLLoader();
            loader.load("models/goal01/goal01.obj", "models/goal01/goal01.mtl", (object) => {
                object.traverse(function (child) {
                    if (child instanceof THREE.Mesh) {
                        switch(child.material.name) {
                            case "PostLeft":
                                child.material.ambient = new THREE.Color(0x999999);
                                child.material.color = new THREE.Color(0x999999);
                                break;
                            case "PostRight":
                                child.material.ambient = new THREE.Color(0x999999);
                                child.material.color = new THREE.Color(0x999999);
                                break;
                            case "Banner":
                                child.material.ambient = new THREE.Color(0xffffff);
                                child.material.color = new THREE.Color(0xffffff);
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
                // 配置
                var i, j, max, max2;
                for (i = 0, max = imjcart.logic.map.value.MapConst.MAP.length; i < max; i = i + 1) {
                    for (j = 0, max2 = imjcart.logic.map.value.MapConst.MAP[i].length; j < max2; j = j + 1) {
                        if (imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_LAP_START_POINT) {
                            var tagX = imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * (j - 2) + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2);
                            var tagY = 0;
                            var tagZ = imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * i + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2);
                            object.position.set(tagX, tagY, tagZ);
                            this._goal = object;
                            this._scene.add(this._goal);
                            break;
                        }
                    }
                }
            });
        }

        // 砂地
        private _createSand() {
            var geometry = new THREE.Geometry();
            var texture = THREE.ImageUtils.loadTexture("img/sand.jpg");
            //texture.minFilter = THREE.NearestFilter;
            //texture.magFilter = THREE.LinearMipMapLinearFilter;
            var material = null;
            if (imjcart.logic.value.Const.IS_BUMPMAP_ENABLED) {
                material = new THREE.MeshPhongMaterial({
                    color: 0xffffff,
                    specular: 0x999999,
                    shininess: 10,
                    ambient: imjcart.display.main.view3d.value.View3dConst.AMBIENT_COLOR,
                    map: texture,
                    bumpMap: texture,
                    bumpScale: 0.1,
                    transparent: true,
                    blending: THREE.NormalBlending
                });
            } else {
                material = new THREE.MeshBasicMaterial({map: texture, transparent: true, blending: THREE.NormalBlending});
            }
            var i, j, max, max2;
            for (i = 0, max = imjcart.logic.map.value.MapConst.MAP.length; i < max; i = i + 1) {
                for (j = 0, max2 = imjcart.logic.map.value.MapConst.MAP[i].length; j < max2; j = j + 1) {
                    if (imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_SAND) {
                        var mesh = new THREE.Mesh(new THREE.PlaneGeometry(imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE, imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE, 1, 1), new THREE.MeshBasicMaterial());
                        mesh.rotation.x = imjcart.logic.utility.Util.getAngleByRotation(-90);
                        mesh.position.set(
                            imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * j + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2),
                            0.8,
                            imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * i  + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2)
                        );
                        THREE.GeometryUtils.merge(geometry, mesh);
                    }
                }
            }
            this._sand = new THREE.Mesh(geometry, material);
            if (imjcart.logic.value.Const.IS_SHADOW_ENABLED) {
                this._sand.receiveShadow = true;
            }
            this._scene.add(this._sand);
        }

        // 砂地ライン
        private _createSandLine() {
            var geometry = new THREE.Geometry();
            var texture = THREE.ImageUtils.loadTexture("img/sand2.png");
            //texture.minFilter = THREE.NearestFilter;
            //texture.magFilter = THREE.LinearMipMapLinearFilter;
            var material = null;
            if (imjcart.logic.value.Const.IS_BUMPMAP_ENABLED) {
                material = new THREE.MeshPhongMaterial({
                    color: 0xffffff,
                    specular: 0x999999,
                    shininess: 10,
                    ambient: imjcart.display.main.view3d.value.View3dConst.AMBIENT_COLOR,
                    map: texture,
                    bumpMap: texture,
                    bumpScale: 0.1,
                    transparent: true,
                    blending: THREE.NormalBlending
                });
            } else {
                material = new THREE.MeshBasicMaterial({map: texture, transparent: true, blending: THREE.NormalBlending});
            }
            var i, j, max, max2;
            for (i = 0, max = this._sandMap.length; i < max; i = i + 1) {
                for (j = 0, max2 = this._sandMap[i].length; j < max2; j = j + 1) {
                    if (this._sandMap[i][j] != null && this._sandMap[i][j] != "S") {
                        var tagX = imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * j + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2);
                        var tagY = 0.8;
                        var tagZ = imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * i + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2);
                        var mesh = new THREE.Mesh(new THREE.PlaneGeometry(imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE, imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE, 1, 1), new THREE.MeshBasicMaterial());
                        mesh.position.set(tagX, tagY, tagZ);
                        mesh.rotation.x = imjcart.logic.utility.Util.getAngleByRotation(-90);
                        if (this._sandMap[i][j] == "LB") {
                            mesh.rotation.z = imjcart.logic.utility.Util.getAngleByRotation(0);
                            THREE.GeometryUtils.merge(geometry, mesh);
                        } else if (this._sandMap[i][j] == "RT") {
                            mesh.rotation.z = imjcart.logic.utility.Util.getAngleByRotation(180);
                            THREE.GeometryUtils.merge(geometry, mesh);
                        }
                    }
                }
            }
            var mesh = new THREE.Mesh(geometry, material);
            if (imjcart.logic.value.Const.IS_SHADOW_ENABLED) {
                mesh.receiveShadow = true;
            }
            this._scene.add(mesh);
        }

        // 砂地ライン
        private _createSandLine2() {
            var geometry = new THREE.Geometry();
            var texture = THREE.ImageUtils.loadTexture("img/sand3.png");
            //texture.minFilter = THREE.NearestFilter;
            //texture.magFilter = THREE.LinearMipMapLinearFilter;
            var material = null;
            if (imjcart.logic.value.Const.IS_BUMPMAP_ENABLED) {
                material = new THREE.MeshPhongMaterial({
                    color: 0xffffff,
                    specular: 0x999999,
                    shininess: 10,
                    ambient: imjcart.display.main.view3d.value.View3dConst.AMBIENT_COLOR,
                    map: texture,
                    bumpMap: texture,
                    bumpScale: 0.1,
                    transparent: true,
                    blending: THREE.NormalBlending
                });
            } else {
                material = new THREE.MeshBasicMaterial({map: texture, transparent: true, blending: THREE.NormalBlending});
            }
            var i, j, max, max2;
            for (i = 0, max = this._sandMap.length; i < max; i = i + 1) {
                for (j = 0, max2 = this._sandMap[i].length; j < max2; j = j + 1) {
                    if (this._sandMap[i][j] != null && this._sandMap[i][j] != "S") {
                        var tagX = imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * j + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2);
                        var tagY = 0.8;
                        var tagZ = imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * i + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2);
                        var mesh = new THREE.Mesh(new THREE.PlaneGeometry(imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE, imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE, 1, 1), new THREE.MeshBasicMaterial());
                        mesh.position.set(tagX, tagY, tagZ);
                        mesh.rotation.x = imjcart.logic.utility.Util.getAngleByRotation(-90);
                        if (this._sandMap[i][j] == "LT") {
                            mesh.rotation.z = imjcart.logic.utility.Util.getAngleByRotation(-90);
                            THREE.GeometryUtils.merge(geometry, mesh);
                        } else if (this._sandMap[i][j] == "RB") {
                            mesh.rotation.z = imjcart.logic.utility.Util.getAngleByRotation(90);
                            THREE.GeometryUtils.merge(geometry, mesh);
                        }
                    }
                }
            }
            var mesh = new THREE.Mesh(geometry, material);
            if (imjcart.logic.value.Const.IS_SHADOW_ENABLED) {
                mesh.receiveShadow = true;
            }
            this._scene.add(mesh);
        }

    }

}