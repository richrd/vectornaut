"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Vector = (function () {
    function Vector() {
        var x = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
        var y = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
        var z = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

        _classCallCheck(this, Vector);

        this.x = x;
        this.y = y;
        this.z = z;
    }

    _createClass(Vector, [{
        key: "set",
        value: function set(v) {
            this.x = v.x;
            this.y = v.y;
            this.z = v.z;
        }
    }, {
        key: "copy",
        value: function copy() {
            var x = this.x;
            var y = this.y;
            var z = this.z;
            return new Vector(x, y, z);
        }
    }, {
        key: "add",
        value: function add(v) {
            this.x = this.x + v.x;
            this.y = this.y + v.y;
            this.z = this.z + v.z;
            return this;
        }
    }, {
        key: "sub",
        value: function sub(v) {
            this.x = this.x - v.x;
            this.y = this.y - v.y;
            this.z = this.z - v.z;
            return this;
        }
    }, {
        key: "mul",
        value: function mul(m) {
            this.x = this.x * m;
            this.y = this.y * m;
            this.z = this.z * m;
            return this;
        }
    }, {
        key: "div",
        value: function div(d) {
            this.x = this.x / d;
            this.y = this.y / d;
            this.z = this.z / d;
            return this;
        }
    }, {
        key: "combine",
        value: function combine() {
            return Math.abs(this.x) + Math.abs(this.y);
        }
    }, {
        key: "dist",
        value: function dist(v) {
            xd = this.x - v.x;
            yd = this.y - v.y;
            return Math.sqrt(Math.pow(Math.abs(xd), 2) + Math.pow(Math.abs(yd), 2));
        }
    }, {
        key: "invert",
        value: function invert() {
            this.x = this.x * -1;
            this.y = this.y * -1;
            this.z = this.z * -1;
            return this;
        }
    }, {
        key: "rotate",
        value: function rotate(angle, origin) {
            if (!origin) {
                origin = new Vector();
            }
            angle = angle * Math.PI / 180.0;
            var x = Math.cos(angle) * (this.x - origin.x) - Math.sin(angle) * (this.y - origin.y) + origin.x;
            var y = Math.sin(angle) * (this.x - origin.x) + Math.cos(angle) * (this.y - origin.y) + origin.y;
            this.x = x;
            this.y = y;
            return this;
        }
    }, {
        key: "randmax",
        value: function randmax(x, y, z) {
            this.x = Math.floor(Math.random() * x) + 1;
            this.y = Math.floor(Math.random() * y) + 1;
            this.z = Math.floor(Math.random() * z) + 1;
        }
    }], [{
        key: "randomIntBetween",
        value: function randomIntBetween(max, min) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        }
    }]);

    return Vector;
})();

var BgStar = (function (_Vector) {
    _inherits(BgStar, _Vector);

    function BgStar() {
        _classCallCheck(this, BgStar);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BgStar).call(this));

        _this.color = new Color(255, 255, 255);
        _this.depth = 1;
        _this.twinkle = Vector.randomIntBetween(0, 13) == 1;
        _this.radius = Vector.randomIntBetween(1, 8) / 10.0;
        return _this;
    }

    _createClass(BgStar, [{
        key: "warp",
        value: function warp() {
            this.twinkle = false;
            this.radius = Vector.randomIntBetween(1, 8) / 10.0 * (this.depth * 1.5);
            this.color = new Color(255, 255, 255, Math.random() * (this.depth * 1.5));
            if (Vector.randomIntBetween(0, 13) == 1) {
                this.twinkle = true;
            } else {
                this.z = Vector.randomIntBetween(0, 99);
            }
            if (Vector.randomIntBetween(0, 150) == 1) {
                this.color = Color.from_hsv(Vector.randomIntBetween(0, 255), 205, 250);
            }
        }
    }, {
        key: "move",
        value: function move(add) {
            this.add(add);
            if (this.x < 0) {
                this.x = window.innerWidth;
                this.y = Vector.randomIntBetween(0, window.innerHeight);
                this.warp();
            }
            if (this.x > window.innerWidth) {
                this.x = 0;
                this.y = Vector.randomIntBetween(0, window.innerHeight);
                this.warp();
            }
            if (this.y < 0) {
                this.y = window.innerHeight;
                this.x = Vector.randomIntBetween(0, window.innerWidth);
                this.warp();
            }
            if (this.y > window.innerHeight) {
                this.y = 0;
                this.x = Vector.randomIntBetween(0, window.innerWidth);
                this.warp();
            }
        }
    }, {
        key: "update",
        value: function update() {
            if (this.twinkle) {
                this.color.a = Math.random();
            }
        }
    }]);

    return BgStar;
})(Vector);

var Particle = (function (_Vector2) {
    _inherits(Particle, _Vector2);

    function Particle() {
        var x = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
        var y = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

        _classCallCheck(this, Particle);

        var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Particle).call(this, x, y));

        _this2.speed = new Vector();
        return _this2;
    }

    _createClass(Particle, [{
        key: "update",
        value: function update(dt) {
            this.add(this.speed.copy().mul(dt));
        }
    }]);

    return Particle;
})(Vector);

var Bullet = (function (_Particle) {
    _inherits(Bullet, _Particle);

    function Bullet() {
        var x = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
        var y = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

        _classCallCheck(this, Bullet);

        var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(Bullet).call(this, x, y));

        _this3.radius = 1;
        _this3.color = new Color();
        return _this3;
    }

    return Bullet;
})(Particle);