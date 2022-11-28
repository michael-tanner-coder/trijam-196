// GAME CONCEPT: 2 player game of breakout: destroy the other player's bricks!

// TODO: start menu
// TODO: quit option?
// TODO: nice to have: powerup bricks (faster ball, destroy more bricks, exploding bricks, etc)
// TODO: nice to have: trails, screenshake, sound and music

const GAME_W = 240;
const GAME_H = 320;

const STATES = {
  game_over: "game_over",
  start: "start",
  in_game: "in_game",
  menu: "menu",
};
var game_state = "start";

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
  x: GAME_W / 2 - 4,
  y: GAME_H / 2 - 4,
  w: 8,
  h: 8,
  dx: 0,
  dy: 0,
  color: "white",
  speed: 1,
  type: "ball",
};
const BRICK = {
  x: GAME_W / 2,
  y: 50,
  w: BRICK_W,
  h: BRICK_H,
  color: "red",
  speed: 0,
  type: "brick",
  tag: "player1",
};

// PLAYERS
const PLAYER_1 = JSON.parse(JSON.stringify(PADDLE));
const PLAYER_2 = JSON.parse(JSON.stringify(PADDLE));
PLAYER_1.tag = "player1";
PLAYER_2.tag = "player2";

PLAYER_1.y = 100;
PLAYER_2.y = 200 + PLAYER_2.h;

PLAYER_1.x = GAME_W / 2 - PLAYER_1.w / 2;
PLAYER_2.x = GAME_W / 2 - PLAYER_1.w / 2;

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

const pickDirection = (obj) => {
  let dy = Math.random() > 0.5 ? -1 * obj.speed : obj.speed;
  let dx = Math.random() > 0.5 ? -1 * obj.speed : obj.speed;
  obj.dx = dx;
  obj.dy = dy;
};

const gridLogic = (grid) => {
  grid.forEach((brick) => {
    if (collisionDetected(BALL, brick)) {
      bounceBall(BALL, brick);
    }
  });
};

const bounceBall = (ball, other) => {
  // bounce collision
  let ball_center = { x: ball.x + ball.w / 2, y: ball.y + ball.y / 2 };
  let other_center = { x: other.x + other.w / 2, y: other.y + other.h / 2 };

  // left side
  if (ball.x + ball.w < other_center.x && ball.y + ball.h < other.y + other.h) {
    ball.dx *= -1;
  }
  // right side
  if (ball.x > other_center.x && ball.y + ball.h < other.y + other.h) {
    ball.dx *= -1;
  }

  // front side
  if (
    ball.y + ball.h > other.y + other.h &&
    ball.x + ball.w < other.x + other.w
  ) {
    ball.dy *= -1;
  }
  // back side
  if (
    ball.y + ball.h < other.y + other.h &&
    ball.x + ball.w < other.x + other.w
  ) {
    ball.dy *= -1;
  }

  // remove other
  if (other.type === "paddle") return;
  let other_idx = GAME_OBJECTS.indexOf(other);
  GAME_OBJECTS.splice(other_idx, 1);

  //
  if (other.tag === "player1") p1_bricks--;
  if (other.tag === "player2") p2_bricks--;
};

function collisionDetected(obj_a, obj_b) {
  return (
    obj_a.x < obj_b.x + obj_b.w &&
    obj_a.x + obj_a.w > obj_b.x &&
    obj_a.y < obj_b.y + obj_b.h &&
    obj_a.y + obj_a.h > obj_b.y
  );
}

function checkForWinner() {
  if (p1_bricks <= 0) {
    winner = "P2 WINS";
    game_state = STATES.game_over;
  }

  if (p2_bricks <= 0) {
    winner = "P1 WINS";
    game_state = STATES.game_over;
  }
}

// INPUTS
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
PLAYER_2_GRID.forEach((brick) => {
  brick.tag = "player2";
});
p1_bricks = PLAYER_1_GRID.length;
p2_bricks = PLAYER_2_GRID.length;

pickDirection(BALL);
const GAME_OBJECTS = [
  PLAYER_1,
  PLAYER_2,
  BALL,
  ...PLAYER_1_GRID,
  ...PLAYER_2_GRID,
];

// LOOP
const update = (dt) => {
  // collision groups
  let paddles = GAME_OBJECTS.filter((obj) => obj.type === "paddle");
  let balls = GAME_OBJECTS.filter((obj) => obj.type === "ball");
  let bricks = GAME_OBJECTS.filter((obj) => obj.type === "brick");

  // GAME STATES
  if (game_state === STATES.menu) {
    return;
  }
  if (game_state === STATES.start) {
    // tick timer until the game is ready to start

    start_timer -= 0.02;

    if (start_timer <= 0) {
      game_state = STATES.in_game;
    }

    return;
  }
  if (game_state === STATES.in_game) {
    // player group
    paddles.forEach((paddle) => {
      // PLAYER MOVEMENT
      paddle.dx = 0;

      movePaddle(paddle);

      paddle.x += paddle.dx;

      if (collisionDetected(BALL, paddle)) {
        bounceBall(BALL, paddle);
      }
    });

    // ball group
    balls.forEach((ball) => {
      ball.x += ball.dx;
      ball.y += ball.dy;

      // wall collision
      if (ball.x + ball.w > GAME_W || ball.x + ball.w < 0) {
        ball.dx *= -1;
      }
      if (ball.y + ball.w > GAME_H || ball.y + ball.w < 0) {
        ball.dy *= -1;
      }
    });

    // brick groups
    bricks.forEach((brick) => {
      if (collisionDetected(BALL, brick)) {
        bounceBall(BALL, brick);
      }
    });

    checkForWinner();
    return;
  }
  if (game_state === STATES.game_over) {
    return;
  }
};

const draw = () => {
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);

  // render objects
  GAME_OBJECTS.forEach((obj) => {
    context.fillStyle = obj.color;
    context.fillRect(obj.x, obj.y, obj.w, obj.h);
  });

  // timer
  if (game_state === STATES.start) {
    context.fillStyle = "white";
    context.fillText(Math.floor(start_timer), GAME_W / 2 - 4, GAME_H / 2 - 16);
  }

  if (game_state === STATES.game_over) {
    context.fillStyle = "white";
    context.fillText(winner, GAME_W / 2 - 4, GAME_H / 2 - 16);
  }
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
