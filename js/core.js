"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * Keyboard Handling
 */

var Keyboard = (function () {
    function Keyboard() {
        _classCallCheck(this, Keyboard);

        this.keys = {};
        this.last_down = null;
        this.last_up = null;
    }

    _createClass(Keyboard, [{
        key: "init",
        value: function init() {
            this.bind();
        }
    }, {
        key: "bind",
        value: function bind() {
            document.addEventListener("keydown", this.keydown.bind(this), false);
            document.addEventListener("keyup", this.keyup.bind(this), false);
        }
    }, {
        key: "keydown",
        value: function keydown(e) {
            var key = e.keyCode;
            this.last_down = key;
            this.keychange(key, true);
        }
    }, {
        key: "keyup",
        value: function keyup(e) {
            var key = e.keyCode;
            this.last_up = key;
            this.keychange(key, false);
        }
    }, {
        key: "keychange",
        value: function keychange(key, pressed) {
            this.keys[key] = pressed;
        }
    }, {
        key: "isdown",
        value: function isdown(key) {
            if (this.keys[key]) {
                return true;
            }
            return false;
        }
    }, {
        key: "isup",
        value: function isup(key) {
            if (this.keys[key]) {
                return true;
            }
            return false;
        }
    }]);

    return Keyboard;
})();

/*
 * Game Core
 */

var GameCore = (function () {
    function GameCore() {
        _classCallCheck(this, GameCore);

        this.viewport_id = "viewport";
        this.viewport = document.querySelector("#" + this.viewport_id);

        // When the last frame was shown
        this.last_update = new Date();

        // Keyboard helper
        this.keyboard = new Keyboard();
        this.keyboard.init();

        this.origin = new Vector();
        this.space_ship = new SpaceShip(this);
        this.edge_threshhold = new Vector(window.innerWidth * 0.2, window.innerHeight * 0.2);

        // Game state
        this.state = {};
        this.state.stars = [];
        this.state.planets = [];
        this.state.particles = [];

        // Locally calculated eycandy
        this.props = {};
        this.props.stars = [];

        this.star_amount = 100;
        // ~ 100 stars on 1920 x 1080 resolution
        this.star_amount = (window.innerWidth + window.innerHeight) / 30;
    }

    _createClass(GameCore, [{
        key: "get_viewport_size",
        value: function get_viewport_size() {
            return new Vector(window.innerWidth, window.innerHeight);
        }
    }, {
        key: "translate_coordinate",
        value: function translate_coordinate(point) {
            var delta = this.get_viewport_size().div(2);
            var coord = point.copy().add(delta).add(this.origin);
            return coord;
        }
    }, {
        key: "in_viewport",
        value: function in_viewport(p) {
            var size = this.get_viewport_size();
            if (p.x >= 0 && p.x < size.x && p.y >= 0 && p.y <= size.y) {
                return true;
            }
            return false;
        }
    }, {
        key: "generate",
        value: function generate() {
            this.generate_bg_stars();
            this.generate_galaxy();
        }
    }, {
        key: "generate_galaxy",
        value: function generate_galaxy() {
            return;
        }
    }, {
        key: "generate_bg_stars",
        value: function generate_bg_stars() {
            for (var i = 0; i < this.star_amount; i++) {
                var star = new BgStar();
                star.randmax(window.innerWidth, window.innerHeight, 99);
                star.depth = 1; // Fake depth
                if (i > this.star_amount * 0.1) {
                    star.depth = 0.985;
                }
                if (i > this.star_amount * 0.55) {
                    star.depth = 0.965;
                }
                if (i > this.star_amount * 0.99) {
                    star.depth = 1.02;
                }
                this.props.stars.push(star);
            }
        }
    }, {
        key: "add_particle",
        value: function add_particle(p) {
            this.state.particles.push(p);
        }
    }, {
        key: "run",
        value: function run() {
            this.generate();

            this.t = 0.0;
            // Delta time 1/60th second.
            this.dt = 1 / 60.0;

            this.current_time = new Date();
            window.requestAnimationFrame(this.step.bind(this));
        }
    }, {
        key: "step",
        value: function step() {
            var new_time = new Date();
            var frame_time = new_time - this.current_time;
            this.current_time = new_time;
            var dt = frame_time / 1000.0;
            this.dt = dt;
            this.update(dt);
            this.render();
            window.requestAnimationFrame(this.step.bind(this));
        }
    }, {
        key: "handle_input",
        value: function handle_input(dt) {
            // W
            if (this.keyboard.isdown(16) && this.keyboard.isdown(87)) {
                this.space_ship.turbo(dt);
            } else if (this.keyboard.isdown(87)) {
                // Shift + W
                this.space_ship.accelerate(dt);
            }
            // A
            if (this.keyboard.isdown(65)) {
                this.space_ship.turn_left(dt);
            }
            // S
            if (this.keyboard.isdown(83)) {
                this.space_ship.brake(dt);
            }
            // D
            if (this.keyboard.isdown(68)) {
                this.space_ship.turn_right(dt);
            }

            // J
            if (this.keyboard.isdown(74) || this.keyboard.isdown(32)) {
                this.space_ship.fire(dt);
            }
            // Q
            if (this.keyboard.isdown(81)) {
                this.space_ship.switch_weapon();
            }
        }
    }, {
        key: "update",
        value: function update(dt) {
            this.handle_input(dt);
            this.space_ship.update(dt);
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.state.particles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var p = _step.value;

                    p.update(dt);
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

            this.move_origin();
        }
    }, {
        key: "move_stars",
        value: function move_stars(add) {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.props.stars[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var star = _step2.value;

                    star.move(add.mul(star.depth));
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
        }
    }, {
        key: "move_origin",
        value: function move_origin() {
            var screen_pos = this.translate_coordinate(this.space_ship.copy());

            var add;
            if (screen_pos.x < this.edge_threshhold.x) {
                add = new Vector(this.edge_threshhold.x - screen_pos.x, 0);
                this.origin.add(add);
                this.move_stars(add);
            }
            if (screen_pos.y < this.edge_threshhold.y) {
                add = new Vector(0, this.edge_threshhold.y - screen_pos.y);
                this.origin.add(add);
                this.move_stars(add);
            }
            if (screen_pos.x > window.innerWidth - this.edge_threshhold.x) {
                add = new Vector(window.innerWidth - this.edge_threshhold.x - screen_pos.x, 0);
                this.origin.add(add);
                this.move_stars(add);
            }
            if (screen_pos.y > window.innerHeight - this.edge_threshhold.y) {
                add = new Vector(0, window.innerHeight - this.edge_threshhold.y - screen_pos.y);
                this.origin.add(add);
                this.move_stars(add);
            }
        }
    }, {
        key: "render",
        value: function render() {
            var ctx = this.viewport.getContext('2d');
            ctx.canvas.width = window.innerWidth;
            ctx.canvas.height = window.innerHeight;
            this.star_amount = (window.innerWidth + window.innerHeight) / 30;

            ctx.font = "12px sans-serif";
            ctx.fillStyle = "rgb(255,255,255)";
            ctx.lineWidth = "1.5";

            var fps = 1 / this.dt;
            ctx.fillText(Math.round(fps) + " FPS", 10, 24);

            ctx.fillText("KEY " + this.keyboard.last_down, 80, 24);
            ctx.fillText(this.state.particles.length + " PARTCLES", 140, 24);

            this.render_stars(ctx);
            this.render_particles(ctx);
            this.space_ship.render(ctx);
        }
    }, {
        key: "render_particles",
        value: function render_particles(ctx) {
            //console.log(this.state.particles);
            var remove = [];
            for (var i = this.state.particles.length - 1; i >= 0; i--) {
                var particle = this.state.particles[i];
                var c = this.translate_coordinate(particle);
                if (!this.in_viewport(c)) {
                    this.state.particles.splice(i, 1);
                    continue;
                }
                ctx.beginPath();
                ctx.fillStyle = particle.fill.to_canvas();
                ctx.strokeStyle = particle.stroke.to_canvas();
                ctx.arc(c.x, c.y, particle.radius, 0, Math.PI * 2, true);
                ctx.stroke();
                ctx.fill();
            }
        }
    }, {
        key: "render_stars",
        value: function render_stars(ctx) {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this.props.stars[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var star = _step3.value;

                    star.update();
                    var value = 0.4 + (star.z - 1) / 2 / 100.0;
                    ctx.strokeStyle = star.color.to_canvas();
                    ctx.beginPath();
                    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2, true);
                    ctx.stroke();
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
        }
    }]);

    return GameCore;
})();

/*
 * Init procedure
 */

function init() {
    var game = new GameCore();
    game.run();
}

init();