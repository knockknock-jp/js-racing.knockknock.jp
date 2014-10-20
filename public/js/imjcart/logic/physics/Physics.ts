/// <reference path="../../../lib/jquery.d.ts"/>
/// <reference path="../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../lib/three.d.ts"/>
/// <reference path="../../../lib/lib.ts"/>
/// <reference path="../../../imjcart/logic/value/Const.ts"/>
/// <reference path="../../../imjcart/logic/physics/Car.ts"/>
/// <reference path="../../../imjcart/logic/physics/Obstacles.ts"/>
/// <reference path="../../../imjcart/logic/physics/value/PhysicsConst.ts"/>

module imjcart.logic.physics {

    export class Physics extends lib.event.EventDispacher {

        private _$target:JQuery = null;
        private _context:any = null;
        private _world:Box2D.Dynamics.b2World = null;
        private _obstacles:Obstacles = null;
        private _car:Car = null;
        private _isPause:boolean = false;

        constructor($target:JQuery) {
            super();
            this._$target = $target;
            // コンテキスト
            this._context = this._$target.get(0).getContext("2d");
            // 世界
            this._world = new Box2D.Dynamics.b2World(new Box2D.Common.Math.b2Vec2(0, 0), true);
            // 障害物
            this._obstacles = new Obstacles(this._context, this._world);
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
        public createCar() {
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
            this._car = new Car(this._context, this._world, x, y);
            //
            // ---------- イベント ---------- //
            //
            // 車の状態変更イベント
            this._car.addEventListener(event.PhysicsEvent.CHANGE_CAR_CONDITION_EVENT, (evt) => {
                this.dispatchEvent(imjcart.logic.physics.event.PhysicsEvent.CHANGE_CAR_CONDITION_EVENT, {
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
        }

        public update() {
            if (this._isPause) return;
            this._car.update();
            this._world.Step(1 / imjcart.logic.value.Const.FPS, 8, 3);
            this._world.ClearForces();
            if (imjcart.logic.value.Const.IS_PHYSICS_DEBUG_MODE) {
                this._world.DrawDebugData();
            }
        }

        public startEngine(value:number) {
            if (this._isPause) return;
            if (this._car) this._car.startEngine(value);
        }

        public stopEngine() {
            if (this._isPause) return;
            if (this._car) this._car.stopEngine();
        }

        public setSteeringAngle(value:number) {
            if (this._isPause) return;
            if (this._car) this._car.setSteeringAngle(value);
        }

        public clearSteeringAngle() {
            if (this._isPause) return;
            if (this._car) this._car.clearSteeringAngle();
        }

        // スピードに制限をかける
        public setLimitSpeed() {
            // スピードに制限をかける
            if (this._car) this._car.setLimitSpeed();
        }

        // スピードの制限をはずす
        public clearLimitSpeed() {
            // スピードの制限をはずす
            if (this._car) this._car.clearLimitSpeed();
        }

        // 一時停止
        public pause() {
            this._isPause = true;
        }

        // 再開
        public resume() {
            this._isPause = false;
        }

        // リトライ
        public retry() {
            this._car.remove();
            this._car = null;
            // 車生成
            this.createCar();
        }

    }

}