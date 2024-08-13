import "./style.css";

const HEIGHT = 128;
const WIDTH = 128;

class Cell {
  constructor(div: HTMLDivElement) {
    this.div = div;
  }
  alive: boolean = false;
  next_alive: boolean = false;
  div: HTMLDivElement;
}

class GoL {
  grid: Cell[][] = [[]];
  mouseDown = false;
  constructor() {
    // create playfield
    const playfield =
      document.querySelector<HTMLDivElement>(".playfield") ??
      self.document.createElement("div");
    playfield.style.display = "grid";
    playfield.style.gridTemplateColumns = `repeat(${WIDTH}, 7px [col-start])`;
    playfield.style.gridTemplateRows = `repeat(${HEIGHT}, 7px [row-start])`;

    window.onmousedown = () => {
      this.mouseDown = true;
    };
    self.window.onmouseup = () => {
      this.mouseDown = false;
    };
    for (let row = 0; row < HEIGHT; ++row) {
      this.grid[row] = [];
      for (let col = 0; col < WIDTH; ++col) {
        let pixel = document.createElement("div");
        let cell = new Cell(pixel);
        this.grid[row][col] = cell;
        pixel.className = "pixel";
        pixel.addEventListener("click", (e) => {
          e.preventDefault();
          this.grid[row][col].alive = !this.grid[row][col].alive;
          if (this.grid[row][col].alive) {
            pixel.style.background = "white";
          } else {
            pixel.style.background = "black";
          }
        });
        pixel.addEventListener("mouseover", (e) => {
          e.preventDefault();
          if (this.mouseDown) {
            this.grid[row][col].alive = true;
            pixel.style.background = "white";
          }
        });
        playfield?.appendChild(pixel);
      }
    }
  }
  updatePlayState() {
    for (let row = 0; row < HEIGHT; ++row) {
      for (let col = 0; col < WIDTH; ++col) {
        let alive_neighbors = 0;
        for (let neighbor_y = row - 1; neighbor_y <= row + 1; ++neighbor_y) {
          for (let neighbor_x = col - 1; neighbor_x <= col + 1; ++neighbor_x) {
            if (
              neighbor_x >= 0 &&
              neighbor_x < WIDTH &&
              neighbor_y >= 0 &&
              neighbor_y < HEIGHT &&
              !(neighbor_x === col && neighbor_y === row)
            ) {
              alive_neighbors += Number(
                this.grid[neighbor_y][neighbor_x].alive
              );
            }
          }
        }

        let cell = this.grid[row][col];
        if (!cell.alive) {
          // only if the cell has exactly three neighbors, it continues to live
          cell.next_alive = alive_neighbors == 3;
        } else if (alive_neighbors < 2) {
          // due to underpopulation
          cell.next_alive = false;
        } else if (alive_neighbors > 3) {
          // due to overpopulation
          cell.next_alive = false;
        } else {
          cell.next_alive = cell.alive;
        }
      }
    }

    // update visualization
    for (let row = 0; row < HEIGHT; ++row) {
      for (let col = 0; col < WIDTH; ++col) {
        let cell = this.grid[row][col];
        cell.alive = cell.next_alive;
        cell.alive
          ? (cell.div.style.background = "white")
          : (cell.div.style.background = "black");
      }
    }
  }
}

const model = new GoL();
let running = false;

const runButtonClick = (e: Event) => {
  running = !running;
  let button = document.getElementById("runButton")!;
  if (running) {
    requestAnimationFrame(step);
    button.innerHTML = "Stop";
  } else {
    button.innerHTML = "Run";
  }
};

const runButton = document.getElementById("runButton") as HTMLButtonElement;
runButton.addEventListener("click", runButtonClick);

let previous = 0;
let speed = 0.5;
function step(timeStamp: DOMHighResTimeStamp) {
  if (running) {
    const elapsed = timeStamp - previous;
    if (elapsed > speed * 1000) {
      // const value = (timeStamp) / duration
      model.updatePlayState();
      previous = timeStamp;
    }
  }
  requestAnimationFrame(step);
}

const animationSpeedSlider = document.querySelector("#animationSpeed")!;
animationSpeedSlider.addEventListener("input", (e: Event) => {
  if (e.target) {
    speed = +(<HTMLInputElement>e.target).value;
  }
});
