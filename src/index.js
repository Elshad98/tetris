import Game from './js/game';
import View from './js/view';
import Controller from './js/controller';
import APP_CONFIG from './js/config';

import 'reset-css';
import './css/main.css';

window.addEventListener('load', function() {
    const element = document.getElementById('root');
    const { width, height, columns, rows } = APP_CONFIG.playField;

    const game = new Game();
    const view = new View(element, width, height, rows, columns);
    const controller = new Controller(game, view);
});