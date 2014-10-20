/// <reference path="../../../lib/jquery.d.ts"/>
/// <reference path="../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../lib/three.d.ts"/>
/// <reference path="../../../lib/lib.ts"/>

module imjcart.logic.event {

    export class ProjectEvent {

        static CHANGE_SCENE_EVENT:string = "change_scene_event"; // シーン変更イベント
        static CHANGE_TIMEATACK_SCENE_EVENT:string = "change_timeatack_scene_event"; // タイムアタックシーン変更イベント
        static RENDER_CAR_EVENT:string = "render_car_event"; // 車の描画更新イベント
        static CHANGE_CAMERA_ANGLE_EVENT:string = "change_camera_angle_event"; // カメラアングル変更イベント
        static ADD_OTHER_CAR_EVENT:string = "add_other_car_event"; // 他の車追加イベント
        static REMOVE_OTHER_CAR_EVENT:string = "remove_other_car_event"; // 他の車削除イベント
        static RENDER_OTHER_CAR_EVENT:string = "render_other_car_event"; // 他の車の描画更新イベント
        static EMIT_ID_FROM_SERVER_EVENT:string = "emit_id_from_server_event"; // サーバーからソケットIDを取得したイベント
        static CONTROLLER_START_EVENT:string = "controller_start_event"; // コントローラー、開始イベント
        static CONTROLLER_ERROR_EVENT:string = "controller_error_event"; // コントローラー、エラー表示イベント
        static CHANGE_COLOR_EVENT:string = "change_color_event"; // カラー変更イベント
        static SET_NAME_EVENT:string = "set_name_event"; // 名前設定イベント
        static SET_FASTEST_LAP_EVENT:string = "set_fastest_lap_event"; // ファステストラップ設定
        static PAUSE_TIMEATTACK_EVENT:string = "pause_timeattack_event"; // タイムアタック一時停止イベント
        static RESUME_TIMEATTACK_EVENT:string = "resume_timeattack_event"; // タイムアタック再開イベント
        static RETRY_TIMEATTACK_EVENT:string = "retry_timeattack_event"; // タイムアタックリトライイベント
        static SAVE_LAPTIME_EVENT:string = "save_laptime_event"; // ラップタイム保存イベント
        static COMPLETE_SAVE_LAPTIME_EVENT:string = "complete_save_laptime_event"; // ラップタイム保存完了イベント
        static GET_RANKING_FROM_CLIENT_EVENT:string = "get_ranking_from_client_event"; // ランキングデータリクエストイベント
        static GET_RANKING_FROM_SERVER_EVENT:string = "get_ranking_from_server_event"; // ランキングデータ受信イベント

    }

}