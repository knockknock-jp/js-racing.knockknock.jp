/// <reference path="../../../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../../../lib/three.d.ts"/>
/// <reference path="../../../../../../lib/lib.ts"/>

module imjcart.display.main.scene.timeatack.run {

    export class EngineCondition extends lib.base.BaseDisplay implements lib.display.IDisplay {

        private _displayImpl:lib.display.IDisplay = null;
        private _$mater:JQuery = $("#sceneTimeAtackRunEngineConditionMater");
        private _$speed:JQuery = $("#sceneTimeAtackRunEngineConditionSpeedTxt");
        private _rotation:number = null;
        private _speed:number = null;
        private _intervalId:number = null;

        constructor(target:JQuery) {
            super(target);
            //
            this._displayImpl = new lib.display.SimpleDisplayImpl(this.$target);
            this._displayImpl.addEventListener(lib.event.Event.DISPLAY_START_OPEN_EVENT, () => {
                this.speed = 0;
                this.power = 0;
                this.gear = 0;
                this.direction = 0;
            });
        }

        public open() {
            this._displayImpl.open(0);
            //
            if (this._intervalId) clearInterval(this._intervalId);
            this._intervalId = setInterval(() => {
                this._$mater.attr("transform", "rotate(" + this._rotation + " 100 100)");
                this._$speed.text(String(this._speed));
            }, 1000 / 10);
        }

        public close() {
            this._displayImpl.close(0);
        }

        public set speed(value:number) {
            this._rotation = Math.floor((180 * (Math.abs(value) * 0.5)) + 45);
            this._speed = Math.floor(Math.abs(value) * 100);
            //this._$mater.attr("transform", "rotate(" + Math.floor((180 * (Math.abs(value) * 0.5)) + 45) + " 100 100)");
        }

        public set power(value:number) {
        }

        public set gear(value:number) {
        }

        public set direction(value:number) {
        }

    }

}