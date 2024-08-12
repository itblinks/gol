import "./style.css";

const HEIGHT = 120;
const WIDTH = 120;

class Cell {
  constructor(div: HTMLDivElement) {
    this.div = div;
  }
  alive: boolean = false;
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
        let alive_neighbours = 0;
        for (let neighbour_y = -1; neighbour_y < 1; ++neighbour_y) {
          for (let neighbour_x = -1; neighbour_x < 1; ++neighbour_x) {
            if (row + neighbour_x >= 0) {
              if (col + neighbour_y >= 0) {
                alive_neighbours += Number(
                  this.grid[row + neighbour_x][col + neighbour_y].alive
                );
              }
            }
          }
        }

        let cell = this.grid[row][col];
        if (!cell.alive) {
          // only if the cell has exactly three neighbours, it continues to live
          cell.alive = alive_neighbours == 3;
        } else {
          // these are all the state transitions if the cell is dying
          if (alive_neighbours < 2) {
            // due to underpopulation
            cell.alive = false;
          } else if (alive_neighbours > 3) {
            // due to overpopulation
            cell.alive;
          }
        }

        // update visualization
        cell.alive
          ? (cell.div.style.background = "white")
          : (cell.div.style.background = "black");
      }
    }
  }
}

const model = new GoL();

const runButtonClick = (e: Event) => {
  model.updatePlayState();
};

const runButton = document.getElementById("runButton") as HTMLButtonElement;
runButton.addEventListener("click", runButtonClick);
