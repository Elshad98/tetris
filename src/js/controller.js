import { KEYS, DEFAULT_INTERVAL, MAX_UPDATE_INTERVAL, MIN_UPDATE_INTERVAL } from './constants';

class Controller {

    constructor(game, view, buttons) {
        this.game = game;
        this.view = view;
        this.buttons = buttons;
        this.intervalId = null;
        this.isPlaying = false;
        this.interval = null;

        this.addEventListener();
        this.view.renderStartScreen();
    }

    addEventListener() {
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));
        this.buttons.left.addEventListener('mouseup', this.stopMove.bind(this));
        this.buttons.left.addEventListener('mousedown', this.startMoveLeft.bind(this));
        this.buttons.right.addEventListener('mouseup', this.stopMove.bind(this));
        this.buttons.right.addEventListener('mousedown', this.startMoveRight.bind(this));
        this.buttons.pause.addEventListener('mousedown', this.togglePlayPause.bind(this));
        this.buttons.reset.addEventListener('mousedown', this.reset.bind(this));
        this.buttons.rotation.addEventListener('mouseup', this.stopMove.bind(this));
        this.buttons.rotation.addEventListener('mousedown', this.startRotation.bind(this));
        this.buttons.down.addEventListener('mouseup', this.endMoveDown.bind(this));
        this.buttons.down.addEventListener('mousedown', this.startMoveDown.bind(this));
        this.buttons.drop.addEventListener('mousedown', this.startDrop.bind(this));
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
        this.stopTimer();
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
        if (this.isPlaying) {
            this.game.movePieceLeft();
            this.updateView();
        }
    }

    startMoveLeft() {
        this.interval = setInterval(() => {
            this.onLeft();
        }, DEFAULT_INTERVAL);
    }

    onRight() {
        if (this.isPlaying) {
            this.game.movePieceRight();
            this.updateView();
        }
    }

    startMoveRight() {
        this.interval = setInterval(() => {
            this.onRight();
        }, DEFAULT_INTERVAL);
    }

    onUp() {
        if (this.isPlaying) {
            this.game.rotatePiece();
            this.updateView();
        }
    }

    startRotation() {
        this.interval = setInterval(() => {
            this.onUp();
        }, DEFAULT_INTERVAL);
    }

    onDown() {
        if (this.isPlaying) {
            this.stopTimer();
            this.game.movePieceDown();
            this.updateView();
        }
    }

    startMoveDown() {
        this.interval = setInterval(() => {
            this.onDown();
        }, DEFAULT_INTERVAL);
    }

    endMoveDown() {
        if (this.isPlaying) {
            this.startTimer();
        }
        this.stopMove();
    }

    startDrop() {
        if (this.isPlaying) {
            this.game.dropDown();
            this.updateView();
        }
    }

    stopMove() {
        clearInterval(this.interval);
    }

    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    handleKeyDown({ keyCode }) {
        if (keyCode === KEYS.R) {
            this.reset();
        } else if (keyCode === KEYS.P) {
            this.pause();
        } else if (keyCode === KEYS.LEFT) {
            this.onLeft();
        } else if (keyCode === KEYS.UP) {
            this.onUp();
        } else if (keyCode === KEYS.RIGHT) {
            this.onRight();
        } else if (keyCode === KEYS.DOWN) {
            this.onDown();
        }
    }

    handleKeyUp({ keyCode }) {
        if (keyCode === KEYS.DOWN) {
            this.endMoveDown();
        } else if (keyCode === KEYS.UP || keyCode === KEYS.LEFT || keyCode === KEYS.RIGHT) {
            this.stopMove();
        }
    }
}

export default Controller;