/// <reference path="../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../lib/three.d.ts"/>
/// <reference path="../../../../lib/lib.ts"/>
/// <reference path="../../../../imjcart/display/main/scene/opening/Opening.ts"/>
/// <reference path="../../../../imjcart/display/main/scene/timeatack/TimeAtack.ts"/>

module imjcart.display.main.scene {

    export class Scene extends lib.base.BaseDisplay implements lib.display.IDisplay {

        private _displayImpl:lib.display.IDisplay = null;
        private _sceneCollection:lib.collection.DisplayCollection = null;
        private _sceneOpening:opening.Opening = null;
        private _sceneTimeAtack:timeatack.TimeAtack = null;

        constructor(target:JQuery) {
            super(target);
            // シーン
            this._sceneCollection = new lib.collection.DisplayCollection();
            // オープニング
            this._sceneOpening = new opening.Opening($("#sceneOpening"));
            this._sceneCollection.pushInfo(new lib.collection.DisplayInfo(imjcart.logic.value.Const.ID_SCENE_OPENING, this._sceneOpening));
            // タイムアタック
            this._sceneTimeAtack = new timeatack.TimeAtack($("#sceneTimeAtack"));
            this._sceneCollection.pushInfo(new lib.collection.DisplayInfo(imjcart.logic.value.Const.ID_SCENE_TIMEATACK, this._sceneTimeAtack));
            //
            this._displayImpl = new lib.display.SimpleDisplayImpl(this.$target);
        }

        public open() {
            this._displayImpl.open(0);
        }

        public close() {
            this._displayImpl.close(0);
        }

        // シーン変更
        public changeScene() {
            var values:imjcart.logic.value.GlobalValue = imjcart.logic.value.GlobalValue.getInstance();
            if (values.pastSceneId) this._sceneCollection.getInfoById(values.pastSceneId).display.close();
            this._sceneCollection.getInfoById(values.currentSceneId).display.open();
        }

        // タイムアタックシーン変更
        public changeTimeAtackScene() {
            this._sceneTimeAtack.changeScene();
        }

        // コントローラーURL
        public setControllerUrl(url:string) {
            this._sceneOpening.setControllerUrl(url);
        }

        // ボディカラー変更
        public changeColorBody() {
            this._sceneOpening.changeColorBody();
        }

        // ウィングカラー変更
        public changeColorWing() {
            this._sceneOpening.changeColorWing();
        }

        // ドライバーカラー変更
        public changeColorDriver() {
            this._sceneOpening.changeColorDriver();
        }

        // タイムアタック一時停止
        public pauseTimeAttack() {
            // 一時停止
            this._sceneTimeAtack.pause();
        }

        // タイムアタック再開
        public resumeTimeAttack() {
            // 再開
            this._sceneTimeAtack.resume();
        }

        // タイムアタックリトライ
        public retryTimeAttack() {
            // 再開
            this._sceneTimeAtack.retry();
        }

        // ラップタイム保存完了
        public completeSaveLapTime() {
            this._sceneTimeAtack.completeSaveLapTime();
        }

        // 他の車追加
        public addOtherCar(id:string) {
            this._sceneTimeAtack.addOtherCar(id);
        }

        // 他の車除去
        public removeOtherCar(id:string) {
            this._sceneTimeAtack.removeOtherCar(id);
        }

        // 他の車の姿勢更新
        public updateOtherCarPosture():void {
            this._sceneTimeAtack.updateOtherCarPosture()
        }

    }

}