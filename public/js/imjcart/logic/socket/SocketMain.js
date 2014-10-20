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
