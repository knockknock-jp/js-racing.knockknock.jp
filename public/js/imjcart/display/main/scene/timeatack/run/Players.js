/// <reference path="../../../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../../../lib/three.d.ts"/>
/// <reference path="../../../../../../lib/lib.ts"/>
/// <reference path="../../../../../../imjcart/logic/value/Const.ts"/>
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
                        var Players = (function (_super) {
                            __extends(Players, _super);
                            //.sceneTimeAtackRunPlayersListColor
                            //.sceneTimeAtackRunPlayersListName
                            function Players(target) {
                                _super.call(this, target);
                                this._displayImpl = null;
                                this._$list = $("#sceneTimeAtackRunPlayersList");
                                this._$listItem = null;

                                //
                                this._$listItem = this._$list.find("li").clone();
                                this._$list.empty();

                                //
                                this._displayImpl = new lib.display.SimpleDisplayImpl(this.$target);
                            }
                            Players.prototype.open = function () {
                                this._displayImpl.open(0);
                            };

                            Players.prototype.close = function () {
                                this._displayImpl.close(0);
                            };

                            // 他の車追加
                            Players.prototype.addOtherCar = function (id) {
                                var values = imjcart.logic.value.GlobalValue.getInstance();
                                var i = 0, max;
                                for (i = 0, max = values.otherCarInfoArr.length; i < max; i = i + 1) {
                                    var info = values.otherCarInfoArr[i];
                                    if (info.id == id) {
                                        var $listItem = this._$listItem.clone();
                                        $listItem.attr("data-id", id);
                                        $listItem.find(".sceneTimeAtackRunPlayersListName").each(function () {
                                            $(this).text(info.name);
                                        });
                                        $listItem.find(".sceneTimeAtackRunPlayersListColor").each(function () {
                                            $(this).find("#wing").each(function () {
                                                $(this).find("rect").each(function () {
                                                    $(this).attr("style", "fill:" + info.colorWing);
                                                });
                                            });
                                            $(this).find("#driver").each(function () {
                                                $(this).find("ellipse").each(function () {
                                                    $(this).attr("style", "fill:" + info.colorDriver);
                                                });
                                            });
                                            $(this).find("#body").each(function () {
                                                $(this).find("path").each(function () {
                                                    $(this).attr("style", "fill:" + info.colorBody);
                                                });
                                            });
                                        });
                                        this._$list.append($listItem);
                                        return;
                                    }
                                }
                            };

                            // 他の車除去
                            Players.prototype.removeOtherCar = function (id) {
                                this._$list.find("li").each(function () {
                                    if ($(this).attr("data-id") == id) {
                                        $(this).remove();
                                        return;
                                    }
                                });
                            };
                            return Players;
                        })(lib.base.BaseDisplay);
                        run.Players = Players;
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
