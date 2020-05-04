import Game from './js/game';
import View from './js/view';
import Controller from './js/controller';

import 'reset-css';
import './css/main.css';

const element = document.getElementById('root');

const game = new Game();
const view = new View(element, 480, 640, 20, 10);
const controller = new Controller(game, view);

window.game = game;
window.view = view;
window.controller = controller;