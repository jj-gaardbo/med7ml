import React, { Component } from 'react'
import {GENERATION, MAX_FITNESS} from "./constants";

let $ = require('jquery');

let url = window.location.href;
let debug = true;

if(debug){
    url = "http://127.0.0.1:5000/";
}

export default class API{
    static get_number_of_birds(callback) {
        $.get(url + 'get_count', (resp) => {
            callback(parseInt(resp));
        });
    }

    static get_predictions(is_ready, birds, bird_states, pipes, pipe_states, callback){
        if(!is_ready){
            return;
        }
        $.get(url + 'predictions?bird_states='+JSON.stringify(bird_states)+'&pipe_states='+JSON.stringify(pipe_states), (resp) => {
            if(resp == "Warning"){
                return;
            }
            for(let i = 0; i < birds.length; i++){
                birds[i].prediction = resp[i][0];
            }
        }).done(function(resp){
            callback()
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
            let max_fitness = parseFloat(resp[1]);
            MAX_FITNESS.push(max_fitness);
            GENERATION.push(parseInt(resp[0]));

            if(MAX_FITNESS.length > 200){
                MAX_FITNESS.splice(0, 1);
            }

            if(GENERATION.length > 200){
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
