/// <reference path="../../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../../lib/three.d.ts"/>
/// <reference path="../../../../../lib/lib.ts"/>
/// <reference path="../../../../../imjcart/logic/value/GlobalValue.ts"/>
/// <reference path="../../../../../imjcart/logic/event/ProjectEvent.ts"/>
/// <reference path="../../../../../imjcart/display/main/scene/timeatack/run/Run.ts"/>
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
                (function (timeatack) {
                    var TimeAtack = (function (_super) {
                        __extends(TimeAtack, _super);
                        function TimeAtack(target) {
                            var _this = this;
                            _super.call(this, target);
                            this._displayImpl = null;
                            this._sceneCollection = null;
                            this._run = null;

                            //
                            this._sceneCollection = new lib.collection.DisplayCollection();

                            // 走行
                            this._run = new timeatack.run.Run($("#sceneTimeAtackRun"));
                            this._sceneCollection.pushInfo(new lib.collection.DisplayInfo(imjcart.logic.value.Const.ID_SCENE_TIMEATACK_RUN, this._run));

                            //
                            this._displayImpl = new lib.display.SimpleDisplayImpl(this.$target);
                            this._displayImpl.addEventListener(lib.event.Event.DISPLAY_START_OPEN_EVENT, function () {
                                lib.responisive.ResizeManager.getInstance().addEventListener(_this);
                                lib.responisive.ResizeManager.getInstance().dispatchEvent(_this);
                            });
                            this._displayImpl.addEventListener(lib.event.Event.DISPLAY_COMPLETE_OPEN_EVENT, function () {
                                _this._completeOpen();
                            });
                            this._displayImpl.addEventListener(lib.event.Event.DISPLAY_START_CLOSE_EVENT, function () {
                                _this._startClose();
                            });
                            this._displayImpl.addEventListener(lib.event.Event.DISPLAY_COMPLETE_CLOSE_EVENT, function () {
                                lib.responisive.ResizeManager.getInstance().removeEventListener(_this);
                            });
                        }
                        TimeAtack.prototype.open = function () {
                            this._displayImpl.open(0);
                        };

                        TimeAtack.prototype.close = function () {
                            this._displayImpl.close(0);
                        };

                        TimeAtack.prototype.onResize = function (width, height) {
                            if (width < imjcart.logic.value.Const.STAGE_WIDTH)
                                width = imjcart.logic.value.Const.STAGE_WIDTH;
                            if (height < imjcart.logic.value.Const.STAGE_HEIGHT)
                                height = imjcart.logic.value.Const.STAGE_HEIGHT;
                            this.$target.css({
                                width: width,
                                height: height - imjcart.logic.value.Const.FOOTER_HEIGHT - imjcart.logic.value.Const.RANKING_HEIGHT
                            });
                        };

                        // タイムアタックシーン変更
                        TimeAtack.prototype.changeScene = function () {
                            var values = imjcart.logic.value.GlobalValue.getInstance();
                            if (values.pastTimeAtackSceneId)
                                this._sceneCollection.getInfoById(values.pastTimeAtackSceneId).display.close();
                            this._sceneCollection.getInfoById(values.currentTimeAtackSceneId).display.open();
                        };

                        TimeAtack.prototype._completeOpen = function () {
                            // タイムアタックシーン変更イベント
                            var values = imjcart.logic.value.GlobalValue.getInstance();
                            values.main.dispatchEvent(imjcart.logic.event.ProjectEvent.CHANGE_TIMEATACK_SCENE_EVENT, { id: imjcart.logic.value.Const.ID_SCENE_TIMEATACK_RUN });
                        };

                        TimeAtack.prototype._startClose = function () {
                            this._run.close();
                        };

                        // 一時停止
                        TimeAtack.prototype.pause = function () {
                            this._run.pause();
                        };

                        // 再開
                        TimeAtack.prototype.resume = function () {
                            this._run.resume();
                        };

                        // リトライ
                        TimeAtack.prototype.retry = function () {
                            this._run.retry();
                        };

                        // ラップタイム保存完了
                        TimeAtack.prototype.completeSaveLapTime = function () {
                            this._run.completeSaveLapTime();
                        };

                        // 他の車追加
                        TimeAtack.prototype.addOtherCar = function (id) {
                            this._run.addOtherCar(id);
                        };

                        // 他の車除去
                        TimeAtack.prototype.removeOtherCar = function (id) {
                            this._run.removeOtherCar(id);
                        };

                        // 他の車の姿勢更新
                        TimeAtack.prototype.updateOtherCarPosture = function () {
                            this._run.updateOtherCarPosture();
                        };
                        return TimeAtack;
                    })(lib.base.BaseDisplay);
                    timeatack.TimeAtack = TimeAtack;
                })(scene.timeatack || (scene.timeatack = {}));
                var timeatack = scene.timeatack;
            })(main.scene || (main.scene = {}));
            var scene = main.scene;
        })(display.main || (display.main = {}));
        var main = display.main;
    })(imjcart.display || (imjcart.display = {}));
    var display = imjcart.display;
})(imjcart || (imjcart = {}));
