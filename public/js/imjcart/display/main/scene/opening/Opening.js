/// <reference path="../../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../../lib/three.d.ts"/>
/// <reference path="../../../../../lib/lib.ts"/>
/// <reference path="../../../../../imjcart/logic/value/Const.ts"/>
/// <reference path="../../../../../imjcart/display/main/scene/opening/BtnAtack.ts"/>
/// <reference path="../../../../../imjcart/display/main/scene/opening/BtnColor.ts"/>
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
                    var Opening = (function (_super) {
                        __extends(Opening, _super);
                        function Opening(target) {
                            var _this = this;
                            _super.call(this, target);
                            this._displayImpl = null;
                            this._btnAtack = null;
                            this._btnColorBodyArr = [];
                            this._btnColorWingArr = [];
                            this._btnColorDriverArr = [];
                            this._$txt = null;
                            this._$img = null;
                            this._$name = null;

                            //
                            this._btnAtack = new opening.BtnAtack($("#sceneOpeningBtnTimeAtack"));
                            this._btnAtack.addEventListener("play_time_attack", function () {
                                _this._playTimeAttack();
                            });
                            this._$txt = $("#sceneOpeningTxt");
                            this._$img = $("#sceneOpeningImg");
                            this._$name = $("#sceneOpeningName");

                            //
                            var scope = this;
                            this.$target.find(".sceneOpeningBtnBodyColor").each(function () {
                                var btnColor = new opening.BtnColor($(this), imjcart.logic.value.Const.ID_COLOR_BODY, $(this).attr("data-color"));
                                scope._btnColorBodyArr.push(btnColor);
                            });
                            this.$target.find(".sceneOpeningBtnWingColor").each(function () {
                                var btnColor = new opening.BtnColor($(this), imjcart.logic.value.Const.ID_COLOR_WING, $(this).attr("data-color"));
                                scope._btnColorWingArr.push(btnColor);
                            });
                            this.$target.find(".sceneOpeningBtnDriverColor").each(function () {
                                var btnColor = new opening.BtnColor($(this), imjcart.logic.value.Const.ID_COLOR_DRIVER, $(this).attr("data-color"));
                                scope._btnColorDriverArr.push(btnColor);
                            });

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
                        Opening.prototype.open = function () {
                            this._displayImpl.open(0);
                        };

                        Opening.prototype.close = function () {
                            this._displayImpl.close(0);
                        };

                        Opening.prototype._completeOpen = function () {
                            this._btnAtack.open();
                            var i = 0, max;
                            for (i = 0, max = this._btnColorBodyArr.length; i < max; i = i + 1) {
                                this._btnColorBodyArr[i].open();
                            }
                            for (i = 0, max = this._btnColorWingArr.length; i < max; i = i + 1) {
                                this._btnColorWingArr[i].open();
                            }
                            for (i = 0, max = this._btnColorDriverArr.length; i < max; i = i + 1) {
                                this._btnColorDriverArr[i].open();
                            }

                            // カラー変更イベント
                            var values = imjcart.logic.value.GlobalValue.getInstance();
                            values.main.dispatchEvent(imjcart.logic.event.ProjectEvent.CHANGE_COLOR_EVENT, { id: imjcart.logic.value.Const.ID_COLOR_BODY, color: imjcart.logic.value.Const.DEFAULT_BODY_COLOR });
                            values.main.dispatchEvent(imjcart.logic.event.ProjectEvent.CHANGE_COLOR_EVENT, { id: imjcart.logic.value.Const.ID_COLOR_WING, color: imjcart.logic.value.Const.DEFAULT_WING_COLOR });
                            values.main.dispatchEvent(imjcart.logic.event.ProjectEvent.CHANGE_COLOR_EVENT, { id: imjcart.logic.value.Const.ID_COLOR_DRIVER, color: imjcart.logic.value.Const.DEFAULT_DRIVER_COLOR });
                        };

                        Opening.prototype._startClose = function () {
                            this._btnAtack.close();
                            var i = 0, max;
                            for (i = 0, max = this._btnColorBodyArr.length; i < max; i = i + 1) {
                                this._btnColorBodyArr[i].close();
                            }
                            for (i = 0, max = this._btnColorWingArr.length; i < max; i = i + 1) {
                                this._btnColorWingArr[i].close();
                            }
                            for (i = 0, max = this._btnColorDriverArr.length; i < max; i = i + 1) {
                                this._btnColorDriverArr[i].close();
                            }
                        };

                        Opening.prototype.onResize = function (width, height) {
                            if (width < imjcart.logic.value.Const.STAGE_WIDTH)
                                width = imjcart.logic.value.Const.STAGE_WIDTH;
                            if (height < imjcart.logic.value.Const.STAGE_HEIGHT)
                                height = imjcart.logic.value.Const.STAGE_HEIGHT;
                            this.$target.css({
                                width: width,
                                height: height - imjcart.logic.value.Const.FOOTER_HEIGHT - imjcart.logic.value.Const.RANKING_HEIGHT
                            });
                        };

                        Opening.prototype.setControllerUrl = function (url) {
                            var _this = this;
                            var login = imjcart.logic.value.Const.BITLY_USERNAME;
                            var apikey = imjcart.logic.value.Const.BITLY_API_KEY;
                            $.ajax({
                                type: "GET",
                                url: "http://api.bitly.com/v3/shorten?longUrl=" + url + "&login=" + login + "&apiKey=" + apikey + "&format=json",
                                dataType: "json",
                                success: function (json) {
                                    var url = json.data.url;

                                    // URL
                                    _this._setControllerUrlTxt(url);

                                    // QR
                                    _this._setControllerUrlQr(url);
                                }
                            });
                        };

                        Opening.prototype._setControllerUrlTxt = function (url) {
                            this._$txt.text(url);
                        };

                        Opening.prototype._setControllerUrlQr = function (url) {
                            this._$img.attr("src", "http://chart.apis.google.com/chart?chs=100x100&cht=qr&chl=" + url);
                        };

                        // ボディカラー変更
                        Opening.prototype.changeColorBody = function () {
                            var i = 0, max;
                            for (i = 0, max = this._btnColorBodyArr.length; i < max; i = i + 1) {
                                var btn = this._btnColorBodyArr[i];
                                if (btn.color == imjcart.logic.value.GlobalValue.getInstance().colorBody) {
                                    btn.setCurrent();
                                } else {
                                    btn.deleteCurrent();
                                }
                            }
                        };

                        // ウィングカラー変更
                        Opening.prototype.changeColorWing = function () {
                            var i = 0, max;
                            for (i = 0, max = this._btnColorWingArr.length; i < max; i = i + 1) {
                                var btn = this._btnColorWingArr[i];
                                if (btn.color == imjcart.logic.value.GlobalValue.getInstance().colorWing) {
                                    btn.setCurrent();
                                } else {
                                    btn.deleteCurrent();
                                }
                            }
                        };

                        // ドライバーカラー変更
                        Opening.prototype.changeColorDriver = function () {
                            var i = 0, max;
                            for (i = 0, max = this._btnColorDriverArr.length; i < max; i = i + 1) {
                                var btn = this._btnColorDriverArr[i];
                                if (btn.color == imjcart.logic.value.GlobalValue.getInstance().colorDriver) {
                                    btn.setCurrent();
                                } else {
                                    btn.deleteCurrent();
                                }
                            }
                        };

                        Opening.prototype._playTimeAttack = function () {
                            // 名前設定イベント
                            var values = imjcart.logic.value.GlobalValue.getInstance();
                            values.main.dispatchEvent(imjcart.logic.event.ProjectEvent.SET_NAME_EVENT, { name: this._$name.val() });

                            // シーン変更イベント
                            var values = imjcart.logic.value.GlobalValue.getInstance();
                            values.main.dispatchEvent(imjcart.logic.event.ProjectEvent.CHANGE_SCENE_EVENT, { id: imjcart.logic.value.Const.ID_SCENE_TIMEATACK });
                        };
                        return Opening;
                    })(lib.base.BaseDisplay);
                    opening.Opening = Opening;
                })(scene.opening || (scene.opening = {}));
                var opening = scene.opening;
            })(main.scene || (main.scene = {}));
            var scene = main.scene;
        })(display.main || (display.main = {}));
        var main = display.main;
    })(imjcart.display || (imjcart.display = {}));
    var display = imjcart.display;
})(imjcart || (imjcart = {}));
