/// <reference path="../../../lib/jquery.d.ts"/>
/// <reference path="../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../lib/three.d.ts"/>
/// <reference path="../../../lib/lib.ts"/>
/// <reference path="../../../imjcart/logic/value/Const.ts"/>
/// <reference path="../../../imjcart/logic/physics/Car.ts"/>
/// <reference path="../../../imjcart/logic/physics/Obstacles.ts"/>
/// <reference path="../../../imjcart/logic/physics/value/PhysicsConst.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var imjcart;
(function (imjcart) {
    (function (logic) {
        (function (physics) {
            var Physics = (function (_super) {
                __extends(Physics, _super);
                function Physics($target) {
                    _super.call(this);
                    this._$target = null;
                    this._context = null;
                    this._world = null;
                    this._obstacles = null;
                    this._car = null;
                    this._isPause = false;
                    this._$target = $target;

                    // コンテキスト
                    this._context = this._$target.get(0).getContext("2d");

                    // 世界
                    this._world = new Box2D.Dynamics.b2World(new Box2D.Common.Math.b2Vec2(0, 0), true);

                    // 障害物
                    this._obstacles = new physics.Obstacles(this._context, this._world);

                    // 車生成
                    this.createCar();

                    // デバッグモード
                    if (imjcart.logic.value.Const.IS_PHYSICS_DEBUG_MODE) {
                        this._$target.css({
                            display: "block"
                        });
                    }
                }
                // 車生成
                Physics.prototype.createCar = function () {
                    var _this = this;
                    // 車
                    var x = 740;
                    var y = 400;
                    var i, j, max, max2;
                    for (i = 0, max = imjcart.logic.map.value.MapConst.MAP.length; i < max; i = i + 1) {
                        for (j = 0, max2 = imjcart.logic.map.value.MapConst.MAP[i].length; j < max2; j = j + 1) {
                            if (imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_CAR_START_POSITION) {
                                y = imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * i;
                                x = imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * j;
                                break;
                            }
                        }
                    }
                    this._car = new physics.Car(this._context, this._world, x, y);

                    //
                    // ---------- イベント ---------- //
                    //
                    // 車の状態変更イベント
                    this._car.addEventListener(physics.event.PhysicsEvent.CHANGE_CAR_CONDITION_EVENT, function (evt) {
                        _this.dispatchEvent(imjcart.logic.physics.event.PhysicsEvent.CHANGE_CAR_CONDITION_EVENT, {
                            x: evt.x,
                            y: evt.y,
                            bodyAngle: evt.bodyAngle,
                            wheelAngle: evt.wheelAngle,
                            speed: evt.speed,
                            power: evt.power,
                            gear: evt.gear,
                            direction: evt.direction
                        });
                    });
                };

                Physics.prototype.update = function () {
                    if (this._isPause)
                        return;
                    this._car.update();
                    this._world.Step(1 / imjcart.logic.value.Const.FPS, 8, 3);
                    this._world.ClearForces();
                    if (imjcart.logic.value.Const.IS_PHYSICS_DEBUG_MODE) {
                        this._world.DrawDebugData();
                    }
                };

                Physics.prototype.startEngine = function (value) {
                    if (this._isPause)
                        return;
                    if (this._car)
                        this._car.startEngine(value);
                };

                Physics.prototype.stopEngine = function () {
                    if (this._isPause)
                        return;
                    if (this._car)
                        this._car.stopEngine();
                };

                Physics.prototype.setSteeringAngle = function (value) {
                    if (this._isPause)
                        return;
                    if (this._car)
                        this._car.setSteeringAngle(value);
                };

                Physics.prototype.clearSteeringAngle = function () {
                    if (this._isPause)
                        return;
                    if (this._car)
                        this._car.clearSteeringAngle();
                };

                // スピードに制限をかける
                Physics.prototype.setLimitSpeed = function () {
                    // スピードに制限をかける
                    if (this._car)
                        this._car.setLimitSpeed();
                };

                // スピードの制限をはずす
                Physics.prototype.clearLimitSpeed = function () {
                    // スピードの制限をはずす
                    if (this._car)
                        this._car.clearLimitSpeed();
                };

                // 一時停止
                Physics.prototype.pause = function () {
                    this._isPause = true;
                };

                // 再開
                Physics.prototype.resume = function () {
                    this._isPause = false;
                };

                // リトライ
                Physics.prototype.retry = function () {
                    this._car.remove();
                    this._car = null;

                    // 車生成
                    this.createCar();
                };
                return Physics;
            })(lib.event.EventDispacher);
            physics.Physics = Physics;
        })(logic.physics || (logic.physics = {}));
        var physics = logic.physics;
    })(imjcart.logic || (imjcart.logic = {}));
    var logic = imjcart.logic;
})(imjcart || (imjcart = {}));
