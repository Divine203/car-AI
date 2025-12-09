class Car {
    constructor(x, y, w, h) {
        this.w = w;
        this.h = h;

        this.pos = { x, y };
        this.angle = 0;
        this.vel = { x: 0, y: 0 };
        this.friction = 0.06;

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

    movement() {
        if (K.l) this.angle -= 5;
        if (K.r) this.angle += 5;

        const rad = this.angle * Math.PI / 180;

        if (K.u) {
            this.vel.x += Math.cos(rad) * 0.3;
            this.vel.y += Math.sin(rad) * 0.3;
        }
        if (K.d) {
            this.vel.x -= Math.cos(rad) * 0.3;
            this.vel.y -= Math.sin(rad) * 0.3;
        }

        this.vel.x *= 1 - this.friction;
        this.vel.y *= 1 - this.friction;

        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
    }


    update() {
        this.draw();
        this.movement();
    }
}