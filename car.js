class Car {
    constructor(x, y, w, h) {
        this.pos = { x, y };
        this.vel = { x: 0, y: 0 }

        this.w = w;
        this.h = h;

        this.speed = 0.4;
        this.friction = 0.05;

        this.angle = 0;

        this.dx = 0;
        this.dy = 0;

        this.carCorners = []; //[{x, y}... x4]
        this.rays = new Rays(this);

        this.color = 'red';
    }

    draw() {
        const rad = this.angle * Math.PI / 180;
        const hw = this.w / 2;
        const hh = this.h / 2;

        const corners = [
            { x: -hw, y: -hh },
            { x: hw, y: -hh },
            { x: hw, y: hh },
            { x: -hw, y: hh }
        ];

        const cx = this.pos.x + this.w / 2;
        const cy = this.pos.y + this.h / 2;

        const rc = corners.map(corner => ({
            x: cx + corner.x * Math.cos(rad) - corner.y * Math.sin(rad),
            y: cy + corner.x * Math.sin(rad) + corner.y * Math.cos(rad)
        }));

        this.carCorners = rc;

        ctx.fillStyle = this.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(rc[0].x, rc[0].y);
        for (let i = 1; i < rc.length; i++) {
            ctx.lineTo(rc[i].x, rc[i].y);
        };
        ctx.lineTo(rc[0].x, rc[0].y);
        ctx.fill();
    }

    isDamaged() {
        let rc = this.carCorners;
        const carPoints = [
            { x1: rc[0].x, y1: rc[1].y, x2: rc[1].x, y2: rc[1].y },
            { x1: rc[2].x, y1: rc[2].y, x2: rc[0].x, y2: rc[0].y },
        ];
        for (let cp of carPoints) {
            for (let mc of mapCoordinates) {
                if (utils.findIntersection(cp.x1, cp.y1, cp.x2, cp.y2, mc.x1, mc.y1, mc.x2, mc.y2)) {
                    return true;
                }
            }
        }
        return false;
    }

    killCar() {

    }

    movement() {
        if (K.l) this.angle -= 3;
        if (K.r) this.angle += 3;

        const rad = this.angle * Math.PI / 180;

        if (K.u) {
            this.vel.x += Math.cos(rad) * this.speed;
            this.vel.y += Math.sin(rad) * this.speed;
        }
        if (K.d) {
            this.vel.x -= Math.cos(rad) * this.speed;
            this.vel.y -= Math.sin(rad) * this.speed;
        }

        this.vel.x *= 1 - this.friction;
        this.vel.y *= 1 - this.friction;

        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        if (this.pos.x > c.width) {
            for (let i = 0; i < mapCoordinates.length; i++) {
                mapCoordinates[i].x1 -= c.width;
                mapCoordinates[i].x2 -= c.width;
            }
            this.pos.x -= c.width;
        } else if (this.pos.x < 0) {
            for (let i = 0; i < mapCoordinates.length; i++) {
                mapCoordinates[i].x1 += c.width;
                mapCoordinates[i].x2 += c.width;
            }
            this.pos.x += c.width;
        }
    }


    update() {
        this.draw();
        
        let isDamaged = this.isDamaged();
        if (!isDamaged) {
            this.color = 'red';
            this.movement();
        } else {
            this.color = 'grey';
        }
        

        this.rays.update();
    }
}