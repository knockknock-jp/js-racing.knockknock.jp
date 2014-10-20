/// <reference path="../../../../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../../../../lib/three.d.ts"/>
/// <reference path="../../../../../../../lib/lib.ts"/>
/// <reference path="../../../../../../../imjcart/display/main/scene/timeatack/run/pausewindow/BtnResume.ts"/>
/// <reference path="../../../../../../../imjcart/display/main/scene/timeatack/run/pausewindow/BtnRetry.ts"/>
/// <reference path="../../../../../../../imjcart/display/main/scene/timeatack/run/pausewindow/save/Save.ts"/>

module imjcart.display.main.scene.timeatack.run.pausewindow {

    export class PauseWindow extends lib.base.BaseDisplay implements lib.display.IDisplay {

        private _displayImpl:lib.display.IDisplay = null;
        private _btnResume:BtnResume = null;
        private _btnRetry:BtnRetry = null;
        private _save:save.Save = null;

        constructor(target:JQuery) {
            super(target);
            //
            this._btnResume = new BtnResume($("#sceneTimeAtackRunPauseWindowBtnResume"));
            this._btnRetry = new BtnRetry($("#sceneTimeAtackRunPauseWindowBtnRetry"));
            this._save = new save.Save($("#sceneTimeAtackRunPauseWindowSave"));
            //
            this._displayImpl = new lib.display.SimpleDisplayImpl(this.$target);
            this._displayImpl.addEventListener(lib.event.Event.DISPLAY_START_OPEN_EVENT, () => {
                this._startOpen();
            });
            this._displayImpl.addEventListener(lib.event.Event.DISPLAY_COMPLETE_CLOSE_EVENT, () => {
                this._completeClose();
            });
        }

        public open() {
            this._displayImpl.open(0);
        }

        public close() {
            this._displayImpl.close(0);
        }

        private _startOpen() {
            this._btnResume.open();
            this._btnRetry.open();
            //
            var values = imjcart.logic.value.GlobalValue.getInstance();
            if (values.fastestLapTime) {
                this._save.open();
            }
        }

        private _completeClose() {
            this._btnResume.close();
            this._btnRetry.close();
            this._save.close();
        }

        // ラップタイム保存完了
        public completeSaveLapTime() {
            this._save.completeSaveLapTime();
        }

    }

}