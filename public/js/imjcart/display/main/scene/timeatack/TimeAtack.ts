/// <reference path="../../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../../lib/three.d.ts"/>
/// <reference path="../../../../../lib/lib.ts"/>
/// <reference path="../../../../../imjcart/logic/value/GlobalValue.ts"/>
/// <reference path="../../../../../imjcart/logic/event/ProjectEvent.ts"/>
/// <reference path="../../../../../imjcart/display/main/scene/timeatack/run/Run.ts"/>

module imjcart.display.main.scene.timeatack {

    export class TimeAtack extends lib.base.BaseDisplay implements lib.display.IDisplay, lib.responisive.IResize {

        private _displayImpl:lib.display.IDisplay = null;
        private _sceneCollection:lib.collection.DisplayCollection = null;
        private _run:run.Run = null;

        constructor(target:JQuery) {
            super(target);
            //
            this._sceneCollection = new lib.collection.DisplayCollection();
            // 走行
            this._run = new run.Run($("#sceneTimeAtackRun"));
            this._sceneCollection.pushInfo(new lib.collection.DisplayInfo(imjcart.logic.value.Const.ID_SCENE_TIMEATACK_RUN, this._run));
            //
            this._displayImpl = new lib.display.SimpleDisplayImpl(this.$target);
            this._displayImpl.addEventListener(lib.event.Event.DISPLAY_START_OPEN_EVENT, () => {
                lib.responisive.ResizeManager.getInstance().addEventListener(this);
                lib.responisive.ResizeManager.getInstance().dispatchEvent(this);
            });
            this._displayImpl.addEventListener(lib.event.Event.DISPLAY_COMPLETE_OPEN_EVENT, () => {
                this._completeOpen();
            });
            this._displayImpl.addEventListener(lib.event.Event.DISPLAY_START_CLOSE_EVENT, () => {
                this._startClose();
            });
            this._displayImpl.addEventListener(lib.event.Event.DISPLAY_COMPLETE_CLOSE_EVENT, () => {
                lib.responisive.ResizeManager.getInstance().removeEventListener(this);
            });
        }

        public open() {
            this._displayImpl.open(0);
        }

        public close() {
            this._displayImpl.close(0);
        }

        public onResize(width:number, height:number):void {
            if (width < imjcart.logic.value.Const.STAGE_WIDTH) width = imjcart.logic.value.Const.STAGE_WIDTH;
            if (height < imjcart.logic.value.Const.STAGE_HEIGHT) height = imjcart.logic.value.Const.STAGE_HEIGHT;
            this.$target.css({
                width: width,
                height: height - imjcart.logic.value.Const.FOOTER_HEIGHT - imjcart.logic.value.Const.RANKING_HEIGHT
            });
        }

        // タイムアタックシーン変更
        public changeScene() {
            var values:imjcart.logic.value.GlobalValue = imjcart.logic.value.GlobalValue.getInstance();
            if (values.pastTimeAtackSceneId) this._sceneCollection.getInfoById(values.pastTimeAtackSceneId).display.close();
            this._sceneCollection.getInfoById(values.currentTimeAtackSceneId).display.open();
        }

        private _completeOpen():void {
            // タイムアタックシーン変更イベント
            var values:imjcart.logic.value.GlobalValue = imjcart.logic.value.GlobalValue.getInstance();
            values.main.dispatchEvent(imjcart.logic.event.ProjectEvent.CHANGE_TIMEATACK_SCENE_EVENT, {id: imjcart.logic.value.Const.ID_SCENE_TIMEATACK_RUN});
        }

        private _startClose():void {
            this._run.close();
        }

        // 一時停止
        public pause() {
            this._run.pause();
        }

        // 再開
        public resume() {
            this._run.resume();
        }

        // リトライ
        public retry() {
            this._run.retry();
        }

        // ラップタイム保存完了
        public completeSaveLapTime() {
            this._run.completeSaveLapTime();
        }

        // 他の車追加
        public addOtherCar(id:string) {
            this._run.addOtherCar(id);
        }

        // 他の車除去
        public removeOtherCar(id:string) {
            this._run.removeOtherCar(id);
        }

        // 他の車の姿勢更新
        public updateOtherCarPosture():void {
            this._run.updateOtherCarPosture()
        }

    }

}