```
let array = [
    [0, 0, 90, 20],
    [102, 0, 90, 20],
    [202, 0, 90, 20],
    [302, 0, 90, 20],
    [402, 0, 100, 20],
  ];

  for (let i = 1; i <= 5; i++) {
    window[`drawbrick${i}`] = () => {
      brickPresent = true;
      ctx.beginPath();
      ctx.fillStyle = 'green';
      ctx.fillRect(...array[i - 1]);
      // ctx.clearRect(...array[0]);
      ctx.stroke();
      // console.log(brickPresent);
    };
  }

  <!-- to create bricks 5 functions. -->
  for (let i = 0; i < 5; i++) {
    window[`brick${i + 1}`] = () => {
      brickPresent = true;
      ctx.beginPath();
      ctx.fillStyle = 'green';
      ctx.fillRect(`${i}00`, brickYAxis, brickWidth, brickHeight);
      // ctx.clearRect(0, 0, brickWidth, brickHeight);
      // ctx.clearRect(`${i}00`, 0, brickWidth, brickHeight);
      ctx.stroke();
      // console.log(brickPresent);
    };
  }

  function changingBallDirection() {
    if (ballYAxis > canvas.height - handleHeight - ballRadius - 1) {
      for (let i = 0; i < 9; i++) {
        let xRangeStart = handleXAxis + i * 10;
        let xRangeEnd = handleXAxis + (i + 1) * 10;
        if (ballXAxis > xRangeStart && ballXAxis < xRangeEnd) {
          let angle = ((160 - i * 20) * Math.PI) / 180;
          dx = ballSpeed * Math.cos(angle);
          dy = -ballSpeed * Math.sin(angle);
          break;
        }
      }
    }
  }

  ```