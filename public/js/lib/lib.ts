/// <reference path="jquery.d.ts"/>

module lib {

    export module event {

        export class Event {

            static RESIZE_EVENT:string = "resize_event";
            static SCROLL_EVENT:string = "scroll_event";
            static TIMER_EVENT:string = "timer_event";
            static TIMER_COMPLETE_EVENT:string = "timer_complete_event";
            static LOADER_ERROR_EVENT:string = "loader_error_event";
            static LOADER_PROGRESS_EVENT:string = "loader_progress_event";
            static LOADER_COMPLETE_EVENT:string = "loader_complete_event";
            static DISPLAY_START_OPEN_EVENT:string = "display_start_open_event";
            static DISPLAY_COMPLETE_OPEN_EVENT:string = "display_complete_open_event";
            static DISPLAY_START_CLOSE_EVENT:string = "display_start_close_event";
            static DISPLAY_COMPLETE_CLOSE_EVENT:string = "display_complete_close_event";
            static BUTTON_SET_OVER_EVENT:string = "button_set_over_event";
            static BUTTON_DELETE_OVER_EVENT:string = "button_delete_over_event";
            static BUTTON_SET_CURRENT_EVENT:string = "button_set_current_event";
            static BUTTON_DELETE_CURRENT_EVENT:string = "button_delete_current_event";
            static BUTTON_SET_ACTIVE_EVENT:string = "button_set_active_event";
            static BUTTON_DELETE_ACTIVE_EVENT:string = "button_delete_active_event";
            static BUTTON_CLICK_EVENT:string = "button_click_event";

        }

        class EventListener {

            public type:string = null;
            public callback:Function = null;

            constructor(type:string, callback:Function) {
                this.type = type;
                this.callback = callback;
            }

        }

        export interface IEventDispacher {

            dispatchEvent(type:string, object:any):void;
            addEventListener(type:string, callback:Function):void;
            removeEventListener(type:string, callback:Function):void;

        }

        export class EventDispacher implements IEventDispacher {

            private _$window:JQuery = null;
            private _listeners:Array<EventListener> = [];

            constructor() {
                var scope = this;
                this._$window = $(window);
                this._$window.on("scroll", function () {
                    scope.dispatchEvent(lib.event.Event.SCROLL_EVENT);
                });
                this._$window.on("resize", function () {
                    scope.dispatchEvent(lib.event.Event.RESIZE_EVENT);
                });
            }

            public dispatchEvent(type:string, object:any = null):void {
                if (type == lib.event.Event.RESIZE_EVENT) {
                    var width:number = this._$window.width();
                    var height:number = this._$window.height();
                    var i = 0, max;
                    for (i = 0, max = this._listeners.length; i < max; i = i + 1) {
                        var listener = this._listeners[i];
                        if (listener.type == type) {
                            listener.callback({width: width, height: height});
                        }
                    }
                } else if (type == lib.event.Event.SCROLL_EVENT) {
                    var top:number = this._$window.scrollTop();
                    var left:number = this._$window.scrollLeft();
                    var i = 0, max;
                    for (i = 0, max = this._listeners.length; i < max; i = i + 1) {
                        var listener = this._listeners[i];
                        if (listener.type == type) {
                            listener.callback({top: top, left: left});
                        }
                    }
                } else {
                    var i = 0, max;
                    for (i = 0, max = this._listeners.length; i < max; i = i + 1) {
                        var listener = this._listeners[i];
                        if (listener.type == type) {
                            if (object != null) {
                                listener.callback(object);
                            } else {
                                listener.callback();
                            }
                        }
                    }
                }
            }

            public addEventListener(type:string, callback:Function):void {
                var listener = new EventListener(type, callback);
                this._listeners.push(listener);
            }

            public removeEventListener(type:string, callback:Function):void {
                var arr = [];
                var i = 0, max;
                for (i = 0, max = this._listeners.length; i < max; i = i + 1) {
                    var listener = this._listeners[i];
                    if (listener.type != type || listener.callback != callback) {
                        arr.push(listener);
                    }
                }
                this._listeners = arr;
            }

        }

    }

    export module utility {

        export class PlatFormInfo {

            private static _instance:PlatFormInfo = null;
            private _ieVer:number = null;
            private _isTouchDevice:boolean = false;
            private _isSmartPhone:boolean = false;

            constructor() {
                PlatFormInfo._instance = this;
                var userAgent = window.navigator.userAgent.toLowerCase();
                var appVersion = window.navigator.appVersion.toLowerCase();
                if (userAgent.indexOf("msie") != -1 && appVersion.indexOf("msie 6.") != -1) {
                    this._ieVer = 6;
                } else if (userAgent.indexOf("msie") != -1 && appVersion.indexOf("msie 7.") != -1) {
                    this._ieVer = 7;
                } else if (userAgent.indexOf("msie") != -1 && appVersion.indexOf("msie 8.") != -1) {
                    this._ieVer = 8;
                } else {
                    this._ieVer = 9;
                }
                if (0 <= userAgent.indexOf("iphone") || 0 <= userAgent.indexOf("ipad") || 0 <= userAgent.indexOf("ipod") || 0 <= userAgent.indexOf("android")) {
                    this._isTouchDevice = true;
                } else {
                    this._isTouchDevice = false;
                }
                if (0 <= userAgent.indexOf("iphone") || 0 <= userAgent.indexOf("android")) {
                    this._isSmartPhone = true;
                } else {
                    this._isSmartPhone = false;
                }
            }

            public static getInstance():PlatFormInfo {
                if (PlatFormInfo._instance === null) {
                    PlatFormInfo._instance = new PlatFormInfo();
                }
                return PlatFormInfo._instance;
            }

            public getIeVer():number {
                return this._ieVer;
            }

            public getIsTouchDevice():boolean {
                return this._isTouchDevice;
            }

            public getIsSmartPhone():boolean {
                return this._isSmartPhone;
            }

        }

        export class Timer extends lib.event.EventDispacher {

            private _intervalId:number = null;
            private _count:number = null;
            private _duration:number = null;
            private _repeat:number = null;

            constructor(duration:number = null, repeat:number = 0) {
                super();
                if (duration != null) this._duration = duration;
                this._repeat = repeat;
            }

            public start(duration:number = null, repeat:number = null):void {
                if (duration != null) this._duration = duration;
                if (repeat != null) this._repeat = repeat;
                if (this._duration == null) return;
                //
                this._count = 0;
                var scope = this;
                this._intervalId = setInterval(function () {
                    scope._on();
                }, this._duration);
            }

            public reset():void {
                if (this._intervalId) {
                    clearInterval(this._intervalId);
                }
            }

            private _on():void {
                this.dispatchEvent(lib.event.Event.TIMER_EVENT, {count: this._count});
                if (0 < this._repeat && this._repeat - 1 <= this._count) {
                    this.reset();
                    this.dispatchEvent(lib.event.Event.TIMER_COMPLETE_EVENT, {count: this._count});
                }
                this._count++;
            }

        }

        export class ArrayUtility {

            public static shuffle(arr:any):any {
                var copy = [], n = arr.length, i;
                while (n) {
                    i = Math.floor(Math.random() * arr.length);
                    if (i in arr) {
                        copy.push(arr[i]);
                        delete arr[i];
                        n--;
                    }
                }
                return copy;
            }

        }

        export class SnsLinks {

            public static openTwWindow(url, txt, hash) {
                if (!url || !txt) return;
                txt = (hash) ? txt + " " + hash : txt;
                window.open("http://twitter.com/share?url=" + encodeURIComponent(url) + "&text=" + encodeURIComponent(txt), "twitter", "width=640, height=480, menubar=no, toolbar=no, scrollbars=yes");
            }

            public static openFbWindow(url) {
                window.open("http://www.facebook.com/share.php?u=" + encodeURIComponent(url) + "", "facebook", "width=640, height=480, menubar=no, toolbar=no, scrollbars=yes");
            }

        }

    }

    export module tween {

        export class Easing {

            // Linear
            static LINEAR:string = "linear";
            // 1 : SineCurve
            static EASE_IN_SINE:string = "easeInSine";
            static EASE_OUT_SINE:string = "easeOutSine";
            static EASE_INOUT_SINE:string = "easeInOutSine";
            // 2 : QuadraticCurve
            static EASE_IN_QUAD:string = "easeInQuad";
            static EASE_OUT_QUAD:string = "easeOutQuad";
            static EASE_INOUT_QUAD:string = "easeInOutQuad";
            // 3 : CubicCurve
            static EASE_IN_CUBIC:string = "easeInCubic";
            static EASE_OUT_CUBIC:string = "easeOutCubic";
            static EASE_INOUT_CUBIC:string = "easeInOutCubic";
            // 4 : QuarticCurve
            static EASE_IN_QUART:string = "easeInQuart";
            static EASE_OUT_QUART:string = "easeOutQuart";
            static EASE_INOUT_QUART:string = "easeInOutQuart";
            // 5 : QuinticCurve
            static EASE_IN_QUINT:string = "easeInQuint";
            static EASE_OUT_QUINT:string = "easeOutQuint";
            static EASE_INOUT_QUINT:string = "easeInOutQuint";
            // 6 : ExponentialCurve
            static EASE_IN_EXPO:string = "easeInExpo";
            static EASE_OUT_EXPO:string = "easeOutExpo";
            static EASE_INOUT_EXPO:string = "easeInOutExpo";
            // CircularCurve
            static EASE_IN_CIRC:string = "easeInCirc";
            static EASE_OUT_CIRC:string = "easeOutCirc";
            static EASE_INOUT_CIRC:string = "easeInOutCirc";
            // ElasticCurve
            static EASE_IN_ELASTIC:string = "easeInElastic";
            static EASE_OUT_ELASTIC:string = "easeOutElastic";
            static EASE_INOUT_ELASTIC:string = "easeInOutElastic";
            // Back
            static EASE_IN_BACK:string = "easeInBack";
            static EASE_OUT_BACK:string = "easeOutBack";
            static EASE_INOUT_BACK:string = "easeInOutBack";
            // Bounce
            static EASE_IN_BOUNCE:string = "easeInBounce";
            static EASE_OUT_BOUNCE:string = "easeOutBounce";
            static EASE_INOUT_BOUNCE:string = "easeInOutBounce";

        }

    }

    export module loader {

        export class ImageLoader extends lib.event.EventDispacher {

            private _$img:JQuery = null;
            private _src:string = null;
            private _isLoaded:boolean = false;

            constructor(src:string = null) {
                super();
                this._src = src;
            }

            public load(src:string = null):void {
                if (this._isLoaded) return;
                if (src && src != "") this._src = src;
                if (!this._src || this._src == "") {
                    this._error();
                } else {
                    if (this._$img == null) this._$img = $("<img>");
                    var scope = this;
                    this._$img.off("load").one("load", function () {
                        scope._complete();
                    });
                    this._$img.off("error").one("error", function () {
                        scope._error();
                    });
                    this._$img.attr("src", this._src);
                }
            }

            public unload():void {
                this._isLoaded = false;
                if (this._$img != null) {
                    this._$img.remove();
                    this._$img = null;
                }
            }

            private _complete():void {
                if (this._$img != null) {
                    this._$img.remove();
                    this._$img = null;
                }
                this._isLoaded = true;
                this.dispatchEvent(lib.event.Event.LOADER_COMPLETE_EVENT, {src: this._src});
            }

            private _error():void {
                this._isLoaded = true;
                this.dispatchEvent(lib.event.Event.LOADER_ERROR_EVENT, {src: this._src});
            }

        }

        export class ImagesLoader extends lib.event.EventDispacher {

            private _loaders:Array<lib.loader.ImageLoader> = [];
            public srcArr:Array<string> = [];
            private _timer:lib.utility.Timer = null;
            private _isLoaded:boolean = false;
            private _duration:number = null;
            private _loaded:number = null;
            private _total:number = null;

            constructor(arr:Array<string> = null, duration:number = 0) {
                super();
                this.srcArr = arr;
                this._duration = duration;
            }

            public load(arr:Array<string> = null, duration:number = 0):void {
                if (this._isLoaded) return;
                if (arr) this.srcArr = arr;
                if (0 < duration) this._duration = duration;
                if (1 <= this.srcArr.length) {
                    var scope = this;
                    var i = 0, max;
                    for (i = 0, max = this.srcArr.length; i < max; i = i + 1) {
                        var src = this.srcArr[i];
                        var loader = new lib.loader.ImageLoader(src);
                        loader.addEventListener(lib.event.Event.LOADER_ERROR_EVENT, function (evt) {
                            scope._errorLoad(evt)
                        });
                        loader.addEventListener(lib.event.Event.LOADER_COMPLETE_EVENT, function (evt) {
                            scope.completeLoad(evt);
                        });
                        this._loaders.push(loader);
                    }
                    this._total = this._loaders.length;
                    this._loaded = 0;
                    //
                    if (0 < this._duration) {
                        this._timer = new lib.utility.Timer(this._duration, this._total);
                        this._timer.addEventListener(lib.event.Event.TIMER_EVENT, function (evt) {
                            scope._startLoad(evt);
                        });
                        this._timer.start();
                    } else {
                        for (i = 0, max = this._loaders.length; i < max; i = i + 1) {
                            var loader = this._loaders[i];
                            loader.load();
                        }
                    }
                } else {
                    this.dispatchEvent(lib.event.Event.LOADER_COMPLETE_EVENT, {total: this._total});
                    this._isLoaded = true;
                }
            }

            public unload():void {
                this._isLoaded = false;
                var i = 0, max;
                for (i = 0, max = this._loaders.length; i < max; i = i + 1) {
                    var loader = this._loaders[i];
                    loader.unload();
                }
                this._loaders = [];
                if (this._timer) {
                    this._timer.reset();
                }
            }

            private _startLoad(evt:any) {
                var loader = this._loaders[evt.count];
                loader.load();
            }

            private _errorLoad(evt:any) {
                this._loaded++;
                this.dispatchEvent(lib.event.Event.LOADER_ERROR_EVENT, {src: evt.src, total: this._total, loaded: this._loaded});
                this._checkCompleteLoad();
            }

            public completeLoad(evt:any) {
                this._loaded++;
                this.dispatchEvent(lib.event.Event.LOADER_PROGRESS_EVENT, {src: evt.src, total: this._total, loaded: this._loaded});
                this._checkCompleteLoad();
            }

            private _checkCompleteLoad() {
                if (this._total <= this._loaded) {
                    this.dispatchEvent(lib.event.Event.LOADER_COMPLETE_EVENT, {total: this._total});
                    this._isLoaded = true;
                    this.unload();
                }
            }

        }

        export class ImagesLoader2 extends ImagesLoader {

            private _$images:Array<JQuery> = [];

            constructor(arr:any = null, duraiton:number = 0) {
                super(null, duraiton);
                var scope = this;
                //
                if (arr) {
                    this.srcArr = [];
                    this._$images = [];
                    var i = 0, max;
                    for (i = 0, max = arr.length; i < max; i = i + 1) {
                        var $item:any = arr[i];
                        $item.find("img[data-src]").each(function (i) {
                            scope.srcArr.push($(this).attr("data-src"));
                            scope._$images.push($(this));
                        });
                    }
                }
            }

            public load(arr:any = null, duraiton:number = 0):void {
                var scope = this;
                //
                if (arr) {
                    this.srcArr = [];
                    this._$images = [];
                    var i = 0, max;
                    for (i = 0, max = arr.length; i < max; i = i + 1) {
                        var $item:any = arr[i];
                        $item.find("img[data-src]").each(function (i) {
                            scope.srcArr.push($(this).attr("data-src"));
                            scope._$images.push($(this));
                        });
                    }
                }
                super.load(null, duraiton);
            }

            public completeLoad(evt:any) {
                var i = 0, max;
                for (i = 0, max = this._$images.length; i < max; i = i + 1) {
                    var $image = this._$images[i];
                    var src = $image.attr("data-src");
                    $image.removeAttr("data-src");
                    $image.attr("src", src);
                }
                //
                super.completeLoad(evt);
            }

        }

    }

    export module base {

        export class BaseDisplay extends lib.event.EventDispacher implements lib.event.IEventDispacher {

            public $target:JQuery = null;
            public id:string = null;

            constructor(target:JQuery, id:string = null, style:any = null) {
                super();
                //
                this.$target = target;
                if (id != null) {
                    this.id = id;
                } else {
                    this.id = "id" + new Date().getTime() + "_" + Math.floor(Math.random() * 10000);
                }
                if (style) this.setStyle(style);
            }

            public setStyle(style:any):void {
                this.$target.css(style);
            }

        }

        export class OpenCloseDisplay extends BaseDisplay implements lib.display.IDisplay {

            public displayImpl:lib.display.IDisplay = null;

            constructor(target:JQuery, displayImpl:lib.display.IDisplay = null, id:string = null, style:any = null) {
                super(target, id, style);
                if (displayImpl) {
                    this.displayImpl = displayImpl;
                    this.addDisplayEventListener();
                }
            }

            public addDisplayEventListener() {
                if (!this.displayImpl) return;
                var scope = this;
                this.displayImpl.addEventListener(lib.event.Event.DISPLAY_START_OPEN_EVENT, function () {
                    scope.startOpen();
                });
                this.displayImpl.addEventListener(lib.event.Event.DISPLAY_COMPLETE_OPEN_EVENT, function () {
                    scope.completeOpen();
                });
                this.displayImpl.addEventListener(lib.event.Event.DISPLAY_START_CLOSE_EVENT, function () {
                    scope.startClose();
                });
                this.displayImpl.addEventListener(lib.event.Event.DISPLAY_COMPLETE_OPEN_EVENT, function () {
                    scope.completeClose();
                });
            }

            public removeDisplayEventListener() {
                if (!this.displayImpl) return;
                var scope = this;
                this.displayImpl.removeEventListener(lib.event.Event.DISPLAY_START_OPEN_EVENT, function () {
                    scope.startOpen();
                });
                this.displayImpl.removeEventListener(lib.event.Event.DISPLAY_COMPLETE_OPEN_EVENT, function () {
                    scope.completeOpen();
                });
                this.displayImpl.removeEventListener(lib.event.Event.DISPLAY_START_CLOSE_EVENT, function () {
                    scope.startClose();
                });
                this.displayImpl.removeEventListener(lib.event.Event.DISPLAY_COMPLETE_OPEN_EVENT, function () {
                    scope.completeClose();
                });
            }

            public open(delay:number = 0):void {
                if (this.displayImpl) this.displayImpl.open(delay);
            }

            public close(delay:number = 0):void {
                if (this.displayImpl) this.displayImpl.close(delay);
            }

            //
            public startOpen():void {
            }

            public completeOpen():void {
            }

            public startClose():void {
            }

            public completeClose():void {
            }

        }

        export class OpenCloseButtonDisplay extends OpenCloseDisplay implements lib.display.IDisplay, lib.button.IButton {

            public buttonImpl:lib.button.IButton = null;

            constructor(target:JQuery, buttonImpl:lib.button.IButton = null, displayImpl:lib.display.IDisplay = null, id:string = null, style:any = null) {
                super(target, displayImpl, id, style);
                if (buttonImpl) {
                    this.buttonImpl = buttonImpl;
                    this.addButtonEventListener();
                }
            }

            public addButtonEventListener() {
                if (!this.buttonImpl) return;
                var scope = this;
                this.buttonImpl.addEventListener(lib.event.Event.BUTTON_CLICK_EVENT, function () {
                    scope.onClick();
                });
                this.buttonImpl.addEventListener(lib.event.Event.BUTTON_SET_ACTIVE_EVENT, function () {
                    scope.onSetActive();
                });
                this.buttonImpl.addEventListener(lib.event.Event.BUTTON_DELETE_ACTIVE_EVENT, function () {
                    scope.onDeleteActive();
                });
                this.buttonImpl.addEventListener(lib.event.Event.BUTTON_SET_CURRENT_EVENT, function () {
                    scope.onSetCurrent();
                });
                this.buttonImpl.addEventListener(lib.event.Event.BUTTON_DELETE_CURRENT_EVENT, function () {
                    scope.onDeleteCurrent();
                });
            }

            public removeButtonEventListener() {
                if (!this.buttonImpl) return;
                var scope = this;
                this.buttonImpl.removeEventListener(lib.event.Event.BUTTON_CLICK_EVENT, function () {
                    scope.onClick();
                });
                this.buttonImpl.removeEventListener(lib.event.Event.BUTTON_SET_ACTIVE_EVENT, function () {
                    scope.onSetActive();
                });
                this.buttonImpl.removeEventListener(lib.event.Event.BUTTON_DELETE_ACTIVE_EVENT, function () {
                    scope.onDeleteActive();
                });
                this.buttonImpl.removeEventListener(lib.event.Event.BUTTON_SET_CURRENT_EVENT, function () {
                    scope.onSetCurrent();
                });
                this.buttonImpl.removeEventListener(lib.event.Event.BUTTON_DELETE_CURRENT_EVENT, function () {
                    scope.onDeleteCurrent();
                });
            }

            public setActive():void {
                if (this.buttonImpl) this.buttonImpl.setActive();
            }

            public deleteActive():void {
                if (this.buttonImpl) this.buttonImpl.deleteActive();
            }

            public setCurrent():void {
                if (this.buttonImpl) this.buttonImpl.setCurrent();
            }

            public deleteCurrent():void {
                if (this.buttonImpl) this.buttonImpl.deleteCurrent();
            }

            //
            public onClick():void {
            }

            public onSetActive():void {
            }

            public onDeleteActive():void {
            }

            public onSetCurrent():void {
            }

            public onDeleteCurrent():void {
            }

        }

        export class ResponsiveDisplay extends BaseDisplay implements lib.event.IEventDispacher {

            constructor(target:JQuery, id:string = null, position:string = "relative") {
                super(target, id, position);
                //
                var scope = this;
                this.addEventListener(lib.event.Event.RESIZE_EVENT, function (evt) {
                    scope.onResize(evt);
                });
                this.addEventListener(lib.event.Event.SCROLL_EVENT, function (evt) {
                    scope.onScroll(evt);
                });
            }

            public onResize(evt):void {
            }

            public onScroll(evt):void {
            }

        }

    }

    export module display {

        class Const {

            static CLASS_NAME_OPEN:string = "open";
            static CLASS_NAME_CLOSE:string = "close";

        }

        export interface IDisplay extends lib.event.IEventDispacher {

            open(delay:number) :void;
            close(delay:number) :void;

        }

        export class AbsDisplayImpl extends lib.event.EventDispacher implements IDisplay {

            public $target:JQuery = null;
            public isOpen:boolean = false;
            private _intervalId:number = null;

            constructor(target:JQuery) {
                super();
                this.$target = target;
            }

            public open(delay:number = 0):void {
                if (this.isOpen) {
                    return;
                }
                this.isOpen = true;
                if (0 < delay) {
                    var scope = this;
                    if (this._intervalId) clearTimeout(this._intervalId);
                    setTimeout(function () {
                        scope.startOpen();
                    }, delay);
                } else {
                    this.startOpen();
                }
            }

            public startOpen():void {
                this.dispatchEvent(lib.event.Event.DISPLAY_START_OPEN_EVENT, {$target: this.$target});
                this.onOpen();
            }

            public onOpen():void {
                this.completeOpen();
            }

            public completeOpen():void {
                this.dispatchEvent(lib.event.Event.DISPLAY_COMPLETE_OPEN_EVENT, {$target: this.$target});
            }

            public close(delay:number = 0):void {
                if (!this.isOpen) {
                    return;
                }
                this.isOpen = false;
                if (0 < delay) {
                    var scope = this;
                    if (this._intervalId) clearTimeout(this._intervalId);
                    this._intervalId = setTimeout(function () {
                        scope.startClose();
                    }, delay);
                } else {
                    this.startClose();
                }
            }

            public startClose():void {
                this.dispatchEvent(lib.event.Event.DISPLAY_START_CLOSE_EVENT, {$target: this.$target});
                this.onClose();
            }

            public onClose():void {
                this.completeClose();
            }

            public completeClose():void {
                this.dispatchEvent(lib.event.Event.DISPLAY_COMPLETE_CLOSE_EVENT, {$target: this.$target});
            }

        }

        export class SimpleDisplayImpl extends AbsDisplayImpl implements IDisplay {

            constructor(target:JQuery) {
                super(target);
                this.$target.css({display: "none"});
            }

            public onOpen():void {
                this.$target.css({display: "block"});
                this.completeOpen();
            }

            public onClose():void {
                this.$target.css({display: "none"});
                this.completeClose();
            }

        }

        export class CssDisplayImpl extends AbsDisplayImpl implements IDisplay {

            constructor(target:JQuery) {
                super(target);
            }

            public onOpen():void {
                this.$target.addClass(Const.CLASS_NAME_OPEN);
                this.completeOpen();
            }

            public onClose():void {
                this.$target.addClass(Const.CLASS_NAME_CLOSE);
                this.completeClose();
            }

        }

        export class FadeDisplayImpl extends AbsDisplayImpl implements IDisplay {

            public duration:number = 500;
            public easing:string = "linear";

            constructor(target:JQuery) {
                super(target);
                this.$target.css({display: "none"});
            }

            public onOpen():void {
                var scope = this;
                this.$target.css({
                    display: "block",
                    opacity: 0
                }).animate({
                        opacity: 1
                    }, {
                        duration: this.duration,
                        easing: this.easing,
                        complete: function () {
                            scope.completeOpen();
                        }
                    });
            }

            public onClose():void {
                var scope = this;
                this.$target.animate({
                    opacity: 0
                }, {
                    duration: this.duration,
                    easing: this.easing,
                    complete: function () {
                        $(this).css({
                            display: "none"
                        });
                        scope.completeClose();
                    }
                });
            }

        }

    }

    export module button {

        class Const {

            static CLASS_NAME_OVER:string = "over";
            static CLASS_NAME_CURRENT:string = "current";

        }

        export interface IButton extends lib.event.IEventDispacher {

            setActive() :void;
            deleteActive() :void;
            setCurrent() :void;
            deleteCurrent() :void;

        }

        export class AbsButtonImpl extends lib.event.EventDispacher implements IButton {

            public $target:JQuery = null;
            public id:string = null;
            public isActive:boolean = false;
            public isCurrent:boolean = false;

            constructor(target:JQuery, id:string = null) {
                super();
                this.id = id;
                this.$target = target;
                this.$target.css({cursor: "default"});
                var scope = this;
                this.$target.on("click", function (evt:JQueryEventObject) {
                    evt.preventDefault();
                    if (scope.isActive) {
                        scope.onClick(evt);
                    }
                });
                this.$target.on("mouseenter", function (evt:JQueryEventObject) {
                    if (!scope.isCurrent && scope.isActive) {
                        scope.onOver(evt);
                    }
                });
                this.$target.on("mouseleave", function (evt:JQueryEventObject) {
                    if (!scope.isCurrent && scope.isActive) {
                        scope.onOut(evt);
                    }
                });
            }

            public setActive():void {
                if (this.isActive) {
                    return;
                }
                this.isActive = true;
                this.$target.css({cursor: "pointer"});
                this.dispatchEvent(lib.event.Event.BUTTON_SET_ACTIVE_EVENT, {$target: this.$target, id: this.id});
            }

            public deleteActive():void {
                if (!this.isActive) {
                    return;
                }
                this.isActive = false;
                this.$target.css({cursor: "default"});
                this.dispatchEvent(lib.event.Event.BUTTON_DELETE_ACTIVE_EVENT, {$target: this.$target, id: this.id});
            }

            public setCurrent():void {
                if (this.isCurrent) {
                    return;
                }
                this.isCurrent = true;
                this.dispatchEvent(lib.event.Event.BUTTON_SET_CURRENT_EVENT, {$target: this.$target, id: this.id});
            }

            public deleteCurrent():void {
                if (!this.isCurrent) {
                    return;
                }
                this.isCurrent = false;
                this.dispatchEvent(lib.event.Event.BUTTON_DELETE_CURRENT_EVENT, {$target: this.$target, id: this.id});
            }

            public onOver(evt:JQueryEventObject):void {
                this.dispatchEvent(lib.event.Event.BUTTON_SET_OVER_EVENT, {$target: this.$target, id: this.id});
            }

            public onOut(evt:JQueryEventObject):void {
                this.dispatchEvent(lib.event.Event.BUTTON_DELETE_OVER_EVENT, {$target: this.$target, id: this.id});
            }

            public onClick(evt:JQueryEventObject):void {
                this.dispatchEvent(lib.event.Event.BUTTON_CLICK_EVENT, {$target: this.$target, id: this.id});
            }

        }

        export class SimpleButtonImpl extends AbsButtonImpl implements IButton {

            constructor(target:JQuery) {
                super(target);
            }

            public setActive():void {
                super.setActive();
                //
            }

            public deleteActive():void {
                super.deleteActive();
                //
            }

            public setCurrent():void {
                super.setCurrent();
                //
            }

            public deleteCurrent():void {
                super.deleteCurrent();
                //
            }

            public onOver(evt:JQueryEventObject):void {
                super.onOver(evt);
                //
            }

            public onOut(evt:JQueryEventObject):void {
                super.onOut(evt);
                //
            }

            public onClick(evt:JQueryEventObject):void {
                super.onClick(evt);
                //
            }

        }

        export class CssButtonImpl extends AbsButtonImpl implements IButton {

            constructor(target:JQuery) {
                super(target);
            }

            public setActive():void {
                super.setActive();
                //
            }

            public deleteActive():void {
                super.deleteActive();
                //
            }

            public setCurrent():void {
                super.setCurrent();
                //
                this.$target.addClass(Const.CLASS_NAME_CURRENT);
                this.$target.removeClass(Const.CLASS_NAME_OVER);
            }

            public deleteCurrent():void {
                super.deleteCurrent();
                //
                this.$target.removeClass(Const.CLASS_NAME_CURRENT);
                this.$target.removeClass(Const.CLASS_NAME_OVER);
            }

            public onOver(evt:JQueryEventObject):void {
                super.onOver(evt);
                //
                this.$target.addClass(Const.CLASS_NAME_OVER);
            }

            public onOut(evt:JQueryEventObject):void {
                super.onOut(evt);
                //
                this.$target.removeClass(Const.CLASS_NAME_OVER);
            }

            public onClick(evt:JQueryEventObject):void {
                super.onClick(evt);
                //
            }

        }

    }

    export module responisive {

        export interface IResize {

            id:string;
            onResize(width:number, height:number):void;

        }

        export class ResizeManager {

            private static _instance:ResizeManager = null;
            private _listeners:Array<IResize> = null;
            private _$window:JQuery = null;
            private _width:number = null;
            private _height:number = null;

            constructor() {
                ResizeManager._instance = this;
                this._listeners = [];
                var scope = this;
                this._$window = $(window);
                this._$window.on("resize", function () {
                    scope.onResize();
                });
                this._width = this._$window.width();
                this._height = this._$window.height();
            }

            public static getInstance():ResizeManager {
                if (ResizeManager._instance === null) {
                    ResizeManager._instance = new ResizeManager();
                }
                return ResizeManager._instance;
            }

            public dispatchEvent(listener:IResize = null):void {
                if (listener != null) {
                    listener.onResize(this._width, this._height)
                } else {
                    this.onResize();
                }
            }

            public addEventListener(listener:IResize):void {
                var flg:boolean = true;
                var i = 0, max;
                for (i = 0, max = this._listeners.length; i < max; i = i + 1) {
                    if (this._listeners[i].id == listener.id) {
                        flg = false;
                        break;
                    }
                }
                if (flg) {
                    this._listeners.push(listener);
                }
            }

            public removeEventListener(listener:IResize):void {
                return;
                var arr = [];
                var i = 0, max;
                for (i = 0, max = this._listeners.length; i < max; i = i + 1) {
                    if (this._listeners[i].id != listener.id) {
                        arr.push(listener);
                    }
                }
                this._listeners = arr;
            }

            public onResize():void {
                this._width = this._$window.width();
                this._height = this._$window.height();
                var i = 0, max;
                for (i = 0, max = this._listeners.length; i < max; i = i + 1) {
                    this._listeners[i].onResize(this._width, this._height);
                }
            }

        }

        export interface IScroll {

            id:string;
            onScroll(top:number, left:number):void;

        }

        export class ScrollManager {

            private static _instance:ScrollManager = null;
            private _listeners:Array<IScroll> = null;
            private _$window:JQuery = null;
            private _top:number = null;
            private _left:number = null;

            constructor() {
                ScrollManager._instance = this;
                this._listeners = [];
                var scope = this;
                this._$window = $(window);
                this._$window.on("scroll", function () {
                    scope.onScroll();
                });
                this._top = this._$window.scrollTop();
                this._left = this._$window.scrollLeft();
            }

            public static getInstance():ScrollManager {
                if (ScrollManager._instance === null) {
                    ScrollManager._instance = new ScrollManager();
                }
                return ScrollManager._instance;
            }

            public dispatchEvent(listener:IScroll = null):void {
                if (listener != null) {
                    listener.onScroll(this._top, this._left);
                } else {
                    this.onScroll();
                }
            }

            public addEventListener(listener:IScroll):void {
                var flg:boolean = true;
                var i = 0, max;
                for (i = 0, max = this._listeners.length; i < max; i = i + 1) {
                    if (this._listeners[i].id == listener.id) {
                        flg = false;
                        break;
                    }
                }
                if (flg) {
                    this._listeners.push(listener);
                }
            }

            public removeEventListener(listener:IScroll):void {
                var arr = [];
                var i = 0, max;
                for (i = 0, max = this._listeners.length; i < max; i = i + 1) {
                    if (this._listeners[i].id != listener.id) {
                        arr.push(listener);
                    }
                }
                this._listeners = arr;
            }

            public onScroll():void {
                this._top = this._$window.scrollTop();
                this._left = this._$window.scrollLeft();
                var i = 0, max;
                for (i = 0, max = this._listeners.length; i < max; i = i + 1) {
                    this._listeners[i].onScroll(this._top, this._left);
                }
            }

        }

    }

    export module collection {

        export class DisplayInfo {

            public id:string;
            public display:any;
            public displayImpl:lib.display.IDisplay = null;
            public buttonImpl:lib.button.IButton = null;
            public $target:JQuery = null;

            constructor(id:string, display:any, displayImpl:lib.display.IDisplay = null, buttonImpl:lib.button.IButton = null, $target:JQuery = null) {

                this.id = id;
                this.display = display;
                if (displayImpl) this.displayImpl = displayImpl;
                if (buttonImpl) this.buttonImpl = buttonImpl;
                if ($target) this.$target = $target;

            }

        }

        export class DisplayCollection {

            private _collection:Array<DisplayInfo> = [];

            constructor(collection:Array<DisplayInfo> = null) {

                if (collection) this._collection = collection;

            }

            public getLength():number {
                return this._collection.length;
            }

            public getInfo(index:number):DisplayInfo {
                return this._collection[index];
            }

            public getInfoById(id:string):DisplayInfo {
                var i = 0, max;
                for (i = 0, max = this._collection.length; i < max; i = i + 1) {
                    var info = this._collection[i];
                    if (info.id == id) {
                        return info;
                    }
                }
                return null;
            }

            public pushInfo(info:DisplayInfo):void {
                this._collection.push(info);
            }

        }

    }

}