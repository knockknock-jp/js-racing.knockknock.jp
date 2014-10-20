/// <reference path="../../../../../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../../../../../lib/three.d.ts"/>
/// <reference path="../../../../../../../../lib/lib.ts"/>
/// <reference path="../../../../../../../../imjcart/display/main/scene/timeatack/run/pausewindow/save/BtnSave.ts"/>
/// <reference path="../../../../../../../../imjcart/display/main/scene/timeatack/run/pausewindow/save/BtnTweet.ts"/>

module imjcart.display.main.scene.timeatack.run.pausewindow.save {

    export class Save extends lib.base.BaseDisplay implements lib.display.IDisplay {

        private _displayImpl:lib.display.IDisplay = null;
        private _btnSave:BtnSave = null;
        private _btnTweet:BtnTweet = null;
        private _$form:JQuery = null;
        private _$progress:JQuery = null;
        private _$complete:JQuery = null;
        private _$completeRank:JQuery = null;
        private _$completeLength:JQuery = null;
        private _$completeLapTime:JQuery = null;
        private _$completeName:JQuery = null;
        private _$comment:JQuery = null;
        private _$lapTime:JQuery = null;
        private _$name:JQuery = null;

        constructor(target:JQuery) {
            super(target);
            //
            this._btnSave = new BtnSave($("#sceneTimeAtackRunPauseWindowSaveBtnSave"));
            this._btnSave.addEventListener("save_laptime", (evt) => {
                this._saveLapTime();
            });
            this._btnTweet = new BtnTweet($("#sceneTimeAtackRunPauseWindowSaveBtnTweet"));
            this._btnTweet.addEventListener("tweet_laptime", (evt) => {
                this._tweetLapTime();
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
            this._displayImpl.addEventListener(lib.event.Event.DISPLAY_START_OPEN_EVENT, () => {
                this._startOpen();
            });
            this._displayImpl.addEventListener(lib.event.Event.DISPLAY_COMPLETE_CLOSE_EVENT, () => {
                this._completeClose();
            });
        }

        public open() {
            this._displayImpl.open(0);
        }

        public close() {
            this._displayImpl.close(0);
        }

        private _startOpen() {
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
                if (values.name) this._$name.val(values.name);
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
        }

        private _completeClose() {
            this._btnSave.close();
            this._btnTweet.close();
        }

        private _saveLapTime() {
            // ラップタイム保存イベント
            var values:imjcart.logic.value.GlobalValue = imjcart.logic.value.GlobalValue.getInstance();
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
        }

        private _tweetLapTime() {
            // ラップタイムツイート
            var values:imjcart.logic.value.GlobalValue = imjcart.logic.value.GlobalValue.getInstance();
            var url = imjcart.logic.value.Const.TWEET_URL;
            var hash = imjcart.logic.value.Const.TWEET_HASHTAG;
            var time = imjcart.logic.utility.Util.formatTime(values.lapTimeInfo.time);
            var rank = values.lapTimeInfo.rank;
            var length = values.lapTimeInfo.length;
            var name = values.lapTimeInfo.name;
            var comment = "";
            if (values.lapTimeInfo.comment) comment = values.lapTimeInfo.comment;
            var text = name + " " + time + " (" + rank + "th/" + length + ") " + comment;
            text.replace(/[\n\r]/g, "");
            text = encodeURIComponent(text);
            window.open("http://twitter.com/share?text=" + text + "&hashtags=" + hash + "&url=" + url, "tweetwindow", "width=640, height=480, menubar=no, toolbar=no, scrollbars=no")
        }

        // ラップタイム保存完了
        public completeSaveLapTime() {
            var values:imjcart.logic.value.GlobalValue = imjcart.logic.value.GlobalValue.getInstance();
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
        }

    }

}