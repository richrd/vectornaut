class Color {
    constructor(r=255, g=255, b=255, a=1.0) {
        this.r = Math.round(r);
        this.g = Math.round(g);
        this.b = Math.round(b);
        this.a = a;
    }

    set_r(r) {
        this.r = r;
        return this;
    }

    set_g(g) {
        this.g = g;
        return this;
    }

    set_b(b) {
        this.b = b;
        return this;
    }

    set_a(a) {
        this.a = a;
        return this;
    }

    copy() {
        return new Color(this.r, this.g, this.b, this.a);
    }

    static from_hsv(h=0, s=0, v=0, a=1.0) {
        var rgb = Color.hsv_to_rgb(h,s,v);
        var r = rgb[0];
        var g = rgb[1];
        var b = rgb[2];
        return new Color(r, g, b, a);
    }

    to_canvas() {
        return "rgba("+this.r+","+this.g+","+this.b+","+this.a+")";
    }

    static hsv_to_rgb(h, s, v) {
        h = h / 255.0;
        s = s / 255.0;
        v = v / 255.0;
        var h_i = parseInt(h*6);
        var f = h*6 - h_i;
        var p = v * (1 - s);
        var q = v * (1 - f*s);
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

        var rgb = [parseInt(r*256), parseInt(g*256), parseInt(b*256)];
        return rgb;
    }

}
