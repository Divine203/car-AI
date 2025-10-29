class Utils {
    constructor() { }

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

            return { x: intersectionX, y: intersectionY };
        }

        return null; // No intersection
    }

    checkLineIntersection(a, b) {
        const BUFFER = 1; // Slightly expand collision area

        const det = (b.x2 - b.x1) * (a.y2 - a.y1) - (b.y2 - b.y1) * (a.x2 - a.x1);
        if (Math.abs(det) < 0.0001) return false; // Parallel lines

        const lambda = ((b.y2 - b.y1) * (b.x2 - a.x1) + (b.x1 - b.x2) * (b.y2 - a.y1)) / det;
        const gamma = ((a.y1 - a.y2) * (b.x2 - a.x1) + (a.x2 - a.x1) * (b.y2 - a.y1)) / det;

        let result = (-BUFFER <= lambda && lambda <= 1 + BUFFER) && (-BUFFER <= gamma && gamma <= 1 + BUFFER);

        // console.log(result);

        return result;
    }


    isPointOnSquare(px, py, sqr) { //sqr => {x, y, scale}
        return (
            px >= sqr.x - (sqr.scale + sqr.scale * 2) &&
            px <= sqr.x + (sqr.scale + sqr.scale * 2) &&
            py >= sqr.y - (sqr.scale + sqr.scale * 2) &&
            py <= sqr.y + (sqr.scale + sqr.scale * 2)
        );
    }

    lerp(A, B, t) {
        return A + (B - A) * t;
    }



    isPlayerInSector(playerPos, lines) { //{x, y}, [{x1, y1, x2, y2}]
        let inside = false;
        const { x: px, y: py } = playerPos;

        lines.forEach(line => {
            const { x1, y1, x2, y2 } = line;

            const intersect = ((y1 > py) !== (y2 > py)) &&
                (px < (x2 - x1) * (py - y1) / (y2 - y1) + x1);

            if (intersect) inside = !inside;
        });

        return inside;
    }

    // check if a point is near segment
    isPointNearLineSegment(px, py, x1, y1, x2, y2, tolerance) { // tolerance is margin of error acceptable
        // Calculate the distance from the point to the line segment
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

    convertHexToRGB(hex) {
        let r = 0;
        let g = 0;
        let b = 0;

        if (hex.length === 7) {
            r = parseInt(hex.slice(1, 3), 16);
            g = parseInt(hex.slice(3, 5), 16);
            b = parseInt(hex.slice(5, 7), 16);
        }

        return [r, g, b];
    }
}

utils = new Utils();

