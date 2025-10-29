class Utils {
    findIntersection(x1, y1, x2, y2, x3, y3, x4, y4) {
        const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if (denom === 0) {
            return null; // lines are parallel or coincident
        }

        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
        const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;

        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            const intersectionX = x1 + t * (x2 - x1);
            const intersectionY = y1 + t * (y2 - y1);

            return { x: intersectionX, y: intersectionY, offset: t };
        }

        return null;
    }

    lerp(A, B, t) {
        return A + (B - A) * t;
    }


    isPointOnSquare(px, py, sqr) { //sqr => {x, y, scale}
        return (
            px >= sqr.x - (sqr.scale + sqr.scale * 2) &&
            px <= sqr.x + (sqr.scale + sqr.scale * 2) &&
            py >= sqr.y - (sqr.scale + sqr.scale * 2) &&
            py <= sqr.y + (sqr.scale + sqr.scale * 2)
        );
    }

    isPointNearLineSegment(px, py, x1, y1, x2, y2, tolerance) { // tolerance is margin of error acceptable
        const A = px - x1;
        const B = py - y1;
        const C = x2 - x1;
        const D = y2 - y1;

        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        const param = lenSq !== 0 ? dot / lenSq : -1;

        let nearestX, nearestY;

        if (param < 0) {
            nearestX = x1;
            nearestY = y1;
        } else if (param > 1) {
            nearestX = x2;
            nearestY = y2;
        } else {
            nearestX = x1 + param * C;
            nearestY = y1 + param * D;
        }

        const distance = Math.sqrt((px - nearestX) ** 2 + (py - nearestY) ** 2);
        return distance <= tolerance;
    }

    calcDistance(x1, y1, x2, y2) {
        return Math.sqrt(((x2 - x1) ** 2) + ((y2 - y1) ** 2));
    }

    calcEndPoint(x1, y1, d, angleInRadians) {
        let x2 = x1 + d * Math.cos(angleInRadians);
        let y2 = y1 + d * Math.sin(angleInRadians);

        return { x2, y2 };
    }
}

utils = new Utils();

