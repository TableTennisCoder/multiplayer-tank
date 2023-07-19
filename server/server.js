const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const express = require("express");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const publicPath = path.join(__dirname, "/../public");

app.use(express.static(publicPath));

let backendPlayers = [];

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


io.on('connection', socket => {
    // only if player entered name and pressed play
    socket.on("playerRegistered", playerInfos => {
        const player = {
            id: socket.id,
            name: playerInfos.name,
            x: Math.random() * 600,
            y: Math.random() * 700,
            width: 32,
            height: 32,
            rotation: 0,
            velocity: 2,
            image: playerInfos.image
        }
        backendPlayers.push(player);
    
        io.emit("updatePlayers", backendPlayers);
    })

    // when user disconnects
    socket.on("disconnect", () => {
        // delete the disconnected player from the backendPlayers array
        backendPlayers = backendPlayers.filter((backendPlayer) => backendPlayer.id !== socket.id);
        io.emit("updatePlayers", backendPlayers);
    });

    socket.on("keyDown", (keyInputs) => {
        // find the specific player in the backendPlayers array which pressed the key on the keyboard
        const player = backendPlayers.find((backendPlayer) => backendPlayer.id === socket.id);
    
        if (player) {
            const angleInRadians = (player.rotation * Math.PI) / 180; // Convert rotation angle to radians

            if (keyInputs["ArrowUp"]) {
                const velocityX = player.velocity * Math.sin(angleInRadians);
                const velocityY = -player.velocity * Math.cos(angleInRadians);
                player.x += velocityX;
                player.y += velocityY;
            }
            if (keyInputs["ArrowRight"]) {
                player.rotation += player.velocity; // Increase the rotation angle
            }
            if (keyInputs["ArrowDown"]) {
                const velocityX = -player.velocity * Math.sin(angleInRadians);
                const velocityY = player.velocity * Math.cos(angleInRadians);
                player.x += velocityX;
                player.y += velocityY;
            }
            if (keyInputs["ArrowLeft"]) {
                player.rotation -= player.velocity; // Decrease the rotation angle
            }
            if (keyInputs["Space"]) {
                // Calculate the initial position of the projectile based on the gun's position and rotation
                const gunLength = 50;
                const projectileX = player.x + (gunLength * Math.sin(player.rotation * Math.PI / 180));
                const projectileY = player.y - (gunLength * Math.cos(player.rotation * Math.PI / 180));

                const projectile = {
                    id: player.id,
                    x: projectileX,
                    y: projectileY,
                    delay: 7,
                    rotation: player.rotation
                }

                io.emit("projectile", projectile);
            }

            // Collision detection with wall
            if (player.y - player.height < 0) {
                player.y = 0 + player.height;
            }
            // Bottom border of canvas
            if (player.y + player.height > 768) {
              player.y = 768 - player.height;
            }
            // Left border of canvas
            if (player.x - player.width < 0) {
              player.x = 0 + player.width;
            }
            // Right border of canvas
            if (player.x + player.width > 1280) {
              player.x = 1280 - player.width;
            }

            // Check collision with objects
            objects.forEach(object => {
              const objectLeft = object.x;
              const objectRight = object.x + object.width;
              const objectTop = object.y;
              const objectBottom = object.y + object.height;
            
              // wehen there is a collision between tank and object
              if (
                player.x - player.width < objectRight &&
                player.x + player.width > objectLeft &&
                player.y - player.height < objectBottom &&
                player.y + player.height > objectTop
              ) {
                // Collision occurred
            
                // Calculate the distances between the sides of the tank and the sides of the object
                const dxLeft = Math.abs(player.x - player.width - objectRight);
                const dxRight = Math.abs(player.x + player.width - objectLeft);
                const dyTop = Math.abs(player.y - player.height - objectBottom);
                const dyBottom = Math.abs(player.y + player.height - objectTop);
            
                // Find the minimum distance
                const minDistance = Math.min(dxLeft, dxRight, dyTop, dyBottom);
            
                // Adjust the tank's position based on the minimum distance
                if (minDistance === dxLeft) {
                  player.x = objectRight + player.width;
                } else if (minDistance === dxRight) {
                  player.x = objectLeft - player.width;
                } else if (minDistance === dyTop) {
                  player.y = objectBottom + player.height;
                } else if (minDistance === dyBottom) {
                  player.y = objectTop - player.height;
                }
              }
            });

            io.emit("updatePlayerLocation", player);

        }
    });
})

server.listen(3300, () => {
    console.log("listening on *:8000");
});
