/// <reference path="../../../lib/jquery.d.ts"/>
/// <reference path="../../../lib/lib.ts"/>

module imjcart.logic.info {

    export class LapTimeInfo {

        private _id:string = null;
        private _time:number = null;
        private _rank:number = null;
        private _length:number = null;
        private _name:string = null;
        private _comment:string = null;
        private _colorBody:string = null;
        private _colorWing:string = null;
        private _colorDriver:string = null;
        private _runningPath:imjcart.logic.info.RunningPath = null;

        constructor(id:string, time:number, rank:number = null, length:number = null, name:string = "No Name", comment:string = null, colorBody:string = null, colorWing:string = null, colorDriver:string = null, runningPath:any = []) {
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

        public get id():string {
            return this._id;
        }

        public get time():number {
            return this._time;
        }

        public get rank():number {
            return this._rank;
        }

        public get length():number {
            return this._length;
        }

        public get name():string {
            return this._name;
        }

        public get comment():string {
            return this._comment;
        }

        public get colorBody():string {
            return this._colorBody;
        }

        public get colorWing():string {
            return this._colorWing;
        }

        public get colorDriver():string {
            return this._colorDriver;
        }

        public get runningPath():imjcart.logic.info.RunningPath {
            return this._runningPath;
        }

    }

}