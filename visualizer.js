class Visualizer {
    constructor(network) {
        this.network = network;
    }

    drawNode(x, y) {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, 2 * Math.PI);
        ctx.fill();
    }

    drawNeurons() {
        const centerY = c.height / 4;
        const xGap = 150;
        const yGap = 10;

        for (let i = 0; i < this.network.levels.length; i++) {
            let level = this.network.levels[i];

            let inputs = level.inputs.length;
            let outputs = level.outputs.length;

            let inOffset = -((inputs - 1) * yGap) / 2;
            let outOffset = -((outputs - 1) * yGap) / 2;

            let lx = 50 + i * xGap;  
            let rx = lx + xGap; 

            for (let a = 0; a < inputs; a++) {
                let y1 = centerY + inOffset + a * yGap;

                for (let b = 0; b < outputs; b++) {
                    let y2 = centerY + outOffset + b * yGap;

                    let weight = level.weights[a][b];
                    this.drawConnection(lx, y1, rx, y2, weight);
                }
            }

            for (let j = 0; j < inputs; j++) {
                let y = centerY + inOffset + j * yGap;
                this.drawNode(lx, y);
            }

            for (let k = 0; k < outputs; k++) {
                let y = centerY + outOffset + k * yGap;
                this.drawNode(rx, y);
            }
        }
    }


    drawConnection(x1, y1, x2, y2, weight) {
        const alpha = Math.abs(weight) - .2;
        const color = weight > 0
            ? `rgba(0, 0, 255, ${alpha})`  
            : `rgba(255, 0, 0, ${alpha})`; 

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    getLayerOffset(count, gap = 10) {
        return -((count - 1) * gap) / 2;
    }


    update() {
        this.drawNeurons();
    }
}


