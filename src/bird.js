//https://www.youtube.com/watch?v=c6y21FkaUqw
import {GAME_SPEED, HEIGHT} from "./constants";

export class Bird{
    constructor(p5, player = false){
        this.p5 = p5;
        this.y = HEIGHT/2;
        this.x = 100;
        this.gravity = 0.9;
        this.lift = -12;
        this.velocity = 0;
        this.speed = GAME_SPEED;
        this.score = 0;
        this.passed_pipes = 1;
        this.prediction = null;
        this.closest = null;
        this.dead = false;
        this.size = 20;
        this.random_col = Math.floor(Math.random() * 255);
        this.player = player;
    }

    show() {
        let color = (this.score*2 >= 255) ? 255 : this.score*2;
        this.p5.stroke(255);
        this.p5.fill(this.random_col, color, this.random_col, 50);

        if(this.player){
            this.p5.stroke(0,0,255);
            this.p5.fill(0,0,255);
        }
        this.p5.ellipse(this.x, this.y, this.size, this.size);
    };

    up() {
        this.velocity += this.lift;
    };

    think(pipes) {
        let self = this;
        let closest = null;
        let closestD = Infinity;
        for(let i = 0; i < pipes.length; i++){
            let d = pipes[i].x-this.x;
            if(d < 0){
                this.passed_pipes += 1;
            }
            if(d < closestD && d > 0){
                closest = pipes[i];
                closestD = d;
            }
        }
        self.closest = closest;
    };

    update() {
        if(this.dead){
            if(this.x < 0){
                return;
            }
            this.x -= this.speed;
            return;
        }
        this.score++

        this.velocity += this.gravity;
        this.velocity *= 0.998;
        this.y += this.velocity;

        if (this.y >= HEIGHT) {
            this.dead = true;
            this.y = HEIGHT;
            this.velocity = 0;
        }

        if (this.y <= 0) {
            this.dead = true;
            this.y = 0;
            this.velocity = 0;
        }

        if(this.prediction !== null && this.prediction[0] > this.prediction[1]){
            this.up();
        }

    }

}
