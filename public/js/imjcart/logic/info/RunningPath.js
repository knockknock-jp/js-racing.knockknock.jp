/// <reference path="../../../lib/jquery.d.ts"/>
/// <reference path="../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../lib/three.d.ts"/>
/// <reference path="../../../lib/lib.ts"/>
var imjcart;
(function (imjcart) {
    (function (logic) {
        (function (info) {
            var RunningPath = (function () {
                function RunningPath(index, collection) {
                    if (typeof index === "undefined") { index = 0; }
                    if (typeof collection === "undefined") { collection = []; }
                    this._collection = [];
                    this._currentIndex = 0;
                    this._currentIndex = index;
                    this._collection = collection;
                }
                RunningPath.prototype.pushPath = function (x, y, bodyAngle) {
                    this._collection.push({
                        x: Math.round(x * 1000) / 1000,
                        y: Math.round(y * 1000) / 1000,
                        bodyAngle: Math.round(bodyAngle * 1000) / 1000
                    });
                };

                RunningPath.prototype.clearPath = function () {
                    this._collection = [];
                };

                Object.defineProperty(RunningPath.prototype, "currentPath", {
                    get: function () {
                        var path = this._collection[this._currentIndex];
                        if (this._collection.length <= this._currentIndex) {
                            this._currentIndex = 0;
                        } else {
                            this._currentIndex += 1;
                        }
                        return {
                            x: path.x,
                            y: path.y,
                            bodyAngle: path.bodyAngle
                        };
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(RunningPath.prototype, "currentIndex", {
                    set: function (index) {
                        this._currentIndex = index;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(RunningPath.prototype, "collection", {
                    get: function () {
                        return this._collection;
                    },
                    enumerable: true,
                    configurable: true
                });
                return RunningPath;
            })();
            info.RunningPath = RunningPath;
        })(logic.info || (logic.info = {}));
        var info = logic.info;
    })(imjcart.logic || (imjcart.logic = {}));
    var logic = imjcart.logic;
})(imjcart || (imjcart = {}));
