/* ============================================================
   CANVAS SETUP
============================================================ */
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.onresize = resize;

/* ============================================================
   LOADING → START → GAME
============================================================ */
window.onload = () => {
    setTimeout(() => {
        document.getElementById("loadingScreen").style.display = "none";
        document.getElementById("startScreen").style.display = "flex";
    }, 2000);
};

document.getElementById("startBtn").onclick = () => {
    document.getElementById("startScreen").style.display = "none";
    startGame();
};

/* ============================================================
   LEVEL SYSTEM
============================================================ */
let currentLevel = 1;

function loadLevel(level) {
    console.log("Loading Level", level);
}

/* ============================================================
   PLAYER + SPRITES
============================================================ */
const sprites = {
    idle: new Image(),
    moveLeft: new Image(),
    moveRight: new Image(),
    peterPan: new Image(),
    peterPanBackwards: new Image(),
    crossStep: new Image(),
    jumpForward: new Image()
};

sprites.idle.src = "sprites/idle.png";
sprites.moveLeft.src = "sprites/moveLeft.png";
sprites.moveRight.src = "sprites/moveRight.png";
sprites.peterPan.src = "sprites/peterPan.png";
sprites.peterPanBackwards.src = "sprites/peterPanBackwards.png";
sprites.crossStep.src = "sprites/crossStep.png";
sprites.jumpForward.src = "sprites/jumpForward.png";

let player = {
    x: 300,
    y: 300,
    sprite: sprites.idle
};

function updatePlayer() {
    if (actions.moveLeft) player.sprite = sprites.moveLeft;
    else if (actions.moveRight) player.sprite = sprites.moveRight;
    else if (actions.peterPan) player.sprite = sprites.peterPan;
    else if (actions.crossStep) player.sprite = sprites.crossStep;
    else if (actions.peterPanBackwards) player.sprite = sprites.peterPanBackwards;
    else if (actions.jumpForward) player.sprite = sprites.jumpForward;
    else player.sprite = sprites.idle;
}

function drawPlayer() {
    ctx.drawImage(player.sprite, player.x, player.y, 150, 150);
}

/* ============================================================
   CONTROLS (KEYBOARD + MOBILE)
============================================================ */
const actions = {
    moveLeft: false,
    moveRight: false,
    jumpForward: false,
    peterPanBackwards: false,
    peterPan: false,
    crossStep: false
};

document.addEventListener("keydown", (e) => {
    switch(e.key) {
        case "ArrowLeft": actions.moveLeft = true; break;
        case "ArrowRight": actions.moveRight = true; break;
        case "ArrowUp": actions.jumpForward = true; break;
        case "ArrowDown": actions.peterPanBackwards = true; break;
        case "a": case "A": actions.peterPan = true; break;
        case "s": case "S": actions.crossStep = true; break;
    }
});

document.addEventListener("keyup", (e) => {
    switch(e.key) {
        case "ArrowLeft": actions.moveLeft = false; break;
        case "ArrowRight": actions.moveRight = false; break;
        case "ArrowUp": actions.jumpForward = false; break;
        case "ArrowDown": actions.peterPanBackwards = false; break;
        case "a": case "A": actions.peterPan = false; break;
        case "s": case "S": actions.crossStep = false; break;
    }
});

/* MOBILE BUTTONS */
const isMobile = 'ontouchstart' in window;
if (isMobile) {
    document.getElementById("mobileControls").style.display = "flex";
}

function bindBtn(id, actionName) {
    const btn = document.getElementById(id);
    btn.addEventListener("touchstart", () => actions[actionName] = true);
    btn.addEventListener("touchend", () => actions[actionName] = false);
}

bindBtn("btnLeft", "moveLeft");
bindBtn("btnRight", "moveRight");
bindBtn("btnUp", "jumpForward");
bindBtn("btnDown", "peterPanBackwards");
bindBtn("btnA", "peterPan");
bindBtn("btnS", "crossStep");

/* ============================================================
   BACKGROUND (BELTLINE STYLE)
============================================================ */
let roadOffset = 0;

function drawSky() {
    let grad = ctx.createLinearGradient(0,0,0,canvas.height);
    grad.addColorStop(0, "#87CEEB");
    grad.addColorStop(1, "#ffffff");
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,canvas.width,canvas.height);
}

function drawTrees() {
    ctx.fillStyle = "#2e7d32";
    for (let i = 0; i < canvas.width; i += 200) {
        ctx.beginPath();
        ctx.arc(i + 50, canvas.height - 200, 80, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(i + 150, canvas.height - 220, 90, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawBars() {
    ctx.fillStyle = "#444";
    ctx.fillRect(0, canvas.height - 150, canvas.width, 10);
    ctx.fillRect(0, canvas.height - 140, canvas.width, 5);
}

function drawRoad() {
    roadOffset += 4;
    if (roadOffset > 40) roadOffset = 0;

    ctx.fillStyle = "#3a3a3a";
    ctx.fillRect(0, canvas.height - 140, canvas.width, 140);

    ctx.strokeStyle = "#f7d117";
    ctx.lineWidth = 6;

    for (let i = -40; i < canvas.width; i += 80) {
        ctx.beginPath();
        ctx.moveTo(i + roadOffset, canvas.height - 70);
        ctx.lineTo(i + 40 + roadOffset, canvas.height - 70);
        ctx.stroke();
    }
}

/* ============================================================
   GAME LOOP
============================================================ */
function startGame() {
    loadLevel(currentLevel);
    gameLoop();
}

function gameLoop() {
    drawSky();
    drawTrees();
    drawBars();
    drawRoad();

    updatePlayer();
    drawPlayer();

    requestAnimationFrame(gameLoop);
}
