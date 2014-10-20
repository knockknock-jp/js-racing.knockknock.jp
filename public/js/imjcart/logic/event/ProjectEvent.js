/// <reference path="../../../lib/jquery.d.ts"/>
/// <reference path="../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../lib/three.d.ts"/>
/// <reference path="../../../lib/lib.ts"/>
var imjcart;
(function (imjcart) {
    (function (logic) {
        (function (event) {
            var ProjectEvent = (function () {
                function ProjectEvent() {
                }
                ProjectEvent.CHANGE_SCENE_EVENT = "change_scene_event";
                ProjectEvent.CHANGE_TIMEATACK_SCENE_EVENT = "change_timeatack_scene_event";
                ProjectEvent.RENDER_CAR_EVENT = "render_car_event";
                ProjectEvent.CHANGE_CAMERA_ANGLE_EVENT = "change_camera_angle_event";
                ProjectEvent.ADD_OTHER_CAR_EVENT = "add_other_car_event";
                ProjectEvent.REMOVE_OTHER_CAR_EVENT = "remove_other_car_event";
                ProjectEvent.RENDER_OTHER_CAR_EVENT = "render_other_car_event";
                ProjectEvent.EMIT_ID_FROM_SERVER_EVENT = "emit_id_from_server_event";
                ProjectEvent.CONTROLLER_START_EVENT = "controller_start_event";
                ProjectEvent.CONTROLLER_ERROR_EVENT = "controller_error_event";
                ProjectEvent.CHANGE_COLOR_EVENT = "change_color_event";
                ProjectEvent.SET_NAME_EVENT = "set_name_event";
                ProjectEvent.SET_FASTEST_LAP_EVENT = "set_fastest_lap_event";
                ProjectEvent.PAUSE_TIMEATTACK_EVENT = "pause_timeattack_event";
                ProjectEvent.RESUME_TIMEATTACK_EVENT = "resume_timeattack_event";
                ProjectEvent.RETRY_TIMEATTACK_EVENT = "retry_timeattack_event";
                ProjectEvent.SAVE_LAPTIME_EVENT = "save_laptime_event";
                ProjectEvent.COMPLETE_SAVE_LAPTIME_EVENT = "complete_save_laptime_event";
                ProjectEvent.GET_RANKING_FROM_CLIENT_EVENT = "get_ranking_from_client_event";
                ProjectEvent.GET_RANKING_FROM_SERVER_EVENT = "get_ranking_from_server_event";
                return ProjectEvent;
            })();
            event.ProjectEvent = ProjectEvent;
        })(logic.event || (logic.event = {}));
        var event = logic.event;
    })(imjcart.logic || (imjcart.logic = {}));
    var logic = imjcart.logic;
})(imjcart || (imjcart = {}));
