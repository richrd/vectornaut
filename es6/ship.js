/**
 * The space ship
 */
class SpaceShip extends Particle {
    constructor(main) {
        super();
        this.main = main;

        this.mass = 169;
        this.radius = 10;
        this.angle = 270;

        this.weapon = new Rainbow(this.main, this);

        // Degrees to turn (in 1 second)
        this.turn_amount = 270;
        this.accel_normal = 150;
        this.accel_turbo = 5.5*this.accel_normal;
        this.brake_amount = 260;

        this.color = {
            ship: {
                fill: new Color(31, 46, 51),
                stroke: new Color(156, 232, 255, 0.95),
            },
            thrust: {
                fill: new Color(255, 230, 150, 0.6),
                stroke: new Color(245, 60, 60, 0.95),
            },
            turbo: {
                fill: new Color(10, 80, 255, 1),
                stroke: new Color(130, 120, 220, 1),
            }
        };

        this.shape = {
            ship: [
                {x:15, y:0},
                {x:-9,  y:11},
                {x:-4,  y:0},
                {x:-9, y:-11}
            ],
            thrust: [
                {x:-11, y:0},
                {x:-5, y:3},
                {x:-5, y:-3}
            ]
        };
    }

    turn_left(dt) {
        this.angle = this.angle - (this.turn_amount*dt);
        if(this.angle < 0) {
            this.angle = 360 - Math.abs(this.angle);
        }
    }

    turn_right(dt) {
        this.angle = this.angle + (this.turn_amount*dt);
        if(this.angle > 360) {
            this.angle -= 360;
        }
    }

    accelerate(dt) {
        this.accelerating = true;
        var amount = (this.accel_normal*dt);
        var v = new Vector(amount, 0).rotate(this.angle);
        this.speed.add(v);
    }

    turbo(dt) {
        this.turbo_on = true;
        var amount = (this.accel_turbo*dt);
        var v = new Vector(amount, 0).rotate(this.angle);
        this.speed.add(v);
    }

    brake(dt) {
        var amount = (this.brake_amount*dt);
        var v = new Vector(amount, 0).rotate(this.angle+180);
        this.speed.add(v);
    }

    fire(dt) {
        this.weapon._fire();
    }

    switch_weapon() {
    
    }

    update(dt) {
        this.add(this.speed.copy().mul(dt));
    }

    _polygon(ctx, points) {
        var startpoint = this.main.translate_coordinate(points[0]);
        ctx.beginPath();
        ctx.lineTo(startpoint.x, startpoint.y);
        for(var p of points) {
            p = this.main.translate_coordinate(p);
            ctx.lineTo(p.x, p.y);
        }
        ctx.lineTo(startpoint.x, startpoint.y);
        ctx.fill();
        ctx.stroke();
    }

    render(ctx) {
        this.render_thrust(ctx);
        this.render_ship(ctx);
        this.accelerating = false;
        this.turbo_on = false;
    }

    render_ship(ctx) {
        var points;
        // Ship
        points = [];
        for(var p of this.shape.ship) {
            points.push(new Vector(p.x, p.y).rotate(this.angle).add(this));
        }
        ctx.strokeStyle = this.color.ship.stroke.to_canvas();
        ctx.fillStyle = this.color.ship.fill.to_canvas();
        this._polygon(ctx, points);
    }

    render_thrust(ctx) {
        var points;
        var point;
        // Thrust
        if(this.accelerating || this.turbo_on) {
            var points = [];
            for(var p of this.shape.thrust) {
                point = new Vector(p.x, p.y);
                if(p == this.shape.thrust[0]) {
                    point.mul(1+(Math.random()/3));
                }
                if(this.turbo_on) {
                    point.mul(1.1+(Math.random()/2.2));
                }
                point.rotate(this.angle).add(this);
                points.push(point);
            }

            var fill = this.color.thrust.fill.copy().set_a(0.4 + (Math.random()/2));
            var stroke = this.color.thrust.stroke.copy().set_a(0.4 + (Math.random()/2));
            ctx.strokeStyle = stroke.to_canvas();
            ctx.fillStyle = fill.to_canvas();
            if(this.turbo_on) {
                fill = this.color.turbo.fill.copy().set_a(0.4 + (Math.random()/2));
                stroke = this.color.turbo.stroke.copy().set_a(0.4 + (Math.random()/2));
                ctx.strokeStyle = stroke.to_canvas();
                ctx.fillStyle = fill.to_canvas();
            }
            this._polygon(ctx, points);
        }
    }
}



