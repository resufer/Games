window.onload = () => {
  let field = document.createElement('div');
  document.body.appendChild(field);
  field.classList.add('field');

  for (let i = 1; i < 401; i++) {
    let excel = document.createElement('div');
    field.appendChild(excel);
    excel.classList.add('excel')
  }

  let excel = document.getElementsByClassName('excel');
  excel[0].setAttribute('posX', 'test');
  let x = 1, y = 20;
  for (let i = 0; i < excel.length; i++) {
    excel[i].setAttribute('posX', x);
    excel[i].setAttribute('posY', y);
    if (x > 19) {
      y--;
      x = 1;
    } else x++
  }


  function generateSnake() {
    let posX = Math.round(Math.random() * (20 - 3) + 3);
    let posY = Math.round(Math.random() * (20 - 1) + 1);
    return [posX, posY];
  };

  let coordinats = generateSnake();
  let snake = [
    document.querySelector('[posX = "' + coordinats[0] + '"][posY = "' + coordinats[1] + '"]'),
    document.querySelector('[posX = "' + (coordinats[0] - 1) + '"][posY = "' + coordinats[1] + '"]'),
    document.querySelector('[posX = "' + (coordinats[0] - 2) + '"][posY = "' + coordinats[1] + '"]')
  ];

  for (let i = 0; i < snake.length; i++) {
    snake[i].classList.add('snakeBody');
  };
  snake[0].classList.add('snakeHead');


  let mouse;
  function createMouse() {
    function generateMouse() {
      let posX = Math.round(Math.random() * (20 - 1) + 1);
      let posY = Math.round(Math.random() * (20 - 1) + 1);
      return [posX, posY];
    };

    let mouseCoordinats = generateMouse();
    mouse = document.querySelector(
      '[posX = "' + mouseCoordinats[0] + '"][posY = "' + mouseCoordinats[1] + '"]'
    );

    while (mouse.classList.contains('snakeBody')) {
      let mouseCoordinats = generateMouse();
      mouse = document.querySelector(
        '[posX = "' + mouseCoordinats[0] + '"][posY = "' + mouseCoordinats[1] + '"]'
      );
    }

    mouse.classList.add('mouse');
  };
  createMouse();


  let score = 0, output = document.createElement('div');
  output.classList.add('output');
  document.body.appendChild(output);
  output.innerText = `Your scors: ${score}`;

  let direction = 'down', steps = false, special;

  function move() {
    let snakeCoordinats = [snake[0].getAttribute('posX'), snake[0].getAttribute('posY')];
    snake[0].classList.remove('snakeHead');
    snake[snake.length - 1].classList.remove('snakeBody');
    snake.pop();

    if (direction === 'right') {
      if (snakeCoordinats[0] < 20) {
        snake.unshift(document.querySelector(
          '[posX = "' + (+snakeCoordinats[0] + 1) + '"][posY = "' + snakeCoordinats[1] + '"]'
        ));
      } else {
        snake.unshift(document.querySelector(
          '[posX = "1"][posY = "' + snakeCoordinats[1] + '"]'
        ));
      }
    }
    else if (direction === 'left') {
      if (snakeCoordinats[0] > 1) {
        snake.unshift(document.querySelector(
          '[posX = "' + (+snakeCoordinats[0] - 1) + '"][posY = "' + snakeCoordinats[1] + '"]'
        ));
      } else {
        snake.unshift(document.querySelector(
          '[posX = "20"][posY = "' + snakeCoordinats[1] + '"]'
        ));
      }
    }
    else if (direction === 'up') {
      if (snakeCoordinats[1] < 20) {
        snake.unshift(document.querySelector(
          '[posX = "' + snakeCoordinats[0] + '"][posY = "' + (+snakeCoordinats[1] + 1) + '"]'
        ));
      } else {
        snake.unshift(document.querySelector(
          '[posX = "' + snakeCoordinats[0] + '"][posY = "1"]'
        ));
      }
    }
    else if (direction === 'down') {
      if (snakeCoordinats[1] > 1) {
        snake.unshift(document.querySelector(
          '[posX = "' + snakeCoordinats[0] + '"][posY = "' + (+snakeCoordinats[1] - 1) + '"]'
        ));
      } else {
        snake.unshift(document.querySelector(
          '[posX = "' + snakeCoordinats[0] + '"][posY = "20"]'
        ));
      }
    }

    if (snake[0].getAttribute('posX') === mouse.getAttribute('posX') &&
      snake[0].getAttribute('posY') === mouse.getAttribute('posY')) {
      mouse.classList.remove('mouse');
      let lastX = snake[snake.length - 1].getAttribute('posX');
      let lastY = snake[snake.length - 1].getAttribute('posY');
      snake.push(document.querySelector(
        '[posX = "' + lastX + '"][posY = "' + lastY + '"]'
      ));
      createMouse();
      score++;
      output.innerText = `Your scors: ${score}`;
    }

    if (snake[0].classList.contains('snakeBody')) {
      clearInterval(interval);
      snake[0].style.backgroundColor = 'darkred';
      output.innerText = `Game Over! Your scors: ${score}`;
      setTimeout(() => {
        output.innerText = 'Press enter to continue';
      }, 2000)
    }

    snake[0].classList.add('snakeHead');
    for (let i = 0; i < snake.length; i++) {
      snake[i].classList.add('snakeBody');
    };

    steps = true;
  };

  let interval = setInterval(move, 100);

  window.addEventListener('keydown', (e) => {
    if (steps) {
      if (e.key === 'ArrowLeft' && direction != 'right') {
        direction = 'left';
        steps = false;
      } else if (e.key === 'ArrowUp' && direction != 'down') {
        direction = 'up';
        steps = false;
      } else if (e.key === 'ArrowRight' && direction != 'left') {
        direction = 'right';
        steps = false;
      } else if (e.key === 'ArrowDown' && direction != 'up') {
        direction = 'down';
        steps = false;
      } else if (e.key === ' ') {
        special = 'jump';
      }
    }
    if (snake[0].classList.contains('snakeBody') && e.key === 'Enter') {
      location.reload();
    }

  });

};