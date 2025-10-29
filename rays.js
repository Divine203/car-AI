class Ray {
    constructor() {
        this.x1 = null;
        this.y1 = null;
        this.x2 = null;
        this.y2 = null;
        this.color = "yellow";
        this.angle = null;
        this.l;
        this.intersectionPoint = null;
    }

    drawRay(angleOffset, pAngle, pWidth, pHeight, pX, pY) { // angleOffset is in degrees
        ctx.save();
        ctx.beginPath();
        ctx.translate(pX + pWidth / 2, pY + pHeight / 2);
        ctx.rotate((angleOffset + pAngle) * Math.PI / 180);
        ctx.rect((-pWidth / 2) + (pWidth / 2), (-pHeight / 2) + (pHeight / 2), this.l, 1);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();

        // draw grey line
        if (this.intersectionPoint) {
            ctx.beginPath();
            ctx.lineWidth = 4;
            ctx.strokeStyle = "#161616ff";
            ctx.moveTo(this.intersectionPoint.x, this.intersectionPoint.y);
            ctx.lineTo(this.x2, this.y2);
            ctx.stroke();
        }
    }

}

class Rays {
    constructor(car) {
        this.car = car;

        this.defaultRayLength = 500;
        this.rayLenth = 500;
        this.rays = [];

        this.FOV = 90; // field of view
        this.numRays = 16;
        this.rayoffsetAngles = Array.from({ length: this.numRays }, (v, k) => (k * (this.FOV / this.numRays) - (this.FOV / 2))); // [-45, ...45]
    }

    drawRays() {
        for (let i = 0; i < this.rayoffsetAngles.length; i++) {
            let ray = new Ray();
            let { x1, y1, x2, y2 } = this.calcRayPoints(this.rayoffsetAngles[i], this.rayLenth);
            ray.angle = this.rayoffsetAngles[i];
            ray.x1 = x1;
            ray.y1 = y1;
            ray.x2 = x2;
            ray.y2 = y2;
            ray = this.rayCastMap(ray, map.mapLines);
            this.rays[i] = { d: ray.l, iP: ray.intersectionPoint ?? 0, color: ray.lineIntersectionColor, wD: ray.wallData, fD: ray.floorData };

            if (this.car.shouldDrawRays) {
                ray.drawRay(this.rayoffsetAngles[i], this.car.angle, this.car.w, this.car.h, this.car.pos.x, this.car.pos.y);
            }
        }
    }


    rayCastMap(ray, mapLines) {
        let minDistance = Infinity;

        mapLines.forEach(mapLine => {
            let intersectionPoint = utils.findIntersection(ray.x1, ray.y1, ray.x2, ray.y2, mapLine.x1, mapLine.y1, mapLine.x2, mapLine.y2);
            if (intersectionPoint) {
                let distance = utils.calcDistance(ray.x1, ray.y1, intersectionPoint.x, intersectionPoint.y);
                if (distance < minDistance) {
                    minDistance = distance;
                    ray.intersectionPoint = intersectionPoint;
                    ray.wallData = mapLine;
                }
            }
        });

        ray.l = this.defaultRayLength;

        let { x1, y1, x2, y2 } = this.calcRayPoints(ray.angle, ray.l);
        ray.x1 = x1;
        ray.y1 = y1;
        ray.x2 = x2;
        ray.y2 = y2;

        return ray;
    }

    calcRayPoints(rayOffsetAngle, rayLenth) {
        let x1 = this.car.pos.x + this.car.w / 2;
        let y1 = this.car.pos.y + this.car.h / 2;
        let { x2, y2 } = utils.calcEndPoint(x1, y1, rayLenth, ((rayOffsetAngle + this.car.angle) * (Math.PI / 180))); // convert angle to radians 

        return { x1, y1, x2, y2 };
    }

    update() {
        this.drawRays();
    }

}