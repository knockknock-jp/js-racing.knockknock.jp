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
