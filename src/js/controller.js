import { KEYS, DEFAULT_INTERVAL, MAX_UPDATE_INTERVAL, MIN_UPDATE_INTERVAL } from './constants';

class Controller {

    constructor(game, view) {
        this.game = game;
        this.view = view;
        this.interval = null;
        this.intervalId = null;
        this.isPlaying = false;
        this.isMouseDownEvent = false;
        this.isTouchStartEvent = false;

        this.addEventListeners();
        this.view.renderStartScreen();
    }

    addEventListeners() {
        window.addEventListener('blur', this.pause.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('contextmenu', (evt) => {
            if (evt.preventDefault) {
                evt.preventDefault();
            }
        });
        document.addEventListener('touchstart', (evt) => {
            if (evt.preventDefault) {
                evt.preventDefault();
            }
        }, true);
        document.addEventListener('touchend', (evt) => {
            if (evt.preventDefault) {
                evt.preventDefault();
            }
        }, true);
        document.addEventListener('gesturestart', (evt) => {
            if (evt.preventDefault) {
                event.preventDefault();
            }
        });
        document.addEventListener('mousedown', (evt) => {
            if (evt.preventDefault) {
                evt.preventDefault();
            }
        }, true);

        this.onMouseDown(document.querySelector('.left-button'), this.startMoveLeft.bind(this));
        this.onMouseUp(document.querySelector('.left-button'), this.stopMove.bind(this));
        this.onMouseDown(document.querySelector('.right-button'), this.startMoveRight.bind(this));
        this.onMouseUp(document.querySelector('.right-button'), this.stopMove.bind(this));
        this.onMouseDown(document.querySelector('.pause-button'), this.togglePlayPause.bind(this));
        this.onMouseDown(document.querySelector('.reset-button'), this.reset.bind(this));
        this.onMouseDown(document.querySelector('.rotation-button'), this.startRotation.bind(this));
        this.onMouseUp(document.querySelector('.rotation-button'), this.stopMove.bind(this));
        this.onMouseDown(document.querySelector('.down-button'), this.startMoveDown.bind(this));
        this.onMouseUp(document.querySelector('.down-button'), this.endMoveDown.bind(this));
        this.onMouseDown(document.querySelector('.drop-button'), this.startDrop.bind(this));
    }

    onMouseDown(button, callback) {
        button.addEventListener('mousedown', () => {
            if (this.isTouchStartEvent) {
                this.isTouchStartEvent = false;
                return;
            }
            callback();
            this.isMouseDownEvent = true;
        }, true);

        button.addEventListener('touchstart', () => {
            this.isTouchStartEvent = true;
            callback();
        }, true);
    }

    onMouseUp(button, callback) {
        button.addEventListener('mouseup', () => {
            if (this.isTouchStartEvent) {
                this.isTouchStartEvent = false;
                return;
            }
            callback();
            this.isMouseDownEvent = true;
        }, true);

        button.addEventListener('touchend', callback, true);
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
            this.stopMove();
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
        this.startMove(this.onLeft.bind(this));
    }

    onRight() {
        if (this.isPlaying) {
            this.game.movePieceRight();
            this.updateView();
        }
    }

    startMoveRight() {
        this.startMove(this.onRight.bind(this));
    }

    onUp() {
        if (this.isPlaying) {
            this.game.rotatePiece();
            this.updateView();
        }
    }

    startRotation() {
        this.startMove(this.onUp.bind(this));
    }

    startMove(callback) {
        callback();
        this.interval = setInterval(() => {
            callback();
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
        this.startMove(this.onDown.bind(this));
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
            this.togglePlayPause();
        } else if (keyCode === KEYS.LEFT) {
            this.onLeft();
        } else if (keyCode === KEYS.UP) {
            this.onUp();
        } else if (keyCode === KEYS.RIGHT) {
            this.onRight();
        } else if (keyCode === KEYS.DOWN) {
            this.onDown();
        } else if (keyCode === KEYS.SPACE) {
            this.startDrop();
        }
    }

    handleKeyUp({ keyCode }) {
        if (keyCode === KEYS.DOWN) {
            this.endMoveDown();
        }
    }
}

export default Controller;