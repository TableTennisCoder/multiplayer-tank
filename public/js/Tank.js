export default class Tank {
    constructor(canvas,playerInfos) {
      // canvas
      this.canvas = canvas;
      this.canvasWidth = canvas.width;
      this.canvasHeight = canvas.height;
      this.ctx = canvas.getContext("2d");

      // Tank
      this.tank = new Image();
      this.tank.src = './assets/img/tankSmall.png';
      this.id = playerInfos.id;
      this.name = playerInfos.name;
      this.tankX = playerInfos.x;
      this.tankY = playerInfos.y;
      this.tankHeight = 32;
      this.tankWidth = 32;
  
      this.velocity = playerInfos.velocity;
      this.rotation = playerInfos.rotation; // Current rotation angle of the tank

    }
  
    draw() {
      this.ctx.save(); // Save the current transformation state
      this.ctx.translate(this.tankX, this.tankY); // Translate to the tank's position
      this.ctx.rotate((this.rotation * Math.PI) / 180); // Rotate the canvas
      this.ctx.drawImage(this.tank, -this.tank.width / 2, -this.tank.height / 2);
      this.ctx.restore(); // Restore the previous transformation state

    }

    playShootMusic() {
        document.getElementById('shotMusic').currentTime = 0;
        document.getElementById('shotMusic').play();
    }
  }
  