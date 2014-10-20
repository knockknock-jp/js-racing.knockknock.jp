/// <reference path="../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../lib/lib.ts"/>
/// <reference path="../../../../imjcart/logic/value/Const.ts"/>
/// <reference path="../../../../imjcart/logic/value/GlobalValue.ts"/>
/// <reference path="../../../../imjcart/logic/event/ProjectEvent.ts"/>
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
            (function (ranking) {
                var Ranking = (function (_super) {
                    __extends(Ranking, _super);
                    function Ranking(target) {
                        var _this = this;
                        _super.call(this, target);
                        this._displayImpl = null;
                        this._$list = null;
                        this._$listItem = null;

                        //
                        this._$list = $("#rankingList");
                        this._$listItem = this._$list.find("li:first-child").clone();
                        this._$list.empty();

                        //
                        this._displayImpl = new lib.display.SimpleDisplayImpl(this.$target);
                        this._displayImpl.addEventListener(lib.event.Event.DISPLAY_START_OPEN_EVENT, function () {
                            lib.responisive.ResizeManager.getInstance().addEventListener(_this);
                            lib.responisive.ResizeManager.getInstance().dispatchEvent(_this);
                        });
                        this._displayImpl.addEventListener(lib.event.Event.DISPLAY_COMPLETE_OPEN_EVENT, function () {
                            _this._completeOpen();
                        });
                        //
                        // ---------- イベント ---------- //
                        //
                    }
                    Ranking.prototype.open = function () {
                        this._displayImpl.open(0);
                    };

                    Ranking.prototype.close = function () {
                        this._displayImpl.close(0);
                    };

                    Ranking.prototype._completeOpen = function () {
                        // ランキングデータリクエストイベント
                        var values = imjcart.logic.value.GlobalValue.getInstance();
                        values.main.dispatchEvent(imjcart.logic.event.ProjectEvent.GET_RANKING_FROM_CLIENT_EVENT, { skip: 0, limit: 30 });
                    };

                    Ranking.prototype.onResize = function (width, height) {
                        var windowHeight = height;
                        if (windowHeight < imjcart.logic.value.Const.STAGE_HEIGHT)
                            windowHeight = imjcart.logic.value.Const.STAGE_HEIGHT;
                        var windowWidth = width;
                        if (windowWidth < imjcart.logic.value.Const.STAGE_WIDTH)
                            windowWidth = imjcart.logic.value.Const.STAGE_WIDTH;
                        var tagTop = windowHeight - imjcart.logic.value.Const.FOOTER_HEIGHT - imjcart.logic.value.Const.RANKING_HEIGHT;
                        this.$target.css({
                            position: "absolute",
                            top: tagTop,
                            left: 0,
                            width: windowWidth,
                            height: imjcart.logic.value.Const.RANKING_HEIGHT
                        });
                    };

                    // ランキングデータ受信
                    Ranking.prototype.receiveRanking = function () {
                        var values = imjcart.logic.value.GlobalValue.getInstance();

                        //
                        var targetTop = 0;
                        this._$list.empty();
                        var i = 0, max;
                        for (i = 0, max = values.lapTimeInfoArr.length; i < max; i = i + 1) {
                            var lapTimeInfo = values.lapTimeInfoArr[i];
                            var $listItem = this._$listItem.clone();
                            $listItem.find(".rankingListRank").each(function () {
                                $(this).text(String(i + 1));
                            });
                            $listItem.find(".rankingListTime").each(function () {
                                $(this).text(imjcart.logic.utility.Util.formatTime(lapTimeInfo.time));
                            });
                            $listItem.find(".rankingListName").each(function () {
                                $(this).text(lapTimeInfo.name);
                            });
                            $listItem.find(".rankingListComment").each(function () {
                                if (lapTimeInfo.comment && lapTimeInfo.comment != "null") {
                                    $(this).text(lapTimeInfo.comment);
                                }
                            });
                            this._$list.append($listItem);
                            if (values.socketId == lapTimeInfo.id) {
                                $listItem.addClass("ranking__list__current");
                                if (lapTimeInfo.time == values.fastestLapTime) {
                                    targetTop = $listItem.offset().top - this._$list.offset().top;
                                }
                            }
                        }
                        this._$list.scrollTop(targetTop);
                    };

                    // ラップタイム保存完了
                    Ranking.prototype.completeSaveLaptime = function () {
                        // ランキングデータリクエストイベント
                        var values = imjcart.logic.value.GlobalValue.getInstance();
                        values.main.dispatchEvent(imjcart.logic.event.ProjectEvent.GET_RANKING_FROM_CLIENT_EVENT, { skip: 0, limit: 30 });
                    };
                    return Ranking;
                })(lib.base.BaseDisplay);
                ranking.Ranking = Ranking;
            })(main.ranking || (main.ranking = {}));
            var ranking = main.ranking;
        })(display.main || (display.main = {}));
        var main = display.main;
    })(imjcart.display || (imjcart.display = {}));
    var display = imjcart.display;
})(imjcart || (imjcart = {}));
