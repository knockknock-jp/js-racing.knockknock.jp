/// <reference path="../../../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../../../lib/three.d.ts"/>
/// <reference path="../../../../../../lib/lib.ts"/>
/// <reference path="../../../../../../imjcart/logic/value/Const.ts"/>

module imjcart.display.main.scene.timeatack.run {

    export class Players extends lib.base.BaseDisplay implements lib.display.IDisplay {

        private _displayImpl:lib.display.IDisplay = null;
        private _$list:JQuery = $("#sceneTimeAtackRunPlayersList");
        private _$listItem = null;
        //.sceneTimeAtackRunPlayersListColor
        //.sceneTimeAtackRunPlayersListName

        constructor(target:JQuery) {
            super(target);
            //
            this._$listItem = this._$list.find("li").clone();
            this._$list.empty();
            //
            this._displayImpl = new lib.display.SimpleDisplayImpl(this.$target);
        }

        public open() {
            this._displayImpl.open(0);
        }

        public close() {
            this._displayImpl.close(0);
        }

        // 他の車追加
        public addOtherCar(id:string) {
            var values:imjcart.logic.value.GlobalValue = imjcart.logic.value.GlobalValue.getInstance();
            var i = 0, max;
            for (i = 0, max = values.otherCarInfoArr.length; i < max; i = i + 1) {
                var info = values.otherCarInfoArr[i];
                if (info.id == id) {
                    var $listItem = this._$listItem.clone();
                    $listItem.attr("data-id", id);
                    $listItem.find(".sceneTimeAtackRunPlayersListName").each(function(){
                        $(this).text(info.name);
                    });
                    $listItem.find(".sceneTimeAtackRunPlayersListColor").each(function(){
                        $(this).find("#wing").each(function(){
                            $(this).find("rect").each(function(){
                                $(this).attr("style", "fill:" + info.colorWing);
                            })
                        });
                        $(this).find("#driver").each(function(){
                            $(this).find("ellipse").each(function(){
                                $(this).attr("style", "fill:" + info.colorDriver);
                            })
                        });
                        $(this).find("#body").each(function(){
                            $(this).find("path").each(function(){
                                $(this).attr("style", "fill:" + info.colorBody);
                            })
                        })
                    });
                    this._$list.append($listItem);
                    return;
                }
            }
        }

        // 他の車除去
        public removeOtherCar(id:string) {
            this._$list.find("li").each(function(){
                if ($(this).attr("data-id") == id) {
                    $(this).remove();
                    return;
                }
            });
        }

    }

}