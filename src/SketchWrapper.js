import React, { Component } from 'react'
import Sketch from 'react-p5'
import {WIDTH, HEIGHT, PIPE_FREQ, FRAME_RATE} from "./constants";
import {Pipe} from "./pipe";
import {Bird} from "./bird";

let $ = require('jquery');

let population = 0;
let pipes = [];
let birds = [];
let player = null;

export default class SketchWrapper extends Component {
    constructor(props){
        super(props);
        this.state = {
            play_along: props.play_along,
            running: true,
            number_of_birds: 0
        }
    }

    componentDidMount() {
        this.setState({number_of_birds:this.props.number_of_birds});
    }

    reset = (p5) => {
        p5.frameCount = 0;
        pipes = [];
        birds = [];
        player = new Bird(p5, true);
        for(let i = 0; i < this.state.number_of_birds; i++){
            birds.push(new Bird(p5));
        }
        pipes.push(new Pipe(p5));
    };

    setup = (p5, canvasParentRef) => {
        p5.createCanvas(WIDTH, HEIGHT).parent(canvasParentRef)
        p5.frameRate(FRAME_RATE);
        this.reset(p5);
    };

    is_dead = p5 => {
        let dead = 0;
        for(let i = 0; i < birds.length; i++){
            if (birds[i].dead) {
                dead++;
            }
        }
        if(dead === birds.length){
            return true;
        } else {
            return false;
        }
    };

    draw = p5 => {
        if(!this.state.running){
            return;
        }

        p5.clear();
        p5.background(0);

        for (let i = pipes.length-1; i >= 0; i--) {
            pipes[i].show();
            pipes[i].update();

            for(let j = birds.length - 1; j>=0;j--){
                if (pipes[i].hits(birds[j])) {
                    birds[j].dead = true;
                }
            }

            if(this.state.play_along && pipes[i].hits(player)){
                player.dead = true;
            }

            if (pipes[i].offscreen()) {
                pipes.splice(i, 1);
            }
        }

        for(let i = 0; i < birds.length; i++){
            birds[i].think(pipes);
            birds[i].update();
            birds[i].show();
        }

        if(this.state.play_along){
            player.update();
            player.show();
        }

        if (p5.frameCount % PIPE_FREQ === 0) {
            pipes.push(new Pipe(p5));
        }

        if(this.is_dead(p5)){
            this.reset(p5);
        }
    };

    keyPressed = p5 => {
        if (this.state.play_along && p5.key === ' ') {
            player.up();
        }

        if (p5.key === 'p') {
            this.state.running = !this.state.running;
        }
    };

    render() {
        return <Sketch setup={this.setup} draw={this.draw} keyPressed={this.keyPressed} />
    };
}
