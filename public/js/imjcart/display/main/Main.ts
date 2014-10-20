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

module imjcart {

    export module display {

        export module main {

            export class Main extends lib.base.BaseDisplay implements lib.display.IDisplay, lib.responisive.IResize {

                private _displayImpl:lib.display.IDisplay = null;
                private _view3d:view3d.View3d = null;
                private _scene:scene.Scene = null;
                private _ranking:ranking.Ranking = null;
                private _socket:imjcart.logic.socket.SocketMain = null;

                constructor(target:JQuery) {
                    super(target);
                    //
                    var values:imjcart.logic.value.GlobalValue = imjcart.logic.value.GlobalValue.getInstance();
                    values.main = this;
                    // socket.io
                    this._socket = new imjcart.logic.socket.SocketMain();
                    // 3D表示
                    this._view3d = new view3d.View3d($("#view3d"));
                    // シーン
                    this._scene = new scene.Scene($("#scene"));
                    // ランキング
                    this._ranking = new ranking.Ranking($("#ranking"));
                    //
                    this._displayImpl = new lib.display.SimpleDisplayImpl(this.$target);
                    this._displayImpl.addEventListener(lib.event.Event.DISPLAY_START_OPEN_EVENT, () => {
                        lib.responisive.ResizeManager.getInstance().addEventListener(this);
                        lib.responisive.ResizeManager.getInstance().dispatchEvent(this);
                    });
                    this._displayImpl.addEventListener(lib.event.Event.DISPLAY_COMPLETE_OPEN_EVENT, () => {
                        this._scene.open();
                        this._view3d.open();
                        this._ranking.open();
                        // シーン変更イベント
                        var values:imjcart.logic.value.GlobalValue = imjcart.logic.value.GlobalValue.getInstance();
                        values.main.dispatchEvent(imjcart.logic.event.ProjectEvent.CHANGE_SCENE_EVENT, {id: imjcart.logic.value.Const.ID_SCENE_OPENING});
                    });
                    //
                    // ---------- イベント ---------- //
                    //
                    // シーン変更イベント
                    this.addEventListener(imjcart.logic.event.ProjectEvent.CHANGE_SCENE_EVENT, (evt) => {
                        var values:imjcart.logic.value.GlobalValue = imjcart.logic.value.GlobalValue.getInstance();
                        if (values.currentSceneId && values.currentSceneId == evt.id) return;
                        if (values.currentSceneId) {
                            values.pastSceneId = values.currentSceneId;
                        }
                        values.currentSceneId = evt.id;
                        // シーン変更
                        this._scene.changeScene();
                        // シーン変更
                        this._view3d.changeScene();
                    });
                    // タイムアタックシーン変更イベント
                    this.addEventListener(imjcart.logic.event.ProjectEvent.CHANGE_TIMEATACK_SCENE_EVENT, (evt) => {
                        var values:imjcart.logic.value.GlobalValue = imjcart.logic.value.GlobalValue.getInstance();
                        if (values.currentTimeAtackSceneId && values.currentTimeAtackSceneId == evt.id) return;
                        if (values.currentTimeAtackSceneId) {
                            values.pastTimeAtackSceneId = values.currentTimeAtackSceneId;
                        }
                        values.currentTimeAtackSceneId = evt.id;
                        // タイムアタックシーン変更
                        this._scene.changeTimeAtackScene();
                        // タイムアタックシーン変更
                        this._view3d.changeTimeAtackScene();
                    });
                    // カラー変更イベント
                    this.addEventListener(imjcart.logic.event.ProjectEvent.CHANGE_COLOR_EVENT, (evt) => {
                        var values:imjcart.logic.value.GlobalValue = imjcart.logic.value.GlobalValue.getInstance();
                        switch(evt.id) {
                            case imjcart.logic.value.Const.ID_COLOR_BODY:
                                values.colorBody = evt.color;
                                // ボディカラー変更
                                this._scene.changeColorBody();
                                break;
                            case imjcart.logic.value.Const.ID_COLOR_WING:
                                values.colorWing = evt.color;
                                // ウィングカラー変更
                                this._scene.changeColorWing();
                                break;
                            case imjcart.logic.value.Const.ID_COLOR_DRIVER:
                                values.colorDriver = evt.color;
                                // ドライバーカラー変更
                                this._scene.changeColorDriver();
                                break;
                        }
                    });
                    // 車の描画更新イベント
                    this.addEventListener(imjcart.logic.event.ProjectEvent.RENDER_CAR_EVENT, (evt) => {
                        // 車の姿勢更新
                        this._view3d.updateCarPosture();
                        // 車の姿勢更新
                        this._socket.setCarCondition();
                    });
                    // カメラアングル変更イベント
                    this.addEventListener(imjcart.logic.event.ProjectEvent.CHANGE_CAMERA_ANGLE_EVENT, (evt) => {
                        // カメラアングル変更
                        this._view3d.changeCameraAngle();
                    });
                    // 他の車追加イベント
                    this.addEventListener(imjcart.logic.event.ProjectEvent.ADD_OTHER_CAR_EVENT, (evt) => {
                        var values:imjcart.logic.value.GlobalValue = imjcart.logic.value.GlobalValue.getInstance();
                        values.otherCarInfoArr.push(new imjcart.logic.info.OtherCarInfo(
                            evt.id,
                            evt.x,
                            evt.y,
                            evt.bodyAngle,
                            evt.wheelAngle,
                            evt.speed,
                            evt.colorBody,
                            evt.colorWing,
                            evt.colorDriver,
                            evt.name
                        ));
                        // 他の車追加
                        this._view3d.addOtherCar(evt.id);
                        this._scene.addOtherCar(evt.id);
                    });
                    // 他の車削除イベント
                    this.addEventListener(imjcart.logic.event.ProjectEvent.REMOVE_OTHER_CAR_EVENT, (evt) => {
                        var values:imjcart.logic.value.GlobalValue = imjcart.logic.value.GlobalValue.getInstance();
                        var arr = [];
                        var i = 0, max;
                        for (i = 0, max = values.otherCarInfoArr.length; i < max; i = i + 1) {
                            if (evt.id != values.otherCarInfoArr[i].id) {
                                arr.push(values.otherCarInfoArr[i]);
                            }
                        }
                        values.otherCarInfoArr = arr;
                        // 他の車削除
                        this._view3d.removeOtherCar(evt.id);
                        this._scene.removeOtherCar(evt.id);
                    });
                    // 他の車の描画更新イベント
                    this.addEventListener(imjcart.logic.event.ProjectEvent.RENDER_OTHER_CAR_EVENT, (evt) => {
                        var values:imjcart.logic.value.GlobalValue = imjcart.logic.value.GlobalValue.getInstance();
                        var i = 0, max;
                        for (i = 0, max = evt.length; i < max; i = i + 1) {
                            var j = 0, max2;
                            for (j = 0, max2 = values.otherCarInfoArr.length; j < max2; j = j + 1) {
                                var info:imjcart.logic.info.OtherCarInfo = values.otherCarInfoArr[j];
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
                        this._view3d.updateOtherCarPosture();
                        this._scene.updateOtherCarPosture();
                    });
                    // サーバーからソケットIDを取得したイベント
                    this.addEventListener(imjcart.logic.event.ProjectEvent.EMIT_ID_FROM_SERVER_EVENT, (evt) => {
                        var url = encodeURIComponent(imjcart.logic.value.Const.CONTROLLER_URL + "?id=" + evt.id);
                        var values = imjcart.logic.value.GlobalValue.getInstance();
                        values.socketId = evt.id;
                        // コントーラーURL
                        this._scene.setControllerUrl(url);
                    });
                    // タイムアタック一時停止イベント
                    this.addEventListener(imjcart.logic.event.ProjectEvent.PAUSE_TIMEATTACK_EVENT, (evt) => {
                        // タイムアタック一時停止
                        this._scene.pauseTimeAttack();
                    });
                    // タイムアタック再開イベント
                    this.addEventListener(imjcart.logic.event.ProjectEvent.RESUME_TIMEATTACK_EVENT, (evt) => {
                        // タイムアタック再開
                        this._scene.resumeTimeAttack();
                    });
                    // タイムアタックリトライイベント
                    this.addEventListener(imjcart.logic.event.ProjectEvent.RETRY_TIMEATTACK_EVENT, (evt) => {
                        // タイムアタックリトライ
                        this._scene.retryTimeAttack();
                    });
                    // ファステストラップ設定イベント
                    this.addEventListener(imjcart.logic.event.ProjectEvent.SET_FASTEST_LAP_EVENT, (evt) => {
                        var values = imjcart.logic.value.GlobalValue.getInstance();
                        values.fastestLapTime = evt.time;
                    });
                    // 名前設定イベント
                    this.addEventListener(imjcart.logic.event.ProjectEvent.SET_NAME_EVENT, (evt) => {
                        var name = evt.name;
                        if (!name || name == "") name = "No Name";
                        var values = imjcart.logic.value.GlobalValue.getInstance();
                        values.name = name;
                    });
                    // ラップタイム保存イベント
                    this.addEventListener(imjcart.logic.event.ProjectEvent.SAVE_LAPTIME_EVENT, (evt) => {
                        var values = imjcart.logic.value.GlobalValue.getInstance();
                        values.name = evt.name;
                        values.comment = evt.comment;
                        // ラップタイムデータ送信
                        this._socket.saveLaptimeFromClient();
                    });
                    // ラップタイム保存完了イベント
                    this.addEventListener(imjcart.logic.event.ProjectEvent.COMPLETE_SAVE_LAPTIME_EVENT, (evt) => {
                        var values = imjcart.logic.value.GlobalValue.getInstance();
                        values.lapTimeInfo = evt.lapTimeInfo;
                        // ラップタイム保存完了
                        this._ranking.completeSaveLaptime();
                        this._scene.completeSaveLapTime();
                    });
                    // ランキングデータリクエストイベント
                    this.addEventListener(imjcart.logic.event.ProjectEvent.GET_RANKING_FROM_CLIENT_EVENT, (evt) => {
                        // ランキングデータリクエスト
                        this._socket.getRankingFromClient(evt.skip, evt.limit);
                    });
                    // ランキングデータ受信イベント
                    this.addEventListener(imjcart.logic.event.ProjectEvent.GET_RANKING_FROM_SERVER_EVENT, (evt) => {
                        var values = imjcart.logic.value.GlobalValue.getInstance();
                        values.lapTimeInfoArr = evt.lapTimeInfoArr;
                        // ランキングデータ受信
                        this._ranking.receiveRanking();
                        // ゴーストカー設置
                        this._view3d.setGhostCars();
                    })
                }

                public open() {
                    this._displayImpl.open(0);
                }

                public close() {
                    this._displayImpl.close(0);
                }

                public onResize(width:number, height:number):void {
                    if (width < imjcart.logic.value.Const.STAGE_WIDTH) width = imjcart.logic.value.Const.STAGE_WIDTH;
                    if (height < imjcart.logic.value.Const.STAGE_HEIGHT) height = imjcart.logic.value.Const.STAGE_HEIGHT;
                    this.$target.css({
                        width: width,
                        height: height - imjcart.logic.value.Const.FOOTER_HEIGHT
                    });
                }

            }

        }

    }

}
