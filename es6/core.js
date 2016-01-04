
/*
 * Keyboard Handling
 */
class Keyboard {
    constructor() {
        this.keys = {};
        this.last_down = null;
        this.last_up = null;
    }

    init() {
        this.bind();
    }

    bind() {
        document.addEventListener("keydown", this.keydown.bind(this), false);
        document.addEventListener("keyup", this.keyup.bind(this), false);
    }

    keydown(e) {
        var key = e.keyCode;
        this.last_down = key;
        this.keychange(key, true);
    }

    keyup(e) {
        var key = e.keyCode;
        this.last_up = key;
        this.keychange(key, false);
    }

    keychange(key, pressed) {
        this.keys[key] = pressed;
    }

    isdown(key) {
        if(this.keys[key]) {
            return true;
        }
        return false;
    }

    isup(key) {
        if(this.keys[key]) {
            return true;
        }
        return false;
    }
}



/*
 * Game Core
 */
class GameCore {
    constructor() {
        this.viewport_id = "viewport";
        this.viewport = document.querySelector("#" + this.viewport_id);

        // When the last frame was shown
        this.last_update = new Date();

        // Keyboard helper
        this.keyboard = new Keyboard();
        this.keyboard.init();

        this.origin = new Vector();
        this.space_ship = new SpaceShip(this);
        this.edge_threshhold = new Vector(window.innerWidth*0.2, window.innerHeight*0.2);

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
        this.star_amount = (window.innerWidth+window.innerHeight)/30;
    }

    get_viewport_size() {
        return new Vector(window.innerWidth, window.innerHeight);
    }

    translate_coordinate(point) {
        var delta = this.get_viewport_size().div(2);
        var coord = point.copy().add(delta).add(this.origin);
        return coord;
    }

    in_viewport(p) {
        var size = this.get_viewport_size();
        if(
            p.x >= 0 &&
            p.x < size.x &&
            p.y >= 0 &&
            p.y <= size.y
        ) {
            return true;
        }
        return false;
    }

    generate() {
        this.generate_bg_stars();
        this.generate_galaxy();
    }

    generate_galaxy() {
        return;
    }

    generate_bg_stars() {
        for (var i = 0; i < this.star_amount; i++) {
            var star = new BgStar();
            star.randmax(window.innerWidth, window.innerHeight, 99);
            star.depth = 1; // Fake depth
            if (i > this.star_amount*0.1) {
                star.depth = 0.985;
            }
            if (i > this.star_amount*0.55) {
                star.depth = 0.965;
            }
            if (i > this.star_amount*0.99) {
                star.depth = 1.02;
            }
            this.props.stars.push(star);
        }
    }

    add_particle(p) {
        this.state.particles.push(p);
    }

    run() {
        this.generate();

        this.t = 0.0;
        // Delta time 1/60th second.
        this.dt = 1 / 60.0;

        this.current_time = new Date();
        window.requestAnimationFrame(this.step.bind(this));
    }

    step() {
        var new_time = new Date();
        var frame_time = new_time - this.current_time;
        this.current_time = new_time;
        var dt = frame_time / 1000.0;
        this.dt = dt;
        this.update(dt);
        this.render();
        window.requestAnimationFrame(this.step.bind(this));
    }

    handle_input(dt) {
        // W
        if(this.keyboard.isdown(16) && this.keyboard.isdown(87)) {
            this.space_ship.turbo(dt);
        } else if(this.keyboard.isdown(87)) {
            // Shift + W
            this.space_ship.accelerate(dt);
        }
        // A
        if(this.keyboard.isdown(65)) {
            this.space_ship.turn_left(dt);
        }
        // S
        if(this.keyboard.isdown(83)) {
            this.space_ship.brake(dt);
        }
        // D
        if(this.keyboard.isdown(68)) {
            this.space_ship.turn_right(dt);
        }

        // J
        if(this.keyboard.isdown(74) ||
           this.keyboard.isdown(32)) {
            this.space_ship.fire(dt);
        }
        // Q
        if(this.keyboard.isdown(81)) {
            this.space_ship.switch_weapon();
        }

    }

    update(dt) {
        this.handle_input(dt);
        this.space_ship.update(dt);
        for(var p of this.state.particles) {
            p.update(dt);
        }
        this.move_origin();
    }

    move_stars(add) {
        for(var star of this.props.stars) {
            star.move(add.mul(star.depth));
        }
    }

    move_origin() {
        var screen_pos = this.translate_coordinate(this.space_ship.copy());

        var add;
        if(screen_pos.x < this.edge_threshhold.x) {
            add = new Vector(this.edge_threshhold.x-screen_pos.x, 0);
            this.origin.add(add);
            this.move_stars(add);
        }
        if(screen_pos.y < this.edge_threshhold.y) {
            add = new Vector(0,this.edge_threshhold.y-screen_pos.y);
            this.origin.add(add);
            this.move_stars(add);
        }
        if(screen_pos.x > window.innerWidth-this.edge_threshhold.x) {
            add = new Vector(window.innerWidth-this.edge_threshhold.x-screen_pos.x, 0);
            this.origin.add(add);
            this.move_stars(add);
        }
        if(screen_pos.y > window.innerHeight-this.edge_threshhold.y) {
            add = new Vector(0,window.innerHeight-this.edge_threshhold.y-screen_pos.y);
            this.origin.add(add);
            this.move_stars(add);
        }

    }

    render() {
        var ctx = this.viewport.getContext('2d');
        ctx.canvas.width  = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
        this.star_amount= (window.innerWidth+window.innerHeight)/30;

        ctx.font = "12px sans-serif";
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.lineWidth = "1.5";

        var fps = 1 / this.dt;
        ctx.fillText(Math.round(fps) + " FPS",  10, 24);

        ctx.fillText("KEY " + this.keyboard.last_down,  80, 24);
        ctx.fillText(this.state.particles.length + " PARTCLES",  140, 24);

        this.render_stars(ctx);
        this.render_particles(ctx);
        this.space_ship.render(ctx);
    }

    render_particles(ctx) {
        //console.log(this.state.particles);
        var remove = [];
        for (var i = this.state.particles.length - 1; i >= 0; i--) {
            var particle = this.state.particles[i];
            var c = this.translate_coordinate(particle);
            if(!this.in_viewport(c)) {
                this.state.particles.splice(i, 1);
                continue;
            }
            ctx.beginPath();
            ctx.fillStyle = particle.fill.to_canvas();
            ctx.strokeStyle = particle.stroke.to_canvas();
            ctx.arc(c.x, c.y, particle.radius, 0, Math.PI*2, true);
            ctx.stroke();
            ctx.fill();
        }
    }

    render_stars(ctx) {
        for(var star of this.props.stars) {
            star.update();
            var value = 0.4 + (star.z-1) / 2 / 100.0;
            ctx.strokeStyle = star.color.to_canvas();
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI*2, true);
            ctx.stroke();
        }
    }

}


/*
 * Init procedure
 */
function init() {
    var game = new GameCore();
    game.run();
}

init();
