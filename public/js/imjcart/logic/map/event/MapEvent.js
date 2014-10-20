/// <reference path="../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../lib/three.d.ts"/>
/// <reference path="../../../../lib/lib.ts"/>
var imjcart;
(function (imjcart) {
    (function (logic) {
        (function (map) {
            (function (event) {
                var MapEvent = (function () {
                    function MapEvent() {
                    }
                    MapEvent.START_LAP_EVENT = "start_lap_event";
                    MapEvent.RECORD_LAPTIME_EVENT = "record_laptime_event";
                    MapEvent.IN_GRASS_EVENT = "into_grass_event";
                    MapEvent.OUT_GRASS_EVENT = "out_grass_event";
                    return MapEvent;
                })();
                event.MapEvent = MapEvent;
            })(map.event || (map.event = {}));
            var event = map.event;
        })(logic.map || (logic.map = {}));
        var map = logic.map;
    })(imjcart.logic || (imjcart.logic = {}));
    var logic = imjcart.logic;
})(imjcart || (imjcart = {}));
