/// <reference path="../../../lib/jquery.d.ts"/>
/// <reference path="../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../lib/three.d.ts"/>
/// <reference path="../../../lib/lib.ts"/>
var imjcart;
(function (imjcart) {
    (function (logic) {
        (function (info) {
            var OtherCarInfo = (function () {
                function OtherCarInfo(id, x, y, bodyAngle, wheelAngle, speed, colorBody, colorWing, colorDriver, name) {
                    if (typeof id === "undefined") { id = null; }
                    if (typeof x === "undefined") { x = 0; }
                    if (typeof y === "undefined") { y = 0; }
                    if (typeof bodyAngle === "undefined") { bodyAngle = 0; }
                    if (typeof wheelAngle === "undefined") { wheelAngle = 0; }
                    if (typeof speed === "undefined") { speed = 0; }
                    if (typeof colorBody === "undefined") { colorBody = null; }
                    if (typeof colorWing === "undefined") { colorWing = null; }
                    if (typeof colorDriver === "undefined") { colorDriver = null; }
                    if (typeof name === "undefined") { name = null; }
                    this._id = null;
                    this._name = null;
                    this._x = null;
                    this._y = null;
                    this._bodyAngle = null;
                    this._wheelAngle = null;
                    this._speed = null;
                    this._colorBody = null;
                    this._colorWing = null;
                    this._colorDriver = null;
                    this._id = id;
                    this._x = x;
                    this._y = y;
                    this._bodyAngle = bodyAngle;
                    this._wheelAngle = wheelAngle;
                    this._speed = speed;
                    this._colorBody = colorBody;
                    this._colorWing = colorWing;
                    this._colorDriver = colorDriver;
                    this._name = name;
                }

                Object.defineProperty(OtherCarInfo.prototype, "id", {
                    get: function () {
                        return this._id;
                    },
                    set: function (value) {
                        this._id = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(OtherCarInfo.prototype, "name", {
                    get: function () {
                        return this._name;
                    },
                    set: function (value) {
                        this._name = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(OtherCarInfo.prototype, "x", {
                    get: function () {
                        return this._x;
                    },
                    set: function (value) {
                        this._x = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(OtherCarInfo.prototype, "y", {
                    get: function () {
                        return this._y;
                    },
                    set: function (value) {
                        this._y = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(OtherCarInfo.prototype, "bodyAngle", {
                    get: function () {
                        return this._bodyAngle;
                    },
                    set: function (value) {
                        this._bodyAngle = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(OtherCarInfo.prototype, "wheelAngle", {
                    get: function () {
                        return this._wheelAngle;
                    },
                    set: function (value) {
                        this._wheelAngle = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(OtherCarInfo.prototype, "speed", {
                    get: function () {
                        return this._speed;
                    },
                    set: function (value) {
                        this._speed = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(OtherCarInfo.prototype, "colorBody", {
                    get: function () {
                        return this._colorBody;
                    },
                    set: function (value) {
                        this._colorBody = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(OtherCarInfo.prototype, "colorWing", {
                    get: function () {
                        return this._colorWing;
                    },
                    set: function (value) {
                        this._colorWing = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(OtherCarInfo.prototype, "colorDriver", {
                    get: function () {
                        return this._colorDriver;
                    },
                    set: function (value) {
                        this._colorDriver = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                return OtherCarInfo;
            })();
            info.OtherCarInfo = OtherCarInfo;
        })(logic.info || (logic.info = {}));
        var info = logic.info;
    })(imjcart.logic || (imjcart.logic = {}));
    var logic = imjcart.logic;
})(imjcart || (imjcart = {}));
