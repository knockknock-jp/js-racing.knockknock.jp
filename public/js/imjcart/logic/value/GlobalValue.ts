/// <reference path="../../../lib/jquery.d.ts"/>
/// <reference path="../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../lib/three.d.ts"/>
/// <reference path="../../../lib/lib.ts"/>
/// <reference path="../../../imjcart/logic/info/CarInfo.ts"/>
/// <reference path="../../../imjcart/logic/info/LapTimeInfo.ts"/>
/// <reference path="../../../imjcart/display/main/Main.ts"/>
/// <reference path="../../../imjcart/display/controller/Controller.ts"/>

module imjcart.logic.value {

    export class GlobalValue {

        private static _instance:GlobalValue = null;
        private _main:imjcart.display.main.Main = null;
        private _controller:imjcart.display.controller.Controller = null;
        private _socketId:string = null;
        private _currentSceneId:string = null;
        private _pastSceneId:string = null;
        private _currentTimeAtackSceneId:string = null;
        private _pastTimeAtackSceneId:string = null;
        private _carInfo:imjcart.logic.info.CarInfo = null;
        private _otherCarInfoArr:imjcart.logic.info.OtherCarInfo[] = [];
        private _colorBody:string = null;
        private _colorWing:string = null;
        private _colorDriver:string = null;
        private _name:string = null;
        private _comment:string = null;
        private _fastestLapTime:number = null;
        private _lapTimeInfoArr:imjcart.logic.info.LapTimeInfo[] = [];
        private _lapTimeInfo:imjcart.logic.info.LapTimeInfo = null;
        private _fastestRunningPathCollection:any = [];

        constructor() {
            GlobalValue._instance = this;
        }

        public static getInstance():GlobalValue {
            if (GlobalValue._instance === null) {
                GlobalValue._instance = new GlobalValue();
            }
            return GlobalValue._instance;
        }

        public set main(main:imjcart.display.main.Main) {
            this._main = main;
        }

        public get main():imjcart.display.main.Main {
            return this._main;
        }

        public set controller(controller:imjcart.display.controller.Controller) {
            this._controller = controller;
        }

        public get controller():imjcart.display.controller.Controller {
            return this._controller;
        }

        public set socketId(value:string) {
            this._socketId = value;
        }

        public get socketId():string {
            return this._socketId;
        }

        public set currentSceneId(value:string) {
            this._currentSceneId = value;
        }

        public get currentSceneId():string {
            return this._currentSceneId;
        }

        public set pastSceneId(value:string) {
            this._pastSceneId = value;
        }

        public get pastSceneId():string {
            return this._pastSceneId;
        }

        public set currentTimeAtackSceneId(value:string) {
            this._currentTimeAtackSceneId = value;
        }

        public get currentTimeAtackSceneId():string {
            return this._currentTimeAtackSceneId;
        }

        public set pastTimeAtackSceneId(value:string) {
            this._pastTimeAtackSceneId = value;
        }

        public get pastTimeAtackSceneId():string {
            return this._pastTimeAtackSceneId;
        }

        public set carInfo(carInfo:imjcart.logic.info.CarInfo) {
            this._carInfo = carInfo;
        }

        public get carInfo():imjcart.logic.info.CarInfo {
            return this._carInfo;
        }

        public set otherCarInfoArr(arr:imjcart.logic.info.OtherCarInfo[]) {
            this._otherCarInfoArr = arr;
        }

        public get otherCarInfoArr():imjcart.logic.info.OtherCarInfo[] {
            return this._otherCarInfoArr;
        }

        public set colorBody(value:string) {
            this._colorBody = value;
        }

        public get colorBody():string {
            return this._colorBody;
        }

        public set colorWing(value:string) {
            this._colorWing = value;
        }

        public get colorWing():string {
            return this._colorWing;
        }

        public set colorDriver(value:string) {
            this._colorDriver = value;
        }

        public get colorDriver():string {
            return this._colorDriver;
        }

        public set name(value:string) {
            this._name = value;
        }

        public get name():string {
            return this._name;
        }

        public set comment(value:string) {
            this._comment = value;
        }

        public get comment():string {
            return this._comment;
        }

        public set fastestLapTime(value:number) {
            this._fastestLapTime = value;
        }

        public get fastestLapTime():number {
            return this._fastestLapTime;
        }

        public set lapTimeInfoArr(arr:imjcart.logic.info.LapTimeInfo[]) {
            this._lapTimeInfoArr = arr;
        }

        public get lapTimeInfoArr() :imjcart.logic.info.LapTimeInfo[] {
            return this._lapTimeInfoArr;
        }

        public set lapTimeInfo(info:imjcart.logic.info.LapTimeInfo) {
            this._lapTimeInfo = info;
        }

        public get lapTimeInfo() :imjcart.logic.info.LapTimeInfo {
            return this._lapTimeInfo;
        }

        public set fastestRunningPathCollection(arr:any) {
            this._fastestRunningPathCollection = arr;
        }

        public get fastestRunningPathCollection():any {
            return this._fastestRunningPathCollection;
        }

    }

}