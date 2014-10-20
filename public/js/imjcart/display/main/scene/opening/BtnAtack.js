/// <reference path="../../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../../lib/three.d.ts"/>
/// <reference path="../../../../../lib/lib.ts"/>
/// <reference path="../../../../../imjcart/logic/value/GlobalValue.ts"/>
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
                (function (opening) {
                    var BtnAtack = (function (_super) {
                        __extends(BtnAtack, _super);
                        function BtnAtack(target) {
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

                            //
                            this._buttonImpl = new lib.button.SimpleButtonImpl(this.$target);
                            this._buttonImpl.addEventListener(lib.event.Event.BUTTON_CLICK_EVENT, function () {
                                _this.dispatchEvent("play_time_attack");
                            });
                        }
                        BtnAtack.prototype.open = function () {
                            this._displayImpl.open(0);
                        };

                        BtnAtack.prototype.close = function () {
                            this._displayImpl.close(0);
                        };
                        return BtnAtack;
                    })(lib.base.BaseDisplay);
                    opening.BtnAtack = BtnAtack;
                })(scene.opening || (scene.opening = {}));
                var opening = scene.opening;
            })(main.scene || (main.scene = {}));
            var scene = main.scene;
        })(display.main || (display.main = {}));
        var main = display.main;
    })(imjcart.display || (imjcart.display = {}));
    var display = imjcart.display;
})(imjcart || (imjcart = {}));
