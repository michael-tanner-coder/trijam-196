// GAME CONCEPT: 2 player game of breakout: destory the other player's bricks!

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

// GRID PROPS
const BRICK_W = 32;
const BRICK_H = 16;
const COLS = 6;
const ROWS = 4;
const PADDING = 4;

// OBJECTS
const PADDLE = {
  x: GAME_W / 2,
  y: GAME_H / 2,
  dx: 0,
  w: 48,
  h: 8,
  color: "white",
  speed: 4,
  type: "paddle",
  tag: "player1",
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
  w: BRICK_W,
  h: BRICK_H,
  color: "red",
  speed: 0,
  type: "ball",
};

const INPUTS = {
  // PLAYER 1
  ArrowLeft: false,
  ArrowRight: false,

  // PLAYER 2
  a: false,
  d: false,

  // PAUSE/START/QUIT
  enter: false,
};

// UTILS
const genGrid = (brick, rows, cols, start_x = 0, start_y = 0) => {
  let new_grid = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      // copy obj template
      let new_brick = JSON.parse(JSON.stringify(brick));

      // initial pos
      new_brick.x = start_x + j * new_brick.w + PADDING * j;
      new_brick.y = start_y + i * new_brick.h + PADDING * i;

      // add to grid
      new_grid.push(new_brick);
    }
  }
  return new_grid;
};

const movePaddle = (paddle) => {
  // P1
  if (paddle.tag === "player1") {
    INPUTS.ArrowRight ? (paddle.dx = paddle.speed) : null;
    INPUTS.ArrowLeft ? (paddle.dx = -1 * paddle.speed) : null;
  }

  // P2
  if (paddle.tag === "player2") {
    INPUTS.d ? (paddle.dx = paddle.speed) : null;
    INPUTS.a ? (paddle.dx = -1 * paddle.speed) : null;
  }
};

// INPUTS
window.addEventListener("keydown", function (e) {
  if (INPUTS[e.key] !== undefined) {
    INPUTS[e.key] = true;
    console.log(INPUTS);
  }
});

window.addEventListener("keyup", function (e) {
  if (INPUTS[e.key] !== undefined) {
    INPUTS[e.key] = false;
    console.log(INPUTS);
  }
});

const PLAYER_1_GRID = genGrid(BRICK, ROWS, COLS, BRICK_W / 2, BRICK_H);
const PLAYER_2_GRID = genGrid(BRICK, ROWS, COLS, BRICK_W / 2, 224);

const GAME_OBJECTS = [PADDLE, BALL, ...PLAYER_1_GRID, ...PLAYER_2_GRID];

// LOOP
const update = (dt) => {
  // console.log(dt);

  // collision groups
  let paddles = GAME_OBJECTS.filter((obj) => obj.type === "paddle");
  let balls = GAME_OBJECTS.filter((obj) => obj.type === "ball");
  let bricks = GAME_OBJECTS.filter((obj) => obj.type === "brick");

  // player movement
  paddles.forEach((paddle) => {
    // PLAYER MOVEMENT
    paddle.dx = 0;

    movePaddle(paddle);

    paddle.x += paddle.dx;
  });
};

const draw = () => {
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);

  // render objects
  GAME_OBJECTS.forEach((obj) => {
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
    update(elapsed / 1000);
    lag -= 1000 / fps;
    if (lag < 0) lag = 0;
    // releaseInputs();
  }

  var lag_offset = lag / frame_duration;
  draw(lag_offset);

  window.requestAnimationFrame(loop);
};

loop();
