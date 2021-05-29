import { KEYS, MAX_UPDATE_INTERVAL, MIN_UPDATE_INTERVAL } from './constants';

class Controller {

    constructor(game, view) {
        this.game = game;
        this.view = view;
        this.intervalId = null;
        this.isPlaying = false;

        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));
        window.addEventListener('blur', this.pause.bind(this));
        this.view.renderStartScreen();
    }

    update() {
        this.game.movePieceDown();
        this.updateView();
    }

    play() {
        this.isPlaying = true;
        this.startTimer();
        this.updateView();
    }

    pause() {
        if (typeof this.intervalId === 'number') {
            this.isPlaying = false;
            this.stopTimer();
            this.updateView();
        }
    }

    reset() {
        this.game.reset();
        this.play();
    }

    startTimer() {
        if (!this.intervalId) {
            const speed = MAX_UPDATE_INTERVAL - (this.game.getState().level * 100);
            const ms = (speed >= MIN_UPDATE_INTERVAL) ? speed : MIN_UPDATE_INTERVAL;

            this.intervalId = setInterval(() => {
                this.update();
            }, ms);
        }
    }

    stopTimer() {
        if (typeof this.intervalId === 'number') {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    updateView() {
        const state = this.game.getState();

        if (state.isGameOver) {
            this.view.renderEndScreen(state);
        } else if (this.isPlaying) {
            this.view.renderMainScreen(this.game.getState());
        } else {
            this.view.renderPauseScreen();
        }
    }

    onLeft() {
        this.game.movePieceLeft();
        this.updateView();
    }

    onRight() {
        this.game.movePieceRight();
        this.updateView();
    }

    onUp() {
        this.game.rotatePiece();
        this.updateView();
    }

    onDown() {
        this.stopTimer();
        this.game.movePieceDown();
        this.updateView();
    }

    changeView() {
        if (this.game.getState().isGameOver) {
            this.reset();
        } else if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    handleKeyDown({ keyCode }) {
        if (keyCode === KEYS.ENTER) {
            this.changeView();
        }
        if (this.isPlaying) {
            if (keyCode === KEYS.LEFT) {
                this.onLeft();
            } else if (keyCode === KEYS.UP) {
                this.onUp();
            } else if (keyCode === KEYS.RIGHT) {
                this.onRight();
            } else if (keyCode === KEYS.DOWN) {
                this.onDown();
            }
        }
    }

    handleKeyUp({ keyCode }) {
        if ((keyCode === KEYS.DOWN) && this.isPlaying) {
            this.startTimer();
        }
    }
}

export default Controller;