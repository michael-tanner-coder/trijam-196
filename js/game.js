// GAME CONCEPT: 2 player game of breakout: destory the other player's bricks!

// TODO: game loop test
// TODO: spawn bricks
// TODO: control paddle (left + right)
// TODO: spawn ball with random direction
// TODO: wall collision (all walls are solid)
// TODO: brick collision
// TODO: paddle collision
// TODO: brick destruction
// TODO: win/lose states
// TODO: start menu
// TODO: quit option?
// TODO: nice to have: powerup bricks (faster ball, destroy more bricks, exploding bricks, etc)
// TODO: nice to have: trails, screenshake, sound and music

const GAME_W = 240;
const GAME_H = 320;

// OBJECTS
const PADDLE = {
  x: GAME_W / 2,
  y: GAME_H / 2,
  w: 48,
  h: 8,
  color: "white",
  speed: 4,
  type: "paddle",
};
const BALL = {
  x: GAME_W / 2,
  y: 100,
  w: 8,
  h: 8,
  color: "white",
  speed: 4,
  type: "ball",
};
const BRICK = {
  x: GAME_W / 2,
  y: 50,
  w: 32,
  h: 16,
  color: "red",
  speed: 0,
  type: "ball",
};

const GAME_OBJECTS = [PADDLE, BALL, BRICK];

// LOOP
const update = () => {};

const draw = () => {
  console.log("draw");
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);

  // render objects
  GAME_OBJECTS.forEach((obj) => {
    console.log(obj);
    context.fillStyle = obj.color;
    context.fillRect(obj.x, obj.y, obj.w, obj.h);
  });
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
