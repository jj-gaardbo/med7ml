import {GAME_SPEED, HEIGHT, WIDTH} from "./constants";

export class Pipe{
    constructor(p5){
        this.p5 = p5;
        this.spacing = 500;
        this.top = 0 + Math.random() * ((HEIGHT-this.spacing) - 0);
        this.bottom = HEIGHT - (this.top + this.spacing);
        this.w = 80;
        this.speed = GAME_SPEED;
        this.highlight = false;
        this.x = WIDTH;
        this.middle = Math.round(this.top+this.spacing*0.5);
    }

    hits(bird) {
        if (bird.y < this.top || bird.y > HEIGHT - this.bottom) {
            if (bird.x > this.x && bird.x < this.x + this.w) {
                this.highlight = true;
                return true;
            }
        }
        this.highlight = false;
        return false;
    }

    show() {
        this.p5.stroke(0)
        this.p5.fill(50,50,50);
        if (this.highlight) {
            this.p5.fill(100, 100, 100);
        }
        this.p5.rect(this.x, 0, this.w, this.top);
        this.p5.rect(this.x, HEIGHT-this.bottom, this.w, this.bottom);
    }

    update() {
        this.x -= this.speed;
    }

    offscreen() {
        if (this.x < -this.w) {
            return true;
        } else {
            return false;
        }
    }
}
