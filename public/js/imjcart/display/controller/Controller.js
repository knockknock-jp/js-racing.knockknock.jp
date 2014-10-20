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
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var imjcart;
(function (imjcart) {
    (function (_display) {
        (function (controller) {
            var Controller = (function (_super) {
                __extends(Controller, _super);
                function Controller(target) {
                    var _this = this;
                    _super.call(this, target);
                    this._displayImpl = null;
                    this._window = null;
                    this._id = null;
                    this._isPortait = true;
                    this._slope = null;
                    this._socket = null;
                    this._$boxOpening = null;
                    this._$boxController = null;
                    this._$boxError = null;
                    this._$btnPlay = null;
                    this._$btnCamera = null;
                    this._$btnHandleLeft = null;
                    this._$btnHandleRight = null;
                    this._$btnAccelerator = null;
                    this._$btnBack = null;
                    this._startTouchEvent = null;
                    this._endTouchEvent = null;

                    //
                    var values = imjcart.logic.value.GlobalValue.getInstance();
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
                    // 開始イベント
                    this.addEventListener(imjcart.logic.event.ProjectEvent.CONTROLLER_START_EVENT, function (evt) {
                        _this._$boxOpening.css({
                            display: "none"
                        });
                        _this._$boxController.css({
                            display: "block"
                        });
                    });

                    // エラー表示イベント
                    this.addEventListener(imjcart.logic.event.ProjectEvent.CONTROLLER_ERROR_EVENT, function (evt) {
                        _this._$boxOpening.css({
                            display: "none"
                        });
                        _this._$boxController.css({
                            display: "none"
                        });
                        _this._$boxError.css({
                            display: "block"
                        });
                    });

                    //
                    this._$btnPlay.on("click", function (evt) {
                        evt.preventDefault();
                        _this._play();
                    });

                    //
                    this._$btnCamera.on(this._startTouchEvent, function (evt) {
                        evt.preventDefault();
                        _this._changeCameraAngle();
                        _this._$btnCamera.addClass("active");
                    });
                    this._$btnCamera.on(this._endTouchEvent, function (evt) {
                        evt.preventDefault();
                        _this._$btnCamera.removeClass("active");
                    });

                    //
                    this._$btnHandleLeft.on(this._startTouchEvent, function (evt) {
                        evt.preventDefault();
                        _this._setSteeringAngleLeft();
                    });
                    this._$btnHandleLeft.on(this._endTouchEvent, function (evt) {
                        evt.preventDefault();
                        _this._clearSteeringAngle();
                    });

                    //
                    this._$btnHandleRight.on(this._startTouchEvent, function (evt) {
                        evt.preventDefault();
                        _this._setSteeringAngleRight();
                    });
                    this._$btnHandleRight.on(this._endTouchEvent, function (evt) {
                        evt.preventDefault();
                        _this._clearSteeringAngle();
                    });

                    //
                    this._$btnAccelerator.on(this._startTouchEvent, function (evt) {
                        evt.preventDefault();
                        _this._startEngine({
                            value: 1
                        });
                        _this._$btnAccelerator.addClass("active");
                    });
                    this._$btnAccelerator.on(this._endTouchEvent, function (evt) {
                        evt.preventDefault();
                        _this._stopEngine();
                        _this._$btnAccelerator.removeClass("active");
                    });

                    //
                    this._$btnBack.on(this._startTouchEvent, function (evt) {
                        evt.preventDefault();
                        _this._startEngine({
                            value: -1
                        });
                        _this._$btnBack.addClass("active");
                    });
                    this._$btnBack.on(this._endTouchEvent, function (evt) {
                        evt.preventDefault();
                        _this._stopEngine();
                        _this._$btnBack.removeClass("active");
                    });

                    //
                    this._window = window;
                    $(this._window).bind("load orientationchange", function (evt) {
                        evt.preventDefault();
                        if (Math.abs(_this._window.orientation) === 90) {
                            _this._isPortait = false;
                        } else {
                            _this._isPortait = true;
                        }
                    });
                    this._window.addEventListener("devicemotion", function (evt) {
                        evt.preventDefault();
                        var x = evt.accelerationIncludingGravity.x;
                        var y = evt.accelerationIncludingGravity.y;

                        //var z = evt.accelerationIncludingGravity.z; //上下方向の傾斜
                        var slope = "center";
                        if (_this._isPortait) {
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
                        if (_this._slope != slope) {
                            _this._slope = slope;
                            _this._changeSteeringAngle();
                        }
                    }, false);
                }
                Controller.prototype.open = function () {
                    this._displayImpl.open(0);
                };

                Controller.prototype.close = function () {
                    this._displayImpl.close(0);
                };

                Controller.prototype._completeOpen = function () {
                    this._$boxOpening.css({
                        display: "block"
                    });
                };

                Controller.prototype.onResize = function (width, height) {
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
                };

                Controller.prototype._play = function () {
                    this._socket.play({
                        id: this._id
                    });

                    // 開始イベント
                    var values = imjcart.logic.value.GlobalValue.getInstance();
                    values.controller.dispatchEvent(imjcart.logic.event.ProjectEvent.CONTROLLER_START_EVENT);
                };

                Controller.prototype._changeCameraAngle = function () {
                    this._socket.changeCameraAngle({
                        id: this._id
                    });
                };

                Controller.prototype._changeSteeringAngle = function () {
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
                };

                Controller.prototype._setSteeringAngleLeft = function () {
                    this._socket.setSteeringAngle({
                        id: this._id,
                        value: 0.5
                    });
                    this._$btnHandleLeft.addClass("active");
                    this._$btnHandleRight.removeClass("active");
                };

                Controller.prototype._setSteeringAngleRight = function () {
                    this._socket.setSteeringAngle({
                        id: this._id,
                        value: -0.5
                    });
                    this._$btnHandleRight.addClass("active");
                    this._$btnHandleLeft.removeClass("active");
                };

                Controller.prototype._clearSteeringAngle = function () {
                    this._socket.clearSteeringAngle({
                        id: this._id
                    });
                    this._$btnHandleLeft.removeClass("active");
                    this._$btnHandleRight.removeClass("active");
                };

                Controller.prototype._startEngine = function (params) {
                    var value = params.value;
                    this._socket.startEngine({
                        id: this._id,
                        value: value
                    });
                };

                Controller.prototype._stopEngine = function () {
                    this._socket.stopEngine({
                        id: this._id
                    });
                };
                return Controller;
            })(lib.base.BaseDisplay);
            controller.Controller = Controller;
        })(_display.controller || (_display.controller = {}));
        var controller = _display.controller;
    })(imjcart.display || (imjcart.display = {}));
    var display = imjcart.display;
})(imjcart || (imjcart = {}));
