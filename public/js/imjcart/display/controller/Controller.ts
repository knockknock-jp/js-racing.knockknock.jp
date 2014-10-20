/// <reference path="../../../lib/jquery.d.ts"/>
/// <reference path="../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../lib/three.d.ts"/>
/// <reference path="../../../lib/lib.ts"/>
/// <reference path="../../../imjcart/logic/socket/SocketController.ts"/>
/// <reference path="../../../imjcart/logic/value/Const.ts"/>
/// <reference path="../../../imjcart/logic/value/GlobalValue.ts"/>
/// <reference path="../../../imjcart/logic/event/ProjectEvent.ts"/>
/// <reference path="../../../imjcart/logic/info/OtherCarInfo.ts"/>
/// <reference path="../../../imjcart/display/main/view3d/View3d.ts"/>
/// <reference path="../../../imjcart/display/main/scene/Scene.ts"/>

module imjcart {

    export module display {

        export module controller {

            export class Controller extends lib.base.BaseDisplay implements lib.display.IDisplay, lib.responisive.IResize {

                private _displayImpl:lib.display.IDisplay = null;
                private _window:any = null;
                private _id:string = null;
                private _isPortait:boolean = true;
                private _slope:string = null;
                private _socket:imjcart.logic.socket.SocketController = null;
                private _$boxOpening:JQuery = null;
                private _$boxController:JQuery = null;
                private _$boxError:JQuery = null;
                private _$btnPlay:JQuery = null;
                private _$btnCamera:JQuery = null;
                private _$btnHandleLeft:JQuery = null;
                private _$btnHandleRight:JQuery = null;
                private _$btnAccelerator:JQuery = null;
                private _$btnBack:JQuery = null;
                private _startTouchEvent = null;
                private _endTouchEvent = null;

                constructor(target:JQuery) {
                    super(target);
                    //
                    var values:imjcart.logic.value.GlobalValue = imjcart.logic.value.GlobalValue.getInstance();
                    values.controller = this;
                    //
                    this._$boxOpening = $("#boxOpening");
                    this._$boxController = $("#boxController");
                    this._$boxError = $("#boxError");
                    this._$btnPlay = $("#btnPlay");
                    this._$btnCamera = $("#btnCamera");
                    this._$btnHandleLeft = $("#btnHandleLeft");
                    this._$btnHandleRight = $("#btnHandleRight");
                    this._$btnAccelerator = $("#btnAccelerator");
                    this._$btnBack = $("#btnBack");
                    // socket.io
                    this._socket = new imjcart.logic.socket.SocketController();
                    //
                    this._id = $("#id").text();
                    var isTouch = ("ontouchstart" in window);
                    this._startTouchEvent = (isTouch) ? "touchstart" : "mousedown";
                    this._endTouchEvent = (isTouch) ? "touchend" : "mouseup";
                    //
                    this._displayImpl = new lib.display.SimpleDisplayImpl(this.$target);
                    this._displayImpl.addEventListener(lib.event.Event.DISPLAY_START_OPEN_EVENT, () => {
                        lib.responisive.ResizeManager.getInstance().addEventListener(this);
                        lib.responisive.ResizeManager.getInstance().dispatchEvent(this);
                    });
                    this._displayImpl.addEventListener(lib.event.Event.DISPLAY_COMPLETE_OPEN_EVENT, () => {
                        this._completeOpen();
                    });
                    //
                    // ---------- イベント ---------- //
                    //
                    // 開始イベント
                    this.addEventListener(imjcart.logic.event.ProjectEvent.CONTROLLER_START_EVENT, (evt) => {
                        this._$boxOpening.css({
                            display: "none"
                        });
                        this._$boxController.css({
                            display: "block"
                        });
                    });
                    // エラー表示イベント
                    this.addEventListener(imjcart.logic.event.ProjectEvent.CONTROLLER_ERROR_EVENT, (evt) => {
                        this._$boxOpening.css({
                            display: "none"
                        });
                        this._$boxController.css({
                            display: "none"
                        });
                        this._$boxError.css({
                            display: "block"
                        })
                    });
                    //
                    this._$btnPlay.on("click", (evt) => {
                        evt.preventDefault();
                        this._play();
                    });
                    //
                    this._$btnCamera.on(this._startTouchEvent, (evt) => {
                        evt.preventDefault();
                        this._changeCameraAngle();
                        this._$btnCamera.addClass("active");
                    });
                    this._$btnCamera.on(this._endTouchEvent, (evt) => {
                        evt.preventDefault();
                        this._$btnCamera.removeClass("active");
                    });
                    //
                    this._$btnHandleLeft.on(this._startTouchEvent, (evt) => {
                        evt.preventDefault();
                        this._setSteeringAngleLeft();
                    });
                    this._$btnHandleLeft.on(this._endTouchEvent, (evt) => {
                        evt.preventDefault();
                        this._clearSteeringAngle();
                    });
                    //
                    this._$btnHandleRight.on(this._startTouchEvent, (evt) => {
                        evt.preventDefault();
                        this._setSteeringAngleRight();
                    });
                    this._$btnHandleRight.on(this._endTouchEvent, (evt) => {
                        evt.preventDefault();
                        this._clearSteeringAngle();
                    });
                    //
                    this._$btnAccelerator.on(this._startTouchEvent, (evt) => {
                        evt.preventDefault();
                        this._startEngine({
                            value: 1
                        });
                        this._$btnAccelerator.addClass("active");
                    });
                    this._$btnAccelerator.on(this._endTouchEvent, (evt) => {
                        evt.preventDefault();
                        this._stopEngine();
                        this._$btnAccelerator.removeClass("active");
                    });
                    //
                    this._$btnBack.on(this._startTouchEvent, (evt) => {
                        evt.preventDefault();
                        this._startEngine({
                            value: -1
                        });
                        this._$btnBack.addClass("active");
                    });
                    this._$btnBack.on(this._endTouchEvent, (evt) => {
                        evt.preventDefault();
                        this._stopEngine();
                        this._$btnBack.removeClass("active");
                    });
                    //
                    this._window = window;
                    $(this._window).bind("load orientationchange", (evt) => {
                        evt.preventDefault();
                        if (Math.abs(this._window.orientation) === 90) {
                            this._isPortait = false;
                        } else {
                            this._isPortait = true;
                        }
                    });
                    this._window.addEventListener("devicemotion", (evt) => {
                        evt.preventDefault();
                        var x = evt.accelerationIncludingGravity.x; //横方向の傾斜
                        var y = evt.accelerationIncludingGravity.y; //縦方法の傾斜
                        //var z = evt.accelerationIncludingGravity.z; //上下方向の傾斜
                        var slope = "center";
                        if (this._isPortait) {
                            if (x <= -4) {
                                slope = "left";
                            } else if (4 <= x) {
                                slope = "right";
                            }
                        } else {
                            if (0 <= x) {
                                if (y <= -4) {
                                    slope = "left";
                                } else if (4 <= y) {
                                    slope = "right";
                                }
                            } else {
                                if (y <= -4) {
                                    slope = "right";
                                } else if (4 <= y) {
                                    slope = "left";
                                }
                            }
                        }
                        if (this._slope != slope) {
                            this._slope = slope;
                            this._changeSteeringAngle();
                        }
                    }, false);

                }

                public open() {
                    this._displayImpl.open(0);
                }

                public close() {
                    this._displayImpl.close(0);
                }

                private _completeOpen() {
                    this._$boxOpening.css({
                        display: "block"
                    })
                }

                public onResize(width:number, height:number):void {
                    this.$target.css({
                        width: width,
                        height: height
                    });
                    this._$btnCamera.css({
                        height: (height - 40) / 3
                    });
                    this._$btnHandleLeft.css({
                        height: (height - 40) / 3
                    });
                    this._$btnHandleRight.css({
                        height: (height - 40) / 3
                    });
                    this._$btnAccelerator.css({
                        height: (height - 40) / 3
                    });
                    this._$btnBack.css({
                        height: (height - 40) / 3
                    });
                }

                private _play() {
                    this._socket.play({
                        id: this._id
                    });
                    // 開始イベント
                    var values:imjcart.logic.value.GlobalValue = imjcart.logic.value.GlobalValue.getInstance();
                    values.controller.dispatchEvent(imjcart.logic.event.ProjectEvent.CONTROLLER_START_EVENT);
                }

                private _changeCameraAngle() {
                    this._socket.changeCameraAngle({
                        id: this._id
                    })
                }

                private _changeSteeringAngle() {
                    switch (this._slope) {
                        case "right":
                            this._setSteeringAngleRight();
                            break;
                        case "left":
                            this._setSteeringAngleLeft();
                            break;
                        case "center":
                            this._clearSteeringAngle();
                            break;
                    }
                }

                private _setSteeringAngleLeft() {
                    this._socket.setSteeringAngle({
                        id: this._id,
                        value: 0.5
                    });
                    this._$btnHandleLeft.addClass("active");
                    this._$btnHandleRight.removeClass("active");
                }

                private _setSteeringAngleRight() {
                    this._socket.setSteeringAngle({
                        id: this._id,
                        value: -0.5
                    });
                    this._$btnHandleRight.addClass("active");
                    this._$btnHandleLeft.removeClass("active");
                }

                private _clearSteeringAngle() {
                    this._socket.clearSteeringAngle({
                        id: this._id
                    });
                    this._$btnHandleLeft.removeClass("active");
                    this._$btnHandleRight.removeClass("active");
                }

                private _startEngine(params) {
                    var value = params.value;
                    this._socket.startEngine({
                        id: this._id,
                        value: value
                    })
                }

                private _stopEngine() {
                    this._socket.stopEngine({
                        id: this._id
                    })
                }

            }

        }

    }

}
