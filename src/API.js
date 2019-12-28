import React, { Component } from 'react'

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

    static get_predictions(is_ready, birds, bird_states, pipes, pipe_states){
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
        });
    };

    static get_next_generation(callback){
        console.log("Next");
        $.get(url + 'get_next_generation', (resp) => {
            callback(resp);
        });
    }

    static is_ready(callback){
        $.get(url + 'is_ready', (resp) => {
            callback((resp === "True"));
        });
    }

}
