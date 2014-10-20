/// <reference path="../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../lib/three.d.ts"/>
/// <reference path="../../../../lib/lib.ts"/>
/// <reference path="../../../../imjcart/display/main/scene/opening/Opening.ts"/>
/// <reference path="../../../../imjcart/display/main/scene/timeatack/TimeAtack.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var imjcart;
(function (imjcart) {
    (function (display) {
        (function (main) {
            (function (scene) {
                var Scene = (function (_super) {
                    __extends(Scene, _super);
                    function Scene(target) {
                        _super.call(this, target);
                        this._displayImpl = null;
                        this._sceneCollection = null;
                        this._sceneOpening = null;
                        this._sceneTimeAtack = null;

                        // シーン
                        this._sceneCollection = new lib.collection.DisplayCollection();

                        // オープニング
                        this._sceneOpening = new scene.opening.Opening($("#sceneOpening"));
                        this._sceneCollection.pushInfo(new lib.collection.DisplayInfo(imjcart.logic.value.Const.ID_SCENE_OPENING, this._sceneOpening));

                        // タイムアタック
                        this._sceneTimeAtack = new scene.timeatack.TimeAtack($("#sceneTimeAtack"));
                        this._sceneCollection.pushInfo(new lib.collection.DisplayInfo(imjcart.logic.value.Const.ID_SCENE_TIMEATACK, this._sceneTimeAtack));

                        //
                        this._displayImpl = new lib.display.SimpleDisplayImpl(this.$target);
                    }
                    Scene.prototype.open = function () {
                        this._displayImpl.open(0);
                    };

                    Scene.prototype.close = function () {
                        this._displayImpl.close(0);
                    };

                    // シーン変更
                    Scene.prototype.changeScene = function () {
                        var values = imjcart.logic.value.GlobalValue.getInstance();
                        if (values.pastSceneId)
                            this._sceneCollection.getInfoById(values.pastSceneId).display.close();
                        this._sceneCollection.getInfoById(values.currentSceneId).display.open();
                    };

                    // タイムアタックシーン変更
                    Scene.prototype.changeTimeAtackScene = function () {
                        this._sceneTimeAtack.changeScene();
                    };

                    // コントローラーURL
                    Scene.prototype.setControllerUrl = function (url) {
                        this._sceneOpening.setControllerUrl(url);
                    };

                    // ボディカラー変更
                    Scene.prototype.changeColorBody = function () {
                        this._sceneOpening.changeColorBody();
                    };

                    // ウィングカラー変更
                    Scene.prototype.changeColorWing = function () {
                        this._sceneOpening.changeColorWing();
                    };

                    // ドライバーカラー変更
                    Scene.prototype.changeColorDriver = function () {
                        this._sceneOpening.changeColorDriver();
                    };

                    // タイムアタック一時停止
                    Scene.prototype.pauseTimeAttack = function () {
                        // 一時停止
                        this._sceneTimeAtack.pause();
                    };

                    // タイムアタック再開
                    Scene.prototype.resumeTimeAttack = function () {
                        // 再開
                        this._sceneTimeAtack.resume();
                    };

                    // タイムアタックリトライ
                    Scene.prototype.retryTimeAttack = function () {
                        // 再開
                        this._sceneTimeAtack.retry();
                    };

                    // ラップタイム保存完了
                    Scene.prototype.completeSaveLapTime = function () {
                        this._sceneTimeAtack.completeSaveLapTime();
                    };

                    // 他の車追加
                    Scene.prototype.addOtherCar = function (id) {
                        this._sceneTimeAtack.addOtherCar(id);
                    };

                    // 他の車除去
                    Scene.prototype.removeOtherCar = function (id) {
                        this._sceneTimeAtack.removeOtherCar(id);
                    };

                    // 他の車の姿勢更新
                    Scene.prototype.updateOtherCarPosture = function () {
                        this._sceneTimeAtack.updateOtherCarPosture();
                    };
                    return Scene;
                })(lib.base.BaseDisplay);
                scene.Scene = Scene;
            })(main.scene || (main.scene = {}));
            var scene = main.scene;
        })(display.main || (display.main = {}));
        var main = display.main;
    })(imjcart.display || (imjcart.display = {}));
    var display = imjcart.display;
})(imjcart || (imjcart = {}));
