/// <reference path="../../../lib/jquery.d.ts"/>
/// <reference path="../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../lib/three.d.ts"/>
/// <reference path="../../../lib/lib.ts"/>
/// <reference path="../../../imjcart/logic/map/event/MapEvent.ts"/>
/// <reference path="../../../imjcart/logic/map/value/MapConst.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var imjcart;
(function (imjcart) {
    (function (logic) {
        (function (map) {
            var Map = (function (_super) {
                __extends(Map, _super);
                function Map() {
                    _super.call(this);
                    this._tagX = null;
                    this._tagY = null;
                    this._key = null;
                    this._pastLapPoint = null;
                    this._pastLapPointArr = [];
                }
                Map.prototype.update = function (x, y) {
                    var tagX = Math.floor(x * imjcart.logic.map.value.MapConst.MAP_SCALE / map.value.MapConst.MAP_BLOCK_SIZE);
                    var tagY = Math.floor(y * imjcart.logic.map.value.MapConst.MAP_SCALE / map.value.MapConst.MAP_BLOCK_SIZE);
                    if (tagX == this._tagX && tagY == this._tagY)
                        return;
                    this._tagX = tagX;
                    this._tagY = tagY;
                    var key = map.value.MapConst.MAP[tagY][tagX];
                    if (key == this._key)
                        return;
                    this._key = key;

                    switch (this._key) {
                        case map.value.MapConst.MAP_KEY_LAP_START_POINT:
                            // ラップポイント通過時
                            this._passLapPoint(this._key);
                            break;
                        case map.value.MapConst.MAP_KEY_LAP_MEDIAN_CENTER_01:
                            // ラップポイント通過時
                            this._passLapPoint(this._key);
                            break;
                        case map.value.MapConst.MAP_KEY_LAP_MEDIAN_CENTER_02:
                            // ラップポイント通過時
                            this._passLapPoint(this._key);
                            break;
                    }

                    switch (this._key) {
                        case map.value.MapConst.MAP_KEY_GRASS:
                            // 芝に入る
                            this._inGrass();
                            break;
                        default:
                            // 芝から出る
                            this._outGrass();
                            break;
                    }
                };

                // ラップポイント通過時
                Map.prototype._passLapPoint = function (key) {
                    if (this._pastLapPoint == null) {
                        if (key == map.value.MapConst.MAP_KEY_LAP_START_POINT) {
                            this._pastLapPoint = key;
                            this._pastLapPointArr = [map.value.MapConst.MAP_KEY_LAP_START_POINT];

                            // ラップ開始
                            this._startLap();
                        }
                    } else {
                        // ポイント通過
                        if (key == map.value.MapConst.MAP_KEY_LAP_MEDIAN_CENTER_01) {
                            this._pastLapPoint = key;
                            this._pastLapPointArr.push(key);
                        } else if (key == map.value.MapConst.MAP_KEY_LAP_MEDIAN_CENTER_02) {
                            this._pastLapPoint = key;
                            this._pastLapPointArr.push(key);
                        } else if (key == map.value.MapConst.MAP_KEY_LAP_START_POINT) {
                            this._pastLapPoint = key;
                            if (this._pastLapPointArr[0] == map.value.MapConst.MAP_KEY_LAP_START_POINT && this._pastLapPointArr[1] == map.value.MapConst.MAP_KEY_LAP_MEDIAN_CENTER_01 && this._pastLapPointArr[2] == map.value.MapConst.MAP_KEY_LAP_MEDIAN_CENTER_02) {
                                // ラップ記録
                                this._recordLap();

                                // ラップ開始
                                this._startLap();
                            }
                            this._pastLapPointArr = [map.value.MapConst.MAP_KEY_LAP_START_POINT];
                        }
                    }
                };

                // ラップ開始
                Map.prototype._startLap = function () {
                    // ラップ開始イベント
                    this.dispatchEvent(imjcart.logic.map.event.MapEvent.START_LAP_EVENT);
                };

                // ラップ記録
                Map.prototype._recordLap = function () {
                    // ラップ記録イベント
                    this.dispatchEvent(imjcart.logic.map.event.MapEvent.RECORD_LAPTIME_EVENT);
                };

                // 芝に入る
                Map.prototype._inGrass = function () {
                    // 芝に入るイベント
                    this.dispatchEvent(imjcart.logic.map.event.MapEvent.IN_GRASS_EVENT);
                };

                // 芝から出る
                Map.prototype._outGrass = function () {
                    // 芝から出るイベント
                    this.dispatchEvent(imjcart.logic.map.event.MapEvent.OUT_GRASS_EVENT);
                };
                return Map;
            })(lib.event.EventDispacher);
            map.Map = Map;
        })(logic.map || (logic.map = {}));
        var map = logic.map;
    })(imjcart.logic || (imjcart.logic = {}));
    var logic = imjcart.logic;
})(imjcart || (imjcart = {}));
