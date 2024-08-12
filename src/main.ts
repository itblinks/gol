import "./style.css";

const el = document.querySelector(".playfield");

const HEIGHT = 128;
const WIDHT = 128;

class Cell {
  constructor(div: Element) {
    this.div = div;
  }
  alive: boolean = false;
  div: Element;
}

let grid: Cell[][] = [[]];

for (let row = 0; row < HEIGHT; ++row) {
  grid[row] = [];
  for (let col = 0; col < WIDHT; ++col) {
    let pixel = document.createElement("div");
    let cell = new Cell(pixel);
    grid[row][col] = cell;
    pixel.className = "pixel";
    pixel.addEventListener("click", (e) => {
      grid[row][col].alive = !grid[row][col].alive;
      if (grid[row][col].alive) {
        pixel.style.background = "white";
      } else {
        pixel.style.background = "black";
      }
    });
    el?.appendChild(pixel);
  }
}
