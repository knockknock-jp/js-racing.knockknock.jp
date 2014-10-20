/// <reference path="../../../lib/jquery.d.ts"/>
/// <reference path="../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../lib/three.d.ts"/>
/// <reference path="../../../lib/lib.ts"/>
var imjcart;
(function (imjcart) {
    (function (logic) {
        (function (value) {
            var Const = (function () {
                function Const() {
                }
                Const.IS_VIEW3D_DEBUG_MODE = false;

                Const.IS_PHYSICS_DEBUG_MODE = false;
                Const.IS_SHADOW_ENABLED = false;

                Const.IS_BUMPMAP_ENABLED = false;

                Const.FPS = 30;
                Const.STAGE_WIDTH = 800;
                Const.STAGE_HEIGHT = 600;
                Const.ID_SCENE_OPENING = "id_scene_opening";
                Const.ID_SCENE_TIMEATACK = "id_scene_timeatack";
                Const.ID_SCENE_TIMEATACK_RUN = "id_scene_timeatack_run";

                Const.COURSE_MAP_SCALE = 10;
                Const.LAP_TIME_LIST_MAX = 5;

                Const.SOCKET_EMIT_OTHER_CARS_CONDITION_FPS = 4;

                Const.CONTROLLER_URL = "http://js-racing.knockknock.jp:3000/controller.html";
                Const.BITLY_USERNAME = "knockknock0912";
                Const.BITLY_API_KEY = "R_41ed8c9ea9b83700a848aab57a379f86";

                Const.CONTROLLER_EVENT_KEY_PLAY = "play";
                Const.CONTROLLER_EVENT_KEY_START_ENGINE = "start_engine";
                Const.CONTROLLER_EVENT_KEY_STOP_ENGINE = "stop_engine";
                Const.CONTROLLER_EVENT_KEY_SET_STEERING_ANGLE = "set_steering_angle";
                Const.CONTROLLER_EVENT_KEY_CLEAR_STEERING_ANGLE = "clear_steering_angle";
                Const.CONTROLLER_EVENT_KEY_CHANGE_CAMERA_ANGLE = "change_camera_angle";

                Const.ID_COLOR_BODY = "id_color_body";
                Const.ID_COLOR_WING = "id_color_wing";
                Const.ID_COLOR_DRIVER = "id_color_driver";
                Const.DEFAULT_BODY_COLOR = "#cc0000";
                Const.DEFAULT_WING_COLOR = "#ffffff";
                Const.DEFAULT_DRIVER_COLOR = "#ff6600";

                Const.FOOTER_HEIGHT = 30;
                Const.RANKING_HEIGHT = 120;

                Const.TWEET_HASHTAG = "jsracing";
                Const.TWEET_URL = "http://js-racing.knockknock.jp";

                Const.MAX_GHOST_COUNT = 5;
                return Const;
            })();
            value.Const = Const;
        })(logic.value || (logic.value = {}));
        var value = logic.value;
    })(imjcart.logic || (imjcart.logic = {}));
    var logic = imjcart.logic;
})(imjcart || (imjcart = {}));
