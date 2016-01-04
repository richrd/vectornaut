"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Color = (function () {
    function Color() {
        var r = arguments.length <= 0 || arguments[0] === undefined ? 255 : arguments[0];
        var g = arguments.length <= 1 || arguments[1] === undefined ? 255 : arguments[1];
        var b = arguments.length <= 2 || arguments[2] === undefined ? 255 : arguments[2];
        var a = arguments.length <= 3 || arguments[3] === undefined ? 1.0 : arguments[3];

        _classCallCheck(this, Color);

        this.r = Math.round(r);
        this.g = Math.round(g);
        this.b = Math.round(b);
        this.a = a;
    }

    _createClass(Color, [{
        key: "set_r",
        value: function set_r(r) {
            this.r = r;
            return this;
        }
    }, {
        key: "set_g",
        value: function set_g(g) {
            this.g = g;
            return this;
        }
    }, {
        key: "set_b",
        value: function set_b(b) {
            this.b = b;
            return this;
        }
    }, {
        key: "set_a",
        value: function set_a(a) {
            this.a = a;
            return this;
        }
    }, {
        key: "copy",
        value: function copy() {
            return new Color(this.r, this.g, this.b, this.a);
        }
    }, {
        key: "to_canvas",
        value: function to_canvas() {
            return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
        }
    }], [{
        key: "from_hsv",
        value: function from_hsv() {
            var h = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
            var s = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
            var v = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
            var a = arguments.length <= 3 || arguments[3] === undefined ? 1.0 : arguments[3];

            var rgb = Color.hsv_to_rgb(h, s, v);
            var r = rgb[0];
            var g = rgb[1];
            var b = rgb[2];
            return new Color(r, g, b, a);
        }
    }, {
        key: "hsv_to_rgb",
        value: function hsv_to_rgb(h, s, v) {
            h = h / 255.0;
            s = s / 255.0;
            v = v / 255.0;
            var h_i = parseInt(h * 6);
            var f = h * 6 - h_i;
            var p = v * (1 - s);
            var q = v * (1 - f * s);
            var t = v * (1 - (1 - f) * s);

            var r;
            var g;
            var b;
            if (h_i === 0) {
                r = v;
                g = t;
                b = p;
            }
            if (h_i == 1) {
                r = q;
                g = v;
                b = p;
            }
            if (h_i == 2) {
                r = p;
                g = v;
                b = t;
            }
            if (h_i == 3) {
                r = p;
                g = q;
                b = v;
            }
            if (h_i == 4) {
                r = t;
                g = p;
                b = v;
            }
            if (h_i == 5) {
                r = v;
                g = p;
                b = q;
            }

            var rgb = [parseInt(r * 256), parseInt(g * 256), parseInt(b * 256)];
            return rgb;
        }
    }]);

    return Color;
})();