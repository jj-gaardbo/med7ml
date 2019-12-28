import React, { Component } from 'react'

let $ = require('jquery');

export default class API{
    static get_number_of_birds(callback) {
        console.log("HERE");
        $.get(window.location.href + 'get_count', (resp) => {
            console.log("Response: "+resp);
            callback(parseInt(resp));
        });
    }
}
