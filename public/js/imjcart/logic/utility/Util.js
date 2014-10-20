/// <reference path="../../../lib/jquery.d.ts"/>
/// <reference path="../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../lib/three.d.ts"/>
/// <reference path="../../../lib/lib.ts"/>
var imjcart;
(function (imjcart) {
    (function (logic) {
        (function (utility) {
            var Util = (function () {
                function Util() {
                }
                Util.formatTime = function (value) {
                    var msec = value % 100;
                    var sec = Math.floor(value / 100) % 60;
                    var min = Math.floor(value / 100 / 60);
                    return Util.zeroFormat(min, 2) + ":" + Util.zeroFormat(sec, 2) + ":" + Math.floor(msec / 10);
                };

                Util.zeroFormat = function (v, n) {
                    if (n > String(v).length) {
                        return String("0") + v;
                    } else {
                        return String(v);
                    }
                };

                Util.getAngleByRotation = function (rot) {
                    return rot * Math.PI / 180;
                };

                Util.shuffle = function (array) {
                    var m = array.length, t, i;
                    while (m) {
                        i = Math.floor(Math.random() * m--);
                        t = array[m];
                        array[m] = array[i];
                        array[i] = t;
                    }
                    return array;
                };
                return Util;
            })();
            utility.Util = Util;
        })(logic.utility || (logic.utility = {}));
        var utility = logic.utility;
    })(imjcart.logic || (imjcart.logic = {}));
    var logic = imjcart.logic;
})(imjcart || (imjcart = {}));
