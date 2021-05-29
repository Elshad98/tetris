class Controller {

    static KEYS = {
        RIGHT: 39,
        LEFT: 37,
        UP: 38,
        DOWN: 40,
        ENTER: 13,
    };

    static MAX_UPDATE_INTERVAL = 800;
    static MIN_UPDATE_INTERVAL = 200;

    constructor(game, view) {
        this.game = game;
        this.view = view;
        this.intervalId = null;
        this.isPlaying = false;
        this.xDown = null;
        this.yDown = null;
        this.interval = null;

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
            const speed = Controller.MAX_UPDATE_INTERVAL - (this.game.getState().level * 100);
            const ms = (speed >= Controller.MIN_UPDATE_INTERVAL) ? speed : Controller.MIN_UPDATE_INTERVAL;

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

    handleMouseDown() {
        if (this.isPlaying && !this.interval) {
            this.interval = setInterval(() => {
                this.onDown();
            }, 100);
        }
    }

    handleMouseUp() {
        clearInterval(this.interval);
        this.interval = null;
        this.startTimer();
    }

    handleKeyDown({ keyCode }) {
        if (keyCode === Controller.KEYS.ENTER) {
            this.changeView();
        }
        if (this.isPlaying) {
            if (keyCode === Controller.KEYS.LEFT) {
                this.onLeft();
            } else if (keyCode === Controller.KEYS.UP) {
                this.onUp();
            } else if (keyCode === Controller.KEYS.RIGHT) {
                this.onRight();
            } else if (keyCode === Controller.KEYS.DOWN) {
                this.onDown();
            }
        }
    }

    handleKeyUp({ keyCode }) {
        if ((keyCode === Controller.KEYS.DOWN) && this.isPlaying) {
            this.startTimer();
        }
    }
}

export default Controller;