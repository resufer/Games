let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

let width = 600;
let height = document.documentElement.clientHeight;
canvas.width = width;
canvas.height = height;

let imageBall = new Image();
imageBall.src = 'img/ball.png';

let imagePlatform = new Image();
imagePlatform.src = 'img/platform2.png'

let image1 = new Image();
image1.src = 'img/block1.png';
let image2 = new Image();
image2.src = 'img/block2.png';
let image3 = new Image();
image3.src = 'img/block3.png';
let image4 = new Image();
image4.src = 'img/block4.png';
let images = [image1, image2, image3, image4];
let image = images[Math.floor(Math.random() * images.length)];

let plaing = true;

let ball = {
  x: width / 2,
  y: height - 50,
  width: 20,
  height: 20,
  speed: 6,
  angle: Math.PI / 4 + Math.random() * Math.PI / 2
}
let platform = {
  x: width / 2 - 100,
  y: height - 25,
  width: 220,
  height: 130,
  speed: 20,
  leftKey: false,
  rightKey: false
}
let blocks = [];
for (let x = 0; x < 10; x++) {
  for (let y = 0; y < 5; y++) {
    blocks.push({
      x: 50 + 50 * x, y: 50 + 50 * y, width: 50, height: 20, color: images[Math.floor(Math.random() * images.length)]
    })
  }
}

let limits = [
  { x: 0, y: -20, width: width, height: 20 },
  { x: width, y: 0, width: 20, height: height },
  { x: 0, y: height, width: width, height: 20 },
  { x: -20, y: 0, width: 20, height: height },
]


document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    platform.leftKey = true;
  } else if (e.key === 'ArrowRight') {
    platform.rightKey = true;
  } else if (e.key === 'Enter') {
    plaing = true;

    ball = {
      x: width / 2, y: height - 50, width: 20, height: 20, speed: 6,
      angle: Math.PI / 4 + Math.random() * Math.PI / 2
    }

    platform = { x: width / 2 - 100, y: height - 25, width: 220, height: 130, speed: 20, leftKey: false, rightKey: false };

    blocks = [];
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 5; y++) {
        blocks.push({
          x: 50 + 50 * x, y: 50 + 50 * y, width: 50, height: 20, color: images[Math.floor(Math.random() * images.length)]
        })
      }
    }
  }
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft') {
    platform.leftKey = false;
  } else if (e.key === 'ArrowRight') {
    platform.rightKey = false;
  }
})


requestAnimationFrame(loop);

function loop(timestamp) {
  requestAnimationFrame(loop);
  clearCanvas();
  if (plaing) {
    ball.x += ball.speed * Math.cos(ball.angle);
    ball.y -= ball.speed * Math.sin(ball.angle);

    if (platform.leftKey) {
      platform.x = Math.max(0, platform.x - platform.speed);
    } else if (platform.rightKey) {
      platform.x = Math.min(platform.x + platform.speed, width - platform.width / 1.33);
    }

    let currentBlock;
    for (let block in blocks) {
      if (isIntersection(blocks[block], ball)) {
        currentBlock = blocks[block];
        toggleItem(blocks, currentBlock);

        let ctrl1 = { x: currentBlock.x - 25, y: currentBlock.y - 25, width: 25 + currentBlock.width, height: 25 };
        let ctrl2 = { x: currentBlock.x + currentBlock.width, y: currentBlock.y - 25, width: 25, height: 25 + currentBlock.height };
        let ctrl3 = { x: currentBlock.x, y: currentBlock.y + currentBlock.height, width: 25 + currentBlock.width, height: 25 };
        let ctrl4 = { x: currentBlock.x - 25, y: currentBlock.y, width: 25, height: currentBlock.height + 25 };

        if (isIntersection(ctrl1, ball) || isIntersection(ctrl3, ball)) {
          ball.angle = 2 * Math.PI - ball.angle;
        } else if (isIntersection(ctrl2, ball) || isIntersection(ctrl4, ball)) {
          ball.angle = Math.PI - ball.angle
        }
        break
      }
    }

    if (isIntersection(limits[0], ball)) {
      ball.angle = 2 * Math.PI - ball.angle
    } else if (isIntersection(limits[1], ball) || isIntersection(limits[3], ball)) {
      ball.angle = Math.PI - ball.angle
    }

    if (isIntersection(platform, ball)) {
      let x = ball.x + ball.width / 2;
      let percent = (x - platform.x) / platform.width;
      ball.angle = Math.PI - Math.PI * percent
    }

    if (isIntersection(limits[2], ball)) {
      plaing = false
    }
  }

  drawBall(ball);
  blocks.forEach(a => drawBlock(a));
  drawPlatform(platform);

  if (!plaing) {
    drawResult();
  }
}

function clearCanvas() {
  canvas.width |= 0
}

function isIntersection(blockA, blockB) {

  let pointsA = [
    { x: blockA.x, y: blockA.y },
    { x: blockA.x + blockA.width, y: blockA.y },
    { x: blockA.x, y: blockA.y + blockA.height },
    { x: blockA.x + blockA.width, y: blockA.y + blockA.height }
  ];

  for (let point of pointsA) {
    if (blockB.x <= point.x && point.x <= blockB.x + blockB.width &&
      blockB.y <= point.y && point.y <= blockB.y + blockB.height) {
      return true
    }
  }

  let pointsB = [
    { x: blockB.x, y: blockB.y },
    { x: blockB.x + blockB.width, y: blockB.y },
    { x: blockB.x, y: blockB.y + blockB.height },
    { x: blockB.x + blockB.width, y: blockB.y + blockB.height }
  ];

  for (let point of pointsB) {
    if (blockA.x <= point.x && point.x <= blockA.x + blockA.width &&
      blockA.y <= point.y && point.y <= blockA.y + blockA.height) {
      return true
    }
  }
}


function toggleItem(arr, item) {
  if (arr.includes(item)) {
    let index = arr.indexOf(item);
    arr.splice(index, 1)
  } else arr.push(item)
}


function drawBall(ball) {
  ctx.beginPath();
  ctx.drawImage(imageBall, 0, 0, 1000, 1000, ball.x, ball.y, ball.width, ball.height)
}

function drawPlatform(platform) {
  ctx.beginPath();
  ctx.drawImage(imagePlatform, 0, 0, 270, 130, platform.x, platform.y, platform.width, platform.height)
}

function drawBlock(block) {
  ctx.beginPath()
  ctx.drawImage(block.color, 0, 0, 150, 50, block.x, block.y, block.width, block.height)
}

function drawResult() {
  ctx.rect(0, 0, width, height);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.fill();

  ctx.fillStyle = 'White';
  ctx.font = '36px Monaco';
  ctx.textAlign = 'center'
  ctx.fillText('Game over', width / 2, height / 2);

  ctx.fillStyle = 'White';
  ctx.font = '26px Monaco';
  ctx.textAlign = 'center';
  ctx.fillText('Press enter to continue', width / 2, height / 2 + 30);
}