/// <reference path="../../../lib/jquery.d.ts"/>
/// <reference path="../../../lib/lib.ts"/>
/// <reference path="../../../imjcart/logic/value/GlobalValue.ts"/>
/// <reference path="../../../imjcart/logic/value/Const.ts"/>

module imjcart.logic.socket {

    export class SocketController extends lib.event.EventDispacher {

        private _window:any = null;
        private _socket:any = null;

        constructor() {
            super();
            this._window = window;
            this._socket = this._window.socket || null;
            if (!this._socket) return;
            //
            // ---------- イベント ---------- //
            //
            // サーバから送信先が存在しないイベント取得
            this._socket.on("emit_disconnect_client_from_server", (data) => {
                // エラー表示イベント
                var values:imjcart.logic.value.GlobalValue = imjcart.logic.value.GlobalValue.getInstance();
                values.controller.dispatchEvent(imjcart.logic.event.ProjectEvent.CONTROLLER_ERROR_EVENT);
            });
        }

        public play(params) {
            var id = params.id;
            this._emitControllerData({
                id: id,
                event: imjcart.logic.value.Const.CONTROLLER_EVENT_KEY_PLAY
            })
        }

        public startEngine(params) {
            var id = params.id;
            var value = params.value;
            this._emitControllerData({
                id: id,
                event: imjcart.logic.value.Const.CONTROLLER_EVENT_KEY_START_ENGINE,
                value: value
            })
        }

        public stopEngine(params) {
            var id = params.id;
            this._emitControllerData({
                id: id,
                event: imjcart.logic.value.Const.CONTROLLER_EVENT_KEY_STOP_ENGINE
            })
        }

        public setSteeringAngle(params) {
            var id = params.id;
            var value = params.value;
            this._emitControllerData({
                id: id,
                event: imjcart.logic.value.Const.CONTROLLER_EVENT_KEY_SET_STEERING_ANGLE,
                value: value
            })
        }

        public clearSteeringAngle(params) {
            var id = params.id;
            this._emitControllerData({
                id: id,
                event: imjcart.logic.value.Const.CONTROLLER_EVENT_KEY_CLEAR_STEERING_ANGLE
            })
        }

        public changeCameraAngle(params) {
            var id = params.id;
            this._emitControllerData({
                id: id,
                event: imjcart.logic.value.Const.CONTROLLER_EVENT_KEY_CHANGE_CAMERA_ANGLE
            })
        }

        private _emitControllerData(params) {
            if (!this._socket) return;
            var id = params.id;
            var event = params.event;
            var value = params.value || null;
            this._socket.emit("emit_controller_data_form_client", {
                id: id,
                event: event,
                value: value
            });
        }

    }

}