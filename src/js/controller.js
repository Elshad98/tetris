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
        document.addEventListener('click', this.handleClick.bind(this));
        this.view.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.view.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
        this.view.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
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
        if (evt.preventDefault && evt.cancelable) {
            evt.preventDefault();
        } else if (evt.returnValue && evt.cancelable) {
            evt.returnValue = false
        }
        evt.stopPropagation();
        if (this.isPlaying) {
            this.handleMouseDown();
            const firstTouch = evt.touches[0];
            this.xDown = firstTouch.clientX;
            this.yDown = firstTouch.clientY;
        }
    };

    handleTouchMove(evt) {
        if (evt.preventDefault && evt.cancelable) {
            evt.preventDefault();
        } else if (evt.returnValue && evt.cancelable) {
            evt.returnValue = false
        }
        evt.stopPropagation();
        if ((!this.xDown || !this.yDown) && !this.isPlaying) {
            return;
        }

        var xUp = evt.touches[0].clientX;
        var yUp = evt.touches[0].clientY;

        var xDiff = this.xDown - xUp;
        var yDiff = this.yDown - yUp;

        if (Math.abs(xDiff) > Math.abs(yDiff)) {
            if (xDiff > 0) {
                this.onLeft();
            } else {
                this.onRight();
            }
        } else {
            if (yDiff > 0) {
                this.onUp();
            }
        }

        this.xDown = null;
        this.yDown = null;
    };

    onLeft() {
        if (this.isPlaying) {
            this.game.movePieceLeft();
            this.updateView();
        }
    }

    onRight() {
        if (this.isPlaying) {
            this.game.movePieceRight();
            this.updateView();
        }
    }

    onUp() {
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
        if (evt.preventDefault && evt.cancelable) {
            evt.preventDefault();
        } else if (evt.returnValue && evt.cancelable) {
            evt.returnValue = false
        }
        evt.stopPropagation();
        if (this.isPlaying) {
            this.handleMouseUp();
        }
    }

    handleMouseUp() {
        clearInterval(this.interval);
        this.interval = null;
        this.startTimer();
    }

    handleKeyDown(evt) {
        const { keyCode } = evt;
        if (keyCode === CONFIG.keys.ENTER) {
            this.handleClick();
        } else if (keyCode === CONFIG.keys.LEFT) {
            this.onLeft();
        } else if (keyCode === CONFIG.keys.UP) {
            this.onUp();
        } else if (keyCode === CONFIG.keys.RIGHT) {
            this.onRight();
        } else if (keyCode === CONFIG.keys.DOWN) {
            this.onDown();
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