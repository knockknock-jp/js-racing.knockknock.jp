/// <reference path="../../../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../../../lib/three.d.ts"/>
/// <reference path="../../../../../../lib/lib.ts"/>
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
                        var Message = (function (_super) {
                            __extends(Message, _super);
                            function Message(target) {
                                var _this = this;
                                _super.call(this, target);
                                this._displayImpl = null;
                                this._$txt = $("#sceneTimeAtackRunMessageTxt");
                                this._intervalId = null;

                                //
                                this._displayImpl = new lib.display.SimpleDisplayImpl(this.$target);
                                this._displayImpl.addEventListener(lib.event.Event.DISPLAY_START_OPEN_EVENT, function () {
                                    if (_this._intervalId)
                                        clearInterval(_this._intervalId);
                                    _this._intervalId = setInterval(function () {
                                        _this.close();
                                    }, 3000);
                                });
                                this._displayImpl.addEventListener(lib.event.Event.DISPLAY_COMPLETE_CLOSE_EVENT, function () {
                                    _this._$txt.empty();
                                });
                            }
                            Message.prototype.open = function () {
                                this._displayImpl.open(0);
                            };

                            Message.prototype.close = function () {
                                this._displayImpl.close(0);
                            };

                            Object.defineProperty(Message.prototype, "message", {
                                set: function (value) {
                                    this._$txt.text(value);
                                },
                                enumerable: true,
                                configurable: true
                            });
                            return Message;
                        })(lib.base.BaseDisplay);
                        run.Message = Message;
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
