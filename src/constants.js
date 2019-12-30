export const FRAME_RATE = 15;
export const GAME_SPEED = 25;
export const PIPE_FREQ = 40;
export let WIDTH = 1500;
export let HEIGHT = 840;
export let MAX_FITNESS = [0];
export let AVG_SCORE = [0];
export let GENERATION = [1];
export let CTX = document.getElementById('myChart').getContext('2d');
export let ALIVE_COUNT = 0;

export function set_alive_count(count){
    ALIVE_COUNT=count;
}

export function get_alive_count(){
    return ALIVE_COUNT;
}
