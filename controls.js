const K = {
    r: false,
    l: false,
    u: false,
    d: false,

    W: false,
    A: false,
    S: false,
    D: false,
    Q: false,
    E: false,

    x: false,
};

const controls = () => {
    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowUp':
                if (!K.d) K.u = true;
                break;
            case 'ArrowLeft':
                if (!K.r) K.l = true;
                break;
            case 'ArrowRight':
                if (!K.l) K.r = true;
                break;
            case 'ArrowDown':
                if (!K.u) K.d = true;
                break;

            case 'w':
                if (!K.S) K.W = true;
                break;
            case 'a':
                if (!K.D) K.A = true;
                break;
            case 's':
                if (!K.W) K.S = true;
                break;
            case 'd':
                if (!K.A) K.D = true;
                break;
            case 'q':
                if (!K.E) K.Q = true;
                break;
            case 'e':
                if (!K.Q) K.E = true;
                break;

            case 'x':
                K.x = true;
                break;

            case 'm':
                map.saveMap();
                break;
            
            case 'c':
                shouldDraw = !shouldDraw;
                isPlacingRewards = false;

            case 'r':
                isPlacingRewards = !isPlacingRewards;
                shouldDraw = false;

            case 't':
                discard();

            case 'u':
                generation++;
                localStorage.setItem("bestScore", bestCar.performanceScore.toString());
                localStorage.setItem("generation", generation.toString());
                save();
        }
    });

    document.addEventListener('keyup', (e) => {
        switch (e.key) {
            case 'ArrowUp':
                K.u = false;
                break;
            case 'ArrowLeft':
                K.l = false;
                break;
            case 'ArrowRight':
                K.r = false;
                break;
            case 'ArrowDown':
                K.d = false;
                break;

            case 'w':
                K.W = false;
                break;
            case 'a':
                K.A = false;
                break;
            case 's':
                K.S = false;
                break;
            case 'd':
                K.D = false;
                break;
            case 'q':
                K.Q = false;
                break;

            case 'x':
                K.x = false;
                break;
        }
    });
}

controls();