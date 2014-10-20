/// <reference path="../../../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../../../lib/three.d.ts"/>
/// <reference path="../../../../../../lib/lib.ts"/>

module imjcart.display.main.scene.timeatack.run.coursemap {

    export class CourseMap extends lib.base.BaseDisplay implements lib.display.IDisplay {

        private _displayImpl:lib.display.IDisplay = null;
        private _$car:JQuery = null;
        private _$carOther:JQuery = null;
        private _canvas:any = null;
        private _context:any = null;
        private _carX:number = null;
        private _carY:number = null;
        private _intervalId:number = null;

        constructor(target:JQuery) {
            super(target);
            //
            this._$car = $("#sceneTimeAtackRunCourseMapCar");
            this._$carOther = $(".sceneTimeAtackRunCourseMapCarOther");
            this._canvas = document.getElementById("sceneTimeAtackRunCourseMapCanvas");
            this._context = this._canvas.getContext("2d");
            //
            this._displayImpl = new lib.display.SimpleDisplayImpl(this.$target);
            this._displayImpl.addEventListener(lib.event.Event.DISPLAY_START_OPEN_EVENT, () => {
                this._createCourse();
                this._createCar();
            });
        }

        public open() {
            this._displayImpl.open(0);
        }

        public close() {
            this._displayImpl.close(0);
        }

        public update(x:number, y:number) {
            this._carX = x * imjcart.logic.value.Const.COURSE_MAP_SCALE;
            this._carY = y * imjcart.logic.value.Const.COURSE_MAP_SCALE;
        }

        private _createCourse() {
            var size = imjcart.logic.value.Const.COURSE_MAP_SCALE / imjcart.logic.map.value.MapConst.MAP_BLOCK_SIZE;
            this._context.save();
            var i, j, max, max2;
            for (i = 0, max = imjcart.logic.map.value.MapConst.MAP.length; i < max; i = i + 1) {
                for (j = 0, max2 = imjcart.logic.map.value.MapConst.MAP[i].length; j < max2; j = j + 1) {
                    if (imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_LAP_START_POINT) {
                        this._context.fillStyle = "rgb(255, 0, 0)";
                        this._context.fillRect((size * j), (size * i), size, size);
                    } else if (imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_TREE) {
                        this._context.fillStyle = "rgb(0, 100, 0)";
                        this._context.fillRect((size * j), (size * i), size, size);
                    } else if (imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_TIRE) {
                        this._context.fillStyle = "rgb(50, 50, 255)";
                        this._context.fillRect((size * j), (size * i), size, size);
                    } else if (
                        imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_NONE
                        || imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_CAR_START_POSITION
                        || imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_LAP_MEDIAN_CENTER_01
                        || imjcart.logic.map.value.MapConst.MAP[i][j] == imjcart.logic.map.value.MapConst.MAP_KEY_LAP_MEDIAN_CENTER_02
                        ) {
                        this._context.fillStyle = "rgb(255, 255, 255)";
                        this._context.fillRect((size * j), (size * i), size, size);
                    } else {
                        if (i % 2) {
                            this._context.fillStyle = "rgb(120, 160, 80)";
                            this._context.fillRect((size * j), (size * i), size, size);
                        }
                    }
                }
            }
            this._context.restore();
        }

        private _createCar() {
            this._$car.css({
                position: "absolute",
                backgroundColor: imjcart.logic.value.GlobalValue.getInstance().colorBody
            });
            //
            if (this._intervalId) clearInterval(this._intervalId);
            this._intervalId = setInterval(() => {
                this._$car.css({
                    left: this._carX - 4,
                    top: this._carY - 4
                });
            }, 1000 / 10);
        }

        // 他の車追加
        public addOtherCar(id:string) {
            var values = imjcart.logic.value.GlobalValue.getInstance();
            var i = 0, max;
            for (i = 0, max = values.otherCarInfoArr.length; i < max; i = i + 1) {
                var info = values.otherCarInfoArr[i];
                if (info.id == id) {
                    var $carOther = this._$carOther.clone();
                    $carOther.attr("data-id", id);
                    $carOther.css({
                        display: "block",
                        position: "absolute",
                        backgroundColor: info.colorBody
                    });
                    this.$target.append($carOther);
                    return;
                }
            }
        }

        // 他の車除去
        public removeOtherCar(id:string) {
            this.$target.find(".sceneTimeAtackRunCourseMapCarOther").each(function(){
                if ($(this).attr("data-id") == id) {
                    $(this).remove();
                }
            })
        }

        // 他の車の姿勢更新
        public updateOtherCarPosture():void {
            var values:imjcart.logic.value.GlobalValue = imjcart.logic.value.GlobalValue.getInstance();
            var i = 0, max;
            for (i = 0, max = values.otherCarInfoArr.length; i < max; i = i + 1) {
                var info:imjcart.logic.info.OtherCarInfo = values.otherCarInfoArr[i];
                this.$target.find(".sceneTimeAtackRunCourseMapCarOther").each(function () {
                    if ($(this).attr("data-id") == info.id) {
                        $(this).css({
                            left: info.x * imjcart.logic.value.Const.COURSE_MAP_SCALE - 2,
                            top: info.y * imjcart.logic.value.Const.COURSE_MAP_SCALE - 2
                        });
                    }
                });
            }
        }

    }

}