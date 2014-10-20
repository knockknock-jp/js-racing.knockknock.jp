/// <reference path="../../../lib/jquery.d.ts"/>
/// <reference path="../../../lib/lib.ts"/>
var imjcart;
(function (imjcart) {
    (function (logic) {
        (function (info) {
            var LapTimeInfo = (function () {
                function LapTimeInfo(id, time, rank, length, name, comment, colorBody, colorWing, colorDriver, runningPath) {
                    if (typeof rank === "undefined") { rank = null; }
                    if (typeof length === "undefined") { length = null; }
                    if (typeof name === "undefined") { name = "No Name"; }
                    if (typeof comment === "undefined") { comment = null; }
                    if (typeof colorBody === "undefined") { colorBody = null; }
                    if (typeof colorWing === "undefined") { colorWing = null; }
                    if (typeof colorDriver === "undefined") { colorDriver = null; }
                    if (typeof runningPath === "undefined") { runningPath = []; }
                    this._id = null;
                    this._time = null;
                    this._rank = null;
                    this._length = null;
                    this._name = null;
                    this._comment = null;
                    this._colorBody = null;
                    this._colorWing = null;
                    this._colorDriver = null;
                    this._runningPath = null;
                    this._id = id;
                    this._time = time;
                    this._rank = rank;
                    this._length = length;
                    this._name = name;
                    this._comment = comment;
                    this._colorBody = colorBody;
                    this._colorWing = colorWing;
                    this._colorDriver = colorDriver;
                    this._runningPath = new imjcart.logic.info.RunningPath(0, runningPath);
                }
                Object.defineProperty(LapTimeInfo.prototype, "id", {
                    get: function () {
                        return this._id;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(LapTimeInfo.prototype, "time", {
                    get: function () {
                        return this._time;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(LapTimeInfo.prototype, "rank", {
                    get: function () {
                        return this._rank;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(LapTimeInfo.prototype, "length", {
                    get: function () {
                        return this._length;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(LapTimeInfo.prototype, "name", {
                    get: function () {
                        return this._name;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(LapTimeInfo.prototype, "comment", {
                    get: function () {
                        return this._comment;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(LapTimeInfo.prototype, "colorBody", {
                    get: function () {
                        return this._colorBody;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(LapTimeInfo.prototype, "colorWing", {
                    get: function () {
                        return this._colorWing;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(LapTimeInfo.prototype, "colorDriver", {
                    get: function () {
                        return this._colorDriver;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(LapTimeInfo.prototype, "runningPath", {
                    get: function () {
                        return this._runningPath;
                    },
                    enumerable: true,
                    configurable: true
                });
                return LapTimeInfo;
            })();
            info.LapTimeInfo = LapTimeInfo;
        })(logic.info || (logic.info = {}));
        var info = logic.info;
    })(imjcart.logic || (imjcart.logic = {}));
    var logic = imjcart.logic;
})(imjcart || (imjcart = {}));
