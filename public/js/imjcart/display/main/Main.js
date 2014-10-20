/// <reference path="../../../lib/jquery.d.ts"/>
/// <reference path="../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../lib/three.d.ts"/>
/// <reference path="../../../lib/lib.ts"/>
/// <reference path="../../../imjcart/logic/socket/SocketMain.ts"/>
/// <reference path="../../../imjcart/logic/value/Const.ts"/>
/// <reference path="../../../imjcart/logic/value/GlobalValue.ts"/>
/// <reference path="../../../imjcart/logic/event/ProjectEvent.ts"/>
/// <reference path="../../../imjcart/logic/info/OtherCarInfo.ts"/>
/// <reference path="../../../imjcart/logic/info/LapTimeInfo.ts"/>
/// <reference path="../../../imjcart/display/main/view3d/View3d.ts"/>
/// <reference path="../../../imjcart/display/main/scene/Scene.ts"/>
/// <reference path="../../../imjcart/display/main/ranking/Ranking.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var imjcart;
(function (imjcart) {
    (function (display) {
        (function (main) {
            var Main = (function (_super) {
                __extends(Main, _super);
                function Main(target) {
                    var _this = this;
                    _super.call(this, target);
                    this._displayImpl = null;
                    this._view3d = null;
                    this._scene = null;
                    this._ranking = null;
                    this._socket = null;

                    //
                    var values = imjcart.logic.value.GlobalValue.getInstance();
                    values.main = this;

                    // socket.io
                    this._socket = new imjcart.logic.socket.SocketMain();

                    // 3D表示
                    this._view3d = new main.view3d.View3d($("#view3d"));

                    // シーン
                    this._scene = new main.scene.Scene($("#scene"));

                    // ランキング
                    this._ranking = new main.ranking.Ranking($("#ranking"));

                    //
                    this._displayImpl = new lib.display.SimpleDisplayImpl(this.$target);
                    this._displayImpl.addEventListener(lib.event.Event.DISPLAY_START_OPEN_EVENT, function () {
                        lib.responisive.ResizeManager.getInstance().addEventListener(_this);
                        lib.responisive.ResizeManager.getInstance().dispatchEvent(_this);
                    });
                    this._displayImpl.addEventListener(lib.event.Event.DISPLAY_COMPLETE_OPEN_EVENT, function () {
                        _this._scene.open();
                        _this._view3d.open();
                        _this._ranking.open();

                        // シーン変更イベント
                        var values = imjcart.logic.value.GlobalValue.getInstance();
                        values.main.dispatchEvent(imjcart.logic.event.ProjectEvent.CHANGE_SCENE_EVENT, { id: imjcart.logic.value.Const.ID_SCENE_OPENING });
                    });

                    //
                    // ---------- イベント ---------- //
                    //
                    // シーン変更イベント
                    this.addEventListener(imjcart.logic.event.ProjectEvent.CHANGE_SCENE_EVENT, function (evt) {
                        var values = imjcart.logic.value.GlobalValue.getInstance();
                        if (values.currentSceneId && values.currentSceneId == evt.id)
                            return;
                        if (values.currentSceneId) {
                            values.pastSceneId = values.currentSceneId;
                        }
                        values.currentSceneId = evt.id;

                        // シーン変更
                        _this._scene.changeScene();

                        // シーン変更
                        _this._view3d.changeScene();
                    });

                    // タイムアタックシーン変更イベント
                    this.addEventListener(imjcart.logic.event.ProjectEvent.CHANGE_TIMEATACK_SCENE_EVENT, function (evt) {
                        var values = imjcart.logic.value.GlobalValue.getInstance();
                        if (values.currentTimeAtackSceneId && values.currentTimeAtackSceneId == evt.id)
                            return;
                        if (values.currentTimeAtackSceneId) {
                            values.pastTimeAtackSceneId = values.currentTimeAtackSceneId;
                        }
                        values.currentTimeAtackSceneId = evt.id;

                        // タイムアタックシーン変更
                        _this._scene.changeTimeAtackScene();

                        // タイムアタックシーン変更
                        _this._view3d.changeTimeAtackScene();
                    });

                    // カラー変更イベント
                    this.addEventListener(imjcart.logic.event.ProjectEvent.CHANGE_COLOR_EVENT, function (evt) {
                        var values = imjcart.logic.value.GlobalValue.getInstance();
                        switch (evt.id) {
                            case imjcart.logic.value.Const.ID_COLOR_BODY:
                                values.colorBody = evt.color;

                                // ボディカラー変更
                                _this._scene.changeColorBody();
                                break;
                            case imjcart.logic.value.Const.ID_COLOR_WING:
                                values.colorWing = evt.color;

                                // ウィングカラー変更
                                _this._scene.changeColorWing();
                                break;
                            case imjcart.logic.value.Const.ID_COLOR_DRIVER:
                                values.colorDriver = evt.color;

                                // ドライバーカラー変更
                                _this._scene.changeColorDriver();
                                break;
                        }
                    });

                    // 車の描画更新イベント
                    this.addEventListener(imjcart.logic.event.ProjectEvent.RENDER_CAR_EVENT, function (evt) {
                        // 車の姿勢更新
                        _this._view3d.updateCarPosture();

                        // 車の姿勢更新
                        _this._socket.setCarCondition();
                    });

                    // カメラアングル変更イベント
                    this.addEventListener(imjcart.logic.event.ProjectEvent.CHANGE_CAMERA_ANGLE_EVENT, function (evt) {
                        // カメラアングル変更
                        _this._view3d.changeCameraAngle();
                    });

                    // 他の車追加イベント
                    this.addEventListener(imjcart.logic.event.ProjectEvent.ADD_OTHER_CAR_EVENT, function (evt) {
                        var values = imjcart.logic.value.GlobalValue.getInstance();
                        values.otherCarInfoArr.push(new imjcart.logic.info.OtherCarInfo(evt.id, evt.x, evt.y, evt.bodyAngle, evt.wheelAngle, evt.speed, evt.colorBody, evt.colorWing, evt.colorDriver, evt.name));

                        // 他の車追加
                        _this._view3d.addOtherCar(evt.id);
                        _this._scene.addOtherCar(evt.id);
                    });

                    // 他の車削除イベント
                    this.addEventListener(imjcart.logic.event.ProjectEvent.REMOVE_OTHER_CAR_EVENT, function (evt) {
                        var values = imjcart.logic.value.GlobalValue.getInstance();
                        var arr = [];
                        var i = 0, max;
                        for (i = 0, max = values.otherCarInfoArr.length; i < max; i = i + 1) {
                            if (evt.id != values.otherCarInfoArr[i].id) {
                                arr.push(values.otherCarInfoArr[i]);
                            }
                        }
                        values.otherCarInfoArr = arr;

                        // 他の車削除
                        _this._view3d.removeOtherCar(evt.id);
                        _this._scene.removeOtherCar(evt.id);
                    });

                    // 他の車の描画更新イベント
                    this.addEventListener(imjcart.logic.event.ProjectEvent.RENDER_OTHER_CAR_EVENT, function (evt) {
                        var values = imjcart.logic.value.GlobalValue.getInstance();
                        var i = 0, max;
                        for (i = 0, max = evt.length; i < max; i = i + 1) {
                            var j = 0, max2;
                            for (j = 0, max2 = values.otherCarInfoArr.length; j < max2; j = j + 1) {
                                var info = values.otherCarInfoArr[j];
                                if (info.id == evt[i].id) {
                                    info.x = evt[i].x;
                                    info.y = evt[i].y;
                                    info.bodyAngle = evt[i].bodyAngle;
                                    info.wheelAngle = evt[i].wheelAngle;
                                    info.speed = evt[i].speed;
                                    break;
                                }
                            }
                        }

                        // 他の車の姿勢更新
                        _this._view3d.updateOtherCarPosture();
                        _this._scene.updateOtherCarPosture();
                    });

                    // サーバーからソケットIDを取得したイベント
                    this.addEventListener(imjcart.logic.event.ProjectEvent.EMIT_ID_FROM_SERVER_EVENT, function (evt) {
                        var url = encodeURIComponent(imjcart.logic.value.Const.CONTROLLER_URL + "?id=" + evt.id);
                        var values = imjcart.logic.value.GlobalValue.getInstance();
                        values.socketId = evt.id;

                        // コントーラーURL
                        _this._scene.setControllerUrl(url);
                    });

                    // タイムアタック一時停止イベント
                    this.addEventListener(imjcart.logic.event.ProjectEvent.PAUSE_TIMEATTACK_EVENT, function (evt) {
                        // タイムアタック一時停止
                        _this._scene.pauseTimeAttack();
                    });

                    // タイムアタック再開イベント
                    this.addEventListener(imjcart.logic.event.ProjectEvent.RESUME_TIMEATTACK_EVENT, function (evt) {
                        // タイムアタック再開
                        _this._scene.resumeTimeAttack();
                    });

                    // タイムアタックリトライイベント
                    this.addEventListener(imjcart.logic.event.ProjectEvent.RETRY_TIMEATTACK_EVENT, function (evt) {
                        // タイムアタックリトライ
                        _this._scene.retryTimeAttack();
                    });

                    // ファステストラップ設定イベント
                    this.addEventListener(imjcart.logic.event.ProjectEvent.SET_FASTEST_LAP_EVENT, function (evt) {
                        var values = imjcart.logic.value.GlobalValue.getInstance();
                        values.fastestLapTime = evt.time;
                    });

                    // 名前設定イベント
                    this.addEventListener(imjcart.logic.event.ProjectEvent.SET_NAME_EVENT, function (evt) {
                        var name = evt.name;
                        if (!name || name == "")
                            name = "No Name";
                        var values = imjcart.logic.value.GlobalValue.getInstance();
                        values.name = name;
                    });

                    // ラップタイム保存イベント
                    this.addEventListener(imjcart.logic.event.ProjectEvent.SAVE_LAPTIME_EVENT, function (evt) {
                        var values = imjcart.logic.value.GlobalValue.getInstance();
                        values.name = evt.name;
                        values.comment = evt.comment;

                        // ラップタイムデータ送信
                        _this._socket.saveLaptimeFromClient();
                    });

                    // ラップタイム保存完了イベント
                    this.addEventListener(imjcart.logic.event.ProjectEvent.COMPLETE_SAVE_LAPTIME_EVENT, function (evt) {
                        var values = imjcart.logic.value.GlobalValue.getInstance();
                        values.lapTimeInfo = evt.lapTimeInfo;

                        // ラップタイム保存完了
                        _this._ranking.completeSaveLaptime();
                        _this._scene.completeSaveLapTime();
                    });

                    // ランキングデータリクエストイベント
                    this.addEventListener(imjcart.logic.event.ProjectEvent.GET_RANKING_FROM_CLIENT_EVENT, function (evt) {
                        // ランキングデータリクエスト
                        _this._socket.getRankingFromClient(evt.skip, evt.limit);
                    });

                    // ランキングデータ受信イベント
                    this.addEventListener(imjcart.logic.event.ProjectEvent.GET_RANKING_FROM_SERVER_EVENT, function (evt) {
                        var values = imjcart.logic.value.GlobalValue.getInstance();
                        values.lapTimeInfoArr = evt.lapTimeInfoArr;

                        // ランキングデータ受信
                        _this._ranking.receiveRanking();

                        // ゴーストカー設置
                        _this._view3d.setGhostCars();
                    });
                }
                Main.prototype.open = function () {
                    this._displayImpl.open(0);
                };

                Main.prototype.close = function () {
                    this._displayImpl.close(0);
                };

                Main.prototype.onResize = function (width, height) {
                    if (width < imjcart.logic.value.Const.STAGE_WIDTH)
                        width = imjcart.logic.value.Const.STAGE_WIDTH;
                    if (height < imjcart.logic.value.Const.STAGE_HEIGHT)
                        height = imjcart.logic.value.Const.STAGE_HEIGHT;
                    this.$target.css({
                        width: width,
                        height: height - imjcart.logic.value.Const.FOOTER_HEIGHT
                    });
                };
                return Main;
            })(lib.base.BaseDisplay);
            main.Main = Main;
        })(display.main || (display.main = {}));
        var main = display.main;
    })(imjcart.display || (imjcart.display = {}));
    var display = imjcart.display;
})(imjcart || (imjcart = {}));
