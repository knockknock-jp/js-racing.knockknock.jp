/// <reference path="../../../lib/jquery.d.ts"/>
/// <reference path="../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../lib/three.d.ts"/>
/// <reference path="../../../lib/lib.ts"/>
/// <reference path="../../../imjcart/logic/physics/Box.ts"/>
/// <reference path="../../../imjcart/logic/physics/value/PhysicsConst.ts"/>
/// <reference path="../../../imjcart/logic/physics/event/PhysicsEvent.ts"/>

module imjcart.logic.physics {

    export class Car extends lib.event.EventDispacher {

        private _context:any = null;
        private _world:Box2D.Dynamics.b2World = null;
        private _x:number = null;
        private _y:number = null;
        private _isOnEngine:boolean = false;
        private _enginePower:number = 0;
        private _engineDirection:number = 0;
        private _gear:number = 0;
        private _body:any = null;
        private _frontLeftWheel:any = null;
        private _frontRightWheel:any = null;
        private _rearLeftWheel:any = null;
        private _rearRightWheel:any = null;
        private _steeringAngle:number = 0;
        private _steerSpeed:number = 1;
        private _frontWheels:any = [];
        private _rearWheels:any = [];
        private _frontWheelJoints:any = [];
        private _intervalId:number = null;
        private _isLimitMode:boolean = false;
        private _limitGearVolume:number = null;

        constructor(context:any, world:Box2D.Dynamics.b2World, x:number, y:number) {
            super();
            this._context = context;
            this._world = world;
            this._x = x;
            this._y = y;
            // 車体
            var carWidth = 4;
            var carHeight = 13;
            var wheelWidth = 2;
            var wheelHeight = 2;
            this._body = new Box(this._context, this._world, this._x, this._y, carWidth, carHeight, {
                linearDamping: value.PhysicsConst.CAR_LINEAR_DAMPING,
                angularDamping: value.PhysicsConst.CAR_ANGULAR_DAMPING
            }).body;
            // フロントホイール
            this._frontLeftWheel = new Box(this._context, this._world, this._x - carWidth / 2, this._y - carHeight / 3, wheelWidth, wheelHeight, {}).body;
            this._frontRightWheel = new Box(this._context, this._world, this._x + carWidth / 2, this._y - carHeight / 3, wheelWidth, wheelHeight, {}).body;
            this._frontWheels.push(this._frontLeftWheel);
            this._frontWheels.push(this._frontRightWheel);
            // リアホイール
            this._rearLeftWheel = new Box(this._context, this._world, this._x - carWidth / 2, this._y + carHeight / 4, wheelWidth, wheelHeight, {}).body;
            this._rearRightWheel = new Box(this._context, this._world, this._x + carWidth / 2, this._y + carHeight / 4, wheelWidth, wheelHeight, {}).body;
            this._rearWheels.push(this._rearLeftWheel);
            this._rearWheels.push(this._rearRightWheel);
            // フロントホイールジョイント
            var wheel:any = null;
            var jointDef:any = null;
            var i = 0, max;
            for (i = 0, max = this._frontWheels.length; i < max; i = i + 1) {
                wheel = this._frontWheels[i];
                jointDef = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
                jointDef.Initialize(this._body, wheel, wheel.GetWorldCenter()); // つながれる2つの物体と，つなぐ位置（前輪の中央）を使って，定義を初期化する
                jointDef.enableMotor = true; // 車輪を回すようにする
                jointDef.maxMotorTorque = 100000; // トルクの設定（大きいほど坂道に強くなる）
                jointDef.enableLimit = true; // 可動範囲設定
                jointDef.lowerAngle = -1 * value.PhysicsConst.MAX_STEER_ANGLE; // 可動範囲下限(m)
                jointDef.upperAngle = value.PhysicsConst.MAX_STEER_ANGLE; // 可動範囲上限(m)
                this._frontWheelJoints.push(this._world.CreateJoint(jointDef));
            }
            // リアホイールジョイント
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

        public update() {
            // 力
            var i = 0, max;
            for (i = 0, max = this._frontWheels.length; i < max; i = i + 1) {
                var wheel = this._frontWheels[i];
                var direction = wheel.GetTransform().R.col2.Copy();
                direction.Multiply(this._enginePower);
                wheel.ApplyForce(direction, wheel.GetPosition());
            }
            // 角度
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
        }

        public startEngine(value:number) {
            if (this._engineDirection != value) this._gear = 0; // 前進、後退が変わったらギアを初期化
            this._engineDirection = value;
            if (!this._isOnEngine) {
                this._isOnEngine = true;
                if (this._intervalId) clearInterval(this._intervalId);
                this._intervalId = setInterval(() => {
                    this._shiftUp();
                }, imjcart.logic.physics.value.PhysicsConst.CAR_SHIFTUP_SPEED);
                this._shiftUp();
            }
        }

        public stopEngine() {
            if (this._isOnEngine) {
                this._isOnEngine = false;
                if (this._intervalId) clearInterval(this._intervalId);
                this._intervalId = setInterval(() => {
                    this._shiftDown();
                }, value.PhysicsConst.CAR_SHIFTDOWN_SPEED);
                this._shiftDown();
            }
        }

        public setSteeringAngle(value:number) {
            this._steeringAngle = -value;
            this._steerSpeed = 1;
        }

        public clearSteeringAngle() {
            this._steeringAngle = 0;
            this._steerSpeed = 8;
        }

        private _shiftUp() {
            if (this._isLimitMode) {
                this._gear += 1;
                if (this._limitGearVolume <= this._gear) {
                    this._gear = this._limitGearVolume;
                }
            } else {
                this._gear += 1;
                if (1 <= this._engineDirection) {
                    if (value.PhysicsConst.CAR_GEAR_MAX <= this._gear) {
                        this._gear = value.PhysicsConst.CAR_GEAR_MAX;
                    }
                } else {
                    if (value.PhysicsConst.CAR_GEAR_BACK_MAX <= this._gear) {
                        this._gear = value.PhysicsConst.CAR_GEAR_BACK_MAX;
                    }
                }
            }
            if (0 < this._engineDirection) {
                this._enginePower = -this._gear * value.PhysicsConst.FORWARD_ENGINE_SPEED * this._engineDirection;
            } else {
                this._enginePower = -this._gear * value.PhysicsConst.BACK_ENGINE_SPEED * this._engineDirection;
            }
        }

        private _shiftDown() {
            var gear = this._gear - 1;
            if (0 <= gear) {
                this._gear = gear;
                //this._enginePower = 0;
            }
            if (0 < this._engineDirection) {
                this._enginePower = -this._gear * value.PhysicsConst.FORWARD_ENGINE_SPEED * this._engineDirection;
            } else {
                this._enginePower = -this._gear * value.PhysicsConst.BACK_ENGINE_SPEED * this._engineDirection;
            }
        }

        // スピードに制限をかける
        public setLimitSpeed() {
            this._isLimitMode = true;
            this._limitGearVolume = Math.floor(this._gear * 0.6);
            if (this._limitGearVolume <= 100) this._limitGearVolume = 100;
            this._gear = this._limitGearVolume;
            this._shiftUp();
        }

        // スピードの制限をはずす
        public clearLimitSpeed() {
            this._isLimitMode = false;
            this._shiftUp();
        }

        // 削除
        public remove() {
            this._world.DestroyBody(this._body);
            this._world.DestroyBody(this._frontLeftWheel);
            this._world.DestroyBody(this._frontRightWheel);
            this._world.DestroyBody(this._rearLeftWheel);
            this._world.DestroyBody(this._rearRightWheel);
        }

    }

}