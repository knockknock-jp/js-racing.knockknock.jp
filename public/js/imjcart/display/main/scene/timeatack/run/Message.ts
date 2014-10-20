/// <reference path="../../../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../../../lib/three.d.ts"/>
/// <reference path="../../../../../../lib/lib.ts"/>

module imjcart.display.main.scene.timeatack.run {

    export class Message extends lib.base.BaseDisplay implements lib.display.IDisplay {

        private _displayImpl:lib.display.IDisplay = null;
        private _$txt:JQuery = $("#sceneTimeAtackRunMessageTxt");
        private _intervalId:number = null;

        constructor(target:JQuery) {
            super(target);
            //
            this._displayImpl = new lib.display.SimpleDisplayImpl(this.$target);
            this._displayImpl.addEventListener(lib.event.Event.DISPLAY_START_OPEN_EVENT, () => {
                if (this._intervalId) clearInterval(this._intervalId);
                this._intervalId = setInterval(() => {
                    this.close();
                }, 3000);
            });
            this._displayImpl.addEventListener(lib.event.Event.DISPLAY_COMPLETE_CLOSE_EVENT, () => {
                this._$txt.empty();
            });
        }

        public open() {
            this._displayImpl.open(0);
        }

        public close() {
            this._displayImpl.close(0);
        }

        public set message(value:string) {
            this._$txt.text(value);
        }

    }

}