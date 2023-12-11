class GameOfLife {
    EMPTY_TILE_COLOR = "#fff";
    LIVE_TILE_COLOR = "#cc0";
    LIFE_PROB = 0.1
    FIELD_SIZE = 60;
    TILE_SIZE = 10;


    constructor(ctx) {
        this.ctx = ctx;
        this.field = [];

        for (let i = 0; i < this.FIELD_SIZE; ++i) {
            this.field[i] = [];
            for (let j = 0; j < this.FIELD_SIZE; ++j)
                this.field[i][j] = 0;
        }
    }

    init() {
        for (let i = 0; i < this.FIELD_SIZE; ++i)
            for (let j = 0; j < this.FIELD_SIZE; ++j)
                this.field[i][j] = +(Math.random() < this.LIFE_PROB)
    }

    step() {
        this.field = this.#nextGen();
    }

    draw() {
        for (let y = 0; y < this.FIELD_SIZE; ++y)
            for (let x = 0; x < this.FIELD_SIZE; ++x) {
                this.ctx.fillStyle = this.field[y][x]
                    ? this.LIVE_TILE_COLOR
                    : this.EMPTY_TILE_COLOR
                
                const argSet = [
                    x * this.TILE_SIZE, y * this.TILE_SIZE,
                    this.TILE_SIZE, this.TILE_SIZE
                ]

                this.ctx.fillRect(...argSet)
                this.ctx.strokeRect(...argSet)
            }
    }

    #countNeighbors(x, y) {
        let count = -this.field[y][x];

        for (let i = -1; i <= 1; ++i)
            for (let j = -1; j <= 1; ++j) {
                let nx = (x + i) % this.FIELD_SIZE;
                let ny = (y + j) % this.FIELD_SIZE;

                count += this.field[
                    ny < 0 ? this.FIELD_SIZE - 1 : ny
                ][
                    nx < 0 ? this.FIELD_SIZE - 1 : nx
                ];
            }

        return count;
    }

    #nextGen() {
        const nextGenField = [];
        for (let i = 0; i < this.FIELD_SIZE; ++i) {
            nextGenField[i] = [];

            for (let j = 0; j < this.FIELD_SIZE; ++j) {
                const neighbors = this.#countNeighbors(j, i);

                switch (neighbors) {
                    case 2:
                        nextGenField[i][j] = this.field[i][j];
                        break;
                    case 3:
                        nextGenField[i][j] = 1;
                        break;
                    default:
                        nextGenField[i][j] = 0;
                        break;
                }
            }
        }

        return nextGenField;
    }
}


const drawWrapper = (game, gameMethod) => {
    return () => {
        gameMethod.call(game);
        game.draw();
    };
}


const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

ctx.fillStyle = "#fff";
ctx.strokeStyle = "#000"
ctx.fillRect(0, 0, canvas.width, canvas.height);

const game = new GameOfLife(ctx);
const init = drawWrapper(game, game.init);
const step = drawWrapper(game, game.step);


const TICK = 400;

let timer;
const initBtn = document.getElementById("init")
initBtn.addEventListener("click", init);

const stepBtn = document.getElementById("step")
stepBtn.addEventListener("click", step);

const runBtn = document.getElementById("run")
runBtn.addEventListener(
    "click", () => {
        runBtn.disabled = true;
        timer = setInterval(step, TICK);
        stopBtn.disabled = false;
    }
);

const stopBtn = document.getElementById("stop")
stopBtn.addEventListener(
    "click", () => {
        stopBtn.disabled = true;
        clearInterval(timer);
        runBtn.disabled = false;
    }
);

