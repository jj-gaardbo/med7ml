import React, { Component } from 'react'
import {AVG_SCORE, GENERATION, MAX_FITNESS, set_alive_count} from "./constants";

let $ = require('jquery');

let url = window.location.href;
let debug = true;

if(debug){
    url = "http://127.0.0.1:5000/";
}

export default class API{
    static get_number_of_birds(callback) {
        $.get(url + 'get_count', (resp) => {
            set_alive_count(parseInt(resp));
            callback(parseInt(resp));
        });
    }

    static get_predictions(birds, bird_states, pipes, pipe_states, callback){
        $.get(url + 'predictions?bird_states='+JSON.stringify(bird_states)+'&pipe_states='+JSON.stringify(pipe_states), (resp) => {
            callback(resp);
            for(let i = 0; i < birds.length; i++){
                birds[i].prediction = resp[i][0];
            }
        });
    };

    static get_next_generation(callback){
        console.log("Next");
        $.get(url + 'get_next_generation', (resp) => {
            callback(resp);
        });
    }

    static get_info(callback){
        $.get(url + 'get_info', (resp) => {
            GENERATION.push(parseInt(resp[0]));

            let max_fitness = parseFloat(resp[2]);
            MAX_FITNESS.push(max_fitness*100);

            let avg_score = parseFloat(resp[4]);
            AVG_SCORE.push(avg_score);


            if(MAX_FITNESS.length > 500){
                MAX_FITNESS.splice(0, 1);
            }

            if(AVG_SCORE.length > 500){
                AVG_SCORE.splice(0, 1);
            }

            if(GENERATION.length > 500){
                GENERATION.splice(0, 1);
            }
            callback(resp);
        });
    }

    static is_ready(callback){
        $.get(url + 'is_ready', (resp) => {
            callback((resp === "True"));
        });
    }

}
