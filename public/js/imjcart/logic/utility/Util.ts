/// <reference path="../../../lib/jquery.d.ts"/>
/// <reference path="../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../lib/three.d.ts"/>
/// <reference path="../../../lib/lib.ts"/>

module imjcart.logic.utility {

    export class Util {

        public static formatTime(value:number):string {
            var msec = value % 100;
            var sec = Math.floor(value / 100) % 60;
            var min = Math.floor(value / 100 / 60);
            return Util.zeroFormat(min, 2) + ":" + Util.zeroFormat(sec, 2) + ":" + Math.floor(msec / 10);
        }

        public static zeroFormat(v:number, n:number):string {
            if (n > String(v).length) {
                return String("0") + v;
            } else {
                return String(v);
            }
        }

        public static getAngleByRotation(rot):number {
            return rot * Math.PI / 180;
        }

        public static shuffle(array:any):any {
            var m = array.length, t, i;
            while (m) {
                i = Math.floor(Math.random() * m--);
                t = array[m];
                array[m] = array[i];
                array[i] = t;
            }
            return array;
        }

    }

}