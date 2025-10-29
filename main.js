c = document.getElementById('c');
ctx = c.getContext('2d');

c.width = 1080;
c.height = 640;

car = new Car(50, 50, 50, 20);

const N = 1;
cars = generateCars(N);

function generateCars(N) {
    const cars = [];

    for (let i = 1; i <= N; i++) {
        cars.push(new Car(50, 50, 50, 20));
    }
    return cars;
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
}

bestCar = cars[0];

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

    map.drawMap();

    for (let i = 0; i < cars.length; i++) {
        cars[i].update();
    }

    const allDamaged = cars.every(car => car.isCarDamaged);
    if (allDamaged) {
        console.log("All cars damaged! Saving best brain...");
        save();
        return;
    }

    requestAnimationFrame(animate);
}

map.mapCreator();
animate();