export const FRAME_RATE = 20;
export const GAME_SPEED = 25;
export const PIPE_FREQ = 40;
export let WIDTH = 1500;
export let HEIGHT = 840;
export let MAX_FITNESS = [];
export let GENERATION = [];
export let CTX = document.getElementById('myChart').getContext('2d');
export let ALIVE_COUNT = 0;

export function set_alive_count(count){
    ALIVE_COUNT=count;
}

export function get_alive_count(){
    return ALIVE_COUNT;
}
