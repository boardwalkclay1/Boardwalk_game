const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.onresize = resize;

window.onload = () => {
    setTimeout(() => {
        document.getElementById("loadingScreen").style.display = "none";
        document.getElementById("startScreen").style.display = "flex";
    }, 1500);
};

document.getElementById("startBtn").onclick = () => {
    document.getElementById("startScreen").style.display = "none";
    startGame();
};

let sprites = {
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
    y: canvas.height - 300,
    sprite: sprites.idle
};

const actions = {
    moveLeft: false,
    moveRight: false,
    jumpForward: false,
    peterPanBackwards: false,
    peterPan: false,
    crossStep: false
};

document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") actions.moveLeft = true;
    if (e.key === "ArrowRight") actions.moveRight = true;
    if (e.key === "ArrowUp") actions.jumpForward = true;
    if (e.key === "ArrowDown") actions.peterPanBackwards = true;
    if (e.key === "a" || e.key === "A") actions.peterPan = true;
    if (e.key === "s" || e.key === "S") actions.crossStep = true;
});

document.addEventListener("keyup", e => {
    if (e.key === "ArrowLeft") actions.moveLeft = false;
    if (e.key === "ArrowRight") actions.moveRight = false;
    if (e.key === "ArrowUp") actions.jumpForward = false;
    if (e.key === "ArrowDown") actions.peterPanBackwards = false;
    if (e.key === "a" || e.key === "A") actions.peterPan = false;
    if (e.key === "s" || e.key === "S") actions.crossStep = false;
});

const isMobile = 'ontouchstart' in window;
if (isMobile) document.getElementById("mobileControls").style.display = "flex";

function bindBtn(id, action) {
    const btn = document.getElementById(id);
    btn.addEventListener("touchstart", () => actions[action] = true);
    btn.addEventListener("touchend", () => actions[action] = false);
}

bindBtn("btnLeft", "moveLeft");
bindBtn("btnRight", "moveRight");
bindBtn("btnUp", "jumpForward");
bindBtn("btnDown", "peterPanBackwards");
bindBtn("btnA", "peterPan");
bindBtn("btnS", "crossStep");

let roadOffset = 0;
let treeOffset = 0;
let barOffset = 0;

function drawSky() {
    let g = ctx.createLinearGradient(0, 0, 0, canvas.height);
    g.addColorStop(0, "#87CEEB");
    g.addColorStop(1, "#ffffff");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawTrees() {
    treeOffset += 1.2;
    if (treeOffset > 300) treeOffset = 0;

    ctx.fillStyle = "#2e7d32";

    for (let i = 0; i < canvas.width; i += 200) {
        ctx.beginPath();
        ctx.arc(i + 50, -200 + treeOffset, 80, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(i + 150, -260 + treeOffset, 90, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawRoad() {
    roadOffset += 4;
    if (roadOffset > 80) roadOffset = 0;

    ctx.fillStyle = "#3a3a3a";
    ctx.fillRect(0, canvas.height - 200, canvas.width, 200);

    ctx.strokeStyle = "#f7d117";
    ctx.lineWidth = 6;

    for (let y = -80; y < canvas.height; y += 80) {
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2 - 20, y + roadOffset);
        ctx.lineTo(canvas.width / 2 + 20, y + roadOffset);
        ctx.stroke();
    }
}

function drawBars() {
    barOffset += 2;
    if (barOffset > 200) barOffset = 0;

    ctx.fillStyle = "#444";
    ctx.fillRect(0, canvas.height - 150 + barOffset, canvas.width, 10);
    ctx.fillRect(0, canvas.height - 140 + barOffset, canvas.width, 5);
}

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

function startGame() {
    gameLoop();
}

function gameLoop() {
    drawSky();
    drawTrees();
    drawRoad();
    drawBars();
    updatePlayer();
    drawPlayer();
    requestAnimationFrame(gameLoop);
}
