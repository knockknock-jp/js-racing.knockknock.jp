/// <reference path="../../../lib/jquery.d.ts"/>
/// <reference path="../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../lib/three.d.ts"/>
/// <reference path="../../../lib/lib.ts"/>
/// <reference path="../../../imjcart/logic/physics/Box.ts"/>
/// <reference path="../../../imjcart/logic/physics/value/PhysicsConst.ts"/>
/// <reference path="../../../imjcart/logic/physics/event/PhysicsEvent.ts"/>
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
            var Car = (function (_super) {
                __extends(Car, _super);
                function Car(context, world, x, y) {
                    _super.call(this);
                    this._context = null;
                    this._world = null;
                    this._x = null;
                    this._y = null;
                    this._isOnEngine = false;
                    this._enginePower = 0;
                    this._engineDirection = 0;
                    this._gear = 0;
                    this._body = null;
                    this._frontLeftWheel = null;
                    this._frontRightWheel = null;
                    this._rearLeftWheel = null;
                    this._rearRightWheel = null;
                    this._steeringAngle = 0;
                    this._steerSpeed = 1;
                    this._frontWheels = [];
                    this._rearWheels = [];
                    this._frontWheelJoints = [];
                    this._intervalId = null;
                    this._isLimitMode = false;
                    this._limitGearVolume = null;
                    this._context = context;
                    this._world = world;
                    this._x = x;
                    this._y = y;

                    // 車体
                    var carWidth = 4;
                    var carHeight = 13;
                    var wheelWidth = 2;
                    var wheelHeight = 2;
                    this._body = new physics.Box(this._context, this._world, this._x, this._y, carWidth, carHeight, {
                        linearDamping: physics.value.PhysicsConst.CAR_LINEAR_DAMPING,
                        angularDamping: physics.value.PhysicsConst.CAR_ANGULAR_DAMPING
                    }).body;

                    // フロントホイール
                    this._frontLeftWheel = new physics.Box(this._context, this._world, this._x - carWidth / 2, this._y - carHeight / 3, wheelWidth, wheelHeight, {}).body;
                    this._frontRightWheel = new physics.Box(this._context, this._world, this._x + carWidth / 2, this._y - carHeight / 3, wheelWidth, wheelHeight, {}).body;
                    this._frontWheels.push(this._frontLeftWheel);
                    this._frontWheels.push(this._frontRightWheel);

                    // リアホイール
                    this._rearLeftWheel = new physics.Box(this._context, this._world, this._x - carWidth / 2, this._y + carHeight / 4, wheelWidth, wheelHeight, {}).body;
                    this._rearRightWheel = new physics.Box(this._context, this._world, this._x + carWidth / 2, this._y + carHeight / 4, wheelWidth, wheelHeight, {}).body;
                    this._rearWheels.push(this._rearLeftWheel);
                    this._rearWheels.push(this._rearRightWheel);

                    // フロントホイールジョイント
                    var wheel = null;
                    var jointDef = null;
                    var i = 0, max;
                    for (i = 0, max = this._frontWheels.length; i < max; i = i + 1) {
                        wheel = this._frontWheels[i];
                        jointDef = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
                        jointDef.Initialize(this._body, wheel, wheel.GetWorldCenter()); // つながれる2つの物体と，つなぐ位置（前輪の中央）を使って，定義を初期化する
                        jointDef.enableMotor = true; // 車輪を回すようにする
                        jointDef.maxMotorTorque = 100000; // トルクの設定（大きいほど坂道に強くなる）
                        jointDef.enableLimit = true; // 可動範囲設定
                        jointDef.lowerAngle = -1 * physics.value.PhysicsConst.MAX_STEER_ANGLE; // 可動範囲下限(m)
                        jointDef.upperAngle = physics.value.PhysicsConst.MAX_STEER_ANGLE; // 可動範囲上限(m)
                        this._frontWheelJoints.push(this._world.CreateJoint(jointDef));
                    }

                    for (i = 0, max = this._rearWheels.length; i < max; i = i + 1) {
                        wheel = this._rearWheels[i];
                        jointDef = new Box2D.Dynamics.Joints.b2PrismaticJointDef();
                        jointDef.Initialize(this._body, wheel, wheel.GetWorldCenter(), new Box2D.Common.Math.b2Vec2(1, 0));
                        jointDef.enableLimit = true; // 可動範囲設定
                        jointDef.lowerTranslation = 0; // 可動範囲下限(m)
                        jointDef.upperTranslation = 0; // 可動範囲上限(m)
                        this._world.CreateJoint(jointDef);
                    }
                }
                Car.prototype.update = function () {
                    // 力
                    var i = 0, max;
                    for (i = 0, max = this._frontWheels.length; i < max; i = i + 1) {
                        var wheel = this._frontWheels[i];
                        var direction = wheel.GetTransform().R.col2.Copy();
                        direction.Multiply(this._enginePower);
                        wheel.ApplyForce(direction, wheel.GetPosition());
                    }

                    for (i = 0, max = this._frontWheelJoints.length; i < max; i = i + 1) {
                        var wheelJoint = this._frontWheelJoints[i];
                        var angleDiff = this._steeringAngle - wheelJoint.GetJointAngle();
                        wheelJoint.SetMotorSpeed(angleDiff * this._steerSpeed);
                    }

                    // 車の状態変更イベント
                    var position = this._body.GetPosition();
                    var velocity = this._body.GetLinearVelocity();
                    var speedX = Math.abs(velocity.x);
                    var speedY = Math.abs(velocity.y);
                    var speed = 0;
                    if (speedX < speedY) {
                        speed = speedY;
                    } else {
                        speed = speedX;
                    }
                    this.dispatchEvent(imjcart.logic.physics.event.PhysicsEvent.CHANGE_CAR_CONDITION_EVENT, {
                        x: position.x,
                        y: position.y,
                        bodyAngle: this._body.GetAngle(),
                        wheelAngle: this._frontWheelJoints[0].GetJointAngle(),
                        //speed: Math.abs(this._body.GetLinearVelocity().x) + Math.abs(this._body.GetLinearVelocity().y),
                        speed: speed,
                        power: this._enginePower,
                        gear: this._gear,
                        direction: this._engineDirection
                    });
                };

                Car.prototype.startEngine = function (value) {
                    var _this = this;
                    if (this._engineDirection != value)
                        this._gear = 0; // 前進、後退が変わったらギアを初期化
                    this._engineDirection = value;
                    if (!this._isOnEngine) {
                        this._isOnEngine = true;
                        if (this._intervalId)
                            clearInterval(this._intervalId);
                        this._intervalId = setInterval(function () {
                            _this._shiftUp();
                        }, imjcart.logic.physics.value.PhysicsConst.CAR_SHIFTUP_SPEED);
                        this._shiftUp();
                    }
                };

                Car.prototype.stopEngine = function () {
                    var _this = this;
                    if (this._isOnEngine) {
                        this._isOnEngine = false;
                        if (this._intervalId)
                            clearInterval(this._intervalId);
                        this._intervalId = setInterval(function () {
                            _this._shiftDown();
                        }, physics.value.PhysicsConst.CAR_SHIFTDOWN_SPEED);
                        this._shiftDown();
                    }
                };

                Car.prototype.setSteeringAngle = function (value) {
                    this._steeringAngle = -value;
                    this._steerSpeed = 1;
                };

                Car.prototype.clearSteeringAngle = function () {
                    this._steeringAngle = 0;
                    this._steerSpeed = 8;
                };

                Car.prototype._shiftUp = function () {
                    if (this._isLimitMode) {
                        this._gear += 1;
                        if (this._limitGearVolume <= this._gear) {
                            this._gear = this._limitGearVolume;
                        }
                    } else {
                        this._gear += 1;
                        if (1 <= this._engineDirection) {
                            if (physics.value.PhysicsConst.CAR_GEAR_MAX <= this._gear) {
                                this._gear = physics.value.PhysicsConst.CAR_GEAR_MAX;
                            }
                        } else {
                            if (physics.value.PhysicsConst.CAR_GEAR_BACK_MAX <= this._gear) {
                                this._gear = physics.value.PhysicsConst.CAR_GEAR_BACK_MAX;
                            }
                        }
                    }
                    if (0 < this._engineDirection) {
                        this._enginePower = -this._gear * physics.value.PhysicsConst.FORWARD_ENGINE_SPEED * this._engineDirection;
                    } else {
                        this._enginePower = -this._gear * physics.value.PhysicsConst.BACK_ENGINE_SPEED * this._engineDirection;
                    }
                };

                Car.prototype._shiftDown = function () {
                    var gear = this._gear - 1;
                    if (0 <= gear) {
                        this._gear = gear;
                        //this._enginePower = 0;
                    }
                    if (0 < this._engineDirection) {
                        this._enginePower = -this._gear * physics.value.PhysicsConst.FORWARD_ENGINE_SPEED * this._engineDirection;
                    } else {
                        this._enginePower = -this._gear * physics.value.PhysicsConst.BACK_ENGINE_SPEED * this._engineDirection;
                    }
                };

                // スピードに制限をかける
                Car.prototype.setLimitSpeed = function () {
                    this._isLimitMode = true;
                    this._limitGearVolume = Math.floor(this._gear * 0.6);
                    if (this._limitGearVolume <= 100)
                        this._limitGearVolume = 100;
                    this._gear = this._limitGearVolume;
                    this._shiftUp();
                };

                // スピードの制限をはずす
                Car.prototype.clearLimitSpeed = function () {
                    this._isLimitMode = false;
                    this._shiftUp();
                };

                // 削除
                Car.prototype.remove = function () {
                    this._world.DestroyBody(this._body);
                    this._world.DestroyBody(this._frontLeftWheel);
                    this._world.DestroyBody(this._frontRightWheel);
                    this._world.DestroyBody(this._rearLeftWheel);
                    this._world.DestroyBody(this._rearRightWheel);
                };
                return Car;
            })(lib.event.EventDispacher);
            physics.Car = Car;
        })(logic.physics || (logic.physics = {}));
        var physics = logic.physics;
    })(imjcart.logic || (imjcart.logic = {}));
    var logic = imjcart.logic;
})(imjcart || (imjcart = {}));
