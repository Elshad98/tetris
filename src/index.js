import Game from './js/game';
import View from './js/view';
import Sound from './js/sound';
import Controller from './js/controller';

import './sounds/drop.mp3';
import './sounds/reset.mp3';
import './sounds/clear.mp3';
import './sounds/moves.mp3';
import './sounds/pause.mp3';
import './sounds/finish.mp3';

import 'reset-css';
import './css/main.css';

window.addEventListener('load', () => {
    const rootEl = document.getElementById('root');
    const element = document.querySelector('.game-screen');
    const gameControls = document.querySelector('.game-controls');

    const sound = new Sound(rootEl);
    const game = new Game(sound);
    const view = new View(element);
    const controller = new Controller(game, view, sound);

    const transform = (() => {
        const trans = ['transform', 'webkitTransform', 'msTransform', 'mozTransform', 'oTransform'];
        const body = document.body;
        return trans.filter(element => body.style[element] !== undefined)[0];
    })();

    const resize = () => {
        const width = document.documentElement.clientWidth;
        const height = document.documentElement.clientHeight;
        const ratio = height / width;
        let scale;
        if (ratio < 1.5) {
            rootEl.style.paddingTop = `42px`;
            gameControls.style.marginTop = `25px`;
            scale = height / 960;
        } else {
            scale = width / 640;
            const filling = (height - (960 * scale)) / scale / 3;
            gameControls.style.marginTop = `${filling + 25}px`;
            rootEl.style.paddingTop = `${Math.floor(filling) + 42}px`;
            rootEl.style.paddingBottom = `${Math.floor(filling)}px`;
            rootEl.style.marginTop = `${Math.floor(-480 - (filling * 1.5))}px`;
        }
        rootEl.style[transform] = `scale(${scale})`;
    }

    resize();

    window.addEventListener('resize', resize);
});