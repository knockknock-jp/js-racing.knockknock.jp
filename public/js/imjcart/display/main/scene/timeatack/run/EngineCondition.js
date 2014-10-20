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
                        var EngineCondition = (function (_super) {
                            __extends(EngineCondition, _super);
                            function EngineCondition(target) {
                                var _this = this;
                                _super.call(this, target);
                                this._displayImpl = null;
                                this._$mater = $("#sceneTimeAtackRunEngineConditionMater");
                                this._$speed = $("#sceneTimeAtackRunEngineConditionSpeedTxt");
                                this._rotation = null;
                                this._speed = null;
                                this._intervalId = null;

                                //
                                this._displayImpl = new lib.display.SimpleDisplayImpl(this.$target);
                                this._displayImpl.addEventListener(lib.event.Event.DISPLAY_START_OPEN_EVENT, function () {
                                    _this.speed = 0;
                                    _this.power = 0;
                                    _this.gear = 0;
                                    _this.direction = 0;
                                });
                            }
                            EngineCondition.prototype.open = function () {
                                var _this = this;
                                this._displayImpl.open(0);

                                //
                                if (this._intervalId)
                                    clearInterval(this._intervalId);
                                this._intervalId = setInterval(function () {
                                    _this._$mater.attr("transform", "rotate(" + _this._rotation + " 100 100)");
                                    _this._$speed.text(String(_this._speed));
                                }, 1000 / 10);
                            };

                            EngineCondition.prototype.close = function () {
                                this._displayImpl.close(0);
                            };

                            Object.defineProperty(EngineCondition.prototype, "speed", {
                                set: function (value) {
                                    this._rotation = Math.floor((180 * (Math.abs(value) * 0.5)) + 45);
                                    this._speed = Math.floor(Math.abs(value) * 100);
                                    //this._$mater.attr("transform", "rotate(" + Math.floor((180 * (Math.abs(value) * 0.5)) + 45) + " 100 100)");
                                },
                                enumerable: true,
                                configurable: true
                            });

                            Object.defineProperty(EngineCondition.prototype, "power", {
                                set: function (value) {
                                },
                                enumerable: true,
                                configurable: true
                            });

                            Object.defineProperty(EngineCondition.prototype, "gear", {
                                set: function (value) {
                                },
                                enumerable: true,
                                configurable: true
                            });

                            Object.defineProperty(EngineCondition.prototype, "direction", {
                                set: function (value) {
                                },
                                enumerable: true,
                                configurable: true
                            });
                            return EngineCondition;
                        })(lib.base.BaseDisplay);
                        run.EngineCondition = EngineCondition;
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
