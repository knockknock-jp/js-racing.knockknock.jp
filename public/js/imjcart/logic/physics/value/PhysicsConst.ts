/// <reference path="../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../lib/three.d.ts"/>
/// <reference path="../../../../lib/lib.ts"/>

module imjcart.logic.physics.value {

    export class PhysicsConst {

        static MAX_STEER_ANGLE:number = Math.PI / 8; // タイヤの最大角度
        //static FORWARD_ENGINE_SPEED:number = 0.001; // 最高速
        static FORWARD_ENGINE_SPEED:number = 0.00001; // 最高速
        //static BACK_ENGINE_SPEED:number = 0.0005; // 最高速
        static BACK_ENGINE_SPEED:number = 0.000005; // 最高速
        static CAR_LINEAR_DAMPING:number = 2; // 小さいほど直線速度の減衰が小さくなる
        //static CAR_LINEAR_DAMPING:number = 50; // 小さいほど直線速度の減衰が小さくなる
        static CAR_ANGULAR_DAMPING:number = 30; // 小さいほど角速度の減衰が小さくなる
        //static CAR_GEAR_MAX:number = 11; // ギアの最大値
        static CAR_GEAR_MAX:number = 1100; // ギアの最大値
        static CAR_GEAR_BACK_MAX:number = 200; // ギアの最大値
        static CAR_SHIFTUP_SPEED:number = 6; // シフトアップのスピード
        static CAR_SHIFTDOWN_SPEED:number = 2; // シフトダウンのスピード

    }

}