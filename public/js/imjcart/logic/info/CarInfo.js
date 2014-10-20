/// <reference path="../../../lib/jquery.d.ts"/>
/// <reference path="../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../lib/three.d.ts"/>
/// <reference path="../../../lib/lib.ts"/>
/// <reference path="../../../imjcart/logic/info/RunningPath.ts"/>
var imjcart;
(function (imjcart) {
    (function (logic) {
        (function (info) {
            var CarInfo = (function () {
                function CarInfo(x, y, bodyAngle, wheelAngle, speed, power, gear, direction, colorBody, colorWing, colorDriver, name) {
                    if (typeof x === "undefined") { x = 0; }
                    if (typeof y === "undefined") { y = 0; }
                    if (typeof bodyAngle === "undefined") { bodyAngle = 0; }
                    if (typeof wheelAngle === "undefined") { wheelAngle = 0; }
                    if (typeof speed === "undefined") { speed = 0; }
                    if (typeof power === "undefined") { power = 0; }
                    if (typeof gear === "undefined") { gear = 0; }
                    if (typeof direction === "undefined") { direction = 0; }
                    if (typeof colorBody === "undefined") { colorBody = null; }
                    if (typeof colorWing === "undefined") { colorWing = null; }
                    if (typeof colorDriver === "undefined") { colorDriver = null; }
                    if (typeof name === "undefined") { name = null; }
                    this._name = null;
                    this._x = null;
                    this._y = null;
                    this._bodyAngle = null;
                    this._wheelAngle = null;
                    this._speed = null;
                    this._power = null;
                    this._gear = null;
                    this._direction = null;
                    this._colorBody = null;
                    this._colorWing = null;
                    this._colorDriver = null;
                    this._runningPath = null;
                    this._x = x;
                    this._y = y;
                    this._bodyAngle = bodyAngle;
                    this._wheelAngle = wheelAngle;
                    this._speed = speed;
                    this._power = power;
                    this._gear = gear;
                    this._direction = direction;
                    this._colorBody = colorBody;
                    this._colorWing = colorWing;
                    this._colorDriver = colorDriver;
                    this._name = name;
                    this._runningPath = new imjcart.logic.info.RunningPath();
                }
                Object.defineProperty(CarInfo.prototype, "runningPath", {
                    get: function () {
                        return this._runningPath;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(CarInfo.prototype, "name", {
                    get: function () {
                        return this._name;
                    },
                    set: function (value) {
                        this._name = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(CarInfo.prototype, "x", {
                    get: function () {
                        return this._x;
                    },
                    set: function (value) {
                        this._x = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(CarInfo.prototype, "y", {
                    get: function () {
                        return this._y;
                    },
                    set: function (value) {
                        this._y = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(CarInfo.prototype, "bodyAngle", {
                    get: function () {
                        return this._bodyAngle;
                    },
                    set: function (value) {
                        this._bodyAngle = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(CarInfo.prototype, "wheelAngle", {
                    get: function () {
                        return this._wheelAngle;
                    },
                    set: function (value) {
                        this._wheelAngle = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(CarInfo.prototype, "speed", {
                    get: function () {
                        return this._speed;
                    },
                    set: function (value) {
                        this._speed = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(CarInfo.prototype, "power", {
                    get: function () {
                        return this._power;
                    },
                    set: function (value) {
                        this._power = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(CarInfo.prototype, "gear", {
                    get: function () {
                        return this._gear;
                    },
                    set: function (value) {
                        this._gear = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(CarInfo.prototype, "direction", {
                    get: function () {
                        return this._direction;
                    },
                    set: function (value) {
                        this._direction = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(CarInfo.prototype, "colorBody", {
                    get: function () {
                        return this._colorBody;
                    },
                    set: function (value) {
                        this._colorBody = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(CarInfo.prototype, "colorWing", {
                    get: function () {
                        return this._colorWing;
                    },
                    set: function (value) {
                        this._colorWing = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(CarInfo.prototype, "colorDriver", {
                    get: function () {
                        return this._colorDriver;
                    },
                    set: function (value) {
                        this._colorDriver = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                return CarInfo;
            })();
            info.CarInfo = CarInfo;
        })(logic.info || (logic.info = {}));
        var info = logic.info;
    })(imjcart.logic || (imjcart.logic = {}));
    var logic = imjcart.logic;
})(imjcart || (imjcart = {}));
