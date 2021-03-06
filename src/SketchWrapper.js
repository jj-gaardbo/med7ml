import React, { Component } from 'react'
import Sketch from 'react-p5'
import {
    WIDTH,
    HEIGHT,
    PIPE_FREQ,
    FRAME_RATE,
    CTX,
    GENERATION,
    MAX_FITNESS,
    set_alive_count, get_alive_count, AVG_SCORE, ALIVE_COUNT
} from "./constants";
import {Pipe} from "./pipe";
import {Bird} from "./bird";
import API from "./API";
import Chart from "chart.js"

let $ = require('jquery');

export default class SketchWrapper extends Component {
    constructor(props){
        super(props);
        this.state = {
            is_ready:false,
            p5:null,
            intervalID: 0,
            timeout: 500,
            running: false,
            number_of_birds: 0,
            birds: [],
            bird_states: [],
            pipes: [],
            pipe_states: [],
            has_prediction: false,
            predicting: false,
            chart: null
        };

        this.handle_number_of_birds = this.handle_number_of_birds.bind(this);
        this.prepare = this.prepare.bind(this);
        this.clear = this.clear.bind(this);
        this.predict = this.predict.bind(this);
        this.is_ready = this.is_ready.bind(this);
        this.is_ready_cb = this.is_ready_cb.bind(this);
        this.handle_info = this.handle_info.bind(this);
        this.prediction_received = this.prediction_received.bind(this);
    }

    predict(callback){
        this.setState({has_prediction:false, predicting: true});
        API.get_predictions(this.state.birds, this.state.bird_states, this.state.pipes, this.state.pipe_states, callback);
    }

    prediction_received(resp){
        if($.isArray(resp)){
            this.setState({has_prediction:true, predicting:false});
        }
    }

    clear(){
        clearInterval(this.state.intervalID);
        this.state.intervalID = 0;
    };

    handle_number_of_birds(number_of_birds){
        this.setState({number_of_birds:number_of_birds});
    }

    create_birds(){
        for(let i = 0; i < this.state.number_of_birds; i++){
            this.state.birds.push(new Bird(this.state.p5));
        }
    }

    create_pipes(){
        this.state.pipes.push(new Pipe(this.state.p5));
    }

    is_ready_cb(resp){
        this.state.is_ready = resp;
        if(resp){
            API.get_info(this.handle_info);
            this.prepare();
        }
    }

    is_ready(resp){
        let self = this;
        self.state.is_ready = false;
        this.state.intervalID = setInterval(function(){
            API.is_ready(self.is_ready_cb);
        }, this.state.timeout);
    }

    prepare(first = false){
        let self = this;
        self.clear();
        this.state.intervalID = setInterval(function(){
            if(self.state.number_of_birds === 0){
                API.get_number_of_birds(self.handle_number_of_birds);
                return;
            }

            set_alive_count(self.state.number_of_birds);

            if(self.state.birds.length === 0){
                self.create_birds();
                return;
            }

            if(self.state.pipes.length === 0){
                self.create_pipes();
                return;
            }

            self.update_objects(first);

            if(self.state.bird_states.length === 0 && self.state.pipe_states.length === 0){
                self.update_states();
            }

            if(!self.state.has_prediction && !self.state.predicting){
                self.predict(self.prediction_received);
                return;
            }

            if(self.state.predicting){
                return;
            }

            self.run();
            self.clear();

        }, this.state.timeout);
    }

    run(){
        this.setState({is_ready:true,running:true});
    }

    stop(){
        this.setState({is_ready:false,running:false,birds:[],pipes:[],bird_states:[],pipe_states:[], has_prediction: false});
    }

    componentDidMount() {
        this.handle_info();
        this.prepare(true);
    }

    setup = (p5, canvasParentRef) => {
        this.setState({p5:p5});
        p5.createCanvas(WIDTH, HEIGHT).parent(canvasParentRef)
        p5.frameRate(FRAME_RATE);
    };

    is_dead = () => {
        let dead = 0;
        for(let i = 0; i < this.state.birds.length; i++){
            if (this.state.birds[i].dead) {
                dead++;
            }
        }
        set_alive_count(this.state.number_of_birds-dead);
        this.props.count(get_alive_count());
        if(dead === this.state.birds.length){
            return true;
        } else {
            return false;
        }
    };

    update_objects = (first = false) => {
        for (let i = this.state.pipes.length-1; i >= 0; i--) {
            this.state.pipes[i].show();

            if(!first){
                this.state.pipes[i].update();
            }

            for(let j = this.state.birds.length - 1; j>=0;j--){
                if (this.state.pipes[i].hits(this.state.birds[j])) {
                    this.state.birds[j].dead = true;
                }
            }

            if (this.state.pipes[i].offscreen()) {
                this.state.pipes.splice(i, 1);
            }
        }

        for(let i = 0; i < this.state.birds.length; i++){
            this.state.birds[i].think(this.state.pipes);
            this.state.birds[i].show();
            if(!first){
                this.state.birds[i].update();
            }
        }
    };

    update_states = () => {
        this.state.bird_states = [];
        this.state.pipe_states = [];

        for(let i = 0; i < this.state.birds.length; i++){
            let middle = this.state.birds[i].closest.middle/HEIGHT;
            let difference = (this.state.birds[i].closest.middle-this.state.birds[i].y)/HEIGHT;
            this.state.pipe_states = [middle, difference];
            this.state.bird_states.push([(this.state.birds[i].dead ? 0 : 1), this.state.birds[i].y/HEIGHT, this.state.birds[i].score]);
        }
    };

    handle_info(info){
        this.state.chart = new Chart(CTX, {
            type: 'line',
            data: {
                labels: GENERATION,
                datasets: [{
                    label: 'Max Fitness',
                    data: MAX_FITNESS,
                    lineTension: 0,
                    backgroundColor: "rgba(255,11,11,0.5)"
                },
                {
                    label: 'Avg Score',
                    data: AVG_SCORE,
                    lineTension: 0,
                    backgroundColor: "rgba(255,155,11,0.1)"
                }]
            }
        });
        this.state.chart.update();
        this.props.info(info);
    }

    draw = p5 => {
        p5.clear();

        if(!this.state.running){
            p5.frameCount = 0;
            return;
        }

        if (p5.frameCount % PIPE_FREQ === 0) {
            this.state.pipes.push(new Pipe(p5));
        }

        this.props.count(get_alive_count());

        if(this.is_dead()){
            this.stop();
            API.get_next_generation(this.is_ready);
            return;
        }

        this.update_objects();
        this.update_states();
        this.predict(this.prediction_received);

    };

    keyPressed = p5 => {
        if (p5.key === 'p') {
            this.state.running = !this.state.running;
        }
    };

    render() {
        return <Sketch setup={this.setup} draw={this.draw} keyPressed={this.keyPressed} />
    };
}
