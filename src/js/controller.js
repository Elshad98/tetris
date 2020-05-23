import CONFIG from "../config";

class Controller {
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
        // view.canvas.addEventListener('click', this.handleClick.bind(this));
        document.addEventListener('touchstart', this.handleTouchStart.bind(this));
        document.addEventListener('touchmove', this.handleTouchMove.bind(this));
        document.addEventListener('touchend', this.handleTouchEnd.bind(this));
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

    handleTouchStart(evt) {
        this.handleMouseDown();
        const firstTouch = evt.touches[0];
        this.xDown = firstTouch.clientX;
        this.yDown = firstTouch.clientY;
    };

    handleTouchMove(evt) {
        if (!this.xDown || !this.yDown) {
            return;
        }

        var xUp = evt.touches[0].clientX;
        var yUp = evt.touches[0].clientY;

        var xDiff = this.xDown - xUp;
        var yDiff = this.yDown - yUp;

        if (Math.abs(xDiff) > Math.abs(yDiff)) {
            if (xDiff > 0) {
                this.onLeftSwipe();
            } else {
                this.onRightSwipe();
            }
        } else {
            if (yDiff > 0) {
                this.onUpSwipe();
            }
        }

        this.xDown = null;
        this.yDown = null;
    };

    onLeftSwipe() {
        if (this.isPlaying) {
            this.game.movePieceLeft();
            this.updateView();
        }
    }

    onRightSwipe() {
        if (this.isPlaying) {
            this.game.movePieceRight();
            this.updateView();
        }
    }

    onUpSwipe() {
        if (this.isPlaying) {
            this.game.rotatePiece();
            this.updateView();
        }
    }

    onDown() {
        this.stopTimer();
        this.game.movePieceDown();
        this.updateView();
    }

    handleClick() {
        const state = this.game.getState();
        if (state.isGameOver) {
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

    handleTouchEnd(evt) {
        evt.preventDefault();
        this.handleMouseUp();
    }

    handleMouseUp() {
        clearInterval(this.interval);
        this.interval = null;
        this.startTimer();
    }

    handleKeyDown(evt) {
        const { keyCode } = evt;
        if (keyCode === CONFIG.keys.ENTER) {
            const state = this.game.getState();
            if (state.isGameOver) {
                this.reset();
            } else if (this.isPlaying) {
                this.pause();
            } else {
                this.play();
            }
        } else if (keyCode === CONFIG.keys.LEFT) {
            this.onLeftSwipe();
        } else if (keyCode === CONFIG.keys.UP) {
            this.onUpSwipe();
        } else if (keyCode === CONFIG.keys.RIGHT) {
            this.onRightSwipe();
        } else if (keyCode === CONFIG.keys.DOWN) {
            this.handleMouseDown();
        }
    }

    handleKeyUp(evt) {
        const { keyCode } = evt;
        if (keyCode === CONFIG.keys.DOWN && this.isPlaying) {
            this.startTimer();
        }
    }
}

export default Controller;