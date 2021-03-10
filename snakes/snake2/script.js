let level = 1;

let snakeDraw = (level) => {
  let canvas = document.getElementById("canvas");
  let ctx = canvas.getContext("2d");

  let width = document.documentElement.clientWidth;
  let height = document.documentElement.clientHeight;
  canvas.width = width;
  canvas.height = height;

  let blockSize = 10;
  let widthInBlocks = width / blockSize;
  let heightInBlocks = height / blockSize;

  let score = 0;
  let speedAnimation = 100;

  let scoreColor = 0;
  let colors = ['blue', 'gold', 'darkred'];

  let drawBorder = function () {
    ctx.fillStyle = "Gray";
    ctx.fillRect(0, 0, width, blockSize);
    ctx.fillRect(0, height - blockSize, width, blockSize);
    ctx.fillRect(0, 0, blockSize, height);
    ctx.fillRect(width - blockSize, 0, blockSize, height);
  };


  let drawScore = function () {
    ctx.font = "20px Courier";
    ctx.fillStyle = "Black";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Score: " + score, blockSize, blockSize);
    ctx.fillText("level: " + level, blockSize, blockSize * 3);
  };


  let gameOver = function () {
    clearInterval(intervalId);
    ctx.font = "60px Courier";
    ctx.fillStyle = "Black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Game over", width / 2, height / 2);
  };


  let circle = function (x, y, radius, fillCircle) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    if (fillCircle) {
      ctx.fill();
    } else {
      ctx.stroke();
    }
  };


  let Block = function (col, row) {
    this.col = col;
    this.row = row;
  };


  Block.prototype.drawSquare = function (color) {
    let x = this.col * blockSize;
    let y = this.row * blockSize;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, blockSize, blockSize);
  };


  Block.prototype.drawCircle = function (color) {
    let centerX = this.col * blockSize + blockSize / 2;
    let centerY = this.row * blockSize + blockSize / 2;
    ctx.fillStyle = color;
    circle(centerX, centerY, blockSize / 2, true);
  };



  Block.prototype.equal = function (otherBlock) {
    return this.col === otherBlock.col && this.row === otherBlock.row;
  };


  let Snake = function () {
    this.segments = [
      new Block(7, 5),
      new Block(6, 5),
      new Block(5, 5)
    ];

    this.direction = "right";
    this.nextDirection = "right";
  };


  Snake.prototype.draw = function () {
    for (let i = 0; i < this.segments.length; i++) {
      this.segments[i].drawSquare(colors[scoreColor]);
    }
  };


  Snake.prototype.move = function () {
    let head = this.segments[0];
    let newHead;

    this.direction = this.nextDirection;

    if (this.direction === "right") {
      newHead = new Block(head.col + 1, head.row);
    } else if (this.direction === "down") {
      newHead = new Block(head.col, head.row + 1);
    } else if (this.direction === "left") {
      newHead = new Block(head.col - 1, head.row);
    } else if (this.direction === "up") {
      newHead = new Block(head.col, head.row - 1);
    }

    if (this.checkCollision(newHead)) {
      gameOver();
      return;
    }

    this.segments.unshift(newHead);

    if (newHead.equal(apple.position)) {
      score++;
      if (score === 5 && level !== 3) {
        ++scoreColor;
        ++level;
        score = 0;
        if (level === 3) {
          directions.ArrowUp = 'left';
          directions.ArrowLeft = 'down';
          directions.ArrowDown = 'right';
          directions.ArrowRight = 'up';
        }
      }

      if (scoreColor >= colors.length) scoreColor = 0
      apple.move();
    } else {
      this.segments.pop();
    }
  };


  Snake.prototype.checkCollision = function (head) {
    let leftCollision = (head.col === 0);
    let topCollision = (head.row === 0);
    let rightCollision = (head.col === Math.round(widthInBlocks - 1));
    let bottomCollision = (head.row === Math.round(heightInBlocks - 1));

    let wallCollision = leftCollision || topCollision || rightCollision || bottomCollision;

    let selfCollision = false;
    for (let i = 0; i < this.segments.length; i++) {
      if (head.equal(this.segments[i])) {
        selfCollision = true;
      }
    }

    return wallCollision || selfCollision;
  };



  Snake.prototype.setDirection = function (newDirection) {
    if (this.direction === "up" && newDirection === "down") {
      return;
    } else if (this.direction === "right" && newDirection === "left") {
      return;
    } else if (this.direction === "down" && newDirection === "up") {
      return;
    } else if (this.direction === "left" && newDirection === "right") {
      return;
    }

    this.nextDirection = newDirection;
  };


  let Apple = function () {
    this.position = new Block(10, 10);
  };


  Apple.prototype.draw = function () {
    this.position.drawCircle("LimeGreen");
  };


  Apple.prototype.move = function () {
    let randomCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
    let randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 1;
    this.position = new Block(randomCol, randomRow);
  };


  let snake = new Snake();
  let apple = new Apple();

  let intervalId = setInterval(function () {
    ctx.clearRect(0, 0, width, height);
    drawScore();
    snake.move();
    snake.draw();
    apple.draw();
    drawBorder();
  }, speedAnimation);


  let directions = {
    ArrowLeft: "left",
    ArrowUp: "up",
    ArrowRight: "right",
    ArrowDown: "down"
  };

  let specialMove = {
    ShiftLeft: 'boost',
    Space: 'retart'
  }

  function setSpecialEvent(event) {
    if (level === 1) {
      if (event === 'boost') {
        speedAnimation /= 1.5;
      } else if (event === 'retart') {
        speedAnimation *= 1.5;
      }
    } else if (level === 2) {
      if (event === 'boost') {
        speedAnimation /= 3;
      } else if (event === 'retart') {
        speedAnimation *= 1.5;
      }
    } else if (level === 3) {
      if (event === 'boost') {
        speedAnimation /= 8;
      } else if (event === 'retart') {
        speedAnimation *= 1.01;
      }
    }

    clearInterval(intervalId);
    intervalId = setInterval(function () {
      ctx.clearRect(0, 0, width, height);
      drawScore();
      snake.move();
      snake.draw();
      apple.draw();
      drawBorder();
    }, speedAnimation);
  }


  document.body.addEventListener('keydown', (e) => {
    let newDirection = directions[e.code];
    if (newDirection) {
      snake.setDirection(newDirection);
    } else {
      let newEvent = specialMove[e.code];
      if (newEvent) {
        setSpecialEvent(newEvent);
      }
    }
  })
}


window.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    document.querySelector('.info').remove();
    snakeDraw(level);
  }
})