/// <reference path="../../../../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../../../../lib/three.d.ts"/>
/// <reference path="../../../../../../../lib/lib.ts"/>
/// <reference path="../../../../../../../imjcart/display/main/scene/timeatack/run/pausewindow/BtnResume.ts"/>
/// <reference path="../../../../../../../imjcart/display/main/scene/timeatack/run/pausewindow/BtnRetry.ts"/>
/// <reference path="../../../../../../../imjcart/display/main/scene/timeatack/run/pausewindow/save/Save.ts"/>
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
                    (function (run) {
                        (function (pausewindow) {
                            var PauseWindow = (function (_super) {
                                __extends(PauseWindow, _super);
                                function PauseWindow(target) {
                                    var _this = this;
                                    _super.call(this, target);
                                    this._displayImpl = null;
                                    this._btnResume = null;
                                    this._btnRetry = null;
                                    this._save = null;

                                    //
                                    this._btnResume = new pausewindow.BtnResume($("#sceneTimeAtackRunPauseWindowBtnResume"));
                                    this._btnRetry = new pausewindow.BtnRetry($("#sceneTimeAtackRunPauseWindowBtnRetry"));
                                    this._save = new pausewindow.save.Save($("#sceneTimeAtackRunPauseWindowSave"));

                                    //
                                    this._displayImpl = new lib.display.SimpleDisplayImpl(this.$target);
                                    this._displayImpl.addEventListener(lib.event.Event.DISPLAY_START_OPEN_EVENT, function () {
                                        _this._startOpen();
                                    });
                                    this._displayImpl.addEventListener(lib.event.Event.DISPLAY_COMPLETE_CLOSE_EVENT, function () {
                                        _this._completeClose();
                                    });
                                }
                                PauseWindow.prototype.open = function () {
                                    this._displayImpl.open(0);
                                };

                                PauseWindow.prototype.close = function () {
                                    this._displayImpl.close(0);
                                };

                                PauseWindow.prototype._startOpen = function () {
                                    this._btnResume.open();
                                    this._btnRetry.open();

                                    //
                                    var values = imjcart.logic.value.GlobalValue.getInstance();
                                    if (values.fastestLapTime) {
                                        this._save.open();
                                    }
                                };

                                PauseWindow.prototype._completeClose = function () {
                                    this._btnResume.close();
                                    this._btnRetry.close();
                                    this._save.close();
                                };

                                // ラップタイム保存完了
                                PauseWindow.prototype.completeSaveLapTime = function () {
                                    this._save.completeSaveLapTime();
                                };
                                return PauseWindow;
                            })(lib.base.BaseDisplay);
                            pausewindow.PauseWindow = PauseWindow;
                        })(run.pausewindow || (run.pausewindow = {}));
                        var pausewindow = run.pausewindow;
                    })(timeatack.run || (timeatack.run = {}));
                    var run = timeatack.run;
                })(scene.timeatack || (scene.timeatack = {}));
                var timeatack = scene.timeatack;
            })(main.scene || (main.scene = {}));
            var scene = main.scene;
        })(display.main || (display.main = {}));
        var main = display.main;
    })(imjcart.display || (imjcart.display = {}));
    var display = imjcart.display;
})(imjcart || (imjcart = {}));
