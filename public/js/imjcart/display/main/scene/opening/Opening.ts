/// <reference path="../../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../../lib/three.d.ts"/>
/// <reference path="../../../../../lib/lib.ts"/>
/// <reference path="../../../../../imjcart/logic/value/Const.ts"/>
/// <reference path="../../../../../imjcart/display/main/scene/opening/BtnAtack.ts"/>
/// <reference path="../../../../../imjcart/display/main/scene/opening/BtnColor.ts"/>

module imjcart.display.main.scene.opening {

    export class Opening extends lib.base.BaseDisplay implements lib.display.IDisplay, lib.responisive.IResize {

        private _displayImpl:lib.display.IDisplay = null;
        private _btnAtack:BtnAtack = null;
        private _btnColorBodyArr:BtnColor[] = [];
        private _btnColorWingArr:BtnColor[] = [];
        private _btnColorDriverArr:BtnColor[] = [];
        private _$txt:JQuery = null;
        private _$img:JQuery = null;
        private _$name:JQuery = null;

        constructor(target:JQuery) {
            super(target);
            //
            this._btnAtack = new BtnAtack($("#sceneOpeningBtnTimeAtack"));
            this._btnAtack.addEventListener("play_time_attack", () => {
                this._playTimeAttack();
            });
            this._$txt = $("#sceneOpeningTxt");
            this._$img = $("#sceneOpeningImg");
            this._$name = $("#sceneOpeningName");
            //
            var scope = this;
            this.$target.find(".sceneOpeningBtnBodyColor").each(function() {
                var btnColor = new BtnColor($(this), imjcart.logic.value.Const.ID_COLOR_BODY, $(this).attr("data-color"));
                scope._btnColorBodyArr.push(btnColor);
            });
            this.$target.find(".sceneOpeningBtnWingColor").each(function() {
                var btnColor = new BtnColor($(this), imjcart.logic.value.Const.ID_COLOR_WING, $(this).attr("data-color"));
                scope._btnColorWingArr.push(btnColor);
            });
            this.$target.find(".sceneOpeningBtnDriverColor").each(function() {
                var btnColor = new BtnColor($(this), imjcart.logic.value.Const.ID_COLOR_DRIVER, $(this).attr("data-color"));
                scope._btnColorDriverArr.push(btnColor);
            });
            //
            this._displayImpl = new lib.display.SimpleDisplayImpl(this.$target);
            this._displayImpl.addEventListener(lib.event.Event.DISPLAY_START_OPEN_EVENT, () => {
                lib.responisive.ResizeManager.getInstance().addEventListener(this);
                lib.responisive.ResizeManager.getInstance().dispatchEvent(this);
            });
            this._displayImpl.addEventListener(lib.event.Event.DISPLAY_COMPLETE_OPEN_EVENT, () => {
                this._completeOpen();
            });
            this._displayImpl.addEventListener(lib.event.Event.DISPLAY_START_CLOSE_EVENT, () => {
                this._startClose();
            });
            this._displayImpl.addEventListener(lib.event.Event.DISPLAY_COMPLETE_CLOSE_EVENT, () => {
                lib.responisive.ResizeManager.getInstance().removeEventListener(this);
            });
        }

        public open() {
            this._displayImpl.open(0);
        }

        public close() {
            this._displayImpl.close(0);
        }

        private _completeOpen() {
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
            var values:imjcart.logic.value.GlobalValue = imjcart.logic.value.GlobalValue.getInstance();
            values.main.dispatchEvent(imjcart.logic.event.ProjectEvent.CHANGE_COLOR_EVENT, {id: imjcart.logic.value.Const.ID_COLOR_BODY, color: imjcart.logic.value.Const.DEFAULT_BODY_COLOR});
            values.main.dispatchEvent(imjcart.logic.event.ProjectEvent.CHANGE_COLOR_EVENT, {id: imjcart.logic.value.Const.ID_COLOR_WING, color: imjcart.logic.value.Const.DEFAULT_WING_COLOR});
            values.main.dispatchEvent(imjcart.logic.event.ProjectEvent.CHANGE_COLOR_EVENT, {id: imjcart.logic.value.Const.ID_COLOR_DRIVER, color: imjcart.logic.value.Const.DEFAULT_DRIVER_COLOR});
        }

        private _startClose() {
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
        }

        public onResize(width:number, height:number):void {
            if (width < imjcart.logic.value.Const.STAGE_WIDTH) width = imjcart.logic.value.Const.STAGE_WIDTH;
            if (height < imjcart.logic.value.Const.STAGE_HEIGHT) height = imjcart.logic.value.Const.STAGE_HEIGHT;
            this.$target.css({
                width: width,
                height: height - imjcart.logic.value.Const.FOOTER_HEIGHT - imjcart.logic.value.Const.RANKING_HEIGHT
            });
        }

        public setControllerUrl(url:string):void {
            var login = imjcart.logic.value.Const.BITLY_USERNAME;
            var apikey = imjcart.logic.value.Const.BITLY_API_KEY;
            $.ajax({
                type: "GET",
                url: "http://api.bitly.com/v3/shorten?longUrl=" + url + "&login=" + login + "&apiKey=" + apikey + "&format=json",
                dataType: "json",
                success: (json) => {
                    var url = json.data.url;
                    // URL
                    this._setControllerUrlTxt(url);
                    // QR
                    this._setControllerUrlQr(url)
                }
            });
        }

        private _setControllerUrlTxt(url:string):void {
            this._$txt.text(url);
        }

        private _setControllerUrlQr(url:string):void {
            this._$img.attr("src", "http://chart.apis.google.com/chart?chs=100x100&cht=qr&chl=" + url);
        }

        // ボディカラー変更
        public changeColorBody() {
            var i = 0, max;
            for (i = 0, max = this._btnColorBodyArr.length; i < max; i = i + 1) {
                var btn = this._btnColorBodyArr[i];
                if (btn.color == imjcart.logic.value.GlobalValue.getInstance().colorBody) {
                    btn.setCurrent();
                } else {
                    btn.deleteCurrent();
                }
            }
        }

        // ウィングカラー変更
        public changeColorWing() {
            var i = 0, max;
            for (i = 0, max = this._btnColorWingArr.length; i < max; i = i + 1) {
                var btn = this._btnColorWingArr[i];
                if (btn.color == imjcart.logic.value.GlobalValue.getInstance().colorWing) {
                    btn.setCurrent();
                } else {
                    btn.deleteCurrent();
                }
            }
        }

        // ドライバーカラー変更
        public changeColorDriver() {
            var i = 0, max;
            for (i = 0, max = this._btnColorDriverArr.length; i < max; i = i + 1) {
                var btn = this._btnColorDriverArr[i];
                if (btn.color == imjcart.logic.value.GlobalValue.getInstance().colorDriver) {
                    btn.setCurrent();
                } else {
                    btn.deleteCurrent();
                }
            }
        }

        private _playTimeAttack() {
            // 名前設定イベント
            var values:imjcart.logic.value.GlobalValue = imjcart.logic.value.GlobalValue.getInstance();
            values.main.dispatchEvent(imjcart.logic.event.ProjectEvent.SET_NAME_EVENT, {name: this._$name.val()});
            // シーン変更イベント
            var values:imjcart.logic.value.GlobalValue = imjcart.logic.value.GlobalValue.getInstance();
            values.main.dispatchEvent(imjcart.logic.event.ProjectEvent.CHANGE_SCENE_EVENT, {id: imjcart.logic.value.Const.ID_SCENE_TIMEATACK});
        }

    }

}