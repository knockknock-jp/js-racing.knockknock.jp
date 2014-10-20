/// <reference path="../../../lib/jquery.d.ts"/>
/// <reference path="../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../lib/three.d.ts"/>
/// <reference path="../../../lib/lib.ts"/>
/// <reference path="../../../imjcart/logic/controller/value/ControllerConst.ts"/>
/// <reference path="../../../imjcart/logic/controller/event/ControllerEvent.ts"/>

module imjcart.logic.controller {

    export class Controller extends lib.event.EventDispacher {

        private static _instance:Controller = null;

        public static getInstance():Controller  {
            if (Controller._instance === null) {
                Controller._instance = new Controller();
            }
            return Controller._instance;
        }

        constructor() {
            super();
            Controller._instance = this;
            //
            $(document).keydown((evt) => {
                if (evt.keyCode == value.ControllerConst.KEYCODE_UP || evt.keyCode == value.ControllerConst.KEYCODE_W) {
                    this.startEngine({
                        value: 1
                    });
                }
                if (evt.keyCode == value.ControllerConst.KEYCODE_DOWN || evt.keyCode == value.ControllerConst.KEYCODE_S) {
                    this.startEngine({
                        value: -1
                   });
                }
                if (evt.keyCode == value.ControllerConst.KEYCODE_LEFT || evt.keyCode == value.ControllerConst.KEYCODE_A) {
                    this.setSteeringAngle({
                        //value: 0.5
                        value: 0.75
                    });
                }
                if (evt.keyCode == value.ControllerConst.KEYCODE_RIGHT || evt.keyCode == value.ControllerConst.KEYCODE_D) {
                    this.setSteeringAngle({
                        //value: -0.5
                        value: -0.75
                    });
                }
                if (evt.keyCode == value.ControllerConst.KEYCODE_SPACE) {
                    this.changeCameraAngle();
                }
                if (evt.keyCode == value.ControllerConst.KEYCODE_SHIFT) {
                    this.changeCameraAngle();
                }
            });
            $(document).keyup((evt) => {
                if (evt.keyCode == value.ControllerConst.KEYCODE_LEFT || evt.keyCode == value.ControllerConst.KEYCODE_RIGHT || evt.keyCode == value.ControllerConst.KEYCODE_A || evt.keyCode == value.ControllerConst.KEYCODE_D) {
                    this.clearSteeringAngle();
                }
                if (evt.keyCode == value.ControllerConst.KEYCODE_UP || evt.keyCode == value.ControllerConst.KEYCODE_DOWN || evt.keyCode == value.ControllerConst.KEYCODE_W || evt.keyCode == value.ControllerConst.KEYCODE_S) {
                    this.stopEngine();

                }
            });
        }

        public startEngine(params) {
            var value = params.value;
            // エンジン開始イベント
            this.dispatchEvent(event.ControllerEvent.START_ENGINE_EVENT, {value: value});
        }

        public setSteeringAngle(params) {
            var value = params.value;
            // ステアリング変更イベント
            this.dispatchEvent(event.ControllerEvent.SET_STEERING_ANGLE_EVENT, {value: value});
        }

        public clearSteeringAngle() {
            // ステアリングを元に戻すイベント
            this.dispatchEvent(event.ControllerEvent.CLEAR_STEERING_ANGLE_EVENT);
        }

        public stopEngine() {
            // エンジン停止イベント
            this.dispatchEvent(event.ControllerEvent.STOP_ENGINE_EVENT);
        }

        public changeCameraAngle() {
            // カメラアングル変更イベント
            this.dispatchEvent(event.ControllerEvent.CHANGE_CAMERA_ANGLE_EVENT);
        }

    }

}