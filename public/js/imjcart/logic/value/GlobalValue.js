/// <reference path="../../../lib/jquery.d.ts"/>
/// <reference path="../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../lib/three.d.ts"/>
/// <reference path="../../../lib/lib.ts"/>
/// <reference path="../../../imjcart/logic/info/CarInfo.ts"/>
/// <reference path="../../../imjcart/logic/info/LapTimeInfo.ts"/>
/// <reference path="../../../imjcart/display/main/Main.ts"/>
/// <reference path="../../../imjcart/display/controller/Controller.ts"/>
var imjcart;
(function (imjcart) {
    (function (logic) {
        (function (_value) {
            var GlobalValue = (function () {
                function GlobalValue() {
                    this._main = null;
                    this._controller = null;
                    this._socketId = null;
                    this._currentSceneId = null;
                    this._pastSceneId = null;
                    this._currentTimeAtackSceneId = null;
                    this._pastTimeAtackSceneId = null;
                    this._carInfo = null;
                    this._otherCarInfoArr = [];
                    this._colorBody = null;
                    this._colorWing = null;
                    this._colorDriver = null;
                    this._name = null;
                    this._comment = null;
                    this._fastestLapTime = null;
                    this._lapTimeInfoArr = [];
                    this._lapTimeInfo = null;
                    this._fastestRunningPathCollection = [];
                    GlobalValue._instance = this;
                }
                GlobalValue.getInstance = function () {
                    if (GlobalValue._instance === null) {
                        GlobalValue._instance = new GlobalValue();
                    }
                    return GlobalValue._instance;
                };


                Object.defineProperty(GlobalValue.prototype, "main", {
                    get: function () {
                        return this._main;
                    },
                    set: function (main) {
                        this._main = main;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(GlobalValue.prototype, "controller", {
                    get: function () {
                        return this._controller;
                    },
                    set: function (controller) {
                        this._controller = controller;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(GlobalValue.prototype, "socketId", {
                    get: function () {
                        return this._socketId;
                    },
                    set: function (value) {
                        this._socketId = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(GlobalValue.prototype, "currentSceneId", {
                    get: function () {
                        return this._currentSceneId;
                    },
                    set: function (value) {
                        this._currentSceneId = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(GlobalValue.prototype, "pastSceneId", {
                    get: function () {
                        return this._pastSceneId;
                    },
                    set: function (value) {
                        this._pastSceneId = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(GlobalValue.prototype, "currentTimeAtackSceneId", {
                    get: function () {
                        return this._currentTimeAtackSceneId;
                    },
                    set: function (value) {
                        this._currentTimeAtackSceneId = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(GlobalValue.prototype, "pastTimeAtackSceneId", {
                    get: function () {
                        return this._pastTimeAtackSceneId;
                    },
                    set: function (value) {
                        this._pastTimeAtackSceneId = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(GlobalValue.prototype, "carInfo", {
                    get: function () {
                        return this._carInfo;
                    },
                    set: function (carInfo) {
                        this._carInfo = carInfo;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(GlobalValue.prototype, "otherCarInfoArr", {
                    get: function () {
                        return this._otherCarInfoArr;
                    },
                    set: function (arr) {
                        this._otherCarInfoArr = arr;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(GlobalValue.prototype, "colorBody", {
                    get: function () {
                        return this._colorBody;
                    },
                    set: function (value) {
                        this._colorBody = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(GlobalValue.prototype, "colorWing", {
                    get: function () {
                        return this._colorWing;
                    },
                    set: function (value) {
                        this._colorWing = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(GlobalValue.prototype, "colorDriver", {
                    get: function () {
                        return this._colorDriver;
                    },
                    set: function (value) {
                        this._colorDriver = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(GlobalValue.prototype, "name", {
                    get: function () {
                        return this._name;
                    },
                    set: function (value) {
                        this._name = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(GlobalValue.prototype, "comment", {
                    get: function () {
                        return this._comment;
                    },
                    set: function (value) {
                        this._comment = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(GlobalValue.prototype, "fastestLapTime", {
                    get: function () {
                        return this._fastestLapTime;
                    },
                    set: function (value) {
                        this._fastestLapTime = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(GlobalValue.prototype, "lapTimeInfoArr", {
                    get: function () {
                        return this._lapTimeInfoArr;
                    },
                    set: function (arr) {
                        this._lapTimeInfoArr = arr;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(GlobalValue.prototype, "lapTimeInfo", {
                    get: function () {
                        return this._lapTimeInfo;
                    },
                    set: function (info) {
                        this._lapTimeInfo = info;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(GlobalValue.prototype, "fastestRunningPathCollection", {
                    get: function () {
                        return this._fastestRunningPathCollection;
                    },
                    set: function (arr) {
                        this._fastestRunningPathCollection = arr;
                    },
                    enumerable: true,
                    configurable: true
                });
                GlobalValue._instance = null;
                return GlobalValue;
            })();
            _value.GlobalValue = GlobalValue;
        })(logic.value || (logic.value = {}));
        var value = logic.value;
    })(imjcart.logic || (imjcart.logic = {}));
    var logic = imjcart.logic;
})(imjcart || (imjcart = {}));
