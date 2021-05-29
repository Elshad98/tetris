import Game from './js/game';
import View from './js/view';
import Controller from './js/controller';
import { WIDTH, HEIGHT, COLUMNS, ROWS, } from './js/constants';

import 'reset-css';
import './css/main.css';

window.addEventListener('load', function() {
    const element = document.getElementById('root');

    const game = new Game();
    const view = new View(element, WIDTH, HEIGHT, ROWS, COLUMNS);
    const controller = new Controller(game, view);
});