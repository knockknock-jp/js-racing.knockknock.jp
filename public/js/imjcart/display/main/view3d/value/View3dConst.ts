/// <reference path="../../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../../lib/three.d.ts"/>
/// <reference path="../../../../../lib/lib.ts"/>

module imjcart.display.main.view3d.value {

    export class View3dConst {

        static CAMERA_MODE_OPENING:string = "camera_mode_opening"; // カメラモード（オープニング）
        static CAMERA_MODE_TIMEATACK_RUN:string = "camera_mode_timeatack_run"; // カメラモード（タイムアタック・走行）
        //
        static CAMERA_ANGLE_TOP:string = "camera_angle_top"; // カメラアングル（車の上から）
        static CAMERA_ANGLE_BACK:string = "camera_angle_back"; // カメラアングル（車の後方から）
        static CAMERA_ANGLE_INSIDE:string = "camera_angle_inside"; // カメラアングル（運転席）
        static CAMERA_ANGLE_DEFAULT:string = View3dConst.CAMERA_ANGLE_BACK;
        //
        static AMBIENT_COLOR:number = 0x666666;

    }

}