import Game from './js/game';
import View from './js/view';
import Controller from './js/controller';
import { WIDTH, HEIGHT, COLUMNS, ROWS, } from './js/constants';

import 'reset-css';
import './css/main.css';

window.addEventListener('load', function() {
    const element = document.querySelector('.game-screen');

    const game = new Game();
    const view = new View(element, WIDTH, HEIGHT, ROWS, COLUMNS);
    const controller = new Controller(game, view, {
        left: document.querySelector('.left-button'),
        drop: document.querySelector('.drop-button'),
        down: document.querySelector('.down-button'),
        right: document.querySelector('.right-button'),
        pause: document.querySelector('.pause-button'),
        reset: document.querySelector('.reset-button'),
        rotation: document.querySelector('.rotation-button')
    });
});