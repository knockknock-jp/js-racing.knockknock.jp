/// <reference path="../../../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../../../lib/three.d.ts"/>
/// <reference path="../../../../../../lib/lib.ts"/>
/// <reference path="../../../../../../imjcart/logic/value/GlobalValue.ts"/>

module imjcart.display.main.scene.timeatack.run {

    export class BtnSave extends lib.base.BaseDisplay implements lib.display.IDisplay {

        private _displayImpl:lib.display.IDisplay = null;
        private _buttonImpl:lib.button.IButton = null;

        constructor(target:JQuery) {
            super(target);
            //
            this._displayImpl = new lib.display.SimpleDisplayImpl(this.$target);
            this._displayImpl.addEventListener(lib.event.Event.DISPLAY_COMPLETE_OPEN_EVENT, () => {
                this._buttonImpl.setActive();
            });
            this._displayImpl.addEventListener(lib.event.Event.DISPLAY_START_CLOSE_EVENT, () => {
                this._buttonImpl.deleteActive();
            });
            this._buttonImpl = new lib.button.SimpleButtonImpl(this.$target);
            this._buttonImpl.addEventListener(lib.event.Event.BUTTON_CLICK_EVENT, () => {
                // タイムアタック一時停止イベント
                var values:imjcart.logic.value.GlobalValue = imjcart.logic.value.GlobalValue.getInstance();
                values.main.dispatchEvent(imjcart.logic.event.ProjectEvent.PAUSE_TIMEATTACK_EVENT);
            });
        }

        public open() {
            this._displayImpl.open(0);
        }

        public close() {
            this._displayImpl.close(0);
        }

    }

}