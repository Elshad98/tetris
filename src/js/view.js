class View {
    constructor(element, width, height, rows, columns) {
        this.element = element;
        this.width = width;
        this.height = height;

        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.context = this.canvas.getContext('2d');

        this.playfieldBorderWidth = 4;
        this.playfieldX = this.playfieldBorderWidth;
        this.playfieldY = this.playfieldBorderWidth;
        this.playfieldWidth = this.width * 2 / 3;
        this.playfieldHeight = this.height;
        this.playfieldInnerWidth = this.playfieldWidth - this.playfieldBorderWidth * 2;
        this.playfieldInnerHeight = this.playfieldHeight - this.playfieldBorderWidth * 2;

        this.blockWidth = this.playfieldInnerWidth / columns;
        this.blockHeight = this.playfieldInnerHeight / rows;

        this.panelX = this.playfieldWidth + 10;
        this.panelY = 0;
        this.panelWidth = this.width / 3;
        this.panelHeight = this.height;

        this.element.appendChild(this.canvas);
    }

    static colors = {
        '1': '#ffc90d',
        '2': '#ff7f26',
        '3': '#eb2325',
        '4': '#23b14d',
        '5': '#3f46cb',
        '6': '#a349a3',
        '7': '#01a2e8'
    };

    renderMainScreen(state) {
        this.clearScreen();
        this.renderPlayfield(state);
        this.renderPanel(state);
    }

    clearScreen() {
        this.context.clearRect(0, 0, this.width, this.height);
    }

    renderStartScreen() {
        this.context.fillStyle = 'white';
        this.context.font = '18px "Press Start 2P"';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText('Press ENTER to Start', this.width / 2, this.height / 2);
    }

    renderPauseScreen() {
        this.context.fillStyle = 'rgba(0, 0, 0, 0.75)';
        this.context.fillRect(0, 0, this.width, this.height);

        this.context.fillStyle = 'white';
        this.context.font = '18px "Press Start 2P"';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText('Press ENTER to Resume', this.width / 2, this.height / 2);
    }

    renderEndScreen({ score }) {
        this.clearScreen();

        this.context.fillStyle = 'white';
        this.context.font = '18px "Press Start 2P"';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText('GAME OVER', this.width / 2, this.height / 2 - 48);
        this.context.fillText(`Score: ${score}`, this.width / 2, this.height / 2);
    }

    renderPlayfield({ playfield }) {
        for (let y = 0; y < playfield.length; y++) {
            this.drawLine(y);
            for (let x = 0; x < playfield[y].length; x++) {
                const block = playfield[y][x];

                if (block) {
                    this.roundRect(
                        this.playfieldX + (x * this.blockWidth),
                        this.playfieldY + (y * this.blockHeight),
                        this.blockWidth,
                        this.blockHeight,
                        5,
                        View.colors[block]);
                }
            }
        }

        this.context.strokeStyle = '#696f75';
        this.context.lineWidth = this.playfieldBorderWidth;
        this.context.strokeRect(0, 0, this.playfieldWidth, this.playfieldHeight);
    }

    drawLine(position) {
        this.context.beginPath();
        this.context.moveTo(0, this.playfieldX + (position * this.blockWidth) + this.playfieldBorderWidth);
        this.context.lineTo(this.playfieldInnerWidth + this.playfieldBorderWidth * 2, this.playfieldY + (position * this.blockWidth) + this.playfieldBorderWidth);

        // this.context.moveTo(this.playfieldX + (position * this.blockWidth), this.playfieldBorderWidth);
        // this.context.lineTo(this.playfieldY + (position * this.blockWidth), this.playfieldInnerHeight);
        this.context.strokeStyle = "#696f75";
        this.context.lineWidth = .35;
        this.context.stroke();
        this.context.closePath();
    }

    renderPanel({ level, score, lines, nextPiece }) {
        this.context.textAlign = 'start';
        this.context.textBaseline = 'top';
        this.context.fillStyle = 'white';
        this.context.font = '14px "Press Start 2P"';

        this.context.fillText(`Score: ${score}`, this.panelX, this.panelY + 8);
        this.context.fillText(`Level: ${level}`, this.panelX, this.panelY + 32);
        this.context.fillText(`Lines: ${lines}`, this.panelX, this.panelY + 56);
        this.context.fillText(`Next:`, this.panelX + 0, this.panelY + 104);

        for (let y = 0; y < nextPiece.blocks.length; y++) {
            for (let x = 0; x < nextPiece.blocks[y].length; x++) {
                const block = nextPiece.blocks[y][x];

                if (block) {
                    this.roundRect(
                        this.panelX + (x * this.blockWidth * 0.65),
                        this.panelY + 105 + (y * this.blockHeight * 0.65),
                        this.blockWidth * 0.65,
                        this.blockHeight * 0.65,
                        5,
                        View.colors[block]);
                }
            }
        }
    }

    roundRect(x, y, width, height, radius, color) {
        if (typeof radius === 'number') {
            radius = { tl: radius, tr: radius, br: radius, bl: radius };
        } else {
            var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
            for (var side in defaultRadius) {
                radius[side] = radius[side] || defaultRadius[side];
            }
        }
        this.context.beginPath();
        this.context.fillStyle = color;
        this.context.lineWidth = 2;
        this.context.strokeStyle = '#f9fafb';
        this.context.moveTo(x + radius.tl, y);
        this.context.lineTo(x + width - radius.tr, y);
        this.context.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
        this.context.lineTo(x + width, y + height - radius.br);
        this.context.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
        this.context.lineTo(x + radius.bl, y + height);
        this.context.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
        this.context.lineTo(x, y + radius.tl);
        this.context.quadraticCurveTo(x, y, x + radius.tl, y);
        this.context.closePath();
        this.context.fill();
        this.context.stroke();
    }
}

export default View;