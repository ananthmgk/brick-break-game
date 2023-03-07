window.addEventListener('load', () => {
  const canvas = document.querySelector('#canvas');
  const points = document.querySelector('#point');
  const speed = document.querySelector('#speed');
  const resetButton = document.querySelector('#resetBtn');
  const ctx = canvas.getContext('2d');
  const ballRadius = 20;
  const handleWidth = 100;
  const handleHeight = 20;
  const handlBorderRadius = 10;

  let animation;
  let isDragging = false;

  let ballXAxis = canvas.width / 2;
  let ballYAxis = canvas.height - ballRadius - handleHeight;
  let handleXAxis = canvas.width / 2 - handleWidth / 2;
  let handleYAxis = canvas.height - handleHeight;
  let dx;
  let dy;
  let pointCount = JSON.parse(localStorage.getItem('items')) || 0;
  let speedCount = 0;
  let ballSpeed = 5;
  let brickWidth = 90;
  let brickHeight = 20;
  let brickYAxis = 0;
  points.innerHTML = `Point: ${pointCount}`;
  speed.innerHTML = `Speed: ${speedCount}`;

  function drawHandle() {
    ctx.clearRect(0, canvas.height - handleHeight, canvas.width, canvas.height);
    // this will clear the canvas from the bottom to the handle height.
    ctx.beginPath();
    ctx.fillStyle = 'blue';
    ctx.fillRect(handleXAxis, handleYAxis, handleWidth, handleHeight);
    ctx.stroke();
  }

  function drawBall() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const gradient = ctx.createRadialGradient(
      ballXAxis,
      ballYAxis,
      1,
      ballXAxis,
      ballYAxis,
      20
    );
    gradient.addColorStop(0, 'white'); // Start color
    gradient.addColorStop(1, 'yellow'); // End color
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(ballXAxis, ballYAxis, ballRadius, 0, Math.PI * 2);
    // ctx.fillStyle = 'yellow';
    ctx.fill();
    ctx.closePath();
  }

  function resetGame() {
    canvas.style.cursor = 'pointer';
    isDragging = false;
    pointCount = 0;
    speedCount = 0;
    ballSpeed = 5;
    points.innerHTML = `Point: ${pointCount}`;
    speed.innerHTML = `Speed: ${speedCount}`;
    localStorage.removeItem('items');
    cancelAnimationFrame(animation);
    ballXAxis = canvas.width / 2;
    ballYAxis = canvas.height - ballRadius - handleHeight;
    handleXAxis = (canvas.width - handleWidth) / 2;
    handleYAxis = canvas.height - handleHeight;
    drawBall();
    drawHandle();
    bricks = [
      { brickXAxis: 0, brickLive: true },
      { brickXAxis: 100, brickLive: true },
      { brickXAxis: 200, brickLive: true },
      { brickXAxis: 300, brickLive: true },
      { brickXAxis: 400, brickLive: true },
    ];
    drawBricks();
  }

  let bricks = [
    { brickXAxis: 0, brickLive: true },
    { brickXAxis: 100, brickLive: true },
    { brickXAxis: 200, brickLive: true },
    { brickXAxis: 300, brickLive: true },
    { brickXAxis: 400, brickLive: true },
  ];

  function collisionDetection() {
    for (let i = 0; i < 5; i++) {
      if (bricks[i].brickLive == true) {
        if (
          ballXAxis > bricks[i].brickXAxis - ballRadius &&
          ballXAxis < bricks[i].brickXAxis + brickWidth + ballRadius &&
          ballYAxis < brickYAxis + brickHeight + ballRadius + 1
        ) {
          dy = -dy;
          bricks[i].brickLive = false;
        }
      }
    }
  }

  function gameOver() {
    if (bricks.slice(0, 5).every((brick) => !brick.brickLive)) {
      cancelAnimationFrame(animation);
      isDragging = false;
      alert('YOU WIN, CONGRATS!');
      return;
    }
  }

  function drawBricks() {
    for (let i = 0; i < 5; i++) {
      if (bricks[i].brickLive == true) {
        ctx.beginPath();
        ctx.fillStyle = 'brown';
        ctx.fillRect(bricks[i].brickXAxis, brickYAxis, brickWidth, brickHeight);
        ctx.stroke();
        collisionDetection();
      }
    }
  }

  function moveBall() {
    ballXAxis += dx;
    ballYAxis += dy;

    if (ballXAxis + ballRadius > canvas.width || ballXAxis - ballRadius < 0) {
      dx = -dx;
      // it bounces the ball when it touches the left and right side walls.
    }

    if (
      ballYAxis + ballRadius > canvas.height - handleHeight ||
      ballYAxis - ballRadius < 0
    ) {
      dy = -dy;
      // it bounces the ball when it touches the upper and lower side walls.
    }

    if (handleXAxis != canvas.width / 2 - handleWidth / 2) {
      if (
        // for point scroring and game over
        ballYAxis > canvas.height - handleHeight - ballRadius - 1 &&
        ballXAxis > handleXAxis - ballRadius &&
        ballXAxis < handleXAxis + handleWidth + ballRadius
      ) {
        pointCount += 1;
        changingBallDirection();
        points.innerHTML = `Point: ${pointCount}`;
        localStorage.setItem('items', pointCount);
        if (
          pointCount == 2 ||
          pointCount == 5 ||
          pointCount == 8 ||
          pointCount == 10
        ) {
          speedCount += 1;
          speed.innerHTML = `Speed: ${speedCount}`;
          ballSpeed += 2;
        }
      } else if (ballYAxis > canvas.height - handleHeight - ballRadius) {
        cancelAnimationFrame(animation);
        isDragging = false;
        alert('You Lose, to start again Press Reset');
        return;
      }
    }

    drawBall();
    drawHandle();
    drawBricks();
    animation = requestAnimationFrame(moveBall);
    gameOver();
  }

  function changingBallDirection() {
    if (
      ballYAxis > canvas.height - handleHeight - ballRadius - 1 &&
      ballXAxis > handleXAxis - ballRadius &&
      ballXAxis < handleXAxis + 10
    ) {
      dx = ballSpeed * Math.cos((160 * Math.PI) / 180);
      dy = -ballSpeed * Math.sin((160 * Math.PI) / 180);
    } else if (
      ballYAxis > canvas.height - handleHeight - ballRadius - 1 &&
      ballXAxis > handleXAxis + 10 &&
      ballXAxis < handleXAxis + 20
    ) {
      dx = ballSpeed * Math.cos((140 * Math.PI) / 180);
      dy = -ballSpeed * Math.sin((140 * Math.PI) / 180);
    } else if (
      ballYAxis > canvas.height - handleHeight - ballRadius - 1 &&
      ballXAxis > handleXAxis + 20 &&
      ballXAxis < handleXAxis + 30
    ) {
      dx = ballSpeed * Math.cos((120 * Math.PI) / 180);
      dy = -ballSpeed * Math.sin((120 * Math.PI) / 180);
    } else if (
      ballYAxis > canvas.height - handleHeight - ballRadius - 1 &&
      ballXAxis > handleXAxis + 30 &&
      ballXAxis < handleXAxis + 40
    ) {
      dx = ballSpeed * Math.cos((100 * Math.PI) / 180);
      dy = -ballSpeed * Math.sin((100 * Math.PI) / 180);
    } else if (
      ballYAxis > canvas.height - handleHeight - ballRadius - 1 &&
      ballXAxis > handleXAxis + 40 &&
      ballXAxis < handleXAxis + 50
    ) {
      dx = ballSpeed * Math.cos((90 * Math.PI) / 180);
      dy = -ballSpeed * Math.sin((90 * Math.PI) / 180);
    } else if (
      ballYAxis > canvas.height - handleHeight - ballRadius - 1 &&
      ballXAxis > handleXAxis + 50 &&
      ballXAxis < handleXAxis + 60
    ) {
      dx = ballSpeed * Math.cos((80 * Math.PI) / 180);
      dy = -ballSpeed * Math.sin((80 * Math.PI) / 180);
    } else if (
      ballYAxis > canvas.height - handleHeight - ballRadius - 1 &&
      ballXAxis > handleXAxis + 60 &&
      ballXAxis < handleXAxis + 70
    ) {
      dx = ballSpeed * Math.cos((60 * Math.PI) / 180);
      dy = -ballSpeed * Math.sin((60 * Math.PI) / 180);
    } else if (
      ballYAxis > canvas.height - handleHeight - ballRadius - 1 &&
      ballXAxis > handleXAxis + 70 &&
      ballXAxis < handleXAxis + 80
    ) {
      dx = ballSpeed * Math.cos((40 * Math.PI) / 180);
      dy = -ballSpeed * Math.sin((40 * Math.PI) / 180);
    } else if (
      ballYAxis > canvas.height - handleHeight - ballRadius - 1 &&
      ballXAxis > handleXAxis + 80 &&
      ballXAxis < handleXAxis + 90 + ballRadius
    ) {
      dx = ballSpeed * Math.cos((20 * Math.PI) / 180);
      dy = -ballSpeed * Math.sin((20 * Math.PI) / 180);
    }
  }

  canvas.addEventListener('mousedown', () => {
    if (ballYAxis == canvas.height - ballRadius - handleHeight) {
      isDragging = true;
      dx = ballSpeed * Math.cos((90 * Math.PI) / 180);
      dy = -ballSpeed * Math.sin((90 * Math.PI) / 180);
      // dx = 5 * (Math.round(Math.random()) * 2 - 1); // to get -5 or 5.
      // dy = Math.floor(Math.random() * 5 + 1); // to get random number between 1 - 5.
      moveBall();
    }
  });

  window.addEventListener('mousemove', (e) => {
    // if (!isDragging) return;
    isDragging = true;
    canvas.style.cursor = 'grabbing';

    if (
      // it will move ball and handle before shooting
      ballYAxis == canvas.height - ballRadius - handleHeight &&
      handleXAxis + handleWidth / 2 == ballXAxis
    ) {
      handleXAxis = e.clientX - canvas.offsetLeft - handleWidth / 2;
      handleYAxis = canvas.height - handleHeight;
      ballYAxis = canvas.height - ballRadius - handleHeight;
      ballXAxis = e.clientX - canvas.offsetLeft;
    } else {
      handleXAxis = e.clientX - canvas.offsetLeft - handleWidth / 2;
      handleYAxis = canvas.height - handleHeight;
    }
    // the below (if conditn) will not allow the handle out of the canvas
    if (
      ballYAxis != canvas.height - ballRadius - handleHeight &&
      handleXAxis < 0
    ) {
      handleXAxis = 0;
    } else if (
      ballYAxis != canvas.height - ballRadius - handleHeight &&
      handleXAxis > canvas.width - handleWidth
    ) {
      handleXAxis = canvas.width - handleWidth;
    } else if (
      ballYAxis == canvas.height - ballRadius - handleHeight &&
      handleXAxis < 0
    ) {
      handleXAxis = 0;
      ballXAxis = 0 + handleWidth / 2;
    } else if (
      ballYAxis == canvas.height - ballRadius - handleHeight &&
      handleXAxis > canvas.width - handleWidth
    ) {
      handleXAxis = canvas.width - handleWidth;
      ballXAxis = canvas.width - handleWidth / 2;
    }

    drawBall();
    drawHandle();
    drawBricks();
  });

  // window.addEventListener('touchmove', (e) => {
  //   const screenOffset = e.touches[0].target.offsetWidth;
  //   const offsetwidth = screenOffset * 2 + screenOffset / 2;
  //   handleXAxis = e.touches[0].screenX - offsetwidth - handleWidth / 2;
  //   handleYAxis = canvas.height - handleHeight;

  //   drawHandle();
  // });

  resetButton.addEventListener('click', resetGame);

  drawBall();
  drawHandle();
  drawBricks();
});
