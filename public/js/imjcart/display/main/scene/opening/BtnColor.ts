/// <reference path="../../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../../lib/three.d.ts"/>
/// <reference path="../../../../../lib/lib.ts"/>
/// <reference path="../../../../../imjcart/logic/value/GlobalValue.ts"/>

module imjcart.display.main.scene.opening {

    export class BtnColor extends lib.base.BaseDisplay implements lib.display.IDisplay {

        private _displayImpl:lib.display.IDisplay = null;
        private _buttonImpl:lib.button.IButton = null;
        private _id:string = null;
        private _color:string = null;

        constructor(target:JQuery, id:string = null, color:string = null) {
            super(target);
            this._id = id;
            this._color = color;
            this.$target.css({
                backgroundColor: color
            });
            //
            this._displayImpl = new lib.display.SimpleDisplayImpl(this.$target);
            this._displayImpl.addEventListener(lib.event.Event.DISPLAY_COMPLETE_OPEN_EVENT, () => {
                this._buttonImpl.setActive();
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
            this._displayImpl.addEventListener(lib.event.Event.DISPLAY_START_CLOSE_EVENT, () => {
                this._buttonImpl.deleteActive();
            });
            //
            this._buttonImpl = new lib.button.SimpleButtonImpl(this.$target);
            this._buttonImpl.addEventListener(lib.event.Event.BUTTON_CLICK_EVENT, () => {
                // カラー変更イベント
                var values:imjcart.logic.value.GlobalValue = imjcart.logic.value.GlobalValue.getInstance();
                values.main.dispatchEvent(imjcart.logic.event.ProjectEvent.CHANGE_COLOR_EVENT, {id: this._id, color: this._color});
            });
            this._buttonImpl.addEventListener(lib.event.Event.BUTTON_SET_CURRENT_EVENT, () => {
                // カレント表示
                this.$target.addClass("current");
            });
            this._buttonImpl.addEventListener(lib.event.Event.BUTTON_DELETE_CURRENT_EVENT, () => {
                // カレント解除
                this.$target.removeClass("current");
            });
        }

        public open() {
            this._displayImpl.open(0);
        }

        public close() {
            this._displayImpl.close(0);
        }

        public get color():string {
            return this._color;
        }

        public setCurrent() {
            this._buttonImpl.setCurrent();
        }

        public deleteCurrent() {
            this._buttonImpl.deleteCurrent();
        }

    }

}