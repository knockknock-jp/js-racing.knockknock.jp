/// <reference path="../../../lib/jquery.d.ts"/>
/// <reference path="../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../lib/three.d.ts"/>
/// <reference path="../../../lib/lib.ts"/>
/// <reference path="../../../imjcart/logic/map/value/MapConst.ts"/>
/// <reference path="../../../imjcart/logic/physics/Box.ts"/>
/// <reference path="../../../imjcart/logic/physics/Circle.ts"/>
var imjcart;
(function (imjcart) {
    (function (logic) {
        (function (physics) {
            var Obstacles = (function () {
                function Obstacles(context, world) {
                    this._context = null;
                    this._world = null;
                    this._boxes = [];
                    this._context = context;
                    this._world = world;

                    //
                    var debugDraw = new Box2D.Dynamics.b2DebugDraw();
                    debugDraw.SetSprite(this._context);
                    debugDraw.SetDrawScale(imjcart.logic.map.value.MapConst.MAP_SCALE);
                    debugDraw.SetFillAlpha(0.5);
                    debugDraw.SetLineThickness(1.0);
                    debugDraw.SetFlags(Box2D.Dynamics.b2DebugDraw.e_shapeBit | Box2D.Dynamics.b2DebugDraw.e_jointBit);
                    this._world.SetDebugDraw(debugDraw);

                    // MAP情報に沿って壁を設定
                    var i = 0, max;
                    for (i = 0, max = imjcart.logic.map.value.MapConst.MAP.length; i < max; i = i + 1) {
                        var j = 0, max2;
                        for (j = 0, max2 = imjcart.logic.map.value.MapConst.MAP[i].length; j < max2; j = j + 1) {
                            if (imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_WALL || imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_BLOCK) {
                                new physics.Box(this._context, this._world, imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * j + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2), imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * i + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2), imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE, imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE, {
                                    type: Box2D.Dynamics.b2Body.b2_staticBody,
                                    restitution: 0.5
                                });
                            } else if (imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_TIRE) {
                                var radius = imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 4;
                                var tagX = 0;
                                var tagY = 0;
                                var k = 0, max3;
                                for (k = 1, max3 = 4; k <= max3; k = k + 1) {
                                    new physics.Circle(this._context, this._world, imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * j + radius + tagX, imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * i + radius + tagY, imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2, {
                                        type: Box2D.Dynamics.b2Body.b2_staticBody,
                                        restitution: 0.5
                                    });

                                    //
                                    if (k % 2 == 0) {
                                        tagX = 0;
                                        tagY += radius * 2;
                                    } else {
                                        tagX += radius * 2;
                                    }
                                }
                            } else if (imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_TREE) {
                                var radius = imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 10;
                                new physics.Circle(this._context, this._world, imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * j + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2), imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * i + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2), radius, {
                                    type: Box2D.Dynamics.b2Body.b2_staticBody,
                                    restitution: 0.5
                                });
                            }
                        }
                    }
                }
                Obstacles.prototype.getBoxPosition = function (index) {
                    return this._boxes[index].GetPosition();
                };

                Obstacles.prototype.getBoxAngle = function (index) {
                    return this._boxes[index].GetAngle();
                };
                return Obstacles;
            })();
            physics.Obstacles = Obstacles;
        })(logic.physics || (logic.physics = {}));
        var physics = logic.physics;
    })(imjcart.logic || (imjcart.logic = {}));
    var logic = imjcart.logic;
})(imjcart || (imjcart = {}));
