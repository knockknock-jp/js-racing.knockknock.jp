/// <reference path="../../../../../../lib/jquery.d.ts"/>
/// <reference path="../../../../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../../../../lib/three.d.ts"/>
/// <reference path="../../../../../../lib/lib.ts"/>
/// <reference path="../../../../../../imjcart/display/main/scene/timeatack/run/BtnPause.ts"/>
/// <reference path="../../../../../../imjcart/display/main/scene/timeatack/run/LapTime.ts"/>
/// <reference path="../../../../../../imjcart/display/main/scene/timeatack/run/EngineCondition.ts"/>
/// <reference path="../../../../../../imjcart/display/main/scene/timeatack/run/CourseMap.ts"/>
/// <reference path="../../../../../../imjcart/display/main/scene/timeatack/run/Message.ts"/>
/// <reference path="../../../../../../imjcart/display/main/scene/timeatack/run/Players.ts"/>
/// <reference path="../../../../../../imjcart/display/main/scene/timeatack/run/pausewindow/PauseWindow.ts"/>
/// <reference path="../../../../../../imjcart/logic/map/Map.ts"/>
/// <reference path="../../../../../../imjcart/logic/physics/Physics.ts"/>
/// <reference path="../../../../../../imjcart/logic/controller/Controller.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var imjcart;
(function (imjcart) {
    (function (display) {
        (function (main) {
            (function (scene) {
                (function (timeatack) {
                    (function (run) {
                        var Run = (function (_super) {
                            __extends(Run, _super);
                            function Run(target) {
                                var _this = this;
                                _super.call(this, target);
                                this._displayImpl = null;
                                this._btnPause = null;
                                this._lapTime = null;
                                this._engineCondition = null;
                                this._courseMap = null;
                                this._message = null;
                                this._pauseWindow = null;
                                this._players = null;
                                //
                                this._map = null;
                                this._physics = null;
                                //
                                this._time = null;
                                this._lapTimeArr = [];
                                this._intervalId = null;
                                this._isPause = false;

                                // 停止ボタン
                                this._btnPause = new run.BtnPause($("#sceneTimeAtackRunBtnPause"));

                                // ラップタイム
                                this._lapTime = new run.LapTime($("#sceneTimeAtackRunLapTime"));

                                // エンジンメーター
                                this._engineCondition = new run.EngineCondition($("#sceneTimeAtackRunEngineCondition"));

                                // コースマップ
                                this._courseMap = new run.coursemap.CourseMap($("#sceneTimeAtackRunCourseMap"));

                                // メッセージ
                                this._message = new run.Message($("#sceneTimeAtackRunMessage"));

                                // 停止ウィンドウ
                                this._pauseWindow = new run.pausewindow.PauseWindow($("#sceneTimeAtackRunPauseWindow"));

                                // 走行中プレーヤー
                                this._players = new run.Players($("#sceneTimeAtackRunPlayers"));

                                //
                                this._displayImpl = new lib.display.SimpleDisplayImpl(this.$target);
                                this._displayImpl.addEventListener(lib.event.Event.DISPLAY_START_OPEN_EVENT, function () {
                                    lib.responisive.ResizeManager.getInstance().addEventListener(_this);
                                    lib.responisive.ResizeManager.getInstance().dispatchEvent(_this);
                                });
                                this._displayImpl.addEventListener(lib.event.Event.DISPLAY_COMPLETE_OPEN_EVENT, function () {
                                    _this._completeOpen();
                                });
                                this._displayImpl.addEventListener(lib.event.Event.DISPLAY_START_CLOSE_EVENT, function () {
                                    _this._startClose();
                                });
                                this._displayImpl.addEventListener(lib.event.Event.DISPLAY_COMPLETE_CLOSE_EVENT, function () {
                                    lib.responisive.ResizeManager.getInstance().removeEventListener(_this);
                                    _this._completeClose();
                                });
                            }
                            Run.prototype.open = function () {
                                this._displayImpl.open(0);
                            };

                            Run.prototype.close = function () {
                                this._displayImpl.close(0);
                            };

                            Run.prototype._completeOpen = function () {
                                var _this = this;
                                this._btnPause.open();
                                this._lapTime.open();
                                this._engineCondition.open();
                                this._courseMap.open();
                                this._players.open();

                                // 車情報
                                var values = imjcart.logic.value.GlobalValue.getInstance();
                                values.carInfo = new imjcart.logic.info.CarInfo();

                                // マップ
                                this._map = new imjcart.logic.map.Map();

                                // 物理演算
                                this._physics = new imjcart.logic.physics.Physics($("#physics"));

                                // コントローラー
                                var controller = imjcart.logic.controller.Controller.getInstance();

                                //
                                // ---------- イベント ---------- //
                                //
                                // エンジン開始イベント
                                controller.addEventListener(imjcart.logic.controller.event.ControllerEvent.START_ENGINE_EVENT, function (evt) {
                                    _this._physics.startEngine(evt.value);
                                });

                                // エンジン停止イベント
                                controller.addEventListener(imjcart.logic.controller.event.ControllerEvent.STOP_ENGINE_EVENT, function () {
                                    _this._physics.stopEngine();
                                });

                                // ステアリング変更イベント
                                controller.addEventListener(imjcart.logic.controller.event.ControllerEvent.SET_STEERING_ANGLE_EVENT, function (evt) {
                                    _this._physics.setSteeringAngle(evt.value);
                                });

                                // ステアリングを元に戻すイベント
                                controller.addEventListener(imjcart.logic.controller.event.ControllerEvent.CLEAR_STEERING_ANGLE_EVENT, function () {
                                    _this._physics.clearSteeringAngle();
                                });

                                // カメラアングル変更イベント
                                controller.addEventListener(imjcart.logic.controller.event.ControllerEvent.CHANGE_CAMERA_ANGLE_EVENT, function () {
                                    // カメラアングル変更イベント
                                    values.main.dispatchEvent(imjcart.logic.event.ProjectEvent.CHANGE_CAMERA_ANGLE_EVENT);
                                });

                                // 車の状態変更イベント
                                this._physics.addEventListener(imjcart.logic.physics.event.PhysicsEvent.CHANGE_CAR_CONDITION_EVENT, function (evt) {
                                    var values = imjcart.logic.value.GlobalValue.getInstance();
                                    values.carInfo.x = evt.x;
                                    values.carInfo.y = evt.y;
                                    values.carInfo.bodyAngle = evt.bodyAngle;
                                    values.carInfo.wheelAngle = evt.wheelAngle;
                                    values.carInfo.speed = evt.speed;
                                    values.carInfo.power = evt.power;
                                    values.carInfo.gear = evt.gear;
                                    values.carInfo.direction = evt.direction;
                                    values.carInfo.colorBody = values.colorBody;
                                    values.carInfo.colorWing = values.colorWing;
                                    values.carInfo.colorDriver = values.colorDriver;
                                    values.carInfo.runningPath.pushPath(evt.x, evt.y, evt.bodyAngle);

                                    //
                                    _this._map.update(values.carInfo.x, values.carInfo.y);
                                    _this._engineCondition.speed = values.carInfo.speed;
                                    _this._engineCondition.power = values.carInfo.power;
                                    _this._engineCondition.gear = values.carInfo.gear;
                                    _this._engineCondition.direction = values.carInfo.direction;
                                    _this._courseMap.update(values.carInfo.x, values.carInfo.y);

                                    // 車の描画更新イベント
                                    values.main.dispatchEvent(imjcart.logic.event.ProjectEvent.RENDER_CAR_EVENT);
                                });

                                // ラップ開始
                                this._map.addEventListener(imjcart.logic.map.event.MapEvent.START_LAP_EVENT, function () {
                                    _this._startLap();
                                });

                                // ラップ記録
                                this._map.addEventListener(imjcart.logic.map.event.MapEvent.RECORD_LAPTIME_EVENT, function () {
                                    _this._recordLapTime();
                                });

                                // 芝に入る
                                this._map.addEventListener(imjcart.logic.map.event.MapEvent.IN_GRASS_EVENT, function () {
                                    _this._inGrass();
                                });

                                // 芝から出る
                                this._map.addEventListener(imjcart.logic.map.event.MapEvent.OUT_GRASS_EVENT, function () {
                                    _this._outGrass();
                                });

                                // 描画更新
                                setInterval(function () {
                                    _this._physics.update();
                                }, 1000 / imjcart.logic.value.Const.FPS);
                            };

                            Run.prototype._startClose = function () {
                                this._btnPause.close();
                            };

                            Run.prototype._completeClose = function () {
                                this._btnPause.close();
                                this._lapTime.close();
                                this._engineCondition.close();
                                this._courseMap.close();
                                this._players.close();
                            };

                            Run.prototype.onResize = function (width, height) {
                                if (width < imjcart.logic.value.Const.STAGE_WIDTH)
                                    width = imjcart.logic.value.Const.STAGE_WIDTH;
                                if (height < imjcart.logic.value.Const.STAGE_HEIGHT)
                                    height = imjcart.logic.value.Const.STAGE_HEIGHT;
                                this.$target.css({
                                    width: width,
                                    height: height - imjcart.logic.value.Const.FOOTER_HEIGHT - imjcart.logic.value.Const.RANKING_HEIGHT
                                });
                            };

                            Run.prototype._startLap = function () {
                                var _this = this;
                                this._time = 0;
                                if (this._intervalId)
                                    clearInterval(this._intervalId);
                                this._intervalId = setInterval(function () {
                                    if (_this._isPause)
                                        return;
                                    _this._time = _this._time + 10;
                                    _this._lapTime.currentTime = _this._time;
                                }, 100);

                                // 走行記録初期化
                                var values = imjcart.logic.value.GlobalValue.getInstance();
                                values.carInfo.runningPath.clearPath();
                                values.carInfo.runningPath.currentIndex = 0;

                                //console.log("走行記録初期化");
                                //console.log(values.carInfo.runningPath.collection);
                                // Startコメント表示
                                if (this._lapTimeArr.length <= 0) {
                                    this._message.message = "Start";
                                    this._message.open();
                                }
                            };

                            Run.prototype._recordLapTime = function () {
                                if (this._time <= 0) {
                                    this._message.message = "Start";
                                    this._message.open();
                                    return;
                                }
                                this._lapTimeArr.push(this._time);

                                // ファステストラップ表示
                                var fastestLap = this._time;
                                var i = 0, max;
                                for (i = 0, max = this._lapTimeArr.length; i < max; i = i + 1) {
                                    var lapTime = this._lapTimeArr[i];
                                    if (lapTime < fastestLap) {
                                        fastestLap = lapTime;
                                    }
                                }
                                this._lapTime.fastestLap = fastestLap;
                                this._lapTime.lapTimeArr = this._lapTimeArr;

                                // Lapコメント表示
                                if (this._time <= fastestLap) {
                                    this._message.message = "FastestLap " + imjcart.logic.utility.Util.formatTime(this._time);

                                    // ファステストラップ設定
                                    var values = imjcart.logic.value.GlobalValue.getInstance();
                                    values.main.dispatchEvent(imjcart.logic.event.ProjectEvent.SET_FASTEST_LAP_EVENT, {
                                        time: this._time
                                    });

                                    // 走行記録保存
                                    values.fastestRunningPathCollection = values.carInfo.runningPath.collection;
                                    //console.log("走行記録保存");
                                    //console.log(values.carInfo.runningPath.collection);
                                    //console.log(values.fastestRunningPathCollection);
                                } else {
                                    this._message.message = "LapTime " + imjcart.logic.utility.Util.formatTime(this._time);
                                }
                                this._message.open();
                            };

                            // 芝に入る
                            Run.prototype._inGrass = function () {
                                // スピードに制限をかける
                                this._physics.setLimitSpeed();
                            };

                            // 芝から出る
                            Run.prototype._outGrass = function () {
                                // スピードの制限を外す
                                this._physics.clearLimitSpeed();
                            };

                            // 一時停止
                            Run.prototype.pause = function () {
                                this._isPause = true;
                                this._physics.pause();
                                this._pauseWindow.open();
                            };

                            // 再開
                            Run.prototype.resume = function () {
                                this._isPause = false;
                                this._physics.resume();
                                this._pauseWindow.close();
                            };

                            // リトライ
                            Run.prototype.retry = function () {
                                // ラップタイム初期化
                                if (this._intervalId)
                                    clearInterval(this._intervalId);
                                this._time = 0;
                                this._lapTime.currentTime = this._time;

                                // 物理演算初期化
                                this._physics.retry();
                            };

                            // ラップタイム保存完了
                            Run.prototype.completeSaveLapTime = function () {
                                this._pauseWindow.completeSaveLapTime();
                            };

                            // 他の車追加
                            Run.prototype.addOtherCar = function (id) {
                                this._players.addOtherCar(id);
                                this._courseMap.addOtherCar(id);
                            };

                            // 他の車除去
                            Run.prototype.removeOtherCar = function (id) {
                                this._players.removeOtherCar(id);
                                this._courseMap.removeOtherCar(id);
                            };

                            // 他の車の姿勢更新
                            Run.prototype.updateOtherCarPosture = function () {
                                this._courseMap.updateOtherCarPosture();
                            };
                            return Run;
                        })(lib.base.BaseDisplay);
                        run.Run = Run;
                    })(timeatack.run || (timeatack.run = {}));
                    var run = timeatack.run;
                })(scene.timeatack || (scene.timeatack = {}));
                var timeatack = scene.timeatack;
            })(main.scene || (main.scene = {}));
            var scene = main.scene;
        })(display.main || (display.main = {}));
        var main = display.main;
    })(imjcart.display || (imjcart.display = {}));
    var display = imjcart.display;
})(imjcart || (imjcart = {}));
