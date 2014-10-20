/// <reference path="../../../lib/jquery.d.ts"/>
/// <reference path="../../../lib/lib.ts"/>
/// <reference path="../../../imjcart/logic/value/Const.ts"/>
/// <reference path="../../../imjcart/logic/value/GlobalValue.ts"/>
/// <reference path="../../../imjcart/logic/event/ProjectEvent.ts"/>

module imjcart {

    export module display {

        export module preloader {

            export class Preloader extends lib.base.BaseDisplay implements lib.display.IDisplay, lib.responisive.IResize {

                private _displayImpl:lib.display.IDisplay = null;
                private _$txt:JQuery = $("#preloaderTxt");
                private _$loaded:JQuery = $("#preloaderLoaded");
                private _$total:JQuery = $("#preloaderTotal");

                constructor(target:JQuery) {
                    super(target);
                    //
                    this._displayImpl = new lib.display.SimpleDisplayImpl(this.$target);
                    this._displayImpl.addEventListener(lib.event.Event.DISPLAY_START_OPEN_EVENT, () => {
                        lib.responisive.ResizeManager.getInstance().addEventListener(this);
                        lib.responisive.ResizeManager.getInstance().dispatchEvent(this);
                    });
                    this._displayImpl.addEventListener(lib.event.Event.DISPLAY_COMPLETE_CLOSE_EVENT, () => {
                        lib.responisive.ResizeManager.getInstance().removeEventListener(this);
                    });
                    //
                    // ---------- イベント ---------- //
                    //
                }

                public open() {
                    this._displayImpl.open(0);
                }

                public close() {
                    this._displayImpl.close(0);
                }

                public onResize(width:number, height:number):void {
                    this.$target.css({
                        width: width,
                        height: height - imjcart.logic.value.Const.FOOTER_HEIGHT
                    });
                    this._$txt.css({
                        position: "relative",
                        top: (height - imjcart.logic.value.Const.FOOTER_HEIGHT) / 2
                    });
                }

                public set total(value:number) {
                    this._$total.text(value + "");
                }

                public set loaded(value:number) {
                    this._$loaded.text(value + "");
                }

            }

        }

    }

}