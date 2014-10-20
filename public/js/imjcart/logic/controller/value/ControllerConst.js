/// <reference path="../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../lib/three.d.ts"/>
/// <reference path="../../../../lib/lib.ts"/>
var imjcart;
(function (imjcart) {
    (function (logic) {
        (function (controller) {
            (function (value) {
                var ControllerConst = (function () {
                    function ControllerConst() {
                    }
                    ControllerConst.KEYCODE_UP = 38;
                    ControllerConst.KEYCODE_DOWN = 40;
                    ControllerConst.KEYCODE_LEFT = 37;
                    ControllerConst.KEYCODE_RIGHT = 39;
                    ControllerConst.KEYCODE_SPACE = 32;
                    ControllerConst.KEYCODE_SHIFT = 16;
                    ControllerConst.KEYCODE_W = 87;
                    ControllerConst.KEYCODE_A = 65;
                    ControllerConst.KEYCODE_S = 83;
                    ControllerConst.KEYCODE_D = 68;
                    return ControllerConst;
                })();
                value.ControllerConst = ControllerConst;
            })(controller.value || (controller.value = {}));
            var value = controller.value;
        })(logic.controller || (logic.controller = {}));
        var controller = logic.controller;
    })(imjcart.logic || (imjcart.logic = {}));
    var logic = imjcart.logic;
})(imjcart || (imjcart = {}));
