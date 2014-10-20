/// <reference path="../../../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../../../lib/three.d.ts"/>
/// <reference path="../../../../../../lib/lib.ts"/>
/// <reference path="../../../../../../imjcart/logic/value/Const.ts"/>
/// <reference path="../../../../../../imjcart/logic/utility/Util.ts"/>
/// <reference path="../../../../../../imjcart/display/main/scene/timeatack/run/BtnSave.ts"/>

module imjcart.display.main.scene.timeatack.run {

    export class LapTime extends lib.base.BaseDisplay implements lib.display.IDisplay {

        private _displayImpl:lib.display.IDisplay = null;
        private _btnSave:BtnSave = null;
        private _$current:JQuery = $("#sceneTimeAtackRunLapTimeCurrent");
        private _$fastest:JQuery = $("#sceneTimeAtackRunLapTimeFastest");
        private _$fastestTxt:JQuery = $("#sceneTimeAtackRunLapTimeFastestTxt");
        private _$list:JQuery = $("#sceneTimeAtackRunLapTimeList");
        private _$listItem:JQuery = null;
        private _isExixtFastest:boolean = false;

        constructor(target:JQuery) {
            super(target);
            // 保存ボタン
            this._btnSave = new BtnSave($("#sceneTimeAtackRunBtnSave"));
            this._$listItem = this._$list.find("li").clone();
            this._$list.empty();
            //
            this._displayImpl = new lib.display.SimpleDisplayImpl(this.$target);
            this._displayImpl.addEventListener(lib.event.Event.DISPLAY_START_OPEN_EVENT, () => {
                this.currentTime = 0;
            });
        }

        public open() {
            this._displayImpl.open(0);
        }

        public close() {
            this._displayImpl.close(0);
        }

        public set fastestLap(value:number) {
            if (!this._isExixtFastest) {
                this._isExixtFastest = true;
                this._$fastest.css({
                    display: "block"
                });
                this._btnSave.open();
            }
            this._$fastestTxt.text(imjcart.logic.utility.Util.formatTime(value));
        }

        public set currentTime(value:number) {
            this._$current.text(imjcart.logic.utility.Util.formatTime(value));
        }

        public set lapTimeArr(arr:any) {
            // これまでのラップタイムを表示
            this._$list.empty();
            var j = 0;
            for(var i = arr.length - 1; 0 <= i; i --) {
                var time = arr[i];
                var $listItem = this._$listItem.clone();
                $listItem.find(".sceneTimeAtackRunLapTimeListLap").text(i + 1 + "");
                $listItem.find(".sceneTimeAtackRunLapTimeListTime").text(imjcart.logic.utility.Util.formatTime(time));
                this._$list.append($listItem);
                j ++;
                if (imjcart.logic.value.Const.LAP_TIME_LIST_MAX <= j) break;
            }
        }

    }

}