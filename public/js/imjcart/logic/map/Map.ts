/// <reference path="../../../lib/jquery.d.ts"/>
/// <reference path="../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../lib/three.d.ts"/>
/// <reference path="../../../lib/lib.ts"/>
/// <reference path="../../../imjcart/logic/map/event/MapEvent.ts"/>
/// <reference path="../../../imjcart/logic/map/value/MapConst.ts"/>

module imjcart.logic.map {

    export class Map extends lib.event.EventDispacher {

        private _tagX:number = null;
        private _tagY:number = null;
        private _key:number = null;
        private _pastLapPoint:number = null;
        private _pastLapPointArr:any = [];

        constructor() {
            super();
        }

        public update(x:number, y:number) {
            var tagX = Math.floor(x * imjcart.logic.map.value.MapConst.MAP_SCALE / value.MapConst.MAP_BLOCK_SIZE);
            var tagY = Math.floor(y * imjcart.logic.map.value.MapConst.MAP_SCALE / value.MapConst.MAP_BLOCK_SIZE);
            if (tagX == this._tagX && tagY == this._tagY) return;
            this._tagX = tagX;
            this._tagY = tagY;
            var key = value.MapConst.MAP[tagY][tagX];
            if (key == this._key) return;
            this._key = key;
            //
            switch (this._key) {
                case value.MapConst.MAP_KEY_LAP_START_POINT:
                    // ラップポイント通過時
                    this._passLapPoint(this._key);
                    break;
                case value.MapConst.MAP_KEY_LAP_MEDIAN_CENTER_01:
                    // ラップポイント通過時
                    this._passLapPoint(this._key);
                    break;
                case value.MapConst.MAP_KEY_LAP_MEDIAN_CENTER_02:
                    // ラップポイント通過時
                    this._passLapPoint(this._key);
                    break;
            }
            //
            switch (this._key) {
                case value.MapConst.MAP_KEY_GRASS:
                    // 芝に入る
                    this._inGrass();
                    break;
                default:
                    // 芝から出る
                    this._outGrass();
                    break;
            }
        }

        // ラップポイント通過時
        private _passLapPoint(key:number) {
            if (this._pastLapPoint == null) {
                if (key == value.MapConst.MAP_KEY_LAP_START_POINT) {
                    this._pastLapPoint = key;
                    this._pastLapPointArr = [value.MapConst.MAP_KEY_LAP_START_POINT];
                    // ラップ開始
                    this._startLap();
                }
            } else {
                // ポイント通過
                if (key == value.MapConst.MAP_KEY_LAP_MEDIAN_CENTER_01) {
                    this._pastLapPoint = key;
                    this._pastLapPointArr.push(key);
                } else if (key == value.MapConst.MAP_KEY_LAP_MEDIAN_CENTER_02) {
                    this._pastLapPoint = key;
                    this._pastLapPointArr.push(key);
                } else if (key == value.MapConst.MAP_KEY_LAP_START_POINT) {
                    this._pastLapPoint = key;
                    if (this._pastLapPointArr[0] == value.MapConst.MAP_KEY_LAP_START_POINT
                        && this._pastLapPointArr[1] == value.MapConst.MAP_KEY_LAP_MEDIAN_CENTER_01
                        && this._pastLapPointArr[2] == value.MapConst.MAP_KEY_LAP_MEDIAN_CENTER_02) {
                        // ラップ記録
                        this._recordLap();
                        // ラップ開始
                        this._startLap();
                    }
                    this._pastLapPointArr = [value.MapConst.MAP_KEY_LAP_START_POINT];
                }
            }
        }

        // ラップ開始
        private _startLap() {
            // ラップ開始イベント
            this.dispatchEvent(imjcart.logic.map.event.MapEvent.START_LAP_EVENT);
        }

        // ラップ記録
        private _recordLap() {
            // ラップ記録イベント
            this.dispatchEvent(imjcart.logic.map.event.MapEvent.RECORD_LAPTIME_EVENT);
        }

        // 芝に入る
        private _inGrass() {
            // 芝に入るイベント
            this.dispatchEvent(imjcart.logic.map.event.MapEvent.IN_GRASS_EVENT);
        }

        // 芝から出る
        private _outGrass() {
            // 芝から出るイベント
            this.dispatchEvent(imjcart.logic.map.event.MapEvent.OUT_GRASS_EVENT);
        }

    }

}