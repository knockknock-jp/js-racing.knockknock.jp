/// <reference path="../../../lib/jquery.d.ts"/>
/// <reference path="../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../lib/three.d.ts"/>
/// <reference path="../../../lib/lib.ts"/>
/// <reference path="../../../imjcart/logic/socket/SocketController.ts"/>
/// <reference path="../../../imjcart/logic/value/Const.ts"/>
/// <reference path="../../../imjcart/logic/value/GlobalValue.ts"/>
/// <reference path="../../../imjcart/logic/event/ProjectEvent.ts"/>
/// <reference path="../../../imjcart/logic/info/OtherCarInfo.ts"/>
/// <reference path="../../../imjcart/display/main/view3d/View3d.ts"/>
/// <reference path="../../../imjcart/display/main/scene/Scene.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var imjcart;
(function (imjcart) {
    (function (_display) {
        (function (controller) {
            var Controller = (function (_super) {
                __extends(Controller, _super);
                function Controller(target) {
                    var _this = this;
                    _super.call(this, target);
                    this._displayImpl = null;
                    this._window = null;
                    this._id = null;
                    this._isPortait = true;
                    this._slope = null;
                    this._socket = null;
                    this._$boxOpening = null;
                    this._$boxController = null;
                    this._$boxError = null;
                    this._$btnPlay = null;
                    this._$btnCamera = null;
                    this._$btnHandleLeft = null;
                    this._$btnHandleRight = null;
                    this._$btnAccelerator = null;
                    this._$btnBack = null;
                    this._startTouchEvent = null;
                    this._endTouchEvent = null;

                    //
                    var values = imjcart.logic.value.GlobalValue.getInstance();
                    values.controller = this;

                    //
                    this._$boxOpening = $("#boxOpening");
                    this._$boxController = $("#boxController");
                    this._$boxError = $("#boxError");
                    this._$btnPlay = $("#btnPlay");
                    this._$btnCamera = $("#btnCamera");
                    this._$btnHandleLeft = $("#btnHandleLeft");
                    this._$btnHandleRight = $("#btnHandleRight");
                    this._$btnAccelerator = $("#btnAccelerator");
                    this._$btnBack = $("#btnBack");

                    // socket.io
                    this._socket = new imjcart.logic.socket.SocketController();

                    //
                    this._id = $("#id").text();
                    var isTouch = ("ontouchstart" in window);
                    this._startTouchEvent = (isTouch) ? "touchstart" : "mousedown";
                    this._endTouchEvent = (isTouch) ? "touchend" : "mouseup";

                    //
                    this._displayImpl = new lib.display.SimpleDisplayImpl(this.$target);
                    this._displayImpl.addEventListener(lib.event.Event.DISPLAY_START_OPEN_EVENT, function () {
                        lib.responisive.ResizeManager.getInstance().addEventListener(_this);
                        lib.responisive.ResizeManager.getInstance().dispatchEvent(_this);
                    });
                    this._displayImpl.addEventListener(lib.event.Event.DISPLAY_COMPLETE_OPEN_EVENT, function () {
                        _this._completeOpen();
                    });

                    //
                    // ---------- イベント ---------- //
                    //
                    // 開始イベント
                    this.addEventListener(imjcart.logic.event.ProjectEvent.CONTROLLER_START_EVENT, function (evt) {
                        _this._$boxOpening.css({
                            display: "none"
                        });
                        _this._$boxController.css({
                            display: "block"
                        });
                    });

                    // エラー表示イベント
                    this.addEventListener(imjcart.logic.event.ProjectEvent.CONTROLLER_ERROR_EVENT, function (evt) {
                        _this._$boxOpening.css({
                            display: "none"
                        });
                        _this._$boxController.css({
                            display: "none"
                        });
                        _this._$boxError.css({
                            display: "block"
                        });
                    });

                    //
                    this._$btnPlay.on("click", function (evt) {
                        evt.preventDefault();
                        _this._play();
                    });

                    //
                    this._$btnCamera.on(this._startTouchEvent, function (evt) {
                        evt.preventDefault();
                        _this._changeCameraAngle();
                        _this._$btnCamera.addClass("active");
                    });
                    this._$btnCamera.on(this._endTouchEvent, function (evt) {
                        evt.preventDefault();
                        _this._$btnCamera.removeClass("active");
                    });

                    //
                    this._$btnHandleLeft.on(this._startTouchEvent, function (evt) {
                        evt.preventDefault();
                        _this._setSteeringAngleLeft();
                    });
                    this._$btnHandleLeft.on(this._endTouchEvent, function (evt) {
                        evt.preventDefault();
                        _this._clearSteeringAngle();
                    });

                    //
                    this._$btnHandleRight.on(this._startTouchEvent, function (evt) {
                        evt.preventDefault();
                        _this._setSteeringAngleRight();
                    });
                    this._$btnHandleRight.on(this._endTouchEvent, function (evt) {
                        evt.preventDefault();
                        _this._clearSteeringAngle();
                    });

                    //
                    this._$btnAccelerator.on(this._startTouchEvent, function (evt) {
                        evt.preventDefault();
                        _this._startEngine({
                            value: 1
                        });
                        _this._$btnAccelerator.addClass("active");
                    });
                    this._$btnAccelerator.on(this._endTouchEvent, function (evt) {
                        evt.preventDefault();
                        _this._stopEngine();
                        _this._$btnAccelerator.removeClass("active");
                    });

                    //
                    this._$btnBack.on(this._startTouchEvent, function (evt) {
                        evt.preventDefault();
                        _this._startEngine({
                            value: -1
                        });
                        _this._$btnBack.addClass("active");
                    });
                    this._$btnBack.on(this._endTouchEvent, function (evt) {
                        evt.preventDefault();
                        _this._stopEngine();
                        _this._$btnBack.removeClass("active");
                    });

                    //
                    this._window = window;
                    $(this._window).bind("load orientationchange", function (evt) {
                        evt.preventDefault();
                        if (Math.abs(_this._window.orientation) === 90) {
                            _this._isPortait = false;
                        } else {
                            _this._isPortait = true;
                        }
                    });
                    this._window.addEventListener("devicemotion", function (evt) {
                        evt.preventDefault();
                        var x = evt.accelerationIncludingGravity.x;
                        var y = evt.accelerationIncludingGravity.y;

                        //var z = evt.accelerationIncludingGravity.z; //上下方向の傾斜
                        var slope = "center";
                        if (_this._isPortait) {
                            if (x <= -4) {
                                slope = "left";
                            } else if (4 <= x) {
                                slope = "right";
                            }
                        } else {
                            if (0 <= x) {
                                if (y <= -4) {
                                    slope = "left";
                                } else if (4 <= y) {
                                    slope = "right";
                                }
                            } else {
                                if (y <= -4) {
                                    slope = "right";
                                } else if (4 <= y) {
                                    slope = "left";
                                }
                            }
                        }
                        if (_this._slope != slope) {
                            _this._slope = slope;
                            _this._changeSteeringAngle();
                        }
                    }, false);
                }
                Controller.prototype.open = function () {
                    this._displayImpl.open(0);
                };

                Controller.prototype.close = function () {
                    this._displayImpl.close(0);
                };

                Controller.prototype._completeOpen = function () {
                    this._$boxOpening.css({
                        display: "block"
                    });
                };

                Controller.prototype.onResize = function (width, height) {
                    this.$target.css({
                        width: width,
                        height: height
                    });
                    this._$btnCamera.css({
                        height: (height - 40) / 3
                    });
                    this._$btnHandleLeft.css({
                        height: (height - 40) / 3
                    });
                    this._$btnHandleRight.css({
                        height: (height - 40) / 3
                    });
                    this._$btnAccelerator.css({
                        height: (height - 40) / 3
                    });
                    this._$btnBack.css({
                        height: (height - 40) / 3
                    });
                };

                Controller.prototype._play = function () {
                    this._socket.play({
                        id: this._id
                    });

                    // 開始イベント
                    var values = imjcart.logic.value.GlobalValue.getInstance();
                    values.controller.dispatchEvent(imjcart.logic.event.ProjectEvent.CONTROLLER_START_EVENT);
                };

                Controller.prototype._changeCameraAngle = function () {
                    this._socket.changeCameraAngle({
                        id: this._id
                    });
                };

                Controller.prototype._changeSteeringAngle = function () {
                    switch (this._slope) {
                        case "right":
                            this._setSteeringAngleRight();
                            break;
                        case "left":
                            this._setSteeringAngleLeft();
                            break;
                        case "center":
                            this._clearSteeringAngle();
                            break;
                    }
                };

                Controller.prototype._setSteeringAngleLeft = function () {
                    this._socket.setSteeringAngle({
                        id: this._id,
                        value: 0.5
                    });
                    this._$btnHandleLeft.addClass("active");
                    this._$btnHandleRight.removeClass("active");
                };

                Controller.prototype._setSteeringAngleRight = function () {
                    this._socket.setSteeringAngle({
                        id: this._id,
                        value: -0.5
                    });
                    this._$btnHandleRight.addClass("active");
                    this._$btnHandleLeft.removeClass("active");
                };

                Controller.prototype._clearSteeringAngle = function () {
                    this._socket.clearSteeringAngle({
                        id: this._id
                    });
                    this._$btnHandleLeft.removeClass("active");
                    this._$btnHandleRight.removeClass("active");
                };

                Controller.prototype._startEngine = function (params) {
                    var value = params.value;
                    this._socket.startEngine({
                        id: this._id,
                        value: value
                    });
                };

                Controller.prototype._stopEngine = function () {
                    this._socket.stopEngine({
                        id: this._id
                    });
                };
                return Controller;
            })(lib.base.BaseDisplay);
            controller.Controller = Controller;
        })(_display.controller || (_display.controller = {}));
        var controller = _display.controller;
    })(imjcart.display || (imjcart.display = {}));
    var display = imjcart.display;
})(imjcart || (imjcart = {}));

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

/// <reference path="../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../lib/lib.ts"/>
/// <reference path="../../../../imjcart/logic/value/Const.ts"/>
/// <reference path="../../../../imjcart/logic/value/GlobalValue.ts"/>
/// <reference path="../../../../imjcart/logic/event/ProjectEvent.ts"/>
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
            (function (ranking) {
                var Ranking = (function (_super) {
                    __extends(Ranking, _super);
                    function Ranking(target) {
                        var _this = this;
                        _super.call(this, target);
                        this._displayImpl = null;
                        this._$list = null;
                        this._$listItem = null;

                        //
                        this._$list = $("#rankingList");
                        this._$listItem = this._$list.find("li:first-child").clone();
                        this._$list.empty();

                        //
                        this._displayImpl = new lib.display.SimpleDisplayImpl(this.$target);
                        this._displayImpl.addEventListener(lib.event.Event.DISPLAY_START_OPEN_EVENT, function () {
                            lib.responisive.ResizeManager.getInstance().addEventListener(_this);
                            lib.responisive.ResizeManager.getInstance().dispatchEvent(_this);
                        });
                        this._displayImpl.addEventListener(lib.event.Event.DISPLAY_COMPLETE_OPEN_EVENT, function () {
                            _this._completeOpen();
                        });
                        //
                        // ---------- イベント ---------- //
                        //
                    }
                    Ranking.prototype.open = function () {
                        this._displayImpl.open(0);
                    };

                    Ranking.prototype.close = function () {
                        this._displayImpl.close(0);
                    };

                    Ranking.prototype._completeOpen = function () {
                        // ランキングデータリクエストイベント
                        var values = imjcart.logic.value.GlobalValue.getInstance();
                        values.main.dispatchEvent(imjcart.logic.event.ProjectEvent.GET_RANKING_FROM_CLIENT_EVENT, { skip: 0, limit: 30 });
                    };

                    Ranking.prototype.onResize = function (width, height) {
                        var windowHeight = height;
                        if (windowHeight < imjcart.logic.value.Const.STAGE_HEIGHT)
                            windowHeight = imjcart.logic.value.Const.STAGE_HEIGHT;
                        var windowWidth = width;
                        if (windowWidth < imjcart.logic.value.Const.STAGE_WIDTH)
                            windowWidth = imjcart.logic.value.Const.STAGE_WIDTH;
                        var tagTop = windowHeight - imjcart.logic.value.Const.FOOTER_HEIGHT - imjcart.logic.value.Const.RANKING_HEIGHT;
                        this.$target.css({
                            position: "absolute",
                            top: tagTop,
                            left: 0,
                            width: windowWidth,
                            height: imjcart.logic.value.Const.RANKING_HEIGHT
                        });
                    };

                    // ランキングデータ受信
                    Ranking.prototype.receiveRanking = function () {
                        var values = imjcart.logic.value.GlobalValue.getInstance();

                        //
                        var targetTop = 0;
                        this._$list.empty();
                        var i = 0, max;
                        for (i = 0, max = values.lapTimeInfoArr.length; i < max; i = i + 1) {
                            var lapTimeInfo = values.lapTimeInfoArr[i];
                            var $listItem = this._$listItem.clone();
                            $listItem.find(".rankingListRank").each(function () {
                                $(this).text(String(i + 1));
                            });
                            $listItem.find(".rankingListTime").each(function () {
                                $(this).text(imjcart.logic.utility.Util.formatTime(lapTimeInfo.time));
                            });
                            $listItem.find(".rankingListName").each(function () {
                                $(this).text(lapTimeInfo.name);
                            });
                            $listItem.find(".rankingListComment").each(function () {
                                if (lapTimeInfo.comment && lapTimeInfo.comment != "null") {
                                    $(this).text(lapTimeInfo.comment);
                                }
                            });
                            this._$list.append($listItem);
                            if (values.socketId == lapTimeInfo.id) {
                                $listItem.addClass("ranking__list__current");
                                if (lapTimeInfo.time == values.fastestLapTime) {
                                    targetTop = $listItem.offset().top - this._$list.offset().top;
                                }
                            }
                        }
                        this._$list.scrollTop(targetTop);
                    };

                    // ラップタイム保存完了
                    Ranking.prototype.completeSaveLaptime = function () {
                        // ランキングデータリクエストイベント
                        var values = imjcart.logic.value.GlobalValue.getInstance();
                        values.main.dispatchEvent(imjcart.logic.event.ProjectEvent.GET_RANKING_FROM_CLIENT_EVENT, { skip: 0, limit: 30 });
                    };
                    return Ranking;
                })(lib.base.BaseDisplay);
                ranking.Ranking = Ranking;
            })(main.ranking || (main.ranking = {}));
            var ranking = main.ranking;
        })(display.main || (display.main = {}));
        var main = display.main;
    })(imjcart.display || (imjcart.display = {}));
    var display = imjcart.display;
})(imjcart || (imjcart = {}));

/// <reference path="../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../lib/three.d.ts"/>
/// <reference path="../../../../lib/lib.ts"/>
/// <reference path="../../../../imjcart/display/main/scene/opening/Opening.ts"/>
/// <reference path="../../../../imjcart/display/main/scene/timeatack/TimeAtack.ts"/>
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
            (function (scene) {
                var Scene = (function (_super) {
                    __extends(Scene, _super);
                    function Scene(target) {
                        _super.call(this, target);
                        this._displayImpl = null;
                        this._sceneCollection = null;
                        this._sceneOpening = null;
                        this._sceneTimeAtack = null;

                        // シーン
                        this._sceneCollection = new lib.collection.DisplayCollection();

                        // オープニング
                        this._sceneOpening = new scene.opening.Opening($("#sceneOpening"));
                        this._sceneCollection.pushInfo(new lib.collection.DisplayInfo(imjcart.logic.value.Const.ID_SCENE_OPENING, this._sceneOpening));

                        // タイムアタック
                        this._sceneTimeAtack = new scene.timeatack.TimeAtack($("#sceneTimeAtack"));
                        this._sceneCollection.pushInfo(new lib.collection.DisplayInfo(imjcart.logic.value.Const.ID_SCENE_TIMEATACK, this._sceneTimeAtack));

                        //
                        this._displayImpl = new lib.display.SimpleDisplayImpl(this.$target);
                    }
                    Scene.prototype.open = function () {
                        this._displayImpl.open(0);
                    };

                    Scene.prototype.close = function () {
                        this._displayImpl.close(0);
                    };

                    // シーン変更
                    Scene.prototype.changeScene = function () {
                        var values = imjcart.logic.value.GlobalValue.getInstance();
                        if (values.pastSceneId)
                            this._sceneCollection.getInfoById(values.pastSceneId).display.close();
                        this._sceneCollection.getInfoById(values.currentSceneId).display.open();
                    };

                    // タイムアタックシーン変更
                    Scene.prototype.changeTimeAtackScene = function () {
                        this._sceneTimeAtack.changeScene();
                    };

                    // コントローラーURL
                    Scene.prototype.setControllerUrl = function (url) {
                        this._sceneOpening.setControllerUrl(url);
                    };

                    // ボディカラー変更
                    Scene.prototype.changeColorBody = function () {
                        this._sceneOpening.changeColorBody();
                    };

                    // ウィングカラー変更
                    Scene.prototype.changeColorWing = function () {
                        this._sceneOpening.changeColorWing();
                    };

                    // ドライバーカラー変更
                    Scene.prototype.changeColorDriver = function () {
                        this._sceneOpening.changeColorDriver();
                    };

                    // タイムアタック一時停止
                    Scene.prototype.pauseTimeAttack = function () {
                        // 一時停止
                        this._sceneTimeAtack.pause();
                    };

                    // タイムアタック再開
                    Scene.prototype.resumeTimeAttack = function () {
                        // 再開
                        this._sceneTimeAtack.resume();
                    };

                    // タイムアタックリトライ
                    Scene.prototype.retryTimeAttack = function () {
                        // 再開
                        this._sceneTimeAtack.retry();
                    };

                    // ラップタイム保存完了
                    Scene.prototype.completeSaveLapTime = function () {
                        this._sceneTimeAtack.completeSaveLapTime();
                    };

                    // 他の車追加
                    Scene.prototype.addOtherCar = function (id) {
                        this._sceneTimeAtack.addOtherCar(id);
                    };

                    // 他の車除去
                    Scene.prototype.removeOtherCar = function (id) {
                        this._sceneTimeAtack.removeOtherCar(id);
                    };

                    // 他の車の姿勢更新
                    Scene.prototype.updateOtherCarPosture = function () {
                        this._sceneTimeAtack.updateOtherCarPosture();
                    };
                    return Scene;
                })(lib.base.BaseDisplay);
                scene.Scene = Scene;
            })(main.scene || (main.scene = {}));
            var scene = main.scene;
        })(display.main || (display.main = {}));
        var main = display.main;
    })(imjcart.display || (imjcart.display = {}));
    var display = imjcart.display;
})(imjcart || (imjcart = {}));

/// <reference path="../../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../../lib/three.d.ts"/>
/// <reference path="../../../../../lib/lib.ts"/>
/// <reference path="../../../../../imjcart/logic/value/GlobalValue.ts"/>
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
            (function (scene) {
                (function (opening) {
                    var BtnAtack = (function (_super) {
                        __extends(BtnAtack, _super);
                        function BtnAtack(target) {
                            var _this = this;
                            _super.call(this, target);
                            this._displayImpl = null;
                            this._buttonImpl = null;

                            //
                            this._displayImpl = new lib.display.SimpleDisplayImpl(this.$target);
                            this._displayImpl.addEventListener(lib.event.Event.DISPLAY_COMPLETE_OPEN_EVENT, function () {
                                _this._buttonImpl.setActive();
                            });
                            this._displayImpl.addEventListener(lib.event.Event.DISPLAY_START_CLOSE_EVENT, function () {
                                _this._buttonImpl.deleteActive();
                            });

                            //
                            this._buttonImpl = new lib.button.SimpleButtonImpl(this.$target);
                            this._buttonImpl.addEventListener(lib.event.Event.BUTTON_CLICK_EVENT, function () {
                                _this.dispatchEvent("play_time_attack");
                            });
                        }
                        BtnAtack.prototype.open = function () {
                            this._displayImpl.open(0);
                        };

                        BtnAtack.prototype.close = function () {
                            this._displayImpl.close(0);
                        };
                        return BtnAtack;
                    })(lib.base.BaseDisplay);
                    opening.BtnAtack = BtnAtack;
                })(scene.opening || (scene.opening = {}));
                var opening = scene.opening;
            })(main.scene || (main.scene = {}));
            var scene = main.scene;
        })(display.main || (display.main = {}));
        var main = display.main;
    })(imjcart.display || (imjcart.display = {}));
    var display = imjcart.display;
})(imjcart || (imjcart = {}));

/// <reference path="../../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../../lib/three.d.ts"/>
/// <reference path="../../../../../lib/lib.ts"/>
/// <reference path="../../../../../imjcart/logic/value/GlobalValue.ts"/>
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
            (function (scene) {
                (function (opening) {
                    var BtnColor = (function (_super) {
                        __extends(BtnColor, _super);
                        function BtnColor(target, id, color) {
                            if (typeof id === "undefined") { id = null; }
                            if (typeof color === "undefined") { color = null; }
                            var _this = this;
                            _super.call(this, target);
                            this._displayImpl = null;
                            this._buttonImpl = null;
                            this._id = null;
                            this._color = null;
                            this._id = id;
                            this._color = color;
                            this.$target.css({
                                backgroundColor: color
                            });

                            //
                            this._displayImpl = new lib.display.SimpleDisplayImpl(this.$target);
                            this._displayImpl.addEventListener(lib.event.Event.DISPLAY_COMPLETE_OPEN_EVENT, function () {
                                _this._buttonImpl.setActive();
                                /*
                                if (this._id == imjcart.logic.value.Const.ID_COLOR_BODY && this._color == imjcart.logic.value.Const.DEFAULT_BODY_COLOR) {
                                this._buttonImpl.setCurrent();
                                } else if (this._id == imjcart.logic.value.Const.ID_COLOR_WING && this._color == imjcart.logic.value.Const.DEFAULT_WING_COLOR) {
                                this._buttonImpl.setCurrent();
                                } else if (this._id == imjcart.logic.value.Const.ID_COLOR_DRIVER && this._color == imjcart.logic.value.Const.DEFAULT_DRIVER_COLOR) {
                                this._buttonImpl.setCurrent();
                                }
                                */
                            });
                            this._displayImpl.addEventListener(lib.event.Event.DISPLAY_START_CLOSE_EVENT, function () {
                                _this._buttonImpl.deleteActive();
                            });

                            //
                            this._buttonImpl = new lib.button.SimpleButtonImpl(this.$target);
                            this._buttonImpl.addEventListener(lib.event.Event.BUTTON_CLICK_EVENT, function () {
                                // カラー変更イベント
                                var values = imjcart.logic.value.GlobalValue.getInstance();
                                values.main.dispatchEvent(imjcart.logic.event.ProjectEvent.CHANGE_COLOR_EVENT, { id: _this._id, color: _this._color });
                            });
                            this._buttonImpl.addEventListener(lib.event.Event.BUTTON_SET_CURRENT_EVENT, function () {
                                // カレント表示
                                _this.$target.addClass("current");
                            });
                            this._buttonImpl.addEventListener(lib.event.Event.BUTTON_DELETE_CURRENT_EVENT, function () {
                                // カレント解除
                                _this.$target.removeClass("current");
                            });
                        }
                        BtnColor.prototype.open = function () {
                            this._displayImpl.open(0);
                        };

                        BtnColor.prototype.close = function () {
                            this._displayImpl.close(0);
                        };

                        Object.defineProperty(BtnColor.prototype, "color", {
                            get: function () {
                                return this._color;
                            },
                            enumerable: true,
                            configurable: true
                        });

                        BtnColor.prototype.setCurrent = function () {
                            this._buttonImpl.setCurrent();
                        };

                        BtnColor.prototype.deleteCurrent = function () {
                            this._buttonImpl.deleteCurrent();
                        };
                        return BtnColor;
                    })(lib.base.BaseDisplay);
                    opening.BtnColor = BtnColor;
                })(scene.opening || (scene.opening = {}));
                var opening = scene.opening;
            })(main.scene || (main.scene = {}));
            var scene = main.scene;
        })(display.main || (display.main = {}));
        var main = display.main;
    })(imjcart.display || (imjcart.display = {}));
    var display = imjcart.display;
})(imjcart || (imjcart = {}));

/// <reference path="../../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../../lib/three.d.ts"/>
/// <reference path="../../../../../lib/lib.ts"/>
/// <reference path="../../../../../imjcart/logic/value/Const.ts"/>
/// <reference path="../../../../../imjcart/display/main/scene/opening/BtnAtack.ts"/>
/// <reference path="../../../../../imjcart/display/main/scene/opening/BtnColor.ts"/>
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
            (function (scene) {
                (function (opening) {
                    var Opening = (function (_super) {
                        __extends(Opening, _super);
                        function Opening(target) {
                            var _this = this;
                            _super.call(this, target);
                            this._displayImpl = null;
                            this._btnAtack = null;
                            this._btnColorBodyArr = [];
                            this._btnColorWingArr = [];
                            this._btnColorDriverArr = [];
                            this._$txt = null;
                            this._$img = null;
                            this._$name = null;

                            //
                            this._btnAtack = new opening.BtnAtack($("#sceneOpeningBtnTimeAtack"));
                            this._btnAtack.addEventListener("play_time_attack", function () {
                                _this._playTimeAttack();
                            });
                            this._$txt = $("#sceneOpeningTxt");
                            this._$img = $("#sceneOpeningImg");
                            this._$name = $("#sceneOpeningName");

                            //
                            var scope = this;
                            this.$target.find(".sceneOpeningBtnBodyColor").each(function () {
                                var btnColor = new opening.BtnColor($(this), imjcart.logic.value.Const.ID_COLOR_BODY, $(this).attr("data-color"));
                                scope._btnColorBodyArr.push(btnColor);
                            });
                            this.$target.find(".sceneOpeningBtnWingColor").each(function () {
                                var btnColor = new opening.BtnColor($(this), imjcart.logic.value.Const.ID_COLOR_WING, $(this).attr("data-color"));
                                scope._btnColorWingArr.push(btnColor);
                            });
                            this.$target.find(".sceneOpeningBtnDriverColor").each(function () {
                                var btnColor = new opening.BtnColor($(this), imjcart.logic.value.Const.ID_COLOR_DRIVER, $(this).attr("data-color"));
                                scope._btnColorDriverArr.push(btnColor);
                            });

                            //
                            this._displayImpl = new lib.display.SimpleDisplayImpl(this.$target);
                            this._displayImpl.addEventListener(lib.event.Event.DISPLAY_START_OPEN_EVENT, function () {
                                lib.responisive.ResizeManager.getInstance().addEventListener(_this);
                                lib.responisive.ResizeManager.getInstance().dispatchEvent(_this);
                            });
                            this._displayImpl.addEventListener(lib.event.Event.DISPLAY_COMPLETE_OPEN_EVENT, function () {
                                _this._completeOpen();
                            });
                            this._displayImpl.addEventListener(lib.event.Event.DISPLAY_START_CLOSE_EVENT, function () {
                                _this._startClose();
                            });
                            this._displayImpl.addEventListener(lib.event.Event.DISPLAY_COMPLETE_CLOSE_EVENT, function () {
                                lib.responisive.ResizeManager.getInstance().removeEventListener(_this);
                            });
                        }
                        Opening.prototype.open = function () {
                            this._displayImpl.open(0);
                        };

                        Opening.prototype.close = function () {
                            this._displayImpl.close(0);
                        };

                        Opening.prototype._completeOpen = function () {
                            this._btnAtack.open();
                            var i = 0, max;
                            for (i = 0, max = this._btnColorBodyArr.length; i < max; i = i + 1) {
                                this._btnColorBodyArr[i].open();
                            }
                            for (i = 0, max = this._btnColorWingArr.length; i < max; i = i + 1) {
                                this._btnColorWingArr[i].open();
                            }
                            for (i = 0, max = this._btnColorDriverArr.length; i < max; i = i + 1) {
                                this._btnColorDriverArr[i].open();
                            }

                            // カラー変更イベント
                            var values = imjcart.logic.value.GlobalValue.getInstance();
                            values.main.dispatchEvent(imjcart.logic.event.ProjectEvent.CHANGE_COLOR_EVENT, { id: imjcart.logic.value.Const.ID_COLOR_BODY, color: imjcart.logic.value.Const.DEFAULT_BODY_COLOR });
                            values.main.dispatchEvent(imjcart.logic.event.ProjectEvent.CHANGE_COLOR_EVENT, { id: imjcart.logic.value.Const.ID_COLOR_WING, color: imjcart.logic.value.Const.DEFAULT_WING_COLOR });
                            values.main.dispatchEvent(imjcart.logic.event.ProjectEvent.CHANGE_COLOR_EVENT, { id: imjcart.logic.value.Const.ID_COLOR_DRIVER, color: imjcart.logic.value.Const.DEFAULT_DRIVER_COLOR });
                        };

                        Opening.prototype._startClose = function () {
                            this._btnAtack.close();
                            var i = 0, max;
                            for (i = 0, max = this._btnColorBodyArr.length; i < max; i = i + 1) {
                                this._btnColorBodyArr[i].close();
                            }
                            for (i = 0, max = this._btnColorWingArr.length; i < max; i = i + 1) {
                                this._btnColorWingArr[i].close();
                            }
                            for (i = 0, max = this._btnColorDriverArr.length; i < max; i = i + 1) {
                                this._btnColorDriverArr[i].close();
                            }
                        };

                        Opening.prototype.onResize = function (width, height) {
                            if (width < imjcart.logic.value.Const.STAGE_WIDTH)
                                width = imjcart.logic.value.Const.STAGE_WIDTH;
                            if (height < imjcart.logic.value.Const.STAGE_HEIGHT)
                                height = imjcart.logic.value.Const.STAGE_HEIGHT;
                            this.$target.css({
                                width: width,
                                height: height - imjcart.logic.value.Const.FOOTER_HEIGHT - imjcart.logic.value.Const.RANKING_HEIGHT
                            });
                        };

                        Opening.prototype.setControllerUrl = function (url) {
                            var _this = this;
                            var login = imjcart.logic.value.Const.BITLY_USERNAME;
                            var apikey = imjcart.logic.value.Const.BITLY_API_KEY;
                            $.ajax({
                                type: "GET",
                                url: "http://api.bitly.com/v3/shorten?longUrl=" + url + "&login=" + login + "&apiKey=" + apikey + "&format=json",
                                dataType: "json",
                                success: function (json) {
                                    var url = json.data.url;

                                    // URL
                                    _this._setControllerUrlTxt(url);

                                    // QR
                                    _this._setControllerUrlQr(url);
                                }
                            });
                        };

                        Opening.prototype._setControllerUrlTxt = function (url) {
                            this._$txt.text(url);
                        };

                        Opening.prototype._setControllerUrlQr = function (url) {
                            this._$img.attr("src", "http://chart.apis.google.com/chart?chs=100x100&cht=qr&chl=" + url);
                        };

                        // ボディカラー変更
                        Opening.prototype.changeColorBody = function () {
                            var i = 0, max;
                            for (i = 0, max = this._btnColorBodyArr.length; i < max; i = i + 1) {
                                var btn = this._btnColorBodyArr[i];
                                if (btn.color == imjcart.logic.value.GlobalValue.getInstance().colorBody) {
                                    btn.setCurrent();
                                } else {
                                    btn.deleteCurrent();
                                }
                            }
                        };

                        // ウィングカラー変更
                        Opening.prototype.changeColorWing = function () {
                            var i = 0, max;
                            for (i = 0, max = this._btnColorWingArr.length; i < max; i = i + 1) {
                                var btn = this._btnColorWingArr[i];
                                if (btn.color == imjcart.logic.value.GlobalValue.getInstance().colorWing) {
                                    btn.setCurrent();
                                } else {
                                    btn.deleteCurrent();
                                }
                            }
                        };

                        // ドライバーカラー変更
                        Opening.prototype.changeColorDriver = function () {
                            var i = 0, max;
                            for (i = 0, max = this._btnColorDriverArr.length; i < max; i = i + 1) {
                                var btn = this._btnColorDriverArr[i];
                                if (btn.color == imjcart.logic.value.GlobalValue.getInstance().colorDriver) {
                                    btn.setCurrent();
                                } else {
                                    btn.deleteCurrent();
                                }
                            }
                        };

                        Opening.prototype._playTimeAttack = function () {
                            // 名前設定イベント
                            var values = imjcart.logic.value.GlobalValue.getInstance();
                            values.main.dispatchEvent(imjcart.logic.event.ProjectEvent.SET_NAME_EVENT, { name: this._$name.val() });

                            // シーン変更イベント
                            var values = imjcart.logic.value.GlobalValue.getInstance();
                            values.main.dispatchEvent(imjcart.logic.event.ProjectEvent.CHANGE_SCENE_EVENT, { id: imjcart.logic.value.Const.ID_SCENE_TIMEATACK });
                        };
                        return Opening;
                    })(lib.base.BaseDisplay);
                    opening.Opening = Opening;
                })(scene.opening || (scene.opening = {}));
                var opening = scene.opening;
            })(main.scene || (main.scene = {}));
            var scene = main.scene;
        })(display.main || (display.main = {}));
        var main = display.main;
    })(imjcart.display || (imjcart.display = {}));
    var display = imjcart.display;
})(imjcart || (imjcart = {}));

/// <reference path="../../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../../lib/three.d.ts"/>
/// <reference path="../../../../../lib/lib.ts"/>
/// <reference path="../../../../../imjcart/logic/value/GlobalValue.ts"/>
/// <reference path="../../../../../imjcart/logic/event/ProjectEvent.ts"/>
/// <reference path="../../../../../imjcart/display/main/scene/timeatack/run/Run.ts"/>
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
            (function (scene) {
                (function (timeatack) {
                    var TimeAtack = (function (_super) {
                        __extends(TimeAtack, _super);
                        function TimeAtack(target) {
                            var _this = this;
                            _super.call(this, target);
                            this._displayImpl = null;
                            this._sceneCollection = null;
                            this._run = null;

                            //
                            this._sceneCollection = new lib.collection.DisplayCollection();

                            // 走行
                            this._run = new timeatack.run.Run($("#sceneTimeAtackRun"));
                            this._sceneCollection.pushInfo(new lib.collection.DisplayInfo(imjcart.logic.value.Const.ID_SCENE_TIMEATACK_RUN, this._run));

                            //
                            this._displayImpl = new lib.display.SimpleDisplayImpl(this.$target);
                            this._displayImpl.addEventListener(lib.event.Event.DISPLAY_START_OPEN_EVENT, function () {
                                lib.responisive.ResizeManager.getInstance().addEventListener(_this);
                                lib.responisive.ResizeManager.getInstance().dispatchEvent(_this);
                            });
                            this._displayImpl.addEventListener(lib.event.Event.DISPLAY_COMPLETE_OPEN_EVENT, function () {
                                _this._completeOpen();
                            });
                            this._displayImpl.addEventListener(lib.event.Event.DISPLAY_START_CLOSE_EVENT, function () {
                                _this._startClose();
                            });
                            this._displayImpl.addEventListener(lib.event.Event.DISPLAY_COMPLETE_CLOSE_EVENT, function () {
                                lib.responisive.ResizeManager.getInstance().removeEventListener(_this);
                            });
                        }
                        TimeAtack.prototype.open = function () {
                            this._displayImpl.open(0);
                        };

                        TimeAtack.prototype.close = function () {
                            this._displayImpl.close(0);
                        };

                        TimeAtack.prototype.onResize = function (width, height) {
                            if (width < imjcart.logic.value.Const.STAGE_WIDTH)
                                width = imjcart.logic.value.Const.STAGE_WIDTH;
                            if (height < imjcart.logic.value.Const.STAGE_HEIGHT)
                                height = imjcart.logic.value.Const.STAGE_HEIGHT;
                            this.$target.css({
                                width: width,
                                height: height - imjcart.logic.value.Const.FOOTER_HEIGHT - imjcart.logic.value.Const.RANKING_HEIGHT
                            });
                        };

                        // タイムアタックシーン変更
                        TimeAtack.prototype.changeScene = function () {
                            var values = imjcart.logic.value.GlobalValue.getInstance();
                            if (values.pastTimeAtackSceneId)
                                this._sceneCollection.getInfoById(values.pastTimeAtackSceneId).display.close();
                            this._sceneCollection.getInfoById(values.currentTimeAtackSceneId).display.open();
                        };

                        TimeAtack.prototype._completeOpen = function () {
                            // タイムアタックシーン変更イベント
                            var values = imjcart.logic.value.GlobalValue.getInstance();
                            values.main.dispatchEvent(imjcart.logic.event.ProjectEvent.CHANGE_TIMEATACK_SCENE_EVENT, { id: imjcart.logic.value.Const.ID_SCENE_TIMEATACK_RUN });
                        };

                        TimeAtack.prototype._startClose = function () {
                            this._run.close();
                        };

                        // 一時停止
                        TimeAtack.prototype.pause = function () {
                            this._run.pause();
                        };

                        // 再開
                        TimeAtack.prototype.resume = function () {
                            this._run.resume();
                        };

                        // リトライ
                        TimeAtack.prototype.retry = function () {
                            this._run.retry();
                        };

                        // ラップタイム保存完了
                        TimeAtack.prototype.completeSaveLapTime = function () {
                            this._run.completeSaveLapTime();
                        };

                        // 他の車追加
                        TimeAtack.prototype.addOtherCar = function (id) {
                            this._run.addOtherCar(id);
                        };

                        // 他の車除去
                        TimeAtack.prototype.removeOtherCar = function (id) {
                            this._run.removeOtherCar(id);
                        };

                        // 他の車の姿勢更新
                        TimeAtack.prototype.updateOtherCarPosture = function () {
                            this._run.updateOtherCarPosture();
                        };
                        return TimeAtack;
                    })(lib.base.BaseDisplay);
                    timeatack.TimeAtack = TimeAtack;
                })(scene.timeatack || (scene.timeatack = {}));
                var timeatack = scene.timeatack;
            })(main.scene || (main.scene = {}));
            var scene = main.scene;
        })(display.main || (display.main = {}));
        var main = display.main;
    })(imjcart.display || (imjcart.display = {}));
    var display = imjcart.display;
})(imjcart || (imjcart = {}));

/// <reference path="../../../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../../../lib/three.d.ts"/>
/// <reference path="../../../../../../lib/lib.ts"/>
/// <reference path="../../../../../../imjcart/logic/value/GlobalValue.ts"/>
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
            (function (scene) {
                (function (timeatack) {
                    (function (run) {
                        var BtnPause = (function (_super) {
                            __extends(BtnPause, _super);
                            function BtnPause(target) {
                                var _this = this;
                                _super.call(this, target);
                                this._displayImpl = null;
                                this._buttonImpl = null;

                                //
                                this._displayImpl = new lib.display.SimpleDisplayImpl(this.$target);
                                this._displayImpl.addEventListener(lib.event.Event.DISPLAY_COMPLETE_OPEN_EVENT, function () {
                                    _this._buttonImpl.setActive();
                                });
                                this._displayImpl.addEventListener(lib.event.Event.DISPLAY_START_CLOSE_EVENT, function () {
                                    _this._buttonImpl.deleteActive();
                                });
                                this._buttonImpl = new lib.button.SimpleButtonImpl(this.$target);
                                this._buttonImpl.addEventListener(lib.event.Event.BUTTON_CLICK_EVENT, function () {
                                    // タイムアタック一時停止イベント
                                    var values = imjcart.logic.value.GlobalValue.getInstance();
                                    values.main.dispatchEvent(imjcart.logic.event.ProjectEvent.PAUSE_TIMEATTACK_EVENT);
                                });
                            }
                            BtnPause.prototype.open = function () {
                                this._displayImpl.open(0);
                            };

                            BtnPause.prototype.close = function () {
                                this._displayImpl.close(0);
                            };
                            return BtnPause;
                        })(lib.base.BaseDisplay);
                        run.BtnPause = BtnPause;
                    })(timeatack.run || (timeatack.run = {}));
                    var run = timeatack.run;
                })(scene.timeatack || (scene.timeatack = {}));
                var timeatack = scene.timeatack;
            })(main.scene || (main.scene = {}));
            var scene = main.scene;
        })(display.main || (display.main = {}));
        var main = display.main;
    })(imjcart.display || (imjcart.display = {}));
    var display = imjcart.display;
})(imjcart || (imjcart = {}));

/// <reference path="../../../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../../../lib/three.d.ts"/>
/// <reference path="../../../../../../lib/lib.ts"/>
/// <reference path="../../../../../../imjcart/logic/value/GlobalValue.ts"/>
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
            (function (scene) {
                (function (timeatack) {
                    (function (run) {
                        var BtnSave = (function (_super) {
                            __extends(BtnSave, _super);
                            function BtnSave(target) {
                                var _this = this;
                                _super.call(this, target);
                                this._displayImpl = null;
                                this._buttonImpl = null;

                                //
                                this._displayImpl = new lib.display.SimpleDisplayImpl(this.$target);
                                this._displayImpl.addEventListener(lib.event.Event.DISPLAY_COMPLETE_OPEN_EVENT, function () {
                                    _this._buttonImpl.setActive();
                                });
                                this._displayImpl.addEventListener(lib.event.Event.DISPLAY_START_CLOSE_EVENT, function () {
                                    _this._buttonImpl.deleteActive();
                                });
                                this._buttonImpl = new lib.button.SimpleButtonImpl(this.$target);
                                this._buttonImpl.addEventListener(lib.event.Event.BUTTON_CLICK_EVENT, function () {
                                    // タイムアタック一時停止イベント
                                    var values = imjcart.logic.value.GlobalValue.getInstance();
                                    values.main.dispatchEvent(imjcart.logic.event.ProjectEvent.PAUSE_TIMEATTACK_EVENT);
                                });
                            }
                            BtnSave.prototype.open = function () {
                                this._displayImpl.open(0);
                            };

                            BtnSave.prototype.close = function () {
                                this._displayImpl.close(0);
                            };
                            return BtnSave;
                        })(lib.base.BaseDisplay);
                        run.BtnSave = BtnSave;
                    })(timeatack.run || (timeatack.run = {}));
                    var run = timeatack.run;
                })(scene.timeatack || (scene.timeatack = {}));
                var timeatack = scene.timeatack;
            })(main.scene || (main.scene = {}));
            var scene = main.scene;
        })(display.main || (display.main = {}));
        var main = display.main;
    })(imjcart.display || (imjcart.display = {}));
    var display = imjcart.display;
})(imjcart || (imjcart = {}));

/// <reference path="../../../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../../../lib/three.d.ts"/>
/// <reference path="../../../../../../lib/lib.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var imjcart;
(function (imjcart) {
    (function (_display) {
        (function (main) {
            (function (scene) {
                (function (timeatack) {
                    (function (run) {
                        (function (coursemap) {
                            var CourseMap = (function (_super) {
                                __extends(CourseMap, _super);
                                function CourseMap(target) {
                                    var _this = this;
                                    _super.call(this, target);
                                    this._displayImpl = null;
                                    this._$car = null;
                                    this._$carOther = null;
                                    this._canvas = null;
                                    this._context = null;
                                    this._carX = null;
                                    this._carY = null;
                                    this._intervalId = null;

                                    //
                                    this._$car = $("#sceneTimeAtackRunCourseMapCar");
                                    this._$carOther = $(".sceneTimeAtackRunCourseMapCarOther");
                                    this._canvas = document.getElementById("sceneTimeAtackRunCourseMapCanvas");
                                    this._context = this._canvas.getContext("2d");

                                    //
                                    this._displayImpl = new lib.display.SimpleDisplayImpl(this.$target);
                                    this._displayImpl.addEventListener(lib.event.Event.DISPLAY_START_OPEN_EVENT, function () {
                                        _this._createCourse();
                                        _this._createCar();
                                    });
                                }
                                CourseMap.prototype.open = function () {
                                    this._displayImpl.open(0);
                                };

                                CourseMap.prototype.close = function () {
                                    this._displayImpl.close(0);
                                };

                                CourseMap.prototype.update = function (x, y) {
                                    this._carX = x * imjcart.logic.value.Const.COURSE_MAP_SCALE;
                                    this._carY = y * imjcart.logic.value.Const.COURSE_MAP_SCALE;
                                };

                                CourseMap.prototype._createCourse = function () {
                                    var size = imjcart.logic.value.Const.COURSE_MAP_SCALE / imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE;
                                    this._context.save();
                                    var i, j, max, max2;
                                    for (i = 0, max = imjcart.logic.map.value.MapConst.MAP.length; i < max; i = i + 1) {
                                        for (j = 0, max2 = imjcart.logic.map.value.MapConst.MAP[i].length; j < max2; j = j + 1) {
                                            if (imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_LAP_START_POINT) {
                                                this._context.fillStyle = "rgb(255, 0, 0)";
                                                this._context.fillRect((size * j), (size * i), size, size);
                                            } else if (imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_TREE) {
                                                this._context.fillStyle = "rgb(0, 100, 0)";
                                                this._context.fillRect((size * j), (size * i), size, size);
                                            } else if (imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_TIRE) {
                                                this._context.fillStyle = "rgb(50, 50, 255)";
                                                this._context.fillRect((size * j), (size * i), size, size);
                                            } else if (imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_NONE || imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_CAR_START_POSITION || imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_LAP_MEDIAN_CENTER_01 || imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_LAP_MEDIAN_CENTER_02) {
                                                this._context.fillStyle = "rgb(255, 255, 255)";
                                                this._context.fillRect((size * j), (size * i), size, size);
                                            } else {
                                                if (i % 2) {
                                                    this._context.fillStyle = "rgb(120, 160, 80)";
                                                    this._context.fillRect((size * j), (size * i), size, size);
                                                }
                                            }
                                        }
                                    }
                                    this._context.restore();
                                };

                                CourseMap.prototype._createCar = function () {
                                    var _this = this;
                                    this._$car.css({
                                        position: "absolute",
                                        backgroundColor: imjcart.logic.value.GlobalValue.getInstance().colorBody
                                    });

                                    //
                                    if (this._intervalId)
                                        clearInterval(this._intervalId);
                                    this._intervalId = setInterval(function () {
                                        _this._$car.css({
                                            left: _this._carX - 4,
                                            top: _this._carY - 4
                                        });
                                    }, 1000 / 10);
                                };

                                // 他の車追加
                                CourseMap.prototype.addOtherCar = function (id) {
                                    var values = imjcart.logic.value.GlobalValue.getInstance();
                                    var i = 0, max;
                                    for (i = 0, max = values.otherCarInfoArr.length; i < max; i = i + 1) {
                                        var info = values.otherCarInfoArr[i];
                                        if (info.id == id) {
                                            var $carOther = this._$carOther.clone();
                                            $carOther.attr("data-id", id);
                                            $carOther.css({
                                                display: "block",
                                                position: "absolute",
                                                backgroundColor: info.colorBody
                                            });
                                            this.$target.append($carOther);
                                            return;
                                        }
                                    }
                                };

                                // 他の車除去
                                CourseMap.prototype.removeOtherCar = function (id) {
                                    this.$target.find(".sceneTimeAtackRunCourseMapCarOther").each(function () {
                                        if ($(this).attr("data-id") == id) {
                                            $(this).remove();
                                        }
                                    });
                                };

                                // 他の車の姿勢更新
                                CourseMap.prototype.updateOtherCarPosture = function () {
                                    var values = imjcart.logic.value.GlobalValue.getInstance();
                                    var i = 0, max;
                                    for (i = 0, max = values.otherCarInfoArr.length; i < max; i = i + 1) {
                                        var info = values.otherCarInfoArr[i];
                                        this.$target.find(".sceneTimeAtackRunCourseMapCarOther").each(function () {
                                            if ($(this).attr("data-id") == info.id) {
                                                $(this).css({
                                                    left: info.x * imjcart.logic.value.Const.COURSE_MAP_SCALE - 2,
                                                    top: info.y * imjcart.logic.value.Const.COURSE_MAP_SCALE - 2
                                                });
                                            }
                                        });
                                    }
                                };
                                return CourseMap;
                            })(lib.base.BaseDisplay);
                            coursemap.CourseMap = CourseMap;
                        })(run.coursemap || (run.coursemap = {}));
                        var coursemap = run.coursemap;
                    })(timeatack.run || (timeatack.run = {}));
                    var run = timeatack.run;
                })(scene.timeatack || (scene.timeatack = {}));
                var timeatack = scene.timeatack;
            })(main.scene || (main.scene = {}));
            var scene = main.scene;
        })(_display.main || (_display.main = {}));
        var main = _display.main;
    })(imjcart.display || (imjcart.display = {}));
    var display = imjcart.display;
})(imjcart || (imjcart = {}));

/// <reference path="../../../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../../../lib/three.d.ts"/>
/// <reference path="../../../../../../lib/lib.ts"/>
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
            (function (scene) {
                (function (timeatack) {
                    (function (run) {
                        var EngineCondition = (function (_super) {
                            __extends(EngineCondition, _super);
                            function EngineCondition(target) {
                                var _this = this;
                                _super.call(this, target);
                                this._displayImpl = null;
                                this._$mater = $("#sceneTimeAtackRunEngineConditionMater");
                                this._$speed = $("#sceneTimeAtackRunEngineConditionSpeedTxt");
                                this._rotation = null;
                                this._speed = null;
                                this._intervalId = null;

                                //
                                this._displayImpl = new lib.display.SimpleDisplayImpl(this.$target);
                                this._displayImpl.addEventListener(lib.event.Event.DISPLAY_START_OPEN_EVENT, function () {
                                    _this.speed = 0;
                                    _this.power = 0;
                                    _this.gear = 0;
                                    _this.direction = 0;
                                });
                            }
                            EngineCondition.prototype.open = function () {
                                var _this = this;
                                this._displayImpl.open(0);

                                //
                                if (this._intervalId)
                                    clearInterval(this._intervalId);
                                this._intervalId = setInterval(function () {
                                    _this._$mater.attr("transform", "rotate(" + _this._rotation + " 100 100)");
                                    _this._$speed.text(String(_this._speed));
                                }, 1000 / 10);
                            };

                            EngineCondition.prototype.close = function () {
                                this._displayImpl.close(0);
                            };

                            Object.defineProperty(EngineCondition.prototype, "speed", {
                                set: function (value) {
                                    this._rotation = Math.floor((180 * (Math.abs(value) * 0.5)) + 45);
                                    this._speed = Math.floor(Math.abs(value) * 100);
                                    //this._$mater.attr("transform", "rotate(" + Math.floor((180 * (Math.abs(value) * 0.5)) + 45) + " 100 100)");
                                },
                                enumerable: true,
                                configurable: true
                            });

                            Object.defineProperty(EngineCondition.prototype, "power", {
                                set: function (value) {
                                },
                                enumerable: true,
                                configurable: true
                            });

                            Object.defineProperty(EngineCondition.prototype, "gear", {
                                set: function (value) {
                                },
                                enumerable: true,
                                configurable: true
                            });

                            Object.defineProperty(EngineCondition.prototype, "direction", {
                                set: function (value) {
                                },
                                enumerable: true,
                                configurable: true
                            });
                            return EngineCondition;
                        })(lib.base.BaseDisplay);
                        run.EngineCondition = EngineCondition;
                    })(timeatack.run || (timeatack.run = {}));
                    var run = timeatack.run;
                })(scene.timeatack || (scene.timeatack = {}));
                var timeatack = scene.timeatack;
            })(main.scene || (main.scene = {}));
            var scene = main.scene;
        })(display.main || (display.main = {}));
        var main = display.main;
    })(imjcart.display || (imjcart.display = {}));
    var display = imjcart.display;
})(imjcart || (imjcart = {}));

/// <reference path="../../../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../../../lib/three.d.ts"/>
/// <reference path="../../../../../../lib/lib.ts"/>
/// <reference path="../../../../../../imjcart/logic/value/Const.ts"/>
/// <reference path="../../../../../../imjcart/logic/utility/Util.ts"/>
/// <reference path="../../../../../../imjcart/display/main/scene/timeatack/run/BtnSave.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var imjcart;
(function (imjcart) {
    (function (_display) {
        (function (main) {
            (function (scene) {
                (function (timeatack) {
                    (function (run) {
                        var LapTime = (function (_super) {
                            __extends(LapTime, _super);
                            function LapTime(target) {
                                var _this = this;
                                _super.call(this, target);
                                this._displayImpl = null;
                                this._btnSave = null;
                                this._$current = $("#sceneTimeAtackRunLapTimeCurrent");
                                this._$fastest = $("#sceneTimeAtackRunLapTimeFastest");
                                this._$fastestTxt = $("#sceneTimeAtackRunLapTimeFastestTxt");
                                this._$list = $("#sceneTimeAtackRunLapTimeList");
                                this._$listItem = null;
                                this._isExixtFastest = false;

                                // 保存ボタン
                                this._btnSave = new run.BtnSave($("#sceneTimeAtackRunBtnSave"));
                                this._$listItem = this._$list.find("li").clone();
                                this._$list.empty();

                                //
                                this._displayImpl = new lib.display.SimpleDisplayImpl(this.$target);
                                this._displayImpl.addEventListener(lib.event.Event.DISPLAY_START_OPEN_EVENT, function () {
                                    _this.currentTime = 0;
                                });
                            }
                            LapTime.prototype.open = function () {
                                this._displayImpl.open(0);
                            };

                            LapTime.prototype.close = function () {
                                this._displayImpl.close(0);
                            };

                            Object.defineProperty(LapTime.prototype, "fastestLap", {
                                set: function (value) {
                                    if (!this._isExixtFastest) {
                                        this._isExixtFastest = true;
                                        this._$fastest.css({
                                            display: "block"
                                        });
                                        this._btnSave.open();
                                    }
                                    this._$fastestTxt.text(imjcart.logic.utility.Util.formatTime(value));
                                },
                                enumerable: true,
                                configurable: true
                            });

                            Object.defineProperty(LapTime.prototype, "currentTime", {
                                set: function (value) {
                                    this._$current.text(imjcart.logic.utility.Util.formatTime(value));
                                },
                                enumerable: true,
                                configurable: true
                            });

                            Object.defineProperty(LapTime.prototype, "lapTimeArr", {
                                set: function (arr) {
                                    // これまでのラップタイムを表示
                                    this._$list.empty();
                                    var j = 0;
                                    for (var i = arr.length - 1; 0 <= i; i--) {
                                        var time = arr[i];
                                        var $listItem = this._$listItem.clone();
                                        $listItem.find(".sceneTimeAtackRunLapTimeListLap").text(i + 1 + "");
                                        $listItem.find(".sceneTimeAtackRunLapTimeListTime").text(imjcart.logic.utility.Util.formatTime(time));
                                        this._$list.append($listItem);
                                        j++;
                                        if (imjcart.logic.value.Const.LAP_TIME_LIST_MAX <= j)
                                            break;
                                    }
                                },
                                enumerable: true,
                                configurable: true
                            });
                            return LapTime;
                        })(lib.base.BaseDisplay);
                        run.LapTime = LapTime;
                    })(timeatack.run || (timeatack.run = {}));
                    var run = timeatack.run;
                })(scene.timeatack || (scene.timeatack = {}));
                var timeatack = scene.timeatack;
            })(main.scene || (main.scene = {}));
            var scene = main.scene;
        })(_display.main || (_display.main = {}));
        var main = _display.main;
    })(imjcart.display || (imjcart.display = {}));
    var display = imjcart.display;
})(imjcart || (imjcart = {}));

/// <reference path="../../../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../../../lib/three.d.ts"/>
/// <reference path="../../../../../../lib/lib.ts"/>
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
            (function (scene) {
                (function (timeatack) {
                    (function (run) {
                        var Message = (function (_super) {
                            __extends(Message, _super);
                            function Message(target) {
                                var _this = this;
                                _super.call(this, target);
                                this._displayImpl = null;
                                this._$txt = $("#sceneTimeAtackRunMessageTxt");
                                this._intervalId = null;

                                //
                                this._displayImpl = new lib.display.SimpleDisplayImpl(this.$target);
                                this._displayImpl.addEventListener(lib.event.Event.DISPLAY_START_OPEN_EVENT, function () {
                                    if (_this._intervalId)
                                        clearInterval(_this._intervalId);
                                    _this._intervalId = setInterval(function () {
                                        _this.close();
                                    }, 3000);
                                });
                                this._displayImpl.addEventListener(lib.event.Event.DISPLAY_COMPLETE_CLOSE_EVENT, function () {
                                    _this._$txt.empty();
                                });
                            }
                            Message.prototype.open = function () {
                                this._displayImpl.open(0);
                            };

                            Message.prototype.close = function () {
                                this._displayImpl.close(0);
                            };

                            Object.defineProperty(Message.prototype, "message", {
                                set: function (value) {
                                    this._$txt.text(value);
                                },
                                enumerable: true,
                                configurable: true
                            });
                            return Message;
                        })(lib.base.BaseDisplay);
                        run.Message = Message;
                    })(timeatack.run || (timeatack.run = {}));
                    var run = timeatack.run;
                })(scene.timeatack || (scene.timeatack = {}));
                var timeatack = scene.timeatack;
            })(main.scene || (main.scene = {}));
            var scene = main.scene;
        })(display.main || (display.main = {}));
        var main = display.main;
    })(imjcart.display || (imjcart.display = {}));
    var display = imjcart.display;
})(imjcart || (imjcart = {}));

/// <reference path="../../../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../../../lib/three.d.ts"/>
/// <reference path="../../../../../../lib/lib.ts"/>
/// <reference path="../../../../../../imjcart/logic/value/Const.ts"/>
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
            (function (scene) {
                (function (timeatack) {
                    (function (run) {
                        var Players = (function (_super) {
                            __extends(Players, _super);
                            //.sceneTimeAtackRunPlayersListColor
                            //.sceneTimeAtackRunPlayersListName
                            function Players(target) {
                                _super.call(this, target);
                                this._displayImpl = null;
                                this._$list = $("#sceneTimeAtackRunPlayersList");
                                this._$listItem = null;

                                //
                                this._$listItem = this._$list.find("li").clone();
                                this._$list.empty();

                                //
                                this._displayImpl = new lib.display.SimpleDisplayImpl(this.$target);
                            }
                            Players.prototype.open = function () {
                                this._displayImpl.open(0);
                            };

                            Players.prototype.close = function () {
                                this._displayImpl.close(0);
                            };

                            // 他の車追加
                            Players.prototype.addOtherCar = function (id) {
                                var values = imjcart.logic.value.GlobalValue.getInstance();
                                var i = 0, max;
                                for (i = 0, max = values.otherCarInfoArr.length; i < max; i = i + 1) {
                                    var info = values.otherCarInfoArr[i];
                                    if (info.id == id) {
                                        var $listItem = this._$listItem.clone();
                                        $listItem.attr("data-id", id);
                                        $listItem.find(".sceneTimeAtackRunPlayersListName").each(function () {
                                            $(this).text(info.name);
                                        });
                                        $listItem.find(".sceneTimeAtackRunPlayersListColor").each(function () {
                                            $(this).find("#wing").each(function () {
                                                $(this).find("rect").each(function () {
                                                    $(this).attr("style", "fill:" + info.colorWing);
                                                });
                                            });
                                            $(this).find("#driver").each(function () {
                                                $(this).find("ellipse").each(function () {
                                                    $(this).attr("style", "fill:" + info.colorDriver);
                                                });
                                            });
                                            $(this).find("#body").each(function () {
                                                $(this).find("path").each(function () {
                                                    $(this).attr("style", "fill:" + info.colorBody);
                                                });
                                            });
                                        });
                                        this._$list.append($listItem);
                                        return;
                                    }
                                }
                            };

                            // 他の車除去
                            Players.prototype.removeOtherCar = function (id) {
                                this._$list.find("li").each(function () {
                                    if ($(this).attr("data-id") == id) {
                                        $(this).remove();
                                        return;
                                    }
                                });
                            };
                            return Players;
                        })(lib.base.BaseDisplay);
                        run.Players = Players;
                    })(timeatack.run || (timeatack.run = {}));
                    var run = timeatack.run;
                })(scene.timeatack || (scene.timeatack = {}));
                var timeatack = scene.timeatack;
            })(main.scene || (main.scene = {}));
            var scene = main.scene;
        })(display.main || (display.main = {}));
        var main = display.main;
    })(imjcart.display || (imjcart.display = {}));
    var display = imjcart.display;
})(imjcart || (imjcart = {}));

/// <reference path="../../../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../../../lib/three.d.ts"/>
/// <reference path="../../../../../../lib/lib.ts"/>
/// <reference path="../../../../../../imjcart/display/main/scene/timeatack/run/BtnPause.ts"/>
/// <reference path="../../../../../../imjcart/display/main/scene/timeatack/run/LapTime.ts"/>
/// <reference path="../../../../../../imjcart/display/main/scene/timeatack/run/EngineCondition.ts"/>
/// <reference path="../../../../../../imjcart/display/main/scene/timeatack/run/CourseMap.ts"/>
/// <reference path="../../../../../../imjcart/display/main/scene/timeatack/run/Message.ts"/>
/// <reference path="../../../../../../imjcart/display/main/scene/timeatack/run/Players.ts"/>
/// <reference path="../../../../../../imjcart/display/main/scene/timeatack/run/pausewindow/PauseWindow.ts"/>
/// <reference path="../../../../../../imjcart/logic/map/Map.ts"/>
/// <reference path="../../../../../../imjcart/logic/physics/Physics.ts"/>
/// <reference path="../../../../../../imjcart/logic/controller/Controller.ts"/>
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
            (function (scene) {
                (function (timeatack) {
                    (function (run) {
                        var Run = (function (_super) {
                            __extends(Run, _super);
                            function Run(target) {
                                var _this = this;
                                _super.call(this, target);
                                this._displayImpl = null;
                                this._btnPause = null;
                                this._lapTime = null;
                                this._engineCondition = null;
                                this._courseMap = null;
                                this._message = null;
                                this._pauseWindow = null;
                                this._players = null;
                                //
                                this._map = null;
                                this._physics = null;
                                //
                                this._time = null;
                                this._lapTimeArr = [];
                                this._intervalId = null;
                                this._isPause = false;

                                // 停止ボタン
                                this._btnPause = new run.BtnPause($("#sceneTimeAtackRunBtnPause"));

                                // ラップタイム
                                this._lapTime = new run.LapTime($("#sceneTimeAtackRunLapTime"));

                                // エンジンメーター
                                this._engineCondition = new run.EngineCondition($("#sceneTimeAtackRunEngineCondition"));

                                // コースマップ
                                this._courseMap = new run.coursemap.CourseMap($("#sceneTimeAtackRunCourseMap"));

                                // メッセージ
                                this._message = new run.Message($("#sceneTimeAtackRunMessage"));

                                // 停止ウィンドウ
                                this._pauseWindow = new run.pausewindow.PauseWindow($("#sceneTimeAtackRunPauseWindow"));

                                // 走行中プレーヤー
                                this._players = new run.Players($("#sceneTimeAtackRunPlayers"));

                                //
                                this._displayImpl = new lib.display.SimpleDisplayImpl(this.$target);
                                this._displayImpl.addEventListener(lib.event.Event.DISPLAY_START_OPEN_EVENT, function () {
                                    lib.responisive.ResizeManager.getInstance().addEventListener(_this);
                                    lib.responisive.ResizeManager.getInstance().dispatchEvent(_this);
                                });
                                this._displayImpl.addEventListener(lib.event.Event.DISPLAY_COMPLETE_OPEN_EVENT, function () {
                                    _this._completeOpen();
                                });
                                this._displayImpl.addEventListener(lib.event.Event.DISPLAY_START_CLOSE_EVENT, function () {
                                    _this._startClose();
                                });
                                this._displayImpl.addEventListener(lib.event.Event.DISPLAY_COMPLETE_CLOSE_EVENT, function () {
                                    lib.responisive.ResizeManager.getInstance().removeEventListener(_this);
                                    _this._completeClose();
                                });
                            }
                            Run.prototype.open = function () {
                                this._displayImpl.open(0);
                            };

                            Run.prototype.close = function () {
                                this._displayImpl.close(0);
                            };

                            Run.prototype._completeOpen = function () {
                                var _this = this;
                                this._btnPause.open();
                                this._lapTime.open();
                                this._engineCondition.open();
                                this._courseMap.open();
                                this._players.open();

                                // 車情報
                                var values = imjcart.logic.value.GlobalValue.getInstance();
                                values.carInfo = new imjcart.logic.info.CarInfo();

                                // マップ
                                this._map = new imjcart.logic.map.Map();

                                // 物理演算
                                this._physics = new imjcart.logic.physics.Physics($("#physics"));

                                // コントローラー
                                var controller = imjcart.logic.controller.Controller.getInstance();

                                //
                                // ---------- イベント ---------- //
                                //
                                // エンジン開始イベント
                                controller.addEventListener(imjcart.logic.controller.event.ControllerEvent.START_ENGINE_EVENT, function (evt) {
                                    _this._physics.startEngine(evt.value);
                                });

                                // エンジン停止イベント
                                controller.addEventListener(imjcart.logic.controller.event.ControllerEvent.STOP_ENGINE_EVENT, function () {
                                    _this._physics.stopEngine();
                                });

                                // ステアリング変更イベント
                                controller.addEventListener(imjcart.logic.controller.event.ControllerEvent.SET_STEERING_ANGLE_EVENT, function (evt) {
                                    _this._physics.setSteeringAngle(evt.value);
                                });

                                // ステアリングを元に戻すイベント
                                controller.addEventListener(imjcart.logic.controller.event.ControllerEvent.CLEAR_STEERING_ANGLE_EVENT, function () {
                                    _this._physics.clearSteeringAngle();
                                });

                                // カメラアングル変更イベント
                                controller.addEventListener(imjcart.logic.controller.event.ControllerEvent.CHANGE_CAMERA_ANGLE_EVENT, function () {
                                    // カメラアングル変更イベント
                                    values.main.dispatchEvent(imjcart.logic.event.ProjectEvent.CHANGE_CAMERA_ANGLE_EVENT);
                                });

                                // 車の状態変更イベント
                                this._physics.addEventListener(imjcart.logic.physics.event.PhysicsEvent.CHANGE_CAR_CONDITION_EVENT, function (evt) {
                                    var values = imjcart.logic.value.GlobalValue.getInstance();
                                    values.carInfo.x = evt.x;
                                    values.carInfo.y = evt.y;
                                    values.carInfo.bodyAngle = evt.bodyAngle;
                                    values.carInfo.wheelAngle = evt.wheelAngle;
                                    values.carInfo.speed = evt.speed;
                                    values.carInfo.power = evt.power;
                                    values.carInfo.gear = evt.gear;
                                    values.carInfo.direction = evt.direction;
                                    values.carInfo.colorBody = values.colorBody;
                                    values.carInfo.colorWing = values.colorWing;
                                    values.carInfo.colorDriver = values.colorDriver;
                                    values.carInfo.runningPath.pushPath(evt.x, evt.y, evt.bodyAngle);

                                    //
                                    _this._map.update(values.carInfo.x, values.carInfo.y);
                                    _this._engineCondition.speed = values.carInfo.speed;
                                    _this._engineCondition.power = values.carInfo.power;
                                    _this._engineCondition.gear = values.carInfo.gear;
                                    _this._engineCondition.direction = values.carInfo.direction;
                                    _this._courseMap.update(values.carInfo.x, values.carInfo.y);

                                    // 車の描画更新イベント
                                    values.main.dispatchEvent(imjcart.logic.event.ProjectEvent.RENDER_CAR_EVENT);
                                });

                                // ラップ開始
                                this._map.addEventListener(imjcart.logic.map.event.MapEvent.START_LAP_EVENT, function () {
                                    _this._startLap();
                                });

                                // ラップ記録
                                this._map.addEventListener(imjcart.logic.map.event.MapEvent.RECORD_LAPTIME_EVENT, function () {
                                    _this._recordLapTime();
                                });

                                // 芝に入る
                                this._map.addEventListener(imjcart.logic.map.event.MapEvent.IN_GRASS_EVENT, function () {
                                    _this._inGrass();
                                });

                                // 芝から出る
                                this._map.addEventListener(imjcart.logic.map.event.MapEvent.OUT_GRASS_EVENT, function () {
                                    _this._outGrass();
                                });

                                // 描画更新
                                setInterval(function () {
                                    _this._physics.update();
                                }, 1000 / imjcart.logic.value.Const.FPS);
                            };

                            Run.prototype._startClose = function () {
                                this._btnPause.close();
                            };

                            Run.prototype._completeClose = function () {
                                this._btnPause.close();
                                this._lapTime.close();
                                this._engineCondition.close();
                                this._courseMap.close();
                                this._players.close();
                            };

                            Run.prototype.onResize = function (width, height) {
                                if (width < imjcart.logic.value.Const.STAGE_WIDTH)
                                    width = imjcart.logic.value.Const.STAGE_WIDTH;
                                if (height < imjcart.logic.value.Const.STAGE_HEIGHT)
                                    height = imjcart.logic.value.Const.STAGE_HEIGHT;
                                this.$target.css({
                                    width: width,
                                    height: height - imjcart.logic.value.Const.FOOTER_HEIGHT - imjcart.logic.value.Const.RANKING_HEIGHT
                                });
                            };

                            Run.prototype._startLap = function () {
                                var _this = this;
                                this._time = 0;
                                if (this._intervalId)
                                    clearInterval(this._intervalId);
                                this._intervalId = setInterval(function () {
                                    if (_this._isPause)
                                        return;
                                    _this._time = _this._time + 10;
                                    _this._lapTime.currentTime = _this._time;
                                }, 100);

                                // 走行記録初期化
                                var values = imjcart.logic.value.GlobalValue.getInstance();
                                values.carInfo.runningPath.clearPath();
                                values.carInfo.runningPath.currentIndex = 0;

                                //console.log("走行記録初期化");
                                //console.log(values.carInfo.runningPath.collection);
                                // Startコメント表示
                                if (this._lapTimeArr.length <= 0) {
                                    this._message.message = "Start";
                                    this._message.open();
                                }
                            };

                            Run.prototype._recordLapTime = function () {
                                if (this._time <= 0) {
                                    this._message.message = "Start";
                                    this._message.open();
                                    return;
                                }
                                this._lapTimeArr.push(this._time);

                                // ファステストラップ表示
                                var fastestLap = this._time;
                                var i = 0, max;
                                for (i = 0, max = this._lapTimeArr.length; i < max; i = i + 1) {
                                    var lapTime = this._lapTimeArr[i];
                                    if (lapTime < fastestLap) {
                                        fastestLap = lapTime;
                                    }
                                }
                                this._lapTime.fastestLap = fastestLap;
                                this._lapTime.lapTimeArr = this._lapTimeArr;

                                // Lapコメント表示
                                if (this._time <= fastestLap) {
                                    this._message.message = "FastestLap " + imjcart.logic.utility.Util.formatTime(this._time);

                                    // ファステストラップ設定
                                    var values = imjcart.logic.value.GlobalValue.getInstance();
                                    values.main.dispatchEvent(imjcart.logic.event.ProjectEvent.SET_FASTEST_LAP_EVENT, {
                                        time: this._time
                                    });

                                    // 走行記録保存
                                    values.fastestRunningPathCollection = values.carInfo.runningPath.collection;
                                    //console.log("走行記録保存");
                                    //console.log(values.carInfo.runningPath.collection);
                                    //console.log(values.fastestRunningPathCollection);
                                } else {
                                    this._message.message = "LapTime " + imjcart.logic.utility.Util.formatTime(this._time);
                                }
                                this._message.open();
                            };

                            // 芝に入る
                            Run.prototype._inGrass = function () {
                                // スピードに制限をかける
                                this._physics.setLimitSpeed();
                            };

                            // 芝から出る
                            Run.prototype._outGrass = function () {
                                // スピードの制限を外す
                                this._physics.clearLimitSpeed();
                            };

                            // 一時停止
                            Run.prototype.pause = function () {
                                this._isPause = true;
                                this._physics.pause();
                                this._pauseWindow.open();
                            };

                            // 再開
                            Run.prototype.resume = function () {
                                this._isPause = false;
                                this._physics.resume();
                                this._pauseWindow.close();
                            };

                            // リトライ
                            Run.prototype.retry = function () {
                                // ラップタイム初期化
                                if (this._intervalId)
                                    clearInterval(this._intervalId);
                                this._time = 0;
                                this._lapTime.currentTime = this._time;

                                // 物理演算初期化
                                this._physics.retry();
                            };

                            // ラップタイム保存完了
                            Run.prototype.completeSaveLapTime = function () {
                                this._pauseWindow.completeSaveLapTime();
                            };

                            // 他の車追加
                            Run.prototype.addOtherCar = function (id) {
                                this._players.addOtherCar(id);
                                this._courseMap.addOtherCar(id);
                            };

                            // 他の車除去
                            Run.prototype.removeOtherCar = function (id) {
                                this._players.removeOtherCar(id);
                                this._courseMap.removeOtherCar(id);
                            };

                            // 他の車の姿勢更新
                            Run.prototype.updateOtherCarPosture = function () {
                                this._courseMap.updateOtherCarPosture();
                            };
                            return Run;
                        })(lib.base.BaseDisplay);
                        run.Run = Run;
                    })(timeatack.run || (timeatack.run = {}));
                    var run = timeatack.run;
                })(scene.timeatack || (scene.timeatack = {}));
                var timeatack = scene.timeatack;
            })(main.scene || (main.scene = {}));
            var scene = main.scene;
        })(display.main || (display.main = {}));
        var main = display.main;
    })(imjcart.display || (imjcart.display = {}));
    var display = imjcart.display;
})(imjcart || (imjcart = {}));

/// <reference path="../../../../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../../../../lib/three.d.ts"/>
/// <reference path="../../../../../../../lib/lib.ts"/>
/// <reference path="../../../../../../../imjcart/logic/value/GlobalValue.ts"/>
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
            (function (scene) {
                (function (timeatack) {
                    (function (run) {
                        (function (pausewindow) {
                            var BtnResume = (function (_super) {
                                __extends(BtnResume, _super);
                                function BtnResume(target) {
                                    var _this = this;
                                    _super.call(this, target);
                                    this._displayImpl = null;
                                    this._buttonImpl = null;

                                    //
                                    this._displayImpl = new lib.display.SimpleDisplayImpl(this.$target);
                                    this._displayImpl.addEventListener(lib.event.Event.DISPLAY_COMPLETE_OPEN_EVENT, function () {
                                        _this._buttonImpl.setActive();
                                    });
                                    this._displayImpl.addEventListener(lib.event.Event.DISPLAY_START_CLOSE_EVENT, function () {
                                        _this._buttonImpl.deleteActive();
                                    });
                                    this._buttonImpl = new lib.button.SimpleButtonImpl(this.$target);
                                    this._buttonImpl.addEventListener(lib.event.Event.BUTTON_CLICK_EVENT, function () {
                                        // タイムアタック再開イベント
                                        var values = imjcart.logic.value.GlobalValue.getInstance();
                                        values.main.dispatchEvent(imjcart.logic.event.ProjectEvent.RESUME_TIMEATTACK_EVENT);
                                    });
                                }
                                BtnResume.prototype.open = function () {
                                    this._displayImpl.open(0);
                                };

                                BtnResume.prototype.close = function () {
                                    this._displayImpl.close(0);
                                };
                                return BtnResume;
                            })(lib.base.BaseDisplay);
                            pausewindow.BtnResume = BtnResume;
                        })(run.pausewindow || (run.pausewindow = {}));
                        var pausewindow = run.pausewindow;
                    })(timeatack.run || (timeatack.run = {}));
                    var run = timeatack.run;
                })(scene.timeatack || (scene.timeatack = {}));
                var timeatack = scene.timeatack;
            })(main.scene || (main.scene = {}));
            var scene = main.scene;
        })(display.main || (display.main = {}));
        var main = display.main;
    })(imjcart.display || (imjcart.display = {}));
    var display = imjcart.display;
})(imjcart || (imjcart = {}));

/// <reference path="../../../../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../../../../lib/three.d.ts"/>
/// <reference path="../../../../../../../lib/lib.ts"/>
/// <reference path="../../../../../../../imjcart/logic/value/GlobalValue.ts"/>
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
            (function (scene) {
                (function (timeatack) {
                    (function (run) {
                        (function (pausewindow) {
                            var BtnRetry = (function (_super) {
                                __extends(BtnRetry, _super);
                                function BtnRetry(target) {
                                    var _this = this;
                                    _super.call(this, target);
                                    this._displayImpl = null;
                                    this._buttonImpl = null;

                                    //
                                    this._displayImpl = new lib.display.SimpleDisplayImpl(this.$target);
                                    this._displayImpl.addEventListener(lib.event.Event.DISPLAY_COMPLETE_OPEN_EVENT, function () {
                                        _this._buttonImpl.setActive();
                                    });
                                    this._displayImpl.addEventListener(lib.event.Event.DISPLAY_START_CLOSE_EVENT, function () {
                                        _this._buttonImpl.deleteActive();
                                    });
                                    this._buttonImpl = new lib.button.SimpleButtonImpl(this.$target);
                                    this._buttonImpl.addEventListener(lib.event.Event.BUTTON_CLICK_EVENT, function () {
                                        // タイムアタック再開イベント
                                        var values = imjcart.logic.value.GlobalValue.getInstance();
                                        values.main.dispatchEvent(imjcart.logic.event.ProjectEvent.RESUME_TIMEATTACK_EVENT);

                                        // タイムアタックリトライイベント
                                        var values = imjcart.logic.value.GlobalValue.getInstance();
                                        values.main.dispatchEvent(imjcart.logic.event.ProjectEvent.RETRY_TIMEATTACK_EVENT);
                                    });
                                }
                                BtnRetry.prototype.open = function () {
                                    this._displayImpl.open(0);
                                };

                                BtnRetry.prototype.close = function () {
                                    this._displayImpl.close(0);
                                };
                                return BtnRetry;
                            })(lib.base.BaseDisplay);
                            pausewindow.BtnRetry = BtnRetry;
                        })(run.pausewindow || (run.pausewindow = {}));
                        var pausewindow = run.pausewindow;
                    })(timeatack.run || (timeatack.run = {}));
                    var run = timeatack.run;
                })(scene.timeatack || (scene.timeatack = {}));
                var timeatack = scene.timeatack;
            })(main.scene || (main.scene = {}));
            var scene = main.scene;
        })(display.main || (display.main = {}));
        var main = display.main;
    })(imjcart.display || (imjcart.display = {}));
    var display = imjcart.display;
})(imjcart || (imjcart = {}));

/// <reference path="../../../../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../../../../lib/three.d.ts"/>
/// <reference path="../../../../../../../lib/lib.ts"/>
/// <reference path="../../../../../../../imjcart/display/main/scene/timeatack/run/pausewindow/BtnResume.ts"/>
/// <reference path="../../../../../../../imjcart/display/main/scene/timeatack/run/pausewindow/BtnRetry.ts"/>
/// <reference path="../../../../../../../imjcart/display/main/scene/timeatack/run/pausewindow/save/Save.ts"/>
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
            (function (scene) {
                (function (timeatack) {
                    (function (run) {
                        (function (pausewindow) {
                            var PauseWindow = (function (_super) {
                                __extends(PauseWindow, _super);
                                function PauseWindow(target) {
                                    var _this = this;
                                    _super.call(this, target);
                                    this._displayImpl = null;
                                    this._btnResume = null;
                                    this._btnRetry = null;
                                    this._save = null;

                                    //
                                    this._btnResume = new pausewindow.BtnResume($("#sceneTimeAtackRunPauseWindowBtnResume"));
                                    this._btnRetry = new pausewindow.BtnRetry($("#sceneTimeAtackRunPauseWindowBtnRetry"));
                                    this._save = new pausewindow.save.Save($("#sceneTimeAtackRunPauseWindowSave"));

                                    //
                                    this._displayImpl = new lib.display.SimpleDisplayImpl(this.$target);
                                    this._displayImpl.addEventListener(lib.event.Event.DISPLAY_START_OPEN_EVENT, function () {
                                        _this._startOpen();
                                    });
                                    this._displayImpl.addEventListener(lib.event.Event.DISPLAY_COMPLETE_CLOSE_EVENT, function () {
                                        _this._completeClose();
                                    });
                                }
                                PauseWindow.prototype.open = function () {
                                    this._displayImpl.open(0);
                                };

                                PauseWindow.prototype.close = function () {
                                    this._displayImpl.close(0);
                                };

                                PauseWindow.prototype._startOpen = function () {
                                    this._btnResume.open();
                                    this._btnRetry.open();

                                    //
                                    var values = imjcart.logic.value.GlobalValue.getInstance();
                                    if (values.fastestLapTime) {
                                        this._save.open();
                                    }
                                };

                                PauseWindow.prototype._completeClose = function () {
                                    this._btnResume.close();
                                    this._btnRetry.close();
                                    this._save.close();
                                };

                                // ラップタイム保存完了
                                PauseWindow.prototype.completeSaveLapTime = function () {
                                    this._save.completeSaveLapTime();
                                };
                                return PauseWindow;
                            })(lib.base.BaseDisplay);
                            pausewindow.PauseWindow = PauseWindow;
                        })(run.pausewindow || (run.pausewindow = {}));
                        var pausewindow = run.pausewindow;
                    })(timeatack.run || (timeatack.run = {}));
                    var run = timeatack.run;
                })(scene.timeatack || (scene.timeatack = {}));
                var timeatack = scene.timeatack;
            })(main.scene || (main.scene = {}));
            var scene = main.scene;
        })(display.main || (display.main = {}));
        var main = display.main;
    })(imjcart.display || (imjcart.display = {}));
    var display = imjcart.display;
})(imjcart || (imjcart = {}));

/// <reference path="../../../../../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../../../../../lib/three.d.ts"/>
/// <reference path="../../../../../../../../lib/lib.ts"/>
/// <reference path="../../../../../../../../imjcart/logic/value/GlobalValue.ts"/>
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
            (function (scene) {
                (function (timeatack) {
                    (function (run) {
                        (function (pausewindow) {
                            (function (save) {
                                var BtnSave = (function (_super) {
                                    __extends(BtnSave, _super);
                                    function BtnSave(target) {
                                        var _this = this;
                                        _super.call(this, target);
                                        this._displayImpl = null;
                                        this._buttonImpl = null;

                                        //
                                        this._displayImpl = new lib.display.SimpleDisplayImpl(this.$target);
                                        this._displayImpl.addEventListener(lib.event.Event.DISPLAY_COMPLETE_OPEN_EVENT, function () {
                                            _this._buttonImpl.setActive();
                                        });
                                        this._displayImpl.addEventListener(lib.event.Event.DISPLAY_START_CLOSE_EVENT, function () {
                                            _this._buttonImpl.deleteActive();
                                        });
                                        this._buttonImpl = new lib.button.SimpleButtonImpl(this.$target);
                                        this._buttonImpl.addEventListener(lib.event.Event.BUTTON_CLICK_EVENT, function () {
                                            // ラップタイム保存
                                            _this.dispatchEvent("save_laptime");
                                        });
                                    }
                                    BtnSave.prototype.open = function () {
                                        this._displayImpl.open(0);
                                    };

                                    BtnSave.prototype.close = function () {
                                        this._displayImpl.close(0);
                                    };
                                    return BtnSave;
                                })(lib.base.BaseDisplay);
                                save.BtnSave = BtnSave;
                            })(pausewindow.save || (pausewindow.save = {}));
                            var save = pausewindow.save;
                        })(run.pausewindow || (run.pausewindow = {}));
                        var pausewindow = run.pausewindow;
                    })(timeatack.run || (timeatack.run = {}));
                    var run = timeatack.run;
                })(scene.timeatack || (scene.timeatack = {}));
                var timeatack = scene.timeatack;
            })(main.scene || (main.scene = {}));
            var scene = main.scene;
        })(display.main || (display.main = {}));
        var main = display.main;
    })(imjcart.display || (imjcart.display = {}));
    var display = imjcart.display;
})(imjcart || (imjcart = {}));

/// <reference path="../../../../../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../../../../../lib/three.d.ts"/>
/// <reference path="../../../../../../../../lib/lib.ts"/>
/// <reference path="../../../../../../../../imjcart/logic/value/GlobalValue.ts"/>
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
            (function (scene) {
                (function (timeatack) {
                    (function (run) {
                        (function (pausewindow) {
                            (function (save) {
                                var BtnTweet = (function (_super) {
                                    __extends(BtnTweet, _super);
                                    function BtnTweet(target) {
                                        var _this = this;
                                        _super.call(this, target);
                                        this._displayImpl = null;
                                        this._buttonImpl = null;

                                        //
                                        this._displayImpl = new lib.display.SimpleDisplayImpl(this.$target);
                                        this._displayImpl.addEventListener(lib.event.Event.DISPLAY_COMPLETE_OPEN_EVENT, function () {
                                            _this._buttonImpl.setActive();
                                        });
                                        this._displayImpl.addEventListener(lib.event.Event.DISPLAY_START_CLOSE_EVENT, function () {
                                            _this._buttonImpl.deleteActive();
                                        });
                                        this._buttonImpl = new lib.button.SimpleButtonImpl(this.$target);
                                        this._buttonImpl.addEventListener(lib.event.Event.BUTTON_CLICK_EVENT, function () {
                                            // ラップタイムツイート
                                            _this.dispatchEvent("tweet_laptime");
                                        });
                                    }
                                    BtnTweet.prototype.open = function () {
                                        this._displayImpl.open(0);
                                    };

                                    BtnTweet.prototype.close = function () {
                                        this._displayImpl.close(0);
                                    };
                                    return BtnTweet;
                                })(lib.base.BaseDisplay);
                                save.BtnTweet = BtnTweet;
                            })(pausewindow.save || (pausewindow.save = {}));
                            var save = pausewindow.save;
                        })(run.pausewindow || (run.pausewindow = {}));
                        var pausewindow = run.pausewindow;
                    })(timeatack.run || (timeatack.run = {}));
                    var run = timeatack.run;
                })(scene.timeatack || (scene.timeatack = {}));
                var timeatack = scene.timeatack;
            })(main.scene || (main.scene = {}));
            var scene = main.scene;
        })(display.main || (display.main = {}));
        var main = display.main;
    })(imjcart.display || (imjcart.display = {}));
    var display = imjcart.display;
})(imjcart || (imjcart = {}));

/// <reference path="../../../../../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../../../../../lib/three.d.ts"/>
/// <reference path="../../../../../../../../lib/lib.ts"/>
/// <reference path="../../../../../../../../imjcart/display/main/scene/timeatack/run/pausewindow/save/BtnSave.ts"/>
/// <reference path="../../../../../../../../imjcart/display/main/scene/timeatack/run/pausewindow/save/BtnTweet.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var imjcart;
(function (imjcart) {
    (function (_display) {
        (function (main) {
            (function (scene) {
                (function (timeatack) {
                    (function (run) {
                        (function (pausewindow) {
                            (function (save) {
                                var Save = (function (_super) {
                                    __extends(Save, _super);
                                    function Save(target) {
                                        var _this = this;
                                        _super.call(this, target);
                                        this._displayImpl = null;
                                        this._btnSave = null;
                                        this._btnTweet = null;
                                        this._$form = null;
                                        this._$progress = null;
                                        this._$complete = null;
                                        this._$completeRank = null;
                                        this._$completeLength = null;
                                        this._$completeLapTime = null;
                                        this._$completeName = null;
                                        this._$comment = null;
                                        this._$lapTime = null;
                                        this._$name = null;

                                        //
                                        this._btnSave = new save.BtnSave($("#sceneTimeAtackRunPauseWindowSaveBtnSave"));
                                        this._btnSave.addEventListener("save_laptime", function (evt) {
                                            _this._saveLapTime();
                                        });
                                        this._btnTweet = new save.BtnTweet($("#sceneTimeAtackRunPauseWindowSaveBtnTweet"));
                                        this._btnTweet.addEventListener("tweet_laptime", function (evt) {
                                            _this._tweetLapTime();
                                        });
                                        this._$form = $("#sceneTimeAtackRunPauseWindowSaveForm");
                                        this._$progress = $("#sceneTimeAtackRunPauseWindowSaveProgress");
                                        this._$complete = $("#sceneTimeAtackRunPauseWindowSaveComplete");
                                        this._$completeRank = $("#sceneTimeAtackRunPauseWindowSaveCompleteRank");
                                        this._$completeLength = $("#sceneTimeAtackRunPauseWindowSaveCompleteLength");
                                        this._$completeLapTime = $("#sceneTimeAtackRunPauseWindowSaveCompleteLapTime");
                                        this._$completeName = $("#sceneTimeAtackRunPauseWindowSaveCompleteName");
                                        this._$lapTime = $("#sceneTimeAtackRunPauseWindowSaveLapTime");
                                        this._$name = $("#sceneTimeAtackRunPauseWindowSaveName");
                                        this._$comment = $("#sceneTimeAtackRunPauseWindowSaveComment");

                                        //
                                        this._displayImpl = new lib.display.SimpleDisplayImpl(this.$target);
                                        this._displayImpl.addEventListener(lib.event.Event.DISPLAY_START_OPEN_EVENT, function () {
                                            _this._startOpen();
                                        });
                                        this._displayImpl.addEventListener(lib.event.Event.DISPLAY_COMPLETE_CLOSE_EVENT, function () {
                                            _this._completeClose();
                                        });
                                    }
                                    Save.prototype.open = function () {
                                        this._displayImpl.open(0);
                                    };

                                    Save.prototype.close = function () {
                                        this._displayImpl.close(0);
                                    };

                                    Save.prototype._startOpen = function () {
                                        var values = imjcart.logic.value.GlobalValue.getInstance();
                                        if (!values.lapTimeInfo || values.lapTimeInfo.time != values.fastestLapTime) {
                                            this._$form.css({
                                                display: "block"
                                            });
                                            this._$progress.css({
                                                display: "none"
                                            });
                                            this._$complete.css({
                                                display: "none"
                                            });
                                            this._btnSave.open();
                                            this._btnTweet.close();
                                            this._$comment.val("");
                                            if (values.name)
                                                this._$name.val(values.name);
                                            this._$lapTime.text(imjcart.logic.utility.Util.formatTime(values.fastestLapTime));
                                        } else {
                                            this._$form.css({
                                                display: "none"
                                            });
                                            this._$progress.css({
                                                display: "none"
                                            });
                                            this._$complete.css({
                                                display: "block"
                                            });
                                            this._btnTweet.open();
                                        }
                                    };

                                    Save.prototype._completeClose = function () {
                                        this._btnSave.close();
                                        this._btnTweet.close();
                                    };

                                    Save.prototype._saveLapTime = function () {
                                        // ラップタイム保存イベント
                                        var values = imjcart.logic.value.GlobalValue.getInstance();
                                        values.main.dispatchEvent(imjcart.logic.event.ProjectEvent.SAVE_LAPTIME_EVENT, {
                                            name: this._$name.val(),
                                            comment: this._$comment.val()
                                        });
                                        this._$form.css({
                                            display: "none"
                                        });
                                        this._$progress.css({
                                            display: "block"
                                        });
                                        this._$complete.css({
                                            display: "none"
                                        });
                                    };

                                    Save.prototype._tweetLapTime = function () {
                                        // ラップタイムツイート
                                        var values = imjcart.logic.value.GlobalValue.getInstance();
                                        var url = imjcart.logic.value.Const.TWEET_URL;
                                        var hash = imjcart.logic.value.Const.TWEET_HASHTAG;
                                        var time = imjcart.logic.utility.Util.formatTime(values.lapTimeInfo.time);
                                        var rank = values.lapTimeInfo.rank;
                                        var length = values.lapTimeInfo.length;
                                        var name = values.lapTimeInfo.name;
                                        var comment = "";
                                        if (values.lapTimeInfo.comment)
                                            comment = values.lapTimeInfo.comment;
                                        var text = name + " " + time + " (" + rank + "th/" + length + ") " + comment;
                                        text.replace(/[\n\r]/g, "");
                                        text = encodeURIComponent(text);
                                        window.open("http://twitter.com/share?text=" + text + "&hashtags=" + hash + "&url=" + url, "tweetwindow", "width=640, height=480, menubar=no, toolbar=no, scrollbars=no");
                                    };

                                    // ラップタイム保存完了
                                    Save.prototype.completeSaveLapTime = function () {
                                        var values = imjcart.logic.value.GlobalValue.getInstance();
                                        this._$completeRank.text(String(values.lapTimeInfo.rank));
                                        this._$completeLength.text(String(values.lapTimeInfo.length));
                                        this._$completeLapTime.text(imjcart.logic.utility.Util.formatTime(values.lapTimeInfo.time));
                                        this._$completeName.text(values.lapTimeInfo.name);
                                        this._$form.css({
                                            display: "none"
                                        });
                                        this._$progress.css({
                                            display: "none"
                                        });
                                        this._$complete.css({
                                            display: "block"
                                        });
                                        this._btnSave.close();
                                        this._btnTweet.open();
                                    };
                                    return Save;
                                })(lib.base.BaseDisplay);
                                save.Save = Save;
                            })(pausewindow.save || (pausewindow.save = {}));
                            var save = pausewindow.save;
                        })(run.pausewindow || (run.pausewindow = {}));
                        var pausewindow = run.pausewindow;
                    })(timeatack.run || (timeatack.run = {}));
                    var run = timeatack.run;
                })(scene.timeatack || (scene.timeatack = {}));
                var timeatack = scene.timeatack;
            })(main.scene || (main.scene = {}));
            var scene = main.scene;
        })(_display.main || (_display.main = {}));
        var main = _display.main;
    })(imjcart.display || (imjcart.display = {}));
    var display = imjcart.display;
})(imjcart || (imjcart = {}));

/// <reference path="../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../lib/three.d.ts"/>
/// <reference path="../../../../lib/lib.ts"/>
/// <reference path="../../../../imjcart/logic/map/value/MapConst.ts"/>
/// <reference path="../../../../imjcart/logic/utility/Util.ts"/>
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
            (function (view3d) {
                var Background = (function (_super) {
                    __extends(Background, _super);
                    function Background(scene) {
                        _super.call(this);
                        this._scene = null;
                        this._field = null;
                        this._sky = null;
                        this._scene = scene;

                        //
                        this._createField();
                        this._createSky();
                    }
                    Background.prototype._createField = function () {
                        var geometry = new THREE.CircleGeometry(2500, 30);
                        var texture = THREE.ImageUtils.loadTexture("img/field.jpg");
                        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                        texture.repeat.set(500, 500);
                        var material = new THREE.MeshBasicMaterial({ map: texture });
                        this._field = new THREE.Mesh(geometry, material);
                        this._field.position.set(imjcart.logic.map.value.MapConst.MAP_CENTER_X, 0, imjcart.logic.map.value.MapConst.MAP_CENTER_Z);
                        this._field.rotation.x = imjcart.logic.utility.Util.getAngleByRotation(-90);
                        this._scene.add(this._field);
                    };

                    Background.prototype._createSky = function () {
                        var geometry = new THREE.CylinderGeometry(2500, 2500, 750, 30, 1, true);
                        var texture = THREE.ImageUtils.loadTexture("img/sky.jpg");
                        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                        texture.repeat.set(5, 1);
                        var material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
                        this._sky = new THREE.Mesh(geometry, material);
                        this._sky.position.set(imjcart.logic.map.value.MapConst.MAP_CENTER_X, 375, imjcart.logic.map.value.MapConst.MAP_CENTER_Z);
                        this._scene.add(this._sky);
                    };
                    return Background;
                })(lib.event.EventDispacher);
                view3d.Background = Background;
            })(main.view3d || (main.view3d = {}));
            var view3d = main.view3d;
        })(display.main || (display.main = {}));
        var main = display.main;
    })(imjcart.display || (imjcart.display = {}));
    var display = imjcart.display;
})(imjcart || (imjcart = {}));

/// <reference path="../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../lib/three.d.ts"/>
/// <reference path="../../../../lib/lib.ts"/>
/// <reference path="../../../../imjcart/logic/map/value/MapConst.ts"/>
/// <reference path="../../../../imjcart/logic/value/Const.ts"/>
/// <reference path="../../../../imjcart/display/main/view3d/value/View3dConst.ts"/>
/// <reference path="../../../../imjcart/logic/utility/Util.ts"/>
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
            (function (view3d) {
                var Camera = (function (_super) {
                    __extends(Camera, _super);
                    function Camera(scene) {
                        _super.call(this);
                        this._scene = null;
                        this._camera = null;
                        this._angle = view3d.value.View3dConst.CAMERA_ANGLE_DEFAULT;
                        this._mode = null;
                        //
                        this._carX = null;
                        this._carZ = null;
                        this._carBodyAngle = null;
                        this._rotationCount = 0;
                        this._isStarted = false;
                        this._isStarted2 = false;
                        this._scene = scene;

                        //
                        var fov = 45;
                        var aspect = window.innerWidth / (window.innerHeight - imjcart.logic.value.Const.FOOTER_HEIGHT - imjcart.logic.value.Const.RANKING_HEIGHT);
                        var near = 1;
                        var far = 20000;
                        this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
                        this._camera.position.x = imjcart.logic.map.value.MapConst.MAP_CENTER_X;
                        this._camera.position.y = 200;
                        this._camera.position.z = imjcart.logic.map.value.MapConst.MAP_CENTER_Z;
                        this._camera.lookAt(new THREE.Vector3(0, 0, 0));
                        this._scene.add(this._camera);
                    }
                    Object.defineProperty(Camera.prototype, "camera", {
                        get: function () {
                            return this._camera;
                        },
                        enumerable: true,
                        configurable: true
                    });

                    Object.defineProperty(Camera.prototype, "mode", {
                        // カメラモード
                        set: function (value) {
                            this._mode = value;
                        },
                        enumerable: true,
                        configurable: true
                    });

                    Object.defineProperty(Camera.prototype, "angle", {
                        // カメラアングル
                        set: function (value) {
                            this._angle = value;
                        },
                        enumerable: true,
                        configurable: true
                    });

                    // 車姿勢変更
                    Camera.prototype.setCarPosture = function (x, z, bodyAngle) {
                        this._carX = x;
                        this._carZ = z;
                        this._carBodyAngle = bodyAngle;
                    };

                    // 更新
                    Camera.prototype.update = function () {
                        if (imjcart.logic.value.Const.IS_VIEW3D_DEBUG_MODE)
                            return;
                        switch (this._mode) {
                            case view3d.value.View3dConst.CAMERA_MODE_OPENING:
                                this._setOpeningMode();
                                break;
                            case view3d.value.View3dConst.CAMERA_MODE_TIMEATACK_RUN:
                                if (!this._isStarted) {
                                    this._startTimeAtackRunMode();
                                } else {
                                    this._setTimeAtackRunMode();
                                }
                                break;
                        }
                    };

                    Camera.prototype._setOpeningMode = function () {
                        this._camera.position.x = imjcart.logic.map.value.MapConst.MAP_CENTER_X + (400 * Math.sin(this._rotationCount));
                        this._camera.position.y = 300;
                        this._camera.position.z = imjcart.logic.map.value.MapConst.MAP_CENTER_Z + (400 * Math.cos(this._rotationCount));
                        this._camera.lookAt(new THREE.Vector3(imjcart.logic.map.value.MapConst.MAP_CENTER_X, 0, imjcart.logic.map.value.MapConst.MAP_CENTER_Z));
                        this._rotationCount += imjcart.logic.value.Const.FPS / 1000 / imjcart.logic.value.Const.FPS;
                    };

                    Camera.prototype._startTimeAtackRunMode = function () {
                        var _this = this;
                        if (!this._carX || !this._carZ || !this._carBodyAngle)
                            return;
                        if (this._isStarted2)
                            return;
                        this._isStarted2 = true;

                        //
                        this._camera.position.x = this._carX - (400 * Math.sin(this._carBodyAngle));
                        this._camera.position.y = 100;
                        this._camera.position.z = this._carZ - (400 * Math.cos(this._carBodyAngle));

                        //
                        $(this._camera.position).animate({
                            x: this._carX - (23 * Math.sin(this._carBodyAngle)),
                            y: 14,
                            z: this._carZ - (23 * Math.cos(this._carBodyAngle))
                        }, {
                            duration: 5000,
                            easing: "swing",
                            complete: function () {
                                _this._isStarted = true;
                            },
                            progress: function () {
                                _this._camera.lookAt(new THREE.Vector3(_this._carX, 7, _this._carZ));
                            }
                        });
                    };

                    Camera.prototype._setTimeAtackRunMode = function () {
                        if (this._angle == view3d.value.View3dConst.CAMERA_ANGLE_TOP) {
                            this._camera.position.x = this._carX - (70 * Math.sin(this._carBodyAngle));
                            this._camera.position.y = 150;
                            this._camera.position.z = this._carZ - (70 * Math.cos(this._carBodyAngle));
                            this._camera.lookAt(new THREE.Vector3(this._carX, 75, this._carZ));
                        } else if (this._angle == view3d.value.View3dConst.CAMERA_ANGLE_INSIDE) {
                            this._camera.position.x = this._carX - (3.9 * Math.sin(this._carBodyAngle));
                            this._camera.position.y = 3.4;
                            this._camera.position.z = this._carZ - (3.9 * Math.cos(this._carBodyAngle));
                            this._camera.rotation.y = this._carBodyAngle - imjcart.logic.utility.Util.getAngleByRotation(180);
                            this._camera.rotation.x = 0;
                            this._camera.rotation.z = 0;
                        } else if (this._angle == view3d.value.View3dConst.CAMERA_ANGLE_BACK) {
                            this._camera.position.x = this._carX - (23 * Math.sin(this._carBodyAngle));
                            this._camera.position.y = 14;
                            this._camera.position.z = this._carZ - (23 * Math.cos(this._carBodyAngle));
                            this._camera.lookAt(new THREE.Vector3(this._carX, 7, this._carZ));
                        }
                    };
                    return Camera;
                })(lib.event.EventDispacher);
                view3d.Camera = Camera;
            })(main.view3d || (main.view3d = {}));
            var view3d = main.view3d;
        })(display.main || (display.main = {}));
        var main = display.main;
    })(imjcart.display || (imjcart.display = {}));
    var display = imjcart.display;
})(imjcart || (imjcart = {}));

/// <reference path="../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../lib/three.d.ts"/>
/// <reference path="../../../../lib/lib.ts"/>
/// <reference path="../../../../imjcart/logic/utility/Util.ts"/>
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
            (function (view3d) {
                var Car = (function (_super) {
                    __extends(Car, _super);
                    function Car(scene) {
                        _super.call(this);
                        this._scene = null;
                        this._group = null;
                        this._body = null;
                        this._handle = null;
                        this._driver = null;
                        this._wheelFL = null;
                        this._wheelFR = null;
                        this._wheelBL = null;
                        this._wheelBR = null;
                        this._isShowDriver = true;
                        this._scene = scene;
                    }
                    Car.prototype.createBody = function (colors) {
                        var _this = this;
                        var bodyColor = colors.body || 0x990000;
                        var windColor = colors.wing || 0xFFFFFF;
                        var driverHeadColor = colors.driverHead || 0xFFCC00;
                        var driverBodyColor = colors.driverBody || 0xFFFFFF;

                        // 車
                        this._group = new THREE.Object3D();
                        this._group.position.set(0, 0.3, 0);
                        this._scene.add(this._group);

                        // ボディ
                        var loader = new THREE.OBJMTLLoader();

                        //loader.load("models/car02/car02.obj", "models/car02/car02.mtl", (object) => {
                        loader.load("models/car03/car03.obj", "models/car03/car03.mtl", function (object) {
                            object.traverse(function (child) {
                                if (child instanceof THREE.Mesh) {
                                    switch (child.material.name) {
                                        case "Body":
                                            child.material.ambient = new THREE.Color(bodyColor);
                                            child.material.color = new THREE.Color(bodyColor);
                                            break;
                                        case "Wing":
                                            child.material.ambient = new THREE.Color(windColor);
                                            child.material.color = new THREE.Color(windColor);
                                            break;
                                        case "Chassis":
                                            child.material.ambient = new THREE.Color(0x111111);
                                            child.material.color = new THREE.Color(0x111111);
                                            break;
                                        default:
                                            child.material.ambient = new THREE.Color(imjcart.display.main.view3d.value.View3dConst.AMBIENT_COLOR);
                                            break;
                                    }
                                    child.material.side = THREE.DoubleSide;
                                    child.material.specular = 0xffffff;
                                    child.material.shininess = 200;
                                    child.material.metal = true;

                                    //child.material = new THREE.MeshLambertMaterial(child.material);
                                    child.material = new THREE.MeshPhongMaterial(child.material);
                                    if (imjcart.logic.value.Const.IS_SHADOW_ENABLED) {
                                        child.castShadow = true;
                                    }
                                }
                            });
                            _this._body = object;
                            _this._group.add(_this._body);
                        });

                        // ドライバー
                        var loader = new THREE.OBJMTLLoader();
                        loader.load("models/car02/driver01.obj", "models/car02/driver01.mtl", function (object) {
                            object.traverse(function (child) {
                                if (child instanceof THREE.Mesh) {
                                    switch (child.material.name) {
                                        case "DriverHead":
                                            child.material.ambient = new THREE.Color(driverHeadColor);
                                            child.material.color = new THREE.Color(driverHeadColor);
                                            break;
                                        case "DriverBody":
                                            child.material.ambient = new THREE.Color(driverBodyColor);
                                            child.material.color = new THREE.Color(driverBodyColor);
                                            break;
                                        default:
                                            child.material.ambient = new THREE.Color(imjcart.display.main.view3d.value.View3dConst.AMBIENT_COLOR);
                                            break;
                                    }
                                    child.material.side = THREE.DoubleSide;
                                    child.material = new THREE.MeshLambertMaterial(child.material);
                                }
                            });
                            _this._driver = object;
                            _this._group.add(_this._driver);
                        });

                        // ハンドル
                        var loader = new THREE.OBJMTLLoader();
                        loader.load("models/car02/handle01.obj", "models/car02/handle01.mtl", function (object) {
                            object.traverse(function (child) {
                                if (child instanceof THREE.Mesh) {
                                    switch (child.material.name) {
                                        case "Body":
                                            child.material.ambient = new THREE.Color(0x333333);
                                            child.material.color = new THREE.Color(0x333333);
                                            break;
                                        case "Screen":
                                            child.material.ambient = new THREE.Color(0x339999);
                                            child.material.color = new THREE.Color(0x339999);
                                            break;
                                        case "ButtonR":
                                            child.material.ambient = new THREE.Color(0xFF0000);
                                            child.material.color = new THREE.Color(0xFF0000);
                                            break;
                                        case "ButtonB":
                                            child.material.ambient = new THREE.Color(0x0000FF);
                                            child.material.color = new THREE.Color(0x0000FF);
                                            break;
                                        case "ButtonY":
                                            child.material.ambient = new THREE.Color(0xFFCC00);
                                            child.material.color = new THREE.Color(0xFFCC00);
                                            break;
                                        default:
                                            child.material.ambient = new THREE.Color(imjcart.display.main.view3d.value.View3dConst.AMBIENT_COLOR);
                                            break;
                                    }
                                    child.material.side = THREE.DoubleSide;
                                    child.material = new THREE.MeshLambertMaterial(child.material);
                                }
                            });
                            _this._handle = object;
                            _this._handle.position.set(0, 2, -1.3);
                            _this._group.add(_this._handle);
                        });

                        // タイヤ
                        loader = new THREE.OBJMTLLoader();
                        loader.load("models/wheel01/wheel01.obj", "models/wheel01/wheel01.mtl", function (object) {
                            object.traverse(function (child) {
                                if (child instanceof THREE.Mesh) {
                                    switch (child.material.name) {
                                        case "Wheel":
                                            child.material.ambient = new THREE.Color(0x333333);
                                            child.material.color = new THREE.Color(0x333333);
                                            break;
                                        case "Tire":
                                            child.material.ambient = new THREE.Color(0x000000);
                                            child.material.color = new THREE.Color(0x000000);
                                            break;
                                        default:
                                            child.material.ambient = new THREE.Color(imjcart.display.main.view3d.value.View3dConst.AMBIENT_COLOR);
                                            break;
                                    }
                                    child.material.side = THREE.DoubleSide;
                                    child.material = new THREE.MeshLambertMaterial(child.material);
                                    if (imjcart.logic.value.Const.IS_SHADOW_ENABLED) {
                                        child.castShadow = true;
                                    }
                                }
                            });
                            _this._wheelFL = object.clone();
                            _this._wheelFL.position.set(2.6, 1, 3.5);
                            _this._group.add(_this._wheelFL);

                            //
                            _this._wheelFR = object.clone();
                            _this._wheelFR.position.set(-2.6, 1, 3.5);
                            _this._group.add(_this._wheelFR);

                            //
                            _this._wheelBL = object.clone();
                            _this._wheelBL.position.set(2.6, 1, -7);
                            _this._group.add(_this._wheelBL);

                            //
                            _this._wheelBR = object.clone();
                            _this._wheelBR.position.set(-2.6, 1, -7);
                            _this._group.add(_this._wheelBR);
                        });
                    };

                    Object.defineProperty(Car.prototype, "group", {
                        get: function () {
                            return this._group;
                        },
                        enumerable: true,
                        configurable: true
                    });

                    // 姿勢設定
                    Car.prototype.setPosture = function (x, z, bodyAngle, wheelAngle, speed) {
                        if (!this._group)
                            return;
                        this._group.position.x = x;
                        this._group.position.z = z;
                        this._group.rotation.y = bodyAngle - (((wheelAngle - imjcart.logic.utility.Util.getAngleByRotation(90)) * 0.2) * speed);
                        if (this._wheelFL && this._wheelFL.rotation)
                            this._wheelFL.rotation.y = -wheelAngle + imjcart.logic.utility.Util.getAngleByRotation(90);
                        if (this._wheelFR && this._wheelFR.rotation)
                            this._wheelFR.rotation.y = -wheelAngle + imjcart.logic.utility.Util.getAngleByRotation(90);
                        this._handle.rotation.x = imjcart.logic.utility.Util.getAngleByRotation(180);
                        this._handle.rotation.z = -wheelAngle + imjcart.logic.utility.Util.getAngleByRotation(-90);

                        // ボディの振動
                        this._body.position.y = (Math.random() * 0.005 * speed);
                    };

                    // ドライバー表示
                    Car.prototype.showDriver = function () {
                        if (!this._group)
                            return;
                        if (this._isShowDriver)
                            return;
                        this._isShowDriver = true;
                        this._group.add(this._driver);
                    };

                    // ドライバー非表示
                    Car.prototype.hideDriver = function () {
                        if (!this._group)
                            return;
                        if (!this._isShowDriver)
                            return;
                        this._isShowDriver = false;
                        this._group.remove(this._driver);
                    };
                    return Car;
                })(lib.event.EventDispacher);
                view3d.Car = Car;
            })(main.view3d || (main.view3d = {}));
            var view3d = main.view3d;
        })(display.main || (display.main = {}));
        var main = display.main;
    })(imjcart.display || (imjcart.display = {}));
    var display = imjcart.display;
})(imjcart || (imjcart = {}));

/// <reference path="../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../lib/three.d.ts"/>
/// <reference path="../../../../lib/lib.ts"/>
/// <reference path="../../../../imjcart/logic/map/value/MapConst.ts"/>
/// <reference path="../../../../imjcart/logic/utility/Util.ts"/>
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
            (function (view3d) {
                var Cource = (function (_super) {
                    __extends(Cource, _super);
                    function Cource(scene) {
                        _super.call(this);
                        this._scene = null;
                        this._startline = null;
                        this._carLine = null;
                        this._base = null;
                        this._grass = null;
                        this._grassLT = null;
                        this._grassLB = null;
                        this._grassRT = null;
                        this._grassRB = null;
                        this._sand = null;
                        this._tree = null;
                        this._tire = null;
                        this._wall = null;
                        this._block = null;
                        this._map = null;
                        this._sandMap = null;
                        this._grassMap = null;
                        this._roadMap = null;
                        this._goal = null;
                        this._scene = scene;

                        //
                        this._initGrassMap();
                        this._initRoadMap();
                        this._initSandMap();

                        //
                        this._createBase();
                        this._createRoadLine();
                        this._createCarLine();
                        this._createGrass();
                        this._createGrassLT();
                        this._createGrassLB();
                        this._createGrassRT();
                        this._createGrassRB();
                        this._createStartline();
                        this._createWall();
                        this._createBlock();
                        this._createTire();
                        this._createTree();
                        this._createSand();
                        this._createSandLine();
                        this._createSandLine2();
                        this._createGoal();
                    }
                    // 道路端の線を作るマップを作成
                    Cource.prototype._initRoadMap = function () {
                        this._map = imjcart.logic.map.value.MapConst.MAP.concat();
                        this._roadMap = [];
                        var i, j, max, max2;
                        for (i = 0, max = imjcart.logic.map.value.MapConst.MAP.length; i < max; i = i + 1) {
                            var arr = [];
                            for (j = 0, max2 = imjcart.logic.map.value.MapConst.MAP[i].length; j < max2; j = j + 1) {
                                if (imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_GRASS || imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_TIRE || imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_TREE || imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_BLOCK || imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_WALL) {
                                    arr.push(null);
                                } else {
                                    arr.push("C");
                                }
                            }
                            this._roadMap.push(arr);
                        }
                        for (i = 0, max = this._roadMap.length; i < max; i = i + 1) {
                            for (j = 0, max2 = this._roadMap[i].length; j < max2; j = j + 1) {
                                var current = this._roadMap[i][j] || null;
                                if (current != null) {
                                    var left = this._roadMap[i][j - 1] || null;
                                    var right = this._roadMap[i][j + 1] || null;
                                    var top = null;
                                    if (1 <= i) {
                                        top = this._roadMap[i - 1][j] || null;
                                    }
                                    var bottom = null;
                                    if (i <= max - 2) {
                                        bottom = this._roadMap[i + 1][j] || null;
                                    }
                                    if (left == null && right != null && top != null && bottom != null) {
                                        this._roadMap[i][j] = "L";
                                    } else if (left != null && right == null && top != null && bottom != null) {
                                        this._roadMap[i][j] = "R";
                                    } else if (left != null && right != null && top == null && bottom != null) {
                                        this._roadMap[i][j] = "T";
                                    } else if (left != null && right != null && top != null && bottom == null) {
                                        this._roadMap[i][j] = "B";
                                    }
                                }
                            }
                        }
                    };

                    // 芝生同士を斜めにつないで、芝生マップを作成
                    Cource.prototype._initGrassMap = function () {
                        this._map = imjcart.logic.map.value.MapConst.MAP.concat();
                        this._grassMap = [];
                        var i, j, max, max2;
                        for (i = 0, max = imjcart.logic.map.value.MapConst.MAP.length; i < max; i = i + 1) {
                            var arr = [];
                            for (j = 0, max2 = imjcart.logic.map.value.MapConst.MAP[i].length; j < max2; j = j + 1) {
                                if (imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_GRASS || imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_TIRE || imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_TREE || imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_SAND) {
                                    arr.push("G");
                                } else {
                                    arr.push(null);
                                }
                            }
                            this._grassMap.push(arr);
                        }
                        for (i = 0, max = imjcart.logic.map.value.MapConst.MAP.length; i < max; i = i + 1) {
                            for (j = 0, max2 = imjcart.logic.map.value.MapConst.MAP[i].length; j < max2; j = j + 1) {
                                if (imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_GRASS) {
                                    // 左上
                                    if (imjcart.logic.map.value.MapConst.MAP[i - 1][j - 1] && imjcart.logic.map.value.MapConst.MAP[i - 1][j - 1] == imjcart.logic.map.value.MapConst.MAP_KEY_GRASS || imjcart.logic.map.value.MapConst.MAP[i - 1][j - 1] && imjcart.logic.map.value.MapConst.MAP[i - 1][j - 1] == imjcart.logic.map.value.MapConst.MAP_KEY_TIRE || imjcart.logic.map.value.MapConst.MAP[i - 1][j - 1] && imjcart.logic.map.value.MapConst.MAP[i - 1][j - 1] == imjcart.logic.map.value.MapConst.MAP_KEY_BLOCK || imjcart.logic.map.value.MapConst.MAP[i - 1][j - 1] && imjcart.logic.map.value.MapConst.MAP[i - 1][j - 1] == imjcart.logic.map.value.MapConst.MAP_KEY_WALL || imjcart.logic.map.value.MapConst.MAP[i - 1][j - 1] && imjcart.logic.map.value.MapConst.MAP[i - 1][j - 1] == imjcart.logic.map.value.MapConst.MAP_KEY_TREE) {
                                        if (this._grassMap[i - 1][j] == "LT" || this._grassMap[i - 1][j] == "RT" || this._grassMap[i - 1][j] == "RB") {
                                            this._grassMap[i - 1][j] = "G";
                                        } else if (this._grassMap[i - 1][j] != "G") {
                                            this._grassMap[i - 1][j] = "LB";
                                        }
                                        if (this._grassMap[i][j - 1] == "LT" || this._grassMap[i][j - 1] == "LB" || this._grassMap[i][j - 1] == "RB") {
                                            this._grassMap[i][j - 1] = "G";
                                        } else if (this._grassMap[i][j - 1] != "G") {
                                            this._grassMap[i][j - 1] = "RT";
                                        }
                                    }

                                    // 左下
                                    if (imjcart.logic.map.value.MapConst.MAP[i + 1][j - 1] && imjcart.logic.map.value.MapConst.MAP[i + 1][j - 1] == imjcart.logic.map.value.MapConst.MAP_KEY_GRASS || imjcart.logic.map.value.MapConst.MAP[i + 1][j - 1] && imjcart.logic.map.value.MapConst.MAP[i + 1][j - 1] == imjcart.logic.map.value.MapConst.MAP_KEY_TIRE || imjcart.logic.map.value.MapConst.MAP[i + 1][j - 1] && imjcart.logic.map.value.MapConst.MAP[i + 1][j - 1] == imjcart.logic.map.value.MapConst.MAP_KEY_BLOCK || imjcart.logic.map.value.MapConst.MAP[i + 1][j - 1] && imjcart.logic.map.value.MapConst.MAP[i + 1][j - 1] == imjcart.logic.map.value.MapConst.MAP_KEY_WALL || imjcart.logic.map.value.MapConst.MAP[i + 1][j - 1] && imjcart.logic.map.value.MapConst.MAP[i + 1][j - 1] == imjcart.logic.map.value.MapConst.MAP_KEY_TREE) {
                                        if (this._grassMap[i + 1][j] == "LB" || this._grassMap[i][j + 1] == "RT" || this._grassMap[i][j + 1] == "RB") {
                                            this._grassMap[i + 1][j] = "G";
                                        } else if (this._grassMap[i + 1][j] != "G") {
                                            this._grassMap[i + 1][j] = "LT";
                                        }
                                        if (this._grassMap[i][j - 1] == "LT" || this._grassMap[i][j - 1] == "LB" || this._grassMap[i][j - 1] == "RT") {
                                            this._grassMap[i][j - 1] = "G";
                                        } else if (this._grassMap[i][j - 1] != "G") {
                                            this._grassMap[i][j - 1] = "RB";
                                        }
                                    }

                                    // 右上
                                    if (imjcart.logic.map.value.MapConst.MAP[i - 1][j + 1] && imjcart.logic.map.value.MapConst.MAP[i - 1][j + 1] == imjcart.logic.map.value.MapConst.MAP_KEY_GRASS || imjcart.logic.map.value.MapConst.MAP[i - 1][j + 1] && imjcart.logic.map.value.MapConst.MAP[i - 1][j + 1] == imjcart.logic.map.value.MapConst.MAP_KEY_TIRE || imjcart.logic.map.value.MapConst.MAP[i - 1][j + 1] && imjcart.logic.map.value.MapConst.MAP[i - 1][j + 1] == imjcart.logic.map.value.MapConst.MAP_KEY_BLOCK || imjcart.logic.map.value.MapConst.MAP[i - 1][j + 1] && imjcart.logic.map.value.MapConst.MAP[i - 1][j + 1] == imjcart.logic.map.value.MapConst.MAP_KEY_WALL || imjcart.logic.map.value.MapConst.MAP[i - 1][j + 1] && imjcart.logic.map.value.MapConst.MAP[i - 1][j + 1] == imjcart.logic.map.value.MapConst.MAP_KEY_TREE) {
                                        if (this._grassMap[i][j + 1] == "LB" || this._grassMap[i][j + 1] == "LB" || this._grassMap[i][j + 1] == "RB") {
                                            this._grassMap[i][j + 1] = "G";
                                        } else if (this._grassMap[i][j + 1] != "G") {
                                            this._grassMap[i][j + 1] = "LT";
                                        }
                                        if (this._grassMap[i - 1][j] == "LB" || this._grassMap[i - 1][j] == "LB" || this._grassMap[i - 1][j] == "RT") {
                                            this._grassMap[i - 1][j] = "G";
                                        } else if (this._grassMap[i - 1][j] != "G") {
                                            this._grassMap[i - 1][j] = "RB";
                                        }
                                    }

                                    // 右下
                                    if (imjcart.logic.map.value.MapConst.MAP[i + 1][j + 1] && imjcart.logic.map.value.MapConst.MAP[i + 1][j + 1] == imjcart.logic.map.value.MapConst.MAP_KEY_GRASS || imjcart.logic.map.value.MapConst.MAP[i + 1][j + 1] && imjcart.logic.map.value.MapConst.MAP[i + 1][j + 1] == imjcart.logic.map.value.MapConst.MAP_KEY_TIRE || imjcart.logic.map.value.MapConst.MAP[i + 1][j + 1] && imjcart.logic.map.value.MapConst.MAP[i + 1][j + 1] == imjcart.logic.map.value.MapConst.MAP_KEY_BLOCK || imjcart.logic.map.value.MapConst.MAP[i + 1][j + 1] && imjcart.logic.map.value.MapConst.MAP[i + 1][j + 1] == imjcart.logic.map.value.MapConst.MAP_KEY_WALL || imjcart.logic.map.value.MapConst.MAP[i + 1][j + 1] && imjcart.logic.map.value.MapConst.MAP[i + 1][j + 1] == imjcart.logic.map.value.MapConst.MAP_KEY_TREE) {
                                        if (this._grassMap[i + 1][j] == "LT" || this._grassMap[i + 1][j] == "LB" || this._grassMap[i + 1][j] == "RB") {
                                            this._grassMap[i + 1][j] = "G";
                                        } else if (this._grassMap[i + 1][j] != "G") {
                                            this._grassMap[i + 1][j] = "RT";
                                        }
                                        if (this._grassMap[i][j + 1] == "LT" || this._grassMap[i][j + 1] == "RT" || this._grassMap[i][j + 1] == "RB") {
                                            this._grassMap[i][j + 1] = "G";
                                        } else if (this._grassMap[i][j + 1] != "G") {
                                            this._grassMap[i][j + 1] = "LB";
                                        }
                                    }
                                }
                            }
                        }
                    };

                    // 砂地同士を斜めにつないで、砂地マップを作成
                    Cource.prototype._initSandMap = function () {
                        this._map = imjcart.logic.map.value.MapConst.MAP.concat();
                        this._sandMap = [];
                        var i, j, max, max2;
                        for (i = 0, max = imjcart.logic.map.value.MapConst.MAP.length; i < max; i = i + 1) {
                            var arr = [];
                            for (j = 0, max2 = imjcart.logic.map.value.MapConst.MAP[i].length; j < max2; j = j + 1) {
                                if (imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_SAND) {
                                    arr.push("S");
                                } else {
                                    arr.push(null);
                                }
                            }
                            this._sandMap.push(arr);
                        }
                        for (i = 0, max = imjcart.logic.map.value.MapConst.MAP.length; i < max; i = i + 1) {
                            for (j = 0, max2 = imjcart.logic.map.value.MapConst.MAP[i].length; j < max2; j = j + 1) {
                                if (imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_SAND) {
                                    // 左上
                                    if (imjcart.logic.map.value.MapConst.MAP[i - 1][j - 1] && imjcart.logic.map.value.MapConst.MAP[i - 1][j - 1] == imjcart.logic.map.value.MapConst.MAP_KEY_SAND || imjcart.logic.map.value.MapConst.MAP[i - 1][j - 1] && imjcart.logic.map.value.MapConst.MAP[i - 1][j - 1] == imjcart.logic.map.value.MapConst.MAP_KEY_BLOCK || imjcart.logic.map.value.MapConst.MAP[i - 1][j - 1] && imjcart.logic.map.value.MapConst.MAP[i - 1][j - 1] == imjcart.logic.map.value.MapConst.MAP_KEY_WALL) {
                                        if (this._sandMap[i - 1][j] == "LT" || this._sandMap[i - 1][j] == "RT" || this._sandMap[i - 1][j] == "RB") {
                                            this._sandMap[i - 1][j] = "S";
                                        } else if (this._sandMap[i - 1][j] != "S") {
                                            this._sandMap[i - 1][j] = "LB";
                                        }
                                        if (this._sandMap[i][j - 1] == "LT" || this._sandMap[i][j - 1] == "LB" || this._sandMap[i][j - 1] == "RB") {
                                            this._sandMap[i][j - 1] = "S";
                                        } else if (this._sandMap[i][j - 1] != "S") {
                                            this._sandMap[i][j - 1] = "RT";
                                        }
                                    }

                                    // 左下
                                    if (imjcart.logic.map.value.MapConst.MAP[i + 1][j - 1] && imjcart.logic.map.value.MapConst.MAP[i + 1][j - 1] == imjcart.logic.map.value.MapConst.MAP_KEY_SAND || imjcart.logic.map.value.MapConst.MAP[i + 1][j - 1] && imjcart.logic.map.value.MapConst.MAP[i + 1][j - 1] == imjcart.logic.map.value.MapConst.MAP_KEY_BLOCK || imjcart.logic.map.value.MapConst.MAP[i + 1][j - 1] && imjcart.logic.map.value.MapConst.MAP[i + 1][j - 1] == imjcart.logic.map.value.MapConst.MAP_KEY_WALL) {
                                        if (this._sandMap[i + 1][j] == "LB" || this._sandMap[i][j + 1] == "RT" || this._sandMap[i][j + 1] == "RB") {
                                            this._sandMap[i + 1][j] = "S";
                                        } else if (this._sandMap[i + 1][j] != "S") {
                                            this._sandMap[i + 1][j] = "LT";
                                        }
                                        if (this._sandMap[i][j - 1] == "LT" || this._sandMap[i][j - 1] == "LB" || this._sandMap[i][j - 1] == "RT") {
                                            this._sandMap[i][j - 1] = "S";
                                        } else if (this._sandMap[i][j - 1] != "S") {
                                            this._sandMap[i][j - 1] = "RB";
                                        }
                                    }

                                    // 右上
                                    if (imjcart.logic.map.value.MapConst.MAP[i - 1][j + 1] && imjcart.logic.map.value.MapConst.MAP[i - 1][j + 1] == imjcart.logic.map.value.MapConst.MAP_KEY_SAND || imjcart.logic.map.value.MapConst.MAP[i - 1][j + 1] && imjcart.logic.map.value.MapConst.MAP[i - 1][j + 1] == imjcart.logic.map.value.MapConst.MAP_KEY_BLOCK || imjcart.logic.map.value.MapConst.MAP[i - 1][j + 1] && imjcart.logic.map.value.MapConst.MAP[i - 1][j + 1] == imjcart.logic.map.value.MapConst.MAP_KEY_WALL) {
                                        if (this._sandMap[i][j + 1] == "LB" || this._sandMap[i][j + 1] == "LB" || this._sandMap[i][j + 1] == "RB") {
                                            this._sandMap[i][j + 1] = "S";
                                        } else if (this._sandMap[i][j + 1] != "S") {
                                            this._sandMap[i][j + 1] = "LT";
                                        }
                                        if (this._sandMap[i - 1][j] == "LB" || this._sandMap[i - 1][j] == "LB" || this._sandMap[i - 1][j] == "RT") {
                                            this._sandMap[i - 1][j] = "S";
                                        } else if (this._sandMap[i - 1][j] != "S") {
                                            this._sandMap[i - 1][j] = "RB";
                                        }
                                    }

                                    // 右下
                                    if (imjcart.logic.map.value.MapConst.MAP[i + 1][j + 1] && imjcart.logic.map.value.MapConst.MAP[i + 1][j + 1] == imjcart.logic.map.value.MapConst.MAP_KEY_SAND || imjcart.logic.map.value.MapConst.MAP[i + 1][j + 1] && imjcart.logic.map.value.MapConst.MAP[i + 1][j + 1] == imjcart.logic.map.value.MapConst.MAP_KEY_BLOCK || imjcart.logic.map.value.MapConst.MAP[i + 1][j + 1] && imjcart.logic.map.value.MapConst.MAP[i + 1][j + 1] == imjcart.logic.map.value.MapConst.MAP_KEY_WALL) {
                                        if (this._sandMap[i + 1][j] == "LT" || this._sandMap[i + 1][j] == "LB" || this._sandMap[i + 1][j] == "RB") {
                                            this._sandMap[i + 1][j] = "S";
                                        } else if (this._sandMap[i + 1][j] != "S") {
                                            this._sandMap[i + 1][j] = "RT";
                                        }
                                        if (this._sandMap[i][j + 1] == "LT" || this._sandMap[i][j + 1] == "RT" || this._sandMap[i][j + 1] == "RB") {
                                            this._sandMap[i][j + 1] = "S";
                                        } else if (this._sandMap[i][j + 1] != "S") {
                                            this._sandMap[i][j + 1] = "LB";
                                        }
                                    }
                                }
                            }
                        }
                    };

                    // コース土台
                    Cource.prototype._createBase = function () {
                        var geometry = new THREE.Geometry();
                        var texture = THREE.ImageUtils.loadTexture("img/base.jpg");

                        //texture.minFilter = THREE.NearestFilter;
                        //texture.magFilter = THREE.LinearMipMapLinearFilter;
                        var material = null;
                        if (imjcart.logic.value.Const.IS_BUMPMAP_ENABLED) {
                            material = new THREE.MeshPhongMaterial({
                                color: 0xffffff,
                                specular: 0x999999,
                                shininess: 10,
                                ambient: imjcart.display.main.view3d.value.View3dConst.AMBIENT_COLOR,
                                map: texture,
                                bumpMap: texture,
                                bumpScale: 0.1
                            });
                        } else {
                            material = new THREE.MeshBasicMaterial({ map: texture });
                        }
                        var i, j, max, max2;
                        for (i = 0, max = imjcart.logic.map.value.MapConst.MAP.length; i < max; i = i + 1) {
                            for (j = 0, max2 = imjcart.logic.map.value.MapConst.MAP[i].length; j < max2; j = j + 1) {
                                var mesh = new THREE.Mesh(new THREE.PlaneGeometry(imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE, imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE, 1, 1), new THREE.MeshBasicMaterial());
                                mesh.rotation.x = imjcart.logic.utility.Util.getAngleByRotation(-90);
                                mesh.position.set(imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * j + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2), 0.2, imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * i + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2));
                                THREE.GeometryUtils.merge(geometry, mesh);
                            }
                        }
                        this._base = new THREE.Mesh(geometry, material);
                        if (imjcart.logic.value.Const.IS_SHADOW_ENABLED) {
                            this._base.receiveShadow = true;
                        }
                        this._scene.add(this._base);
                    };

                    // コースライン
                    Cource.prototype._createRoadLine = function () {
                        var geometry = new THREE.Geometry();
                        var texture = THREE.ImageUtils.loadTexture("img/base2.png");
                        texture.minFilter = THREE.NearestFilter;
                        texture.magFilter = THREE.LinearMipMapLinearFilter;
                        var material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, blending: THREE.NormalBlending });
                        var i, j, max, max2;
                        for (i = 0, max = this._roadMap.length; i < max; i = i + 1) {
                            for (j = 0, max2 = this._roadMap[i].length; j < max2; j = j + 1) {
                                if (this._roadMap[i][j] != null && this._roadMap[i][j] != "C") {
                                    var tagX = imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * j + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2);
                                    var tagY = 0.4;
                                    var tagZ = imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * i + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2);
                                    var mesh = new THREE.Mesh(new THREE.PlaneGeometry(imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE, imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE, 1, 1), new THREE.MeshBasicMaterial());
                                    mesh.position.set(tagX, tagY, tagZ);
                                    mesh.rotation.x = imjcart.logic.utility.Util.getAngleByRotation(-90);
                                    if (this._roadMap[i][j] == "L") {
                                        THREE.GeometryUtils.merge(geometry, mesh);
                                    } else if (this._roadMap[i][j] == "R") {
                                        mesh.rotation.z = imjcart.logic.utility.Util.getAngleByRotation(-180);
                                        THREE.GeometryUtils.merge(geometry, mesh);
                                    } else if (this._roadMap[i][j] == "T") {
                                        mesh.rotation.z = imjcart.logic.utility.Util.getAngleByRotation(-90);
                                        THREE.GeometryUtils.merge(geometry, mesh);
                                    } else if (this._roadMap[i][j] == "B") {
                                        mesh.rotation.z = imjcart.logic.utility.Util.getAngleByRotation(90);
                                        THREE.GeometryUtils.merge(geometry, mesh);
                                    }
                                }
                            }
                        }
                        var mesh = new THREE.Mesh(geometry, material);
                        if (imjcart.logic.value.Const.IS_SHADOW_ENABLED) {
                            mesh.receiveShadow = true;
                        }
                        this._scene.add(mesh);
                    };

                    // 車ライン
                    Cource.prototype._createCarLine = function () {
                        var geometry = new THREE.Geometry();
                        var texture = THREE.ImageUtils.loadTexture("img/base3.png");
                        texture.minFilter = THREE.NearestFilter;
                        texture.magFilter = THREE.LinearMipMapLinearFilter;
                        var material = null;
                        if (imjcart.logic.value.Const.IS_BUMPMAP_ENABLED) {
                            material = new THREE.MeshPhongMaterial({
                                color: 0xffffff,
                                specular: 0x999999,
                                shininess: 10,
                                ambient: imjcart.display.main.view3d.value.View3dConst.AMBIENT_COLOR,
                                map: texture,
                                bumpMap: texture,
                                bumpScale: 0.1,
                                transparent: true,
                                blending: THREE.NormalBlending
                            });
                        } else {
                            material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, blending: THREE.NormalBlending });
                        }
                        var i, j, max, max2;
                        for (i = 0, max = imjcart.logic.map.value.MapConst.MAP.length; i < max; i = i + 1) {
                            for (j = 0, max2 = imjcart.logic.map.value.MapConst.MAP[i].length; j < max2; j = j + 1) {
                                if (imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_CAR_START_POSITION) {
                                    var y = 0;
                                    var k = 0, max3;
                                    for (k = 0, max3 = 12; k < max3; k = k + 1) {
                                        var x = 0;
                                        if (k % 2) {
                                            x = 6;
                                        } else {
                                            x = 0;
                                        }
                                        var mesh = new THREE.Mesh(new THREE.PlaneGeometry(imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE, imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE, 1, 1), new THREE.MeshBasicMaterial());
                                        mesh.rotation.x = imjcart.logic.utility.Util.getAngleByRotation(-90);
                                        mesh.position.set(imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * (j + x), 0.4, imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * (i + y) - 4);
                                        THREE.GeometryUtils.merge(geometry, mesh);
                                        y = y + 2;
                                    }
                                }
                            }
                        }
                        this._carLine = new THREE.Mesh(geometry, material);
                        if (imjcart.logic.value.Const.IS_SHADOW_ENABLED) {
                            this._carLine.receiveShadow = true;
                        }
                        this._scene.add(this._carLine);
                    };

                    // 芝生
                    Cource.prototype._createGrass = function () {
                        var geometry = new THREE.Geometry();
                        var texture = THREE.ImageUtils.loadTexture("img/grass.jpg");

                        //texture.minFilter = THREE.NearestFilter;
                        //texture.magFilter = THREE.LinearMipMapLinearFilter;
                        var material = new THREE.MeshBasicMaterial({ map: texture });
                        var i, j, max, max2;
                        for (i = 0, max = this._grassMap.length; i < max; i = i + 1) {
                            for (j = 0, max2 = this._grassMap[i].length; j < max2; j = j + 1) {
                                if (this._grassMap[i][j] == "G") {
                                    var mesh = new THREE.Mesh(new THREE.PlaneGeometry(imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE, imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE, 1, 1), new THREE.MeshBasicMaterial());
                                    mesh.rotation.x = imjcart.logic.utility.Util.getAngleByRotation(-90);
                                    mesh.position.set(imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * j + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2), 0.6, imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * i + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2));
                                    THREE.GeometryUtils.merge(geometry, mesh);
                                }
                            }
                        }
                        this._grass = new THREE.Mesh(geometry, material);
                        if (imjcart.logic.value.Const.IS_SHADOW_ENABLED) {
                            this._grass.receiveShadow = true;
                        }
                        this._scene.add(this._grass);
                    };

                    // 芝生
                    Cource.prototype._createGrassLT = function () {
                        var geometry = new THREE.Geometry();
                        var texture = THREE.ImageUtils.loadTexture("img/grassLT.png");

                        //texture.minFilter = THREE.NearestFilter;
                        //texture.magFilter = THREE.LinearMipMapLinearFilter;
                        var material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, blending: THREE.NormalBlending });
                        var i, j, max, max2;
                        for (i = 0, max = this._grassMap.length; i < max; i = i + 1) {
                            for (j = 0, max2 = this._grassMap[i].length; j < max2; j = j + 1) {
                                if (this._grassMap[i][j] == "LT") {
                                    var mesh = new THREE.Mesh(new THREE.PlaneGeometry(imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE, imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE, 1, 1), new THREE.MeshBasicMaterial());
                                    mesh.rotation.x = imjcart.logic.utility.Util.getAngleByRotation(-90);
                                    mesh.position.set(imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * j + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2), 0.6, imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * i + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2));
                                    THREE.GeometryUtils.merge(geometry, mesh);
                                }
                            }
                        }
                        this._grassLT = new THREE.Mesh(geometry, material);
                        if (imjcart.logic.value.Const.IS_SHADOW_ENABLED) {
                            this._grassLT.receiveShadow = true;
                        }
                        this._scene.add(this._grassLT);
                    };

                    // 芝生
                    Cource.prototype._createGrassLB = function () {
                        var geometry = new THREE.Geometry();
                        var texture = THREE.ImageUtils.loadTexture("img/grassLB.png");

                        //texture.minFilter = THREE.NearestFilter;
                        //texture.magFilter = THREE.LinearMipMapLinearFilter;
                        var material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, blending: THREE.NormalBlending });
                        var i, j, max, max2;
                        for (i = 0, max = this._grassMap.length; i < max; i = i + 1) {
                            for (j = 0, max2 = this._grassMap[i].length; j < max2; j = j + 1) {
                                if (this._grassMap[i][j] == "LB") {
                                    var mesh = new THREE.Mesh(new THREE.PlaneGeometry(imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE, imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE, 1, 1), new THREE.MeshBasicMaterial());
                                    mesh.rotation.x = imjcart.logic.utility.Util.getAngleByRotation(-90);
                                    mesh.position.set(imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * j + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2), 0.6, imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * i + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2));
                                    THREE.GeometryUtils.merge(geometry, mesh);
                                }
                            }
                        }
                        this._grassLB = new THREE.Mesh(geometry, material);
                        if (imjcart.logic.value.Const.IS_SHADOW_ENABLED) {
                            this._grassLB.receiveShadow = true;
                        }
                        this._scene.add(this._grassLB);
                    };

                    // 芝生
                    Cource.prototype._createGrassRT = function () {
                        var geometry = new THREE.Geometry();
                        var texture = THREE.ImageUtils.loadTexture("img/grassRT.png");

                        //texture.minFilter = THREE.NearestFilter;
                        //texture.magFilter = THREE.LinearMipMapLinearFilter;
                        var material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, blending: THREE.NormalBlending });
                        var i, j, max, max2;
                        for (i = 0, max = this._grassMap.length; i < max; i = i + 1) {
                            for (j = 0, max2 = this._grassMap[i].length; j < max2; j = j + 1) {
                                if (this._grassMap[i][j] == "RT") {
                                    var mesh = new THREE.Mesh(new THREE.PlaneGeometry(imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE, imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE, 1, 1), new THREE.MeshBasicMaterial());
                                    mesh.rotation.x = imjcart.logic.utility.Util.getAngleByRotation(-90);
                                    mesh.position.set(imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * j + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2), 0.6, imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * i + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2));
                                    THREE.GeometryUtils.merge(geometry, mesh);
                                }
                            }
                        }
                        this._grassRT = new THREE.Mesh(geometry, material);
                        if (imjcart.logic.value.Const.IS_SHADOW_ENABLED) {
                            this._grassRT.receiveShadow = true;
                        }
                        this._scene.add(this._grassRT);
                    };

                    // 芝生
                    Cource.prototype._createGrassRB = function () {
                        var geometry = new THREE.Geometry();
                        var texture = THREE.ImageUtils.loadTexture("img/grassRB.png");

                        //texture.minFilter = THREE.NearestFilter;
                        //texture.magFilter = THREE.LinearMipMapLinearFilter;
                        var material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, blending: THREE.NormalBlending });
                        var i, j, max, max2;
                        for (i = 0, max = this._grassMap.length; i < max; i = i + 1) {
                            for (j = 0, max2 = this._grassMap[i].length; j < max2; j = j + 1) {
                                if (this._grassMap[i][j] == "RB") {
                                    var mesh = new THREE.Mesh(new THREE.PlaneGeometry(imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE, imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE, 1, 1), new THREE.MeshBasicMaterial());
                                    mesh.rotation.x = imjcart.logic.utility.Util.getAngleByRotation(-90);
                                    mesh.position.set(imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * j + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2), 0.6, imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * i + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2));
                                    THREE.GeometryUtils.merge(geometry, mesh);
                                }
                            }
                        }
                        this._grassRB = new THREE.Mesh(geometry, material);
                        if (imjcart.logic.value.Const.IS_SHADOW_ENABLED) {
                            this._grassRB.receiveShadow = true;
                        }
                        this._scene.add(this._grassRB);
                    };

                    // スタートライン
                    Cource.prototype._createStartline = function () {
                        var texture = THREE.ImageUtils.loadTexture("img/startline.png");

                        //texture.minFilter = THREE.NearestFilter;
                        //texture.magFilter = THREE.LinearMipMapLinearFilter;
                        var geometry = new THREE.Geometry();
                        var material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, blending: THREE.NormalBlending });
                        var i, j, max, max2;
                        for (i = 0, max = imjcart.logic.map.value.MapConst.MAP.length; i < max; i = i + 1) {
                            for (j = 0, max2 = imjcart.logic.map.value.MapConst.MAP[i].length; j < max2; j = j + 1) {
                                if (imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_LAP_START_POINT) {
                                    var mesh = new THREE.Mesh(new THREE.PlaneGeometry(imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE, imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE, 1, 1), new THREE.MeshBasicMaterial());
                                    mesh.rotation.x = imjcart.logic.utility.Util.getAngleByRotation(-90);
                                    mesh.position.set(imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * j + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2), 0.8, imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * i + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2));
                                    THREE.GeometryUtils.merge(geometry, mesh);
                                }
                            }
                        }
                        this._startline = new THREE.Mesh(geometry, material);
                        if (imjcart.logic.value.Const.IS_SHADOW_ENABLED) {
                            this._startline.receiveShadow = true;
                        }
                        this._scene.add(this._startline);
                    };

                    // 壁
                    Cource.prototype._createWall = function () {
                        var _this = this;
                        var geometry = new THREE.Geometry();
                        var meshArr = [];
                        var loader = new THREE.OBJMTLLoader();
                        loader.load("models/wall01/wall01.obj", "models/wall01/wall01.mtl", function (object) {
                            object.traverse(function (child) {
                                if (child instanceof THREE.Mesh) {
                                    //var texture = child.material.map;
                                    //child.material = new THREE.MeshPhongMaterial(child.material);
                                    child.material = new THREE.MeshLambertMaterial(child.material);

                                    //child.material.shininess = 3;
                                    //child.material.bumpMap = texture;
                                    //child.material.bumpScale = 0.05;
                                    //child.castShadow = true;
                                    child.material.ambient = new THREE.Color(imjcart.display.main.view3d.value.View3dConst.AMBIENT_COLOR);
                                    meshArr.push({
                                        mesh: child,
                                        material: child.material
                                    });
                                }
                            });

                            // 配置
                            var i, j, max, max2;
                            for (i = 0, max = imjcart.logic.map.value.MapConst.MAP.length; i < max; i = i + 1) {
                                for (j = 0, max2 = imjcart.logic.map.value.MapConst.MAP[i].length; j < max2; j = j + 1) {
                                    if (imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_WALL) {
                                        var tagX = imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * j + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2);
                                        var tagY = 0.6;
                                        var tagZ = imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * i + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2);
                                        var mesh = meshArr[1].mesh.clone();
                                        mesh.position.set(tagX, tagY, tagZ);
                                        THREE.GeometryUtils.merge(geometry, mesh);
                                    }
                                }
                            }
                            _this._wall = new THREE.Mesh(geometry, meshArr[1].material);
                            if (imjcart.logic.value.Const.IS_SHADOW_ENABLED) {
                                _this._wall.castShadow = true;
                            }
                            _this._scene.add(_this._wall);
                        });
                    };

                    // ブロック
                    Cource.prototype._createBlock = function () {
                        var _this = this;
                        var geometry = new THREE.Geometry();
                        var meshArr = [];
                        var loader = new THREE.OBJMTLLoader();
                        loader.load("models/block03/block03.obj", "models/block03/block03.mtl", function (object) {
                            object.traverse(function (child) {
                                if (child instanceof THREE.Mesh) {
                                    //var texture = child.material.map;
                                    //child.material = new THREE.MeshPhongMaterial(child.material);
                                    child.material = new THREE.MeshLambertMaterial(child.material);

                                    //child.material.shininess = 3;
                                    //child.material.bumpMap = texture;
                                    //child.material.bumpScale = 0.05;
                                    //child.castShadow = true;
                                    child.material.ambient = new THREE.Color(imjcart.display.main.view3d.value.View3dConst.AMBIENT_COLOR);
                                    meshArr.push({
                                        mesh: child,
                                        material: child.material
                                    });
                                }
                            });

                            // 配置
                            var i, j, max, max2;
                            for (i = 0, max = imjcart.logic.map.value.MapConst.MAP.length; i < max; i = i + 1) {
                                for (j = 0, max2 = imjcart.logic.map.value.MapConst.MAP[i].length; j < max2; j = j + 1) {
                                    if (imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_BLOCK) {
                                        var tagX = imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * j + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2);
                                        var tagY = 1;
                                        var tagZ = imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * i + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2);
                                        var mesh = meshArr[1].mesh.clone();
                                        mesh.position.set(tagX, tagY, tagZ);
                                        THREE.GeometryUtils.merge(geometry, mesh);
                                    }
                                }
                            }
                            _this._block = new THREE.Mesh(geometry, meshArr[1].material);
                            if (imjcart.logic.value.Const.IS_SHADOW_ENABLED) {
                                _this._block.castShadow = true;
                            }
                            _this._scene.add(_this._block);
                        });
                    };

                    // タイヤ
                    Cource.prototype._createTire = function () {
                        var _this = this;
                        var geometry = new THREE.Geometry();
                        var meshArr = [];
                        var loader = new THREE.OBJMTLLoader();
                        loader.load("models/tire02/tire02.obj", "models/tire02/tire02.mtl", function (object) {
                            object.traverse(function (child) {
                                if (child instanceof THREE.Mesh) {
                                    //var texture = child.material.map;
                                    //child.material = new THREE.MeshPhongMaterial(child.material);
                                    child.material = new THREE.MeshLambertMaterial(child.material);

                                    //child.material.shininess = 3;
                                    //child.material.bumpMap = texture;
                                    //child.material.bumpScale = 0.05;
                                    //child.castShadow = true;
                                    child.material.ambient = new THREE.Color(imjcart.display.main.view3d.value.View3dConst.AMBIENT_COLOR);
                                    meshArr.push({
                                        mesh: child,
                                        material: child.material
                                    });
                                }
                            });

                            // 配置
                            var i, j, max, max2;
                            for (i = 0, max = imjcart.logic.map.value.MapConst.MAP.length; i < max; i = i + 1) {
                                for (j = 0, max2 = imjcart.logic.map.value.MapConst.MAP[i].length; j < max2; j = j + 1) {
                                    if (imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_TIRE) {
                                        var tagX = imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * j + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2);
                                        var tagY = 0.6;
                                        var tagZ = imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * i + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2);
                                        var mesh = meshArr[1].mesh.clone();
                                        mesh.position.set(tagX, tagY, tagZ);
                                        THREE.GeometryUtils.merge(geometry, mesh);
                                    }
                                }
                            }
                            _this._tire = new THREE.Mesh(geometry, meshArr[1].material);
                            if (imjcart.logic.value.Const.IS_SHADOW_ENABLED) {
                                _this._tire.castShadow = true;
                            }
                            _this._scene.add(_this._tire);
                        });
                    };

                    // 木
                    Cource.prototype._createTree = function () {
                        var _this = this;
                        var geometry = new THREE.Geometry();
                        var meshArr = [];
                        var loader = new THREE.OBJMTLLoader();
                        loader.load("models/tree02/tree02.obj", "models/tree02/tree02.mtl", function (object) {
                            object.traverse(function (child) {
                                if (child instanceof THREE.Mesh) {
                                    //var texture = child.material.map;
                                    //child.material = new THREE.MeshPhongMaterial(child.material);
                                    child.material = new THREE.MeshLambertMaterial(child.material);

                                    //child.material.shininess = 3;
                                    //child.material.bumpMap = texture;
                                    //child.material.bumpScale = 0.05;
                                    //child.castShadow = true;
                                    child.material.ambient = new THREE.Color(imjcart.display.main.view3d.value.View3dConst.AMBIENT_COLOR);
                                    meshArr.push({
                                        mesh: child,
                                        material: child.material
                                    });
                                }
                            });

                            // 配置
                            var i, j, max, max2;
                            for (i = 0, max = imjcart.logic.map.value.MapConst.MAP.length; i < max; i = i + 1) {
                                for (j = 0, max2 = imjcart.logic.map.value.MapConst.MAP[i].length; j < max2; j = j + 1) {
                                    if (imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_TREE) {
                                        var tagX = imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * j + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2);
                                        var tagY = 0.6;
                                        var tagZ = imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * i + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2);
                                        var mesh = meshArr[1].mesh.clone();
                                        mesh.position.set(tagX, tagY, tagZ);
                                        THREE.GeometryUtils.merge(geometry, mesh);
                                    }
                                }
                            }
                            _this._tree = new THREE.Mesh(geometry, meshArr[1].material);
                            if (imjcart.logic.value.Const.IS_SHADOW_ENABLED) {
                                _this._tree.castShadow = true;
                            }
                            _this._scene.add(_this._tree);
                        });
                    };

                    // ゴール
                    Cource.prototype._createGoal = function () {
                        var _this = this;
                        var loader = new THREE.OBJMTLLoader();
                        loader.load("models/goal01/goal01.obj", "models/goal01/goal01.mtl", function (object) {
                            object.traverse(function (child) {
                                if (child instanceof THREE.Mesh) {
                                    switch (child.material.name) {
                                        case "PostLeft":
                                            child.material.ambient = new THREE.Color(0x999999);
                                            child.material.color = new THREE.Color(0x999999);
                                            break;
                                        case "PostRight":
                                            child.material.ambient = new THREE.Color(0x999999);
                                            child.material.color = new THREE.Color(0x999999);
                                            break;
                                        case "Banner":
                                            child.material.ambient = new THREE.Color(0xffffff);
                                            child.material.color = new THREE.Color(0xffffff);
                                            break;
                                        default:
                                            child.material.ambient = new THREE.Color(imjcart.display.main.view3d.value.View3dConst.AMBIENT_COLOR);
                                            break;
                                    }
                                    child.material.side = THREE.DoubleSide;
                                    child.material.specular = 0xffffff;
                                    child.material.shininess = 200;
                                    child.material.metal = true;

                                    //child.material = new THREE.MeshLambertMaterial(child.material);
                                    child.material = new THREE.MeshPhongMaterial(child.material);
                                    if (imjcart.logic.value.Const.IS_SHADOW_ENABLED) {
                                        child.castShadow = true;
                                    }
                                }
                            });

                            // 配置
                            var i, j, max, max2;
                            for (i = 0, max = imjcart.logic.map.value.MapConst.MAP.length; i < max; i = i + 1) {
                                for (j = 0, max2 = imjcart.logic.map.value.MapConst.MAP[i].length; j < max2; j = j + 1) {
                                    if (imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_LAP_START_POINT) {
                                        var tagX = imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * (j - 2) + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2);
                                        var tagY = 0;
                                        var tagZ = imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * i + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2);
                                        object.position.set(tagX, tagY, tagZ);
                                        _this._goal = object;
                                        _this._scene.add(_this._goal);
                                        break;
                                    }
                                }
                            }
                        });
                    };

                    // 砂地
                    Cource.prototype._createSand = function () {
                        var geometry = new THREE.Geometry();
                        var texture = THREE.ImageUtils.loadTexture("img/sand.jpg");

                        //texture.minFilter = THREE.NearestFilter;
                        //texture.magFilter = THREE.LinearMipMapLinearFilter;
                        var material = null;
                        if (imjcart.logic.value.Const.IS_BUMPMAP_ENABLED) {
                            material = new THREE.MeshPhongMaterial({
                                color: 0xffffff,
                                specular: 0x999999,
                                shininess: 10,
                                ambient: imjcart.display.main.view3d.value.View3dConst.AMBIENT_COLOR,
                                map: texture,
                                bumpMap: texture,
                                bumpScale: 0.1,
                                transparent: true,
                                blending: THREE.NormalBlending
                            });
                        } else {
                            material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, blending: THREE.NormalBlending });
                        }
                        var i, j, max, max2;
                        for (i = 0, max = imjcart.logic.map.value.MapConst.MAP.length; i < max; i = i + 1) {
                            for (j = 0, max2 = imjcart.logic.map.value.MapConst.MAP[i].length; j < max2; j = j + 1) {
                                if (imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_SAND) {
                                    var mesh = new THREE.Mesh(new THREE.PlaneGeometry(imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE, imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE, 1, 1), new THREE.MeshBasicMaterial());
                                    mesh.rotation.x = imjcart.logic.utility.Util.getAngleByRotation(-90);
                                    mesh.position.set(imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * j + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2), 0.8, imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * i + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2));
                                    THREE.GeometryUtils.merge(geometry, mesh);
                                }
                            }
                        }
                        this._sand = new THREE.Mesh(geometry, material);
                        if (imjcart.logic.value.Const.IS_SHADOW_ENABLED) {
                            this._sand.receiveShadow = true;
                        }
                        this._scene.add(this._sand);
                    };

                    // 砂地ライン
                    Cource.prototype._createSandLine = function () {
                        var geometry = new THREE.Geometry();
                        var texture = THREE.ImageUtils.loadTexture("img/sand2.png");

                        //texture.minFilter = THREE.NearestFilter;
                        //texture.magFilter = THREE.LinearMipMapLinearFilter;
                        var material = null;
                        if (imjcart.logic.value.Const.IS_BUMPMAP_ENABLED) {
                            material = new THREE.MeshPhongMaterial({
                                color: 0xffffff,
                                specular: 0x999999,
                                shininess: 10,
                                ambient: imjcart.display.main.view3d.value.View3dConst.AMBIENT_COLOR,
                                map: texture,
                                bumpMap: texture,
                                bumpScale: 0.1,
                                transparent: true,
                                blending: THREE.NormalBlending
                            });
                        } else {
                            material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, blending: THREE.NormalBlending });
                        }
                        var i, j, max, max2;
                        for (i = 0, max = this._sandMap.length; i < max; i = i + 1) {
                            for (j = 0, max2 = this._sandMap[i].length; j < max2; j = j + 1) {
                                if (this._sandMap[i][j] != null && this._sandMap[i][j] != "S") {
                                    var tagX = imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * j + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2);
                                    var tagY = 0.8;
                                    var tagZ = imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * i + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2);
                                    var mesh = new THREE.Mesh(new THREE.PlaneGeometry(imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE, imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE, 1, 1), new THREE.MeshBasicMaterial());
                                    mesh.position.set(tagX, tagY, tagZ);
                                    mesh.rotation.x = imjcart.logic.utility.Util.getAngleByRotation(-90);
                                    if (this._sandMap[i][j] == "LB") {
                                        mesh.rotation.z = imjcart.logic.utility.Util.getAngleByRotation(0);
                                        THREE.GeometryUtils.merge(geometry, mesh);
                                    } else if (this._sandMap[i][j] == "RT") {
                                        mesh.rotation.z = imjcart.logic.utility.Util.getAngleByRotation(180);
                                        THREE.GeometryUtils.merge(geometry, mesh);
                                    }
                                }
                            }
                        }
                        var mesh = new THREE.Mesh(geometry, material);
                        if (imjcart.logic.value.Const.IS_SHADOW_ENABLED) {
                            mesh.receiveShadow = true;
                        }
                        this._scene.add(mesh);
                    };

                    // 砂地ライン
                    Cource.prototype._createSandLine2 = function () {
                        var geometry = new THREE.Geometry();
                        var texture = THREE.ImageUtils.loadTexture("img/sand3.png");

                        //texture.minFilter = THREE.NearestFilter;
                        //texture.magFilter = THREE.LinearMipMapLinearFilter;
                        var material = null;
                        if (imjcart.logic.value.Const.IS_BUMPMAP_ENABLED) {
                            material = new THREE.MeshPhongMaterial({
                                color: 0xffffff,
                                specular: 0x999999,
                                shininess: 10,
                                ambient: imjcart.display.main.view3d.value.View3dConst.AMBIENT_COLOR,
                                map: texture,
                                bumpMap: texture,
                                bumpScale: 0.1,
                                transparent: true,
                                blending: THREE.NormalBlending
                            });
                        } else {
                            material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, blending: THREE.NormalBlending });
                        }
                        var i, j, max, max2;
                        for (i = 0, max = this._sandMap.length; i < max; i = i + 1) {
                            for (j = 0, max2 = this._sandMap[i].length; j < max2; j = j + 1) {
                                if (this._sandMap[i][j] != null && this._sandMap[i][j] != "S") {
                                    var tagX = imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * j + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2);
                                    var tagY = 0.8;
                                    var tagZ = imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * i + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2);
                                    var mesh = new THREE.Mesh(new THREE.PlaneGeometry(imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE, imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE, 1, 1), new THREE.MeshBasicMaterial());
                                    mesh.position.set(tagX, tagY, tagZ);
                                    mesh.rotation.x = imjcart.logic.utility.Util.getAngleByRotation(-90);
                                    if (this._sandMap[i][j] == "LT") {
                                        mesh.rotation.z = imjcart.logic.utility.Util.getAngleByRotation(-90);
                                        THREE.GeometryUtils.merge(geometry, mesh);
                                    } else if (this._sandMap[i][j] == "RB") {
                                        mesh.rotation.z = imjcart.logic.utility.Util.getAngleByRotation(90);
                                        THREE.GeometryUtils.merge(geometry, mesh);
                                    }
                                }
                            }
                        }
                        var mesh = new THREE.Mesh(geometry, material);
                        if (imjcart.logic.value.Const.IS_SHADOW_ENABLED) {
                            mesh.receiveShadow = true;
                        }
                        this._scene.add(mesh);
                    };
                    return Cource;
                })(lib.event.EventDispacher);
                view3d.Cource = Cource;
            })(main.view3d || (main.view3d = {}));
            var view3d = main.view3d;
        })(display.main || (display.main = {}));
        var main = display.main;
    })(imjcart.display || (imjcart.display = {}));
    var display = imjcart.display;
})(imjcart || (imjcart = {}));

/// <reference path="../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../lib/three.d.ts"/>
/// <reference path="../../../../lib/lib.ts"/>
/// <reference path="../../../../imjcart/logic/utility/Util.ts"/>
/// <reference path="../../../../imjcart/logic/value/Const.ts"/>
/// <reference path="../../../../imjcart/logic/value/GlobalValue.ts"/>
/// <reference path="../../../../imjcart/logic/info/LapTimeInfo.ts"/>
/// <reference path="../../../../imjcart/logic/info/RunningPath.ts"/>
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
            (function (view3d) {
                var GhostCar = (function (_super) {
                    __extends(GhostCar, _super);
                    function GhostCar(scene, info, currentIndex) {
                        if (typeof currentIndex === "undefined") { currentIndex = 0; }
                        _super.call(this);
                        this._scene = null;
                        this._info = null;
                        this._runningPath = null;
                        this._group = null;
                        this._body = null;
                        this._handle = null;
                        this._driver = null;
                        this._wheelFL = null;
                        this._wheelFR = null;
                        this._wheelBL = null;
                        this._wheelBR = null;
                        this._scene = scene;
                        this._info = info;
                        this._runningPath = this._info.runningPath;
                        this._runningPath.currentIndex = currentIndex;
                        this._createBody();
                    }
                    Object.defineProperty(GhostCar.prototype, "id", {
                        get: function () {
                            return this._info.id;
                        },
                        enumerable: true,
                        configurable: true
                    });

                    GhostCar.prototype.remove = function () {
                        this._scene.remove(this._group);
                        this._body = null;
                        this._wheelFL = null;
                        this._wheelFR = null;
                        this._wheelBL = null;
                        this._wheelBR = null;
                        this._group = null;
                    };

                    GhostCar.prototype._createBody = function () {
                        var _this = this;
                        var colorBody = this._info.colorBody;
                        var colorWing = this._info.colorWing;
                        var colorDriver = this._info.colorDriver;

                        // 車
                        this._group = new THREE.Object3D();
                        this._group.position.set(0, 0.5, 0);
                        this._scene.add(this._group);

                        // ボディ
                        var loader = new THREE.OBJMTLLoader();
                        loader.load("models/car03/car03.obj", "models/car03/car03.mtl", function (object) {
                            object.traverse(function (child) {
                                if (child instanceof THREE.Mesh) {
                                    switch (child.material.name) {
                                        case "Body":
                                            child.material.ambient = new THREE.Color(colorBody);
                                            child.material.color = new THREE.Color(colorBody);
                                            break;
                                        case "Wing":
                                            child.material.ambient = new THREE.Color(colorWing);
                                            child.material.color = new THREE.Color(colorWing);
                                            break;
                                        case "Chassis":
                                            child.material.ambient = new THREE.Color(0x111111);
                                            child.material.color = new THREE.Color(0x111111);
                                            break;
                                        case "Handle":
                                            child.material.ambient = new THREE.Color(0x333333);
                                            child.material.color = new THREE.Color(0x333333);
                                            break;
                                        default:
                                            child.material.ambient = new THREE.Color(imjcart.display.main.view3d.value.View3dConst.AMBIENT_COLOR);
                                            break;
                                    }
                                    child.material.side = THREE.DoubleSide;
                                    child.material.specular = 0xffffff;
                                    child.material.shininess = 200;
                                    child.material.metal = true;

                                    //child.material = new THREE.MeshLambertMaterial(child.material);
                                    child.material = new THREE.MeshPhongMaterial(child.material);
                                    if (imjcart.logic.value.Const.IS_SHADOW_ENABLED) {
                                        child.castShadow = true;
                                    }
                                }
                            });
                            _this._body = object;
                            _this._group.add(_this._body);
                        });

                        // ドライバー
                        var loader = new THREE.OBJMTLLoader();
                        loader.load("models/car02/driver01.obj", "models/car02/driver01.mtl", function (object) {
                            object.traverse(function (child) {
                                if (child instanceof THREE.Mesh) {
                                    switch (child.material.name) {
                                        case "DriverHead":
                                            child.material.ambient = new THREE.Color(colorDriver);
                                            child.material.color = new THREE.Color(colorDriver);
                                            break;
                                        case "DriverBody":
                                            child.material.ambient = new THREE.Color(colorDriver);
                                            child.material.color = new THREE.Color(colorDriver);
                                            break;
                                        default:
                                            child.material.ambient = new THREE.Color(imjcart.display.main.view3d.value.View3dConst.AMBIENT_COLOR);
                                            break;
                                    }
                                    child.material.side = THREE.DoubleSide;
                                    child.material = new THREE.MeshLambertMaterial(child.material);
                                }
                            });
                            _this._driver = object;
                            _this._group.add(_this._driver);
                        });

                        // ハンドル
                        var loader = new THREE.OBJMTLLoader();
                        loader.load("models/car02/handle01.obj", "models/car02/handle01.mtl", function (object) {
                            object.traverse(function (child) {
                                if (child instanceof THREE.Mesh) {
                                    switch (child.material.name) {
                                        case "Body":
                                            child.material.ambient = new THREE.Color(0x333333);
                                            child.material.color = new THREE.Color(0x333333);
                                            break;
                                        case "Screen":
                                            child.material.ambient = new THREE.Color(0x339999);
                                            child.material.color = new THREE.Color(0x339999);
                                            break;
                                        case "ButtonR":
                                            child.material.ambient = new THREE.Color(0xFF0000);
                                            child.material.color = new THREE.Color(0xFF0000);
                                            break;
                                        case "ButtonB":
                                            child.material.ambient = new THREE.Color(0x0000FF);
                                            child.material.color = new THREE.Color(0x0000FF);
                                            break;
                                        case "ButtonY":
                                            child.material.ambient = new THREE.Color(0xFFCC00);
                                            child.material.color = new THREE.Color(0xFFCC00);
                                            break;
                                        default:
                                            child.material.ambient = new THREE.Color(imjcart.display.main.view3d.value.View3dConst.AMBIENT_COLOR);
                                            break;
                                    }
                                    child.material.side = THREE.DoubleSide;
                                    child.material = new THREE.MeshLambertMaterial(child.material);
                                }
                            });
                            _this._handle = object;
                            _this._handle.position.set(0, 2, -1.3);
                            _this._group.add(_this._handle);
                        });

                        // タイヤ
                        loader = new THREE.OBJMTLLoader();
                        loader.load("models/wheel01/wheel01.obj", "models/wheel01/wheel01.mtl", function (object) {
                            object.traverse(function (child) {
                                if (child instanceof THREE.Mesh) {
                                    switch (child.material.name) {
                                        case "Wheel":
                                            child.material.ambient = new THREE.Color(0x333333);
                                            child.material.color = new THREE.Color(0x333333);
                                            break;
                                        case "Tire":
                                            child.material.ambient = new THREE.Color(0x000000);
                                            child.material.color = new THREE.Color(0x000000);
                                            break;
                                        default:
                                            child.material.ambient = new THREE.Color(imjcart.display.main.view3d.value.View3dConst.AMBIENT_COLOR);
                                            break;
                                    }
                                    child.material.side = THREE.DoubleSide;
                                    child.material = new THREE.MeshLambertMaterial(child.material);
                                    if (imjcart.logic.value.Const.IS_SHADOW_ENABLED) {
                                        child.castShadow = true;
                                    }
                                }
                            });
                            _this._wheelFL = object.clone();
                            _this._wheelFL.position.set(2.6, 1, 3.5);
                            _this._group.add(_this._wheelFL);

                            //
                            _this._wheelFR = object.clone();
                            _this._wheelFR.position.set(-2.6, 1, 3.5);
                            _this._group.add(_this._wheelFR);

                            //
                            _this._wheelBL = object.clone();
                            _this._wheelBL.position.set(2.6, 1, -7);
                            _this._group.add(_this._wheelBL);

                            //
                            _this._wheelBR = object.clone();
                            _this._wheelBR.position.set(-2.6, 1, -7);
                            _this._group.add(_this._wheelBR);
                        });
                    };

                    Object.defineProperty(GhostCar.prototype, "group", {
                        get: function () {
                            return this._group;
                        },
                        enumerable: true,
                        configurable: true
                    });

                    GhostCar.prototype.update = function () {
                        var path = this._runningPath.currentPath;
                        if (this._group) {
                            this._group.position.x = path.x * imjcart.logic.map.value.MapConst.MAP_SCALE;
                            this._group.position.z = path.y * imjcart.logic.map.value.MapConst.MAP_SCALE;
                            this._group.rotation.y = -path.bodyAngle + imjcart.logic.utility.Util.getAngleByRotation(180);
                        }
                    };
                    return GhostCar;
                })(lib.event.EventDispacher);
                view3d.GhostCar = GhostCar;
            })(main.view3d || (main.view3d = {}));
            var view3d = main.view3d;
        })(display.main || (display.main = {}));
        var main = display.main;
    })(imjcart.display || (imjcart.display = {}));
    var display = imjcart.display;
})(imjcart || (imjcart = {}));

/// <reference path="../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../lib/three.d.ts"/>
/// <reference path="../../../../lib/lib.ts"/>
/// <reference path="../../../../imjcart/logic/map/value/MapConst.ts"/>
/// <reference path="../../../../imjcart/logic/utility/Util.ts"/>
/// <reference path="../../../../imjcart/display/main/view3d/value/View3dConst.ts"/>
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
            (function (view3d) {
                var Icon = (function (_super) {
                    __extends(Icon, _super);
                    function Icon(scene) {
                        _super.call(this);
                        this._scene = null;
                        this._icon = null;
                        this._angle = view3d.value.View3dConst.CAMERA_ANGLE_DEFAULT;
                        this._mode = null;
                        this._scene = scene;
                        //
                        //this._createIcon();
                    }
                    Icon.prototype._createIcon = function () {
                        var geometry = new THREE.PlaneGeometry(2, 2);
                        var texture = THREE.ImageUtils.loadTexture("img/icon.png");
                        var material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, bumpScale: 0 });
                        this._icon = new THREE.Mesh(geometry, material);
                        //this._scene.add(this._icon);
                    };

                    Object.defineProperty(Icon.prototype, "mode", {
                        // カメラモード
                        set: function (value) {
                            this._mode = value;
                        },
                        enumerable: true,
                        configurable: true
                    });

                    Object.defineProperty(Icon.prototype, "angle", {
                        // カメラアングル
                        set: function (value) {
                            this._angle = value;
                        },
                        enumerable: true,
                        configurable: true
                    });

                    // 姿勢変更
                    Icon.prototype.setPosture = function (x, z, bodyAngle) {
                        return;
                        if (this._mode == view3d.value.View3dConst.CAMERA_MODE_TIMEATACK_RUN) {
                            if (this._angle == view3d.value.View3dConst.CAMERA_ANGLE_TOP) {
                                this._icon.position.x = x + (39 * Math.sin(bodyAngle));
                                this._icon.position.y = 250;
                                this._icon.position.z = z + (39 * Math.cos(bodyAngle));
                                this._icon.rotation.x = imjcart.logic.utility.Util.getAngleByRotation(-90);
                                this._icon.rotation.y = 0;
                                this._icon.rotation.z = bodyAngle - imjcart.logic.utility.Util.getAngleByRotation(180);
                            } else if (this._angle == view3d.value.View3dConst.CAMERA_ANGLE_BACK) {
                                this._icon.position.x = x;
                                this._icon.position.y = 5;
                                this._icon.position.z = z;
                                this._icon.rotation.y = bodyAngle - imjcart.logic.utility.Util.getAngleByRotation(180);
                                this._icon.rotation.x = 0;
                                this._icon.rotation.z = 0;
                            }
                        }
                    };
                    return Icon;
                })(lib.event.EventDispacher);
                view3d.Icon = Icon;
            })(main.view3d || (main.view3d = {}));
            var view3d = main.view3d;
        })(display.main || (display.main = {}));
        var main = display.main;
    })(imjcart.display || (imjcart.display = {}));
    var display = imjcart.display;
})(imjcart || (imjcart = {}));

/// <reference path="../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../lib/three.d.ts"/>
/// <reference path="../../../../lib/lib.ts"/>
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
            (function (view3d) {
                var Light = (function (_super) {
                    __extends(Light, _super);
                    function Light(scene) {
                        _super.call(this);
                        this._scene = null;
                        this._light = null;
                        this._spotLight = null;
                        this._mode = null;
                        this._carX = null;
                        this._carZ = null;
                        this._rotationCount = 0;
                        this._scene = scene;

                        //
                        if (imjcart.logic.value.Const.IS_SHADOW_ENABLED) {
                            this._light = new THREE.DirectionalLight(0x999999, 1);
                            this._light.position.set(1000, 1000, 1000);
                            this._light.shadowCameraLeft = -1000;
                            this._light.shadowCameraRight = 1000;
                            this._light.shadowCameraTop = -1000;
                            this._light.shadowCameraBottom = 1000;
                            this._light.shadowDarkness = 0.7;
                            this._light.shadowMapWidth = 5000;
                            this._light.shadowMapHeight = 5000;
                            this._scene.add(this._light);

                            //
                            this._spotLight = new THREE.SpotLight(0x999999, 1);
                            this._spotLight.position.set(imjcart.logic.map.value.MapConst.MAP_CENTER_X, 1000, imjcart.logic.map.value.MapConst.MAP_CENTER_Z);
                            this._spotLight.castShadow = true;
                            this._spotLight.shadowMapWidth = 10000;
                            this._spotLight.shadowMapHeight = 10000;
                            this._spotLight.shadowCameraNear = 900;
                            this._spotLight.shadowCameraFar = 1700;
                            this._spotLight.shadowCameraFov = 30;
                            this._spotLight.target.position.set(imjcart.logic.map.value.MapConst.MAP_CENTER_X, 0, imjcart.logic.map.value.MapConst.MAP_CENTER_Z);
                            this._scene.add(this._spotLight);
                        } else {
                            this._light = new THREE.DirectionalLight(0xFFFFFF, 1);
                            this._light.position.set(1000, 1000, 1000);
                            this._light.shadowCameraLeft = -1000;
                            this._light.shadowCameraRight = 1000;
                            this._light.shadowCameraTop = -1000;
                            this._light.shadowCameraBottom = 1000;
                            this._light.shadowDarkness = 0.7;
                            this._light.shadowMapWidth = 5000;
                            this._light.shadowMapHeight = 5000;
                            this._scene.add(this._light);
                        }
                    }
                    Object.defineProperty(Light.prototype, "mode", {
                        set: function (value) {
                            this._mode = value;
                        },
                        enumerable: true,
                        configurable: true
                    });

                    Object.defineProperty(Light.prototype, "light", {
                        get: function () {
                            return this._light;
                        },
                        enumerable: true,
                        configurable: true
                    });

                    Object.defineProperty(Light.prototype, "spotLight", {
                        get: function () {
                            return this._spotLight;
                        },
                        enumerable: true,
                        configurable: true
                    });

                    // 更新
                    Light.prototype.update = function () {
                        switch (this._mode) {
                            case view3d.value.View3dConst.CAMERA_MODE_OPENING:
                                this._setOpeningMode();
                                break;
                            case view3d.value.View3dConst.CAMERA_MODE_TIMEATACK_RUN:
                                this._setTimeAtackRunMode();
                                break;
                        }
                    };

                    // 車位置変更
                    Light.prototype.setCarPosition = function (x, z) {
                        this._carX = x;
                        this._carZ = z;
                    };

                    Light.prototype._setOpeningMode = function () {
                        this._spotLight.target.position.set(imjcart.logic.map.value.MapConst.MAP_CENTER_X, 0, imjcart.logic.map.value.MapConst.MAP_CENTER_Z);
                        this._spotLight.position.set(imjcart.logic.map.value.MapConst.MAP_CENTER_X + (400 * Math.sin(this._rotationCount)), 1500, imjcart.logic.map.value.MapConst.MAP_CENTER_Z + (400 * Math.cos(this._rotationCount)));
                        this._rotationCount += imjcart.logic.value.Const.FPS / 1000 / imjcart.logic.value.Const.FPS;
                    };

                    Light.prototype._setTimeAtackRunMode = function () {
                        this._spotLight.position.set(imjcart.logic.map.value.MapConst.MAP_CENTER_X, 1000, imjcart.logic.map.value.MapConst.MAP_CENTER_Z);
                        this._spotLight.target.position.set(this._carX, 0, this._carZ);
                    };
                    return Light;
                })(lib.event.EventDispacher);
                view3d.Light = Light;
            })(main.view3d || (main.view3d = {}));
            var view3d = main.view3d;
        })(display.main || (display.main = {}));
        var main = display.main;
    })(imjcart.display || (imjcart.display = {}));
    var display = imjcart.display;
})(imjcart || (imjcart = {}));

/// <reference path="../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../lib/three.d.ts"/>
/// <reference path="../../../../lib/lib.ts"/>
/// <reference path="../../../../imjcart/logic/utility/Util.ts"/>
/// <reference path="../../../../imjcart/logic/value/Const.ts"/>
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
            (function (view3d) {
                var OtherCar = (function (_super) {
                    __extends(OtherCar, _super);
                    function OtherCar(scene, id) {
                        _super.call(this);
                        this._scene = null;
                        this._id = null;
                        this._group = null;
                        this._body = null;
                        this._handle = null;
                        this._driver = null;
                        this._wheelFL = null;
                        this._wheelFR = null;
                        this._wheelBL = null;
                        this._wheelBR = null;
                        this._x = null;
                        this._z = null;
                        this._bodyAngle = null;
                        this._wheelAngle = null;
                        this._speed = null;
                        this._lastX = null;
                        this._lastZ = null;
                        this._lastBodyAngle = null;
                        this._lastWheelAngle = null;
                        this._lastSpeed = null;
                        this._subX = null;
                        this._subZ = null;
                        this._subBodyAngle = null;
                        this._subWheelAngle = null;
                        this._subSpeed = null;
                        this._step = null;
                        this._intervalId = null;
                        this._scene = scene;
                        this._id = id;
                        this._createBody();
                    }
                    Object.defineProperty(OtherCar.prototype, "id", {
                        get: function () {
                            return this._id;
                        },
                        enumerable: true,
                        configurable: true
                    });

                    OtherCar.prototype.remove = function () {
                        this._scene.remove(this._group);
                        this._body = null;
                        this._wheelFL = null;
                        this._wheelFR = null;
                        this._wheelBL = null;
                        this._wheelBR = null;
                        this._group = null;
                        if (this._intervalId)
                            clearInterval(this._intervalId);
                    };

                    OtherCar.prototype._createBody = function () {
                        var _this = this;
                        var colorBody = null;
                        var colorWing = null;
                        var colorDriver = null;
                        var values = imjcart.logic.value.GlobalValue.getInstance();
                        var i = 0, max;
                        for (i = 0, max = values.otherCarInfoArr.length; i < max; i = i + 1) {
                            var info = values.otherCarInfoArr[i];
                            if (info.id == this._id) {
                                colorBody = info.colorBody;
                                colorWing = info.colorWing;
                                colorDriver = info.colorDriver;
                                break;
                            }
                        }

                        // 車
                        this._group = new THREE.Object3D();
                        this._group.position.set(0, 0.5, 0);
                        this._scene.add(this._group);

                        // ボディ
                        var loader = new THREE.OBJMTLLoader();
                        loader.load("models/car03/car03.obj", "models/car03/car03.mtl", function (object) {
                            object.traverse(function (child) {
                                if (child instanceof THREE.Mesh) {
                                    switch (child.material.name) {
                                        case "Body":
                                            child.material.ambient = new THREE.Color(colorBody);
                                            child.material.color = new THREE.Color(colorBody);
                                            break;
                                        case "Wing":
                                            child.material.ambient = new THREE.Color(colorWing);
                                            child.material.color = new THREE.Color(colorWing);
                                            break;
                                        case "Chassis":
                                            child.material.ambient = new THREE.Color(0x111111);
                                            child.material.color = new THREE.Color(0x111111);
                                            break;
                                        case "Handle":
                                            child.material.ambient = new THREE.Color(0x333333);
                                            child.material.color = new THREE.Color(0x333333);
                                            break;
                                        default:
                                            child.material.ambient = new THREE.Color(imjcart.display.main.view3d.value.View3dConst.AMBIENT_COLOR);
                                            break;
                                    }
                                    child.material.side = THREE.DoubleSide;
                                    child.material.specular = 0xffffff;
                                    child.material.shininess = 200;
                                    child.material.metal = true;

                                    //child.material = new THREE.MeshLambertMaterial(child.material);
                                    child.material = new THREE.MeshPhongMaterial(child.material);
                                    if (imjcart.logic.value.Const.IS_SHADOW_ENABLED) {
                                        child.castShadow = true;
                                    }
                                }
                            });
                            _this._body = object;
                            _this._group.add(_this._body);
                        });

                        // ドライバー
                        var loader = new THREE.OBJMTLLoader();
                        loader.load("models/car02/driver01.obj", "models/car02/driver01.mtl", function (object) {
                            object.traverse(function (child) {
                                if (child instanceof THREE.Mesh) {
                                    switch (child.material.name) {
                                        case "DriverHead":
                                            child.material.ambient = new THREE.Color(colorDriver);
                                            child.material.color = new THREE.Color(colorDriver);
                                            break;
                                        case "DriverBody":
                                            child.material.ambient = new THREE.Color(colorDriver);
                                            child.material.color = new THREE.Color(colorDriver);
                                            break;
                                        default:
                                            child.material.ambient = new THREE.Color(imjcart.display.main.view3d.value.View3dConst.AMBIENT_COLOR);
                                            break;
                                    }
                                    child.material.side = THREE.DoubleSide;
                                    child.material = new THREE.MeshLambertMaterial(child.material);
                                }
                            });
                            _this._driver = object;
                            _this._group.add(_this._driver);
                        });

                        // ハンドル
                        var loader = new THREE.OBJMTLLoader();
                        loader.load("models/car02/handle01.obj", "models/car02/handle01.mtl", function (object) {
                            object.traverse(function (child) {
                                if (child instanceof THREE.Mesh) {
                                    switch (child.material.name) {
                                        case "Body":
                                            child.material.ambient = new THREE.Color(0x333333);
                                            child.material.color = new THREE.Color(0x333333);
                                            break;
                                        case "Screen":
                                            child.material.ambient = new THREE.Color(0x339999);
                                            child.material.color = new THREE.Color(0x339999);
                                            break;
                                        case "ButtonR":
                                            child.material.ambient = new THREE.Color(0xFF0000);
                                            child.material.color = new THREE.Color(0xFF0000);
                                            break;
                                        case "ButtonB":
                                            child.material.ambient = new THREE.Color(0x0000FF);
                                            child.material.color = new THREE.Color(0x0000FF);
                                            break;
                                        case "ButtonY":
                                            child.material.ambient = new THREE.Color(0xFFCC00);
                                            child.material.color = new THREE.Color(0xFFCC00);
                                            break;
                                        default:
                                            child.material.ambient = new THREE.Color(imjcart.display.main.view3d.value.View3dConst.AMBIENT_COLOR);
                                            break;
                                    }
                                    child.material.side = THREE.DoubleSide;
                                    child.material = new THREE.MeshLambertMaterial(child.material);
                                }
                            });
                            _this._handle = object;
                            _this._handle.position.set(0, 2, -1.3);
                            _this._group.add(_this._handle);
                        });

                        // タイヤ
                        loader = new THREE.OBJMTLLoader();
                        loader.load("models/wheel01/wheel01.obj", "models/wheel01/wheel01.mtl", function (object) {
                            object.traverse(function (child) {
                                if (child instanceof THREE.Mesh) {
                                    switch (child.material.name) {
                                        case "Wheel":
                                            child.material.ambient = new THREE.Color(0x333333);
                                            child.material.color = new THREE.Color(0x333333);
                                            break;
                                        case "Tire":
                                            child.material.ambient = new THREE.Color(0x000000);
                                            child.material.color = new THREE.Color(0x000000);
                                            break;
                                        default:
                                            child.material.ambient = new THREE.Color(imjcart.display.main.view3d.value.View3dConst.AMBIENT_COLOR);
                                            break;
                                    }
                                    child.material.side = THREE.DoubleSide;
                                    child.material = new THREE.MeshLambertMaterial(child.material);
                                    if (imjcart.logic.value.Const.IS_SHADOW_ENABLED) {
                                        child.castShadow = true;
                                    }
                                }
                            });
                            _this._wheelFL = object.clone();
                            _this._wheelFL.position.set(2.6, 1, 3.5);
                            _this._group.add(_this._wheelFL);

                            //
                            _this._wheelFR = object.clone();
                            _this._wheelFR.position.set(-2.6, 1, 3.5);
                            _this._group.add(_this._wheelFR);

                            //
                            _this._wheelBL = object.clone();
                            _this._wheelBL.position.set(2.6, 1, -7);
                            _this._group.add(_this._wheelBL);

                            //
                            _this._wheelBR = object.clone();
                            _this._wheelBR.position.set(-2.6, 1, -7);
                            _this._group.add(_this._wheelBR);
                        });

                        // 受け取った姿勢をフレームレートで配分
                        this._intervalId = setInterval(function () {
                            _this._onSmoothPosture();
                        }, 1000 / imjcart.logic.value.Const.FPS);
                    };

                    Object.defineProperty(OtherCar.prototype, "group", {
                        get: function () {
                            return this._group;
                        },
                        enumerable: true,
                        configurable: true
                    });

                    // 姿勢設定
                    OtherCar.prototype.setPosture = function (x, z, bodyAngle, wheelAngle, speed) {
                        bodyAngle = bodyAngle - (((wheelAngle - imjcart.logic.utility.Util.getAngleByRotation(90)) * 0.2) * speed);
                        wheelAngle = -wheelAngle + imjcart.logic.utility.Util.getAngleByRotation(90);

                        // 初回
                        if (this._x == null || this._z == null || this._bodyAngle == null || this._wheelAngle == null) {
                            this._x = x;
                            this._z = z;
                            this._bodyAngle = bodyAngle;
                            this._wheelAngle = wheelAngle;
                            this._speed = speed;
                        }

                        //
                        this._lastX = this._x;
                        this._lastZ = this._z;
                        this._lastBodyAngle = this._bodyAngle;
                        this._lastWheelAngle = this._wheelAngle;
                        this._lastSpeed = this._speed;
                        this._x = x;
                        this._z = z;
                        this._bodyAngle = bodyAngle;
                        this._wheelAngle = wheelAngle;
                        this._speed = speed;

                        // 差分抽出
                        this._subX = x - this._lastX;
                        this._subZ = z - this._lastZ;
                        this._subBodyAngle = bodyAngle - this._lastBodyAngle;
                        this._subWheelAngle = wheelAngle - this._lastWheelAngle;
                        this._subSpeed = speed - this._lastSpeed;

                        //
                        this._step = 0;
                    };

                    // 姿勢更新
                    OtherCar.prototype._onSmoothPosture = function () {
                        var parcent = (imjcart.logic.value.Const.SOCKET_EMIT_OTHER_CARS_CONDITION_FPS / imjcart.logic.value.Const.FPS) * this._step;
                        this._step = this._step + 1;

                        //
                        if (this._group) {
                            this._group.position.x = this._lastX + (this._subX * parcent);
                            this._group.position.z = this._lastZ + (this._subZ * parcent);
                            this._group.rotation.y = this._lastBodyAngle + (this._subBodyAngle * parcent);
                        }
                        if (this._wheelFL && this._wheelFR) {
                            this._wheelFL.rotation.y = this._lastWheelAngle + (this._subWheelAngle * parcent);
                            this._wheelFR.rotation.y = this._lastWheelAngle + (this._subWheelAngle * parcent);
                        }
                        if (this._body) {
                            // ボディの振動
                            this._body.position.y = (Math.random() * 0.005 * (this._lastSpeed + (this._subSpeed * parcent)));
                        }
                    };
                    return OtherCar;
                })(lib.event.EventDispacher);
                view3d.OtherCar = OtherCar;
            })(main.view3d || (main.view3d = {}));
            var view3d = main.view3d;
        })(display.main || (display.main = {}));
        var main = display.main;
    })(imjcart.display || (imjcart.display = {}));
    var display = imjcart.display;
})(imjcart || (imjcart = {}));

/// <reference path="../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../lib/three.d.ts"/>
/// <reference path="../../../../lib/lib.ts"/>
/// <reference path="../../../../imjcart/display/main/view3d/Car.ts"/>
/// <reference path="../../../../imjcart/display/main/view3d/OtherCar.ts"/>
/// <reference path="../../../../imjcart/display/main/view3d/Camera.ts"/>
/// <reference path="../../../../imjcart/display/main/view3d/Cource.ts"/>
/// <reference path="../../../../imjcart/display/main/view3d/Light.ts"/>
/// <reference path="../../../../imjcart/display/main/view3d/Icon.ts"/>
/// <reference path="../../../../imjcart/display/main/view3d/Background.ts"/>
/// <reference path="../../../../imjcart/display/main/view3d/GhostCar.ts"/>
/// <reference path="../../../../imjcart/logic/value/GlobalValue.ts"/>
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
            (function (view3d) {
                var View3d = (function (_super) {
                    __extends(View3d, _super);
                    function View3d(target) {
                        var _this = this;
                        _super.call(this, target);
                        this._displayImpl = null;
                        this._scene = null;
                        this._renderer = null;
                        this._axis = null;
                        this._controls = null;
                        //
                        this._light = null;
                        this._camera = null;
                        this._background = null;
                        this._cource = null;
                        this._car = null;
                        this._icon = null;
                        this._otherCarArr = [];
                        //
                        this._carX = null;
                        this._carZ = null;
                        this._carBodyAngle = null;
                        this._carWheelAngle = null;
                        this._carSpeed = null;
                        this._cameraAngle = view3d.value.View3dConst.CAMERA_ANGLE_DEFAULT;
                        //
                        this._ghostCarArr = [];

                        // シーン
                        this._scene = new THREE.Scene();

                        //this._scene.fog = new THREE.FogExp2(0xFFFFFF, 0.001);
                        // 環境光
                        var ambient = new THREE.AmbientLight(imjcart.display.main.view3d.value.View3dConst.AMBIENT_COLOR);
                        this._scene.add(ambient);

                        // レンダラ―
                        //this._renderer = new THREE.WebGLRenderer();
                        this._renderer = new THREE.WebGLRenderer({ antialias: true });
                        this._renderer.setSize(window.innerWidth, window.innerHeight - imjcart.logic.value.Const.FOOTER_HEIGHT - imjcart.logic.value.Const.RANKING_HEIGHT);
                        this._renderer.setClearColor(0x2077ab, 1);
                        if (imjcart.logic.value.Const.IS_SHADOW_ENABLED) {
                            this._renderer.shadowMapEnabled = true;
                        }
                        this.$target.append(this._renderer.domElement);

                        // ライト
                        this._light = new view3d.Light(this._scene);

                        // カメラ
                        this._camera = new view3d.Camera(this._scene);

                        // 背景
                        this._background = new view3d.Background(this._scene);

                        // コース
                        this._cource = new view3d.Cource(this._scene);

                        // 車
                        this._car = new view3d.Car(this._scene);

                        // アイコン
                        this._icon = new view3d.Icon(this._scene);

                        //
                        this._displayImpl = new lib.display.SimpleDisplayImpl(this.$target);
                        this._displayImpl.addEventListener(lib.event.Event.DISPLAY_START_OPEN_EVENT, function () {
                            lib.responisive.ResizeManager.getInstance().addEventListener(_this);
                            lib.responisive.ResizeManager.getInstance().dispatchEvent(_this);
                        });
                        this._displayImpl.addEventListener(lib.event.Event.DISPLAY_COMPLETE_OPEN_EVENT, function () {
                            _this._completeOpen();
                        });

                        // デバッグモード
                        if (imjcart.logic.value.Const.IS_VIEW3D_DEBUG_MODE) {
                            if (imjcart.logic.value.Const.IS_SHADOW_ENABLED) {
                                this._light.spotLight.shadowCameraVisible = true;
                            } else {
                                this._light.light.shadowCameraVisible = true;
                            }
                            this._axis = new THREE.AxisHelper(1000);
                            this._axis.position.set(0, 0, 0);
                            this._scene.add(this._axis);
                            this._controls = new THREE.OrbitControls(this._camera.camera);
                        }
                    }
                    View3d.prototype._completeOpen = function () {
                        var _this = this;
                        this._render();
                        setInterval(function () {
                            // ゴーストカー更新
                            var i = 0, max;
                            for (i = 0, max = _this._ghostCarArr.length; i < max; i = i + 1) {
                                var ghost = _this._ghostCarArr[i];
                                ghost.update();
                            }
                        }, 1000 / imjcart.logic.value.Const.FPS);
                    };

                    View3d.prototype._render = function () {
                        var _this = this;
                        window.requestAnimationFrame(function () {
                            _this._render();
                        });

                        // カメラ更新
                        this._camera.update();

                        // レンダリング
                        this._renderer.render(this._scene, this._camera.camera);

                        // スポットライト更新
                        if (imjcart.logic.value.Const.IS_SHADOW_ENABLED) {
                            this._light.update();
                        }

                        // デバッグモード
                        if (imjcart.logic.value.Const.IS_VIEW3D_DEBUG_MODE && this._controls) {
                            this._controls.update();
                        }
                    };

                    View3d.prototype.open = function () {
                        this._displayImpl.open(0);
                    };

                    View3d.prototype.close = function () {
                        this._displayImpl.close(0);
                    };

                    View3d.prototype.onResize = function (width, height) {
                        if (width < imjcart.logic.value.Const.STAGE_WIDTH)
                            width = imjcart.logic.value.Const.STAGE_WIDTH;
                        if (height < imjcart.logic.value.Const.STAGE_HEIGHT)
                            height = imjcart.logic.value.Const.STAGE_HEIGHT;
                        this.$target.css({
                            width: width,
                            height: height - imjcart.logic.value.Const.FOOTER_HEIGHT - imjcart.logic.value.Const.RANKING_HEIGHT
                        });
                        this._renderer.setSize(width, height - imjcart.logic.value.Const.FOOTER_HEIGHT - imjcart.logic.value.Const.RANKING_HEIGHT);
                    };

                    // 車の姿勢更新
                    View3d.prototype.updateCarPosture = function () {
                        var values = imjcart.logic.value.GlobalValue.getInstance();
                        this._carX = values.carInfo.x * imjcart.logic.map.value.MapConst.MAP_SCALE;
                        this._carZ = values.carInfo.y * imjcart.logic.map.value.MapConst.MAP_SCALE;
                        this._carBodyAngle = -values.carInfo.bodyAngle + imjcart.logic.utility.Util.getAngleByRotation(180);
                        this._carWheelAngle = values.carInfo.wheelAngle + imjcart.logic.utility.Util.getAngleByRotation(90);
                        this._carSpeed = values.carInfo.speed;

                        // 車姿勢変更
                        this._car.setPosture(this._carX, this._carZ, this._carBodyAngle, this._carWheelAngle, this._carSpeed);

                        // 車姿勢変更
                        this._camera.setCarPosture(this._carX, this._carZ, this._carBodyAngle);

                        // アイコン
                        this._icon.setPosture(this._carX, this._carZ, this._carBodyAngle);

                        // スポットライト
                        if (imjcart.logic.value.Const.IS_SHADOW_ENABLED) {
                            this._light.setCarPosition(this._carX, this._carZ);
                        }
                    };

                    // 他の車追加
                    View3d.prototype.addOtherCar = function (id) {
                        var otherCar = new view3d.OtherCar(this._scene, id);
                        this._otherCarArr.push(otherCar);
                    };

                    // 他の車削除
                    View3d.prototype.removeOtherCar = function (id) {
                        var arr = [];
                        var i = 0, max;
                        for (i = 0, max = this._otherCarArr.length; i < max; i = i + 1) {
                            var otherCar = this._otherCarArr[i];
                            if (id != otherCar.id) {
                                arr.push(otherCar);
                            } else {
                                otherCar.remove();
                            }
                        }
                        this._otherCarArr = arr;
                    };

                    // 他の車の姿勢更新
                    View3d.prototype.updateOtherCarPosture = function () {
                        var values = imjcart.logic.value.GlobalValue.getInstance();
                        var i = 0, max;
                        for (i = 0, max = values.otherCarInfoArr.length; i < max; i = i + 1) {
                            var info = values.otherCarInfoArr[i];
                            var j = 0, max2;
                            for (j = 0, max2 = this._otherCarArr.length; j < max2; j = j + 1) {
                                var otherCar = this._otherCarArr[j];
                                if (otherCar.id == info.id) {
                                    var x = info.x * imjcart.logic.map.value.MapConst.MAP_SCALE;
                                    var y = info.y * imjcart.logic.map.value.MapConst.MAP_SCALE;
                                    var bodyAngle = -info.bodyAngle + imjcart.logic.utility.Util.getAngleByRotation(180);
                                    var wheelAngle = info.wheelAngle + imjcart.logic.utility.Util.getAngleByRotation(90);
                                    var speed = info.speed;
                                    otherCar.setPosture(x, y, bodyAngle, wheelAngle, speed);
                                    break;
                                }
                            }
                        }
                    };

                    // シーン変更
                    View3d.prototype.changeScene = function () {
                        this._changeCameraMode();

                        //
                        var values = imjcart.logic.value.GlobalValue.getInstance();
                        switch (values.currentSceneId) {
                            case imjcart.logic.value.Const.ID_SCENE_TIMEATACK:
                                // 車生成
                                this._car.createBody({
                                    body: values.colorBody,
                                    wing: values.colorWing,
                                    driverHead: values.colorDriver,
                                    driverBody: values.colorDriver
                                });
                                break;
                        }
                    };

                    // タイムアタックシーン変更
                    View3d.prototype.changeTimeAtackScene = function () {
                        this._changeCameraMode();
                    };

                    View3d.prototype._changeCameraMode = function () {
                        var values = imjcart.logic.value.GlobalValue.getInstance();
                        switch (values.currentSceneId) {
                            case imjcart.logic.value.Const.ID_SCENE_OPENING:
                                // カメラモード設定
                                this._camera.mode = view3d.value.View3dConst.CAMERA_MODE_OPENING;
                                this._icon.mode = view3d.value.View3dConst.CAMERA_MODE_OPENING;
                                this._light.mode = view3d.value.View3dConst.CAMERA_MODE_OPENING;
                                break;
                            case imjcart.logic.value.Const.ID_SCENE_TIMEATACK:
                                switch (values.currentTimeAtackSceneId) {
                                    case imjcart.logic.value.Const.ID_SCENE_TIMEATACK_RUN:
                                        // カメラモード設定
                                        this._camera.mode = view3d.value.View3dConst.CAMERA_MODE_TIMEATACK_RUN;
                                        this._icon.mode = view3d.value.View3dConst.CAMERA_MODE_TIMEATACK_RUN;
                                        this._light.mode = view3d.value.View3dConst.CAMERA_MODE_TIMEATACK_RUN;
                                        break;
                                }
                                break;
                        }
                    };

                    // カメラアングル変更
                    View3d.prototype.changeCameraAngle = function () {
                        switch (this._cameraAngle) {
                            case view3d.value.View3dConst.CAMERA_ANGLE_TOP:
                                this._cameraAngle = view3d.value.View3dConst.CAMERA_ANGLE_BACK;
                                this._car.showDriver();
                                break;
                            case view3d.value.View3dConst.CAMERA_ANGLE_BACK:
                                this._cameraAngle = view3d.value.View3dConst.CAMERA_ANGLE_INSIDE;
                                this._car.hideDriver();
                                break;
                            case view3d.value.View3dConst.CAMERA_ANGLE_INSIDE:
                                this._cameraAngle = view3d.value.View3dConst.CAMERA_ANGLE_TOP;
                                this._car.showDriver();
                                break;
                        }
                        this._camera.angle = this._cameraAngle;
                        this._icon.angle = this._cameraAngle;
                    };

                    // ゴーストカー設置
                    View3d.prototype.setGhostCars = function () {
                        if (1 <= this._ghostCarArr.length)
                            return;
                        var infoArr = [];
                        var values = imjcart.logic.value.GlobalValue.getInstance();
                        var i = 0, max;
                        for (i = 0, max = values.lapTimeInfoArr.length; i < max; i = i + 1) {
                            var info = values.lapTimeInfoArr[i];
                            if (info.runningPath && info.runningPath.collection.length) {
                                infoArr.push(info);
                            }
                        }
                        infoArr = imjcart.logic.utility.Util.shuffle(infoArr);
                        for (i = 0, max = imjcart.logic.value.Const.MAX_GHOST_COUNT; i < max; i = i + 1) {
                            var ghostCar = new imjcart.display.main.view3d.GhostCar(this._scene, infoArr[i], i * (1800 / imjcart.logic.value.Const.MAX_GHOST_COUNT));
                            this._ghostCarArr.push(ghostCar);
                        }
                    };
                    return View3d;
                })(lib.base.BaseDisplay);
                view3d.View3d = View3d;
            })(main.view3d || (main.view3d = {}));
            var view3d = main.view3d;
        })(display.main || (display.main = {}));
        var main = display.main;
    })(imjcart.display || (imjcart.display = {}));
    var display = imjcart.display;
})(imjcart || (imjcart = {}));

/// <reference path="../../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../../lib/three.d.ts"/>
/// <reference path="../../../../../lib/lib.ts"/>
var imjcart;
(function (imjcart) {
    (function (display) {
        (function (main) {
            (function (view3d) {
                (function (value) {
                    var View3dConst = (function () {
                        function View3dConst() {
                        }
                        View3dConst.CAMERA_MODE_OPENING = "camera_mode_opening";
                        View3dConst.CAMERA_MODE_TIMEATACK_RUN = "camera_mode_timeatack_run";

                        View3dConst.CAMERA_ANGLE_TOP = "camera_angle_top";
                        View3dConst.CAMERA_ANGLE_BACK = "camera_angle_back";
                        View3dConst.CAMERA_ANGLE_INSIDE = "camera_angle_inside";
                        View3dConst.CAMERA_ANGLE_DEFAULT = View3dConst.CAMERA_ANGLE_BACK;

                        View3dConst.AMBIENT_COLOR = 0x666666;
                        return View3dConst;
                    })();
                    value.View3dConst = View3dConst;
                })(view3d.value || (view3d.value = {}));
                var value = view3d.value;
            })(main.view3d || (main.view3d = {}));
            var view3d = main.view3d;
        })(display.main || (display.main = {}));
        var main = display.main;
    })(imjcart.display || (imjcart.display = {}));
    var display = imjcart.display;
})(imjcart || (imjcart = {}));

/// <reference path="../../../lib/jquery.d.ts"/>
/// <reference path="../../../lib/lib.ts"/>
/// <reference path="../../../imjcart/logic/value/Const.ts"/>
/// <reference path="../../../imjcart/logic/value/GlobalValue.ts"/>
/// <reference path="../../../imjcart/logic/event/ProjectEvent.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var imjcart;
(function (imjcart) {
    (function (display) {
        (function (preloader) {
            var Preloader = (function (_super) {
                __extends(Preloader, _super);
                function Preloader(target) {
                    var _this = this;
                    _super.call(this, target);
                    this._displayImpl = null;
                    this._$txt = $("#preloaderTxt");
                    this._$loaded = $("#preloaderLoaded");
                    this._$total = $("#preloaderTotal");

                    //
                    this._displayImpl = new lib.display.SimpleDisplayImpl(this.$target);
                    this._displayImpl.addEventListener(lib.event.Event.DISPLAY_START_OPEN_EVENT, function () {
                        lib.responisive.ResizeManager.getInstance().addEventListener(_this);
                        lib.responisive.ResizeManager.getInstance().dispatchEvent(_this);
                    });
                    this._displayImpl.addEventListener(lib.event.Event.DISPLAY_COMPLETE_CLOSE_EVENT, function () {
                        lib.responisive.ResizeManager.getInstance().removeEventListener(_this);
                    });
                    //
                    // ---------- イベント ---------- //
                    //
                }
                Preloader.prototype.open = function () {
                    this._displayImpl.open(0);
                };

                Preloader.prototype.close = function () {
                    this._displayImpl.close(0);
                };

                Preloader.prototype.onResize = function (width, height) {
                    this.$target.css({
                        width: width,
                        height: height - imjcart.logic.value.Const.FOOTER_HEIGHT
                    });
                    this._$txt.css({
                        position: "relative",
                        top: (height - imjcart.logic.value.Const.FOOTER_HEIGHT) / 2
                    });
                };

                Object.defineProperty(Preloader.prototype, "total", {
                    set: function (value) {
                        this._$total.text(value + "");
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(Preloader.prototype, "loaded", {
                    set: function (value) {
                        this._$loaded.text(value + "");
                    },
                    enumerable: true,
                    configurable: true
                });
                return Preloader;
            })(lib.base.BaseDisplay);
            preloader.Preloader = Preloader;
        })(display.preloader || (display.preloader = {}));
        var preloader = display.preloader;
    })(imjcart.display || (imjcart.display = {}));
    var display = imjcart.display;
})(imjcart || (imjcart = {}));

/// <reference path="../../../lib/jquery.d.ts"/>
/// <reference path="../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../lib/three.d.ts"/>
/// <reference path="../../../lib/lib.ts"/>
/// <reference path="../../../imjcart/logic/controller/value/ControllerConst.ts"/>
/// <reference path="../../../imjcart/logic/controller/event/ControllerEvent.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var imjcart;
(function (imjcart) {
    (function (logic) {
        (function (controller) {
            var Controller = (function (_super) {
                __extends(Controller, _super);
                function Controller() {
                    var _this = this;
                    _super.call(this);
                    Controller._instance = this;

                    //
                    $(document).keydown(function (evt) {
                        if (evt.keyCode == controller.value.ControllerConst.KEYCODE_UP || evt.keyCode == controller.value.ControllerConst.KEYCODE_W) {
                            _this.startEngine({
                                value: 1
                            });
                        }
                        if (evt.keyCode == controller.value.ControllerConst.KEYCODE_DOWN || evt.keyCode == controller.value.ControllerConst.KEYCODE_S) {
                            _this.startEngine({
                                value: -1
                            });
                        }
                        if (evt.keyCode == controller.value.ControllerConst.KEYCODE_LEFT || evt.keyCode == controller.value.ControllerConst.KEYCODE_A) {
                            _this.setSteeringAngle({
                                //value: 0.5
                                value: 0.75
                            });
                        }
                        if (evt.keyCode == controller.value.ControllerConst.KEYCODE_RIGHT || evt.keyCode == controller.value.ControllerConst.KEYCODE_D) {
                            _this.setSteeringAngle({
                                //value: -0.5
                                value: -0.75
                            });
                        }
                        if (evt.keyCode == controller.value.ControllerConst.KEYCODE_SPACE) {
                            _this.changeCameraAngle();
                        }
                        if (evt.keyCode == controller.value.ControllerConst.KEYCODE_SHIFT) {
                            _this.changeCameraAngle();
                        }
                    });
                    $(document).keyup(function (evt) {
                        if (evt.keyCode == controller.value.ControllerConst.KEYCODE_LEFT || evt.keyCode == controller.value.ControllerConst.KEYCODE_RIGHT || evt.keyCode == controller.value.ControllerConst.KEYCODE_A || evt.keyCode == controller.value.ControllerConst.KEYCODE_D) {
                            _this.clearSteeringAngle();
                        }
                        if (evt.keyCode == controller.value.ControllerConst.KEYCODE_UP || evt.keyCode == controller.value.ControllerConst.KEYCODE_DOWN || evt.keyCode == controller.value.ControllerConst.KEYCODE_W || evt.keyCode == controller.value.ControllerConst.KEYCODE_S) {
                            _this.stopEngine();
                        }
                    });
                }
                Controller.getInstance = function () {
                    if (Controller._instance === null) {
                        Controller._instance = new Controller();
                    }
                    return Controller._instance;
                };

                Controller.prototype.startEngine = function (params) {
                    var value = params.value;

                    // エンジン開始イベント
                    this.dispatchEvent(controller.event.ControllerEvent.START_ENGINE_EVENT, { value: value });
                };

                Controller.prototype.setSteeringAngle = function (params) {
                    var value = params.value;

                    // ステアリング変更イベント
                    this.dispatchEvent(controller.event.ControllerEvent.SET_STEERING_ANGLE_EVENT, { value: value });
                };

                Controller.prototype.clearSteeringAngle = function () {
                    // ステアリングを元に戻すイベント
                    this.dispatchEvent(controller.event.ControllerEvent.CLEAR_STEERING_ANGLE_EVENT);
                };

                Controller.prototype.stopEngine = function () {
                    // エンジン停止イベント
                    this.dispatchEvent(controller.event.ControllerEvent.STOP_ENGINE_EVENT);
                };

                Controller.prototype.changeCameraAngle = function () {
                    // カメラアングル変更イベント
                    this.dispatchEvent(controller.event.ControllerEvent.CHANGE_CAMERA_ANGLE_EVENT);
                };
                Controller._instance = null;
                return Controller;
            })(lib.event.EventDispacher);
            controller.Controller = Controller;
        })(logic.controller || (logic.controller = {}));
        var controller = logic.controller;
    })(imjcart.logic || (imjcart.logic = {}));
    var logic = imjcart.logic;
})(imjcart || (imjcart = {}));

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

/// <reference path="../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../lib/three.d.ts"/>
/// <reference path="../../../../lib/lib.ts"/>
var imjcart;
(function (imjcart) {
    (function (logic) {
        (function (controller) {
            (function (value) {
                var ControllerConst = (function () {
                    function ControllerConst() {
                    }
                    ControllerConst.KEYCODE_UP = 38;
                    ControllerConst.KEYCODE_DOWN = 40;
                    ControllerConst.KEYCODE_LEFT = 37;
                    ControllerConst.KEYCODE_RIGHT = 39;
                    ControllerConst.KEYCODE_SPACE = 32;
                    ControllerConst.KEYCODE_SHIFT = 16;
                    ControllerConst.KEYCODE_W = 87;
                    ControllerConst.KEYCODE_A = 65;
                    ControllerConst.KEYCODE_S = 83;
                    ControllerConst.KEYCODE_D = 68;
                    return ControllerConst;
                })();
                value.ControllerConst = ControllerConst;
            })(controller.value || (controller.value = {}));
            var value = controller.value;
        })(logic.controller || (logic.controller = {}));
        var controller = logic.controller;
    })(imjcart.logic || (imjcart.logic = {}));
    var logic = imjcart.logic;
})(imjcart || (imjcart = {}));

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

/// <reference path="../../../lib/jquery.d.ts"/>
/// <reference path="../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../lib/three.d.ts"/>
/// <reference path="../../../lib/lib.ts"/>
/// <reference path="../../../imjcart/logic/info/RunningPath.ts"/>
var imjcart;
(function (imjcart) {
    (function (logic) {
        (function (info) {
            var CarInfo = (function () {
                function CarInfo(x, y, bodyAngle, wheelAngle, speed, power, gear, direction, colorBody, colorWing, colorDriver, name) {
                    if (typeof x === "undefined") { x = 0; }
                    if (typeof y === "undefined") { y = 0; }
                    if (typeof bodyAngle === "undefined") { bodyAngle = 0; }
                    if (typeof wheelAngle === "undefined") { wheelAngle = 0; }
                    if (typeof speed === "undefined") { speed = 0; }
                    if (typeof power === "undefined") { power = 0; }
                    if (typeof gear === "undefined") { gear = 0; }
                    if (typeof direction === "undefined") { direction = 0; }
                    if (typeof colorBody === "undefined") { colorBody = null; }
                    if (typeof colorWing === "undefined") { colorWing = null; }
                    if (typeof colorDriver === "undefined") { colorDriver = null; }
                    if (typeof name === "undefined") { name = null; }
                    this._name = null;
                    this._x = null;
                    this._y = null;
                    this._bodyAngle = null;
                    this._wheelAngle = null;
                    this._speed = null;
                    this._power = null;
                    this._gear = null;
                    this._direction = null;
                    this._colorBody = null;
                    this._colorWing = null;
                    this._colorDriver = null;
                    this._runningPath = null;
                    this._x = x;
                    this._y = y;
                    this._bodyAngle = bodyAngle;
                    this._wheelAngle = wheelAngle;
                    this._speed = speed;
                    this._power = power;
                    this._gear = gear;
                    this._direction = direction;
                    this._colorBody = colorBody;
                    this._colorWing = colorWing;
                    this._colorDriver = colorDriver;
                    this._name = name;
                    this._runningPath = new imjcart.logic.info.RunningPath();
                }
                Object.defineProperty(CarInfo.prototype, "runningPath", {
                    get: function () {
                        return this._runningPath;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(CarInfo.prototype, "name", {
                    get: function () {
                        return this._name;
                    },
                    set: function (value) {
                        this._name = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(CarInfo.prototype, "x", {
                    get: function () {
                        return this._x;
                    },
                    set: function (value) {
                        this._x = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(CarInfo.prototype, "y", {
                    get: function () {
                        return this._y;
                    },
                    set: function (value) {
                        this._y = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(CarInfo.prototype, "bodyAngle", {
                    get: function () {
                        return this._bodyAngle;
                    },
                    set: function (value) {
                        this._bodyAngle = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(CarInfo.prototype, "wheelAngle", {
                    get: function () {
                        return this._wheelAngle;
                    },
                    set: function (value) {
                        this._wheelAngle = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(CarInfo.prototype, "speed", {
                    get: function () {
                        return this._speed;
                    },
                    set: function (value) {
                        this._speed = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(CarInfo.prototype, "power", {
                    get: function () {
                        return this._power;
                    },
                    set: function (value) {
                        this._power = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(CarInfo.prototype, "gear", {
                    get: function () {
                        return this._gear;
                    },
                    set: function (value) {
                        this._gear = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(CarInfo.prototype, "direction", {
                    get: function () {
                        return this._direction;
                    },
                    set: function (value) {
                        this._direction = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(CarInfo.prototype, "colorBody", {
                    get: function () {
                        return this._colorBody;
                    },
                    set: function (value) {
                        this._colorBody = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(CarInfo.prototype, "colorWing", {
                    get: function () {
                        return this._colorWing;
                    },
                    set: function (value) {
                        this._colorWing = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(CarInfo.prototype, "colorDriver", {
                    get: function () {
                        return this._colorDriver;
                    },
                    set: function (value) {
                        this._colorDriver = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                return CarInfo;
            })();
            info.CarInfo = CarInfo;
        })(logic.info || (logic.info = {}));
        var info = logic.info;
    })(imjcart.logic || (imjcart.logic = {}));
    var logic = imjcart.logic;
})(imjcart || (imjcart = {}));

/// <reference path="../../../lib/jquery.d.ts"/>
/// <reference path="../../../lib/lib.ts"/>
var imjcart;
(function (imjcart) {
    (function (logic) {
        (function (info) {
            var LapTimeInfo = (function () {
                function LapTimeInfo(id, time, rank, length, name, comment, colorBody, colorWing, colorDriver, runningPath) {
                    if (typeof rank === "undefined") { rank = null; }
                    if (typeof length === "undefined") { length = null; }
                    if (typeof name === "undefined") { name = "No Name"; }
                    if (typeof comment === "undefined") { comment = null; }
                    if (typeof colorBody === "undefined") { colorBody = null; }
                    if (typeof colorWing === "undefined") { colorWing = null; }
                    if (typeof colorDriver === "undefined") { colorDriver = null; }
                    if (typeof runningPath === "undefined") { runningPath = []; }
                    this._id = null;
                    this._time = null;
                    this._rank = null;
                    this._length = null;
                    this._name = null;
                    this._comment = null;
                    this._colorBody = null;
                    this._colorWing = null;
                    this._colorDriver = null;
                    this._runningPath = null;
                    this._id = id;
                    this._time = time;
                    this._rank = rank;
                    this._length = length;
                    this._name = name;
                    this._comment = comment;
                    this._colorBody = colorBody;
                    this._colorWing = colorWing;
                    this._colorDriver = colorDriver;
                    this._runningPath = new imjcart.logic.info.RunningPath(0, runningPath);
                }
                Object.defineProperty(LapTimeInfo.prototype, "id", {
                    get: function () {
                        return this._id;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(LapTimeInfo.prototype, "time", {
                    get: function () {
                        return this._time;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(LapTimeInfo.prototype, "rank", {
                    get: function () {
                        return this._rank;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(LapTimeInfo.prototype, "length", {
                    get: function () {
                        return this._length;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(LapTimeInfo.prototype, "name", {
                    get: function () {
                        return this._name;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(LapTimeInfo.prototype, "comment", {
                    get: function () {
                        return this._comment;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(LapTimeInfo.prototype, "colorBody", {
                    get: function () {
                        return this._colorBody;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(LapTimeInfo.prototype, "colorWing", {
                    get: function () {
                        return this._colorWing;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(LapTimeInfo.prototype, "colorDriver", {
                    get: function () {
                        return this._colorDriver;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(LapTimeInfo.prototype, "runningPath", {
                    get: function () {
                        return this._runningPath;
                    },
                    enumerable: true,
                    configurable: true
                });
                return LapTimeInfo;
            })();
            info.LapTimeInfo = LapTimeInfo;
        })(logic.info || (logic.info = {}));
        var info = logic.info;
    })(imjcart.logic || (imjcart.logic = {}));
    var logic = imjcart.logic;
})(imjcart || (imjcart = {}));

/// <reference path="../../../lib/jquery.d.ts"/>
/// <reference path="../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../lib/three.d.ts"/>
/// <reference path="../../../lib/lib.ts"/>
var imjcart;
(function (imjcart) {
    (function (logic) {
        (function (info) {
            var OtherCarInfo = (function () {
                function OtherCarInfo(id, x, y, bodyAngle, wheelAngle, speed, colorBody, colorWing, colorDriver, name) {
                    if (typeof id === "undefined") { id = null; }
                    if (typeof x === "undefined") { x = 0; }
                    if (typeof y === "undefined") { y = 0; }
                    if (typeof bodyAngle === "undefined") { bodyAngle = 0; }
                    if (typeof wheelAngle === "undefined") { wheelAngle = 0; }
                    if (typeof speed === "undefined") { speed = 0; }
                    if (typeof colorBody === "undefined") { colorBody = null; }
                    if (typeof colorWing === "undefined") { colorWing = null; }
                    if (typeof colorDriver === "undefined") { colorDriver = null; }
                    if (typeof name === "undefined") { name = null; }
                    this._id = null;
                    this._name = null;
                    this._x = null;
                    this._y = null;
                    this._bodyAngle = null;
                    this._wheelAngle = null;
                    this._speed = null;
                    this._colorBody = null;
                    this._colorWing = null;
                    this._colorDriver = null;
                    this._id = id;
                    this._x = x;
                    this._y = y;
                    this._bodyAngle = bodyAngle;
                    this._wheelAngle = wheelAngle;
                    this._speed = speed;
                    this._colorBody = colorBody;
                    this._colorWing = colorWing;
                    this._colorDriver = colorDriver;
                    this._name = name;
                }

                Object.defineProperty(OtherCarInfo.prototype, "id", {
                    get: function () {
                        return this._id;
                    },
                    set: function (value) {
                        this._id = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(OtherCarInfo.prototype, "name", {
                    get: function () {
                        return this._name;
                    },
                    set: function (value) {
                        this._name = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(OtherCarInfo.prototype, "x", {
                    get: function () {
                        return this._x;
                    },
                    set: function (value) {
                        this._x = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(OtherCarInfo.prototype, "y", {
                    get: function () {
                        return this._y;
                    },
                    set: function (value) {
                        this._y = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(OtherCarInfo.prototype, "bodyAngle", {
                    get: function () {
                        return this._bodyAngle;
                    },
                    set: function (value) {
                        this._bodyAngle = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(OtherCarInfo.prototype, "wheelAngle", {
                    get: function () {
                        return this._wheelAngle;
                    },
                    set: function (value) {
                        this._wheelAngle = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(OtherCarInfo.prototype, "speed", {
                    get: function () {
                        return this._speed;
                    },
                    set: function (value) {
                        this._speed = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(OtherCarInfo.prototype, "colorBody", {
                    get: function () {
                        return this._colorBody;
                    },
                    set: function (value) {
                        this._colorBody = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(OtherCarInfo.prototype, "colorWing", {
                    get: function () {
                        return this._colorWing;
                    },
                    set: function (value) {
                        this._colorWing = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(OtherCarInfo.prototype, "colorDriver", {
                    get: function () {
                        return this._colorDriver;
                    },
                    set: function (value) {
                        this._colorDriver = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                return OtherCarInfo;
            })();
            info.OtherCarInfo = OtherCarInfo;
        })(logic.info || (logic.info = {}));
        var info = logic.info;
    })(imjcart.logic || (imjcart.logic = {}));
    var logic = imjcart.logic;
})(imjcart || (imjcart = {}));

/// <reference path="../../../lib/jquery.d.ts"/>
/// <reference path="../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../lib/three.d.ts"/>
/// <reference path="../../../lib/lib.ts"/>
var imjcart;
(function (imjcart) {
    (function (logic) {
        (function (info) {
            var RunningPath = (function () {
                function RunningPath(index, collection) {
                    if (typeof index === "undefined") { index = 0; }
                    if (typeof collection === "undefined") { collection = []; }
                    this._collection = [];
                    this._currentIndex = 0;
                    this._currentIndex = index;
                    this._collection = collection;
                }
                RunningPath.prototype.pushPath = function (x, y, bodyAngle) {
                    this._collection.push({
                        x: Math.round(x * 1000) / 1000,
                        y: Math.round(y * 1000) / 1000,
                        bodyAngle: Math.round(bodyAngle * 1000) / 1000
                    });
                };

                RunningPath.prototype.clearPath = function () {
                    this._collection = [];
                };

                Object.defineProperty(RunningPath.prototype, "currentPath", {
                    get: function () {
                        var path = this._collection[this._currentIndex];
                        if (this._collection.length <= this._currentIndex) {
                            this._currentIndex = 0;
                        } else {
                            this._currentIndex += 1;
                        }
                        return {
                            x: path.x,
                            y: path.y,
                            bodyAngle: path.bodyAngle
                        };
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(RunningPath.prototype, "currentIndex", {
                    set: function (index) {
                        this._currentIndex = index;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(RunningPath.prototype, "collection", {
                    get: function () {
                        return this._collection;
                    },
                    enumerable: true,
                    configurable: true
                });
                return RunningPath;
            })();
            info.RunningPath = RunningPath;
        })(logic.info || (logic.info = {}));
        var info = logic.info;
    })(imjcart.logic || (imjcart.logic = {}));
    var logic = imjcart.logic;
})(imjcart || (imjcart = {}));

/// <reference path="../../../lib/jquery.d.ts"/>
/// <reference path="../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../lib/three.d.ts"/>
/// <reference path="../../../lib/lib.ts"/>
/// <reference path="../../../imjcart/logic/map/event/MapEvent.ts"/>
/// <reference path="../../../imjcart/logic/map/value/MapConst.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var imjcart;
(function (imjcart) {
    (function (logic) {
        (function (map) {
            var Map = (function (_super) {
                __extends(Map, _super);
                function Map() {
                    _super.call(this);
                    this._tagX = null;
                    this._tagY = null;
                    this._key = null;
                    this._pastLapPoint = null;
                    this._pastLapPointArr = [];
                }
                Map.prototype.update = function (x, y) {
                    var tagX = Math.floor(x * imjcart.logic.map.value.MapConst.MAP_SCALE / map.value.MapConst.MAP_BLOCK_SIZE);
                    var tagY = Math.floor(y * imjcart.logic.map.value.MapConst.MAP_SCALE / map.value.MapConst.MAP_BLOCK_SIZE);
                    if (tagX == this._tagX && tagY == this._tagY)
                        return;
                    this._tagX = tagX;
                    this._tagY = tagY;
                    var key = map.value.MapConst.MAP[tagY][tagX];
                    if (key == this._key)
                        return;
                    this._key = key;

                    switch (this._key) {
                        case map.value.MapConst.MAP_KEY_LAP_START_POINT:
                            // ラップポイント通過時
                            this._passLapPoint(this._key);
                            break;
                        case map.value.MapConst.MAP_KEY_LAP_MEDIAN_CENTER_01:
                            // ラップポイント通過時
                            this._passLapPoint(this._key);
                            break;
                        case map.value.MapConst.MAP_KEY_LAP_MEDIAN_CENTER_02:
                            // ラップポイント通過時
                            this._passLapPoint(this._key);
                            break;
                    }

                    switch (this._key) {
                        case map.value.MapConst.MAP_KEY_GRASS:
                            // 芝に入る
                            this._inGrass();
                            break;
                        default:
                            // 芝から出る
                            this._outGrass();
                            break;
                    }
                };

                // ラップポイント通過時
                Map.prototype._passLapPoint = function (key) {
                    if (this._pastLapPoint == null) {
                        if (key == map.value.MapConst.MAP_KEY_LAP_START_POINT) {
                            this._pastLapPoint = key;
                            this._pastLapPointArr = [map.value.MapConst.MAP_KEY_LAP_START_POINT];

                            // ラップ開始
                            this._startLap();
                        }
                    } else {
                        // ポイント通過
                        if (key == map.value.MapConst.MAP_KEY_LAP_MEDIAN_CENTER_01) {
                            this._pastLapPoint = key;
                            this._pastLapPointArr.push(key);
                        } else if (key == map.value.MapConst.MAP_KEY_LAP_MEDIAN_CENTER_02) {
                            this._pastLapPoint = key;
                            this._pastLapPointArr.push(key);
                        } else if (key == map.value.MapConst.MAP_KEY_LAP_START_POINT) {
                            this._pastLapPoint = key;
                            if (this._pastLapPointArr[0] == map.value.MapConst.MAP_KEY_LAP_START_POINT && this._pastLapPointArr[1] == map.value.MapConst.MAP_KEY_LAP_MEDIAN_CENTER_01 && this._pastLapPointArr[2] == map.value.MapConst.MAP_KEY_LAP_MEDIAN_CENTER_02) {
                                // ラップ記録
                                this._recordLap();

                                // ラップ開始
                                this._startLap();
                            }
                            this._pastLapPointArr = [map.value.MapConst.MAP_KEY_LAP_START_POINT];
                        }
                    }
                };

                // ラップ開始
                Map.prototype._startLap = function () {
                    // ラップ開始イベント
                    this.dispatchEvent(imjcart.logic.map.event.MapEvent.START_LAP_EVENT);
                };

                // ラップ記録
                Map.prototype._recordLap = function () {
                    // ラップ記録イベント
                    this.dispatchEvent(imjcart.logic.map.event.MapEvent.RECORD_LAPTIME_EVENT);
                };

                // 芝に入る
                Map.prototype._inGrass = function () {
                    // 芝に入るイベント
                    this.dispatchEvent(imjcart.logic.map.event.MapEvent.IN_GRASS_EVENT);
                };

                // 芝から出る
                Map.prototype._outGrass = function () {
                    // 芝から出るイベント
                    this.dispatchEvent(imjcart.logic.map.event.MapEvent.OUT_GRASS_EVENT);
                };
                return Map;
            })(lib.event.EventDispacher);
            map.Map = Map;
        })(logic.map || (logic.map = {}));
        var map = logic.map;
    })(imjcart.logic || (imjcart.logic = {}));
    var logic = imjcart.logic;
})(imjcart || (imjcart = {}));

/// <reference path="../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../lib/three.d.ts"/>
/// <reference path="../../../../lib/lib.ts"/>
var imjcart;
(function (imjcart) {
    (function (logic) {
        (function (map) {
            (function (event) {
                var MapEvent = (function () {
                    function MapEvent() {
                    }
                    MapEvent.START_LAP_EVENT = "start_lap_event";
                    MapEvent.RECORD_LAPTIME_EVENT = "record_laptime_event";
                    MapEvent.IN_GRASS_EVENT = "into_grass_event";
                    MapEvent.OUT_GRASS_EVENT = "out_grass_event";
                    return MapEvent;
                })();
                event.MapEvent = MapEvent;
            })(map.event || (map.event = {}));
            var event = map.event;
        })(logic.map || (logic.map = {}));
        var map = logic.map;
    })(imjcart.logic || (imjcart.logic = {}));
    var logic = imjcart.logic;
})(imjcart || (imjcart = {}));

/// <reference path="../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../lib/three.d.ts"/>
/// <reference path="../../../../lib/lib.ts"/>
var imjcart;
(function (imjcart) {
    (function (logic) {
        (function (map) {
            (function (value) {
                var MapConst = (function () {
                    function MapConst() {
                    }
                    MapConst.MAP = [
                        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 2, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 2, 4, 4, 4, 4, 4, 5, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 4, 4, 4, 4, 4, 10, 10, 10, 10, 2, 2, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 10, 10, 2, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 4, 4, 4, 4, 4, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 10, 10, 2, 4, 4, 4, 5, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 10, 2, 4, 4, 4, 4, 4, 4, 5, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 4, 4, 4, 4, 4, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 10, 2, 4, 4, 4, 4, 5, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 5, 4, 4, 4, 5, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 5, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 2, 3, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 3, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 2, 3, 3, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 3, 3, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 2, 4, 2, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 2, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 2, 3, 3, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 3, 3, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 2, 3, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 3, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 5, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 5, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 10, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 10, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 10, 10, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 10, 10, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 5, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 10, 10, 10, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 10, 10, 10, 10, 4, 4, 4, 4, 4, 4, 0, 0, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 10, 10, 10, 10, 10, 4, 5, 4, 3, 4, 4, 4, 4, 3, 4, 4, 0, 0, 0, 0, 0, 0, 0, 4, 5, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 10, 10, 10, 10, 4, 4, 4, 4, 4, 4, 0, 0, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 5, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 5, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 10, 10, 10, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 10, 10, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 10, 10, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 10, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 5, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 10, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 5, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 5, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 5, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 5, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 5, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 5, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 5, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 5, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 5, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 3, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 3, 4, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 4, 4, 4, 3, 3, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 3, 3, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 3, 3, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 5, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 5, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 4, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 3, 3, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 3, 3, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 4, 4, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 4, 4, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 4, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 4, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 4, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 2, 10, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 4, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 2, 10, 10, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 4, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 2, 10, 10, 10, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 2, 10, 10, 10, 10, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 2, 10, 10, 10, 10, 10, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 2, 10, 10, 10, 10, 10, 10, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 2, 10, 10, 10, 10, 10, 10, 10, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 2, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 2, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 4, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 4, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 4, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 4, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 4, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 10, 10, 10, 10, 10, 10, 10, 10, 4, 4, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 4, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 4, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 4, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 5, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 2, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 5, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 3, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 3, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 5, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 1],
                        [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 1],
                        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];

                    MapConst.MAP_SCALE = 100;
                    MapConst.MAP_BLOCK_SIZE = 10;

                    MapConst.MAP_KEY_NONE = 0;
                    MapConst.MAP_KEY_WALL = 1;
                    MapConst.MAP_KEY_BLOCK = 2;
                    MapConst.MAP_KEY_TIRE = 3;
                    MapConst.MAP_KEY_GRASS = 4;
                    MapConst.MAP_KEY_TREE = 5;
                    MapConst.MAP_KEY_CAR_START_POSITION = 6;
                    MapConst.MAP_KEY_LAP_MEDIAN_CENTER_02 = 7;
                    MapConst.MAP_KEY_LAP_MEDIAN_CENTER_01 = 8;
                    MapConst.MAP_KEY_LAP_START_POINT = 9;
                    MapConst.MAP_KEY_SAND = 10;
                    MapConst.MAP_WIDTH = MapConst.MAP_BLOCK_SIZE * MapConst.MAP[0].length;
                    MapConst.MAP_HEIGHT = MapConst.MAP_BLOCK_SIZE * MapConst.MAP.length;
                    MapConst.MAP_CENTER_X = MapConst.MAP_BLOCK_SIZE * MapConst.MAP[0].length / 2;
                    MapConst.MAP_CENTER_Z = MapConst.MAP_BLOCK_SIZE * MapConst.MAP.length / 2;
                    return MapConst;
                })();
                value.MapConst = MapConst;
            })(map.value || (map.value = {}));
            var value = map.value;
        })(logic.map || (logic.map = {}));
        var map = logic.map;
    })(imjcart.logic || (imjcart.logic = {}));
    var logic = imjcart.logic;
})(imjcart || (imjcart = {}));

/// <reference path="../../../lib/jquery.d.ts"/>
/// <reference path="../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../lib/three.d.ts"/>
/// <reference path="../../../lib/lib.ts"/>
/// <reference path="../../../imjcart/logic/map/value/MapConst.ts"/>
var imjcart;
(function (imjcart) {
    (function (logic) {
        (function (physics) {
            var Box = (function () {
                function Box(context, world, x, y, width, height, options) {
                    this._context = null;
                    this._world = null;
                    this._x = null;
                    this._y = null;
                    this._width = null;
                    this._height = null;
                    this._options = null;
                    this._body = null;
                    this._bodyDef = null;
                    this._fixtureDef = null;
                    this._context = context;
                    this._world = world;
                    this._x = x;
                    this._y = y;
                    this._width = width;
                    this._height = height;
                    this._options = options;

                    //
                    this._options = $.extend(true, {
                        density: 1,
                        friction: 0,
                        restitution: 0.2,
                        linearDamping: 0,
                        angularDamping: 0,
                        gravityScale: 1,
                        type: Box2D.Dynamics.b2Body.b2_dynamicBody
                    }, this._options);

                    //
                    this._fixtureDef = new Box2D.Dynamics.b2FixtureDef();
                    this._fixtureDef.density = this._options.density;
                    this._fixtureDef.friction = this._options.friction;
                    this._fixtureDef.restitution = this._options.restitution;
                    this._fixtureDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
                    this._fixtureDef.shape.SetAsBox(this._width / 2 / imjcart.logic.map.value.MapConst.MAP_SCALE, this._height / 2 / imjcart.logic.map.value.MapConst.MAP_SCALE);

                    //
                    this._bodyDef = new Box2D.Dynamics.b2BodyDef();
                    this._bodyDef.position.Set(this._x / imjcart.logic.map.value.MapConst.MAP_SCALE, this._y / imjcart.logic.map.value.MapConst.MAP_SCALE);
                    this._bodyDef.linearDamping = this._options.linearDamping;
                    this._bodyDef.angularDamping = this._options.angularDamping;
                    this._bodyDef.type = this._options.type;

                    //
                    this._body = this._world.CreateBody(this._bodyDef);
                    this._body.CreateFixture(this._fixtureDef);
                }
                Object.defineProperty(Box.prototype, "body", {
                    get: function () {
                        return this._body;
                    },
                    enumerable: true,
                    configurable: true
                });

                Box.prototype.destroy = function () {
                    this._world.DestroyBody(this._body);
                };
                return Box;
            })();
            physics.Box = Box;
        })(logic.physics || (logic.physics = {}));
        var physics = logic.physics;
    })(imjcart.logic || (imjcart.logic = {}));
    var logic = imjcart.logic;
})(imjcart || (imjcart = {}));

/// <reference path="../../../lib/jquery.d.ts"/>
/// <reference path="../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../lib/three.d.ts"/>
/// <reference path="../../../lib/lib.ts"/>
/// <reference path="../../../imjcart/logic/physics/Box.ts"/>
/// <reference path="../../../imjcart/logic/physics/value/PhysicsConst.ts"/>
/// <reference path="../../../imjcart/logic/physics/event/PhysicsEvent.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var imjcart;
(function (imjcart) {
    (function (logic) {
        (function (physics) {
            var Car = (function (_super) {
                __extends(Car, _super);
                function Car(context, world, x, y) {
                    _super.call(this);
                    this._context = null;
                    this._world = null;
                    this._x = null;
                    this._y = null;
                    this._isOnEngine = false;
                    this._enginePower = 0;
                    this._engineDirection = 0;
                    this._gear = 0;
                    this._body = null;
                    this._frontLeftWheel = null;
                    this._frontRightWheel = null;
                    this._rearLeftWheel = null;
                    this._rearRightWheel = null;
                    this._steeringAngle = 0;
                    this._steerSpeed = 1;
                    this._frontWheels = [];
                    this._rearWheels = [];
                    this._frontWheelJoints = [];
                    this._intervalId = null;
                    this._isLimitMode = false;
                    this._limitGearVolume = null;
                    this._context = context;
                    this._world = world;
                    this._x = x;
                    this._y = y;

                    // 車体
                    var carWidth = 4;
                    var carHeight = 13;
                    var wheelWidth = 2;
                    var wheelHeight = 2;
                    this._body = new physics.Box(this._context, this._world, this._x, this._y, carWidth, carHeight, {
                        linearDamping: physics.value.PhysicsConst.CAR_LINEAR_DAMPING,
                        angularDamping: physics.value.PhysicsConst.CAR_ANGULAR_DAMPING
                    }).body;

                    // フロントホイール
                    this._frontLeftWheel = new physics.Box(this._context, this._world, this._x - carWidth / 2, this._y - carHeight / 3, wheelWidth, wheelHeight, {}).body;
                    this._frontRightWheel = new physics.Box(this._context, this._world, this._x + carWidth / 2, this._y - carHeight / 3, wheelWidth, wheelHeight, {}).body;
                    this._frontWheels.push(this._frontLeftWheel);
                    this._frontWheels.push(this._frontRightWheel);

                    // リアホイール
                    this._rearLeftWheel = new physics.Box(this._context, this._world, this._x - carWidth / 2, this._y + carHeight / 4, wheelWidth, wheelHeight, {}).body;
                    this._rearRightWheel = new physics.Box(this._context, this._world, this._x + carWidth / 2, this._y + carHeight / 4, wheelWidth, wheelHeight, {}).body;
                    this._rearWheels.push(this._rearLeftWheel);
                    this._rearWheels.push(this._rearRightWheel);

                    // フロントホイールジョイント
                    var wheel = null;
                    var jointDef = null;
                    var i = 0, max;
                    for (i = 0, max = this._frontWheels.length; i < max; i = i + 1) {
                        wheel = this._frontWheels[i];
                        jointDef = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
                        jointDef.Initialize(this._body, wheel, wheel.GetWorldCenter()); // つながれる2つの物体と，つなぐ位置（前輪の中央）を使って，定義を初期化する
                        jointDef.enableMotor = true; // 車輪を回すようにする
                        jointDef.maxMotorTorque = 100000; // トルクの設定（大きいほど坂道に強くなる）
                        jointDef.enableLimit = true; // 可動範囲設定
                        jointDef.lowerAngle = -1 * physics.value.PhysicsConst.MAX_STEER_ANGLE; // 可動範囲下限(m)
                        jointDef.upperAngle = physics.value.PhysicsConst.MAX_STEER_ANGLE; // 可動範囲上限(m)
                        this._frontWheelJoints.push(this._world.CreateJoint(jointDef));
                    }

                    for (i = 0, max = this._rearWheels.length; i < max; i = i + 1) {
                        wheel = this._rearWheels[i];
                        jointDef = new Box2D.Dynamics.Joints.b2PrismaticJointDef();
                        jointDef.Initialize(this._body, wheel, wheel.GetWorldCenter(), new Box2D.Common.Math.b2Vec2(1, 0));
                        jointDef.enableLimit = true; // 可動範囲設定
                        jointDef.lowerTranslation = 0; // 可動範囲下限(m)
                        jointDef.upperTranslation = 0; // 可動範囲上限(m)
                        this._world.CreateJoint(jointDef);
                    }
                }
                Car.prototype.update = function () {
                    // 力
                    var i = 0, max;
                    for (i = 0, max = this._frontWheels.length; i < max; i = i + 1) {
                        var wheel = this._frontWheels[i];
                        var direction = wheel.GetTransform().R.col2.Copy();
                        direction.Multiply(this._enginePower);
                        wheel.ApplyForce(direction, wheel.GetPosition());
                    }

                    for (i = 0, max = this._frontWheelJoints.length; i < max; i = i + 1) {
                        var wheelJoint = this._frontWheelJoints[i];
                        var angleDiff = this._steeringAngle - wheelJoint.GetJointAngle();
                        wheelJoint.SetMotorSpeed(angleDiff * this._steerSpeed);
                    }

                    // 車の状態変更イベント
                    var position = this._body.GetPosition();
                    var velocity = this._body.GetLinearVelocity();
                    var speedX = Math.abs(velocity.x);
                    var speedY = Math.abs(velocity.y);
                    var speed = 0;
                    if (speedX < speedY) {
                        speed = speedY;
                    } else {
                        speed = speedX;
                    }
                    this.dispatchEvent(imjcart.logic.physics.event.PhysicsEvent.CHANGE_CAR_CONDITION_EVENT, {
                        x: position.x,
                        y: position.y,
                        bodyAngle: this._body.GetAngle(),
                        wheelAngle: this._frontWheelJoints[0].GetJointAngle(),
                        //speed: Math.abs(this._body.GetLinearVelocity().x) + Math.abs(this._body.GetLinearVelocity().y),
                        speed: speed,
                        power: this._enginePower,
                        gear: this._gear,
                        direction: this._engineDirection
                    });
                };

                Car.prototype.startEngine = function (value) {
                    var _this = this;
                    if (this._engineDirection != value)
                        this._gear = 0; // 前進、後退が変わったらギアを初期化
                    this._engineDirection = value;
                    if (!this._isOnEngine) {
                        this._isOnEngine = true;
                        if (this._intervalId)
                            clearInterval(this._intervalId);
                        this._intervalId = setInterval(function () {
                            _this._shiftUp();
                        }, imjcart.logic.physics.value.PhysicsConst.CAR_SHIFTUP_SPEED);
                        this._shiftUp();
                    }
                };

                Car.prototype.stopEngine = function () {
                    var _this = this;
                    if (this._isOnEngine) {
                        this._isOnEngine = false;
                        if (this._intervalId)
                            clearInterval(this._intervalId);
                        this._intervalId = setInterval(function () {
                            _this._shiftDown();
                        }, physics.value.PhysicsConst.CAR_SHIFTDOWN_SPEED);
                        this._shiftDown();
                    }
                };

                Car.prototype.setSteeringAngle = function (value) {
                    this._steeringAngle = -value;
                    this._steerSpeed = 1;
                };

                Car.prototype.clearSteeringAngle = function () {
                    this._steeringAngle = 0;
                    this._steerSpeed = 8;
                };

                Car.prototype._shiftUp = function () {
                    if (this._isLimitMode) {
                        this._gear += 1;
                        if (this._limitGearVolume <= this._gear) {
                            this._gear = this._limitGearVolume;
                        }
                    } else {
                        this._gear += 1;
                        if (1 <= this._engineDirection) {
                            if (physics.value.PhysicsConst.CAR_GEAR_MAX <= this._gear) {
                                this._gear = physics.value.PhysicsConst.CAR_GEAR_MAX;
                            }
                        } else {
                            if (physics.value.PhysicsConst.CAR_GEAR_BACK_MAX <= this._gear) {
                                this._gear = physics.value.PhysicsConst.CAR_GEAR_BACK_MAX;
                            }
                        }
                    }
                    if (0 < this._engineDirection) {
                        this._enginePower = -this._gear * physics.value.PhysicsConst.FORWARD_ENGINE_SPEED * this._engineDirection;
                    } else {
                        this._enginePower = -this._gear * physics.value.PhysicsConst.BACK_ENGINE_SPEED * this._engineDirection;
                    }
                };

                Car.prototype._shiftDown = function () {
                    var gear = this._gear - 1;
                    if (0 <= gear) {
                        this._gear = gear;
                        //this._enginePower = 0;
                    }
                    if (0 < this._engineDirection) {
                        this._enginePower = -this._gear * physics.value.PhysicsConst.FORWARD_ENGINE_SPEED * this._engineDirection;
                    } else {
                        this._enginePower = -this._gear * physics.value.PhysicsConst.BACK_ENGINE_SPEED * this._engineDirection;
                    }
                };

                // スピードに制限をかける
                Car.prototype.setLimitSpeed = function () {
                    this._isLimitMode = true;
                    this._limitGearVolume = Math.floor(this._gear * 0.6);
                    if (this._limitGearVolume <= 100)
                        this._limitGearVolume = 100;
                    this._gear = this._limitGearVolume;
                    this._shiftUp();
                };

                // スピードの制限をはずす
                Car.prototype.clearLimitSpeed = function () {
                    this._isLimitMode = false;
                    this._shiftUp();
                };

                // 削除
                Car.prototype.remove = function () {
                    this._world.DestroyBody(this._body);
                    this._world.DestroyBody(this._frontLeftWheel);
                    this._world.DestroyBody(this._frontRightWheel);
                    this._world.DestroyBody(this._rearLeftWheel);
                    this._world.DestroyBody(this._rearRightWheel);
                };
                return Car;
            })(lib.event.EventDispacher);
            physics.Car = Car;
        })(logic.physics || (logic.physics = {}));
        var physics = logic.physics;
    })(imjcart.logic || (imjcart.logic = {}));
    var logic = imjcart.logic;
})(imjcart || (imjcart = {}));

/// <reference path="../../../lib/jquery.d.ts"/>
/// <reference path="../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../lib/three.d.ts"/>
/// <reference path="../../../lib/lib.ts"/>
/// <reference path="../../../imjcart/logic/map/value/MapConst.ts"/>
var imjcart;
(function (imjcart) {
    (function (logic) {
        (function (physics) {
            var Circle = (function () {
                function Circle(context, world, x, y, radius, options) {
                    this._context = null;
                    this._world = null;
                    this._x = null;
                    this._y = null;
                    this._radius = null;
                    this._options = null;
                    this._body = null;
                    this._bodyDef = null;
                    this._fixtureDef = null;
                    this._context = context;
                    this._world = world;
                    this._x = x;
                    this._y = y;
                    this._radius = radius;
                    this._options = options;

                    //
                    this._options = $.extend(true, {
                        density: 1,
                        friction: 0,
                        restitution: 0.2,
                        linearDamping: 0,
                        angularDamping: 0,
                        gravityScale: 1,
                        type: Box2D.Dynamics.b2Body.b2_dynamicBody
                    }, this._options);

                    //
                    this._fixtureDef = new Box2D.Dynamics.b2FixtureDef();
                    this._fixtureDef.density = this._options.density;
                    this._fixtureDef.friction = this._options.friction;
                    this._fixtureDef.restitution = this._options.restitution;
                    this._fixtureDef.shape = new Box2D.Collision.Shapes.b2CircleShape();
                    this._fixtureDef.shape.SetRadius(this._radius / 2 / imjcart.logic.map.value.MapConst.MAP_SCALE);

                    //
                    this._bodyDef = new Box2D.Dynamics.b2BodyDef();
                    this._bodyDef.position.Set(this._x / imjcart.logic.map.value.MapConst.MAP_SCALE, this._y / imjcart.logic.map.value.MapConst.MAP_SCALE);
                    this._bodyDef.linearDamping = this._options.linearDamping;
                    this._bodyDef.angularDamping = this._options.angularDamping;
                    this._bodyDef.type = this._options.type;

                    //
                    this._body = this._world.CreateBody(this._bodyDef);
                    this._body.CreateFixture(this._fixtureDef);
                }
                Object.defineProperty(Circle.prototype, "body", {
                    get: function () {
                        return this._body;
                    },
                    enumerable: true,
                    configurable: true
                });

                Circle.prototype.destroy = function () {
                    this._world.DestroyBody(this._body);
                };
                return Circle;
            })();
            physics.Circle = Circle;
        })(logic.physics || (logic.physics = {}));
        var physics = logic.physics;
    })(imjcart.logic || (imjcart.logic = {}));
    var logic = imjcart.logic;
})(imjcart || (imjcart = {}));

/// <reference path="../../../lib/jquery.d.ts"/>
/// <reference path="../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../lib/three.d.ts"/>
/// <reference path="../../../lib/lib.ts"/>
/// <reference path="../../../imjcart/logic/map/value/MapConst.ts"/>
/// <reference path="../../../imjcart/logic/physics/Box.ts"/>
/// <reference path="../../../imjcart/logic/physics/Circle.ts"/>
var imjcart;
(function (imjcart) {
    (function (logic) {
        (function (physics) {
            var Obstacles = (function () {
                function Obstacles(context, world) {
                    this._context = null;
                    this._world = null;
                    this._boxes = [];
                    this._context = context;
                    this._world = world;

                    //
                    var debugDraw = new Box2D.Dynamics.b2DebugDraw();
                    debugDraw.SetSprite(this._context);
                    debugDraw.SetDrawScale(imjcart.logic.map.value.MapConst.MAP_SCALE);
                    debugDraw.SetFillAlpha(0.5);
                    debugDraw.SetLineThickness(1.0);
                    debugDraw.SetFlags(Box2D.Dynamics.b2DebugDraw.e_shapeBit | Box2D.Dynamics.b2DebugDraw.e_jointBit);
                    this._world.SetDebugDraw(debugDraw);

                    // MAP情報に沿って壁を設定
                    var i = 0, max;
                    for (i = 0, max = imjcart.logic.map.value.MapConst.MAP.length; i < max; i = i + 1) {
                        var j = 0, max2;
                        for (j = 0, max2 = imjcart.logic.map.value.MapConst.MAP[i].length; j < max2; j = j + 1) {
                            if (imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_WALL || imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_BLOCK) {
                                new physics.Box(this._context, this._world, imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * j + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2), imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * i + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2), imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE, imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE, {
                                    type: Box2D.Dynamics.b2Body.b2_staticBody,
                                    restitution: 0.5
                                });
                            } else if (imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_TIRE) {
                                var radius = imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 4;
                                var tagX = 0;
                                var tagY = 0;
                                var k = 0, max3;
                                for (k = 1, max3 = 4; k <= max3; k = k + 1) {
                                    new physics.Circle(this._context, this._world, imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * j + radius + tagX, imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * i + radius + tagY, imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2, {
                                        type: Box2D.Dynamics.b2Body.b2_staticBody,
                                        restitution: 0.5
                                    });

                                    //
                                    if (k % 2 == 0) {
                                        tagX = 0;
                                        tagY += radius * 2;
                                    } else {
                                        tagX += radius * 2;
                                    }
                                }
                            } else if (imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_TREE) {
                                var radius = imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 10;
                                new physics.Circle(this._context, this._world, imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * j + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2), imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * i + (imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE / 2), radius, {
                                    type: Box2D.Dynamics.b2Body.b2_staticBody,
                                    restitution: 0.5
                                });
                            }
                        }
                    }
                }
                Obstacles.prototype.getBoxPosition = function (index) {
                    return this._boxes[index].GetPosition();
                };

                Obstacles.prototype.getBoxAngle = function (index) {
                    return this._boxes[index].GetAngle();
                };
                return Obstacles;
            })();
            physics.Obstacles = Obstacles;
        })(logic.physics || (logic.physics = {}));
        var physics = logic.physics;
    })(imjcart.logic || (imjcart.logic = {}));
    var logic = imjcart.logic;
})(imjcart || (imjcart = {}));

/// <reference path="../../../lib/jquery.d.ts"/>
/// <reference path="../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../lib/three.d.ts"/>
/// <reference path="../../../lib/lib.ts"/>
/// <reference path="../../../imjcart/logic/value/Const.ts"/>
/// <reference path="../../../imjcart/logic/physics/Car.ts"/>
/// <reference path="../../../imjcart/logic/physics/Obstacles.ts"/>
/// <reference path="../../../imjcart/logic/physics/value/PhysicsConst.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var imjcart;
(function (imjcart) {
    (function (logic) {
        (function (physics) {
            var Physics = (function (_super) {
                __extends(Physics, _super);
                function Physics($target) {
                    _super.call(this);
                    this._$target = null;
                    this._context = null;
                    this._world = null;
                    this._obstacles = null;
                    this._car = null;
                    this._isPause = false;
                    this._$target = $target;

                    // コンテキスト
                    this._context = this._$target.get(0).getContext("2d");

                    // 世界
                    this._world = new Box2D.Dynamics.b2World(new Box2D.Common.Math.b2Vec2(0, 0), true);

                    // 障害物
                    this._obstacles = new physics.Obstacles(this._context, this._world);

                    // 車生成
                    this.createCar();

                    // デバッグモード
                    if (imjcart.logic.value.Const.IS_PHYSICS_DEBUG_MODE) {
                        this._$target.css({
                            display: "block"
                        });
                    }
                }
                // 車生成
                Physics.prototype.createCar = function () {
                    var _this = this;
                    // 車
                    var x = 740;
                    var y = 400;
                    var i, j, max, max2;
                    for (i = 0, max = imjcart.logic.map.value.MapConst.MAP.length; i < max; i = i + 1) {
                        for (j = 0, max2 = imjcart.logic.map.value.MapConst.MAP[i].length; j < max2; j = j + 1) {
                            if (imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_CAR_START_POSITION) {
                                y = imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * i;
                                x = imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE * j;
                                break;
                            }
                        }
                    }
                    this._car = new physics.Car(this._context, this._world, x, y);

                    //
                    // ---------- イベント ---------- //
                    //
                    // 車の状態変更イベント
                    this._car.addEventListener(physics.event.PhysicsEvent.CHANGE_CAR_CONDITION_EVENT, function (evt) {
                        _this.dispatchEvent(imjcart.logic.physics.event.PhysicsEvent.CHANGE_CAR_CONDITION_EVENT, {
                            x: evt.x,
                            y: evt.y,
                            bodyAngle: evt.bodyAngle,
                            wheelAngle: evt.wheelAngle,
                            speed: evt.speed,
                            power: evt.power,
                            gear: evt.gear,
                            direction: evt.direction
                        });
                    });
                };

                Physics.prototype.update = function () {
                    if (this._isPause)
                        return;
                    this._car.update();
                    this._world.Step(1 / imjcart.logic.value.Const.FPS, 8, 3);
                    this._world.ClearForces();
                    if (imjcart.logic.value.Const.IS_PHYSICS_DEBUG_MODE) {
                        this._world.DrawDebugData();
                    }
                };

                Physics.prototype.startEngine = function (value) {
                    if (this._isPause)
                        return;
                    if (this._car)
                        this._car.startEngine(value);
                };

                Physics.prototype.stopEngine = function () {
                    if (this._isPause)
                        return;
                    if (this._car)
                        this._car.stopEngine();
                };

                Physics.prototype.setSteeringAngle = function (value) {
                    if (this._isPause)
                        return;
                    if (this._car)
                        this._car.setSteeringAngle(value);
                };

                Physics.prototype.clearSteeringAngle = function () {
                    if (this._isPause)
                        return;
                    if (this._car)
                        this._car.clearSteeringAngle();
                };

                // スピードに制限をかける
                Physics.prototype.setLimitSpeed = function () {
                    // スピードに制限をかける
                    if (this._car)
                        this._car.setLimitSpeed();
                };

                // スピードの制限をはずす
                Physics.prototype.clearLimitSpeed = function () {
                    // スピードの制限をはずす
                    if (this._car)
                        this._car.clearLimitSpeed();
                };

                // 一時停止
                Physics.prototype.pause = function () {
                    this._isPause = true;
                };

                // 再開
                Physics.prototype.resume = function () {
                    this._isPause = false;
                };

                // リトライ
                Physics.prototype.retry = function () {
                    this._car.remove();
                    this._car = null;

                    // 車生成
                    this.createCar();
                };
                return Physics;
            })(lib.event.EventDispacher);
            physics.Physics = Physics;
        })(logic.physics || (logic.physics = {}));
        var physics = logic.physics;
    })(imjcart.logic || (imjcart.logic = {}));
    var logic = imjcart.logic;
})(imjcart || (imjcart = {}));

/// <reference path="../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../lib/three.d.ts"/>
/// <reference path="../../../../lib/lib.ts"/>
var imjcart;
(function (imjcart) {
    (function (logic) {
        (function (physics) {
            (function (event) {
                var PhysicsEvent = (function () {
                    function PhysicsEvent() {
                    }
                    PhysicsEvent.CHANGE_CAR_CONDITION_EVENT = "change_car_condition_event";
                    return PhysicsEvent;
                })();
                event.PhysicsEvent = PhysicsEvent;
            })(physics.event || (physics.event = {}));
            var event = physics.event;
        })(logic.physics || (logic.physics = {}));
        var physics = logic.physics;
    })(imjcart.logic || (imjcart.logic = {}));
    var logic = imjcart.logic;
})(imjcart || (imjcart = {}));

/// <reference path="../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../lib/three.d.ts"/>
/// <reference path="../../../../lib/lib.ts"/>
var imjcart;
(function (imjcart) {
    (function (logic) {
        (function (physics) {
            (function (value) {
                var PhysicsConst = (function () {
                    function PhysicsConst() {
                    }
                    PhysicsConst.MAX_STEER_ANGLE = Math.PI / 8;

                    PhysicsConst.FORWARD_ENGINE_SPEED = 0.00001;

                    PhysicsConst.BACK_ENGINE_SPEED = 0.000005;
                    PhysicsConst.CAR_LINEAR_DAMPING = 2;

                    PhysicsConst.CAR_ANGULAR_DAMPING = 30;

                    PhysicsConst.CAR_GEAR_MAX = 1100;
                    PhysicsConst.CAR_GEAR_BACK_MAX = 200;
                    PhysicsConst.CAR_SHIFTUP_SPEED = 6;
                    PhysicsConst.CAR_SHIFTDOWN_SPEED = 2;
                    return PhysicsConst;
                })();
                value.PhysicsConst = PhysicsConst;
            })(physics.value || (physics.value = {}));
            var value = physics.value;
        })(logic.physics || (logic.physics = {}));
        var physics = logic.physics;
    })(imjcart.logic || (imjcart.logic = {}));
    var logic = imjcart.logic;
})(imjcart || (imjcart = {}));

/// <reference path="../../../lib/jquery.d.ts"/>
/// <reference path="../../../lib/lib.ts"/>
/// <reference path="../../../imjcart/logic/value/GlobalValue.ts"/>
/// <reference path="../../../imjcart/logic/value/Const.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var imjcart;
(function (imjcart) {
    (function (logic) {
        (function (socket) {
            var SocketController = (function (_super) {
                __extends(SocketController, _super);
                function SocketController() {
                    _super.call(this);
                    this._window = null;
                    this._socket = null;
                    this._window = window;
                    this._socket = this._window.socket || null;
                    if (!this._socket)
                        return;

                    //
                    // ---------- イベント ---------- //
                    //
                    // サーバから送信先が存在しないイベント取得
                    this._socket.on("emit_disconnect_client_from_server", function (data) {
                        // エラー表示イベント
                        var values = imjcart.logic.value.GlobalValue.getInstance();
                        values.controller.dispatchEvent(imjcart.logic.event.ProjectEvent.CONTROLLER_ERROR_EVENT);
                    });
                }
                SocketController.prototype.play = function (params) {
                    var id = params.id;
                    this._emitControllerData({
                        id: id,
                        event: imjcart.logic.value.Const.CONTROLLER_EVENT_KEY_PLAY
                    });
                };

                SocketController.prototype.startEngine = function (params) {
                    var id = params.id;
                    var value = params.value;
                    this._emitControllerData({
                        id: id,
                        event: imjcart.logic.value.Const.CONTROLLER_EVENT_KEY_START_ENGINE,
                        value: value
                    });
                };

                SocketController.prototype.stopEngine = function (params) {
                    var id = params.id;
                    this._emitControllerData({
                        id: id,
                        event: imjcart.logic.value.Const.CONTROLLER_EVENT_KEY_STOP_ENGINE
                    });
                };

                SocketController.prototype.setSteeringAngle = function (params) {
                    var id = params.id;
                    var value = params.value;
                    this._emitControllerData({
                        id: id,
                        event: imjcart.logic.value.Const.CONTROLLER_EVENT_KEY_SET_STEERING_ANGLE,
                        value: value
                    });
                };

                SocketController.prototype.clearSteeringAngle = function (params) {
                    var id = params.id;
                    this._emitControllerData({
                        id: id,
                        event: imjcart.logic.value.Const.CONTROLLER_EVENT_KEY_CLEAR_STEERING_ANGLE
                    });
                };

                SocketController.prototype.changeCameraAngle = function (params) {
                    var id = params.id;
                    this._emitControllerData({
                        id: id,
                        event: imjcart.logic.value.Const.CONTROLLER_EVENT_KEY_CHANGE_CAMERA_ANGLE
                    });
                };

                SocketController.prototype._emitControllerData = function (params) {
                    if (!this._socket)
                        return;
                    var id = params.id;
                    var event = params.event;
                    var value = params.value || null;
                    this._socket.emit("emit_controller_data_form_client", {
                        id: id,
                        event: event,
                        value: value
                    });
                };
                return SocketController;
            })(lib.event.EventDispacher);
            socket.SocketController = SocketController;
        })(logic.socket || (logic.socket = {}));
        var socket = logic.socket;
    })(imjcart.logic || (imjcart.logic = {}));
    var logic = imjcart.logic;
})(imjcart || (imjcart = {}));

/// <reference path="../../../lib/jquery.d.ts"/>
/// <reference path="../../../lib/lib.ts"/>
/// <reference path="../../../imjcart/logic/value/GlobalValue.ts"/>
/// <reference path="../../../imjcart/logic/value/Const.ts"/>
/// <reference path="../../../imjcart/logic/controller/Controller.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var imjcart;
(function (imjcart) {
    (function (logic) {
        (function (socket) {
            var SocketMain = (function (_super) {
                __extends(SocketMain, _super);
                function SocketMain() {
                    var _this = this;
                    _super.call(this);
                    this._window = null;
                    this._socket = null;
                    this._name = null;
                    this._x = null;
                    this._y = null;
                    this._bodyAngle = null;
                    this._wheelAngle = null;
                    this._speed = null;
                    this._colorBody = null;
                    this._colorWing = null;
                    this._colorDriver = null;
                    this._isFirst = true;
                    this._isChangeCarCondition = false;
                    this._id = null;
                    this._carConditionArr = [];
                    this._window = window;
                    this._socket = this._window.socket || null;
                    if (!this._socket)
                        return;

                    //
                    // ---------- イベント ---------- //
                    //
                    // サーバからソケットIDを受信
                    this._socket.on("emit_id_form_server", function (data) {
                        _this._emitIdFormServer(data);
                    });

                    // サーバから車情報を受信
                    this._socket.on("emit_other_carcondition_from_server", function (data) {
                        _this._emitOtherCarConditionFromServer(data);
                    });

                    // サーバーからコントローラー情報を受信
                    this._socket.on("emit_controller_data_from_server", function (data) {
                        _this._emitControllerDataFromServer(data);
                    });

                    // サーバからランキングデータ受信
                    this._socket.on("get_ranking_from_server", function (data) {
                        _this._getRankingFromServer(data);
                    });

                    // ラップタイムデータ保存完了
                    this._socket.on("save_laptime_from_server", function (data) {
                        _this._saveLaptimeFromServer(data);
                    });

                    // 車情報をサーバに送信
                    setInterval(function () {
                        if (!_this._isChangeCarCondition)
                            return;
                        _this._emitCarCondition();
                    }, 1000 / imjcart.logic.value.Const.SOCKET_EMIT_OTHER_CARS_CONDITION_FPS);
                }
                SocketMain.prototype.setCarCondition = function () {
                    if (!this._socket)
                        return;
                    var values = imjcart.logic.value.GlobalValue.getInstance();
                    if (this._isFirst) {
                        this._isFirst = false;
                        this._x = Math.floor(values.carInfo.x * 1000) / 1000;
                        this._y = Math.floor(values.carInfo.y * 1000) / 1000;
                        this._name = values.name;
                        this._bodyAngle = Math.floor(values.carInfo.bodyAngle * 100) / 100;
                        this._wheelAngle = Math.floor(values.carInfo.wheelAngle * 100) / 100;
                        this._speed = Math.floor(values.carInfo.speed * 100) / 100;
                        this._colorBody = values.carInfo.colorBody;
                        this._colorWing = values.carInfo.colorWing;
                        this._colorDriver = values.carInfo.colorDriver;
                        this._emitCarCondition();
                        return;
                    }

                    //
                    this._isChangeCarCondition = false;
                    var x = Math.floor(values.carInfo.x * 1000) / 1000;
                    if (this._x != x) {
                        this._x = x;
                        this._isChangeCarCondition = true;
                    }
                    var y = Math.floor(values.carInfo.y * 1000) / 1000;
                    if (this._y != y) {
                        this._y = y;
                        this._isChangeCarCondition = true;
                    }
                    var bodyAngle = Math.floor(values.carInfo.bodyAngle * 100) / 100;
                    if (this._bodyAngle != bodyAngle) {
                        this._bodyAngle = bodyAngle;
                        this._isChangeCarCondition = true;
                    }
                    var wheelAngle = Math.floor(values.carInfo.wheelAngle * 100) / 100;
                    if (this._wheelAngle != wheelAngle) {
                        this._wheelAngle = wheelAngle;
                        this._isChangeCarCondition = true;
                    }
                    var speed = Math.floor(values.carInfo.speed * 100) / 100;
                    if (this._speed != speed) {
                        this._speed = speed;
                        this._isChangeCarCondition = true;
                    }
                };

                SocketMain.prototype._emitCarCondition = function () {
                    if (!this._socket)
                        return;
                    this._socket.emit("emit_carcondition_form_client", {
                        x: this._x,
                        y: this._y,
                        bodyAngle: this._bodyAngle,
                        wheelAngle: this._wheelAngle,
                        speed: this._speed,
                        colorBody: this._colorBody,
                        colorWing: this._colorWing,
                        colorDriver: this._colorDriver,
                        name: this._name
                    });
                };

                SocketMain.prototype._emitIdFormServer = function (val) {
                    this._id = val;

                    // サーバーからソケットIDを取得したイベント
                    var values = imjcart.logic.value.GlobalValue.getInstance();
                    values.main.dispatchEvent(imjcart.logic.event.ProjectEvent.EMIT_ID_FROM_SERVER_EVENT, { id: this._id });
                };

                SocketMain.prototype._emitOtherCarConditionFromServer = function (arr) {
                    // 追加されている車を抽出
                    var addCarArr = [];
                    var i = 0, max;
                    for (i = 0, max = arr.length; i < max; i = i + 1) {
                        if (arr[i].id == this._id)
                            continue;
                        var flg = true;
                        var j = 0, max2;
                        for (j = 0, max2 = this._carConditionArr.length; j < max2; j = j + 1) {
                            if (arr[i].id == this._carConditionArr[j].id) {
                                flg = false;
                                break;
                            }
                        }
                        if (flg) {
                            addCarArr.push(arr[i]);
                        }
                    }
                    for (i = 0, max = addCarArr.length; i < max; i = i + 1) {
                        // 他の車追加イベント
                        var values = imjcart.logic.value.GlobalValue.getInstance();
                        values.main.dispatchEvent(imjcart.logic.event.ProjectEvent.ADD_OTHER_CAR_EVENT, addCarArr[i]);
                    }

                    // 削除されている車を抽出
                    var removeCarArr = [];
                    for (i = 0, max = this._carConditionArr.length; i < max; i = i + 1) {
                        if (this._carConditionArr[i].id == this._id)
                            continue;
                        var flg = true;
                        for (j = 0, max2 = arr.length; j < max2; j = j + 1) {
                            if (this._carConditionArr[i].id == arr[j].id) {
                                flg = false;
                                break;
                            }
                        }
                        if (flg) {
                            removeCarArr.push(this._carConditionArr[i]);
                        }
                    }
                    for (i = 0, max = removeCarArr.length; i < max; i = i + 1) {
                        // 他の車削除イベント
                        var values = imjcart.logic.value.GlobalValue.getInstance();
                        values.main.dispatchEvent(imjcart.logic.event.ProjectEvent.REMOVE_OTHER_CAR_EVENT, removeCarArr[i]);
                    }

                    // 他の車の描画更新イベント
                    var values = imjcart.logic.value.GlobalValue.getInstance();
                    values.main.dispatchEvent(imjcart.logic.event.ProjectEvent.RENDER_OTHER_CAR_EVENT, arr);

                    //
                    this._carConditionArr = arr;
                };

                SocketMain.prototype._emitControllerDataFromServer = function (params) {
                    var id = params.id;
                    var event = params.event;
                    var value = params.value;
                    var controller = imjcart.logic.controller.Controller.getInstance();
                    switch (event) {
                        case imjcart.logic.value.Const.CONTROLLER_EVENT_KEY_PLAY:
                            // シーン変更イベント
                            var values = imjcart.logic.value.GlobalValue.getInstance();
                            values.main.dispatchEvent(imjcart.logic.event.ProjectEvent.CHANGE_SCENE_EVENT, { id: imjcart.logic.value.Const.ID_SCENE_TIMEATACK });
                            break;

                        case imjcart.logic.value.Const.CONTROLLER_EVENT_KEY_START_ENGINE:
                            controller.startEngine({
                                value: value
                            });
                            break;

                        case imjcart.logic.value.Const.CONTROLLER_EVENT_KEY_STOP_ENGINE:
                            controller.stopEngine();
                            break;

                        case imjcart.logic.value.Const.CONTROLLER_EVENT_KEY_SET_STEERING_ANGLE:
                            controller.setSteeringAngle({
                                value: value
                            });
                            break;

                        case imjcart.logic.value.Const.CONTROLLER_EVENT_KEY_CLEAR_STEERING_ANGLE:
                            controller.clearSteeringAngle();
                            break;

                        case imjcart.logic.value.Const.CONTROLLER_EVENT_KEY_CHANGE_CAMERA_ANGLE:
                            controller.changeCameraAngle();
                            break;
                    }
                };

                // ランキングデータリクエスト
                SocketMain.prototype.getRankingFromClient = function (skip, limit) {
                    this._socket.emit("get_ranking_from_client", {
                        skip: skip,
                        limit: limit
                    });
                };

                SocketMain.prototype._getRankingFromServer = function (params) {
                    var lapTimeInfoArr = [];
                    var i = 0, max;
                    for (i = 0, max = params.length; i < max; i = i + 1) {
                        var id = params[i].id;
                        var time = params[i].time;
                        var rank = params[i].rank;
                        var length = params[i].length;
                        var name = params[i].name;
                        var comment = params[i].comment;
                        var colorBody = params[i].color.body;
                        var colorWing = params[i].color.wing;
                        var colorDriver = params[i].color.driver;
                        var runningPath = params[i].runningPath;
                        lapTimeInfoArr.push(new imjcart.logic.info.LapTimeInfo(id, time, rank, length, name, comment, colorBody, colorWing, colorDriver, runningPath));
                        /*
                        if (params[i].runningPath && params[i].runningPath != "" && params[i].runningPath.length) {
                        console.log("走行記録受信");
                        console.log(name);
                        console.log(colorBody);
                        console.log(colorWing);
                        console.log(colorDriver);
                        console.log(runningPath)
                        }
                        */
                    }

                    // ランキングデータ受信イベント
                    var values = imjcart.logic.value.GlobalValue.getInstance();
                    values.main.dispatchEvent(imjcart.logic.event.ProjectEvent.GET_RANKING_FROM_SERVER_EVENT, { lapTimeInfoArr: lapTimeInfoArr });
                };

                // ラップタイムデータ保存
                SocketMain.prototype.saveLaptimeFromClient = function () {
                    if (!this._socket)
                        return;
                    var values = imjcart.logic.value.GlobalValue.getInstance();
                    var date = new Date();
                    this._socket.emit("save_laptime_from_client", {
                        id: this._id,
                        name: values.name || null,
                        date: date,
                        time: values.fastestLapTime,
                        comment: values.comment || null,
                        color: {
                            body: values.colorBody,
                            wing: values.colorWing,
                            driver: values.colorDriver
                        },
                        runningPath: values.fastestRunningPathCollection
                    });
                    //console.log("ラップタイムデータ保存");
                    //console.log(values.carInfo.runningPath.collection);
                    //console.log(values.fastestRunningPathCollection);
                };

                SocketMain.prototype._saveLaptimeFromServer = function (params) {
                    var id = params.id;
                    var time = params.time;
                    var rank = params.rank;
                    var length = params.length;
                    var name = params.name;
                    var comment = params.comment;
                    var colorBody = params.colorBody;
                    var colorWing = params.colorWing;
                    var colorDriver = params.colorDriver;
                    var lapTimeInfo = new imjcart.logic.info.LapTimeInfo(id, time, rank, length, name, comment, colorBody, colorWing, colorDriver);

                    // ラップタイムデータ保存完了
                    var values = imjcart.logic.value.GlobalValue.getInstance();
                    values.main.dispatchEvent(imjcart.logic.event.ProjectEvent.COMPLETE_SAVE_LAPTIME_EVENT, { lapTimeInfo: lapTimeInfo });
                };
                return SocketMain;
            })(lib.event.EventDispacher);
            socket.SocketMain = SocketMain;
        })(logic.socket || (logic.socket = {}));
        var socket = logic.socket;
    })(imjcart.logic || (imjcart.logic = {}));
    var logic = imjcart.logic;
})(imjcart || (imjcart = {}));

/// <reference path="../../../lib/jquery.d.ts"/>
/// <reference path="../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../lib/three.d.ts"/>
/// <reference path="../../../lib/lib.ts"/>
var imjcart;
(function (imjcart) {
    (function (logic) {
        (function (utility) {
            var Util = (function () {
                function Util() {
                }
                Util.formatTime = function (value) {
                    var msec = value % 100;
                    var sec = Math.floor(value / 100) % 60;
                    var min = Math.floor(value / 100 / 60);
                    return Util.zeroFormat(min, 2) + ":" + Util.zeroFormat(sec, 2) + ":" + Math.floor(msec / 10);
                };

                Util.zeroFormat = function (v, n) {
                    if (n > String(v).length) {
                        return String("0") + v;
                    } else {
                        return String(v);
                    }
                };

                Util.getAngleByRotation = function (rot) {
                    return rot * Math.PI / 180;
                };

                Util.shuffle = function (array) {
                    var m = array.length, t, i;
                    while (m) {
                        i = Math.floor(Math.random() * m--);
                        t = array[m];
                        array[m] = array[i];
                        array[i] = t;
                    }
                    return array;
                };
                return Util;
            })();
            utility.Util = Util;
        })(logic.utility || (logic.utility = {}));
        var utility = logic.utility;
    })(imjcart.logic || (imjcart.logic = {}));
    var logic = imjcart.logic;
})(imjcart || (imjcart = {}));

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

/// <reference path="../../../lib/jquery.d.ts"/>
/// <reference path="../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../lib/three.d.ts"/>
/// <reference path="../../../lib/lib.ts"/>
/// <reference path="../../../imjcart/logic/info/CarInfo.ts"/>
/// <reference path="../../../imjcart/logic/info/LapTimeInfo.ts"/>
/// <reference path="../../../imjcart/display/main/Main.ts"/>
/// <reference path="../../../imjcart/display/controller/Controller.ts"/>
var imjcart;
(function (imjcart) {
    (function (logic) {
        (function (_value) {
            var GlobalValue = (function () {
                function GlobalValue() {
                    this._main = null;
                    this._controller = null;
                    this._socketId = null;
                    this._currentSceneId = null;
                    this._pastSceneId = null;
                    this._currentTimeAtackSceneId = null;
                    this._pastTimeAtackSceneId = null;
                    this._carInfo = null;
                    this._otherCarInfoArr = [];
                    this._colorBody = null;
                    this._colorWing = null;
                    this._colorDriver = null;
                    this._name = null;
                    this._comment = null;
                    this._fastestLapTime = null;
                    this._lapTimeInfoArr = [];
                    this._lapTimeInfo = null;
                    this._fastestRunningPathCollection = [];
                    GlobalValue._instance = this;
                }
                GlobalValue.getInstance = function () {
                    if (GlobalValue._instance === null) {
                        GlobalValue._instance = new GlobalValue();
                    }
                    return GlobalValue._instance;
                };


                Object.defineProperty(GlobalValue.prototype, "main", {
                    get: function () {
                        return this._main;
                    },
                    set: function (main) {
                        this._main = main;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(GlobalValue.prototype, "controller", {
                    get: function () {
                        return this._controller;
                    },
                    set: function (controller) {
                        this._controller = controller;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(GlobalValue.prototype, "socketId", {
                    get: function () {
                        return this._socketId;
                    },
                    set: function (value) {
                        this._socketId = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(GlobalValue.prototype, "currentSceneId", {
                    get: function () {
                        return this._currentSceneId;
                    },
                    set: function (value) {
                        this._currentSceneId = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(GlobalValue.prototype, "pastSceneId", {
                    get: function () {
                        return this._pastSceneId;
                    },
                    set: function (value) {
                        this._pastSceneId = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(GlobalValue.prototype, "currentTimeAtackSceneId", {
                    get: function () {
                        return this._currentTimeAtackSceneId;
                    },
                    set: function (value) {
                        this._currentTimeAtackSceneId = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(GlobalValue.prototype, "pastTimeAtackSceneId", {
                    get: function () {
                        return this._pastTimeAtackSceneId;
                    },
                    set: function (value) {
                        this._pastTimeAtackSceneId = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(GlobalValue.prototype, "carInfo", {
                    get: function () {
                        return this._carInfo;
                    },
                    set: function (carInfo) {
                        this._carInfo = carInfo;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(GlobalValue.prototype, "otherCarInfoArr", {
                    get: function () {
                        return this._otherCarInfoArr;
                    },
                    set: function (arr) {
                        this._otherCarInfoArr = arr;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(GlobalValue.prototype, "colorBody", {
                    get: function () {
                        return this._colorBody;
                    },
                    set: function (value) {
                        this._colorBody = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(GlobalValue.prototype, "colorWing", {
                    get: function () {
                        return this._colorWing;
                    },
                    set: function (value) {
                        this._colorWing = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(GlobalValue.prototype, "colorDriver", {
                    get: function () {
                        return this._colorDriver;
                    },
                    set: function (value) {
                        this._colorDriver = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(GlobalValue.prototype, "name", {
                    get: function () {
                        return this._name;
                    },
                    set: function (value) {
                        this._name = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(GlobalValue.prototype, "comment", {
                    get: function () {
                        return this._comment;
                    },
                    set: function (value) {
                        this._comment = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(GlobalValue.prototype, "fastestLapTime", {
                    get: function () {
                        return this._fastestLapTime;
                    },
                    set: function (value) {
                        this._fastestLapTime = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(GlobalValue.prototype, "lapTimeInfoArr", {
                    get: function () {
                        return this._lapTimeInfoArr;
                    },
                    set: function (arr) {
                        this._lapTimeInfoArr = arr;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(GlobalValue.prototype, "lapTimeInfo", {
                    get: function () {
                        return this._lapTimeInfo;
                    },
                    set: function (info) {
                        this._lapTimeInfo = info;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(GlobalValue.prototype, "fastestRunningPathCollection", {
                    get: function () {
                        return this._fastestRunningPathCollection;
                    },
                    set: function (arr) {
                        this._fastestRunningPathCollection = arr;
                    },
                    enumerable: true,
                    configurable: true
                });
                GlobalValue._instance = null;
                return GlobalValue;
            })();
            _value.GlobalValue = GlobalValue;
        })(logic.value || (logic.value = {}));
        var value = logic.value;
    })(imjcart.logic || (imjcart.logic = {}));
    var logic = imjcart.logic;
})(imjcart || (imjcart = {}));
