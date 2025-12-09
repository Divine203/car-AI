class Utils {
     findIntersection(x1, y1, x2, y2, x3, y3, x4, y4) {
        const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if (denom === 0) {
            return null;
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

    findWeakIntersection(x1, y1, x2, y2, x3, y3, x4, y4, tolerance = 0.1) {
        const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

        if (Math.abs(denom) < 5000) {
            return null;
        }

        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
        const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;

        if (Math.abs(t - 0.5) > 0.0000001) return null;
        if (Math.abs(u - 0.5) > 0.0000001) return null;

        const slope1 = Math.atan2(y2 - y1, x2 - x1);
        const slope2 = Math.atan2(y4 - y3, x4 - x3);

        if (Math.abs(slope1 - slope2) > 0.000001) return null;

        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;

        const ix = x1 + t * (x2 - x1);
        const iy = y1 + t * (y2 - y1);

        const dist = Math.hypot(ix - midX, iy - midY);
        if (dist > 0.000001) return null;

        return { x: ix, y: iy, offset: t };

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

    lineIntersectsCircle(x1, y1, x2, y2, cx, cy, r) {
        // Line start to end vector
        const dx = x2 - x1;
        const dy = y2 - y1;

        // Vector from line start to circle center
        const fx = x1 - cx;
        const fy = y1 - cy;

        const a = dx * dx + dy * dy;
        const b = 2 * (fx * dx + fy * dy);
        const c = (fx * fx + fy * fy) - r * r;

        let discriminant = b * b - 4 * a * c;

        if (discriminant < 0) {
            // No intersection
            return false;
        }

        discriminant = Math.sqrt(discriminant);

        const t1 = (-b - discriminant) / (2 * a);
        const t2 = (-b + discriminant) / (2 * a);

        // Check if either intersection point lies within the line segment
        if ((t1 >= 0 && t1 <= 1) || (t2 >= 0 && t2 <= 1)) {
            return true;
        }

        return false;
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

