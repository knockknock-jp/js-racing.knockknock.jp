/// <reference path="../../../lib/jquery.d.ts"/>
/// <reference path="../../../lib/lib.ts"/>
/// <reference path="../../../imjcart/logic/value/Const.ts"/>
/// <reference path="../../../imjcart/logic/value/GlobalValue.ts"/>
/// <reference path="../../../imjcart/logic/event/ProjectEvent.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var imjcart;
(function (imjcart) {
    (function (display) {
        (function (preloader) {
            var Preloader = (function (_super) {
                __extends(Preloader, _super);
                function Preloader(target) {
                    var _this = this;
                    _super.call(this, target);
                    this._displayImpl = null;
                    this._$txt = $("#preloaderTxt");
                    this._$loaded = $("#preloaderLoaded");
                    this._$total = $("#preloaderTotal");

                    //
                    this._displayImpl = new lib.display.SimpleDisplayImpl(this.$target);
                    this._displayImpl.addEventListener(lib.event.Event.DISPLAY_START_OPEN_EVENT, function () {
                        lib.responisive.ResizeManager.getInstance().addEventListener(_this);
                        lib.responisive.ResizeManager.getInstance().dispatchEvent(_this);
                    });
                    this._displayImpl.addEventListener(lib.event.Event.DISPLAY_COMPLETE_CLOSE_EVENT, function () {
                        lib.responisive.ResizeManager.getInstance().removeEventListener(_this);
                    });
                    //
                    // ---------- イベント ---------- //
                    //
                }
                Preloader.prototype.open = function () {
                    this._displayImpl.open(0);
                };

                Preloader.prototype.close = function () {
                    this._displayImpl.close(0);
                };

                Preloader.prototype.onResize = function (width, height) {
                    this.$target.css({
                        width: width,
                        height: height - imjcart.logic.value.Const.FOOTER_HEIGHT
                    });
                    this._$txt.css({
                        position: "relative",
                        top: (height - imjcart.logic.value.Const.FOOTER_HEIGHT) / 2
                    });
                };

                Object.defineProperty(Preloader.prototype, "total", {
                    set: function (value) {
                        this._$total.text(value + "");
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(Preloader.prototype, "loaded", {
                    set: function (value) {
                        this._$loaded.text(value + "");
                    },
                    enumerable: true,
                    configurable: true
                });
                return Preloader;
            })(lib.base.BaseDisplay);
            preloader.Preloader = Preloader;
        })(display.preloader || (display.preloader = {}));
        var preloader = display.preloader;
    })(imjcart.display || (imjcart.display = {}));
    var display = imjcart.display;
})(imjcart || (imjcart = {}));
