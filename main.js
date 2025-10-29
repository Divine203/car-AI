c = document.getElementById('c');
ctx = c.getContext('2d');

c.width = 1080;
c.height = 640;

car = new Car(50, 50, 50, 20);

const animate = () => {
    ctx.clearRect(0, 0, c.width, c.height);

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, c.width, c.height);

    map.drawMap();

    car.update();

    requestAnimationFrame(animate);
}

map.mapCreator();
animate();