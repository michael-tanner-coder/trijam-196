// OBJECTS
const PLAYER = {};
const ENEMY = {};
const PROJECTILE = {};
const HOUSE = {};

// LOOP
const update = () => {};

const draw = () => {
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);
};

const loop = () => {
  current_time = Date.now();
  let elapsed = current_time - start_time;
  start_time = current_time;
  lag += elapsed;

  //   inputListener();

  while (lag > frame_duration) {
    update(elapsed);
    lag -= 1000 / fps;
    if (lag < 0) lag = 0;
    // releaseInputs();
  }

  var lag_offset = lag / frame_duration;
  draw(lag_offset);

  window.requestAnimationFrame(loop);
};

loop();
