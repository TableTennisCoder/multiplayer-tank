export default class Projectile {
    constructor(id, x, y, angle, canvas, rotation, objects) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.objects = objects;

        this.id = id;
        this.x = x;
        this.y = y;
        this.radius = 4;

        this.testX = this.x;
        this.testY = this.y;

        this.angle = angle;
        this.rotation = rotation;

        this.delete = false;

        this.velocity = 4;
        this.velocityX = this.velocity * Math.sin(this.angle);
        this.velocityY = -this.velocity * Math.cos(this.angle);

        this.projectileImg = new Image();
        this.projectileImg.src = './assets/img/Light_Shell.png';

        // projectile only for 5s on canvas
        setTimeout(() => {
            this.delete = true;
        }, 5000)
    }

    draw() {
        this.ctx.fillStyle = "white";
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.closePath();
    }

    update() {
        this.draw();
        this.move();
    }

    // Collision with wall
    move() {
        this.x += this.velocityX;
        this.y += this.velocityY;
    
        if (this.y - this.radius < 0 || this.y + this.radius > this.canvas.height) {
            this.velocityY *= -1;
        }
        if (this.x - this.radius < 0 || this.x + this.radius > this.canvas.width) {
            this.velocityX *= -1;
        }
    
        // Collision detection with the objects
        this.objects.forEach(object => {
            if (
                this.x + this.radius > object.x && 
                this.x - this.radius < object.x + object.width &&
                this.y + this.radius > object.y &&
                this.y - this.radius < object.y + object.height
            ) {
                // Determine the side of the wall the projectile has hit
                const wallLeft = object.x;
                const wallRight = object.x + object.width;
                const wallTop = object.y;
                const wallBottom = object.y + object.height;
        
                // Check which side of the wall the projectile has hit and update velocity accordingly
                if (this.x < wallLeft || this.x > wallRight) {
                    this.velocityX *= -1; // Reverse horizontal velocity
                } else if (this.y < wallTop || this.y > wallBottom) {
                    this.velocityY *= -1; // Reverse vertical velocity
                }
            }
        })
    }
}