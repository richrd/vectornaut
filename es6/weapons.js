
class Weapon {
    constructor(main, ship) {
        this.main = main;
        this.ship = ship;

        this.name = "";
        this.last_fire = new Date();
        this.fire_delay = 100; // Minimum time in ms to wait between shots
    }

    _can_fire() {
        var now = new Date();
        if(now - this.last_fire > this.fire_delay) {
            return true;
        }
    }

    _fire() {
        if(this._can_fire()) {
            this.fire();
            this.last_fire = new Date();
            return true;
        }

        return false;
    }

    fire() {
        return;
    }

    add_bullet(angle=0, speed=300) {
        var bullet = new Bullet(this.ship.copy().x, this.ship.copy().y);
        bullet.speed = this.ship.speed.copy();
        bullet.fill = new Color(Math.random()*254,Math.random()*254,Math.random()*254);
        bullet.stroke = new Color(Math.random()*254,Math.random()*254,Math.random()*254);
        bullet.speed.add(new Vector(speed, 0).rotate(this.ship.angle + angle));
        this.main.add_particle(bullet);
        return bullet;
    }
}

class Rainbow extends Weapon {
    constructor(main, ship) {
        super(main, ship);
        this.main = main;
        this.ship = ship;
        this.name = "Minigun";
        this.fire_delay = 100;
    }

    fire() {
        console.log("_fire");
        var bullet = this.add_bullet(0);
        bullet.radius = 1+(Math.random()*3);
    }
}
