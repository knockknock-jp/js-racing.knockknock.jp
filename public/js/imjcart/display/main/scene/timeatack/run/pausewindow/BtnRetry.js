/// <reference path="../../../../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../../../../lib/three.d.ts"/>
/// <reference path="../../../../../../../lib/lib.ts"/>
/// <reference path="../../../../../../../imjcart/logic/value/GlobalValue.ts"/>
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
                            var BtnRetry = (function (_super) {
                                __extends(BtnRetry, _super);
                                function BtnRetry(target) {
                                    var _this = this;
                                    _super.call(this, target);
                                    this._displayImpl = null;
                                    this._buttonImpl = null;

                                    //
                                    this._displayImpl = new lib.display.SimpleDisplayImpl(this.$target);
                                    this._displayImpl.addEventListener(lib.event.Event.DISPLAY_COMPLETE_OPEN_EVENT, function () {
                                        _this._buttonImpl.setActive();
                                    });
                                    this._displayImpl.addEventListener(lib.event.Event.DISPLAY_START_CLOSE_EVENT, function () {
                                        _this._buttonImpl.deleteActive();
                                    });
                                    this._buttonImpl = new lib.button.SimpleButtonImpl(this.$target);
                                    this._buttonImpl.addEventListener(lib.event.Event.BUTTON_CLICK_EVENT, function () {
                                        // タイムアタック再開イベント
                                        var values = imjcart.logic.value.GlobalValue.getInstance();
                                        values.main.dispatchEvent(imjcart.logic.event.ProjectEvent.RESUME_TIMEATTACK_EVENT);

                                        // タイムアタックリトライイベント
                                        var values = imjcart.logic.value.GlobalValue.getInstance();
                                        values.main.dispatchEvent(imjcart.logic.event.ProjectEvent.RETRY_TIMEATTACK_EVENT);
                                    });
                                }
                                BtnRetry.prototype.open = function () {
                                    this._displayImpl.open(0);
                                };

                                BtnRetry.prototype.close = function () {
                                    this._displayImpl.close(0);
                                };
                                return BtnRetry;
                            })(lib.base.BaseDisplay);
                            pausewindow.BtnRetry = BtnRetry;
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
