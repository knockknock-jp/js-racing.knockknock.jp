/// <reference path="../../../lib/jquery.d.ts"/>
/// <reference path="../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../lib/three.d.ts"/>
/// <reference path="../../../lib/lib.ts"/>
/// <reference path="../../../imjcart/logic/map/value/MapConst.ts"/>
var imjcart;
(function (imjcart) {
    (function (logic) {
        (function (physics) {
            var Circle = (function () {
                function Circle(context, world, x, y, radius, options) {
                    this._context = null;
                    this._world = null;
                    this._x = null;
                    this._y = null;
                    this._radius = null;
                    this._options = null;
                    this._body = null;
                    this._bodyDef = null;
                    this._fixtureDef = null;
                    this._context = context;
                    this._world = world;
                    this._x = x;
                    this._y = y;
                    this._radius = radius;
                    this._options = options;

                    //
                    this._options = $.extend(true, {
                        density: 1,
                        friction: 0,
                        restitution: 0.2,
                        linearDamping: 0,
                        angularDamping: 0,
                        gravityScale: 1,
                        type: Box2D.Dynamics.b2Body.b2_dynamicBody
                    }, this._options);

                    //
                    this._fixtureDef = new Box2D.Dynamics.b2FixtureDef();
                    this._fixtureDef.density = this._options.density;
                    this._fixtureDef.friction = this._options.friction;
                    this._fixtureDef.restitution = this._options.restitution;
                    this._fixtureDef.shape = new Box2D.Collision.Shapes.b2CircleShape();
                    this._fixtureDef.shape.SetRadius(this._radius / 2 / imjcart.logic.map.value.MapConst.MAP_SCALE);

                    //
                    this._bodyDef = new Box2D.Dynamics.b2BodyDef();
                    this._bodyDef.position.Set(this._x / imjcart.logic.map.value.MapConst.MAP_SCALE, this._y / imjcart.logic.map.value.MapConst.MAP_SCALE);
                    this._bodyDef.linearDamping = this._options.linearDamping;
                    this._bodyDef.angularDamping = this._options.angularDamping;
                    this._bodyDef.type = this._options.type;

                    //
                    this._body = this._world.CreateBody(this._bodyDef);
                    this._body.CreateFixture(this._fixtureDef);
                }
                Object.defineProperty(Circle.prototype, "body", {
                    get: function () {
                        return this._body;
                    },
                    enumerable: true,
                    configurable: true
                });

                Circle.prototype.destroy = function () {
                    this._world.DestroyBody(this._body);
                };
                return Circle;
            })();
            physics.Circle = Circle;
        })(logic.physics || (logic.physics = {}));
        var physics = logic.physics;
    })(imjcart.logic || (imjcart.logic = {}));
    var logic = imjcart.logic;
})(imjcart || (imjcart = {}));
