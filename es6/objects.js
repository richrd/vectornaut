

class Vector {
    constructor(x=0, y=0, z=0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    static randomIntBetween(max, min) {
        return Math.floor(Math.random()*(max-min+1)+min);
    }

    set(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
    }

    copy() {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        return new Vector(x, y, z);
    }

    add(v) {
        this.x = this.x + v.x;
        this.y = this.y + v.y;
        this.z = this.z + v.z;
        return this;
    }

    sub(v) {
        this.x = this.x - v.x;
        this.y = this.y - v.y;
        this.z = this.z - v.z;
        return this;
    }

    mul(m) {
        this.x = this.x * m;
        this.y = this.y * m;
        this.z = this.z * m;
        return this;
    }

    div(d) {
        this.x = this.x / d;
        this.y = this.y / d;
        this.z = this.z / d;
        return this;
    }

    combine() {
        return Math.abs(this.x)+Math.abs(this.y);
    }

    dist(v) {
        xd = this.x - v.x;
        yd = this.y - v.y;
        return Math.sqrt(  Math.pow(Math.abs(xd),2) + Math.pow(Math.abs(yd),2)  );
    }

    invert() {
        this.x = this.x * -1;
        this.y = this.y * -1;
        this.z = this.z * -1;
        return this;
    }

    rotate(angle, origin) {
        if(!origin) {
            origin = new Vector();
        }
        angle = angle * Math.PI / 180.0;
        var x = Math.cos(angle) * (this.x-origin.x) - Math.sin(angle) * (this.y-origin.y) + origin.x;
        var y = Math.sin(angle) * (this.x-origin.x) + Math.cos(angle) * (this.y-origin.y) + origin.y;
        this.x = x;
        this.y = y;
        return this;
    }

    randmax(x,y,z) {
        this.x = Math.floor(Math.random() * x) + 1;
        this.y = Math.floor(Math.random() * y) + 1;
        this.z = Math.floor(Math.random() * z) + 1;
    }

}



class BgStar extends Vector {
    constructor() {
        super();
        this.color = new Color(255,255,255);
        this.depth = 1;
        this.twinkle = (Vector.randomIntBetween(0, 13) == 1);
        this.radius = Vector.randomIntBetween(1, 8)/10.0;
    }

    warp() {
        this.twinkle = false;
        this.radius = (Vector.randomIntBetween(1, 8)/10.0)*(this.depth*1.5);
        this.color = new Color(255, 255, 255, Math.random()*(this.depth*1.5));
        if(Vector.randomIntBetween(0, 13) == 1) {
            this.twinkle = true;
        } else {
            this.z = Vector.randomIntBetween(0, 99);
        }
        if(Vector.randomIntBetween(0, 150) == 1) {
            this.color = Color.from_hsv(Vector.randomIntBetween(0,255), 205, 250);
        }
    }

    move(add) {
        this.add(add);
        if(this.x < 0) {
            this.x = window.innerWidth;
            this.y = Vector.randomIntBetween(0,window.innerHeight);
            this.warp();
        }
        if(this.x > window.innerWidth) {
            this.x = 0;
            this.y = Vector.randomIntBetween(0,window.innerHeight);
            this.warp();
        }
        if(this.y < 0) {
            this.y = window.innerHeight;
            this.x = Vector.randomIntBetween(0,window.innerWidth);
            this.warp();
        }
        if(this.y > window.innerHeight) {
            this.y = 0;
            this.x = Vector.randomIntBetween(0,window.innerWidth);
            this.warp();
        }
    }

    update() {
        if(this.twinkle) {
            this.color.a = Math.random();
        }
    }

}



class Particle extends Vector {
    constructor(x=0, y=0) {
        super(x, y);
        this.speed = new Vector();
    }

    update(dt) {
        this.add(this.speed.copy().mul(dt));
    }
}



class Bullet extends Particle {
    constructor(x=0, y=0) {
        super(x, y);
        this.radius = 1;
        this.color = new Color();
    }
}
