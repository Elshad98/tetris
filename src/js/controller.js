import CONFIG from "../config";

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
        const speed = 800 - this.game.getState().level * 100;

        if (!this.intervalId) {
            this.intervalId = setInterval(() => {
                this.update();
            }, speed >= 400 ? speed : 400);
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

    handleKeyDown(event) {
        const state = this.game.getState();
        const { keyCode } = event;

        if (keyCode === CONFIG.keys.ENTER) {
            if (state.isGameOver) {
                this.reset();
            } else if (this.isPlaying) {
                this.pause();
            } else {
                this.play();
            }
        }

        if (!this.isPlaying) {
            return;
        }

        if (keyCode === CONFIG.keys.LEFT) {
            this.game.movePieceLeft();
            this.updateView();
        } else if (keyCode === CONFIG.keys.UP) {
            this.game.rotatePiece();
            this.updateView();
        } else if (keyCode === CONFIG.keys.RIGHT) {
            this.game.movePieceRight();
            this.updateView();
        } else if (keyCode === CONFIG.keys.DOWN) {
            this.stopTimer();
            this.game.movePieceDown();
            this.updateView();
        }
    }

    handleKeyUp(event) {
        const { keyCode } = event;

        if (keyCode === CONFIG.keys.DOWN && this.isPlaying) {
            this.startTimer();
        }
    }
}

export default Controller;