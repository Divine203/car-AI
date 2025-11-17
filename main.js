c = document.getElementById('c');
ctx = c.getContext('2d');

c.width = 1400;
c.height = 780;

const N = 400;
cars = generateCars(N);

function moveEverythingDown(amount) {
    globalOrigin.y += amount;
    for (let i = 0; i < map.mapLines.length; i++) {
        map.mapLines[i].y1 = map.mapLines[i].y1 + amount;
        map.mapLines[i].y2 = map.mapLines[i].y2 + amount;
    }
    for (let j = 0; j < map.nodes.length; j++) {
        map.nodes[j].y = map.nodes[j].y + amount;
    }
}

function generateCars(N) {
    const cars = [];

    for (let i = 1; i <= N; i++) {
        cars.push(new Car(320, 470, 50, 20));
    }
    return cars;
}

if (localStorage.getItem("generation")) {
    generation = Number(localStorage.getItem("generation"));
}

if (localStorage.getItem("bestBrain")) {
    for (let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(
            localStorage.getItem("bestBrain")
        );
        if (i != 0) {
            NeuralNetwork.mutate(cars[i].brain, 0.2);
        }
    }
}

function save() {
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain)
    );
    location.reload();
}


function discard() {
    localStorage.removeItem("bestBrain");
    localStorage.removeItem("bestScore");
    localStorage.removeItem("generation");
}

bestCar = cars[0];

function writeUI() {
    ctx.fillStyle = 'white';
    ctx.font = `13px consolas`
    ctx.fillText(`Best score: ${localStorage.getItem("bestScore") ?? 0}`, 140, 20);
    ctx.fillText(`Generation: ${generation ?? 0}`, 140, 40);
}

moveEverythingDown(150);

visualizer = new Visualizer(bestCar.brain);

const animate = () => {
    ctx.clearRect(0, 0, c.width, c.height);

    bestCar = cars.reduce((best, c) =>
        (c.performanceScore > best.performanceScore ? c : best),
        cars[0]
    );

    bestCar.isBestCar = true;

    cars.forEach(car => {
        if (car !== bestCar) car.isBestCar = false;
    });

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, c.width, c.height);

    writeUI();

    map.drawMap();

    for (let i = 0; i < cars.length; i++) {
        cars[i].update();
    }

    const allDamaged = cars.every(car => car.isCarDamaged);
    if (allDamaged) {
        console.log("All cars damaged! Saving best brain...");

        localStorage.setItem("bestScore", bestCar.performanceScore.toString());
        generation++;

        localStorage.setItem("generation", generation.toString());

        save();
        return;
    }

    if (visualizer) {
        visualizer.update();
    }

    requestAnimationFrame(animate);
}

map.mapCreator();
animate();