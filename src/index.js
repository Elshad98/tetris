import Game from './js/game';
import View from './js/view';

import 'reset-css';
import './css/main.css';

const element = document.getElementById('root');

const game = new Game();
const view = new View(element, 480, 640, 20, 10);

window.game = game;
window.view = view;