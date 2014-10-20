/// <reference path="../../../lib/jquery.d.ts"/>
/// <reference path="../../../lib/box2dweb.d.ts"/>
/// <reference path="../../../lib/three.d.ts"/>
/// <reference path="../../../lib/lib.ts"/>
/// <reference path="../../../imjcart/logic/map/value/MapConst.ts"/>

module imjcart.logic.physics {

    export class Box {

        private _context:any = null;
        private _world:Box2D.Dynamics.b2World = null;
        private _x:number = null;
        private _y:number = null;
        private _width:number = null;
        private _height:number = null;
        private _options:any = null;
        private _body:any = null;
        private _bodyDef:any = null;
        private _fixtureDef:any = null;

        constructor(context:any, world:Box2D.Dynamics.b2World, x:number, y:number, width:number, height:number, options:any) {
            this._context = context;
            this._world = world;
            this._x = x;
            this._y = y;
            this._width = width;
            this._height = height;
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
            this._fixtureDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
            this._fixtureDef.shape.SetAsBox(this._width / 2 / imjcart.logic.map.value.MapConst.MAP_SCALE, this._height / 2 / imjcart.logic.map.value.MapConst.MAP_SCALE);
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

        public get body() {
            return this._body;
        }

        public destroy() {
            this._world.DestroyBody(this._body);
        }

    }

}