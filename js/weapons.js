"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Weapon = (function () {
    function Weapon(main, ship) {
        _classCallCheck(this, Weapon);

        this.main = main;
        this.ship = ship;

        this.name = "";
        this.last_fire = new Date();
        this.fire_delay = 100; // Minimum time in ms to wait between shots
    }

    _createClass(Weapon, [{
        key: "_can_fire",
        value: function _can_fire() {
            var now = new Date();
            if (now - this.last_fire > this.fire_delay) {
                return true;
            }
        }
    }, {
        key: "_fire",
        value: function _fire() {
            if (this._can_fire()) {
                this.fire();
                this.last_fire = new Date();
                return true;
            }

            return false;
        }
    }, {
        key: "fire",
        value: function fire() {
            return;
        }
    }, {
        key: "add_bullet",
        value: function add_bullet() {
            var angle = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
            var speed = arguments.length <= 1 || arguments[1] === undefined ? 300 : arguments[1];

            var bullet = new Bullet(this.ship.copy().x, this.ship.copy().y);
            bullet.speed = this.ship.speed.copy();
            bullet.fill = new Color(Math.random() * 254, Math.random() * 254, Math.random() * 254);
            bullet.stroke = new Color(Math.random() * 254, Math.random() * 254, Math.random() * 254);
            bullet.speed.add(new Vector(speed, 0).rotate(this.ship.angle + angle));
            this.main.add_particle(bullet);
            return bullet;
        }
    }]);

    return Weapon;
})();

var Rainbow = (function (_Weapon) {
    _inherits(Rainbow, _Weapon);

    function Rainbow(main, ship) {
        _classCallCheck(this, Rainbow);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Rainbow).call(this, main, ship));

        _this.main = main;
        _this.ship = ship;
        _this.name = "Minigun";
        _this.fire_delay = 100;
        return _this;
    }

    _createClass(Rainbow, [{
        key: "fire",
        value: function fire() {
            console.log("_fire");
            var bullet = this.add_bullet(0);
            bullet.radius = 1 + Math.random() * 3;
        }
    }]);

    return Rainbow;
})(Weapon);