import Tank from './js/Tank.js';
import Projectile from './js/Projectile.js';

const socket = io();

let frontendPlayers = [];
let frontendProjectiles = [];
let timeTillNextProjectile = 0;
let keyInputs = {};

const startBtn = document.getElementById('startGame');
const restartBtn = document.getElementById('restart');
const startScreen = document.getElementById('startScreen');
const gameoverScreen = document.getElementById('gameOverScreen');
const caption = document.getElementById('caption');
const winnerDiv = document.getElementById('winner');
const playerName = document.getElementById('player1');

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

canvas.width = 1280;
canvas.height = 768;

let animationFrame;

const objects = [
    {
     "height":163,
     "id":2,
     "name":"",
     "rotation":0,
     "type":"",
     "visible":true,
     "width":13,
     "x":761,
     "y":30
    }, 
    {
     "height":14,
     "id":3,
     "name":"",
     "rotation":0,
     "type":"",
     "visible":true,
     "width":126,
     "x":704,
     "y":121
    }, 
    {
     "height":13,
     "id":5,
     "name":"",
     "rotation":0,
     "type":"",
     "visible":true,
     "width":198,
     "x":1024,
     "y":120
    }, 
    {
     "height":56,
     "id":6,
     "name":"",
     "rotation":0,
     "type":"",
     "visible":true,
     "width":14,
     "x":1080,
     "y":134
    }, 
    {
     "height":191,
     "id":9,
     "name":"",
     "rotation":0,
     "type":"",
     "visible":true,
     "width":15,
     "x":121,
     "y":128
    }, 
    {
     "height":15,
     "id":10,
     "name":"",
     "rotation":0,
     "type":"",
     "visible":true,
     "width":86,
     "x":34,
     "y":183
    }, 
    {
     "height":14,
     "id":11,
     "name":"",
     "rotation":0,
     "type":"",
     "visible":true,
     "width":133,
     "x":320,
     "y":184
    }, 
    {
     "height":256,
     "id":12,
     "name":"",
     "rotation":0,
     "type":"",
     "visible":true,
     "width":15,
     "x":440,
     "y":127
    }, 
    {
     "height":127,
     "id":13,
     "name":"",
     "rotation":0,
     "type":"",
     "visible":true,
     "width":15,
     "x":631,
     "y":255
    }, 
    {
     "height":15,
     "id":14,
     "name":"",
     "rotation":0,
     "type":"",
     "visible":true,
     "width":176,
     "x":455,
     "y":311
    }, 
    {
     "height":193,
     "id":15,
     "name":"",
     "rotation":0,
     "type":"",
     "visible":true,
     "width":13,
     "x":249,
     "y":318
    }, 
    {
     "height":96,
     "id":16,
     "name":"",
     "rotation":0,
     "type":"",
     "visible":true,
     "width":14,
     "x":184,
     "y":638
    }, 
    {
     "height":13,
     "id":17,
     "name":"",
     "rotation":0,
     "type":"",
     "visible":true,
     "width":255,
     "x":384,
     "y":569
    }, 
    {
     "height":57,
     "id":18,
     "name":"",
     "rotation":0,
     "type":"",
     "visible":true,
     "width":14,
     "x":440,
     "y":512
    }, 
    {
     "height":155,
     "id":19,
     "name":"",
     "rotation":0,
     "type":"",
     "visible":true,
     "width":14,
     "x":504,
     "y":582
    }, 
    {
     "height":17,
     "id":20,
     "name":"",
     "rotation":0,
     "type":"",
     "visible":true,
     "width":129,
     "x":767,
     "y":631
    }, 
    {
     "height":93,
     "id":21,
     "name":"",
     "rotation":0,
     "type":"",
     "visible":true,
     "width":14,
     "x":825,
     "y":647
    }, 
    {
     "height":255,
     "id":22,
     "name":"",
     "rotation":0,
     "type":"",
     "visible":true,
     "width":14,
     "x":888,
     "y":256
    }, 
    {
     "height":129,
     "id":23,
     "name":"",
     "rotation":0,
     "type":"",
     "visible":true,
     "width":14,
     "x":1017,
     "y":319
    }, 
    {
     "height":17,
     "id":24,
     "name":"",
     "rotation":0,
     "type":"",
     "visible":true,
     "width":114,
     "x":903,
     "y":374
    },

    {
     "height":161,
     "id":25,
     "name":"",
     "rotation":0,
     "type":"",
     "visible":true,
     "width":15,
     "x":1081,
     "y":574
}]

socket.on("updatePlayers", backendPlayers => {
    // Delete disconnected players from the frontendPlayers array
    frontendPlayers = frontendPlayers.filter(frontendPlayer => {
       return backendPlayers.some(backendPlayer => backendPlayer.id === frontendPlayer.id);
   });

   // Push each backendPlayers object into frontendPlayers array
   backendPlayers.forEach(backendPlayer => {
       // check if its still existing -> return and dont add it to the frontendPlayer array
       if (frontendPlayers.find(frontendPlayer => frontendPlayer.id === backendPlayer.id)) return;

       frontendPlayers.push(new Tank(canvas, backendPlayer));
   })
})

socket.on("updatePlayerLocation", backendPlayer => {
    let player = frontendPlayers.find(frontendPlayer => frontendPlayer.id === backendPlayer.id);
    player.tankX = backendPlayer.x;
    player.tankY = backendPlayer.y;
    player.velocity = backendPlayer.velocity;
    player.rotation = backendPlayer.rotation;
})

socket.on("projectile", projectile => {
    if (timeTillNextProjectile <= 0) {
        frontendProjectiles.push(new Projectile(projectile.id, projectile.x, projectile.y, (projectile.rotation * Math.PI) / 180, canvas, projectile.rotation, objects));
        timeTillNextProjectile = projectile.delay;
    }
    timeTillNextProjectile--;
})

window.addEventListener("keydown", (e) => {
    keyInputs[e.code] = true;
})

window.addEventListener("keyup", (e) => {
    delete keyInputs[e.code];
})


function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    animationFrame = requestAnimationFrame(animate);

    // draw all the frontendPlayers in the frontendPlayers array
    frontendPlayers.forEach(frontendPlayer => {
        frontendPlayer.draw();
        // display player's name
        ctx.font = "30px BAD_GRUNGE";
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
        ctx.shadowBlur = 8;
        ctx.fillText(frontendPlayer.name, frontendPlayer.tankX, frontendPlayer.tankY + frontendPlayer.tankHeight * 2);
    });

    // draw all projctiles and check collision
    frontendProjectiles = frontendProjectiles.filter(projectile => projectile.delete === false);
    frontendProjectiles.forEach((projectile, projectileIndex) => {
        projectile.update();

        frontendPlayers.forEach((player, playerIndex) => {
            if (projectile.x - projectile.radius < player.tankX + player.tankWidth &&
                projectile.x + projectile.radius > player.tankX - player.tankWidth &&
                projectile.y - projectile.radius < player.tankY + player.tankHeight &&
                projectile.y + projectile.radius > player.tankY - player.tankHeight
                ) {
                    // remove player and projectile
                    frontendPlayers.splice(playerIndex, 1);
                    frontendProjectiles.splice(projectileIndex, 1);

                    // the last player who is on the field wins
                    if (frontendPlayers.length == 1) {
                        gameOver(frontendPlayers[0].name);
                    }
                }
        })
    })

    socket.emit("keyDown", keyInputs);
}

startBtn.addEventListener("click", () => {
    //document.getElementById('backgroundMusic').play();

    // when user entered a name and pressed the play button
    socket.emit("playerRegistered", playerName.value);
    animate();
    startScreen.classList.add("hidden");
    caption.classList.remove("hidden");
    canvas.classList.remove("hidden");
})


function gameOver(winner) {
    cancelAnimationFrame(animationFrame);
    gameoverScreen.classList.remove("hidden");
    winnerDiv.innerText = "WINNER: " + winner;
}

restartBtn.addEventListener("click", () => {
    window.location.reload();
})