import { COLORS, WIDTH, HEIGHT, COLUMNS, ROWS } from './constants';

class View {

    constructor(element) {
        this.element = element;

        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.canvas.width = WIDTH;
        this.canvas.height = HEIGHT;

        this.playfieldBorderWidth = 4;
        this.playfieldWidth = Math.floor(WIDTH * 0.64);
        this.playfieldHeight = HEIGHT;
        this.playfieldInnerWidth = this.playfieldWidth;
        this.playfieldInnerHeight = this.playfieldHeight;

        this.blockWidth = Math.floor(this.playfieldInnerWidth / COLUMNS);
        this.blockHeight = Math.floor(this.playfieldInnerHeight / ROWS);

        this.panelX = this.playfieldWidth + 10;
        this.panelY = 0;
        this.panelWidth = Math.floor(WIDTH * 0.36);
        this.panelHeight = HEIGHT;

        this.element.appendChild(this.canvas);
    }

    renderMainScreen(state) {
        this.clearScreen();
        this.renderPlayfield(state);
        this.renderPanel(state);
    }

    clearScreen() {
        this.context.clearRect(0, 0, WIDTH, HEIGHT);
    }

    renderStartScreen() {
        this.renderText('white', '18px', 'center', 'middle', 'Press "R" to Start', WIDTH / 2, HEIGHT / 2);
    }

    renderPauseScreen() {
        this.context.fillStyle = 'rgba(0, 0, 0, 0.75)';
        this.context.fillRect(0, 0, WIDTH, HEIGHT);
        this.renderText('white', '18px', 'center', 'middle', 'Press "P" to Resume', WIDTH / 2, HEIGHT / 2);
    }

    renderEndScreen({ score }) {
        this.clearScreen();

        this.renderText('white', '18px', 'center', 'middle', 'GAME OVER', WIDTH / 2, HEIGHT / 2 - 48);
        this.renderText('white', '18px', 'center', 'middle', `Score: ${score}`, WIDTH / 2, HEIGHT / 2);
        this.renderText('white', '18px', 'center', 'middle', 'Press "R" to Restart', WIDTH / 2, HEIGHT / 2 + 48);
    }

    renderText(color, size, align, baseLine, text, x, y) {
        this.context.fillStyle = color;
        this.context.font = `${size} 'Press Start 2P'`;
        this.context.textAlign = align;
        this.context.textBaseline = baseLine;
        this.context.fillText(text, x, y);
    }

    renderPlayfield({ playfield }) {
        for (let y = 0; y < playfield.length; y++) {
            this.drawGrid(y);
            for (let x = 0; x < playfield[y].length; x++) {
                const block = playfield[y][x];

                if (block) {
                    this.roundRect(
                        x * this.blockWidth,
                        y * this.blockHeight,
                        this.blockWidth,
                        this.blockHeight,
                        COLORS[block]
                    );
                }
            }
        }

        this.context.beginPath();
        this.context.moveTo(this.playfieldInnerWidth + this.playfieldBorderWidth, 0);
        this.context.lineTo(this.playfieldInnerWidth + this.playfieldBorderWidth, this.playfieldInnerHeight);
        this.context.strokeStyle = '#696f75';
        this.context.lineWidth = this.playfieldBorderWidth;
        this.context.stroke();
        this.context.closePath();
    }

    drawGrid(position) {
        this.context.beginPath();
        this.context.moveTo(0, position * this.blockWidth);
        this.context.lineTo(this.playfieldInnerWidth + this.playfieldBorderWidth, position * this.blockWidth);

        if (position < 10) {
            this.context.moveTo(position * this.blockWidth, 0);
            this.context.lineTo(position * this.blockWidth, this.playfieldInnerHeight);
        }
        this.context.strokeStyle = '#696f75';
        this.context.lineWidth = .35;
        this.context.stroke();
        this.context.closePath();
    }

    renderPanel({ level, score, lines, nextPiece, highScore, isMuted }) {
        this.renderText('white', '14px', 'start', 'top', `Score: ${score}`, this.panelX, this.panelY + 8);
        this.renderText('white', '14px', 'start', 'top', `Level: ${level}`, this.panelX, this.panelY + 32);
        this.renderText('white', '14px', 'start', 'top', `Lines: ${lines}`, this.panelX, this.panelY + 56);
        this.renderText('white', '14px', 'start', 'top', `Next:`, this.panelX, this.panelY + 104);
        this.renderText('white', '14px', 'start', 'top', `Sound: ${isMuted ? 'Off' : 'On'}`, this.panelX, this.panelHeight - 50);
        this.renderText('white', '14px', 'start', 'top', `HI: ${highScore}`, this.panelX, this.panelHeight - 20);

        for (let y = 0; y < nextPiece.blocks.length; y++) {
            for (let x = 0; x < nextPiece.blocks[y].length; x++) {
                const block = nextPiece.blocks[y][x];

                if (block) {
                    this.roundRect(
                        this.panelX + (x * this.blockWidth * 0.65),
                        this.panelY + 105 + (y * this.blockHeight * 0.65),
                        this.blockWidth * 0.65,
                        this.blockHeight * 0.65,
                        COLORS[block]
                    );
                }
            }
        }
    }

    roundRect(x, y, width, height, color) {
        const radius = { topLeft: 5, topRight: 5, bottomRight: 5, bottomLeft: 5 };

        this.context.beginPath();
        this.context.fillStyle = color;
        this.context.lineWidth = 2;
        this.context.strokeStyle = '#f9fafb';
        this.context.moveTo(x + radius.topLeft, y);
        this.context.lineTo(x + width - radius.topRight, y);
        this.context.quadraticCurveTo(x + width, y, x + width, y + radius.topRight);
        this.context.lineTo(x + width, y + height - radius.bottomRight);
        this.context.quadraticCurveTo(x + width, y + height, x + width - radius.bottomRight, y + height);
        this.context.lineTo(x + radius.bottomLeft, y + height);
        this.context.quadraticCurveTo(x, y + height, x, y + height - radius.bottomLeft);
        this.context.lineTo(x, y + radius.topLeft);
        this.context.quadraticCurveTo(x, y, x + radius.topLeft, y);
        this.context.closePath();
        this.context.fill();
        this.context.stroke();
    }
}

export default View;