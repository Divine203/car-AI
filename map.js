class Map {
    constructor() {
        this.isLineAdded = false;
        this.hoveredOnAline = false;
        this.hoveredOnANode = false;
        this.currentHoveredNode = false;
        this.currentHoveredLine = null;
        this.hoveredLine = null;
        this.hoveredNode = null;

        this.currentLine = {
            x1: null,
            y1: null,
            x2: null,
            y2: null,
            color: [0, 255, 0],
        }

        this.scrollSpeed = 12;
        this.mapLines = mapCoordinates;
        this.nodes = nodeCoordinates;
        this.storeFloorLines = true;
        this.floorHorizontalLines = [];
    }

    saveMap() {
        const mapLinesJsonString = JSON.stringify(this.mapLines);
        const nodesJsonString = JSON.stringify(this.nodes);
        localStorage.setItem("map", mapLinesJsonString);
        localStorage.setItem("nodes", nodesJsonString);

        console.log("Map Lines:");
        console.log(mapLinesJsonString);

        console.log("Nodes: ");
        console.log(nodesJsonString);

        alert('Map saved, check console!');
    }

    drawLine({ x1, y1, x2, y2, color = [0, 255, 0] }) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        ctx.stroke();
    }

    drawNode({ x, y, scale, color = 'green' }) {
        ctx.fillStyle = color;
        ctx.fillRect(x - scale / 2, y - scale / 2, scale, scale);
    }

    checkPointOnLines(px, py) {
        for (let i = 0; i < this.mapLines.length; i++) {
            if (utils.isPointNearLineSegment(px, py, this.mapLines[i].x1, this.mapLines[i].y1, this.mapLines[i].x2, this.mapLines[i].y2, 5)) {
                return i;
            }
        }
        return null;
    }

    checkPointOnNodes(px, py) {
        for (let i = 0; i < this.nodes.length; i++) {
            if (utils.isPointOnSquare(px, py, this.nodes[i])) {
                return i;
            }
        }
        return null;
    }

    mapCreator() {
        document.addEventListener('mousedown', (e) => {
            this.currentLine.texture = this.currentTexture;
            if (shouldDraw) {
                let mouseX = e.clientX - c.getBoundingClientRect().left;
                let mouseY = e.clientY - c.getBoundingClientRect().top;

                let nodeIndex = this.checkPointOnNodes(mouseX, mouseY);

                const construct = (px, py) => {

                    if (this.currentLine.x1 && this.currentLine.y1) {
                        this.currentLine.x2 = px;
                        this.currentLine.y2 = py;
                        let cT = this.currentTexture;
                        this.isLineAdded = true;
                        if (this.isLineAdded) {
                            this.currentLine.texture = cT;
                            this.mapLines.push(this.currentLine);
                            this.currentLine = {
                                x1: null,
                                y1: null,
                                x2: null,
                                y2: null,
                            }
                            this.isLineAdded = false;
                        }
                    } else {
                        this.currentLine.x1 = px;
                        this.currentLine.y1 = py;
                    }
                }

                if (nodeIndex !== null) {
                    construct(this.nodes[nodeIndex].x, this.nodes[nodeIndex].y);
                } else {
                    this.nodes.push({ x: mouseX, y: mouseY, scale: 10, color: "blue" });
                    construct(mouseX, mouseY);
                }

            }
        });
        document.addEventListener('mousemove', (e) => {
            if (shouldDraw) {
                let mouseX = e.clientX - c.getBoundingClientRect().left;
                let mouseY = e.clientY - c.getBoundingClientRect().top;

                let nodeIndex = this.checkPointOnNodes(mouseX, mouseY);

                if (this.currentLine.x1 && this.currentLine.y1) {
                    this.currentLine.x2 = mouseX;
                    this.currentLine.y2 = mouseY;
                }

                let lineIndex = this.checkPointOnLines(mouseX, mouseY);

                if (lineIndex !== null) {
                    this.hoveredOnAline = true;
                    this.currentHoveredLine = this.mapLines[lineIndex];
                    this.hoveredLine = {
                        x1: this.mapLines[lineIndex].x1,
                        y1: this.mapLines[lineIndex].y1,
                        x2: this.mapLines[lineIndex].x2,
                        y2: this.mapLines[lineIndex].y2,
                        color: this.mapLines[lineIndex].color,
                    };
                } else {
                    this.hoveredOnAline = false;
                    this.currentHoveredLine = null;
                    this.hoveredLine = null;
                }

                if (nodeIndex !== null) {
                    this.hoveredOnANode = true;
                    this.currentHoveredNode = this.nodes[nodeIndex];
                    this.hoveredNode = {
                        x: this.nodes[nodeIndex].x,
                        y: this.nodes[nodeIndex].y,
                        scale: this.nodes[nodeIndex].scale,
                        color: this.nodes[nodeIndex].color,
                    };
                } else {
                    this.hoveredOnANode = false;
                    this.currentHoveredNode = null;
                    this.hoveredNode = null;
                }
            }
        });
    }


    iscarInSector(carPos, polygon) {
        let inside = false;
        const { x: px, y: py } = carPos;

        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const { x: xi, y: yi } = polygon[i];
            const { x: xj, y: yj } = polygon[j];

            const intersect = ((yi > py) !== (yj > py)) &&
                (px < (xj - xi) * (py - yi) / (yj - yi) + xi);

            if (intersect) inside = !inside;
        }

        return inside;

    }

    drawMap() {
        for (let j = 0; j < this.nodes.length; j++) {
            this.drawNode(this.nodes[j]);
        }

        for (let i = 0; i < this.mapLines.length; i++) {
            this.drawLine(this.mapLines[i]);
        }

        if (this.currentLine.x1 && this.currentLine.y1 && this.currentLine.x2 && this.currentLine.y2) {
            this.drawLine(this.currentLine);
        }

        if (this.hoveredNode !== null) {
            this.hoveredNode.color = "yellow";
            this.drawNode(this.hoveredNode);
        }

        if (this.hoveredLine !== null) {
            this.hoveredLine.color = [255, 255, 0];
            this.drawLine(this.hoveredLine);
        }



        if (this.hoveredOnAline) {
            if (K.x.pressed) {
                this.mapLines = this.mapLines.filter(line => line !== this.currentHoveredLine);
                this.hoveredLine = null;
            }
        }

        if (this.hoveredOnANode) {
            if (K.x) {
                this.nodes = this.nodes.filter(node => node !== this.currentHoveredNode);
                this.hoveredNode = null;
            }
        }

        // move everything
        if (K.S) {
            for (let i = 0; i < this.mapLines.length; i++) {
                this.mapLines[i].y1 = this.mapLines[i].y1 - this.scrollSpeed;
                this.mapLines[i].y2 = this.mapLines[i].y2 - this.scrollSpeed;
            }
            for (let j = 0; j < this.nodes.length; j++) {
                this.nodes[j].y = this.nodes[j].y - this.scrollSpeed;
            }
            car.pos.y -= this.scrollSpeed;


        } else if (K.W) {
            for (let i = 0; i < this.mapLines.length; i++) {
                this.mapLines[i].y1 = this.mapLines[i].y1 + this.scrollSpeed;
                this.mapLines[i].y2 = this.mapLines[i].y2 + this.scrollSpeed;
            }
            for (let j = 0; j < this.nodes.length; j++) {
                this.nodes[j].y = this.nodes[j].y + this.scrollSpeed;
            }
            car.pos.y += this.scrollSpeed;

        } else if (K.D) {
            for (let i = 0; i < this.mapLines.length; i++) {
                this.mapLines[i].x1 = this.mapLines[i].x1 - this.scrollSpeed;
                this.mapLines[i].x2 = this.mapLines[i].x2 - this.scrollSpeed;
            }
            for (let j = 0; j < this.nodes.length; j++) {
                this.nodes[j].x = this.nodes[j].x - this.scrollSpeed;
            }
            car.pos.x -= this.scrollSpeed;

        } else if (K.A) {
            for (let i = 0; i < this.mapLines.length; i++) {
                this.mapLines[i].x1 = this.mapLines[i].x1 + this.scrollSpeed;
                this.mapLines[i].x2 = this.mapLines[i].x2 + this.scrollSpeed;
            }
            for (let j = 0; j < this.nodes.length; j++) {
                this.nodes[j].x = this.nodes[j].x + this.scrollSpeed;
            }
            car.pos.x += this.scrollSpeed;
        }
    }
}

map = new Map();