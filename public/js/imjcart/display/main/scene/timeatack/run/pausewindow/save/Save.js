/// <reference path="../../../../../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../../../../../lib/three.d.ts"/>
/// <reference path="../../../../../../../../lib/lib.ts"/>
/// <reference path="../../../../../../../../imjcart/display/main/scene/timeatack/run/pausewindow/save/BtnSave.ts"/>
/// <reference path="../../../../../../../../imjcart/display/main/scene/timeatack/run/pausewindow/save/BtnTweet.ts"/>
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
                        (function (pausewindow) {
                            (function (save) {
                                var Save = (function (_super) {
                                    __extends(Save, _super);
                                    function Save(target) {
                                        var _this = this;
                                        _super.call(this, target);
                                        this._displayImpl = null;
                                        this._btnSave = null;
                                        this._btnTweet = null;
                                        this._$form = null;
                                        this._$progress = null;
                                        this._$complete = null;
                                        this._$completeRank = null;
                                        this._$completeLength = null;
                                        this._$completeLapTime = null;
                                        this._$completeName = null;
                                        this._$comment = null;
                                        this._$lapTime = null;
                                        this._$name = null;

                                        //
                                        this._btnSave = new save.BtnSave($("#sceneTimeAtackRunPauseWindowSaveBtnSave"));
                                        this._btnSave.addEventListener("save_laptime", function (evt) {
                                            _this._saveLapTime();
                                        });
                                        this._btnTweet = new save.BtnTweet($("#sceneTimeAtackRunPauseWindowSaveBtnTweet"));
                                        this._btnTweet.addEventListener("tweet_laptime", function (evt) {
                                            _this._tweetLapTime();
                                        });
                                        this._$form = $("#sceneTimeAtackRunPauseWindowSaveForm");
                                        this._$progress = $("#sceneTimeAtackRunPauseWindowSaveProgress");
                                        this._$complete = $("#sceneTimeAtackRunPauseWindowSaveComplete");
                                        this._$completeRank = $("#sceneTimeAtackRunPauseWindowSaveCompleteRank");
                                        this._$completeLength = $("#sceneTimeAtackRunPauseWindowSaveCompleteLength");
                                        this._$completeLapTime = $("#sceneTimeAtackRunPauseWindowSaveCompleteLapTime");
                                        this._$completeName = $("#sceneTimeAtackRunPauseWindowSaveCompleteName");
                                        this._$lapTime = $("#sceneTimeAtackRunPauseWindowSaveLapTime");
                                        this._$name = $("#sceneTimeAtackRunPauseWindowSaveName");
                                        this._$comment = $("#sceneTimeAtackRunPauseWindowSaveComment");

                                        //
                                        this._displayImpl = new lib.display.SimpleDisplayImpl(this.$target);
                                        this._displayImpl.addEventListener(lib.event.Event.DISPLAY_START_OPEN_EVENT, function () {
                                            _this._startOpen();
                                        });
                                        this._displayImpl.addEventListener(lib.event.Event.DISPLAY_COMPLETE_CLOSE_EVENT, function () {
                                            _this._completeClose();
                                        });
                                    }
                                    Save.prototype.open = function () {
                                        this._displayImpl.open(0);
                                    };

                                    Save.prototype.close = function () {
                                        this._displayImpl.close(0);
                                    };

                                    Save.prototype._startOpen = function () {
                                        var values = imjcart.logic.value.GlobalValue.getInstance();
                                        if (!values.lapTimeInfo || values.lapTimeInfo.time != values.fastestLapTime) {
                                            this._$form.css({
                                                display: "block"
                                            });
                                            this._$progress.css({
                                                display: "none"
                                            });
                                            this._$complete.css({
                                                display: "none"
                                            });
                                            this._btnSave.open();
                                            this._btnTweet.close();
                                            this._$comment.val("");
                                            if (values.name)
                                                this._$name.val(values.name);
                                            this._$lapTime.text(imjcart.logic.utility.Util.formatTime(values.fastestLapTime));
                                        } else {
                                            this._$form.css({
                                                display: "none"
                                            });
                                            this._$progress.css({
                                                display: "none"
                                            });
                                            this._$complete.css({
                                                display: "block"
                                            });
                                            this._btnTweet.open();
                                        }
                                    };

                                    Save.prototype._completeClose = function () {
                                        this._btnSave.close();
                                        this._btnTweet.close();
                                    };

                                    Save.prototype._saveLapTime = function () {
                                        // ラップタイム保存イベント
                                        var values = imjcart.logic.value.GlobalValue.getInstance();
                                        values.main.dispatchEvent(imjcart.logic.event.ProjectEvent.SAVE_LAPTIME_EVENT, {
                                            name: this._$name.val(),
                                            comment: this._$comment.val()
                                        });
                                        this._$form.css({
                                            display: "none"
                                        });
                                        this._$progress.css({
                                            display: "block"
                                        });
                                        this._$complete.css({
                                            display: "none"
                                        });
                                    };

                                    Save.prototype._tweetLapTime = function () {
                                        // ラップタイムツイート
                                        var values = imjcart.logic.value.GlobalValue.getInstance();
                                        var url = imjcart.logic.value.Const.TWEET_URL;
                                        var hash = imjcart.logic.value.Const.TWEET_HASHTAG;
                                        var time = imjcart.logic.utility.Util.formatTime(values.lapTimeInfo.time);
                                        var rank = values.lapTimeInfo.rank;
                                        var length = values.lapTimeInfo.length;
                                        var name = values.lapTimeInfo.name;
                                        var comment = "";
                                        if (values.lapTimeInfo.comment)
                                            comment = values.lapTimeInfo.comment;
                                        var text = name + " " + time + " (" + rank + "th/" + length + ") " + comment;
                                        text.replace(/[\n\r]/g, "");
                                        text = encodeURIComponent(text);
                                        window.open("http://twitter.com/share?text=" + text + "&hashtags=" + hash + "&url=" + url, "tweetwindow", "width=640, height=480, menubar=no, toolbar=no, scrollbars=no");
                                    };

                                    // ラップタイム保存完了
                                    Save.prototype.completeSaveLapTime = function () {
                                        var values = imjcart.logic.value.GlobalValue.getInstance();
                                        this._$completeRank.text(String(values.lapTimeInfo.rank));
                                        this._$completeLength.text(String(values.lapTimeInfo.length));
                                        this._$completeLapTime.text(imjcart.logic.utility.Util.formatTime(values.lapTimeInfo.time));
                                        this._$completeName.text(values.lapTimeInfo.name);
                                        this._$form.css({
                                            display: "none"
                                        });
                                        this._$progress.css({
                                            display: "none"
                                        });
                                        this._$complete.css({
                                            display: "block"
                                        });
                                        this._btnSave.close();
                                        this._btnTweet.open();
                                    };
                                    return Save;
                                })(lib.base.BaseDisplay);
                                save.Save = Save;
                            })(pausewindow.save || (pausewindow.save = {}));
                            var save = pausewindow.save;
                        })(run.pausewindow || (run.pausewindow = {}));
                        var pausewindow = run.pausewindow;
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
