import Game from './js/game';
import View from './js/view';

import 'reset-css';
import './css/main.css';

const element = document.getElementById('root');

const game = new Game();
const view = new View(element, 320, 640, 20, 10);

window.game = game;
window.view = view;

document.addEventListener('keydown', event => {
    switch (event.keyCode) {
        case 37: // LEFT ARROW
            game.movePieceLeft();
            view.render(game.getState());
            break;
        case 38: // UP ARROW
            game.rotatePiece();
            view.render(game.getState());
            break;
        case 39: //  RIGHT ARROW
            game.movePieceRight();
            view.render(game.getState());
            break;
        case 40: //  DOWN ARROW
            game.movePieceDown();
            view.render(game.getState());
            break;
    }
});