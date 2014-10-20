/// <reference path="../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../lib/three.d.ts"/>
/// <reference path="../../../../lib/lib.ts"/>
var imjcart;
(function (imjcart) {
    (function (logic) {
        (function (physics) {
            (function (event) {
                var PhysicsEvent = (function () {
                    function PhysicsEvent() {
                    }
                    PhysicsEvent.CHANGE_CAR_CONDITION_EVENT = "change_car_condition_event";
                    return PhysicsEvent;
                })();
                event.PhysicsEvent = PhysicsEvent;
            })(physics.event || (physics.event = {}));
            var event = physics.event;
        })(logic.physics || (logic.physics = {}));
        var physics = logic.physics;
    })(imjcart.logic || (imjcart.logic = {}));
    var logic = imjcart.logic;
})(imjcart || (imjcart = {}));
