import Game from './js/game';
import View from './js/view';
import Controller from './js/controller';
import { WIDTH, HEIGHT, COLUMNS, ROWS, } from './js/constants';

import 'reset-css';
import './css/main.css';

const rootEl = document.getElementById('root');
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

const transform = (function () {
    const trans = ['transform', 'webkitTransform', 'msTransform', 'mozTransform', 'oTransform'];
    const body = document.body;
    return trans.filter((e) => body.style[e] !== undefined)[0];
})();

function resize() {
    const width = document.documentElement.clientWidth;
    const height = document.documentElement.clientHeight;
    const ratio = height / width;
    let scale;
    rootEl.style.paddingTop = `42px`;
    if (ratio < 1.5) {
        scale = height / 960;
    } else {
        scale = width / 640;
        let filling = (height - (960 * scale)) / scale / 3;
        rootEl.style.paddingTop = `${Math.floor(filling) + 42}px`;
        rootEl.style.paddingBottom = `${Math.floor(filling)}px`;
        rootEl.style.marginTop = `${Math.floor(-480 - (filling * 1.5))}px`;
    }
    rootEl.style[transform] = `scale(${scale})`;
}

resize();

window.addEventListener('resize', resize);