/// <reference path="../../../lib/jquery.d.ts"/>
/// <reference path="../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../lib/three.d.ts"/>
/// <reference path="../../../lib/lib.ts"/>

module imjcart.logic.value {

    export class Const {

        //static IS_VIEW3D_DEBUG_MODE:boolean = true;
        static IS_VIEW3D_DEBUG_MODE:boolean = false;
        //static IS_PHYSICS_DEBUG_MODE:boolean = true;
        static IS_PHYSICS_DEBUG_MODE:boolean = false;
        static IS_SHADOW_ENABLED:boolean = false;
        //static IS_SHADOW_ENABLED:boolean = true;
        static IS_BUMPMAP_ENABLED:boolean = false;
        //static IS_BUMPMAP_ENABLED:boolean = true;
        static FPS:number = 30;
        static STAGE_WIDTH:number = 800;
        static STAGE_HEIGHT:number = 600;
        static ID_SCENE_OPENING:string = "id_scene_opening";
        static ID_SCENE_TIMEATACK:string = "id_scene_timeatack";
        static ID_SCENE_TIMEATACK_RUN:string = "id_scene_timeatack_run";
        //
        static COURSE_MAP_SCALE:number = 10; // コースマップのスケール
        static LAP_TIME_LIST_MAX:number = 5; // ラップタイムを最大いくつまで表示させるか
        //
        static SOCKET_EMIT_OTHER_CARS_CONDITION_FPS:number = 4; // 自車の情報送信と他車の情報受信のフレームレート
        //
        static CONTROLLER_URL:string = "http://js-racing.knockknock.jp:3000/controller.html";
        static BITLY_USERNAME:string = "knockknock0912";
        static BITLY_API_KEY:string = "R_41ed8c9ea9b83700a848aab57a379f86";
        // スマフォコントローラーのイベント
        static CONTROLLER_EVENT_KEY_PLAY:string = "play";
        static CONTROLLER_EVENT_KEY_START_ENGINE:string = "start_engine";
        static CONTROLLER_EVENT_KEY_STOP_ENGINE:string = "stop_engine";
        static CONTROLLER_EVENT_KEY_SET_STEERING_ANGLE:string = "set_steering_angle";
        static CONTROLLER_EVENT_KEY_CLEAR_STEERING_ANGLE:string = "clear_steering_angle";
        static CONTROLLER_EVENT_KEY_CHANGE_CAMERA_ANGLE:string = "change_camera_angle";
        // カラー変更箇所
        static ID_COLOR_BODY:string = "id_color_body";
        static ID_COLOR_WING:string = "id_color_wing";
        static ID_COLOR_DRIVER:string = "id_color_driver";
        static DEFAULT_BODY_COLOR:string = "#cc0000";
        static DEFAULT_WING_COLOR:string = "#ffffff";
        static DEFAULT_DRIVER_COLOR:string = "#ff6600";
        //
        static FOOTER_HEIGHT:number = 30; // フッターの高さ
        static RANKING_HEIGHT:number = 120; // ランキングの高さ
        //
        static TWEET_HASHTAG:string = "jsracing"; //
        static TWEET_URL:string = "http://js-racing.knockknock.jp"; //
        //
        static MAX_GHOST_COUNT:number = 5; // ゴーストを最大いくつ表示するか（10件中）

    }

}