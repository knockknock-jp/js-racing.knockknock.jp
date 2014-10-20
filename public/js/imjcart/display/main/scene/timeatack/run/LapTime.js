/// <reference path="../../../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../../../lib/three.d.ts"/>
/// <reference path="../../../../../../lib/lib.ts"/>
/// <reference path="../../../../../../imjcart/logic/value/Const.ts"/>
/// <reference path="../../../../../../imjcart/logic/utility/Util.ts"/>
/// <reference path="../../../../../../imjcart/display/main/scene/timeatack/run/BtnSave.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var imjcart;
(function (imjcart) {
    (function (_display) {
        (function (main) {
            (function (scene) {
                (function (timeatack) {
                    (function (run) {
                        var LapTime = (function (_super) {
                            __extends(LapTime, _super);
                            function LapTime(target) {
                                var _this = this;
                                _super.call(this, target);
                                this._displayImpl = null;
                                this._btnSave = null;
                                this._$current = $("#sceneTimeAtackRunLapTimeCurrent");
                                this._$fastest = $("#sceneTimeAtackRunLapTimeFastest");
                                this._$fastestTxt = $("#sceneTimeAtackRunLapTimeFastestTxt");
                                this._$list = $("#sceneTimeAtackRunLapTimeList");
                                this._$listItem = null;
                                this._isExixtFastest = false;

                                // 保存ボタン
                                this._btnSave = new run.BtnSave($("#sceneTimeAtackRunBtnSave"));
                                this._$listItem = this._$list.find("li").clone();
                                this._$list.empty();

                                //
                                this._displayImpl = new lib.display.SimpleDisplayImpl(this.$target);
                                this._displayImpl.addEventListener(lib.event.Event.DISPLAY_START_OPEN_EVENT, function () {
                                    _this.currentTime = 0;
                                });
                            }
                            LapTime.prototype.open = function () {
                                this._displayImpl.open(0);
                            };

                            LapTime.prototype.close = function () {
                                this._displayImpl.close(0);
                            };

                            Object.defineProperty(LapTime.prototype, "fastestLap", {
                                set: function (value) {
                                    if (!this._isExixtFastest) {
                                        this._isExixtFastest = true;
                                        this._$fastest.css({
                                            display: "block"
                                        });
                                        this._btnSave.open();
                                    }
                                    this._$fastestTxt.text(imjcart.logic.utility.Util.formatTime(value));
                                },
                                enumerable: true,
                                configurable: true
                            });

                            Object.defineProperty(LapTime.prototype, "currentTime", {
                                set: function (value) {
                                    this._$current.text(imjcart.logic.utility.Util.formatTime(value));
                                },
                                enumerable: true,
                                configurable: true
                            });

                            Object.defineProperty(LapTime.prototype, "lapTimeArr", {
                                set: function (arr) {
                                    // これまでのラップタイムを表示
                                    this._$list.empty();
                                    var j = 0;
                                    for (var i = arr.length - 1; 0 <= i; i--) {
                                        var time = arr[i];
                                        var $listItem = this._$listItem.clone();
                                        $listItem.find(".sceneTimeAtackRunLapTimeListLap").text(i + 1 + "");
                                        $listItem.find(".sceneTimeAtackRunLapTimeListTime").text(imjcart.logic.utility.Util.formatTime(time));
                                        this._$list.append($listItem);
                                        j++;
                                        if (imjcart.logic.value.Const.LAP_TIME_LIST_MAX <= j)
                                            break;
                                    }
                                },
                                enumerable: true,
                                configurable: true
                            });
                            return LapTime;
                        })(lib.base.BaseDisplay);
                        run.LapTime = LapTime;
                    })(timeatack.run || (timeatack.run = {}));
                    var run = timeatack.run;
                })(scene.timeatack || (scene.timeatack = {}));
                var timeatack = scene.timeatack;
            })(main.scene || (main.scene = {}));
            var scene = main.scene;
        })(_display.main || (_display.main = {}));
        var main = _display.main;
    })(imjcart.display || (imjcart.display = {}));
    var display = imjcart.display;
})(imjcart || (imjcart = {}));
