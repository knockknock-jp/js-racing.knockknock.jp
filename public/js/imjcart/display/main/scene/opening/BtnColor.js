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
                    var BtnColor = (function (_super) {
                        __extends(BtnColor, _super);
                        function BtnColor(target, id, color) {
                            if (typeof id === "undefined") { id = null; }
                            if (typeof color === "undefined") { color = null; }
                            var _this = this;
                            _super.call(this, target);
                            this._displayImpl = null;
                            this._buttonImpl = null;
                            this._id = null;
                            this._color = null;
                            this._id = id;
                            this._color = color;
                            this.$target.css({
                                backgroundColor: color
                            });

                            //
                            this._displayImpl = new lib.display.SimpleDisplayImpl(this.$target);
                            this._displayImpl.addEventListener(lib.event.Event.DISPLAY_COMPLETE_OPEN_EVENT, function () {
                                _this._buttonImpl.setActive();
                                /*
                                if (this._id == imjcart.logic.value.Const.ID_COLOR_BODY && this._color == imjcart.logic.value.Const.DEFAULT_BODY_COLOR) {
                                this._buttonImpl.setCurrent();
                                } else if (this._id == imjcart.logic.value.Const.ID_COLOR_WING && this._color == imjcart.logic.value.Const.DEFAULT_WING_COLOR) {
                                this._buttonImpl.setCurrent();
                                } else if (this._id == imjcart.logic.value.Const.ID_COLOR_DRIVER && this._color == imjcart.logic.value.Const.DEFAULT_DRIVER_COLOR) {
                                this._buttonImpl.setCurrent();
                                }
                                */
                            });
                            this._displayImpl.addEventListener(lib.event.Event.DISPLAY_START_CLOSE_EVENT, function () {
                                _this._buttonImpl.deleteActive();
                            });

                            //
                            this._buttonImpl = new lib.button.SimpleButtonImpl(this.$target);
                            this._buttonImpl.addEventListener(lib.event.Event.BUTTON_CLICK_EVENT, function () {
                                // カラー変更イベント
                                var values = imjcart.logic.value.GlobalValue.getInstance();
                                values.main.dispatchEvent(imjcart.logic.event.ProjectEvent.CHANGE_COLOR_EVENT, { id: _this._id, color: _this._color });
                            });
                            this._buttonImpl.addEventListener(lib.event.Event.BUTTON_SET_CURRENT_EVENT, function () {
                                // カレント表示
                                _this.$target.addClass("current");
                            });
                            this._buttonImpl.addEventListener(lib.event.Event.BUTTON_DELETE_CURRENT_EVENT, function () {
                                // カレント解除
                                _this.$target.removeClass("current");
                            });
                        }
                        BtnColor.prototype.open = function () {
                            this._displayImpl.open(0);
                        };

                        BtnColor.prototype.close = function () {
                            this._displayImpl.close(0);
                        };

                        Object.defineProperty(BtnColor.prototype, "color", {
                            get: function () {
                                return this._color;
                            },
                            enumerable: true,
                            configurable: true
                        });

                        BtnColor.prototype.setCurrent = function () {
                            this._buttonImpl.setCurrent();
                        };

                        BtnColor.prototype.deleteCurrent = function () {
                            this._buttonImpl.deleteCurrent();
                        };
                        return BtnColor;
                    })(lib.base.BaseDisplay);
                    opening.BtnColor = BtnColor;
                })(scene.opening || (scene.opening = {}));
                var opening = scene.opening;
            })(main.scene || (main.scene = {}));
            var scene = main.scene;
        })(display.main || (display.main = {}));
        var main = display.main;
    })(imjcart.display || (imjcart.display = {}));
    var display = imjcart.display;
})(imjcart || (imjcart = {}));
