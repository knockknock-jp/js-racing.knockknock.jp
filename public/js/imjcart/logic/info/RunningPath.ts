/// <reference path="../../../lib/jquery.d.ts"/>
/// <reference path="../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../lib/three.d.ts"/>
/// <reference path="../../../lib/lib.ts"/>

module imjcart.logic.info {

    export class RunningPath {

        private _collection:any = [];
        private _currentIndex:number = 0;

        constructor(index:number = 0, collection:any = []) {
            this._currentIndex = index;
            this._collection = collection;
        }

        public pushPath(x:number, y:number, bodyAngle:number) {
            this._collection.push({
                x: Math.round(x * 1000) / 1000,
                y: Math.round(y * 1000) / 1000,
                bodyAngle: Math.round(bodyAngle * 1000) / 1000
            });
        }

        public clearPath() {
            this._collection = [];
        }

        public get currentPath() {
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
        }

        public set currentIndex(index:number) {
            this._currentIndex = index;
        }

        public get collection() {
            return this._collection;
        }

    }

}