/// <reference path="../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../lib/three.d.ts"/>
/// <reference path="../../../../lib/lib.ts"/>
var imjcart;
(function (imjcart) {
    (function (logic) {
        (function (controller) {
            (function (event) {
                var ControllerEvent = (function () {
                    function ControllerEvent() {
                    }
                    ControllerEvent.START_ENGINE_EVENT = "start_engine_event";
                    ControllerEvent.STOP_ENGINE_EVENT = "stop_engine_event";
                    ControllerEvent.SET_STEERING_ANGLE_EVENT = "set_steering_angle_event";
                    ControllerEvent.CLEAR_STEERING_ANGLE_EVENT = "clear_steering_angle_event";
                    ControllerEvent.CHANGE_CAMERA_ANGLE_EVENT = "change_camera_angle_event";
                    return ControllerEvent;
                })();
                event.ControllerEvent = ControllerEvent;
            })(controller.event || (controller.event = {}));
            var event = controller.event;
        })(logic.controller || (logic.controller = {}));
        var controller = logic.controller;
    })(imjcart.logic || (imjcart.logic = {}));
    var logic = imjcart.logic;
})(imjcart || (imjcart = {}));
