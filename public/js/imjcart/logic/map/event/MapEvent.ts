/// <reference path="../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../lib/three.d.ts"/>
/// <reference path="../../../../lib/lib.ts"/>

module imjcart.logic.map.event {

    export class MapEvent {

        static START_LAP_EVENT:string = "start_lap_event";
        static RECORD_LAPTIME_EVENT:string = "record_laptime_event";
        static IN_GRASS_EVENT:string = "into_grass_event";
        static OUT_GRASS_EVENT:string = "out_grass_event";

    }

}