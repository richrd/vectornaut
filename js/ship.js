"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * The space ship
 */

var SpaceShip = (function (_Particle) {
    _inherits(SpaceShip, _Particle);

    function SpaceShip(main) {
        _classCallCheck(this, SpaceShip);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SpaceShip).call(this));

        _this.main = main;

        _this.mass = 169;
        _this.radius = 10;
        _this.angle = 270;

        _this.weapon = new Rainbow(_this.main, _this);

        // Degrees to turn (in 1 second)
        _this.turn_amount = 270;
        _this.accel_normal = 150;
        _this.accel_turbo = 5.5 * _this.accel_normal;
        _this.brake_amount = 260;

        _this.color = {
            ship: {
                fill: new Color(31, 46, 51),
                stroke: new Color(156, 232, 255, 0.95)
            },
            thrust: {
                fill: new Color(255, 230, 150, 0.6),
                stroke: new Color(245, 60, 60, 0.95)
            },
            turbo: {
                fill: new Color(10, 80, 255, 1),
                stroke: new Color(130, 120, 220, 1)
            }
        };

        _this.shape = {
            ship: [{ x: 15, y: 0 }, { x: -9, y: 11 }, { x: -4, y: 0 }, { x: -9, y: -11 }],
            thrust: [{ x: -11, y: 0 }, { x: -5, y: 3 }, { x: -5, y: -3 }]
        };
        return _this;
    }

    _createClass(SpaceShip, [{
        key: "turn_left",
        value: function turn_left(dt) {
            this.angle = this.angle - this.turn_amount * dt;
            if (this.angle < 0) {
                this.angle = 360 - Math.abs(this.angle);
            }
        }
    }, {
        key: "turn_right",
        value: function turn_right(dt) {
            this.angle = this.angle + this.turn_amount * dt;
            if (this.angle > 360) {
                this.angle -= 360;
            }
        }
    }, {
        key: "accelerate",
        value: function accelerate(dt) {
            this.accelerating = true;
            var amount = this.accel_normal * dt;
            var v = new Vector(amount, 0).rotate(this.angle);
            this.speed.add(v);
        }
    }, {
        key: "turbo",
        value: function turbo(dt) {
            this.turbo_on = true;
            var amount = this.accel_turbo * dt;
            var v = new Vector(amount, 0).rotate(this.angle);
            this.speed.add(v);
        }
    }, {
        key: "brake",
        value: function brake(dt) {
            var amount = this.brake_amount * dt;
            var v = new Vector(amount, 0).rotate(this.angle + 180);
            this.speed.add(v);
        }
    }, {
        key: "fire",
        value: function fire(dt) {
            this.weapon._fire();
        }
    }, {
        key: "switch_weapon",
        value: function switch_weapon() {}
    }, {
        key: "update",
        value: function update(dt) {
            this.add(this.speed.copy().mul(dt));
        }
    }, {
        key: "_polygon",
        value: function _polygon(ctx, points) {
            var startpoint = this.main.translate_coordinate(points[0]);
            ctx.beginPath();
            ctx.lineTo(startpoint.x, startpoint.y);
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = points[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var p = _step.value;

                    p = this.main.translate_coordinate(p);
                    ctx.lineTo(p.x, p.y);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            ctx.lineTo(startpoint.x, startpoint.y);
            ctx.fill();
            ctx.stroke();
        }
    }, {
        key: "render",
        value: function render(ctx) {
            this.render_thrust(ctx);
            this.render_ship(ctx);
            this.accelerating = false;
            this.turbo_on = false;
        }
    }, {
        key: "render_ship",
        value: function render_ship(ctx) {
            var points;
            // Ship
            points = [];
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.shape.ship[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var p = _step2.value;

                    points.push(new Vector(p.x, p.y).rotate(this.angle).add(this));
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            ctx.strokeStyle = this.color.ship.stroke.to_canvas();
            ctx.fillStyle = this.color.ship.fill.to_canvas();
            this._polygon(ctx, points);
        }
    }, {
        key: "render_thrust",
        value: function render_thrust(ctx) {
            var points;
            var point;
            // Thrust
            if (this.accelerating || this.turbo_on) {
                var points = [];
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = this.shape.thrust[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var p = _step3.value;

                        point = new Vector(p.x, p.y);
                        if (p == this.shape.thrust[0]) {
                            point.mul(1 + Math.random() / 3);
                        }
                        if (this.turbo_on) {
                            point.mul(1.1 + Math.random() / 2.2);
                        }
                        point.rotate(this.angle).add(this);
                        points.push(point);
                    }
                } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                        }
                    } finally {
                        if (_didIteratorError3) {
                            throw _iteratorError3;
                        }
                    }
                }

                var fill = this.color.thrust.fill.copy().set_a(0.4 + Math.random() / 2);
                var stroke = this.color.thrust.stroke.copy().set_a(0.4 + Math.random() / 2);
                ctx.strokeStyle = stroke.to_canvas();
                ctx.fillStyle = fill.to_canvas();
                if (this.turbo_on) {
                    fill = this.color.turbo.fill.copy().set_a(0.4 + Math.random() / 2);
                    stroke = this.color.turbo.stroke.copy().set_a(0.4 + Math.random() / 2);
                    ctx.strokeStyle = stroke.to_canvas();
                    ctx.fillStyle = fill.to_canvas();
                }
                this._polygon(ctx, points);
            }
        }
    }]);

    return SpaceShip;
})(Particle);