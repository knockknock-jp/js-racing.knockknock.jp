/// <reference path="../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../lib/three.d.ts"/>
/// <reference path="../../../../lib/lib.ts"/>
var imjcart;
(function (imjcart) {
    (function (logic) {
        (function (physics) {
            (function (value) {
                var PhysicsConst = (function () {
                    function PhysicsConst() {
                    }
                    PhysicsConst.MAX_STEER_ANGLE = Math.PI / 8;

                    PhysicsConst.FORWARD_ENGINE_SPEED = 0.00001;

                    PhysicsConst.BACK_ENGINE_SPEED = 0.000005;
                    PhysicsConst.CAR_LINEAR_DAMPING = 2;

                    PhysicsConst.CAR_ANGULAR_DAMPING = 30;

                    PhysicsConst.CAR_GEAR_MAX = 1100;
                    PhysicsConst.CAR_GEAR_BACK_MAX = 200;
                    PhysicsConst.CAR_SHIFTUP_SPEED = 6;
                    PhysicsConst.CAR_SHIFTDOWN_SPEED = 2;
                    return PhysicsConst;
                })();
                value.PhysicsConst = PhysicsConst;
            })(physics.value || (physics.value = {}));
            var value = physics.value;
        })(logic.physics || (logic.physics = {}));
        var physics = logic.physics;
    })(imjcart.logic || (imjcart.logic = {}));
    var logic = imjcart.logic;
})(imjcart || (imjcart = {}));
