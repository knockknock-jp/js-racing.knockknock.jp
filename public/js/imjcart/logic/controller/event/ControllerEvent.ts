/// <reference path="../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../lib/three.d.ts"/>
/// <reference path="../../../../lib/lib.ts"/>

module imjcart.logic.controller.event {

    export class ControllerEvent {

        static START_ENGINE_EVENT:string = "start_engine_event";
        static STOP_ENGINE_EVENT:string = "stop_engine_event";
        static SET_STEERING_ANGLE_EVENT:string = "set_steering_angle_event";
        static CLEAR_STEERING_ANGLE_EVENT:string = "clear_steering_angle_event";
        static CHANGE_CAMERA_ANGLE_EVENT:string = "change_camera_angle_event";

    }

}