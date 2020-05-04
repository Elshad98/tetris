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
        this.isPlaying = false;
        this.stopTimer();
        this.updateView();
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
            }, speed > 400 ? speed : 400);
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
        switch (event.keyCode) {
            case 13: // ENTER
                if (state.isGameOver) {
                    this.reset();
                } else if (this.isPlaying) {
                    this.pause();
                } else {
                    this.play();
                }
                break;
            case 37: // LEFT ARROW
                this.game.movePieceLeft();
                this.updateView();
                break;
            case 38: // UP ARROW
                this.game.rotatePiece();
                this.updateView();
                break;
            case 39: //  RIGHT ARROW
                this.game.movePieceRight();
                this.updateView();
                break;
            case 40: //  DOWN ARROW
                this.stopTimer();
                this.game.movePieceDown();
                this.updateView();
                break;
        }
    }

    handleKeyUp(event) {
        switch (event.keyCode) {
            case 40: //  DOWN ARROW
                this.startTimer();
                break;
        }
    }
}

export default Controller;