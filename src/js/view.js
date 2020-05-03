class View {
    constructor(element, width, height, rows, columns) {
        this.element = element;
        this.width = width;
        this.height = height;

        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.context = this.canvas.getContext('2d');

        this.blockWidth = this.width / columns;
        this.blockHeight = this.height / rows;

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

    render({ playfield }) {
        this.clearScreen();
        this.renderPlayfield(playfield);
    }

    clearScreen() {
        this.context.clearRect(0, 0, this.width, this.height);
    }

    renderPlayfield(playfield) {
        for (let y = 0; y < playfield.length; y++) {
            const line = playfield[y];
            this.drawLine(y);
            for (let x = 0; x < line.length; x++) {
                const block = line[x];

                if (block) {
                    this.roundRect(x * this.blockWidth, y * this.blockHeight, this.blockWidth, this.blockHeight, 5, View.colors[block]);
                }
            }
        }
    }

    drawLine(position) {
        this.context.beginPath();
        this.context.moveTo(0, position * this.blockWidth);
        this.context.lineTo(this.width, position * this.blockWidth);

        this.context.moveTo(position * this.blockWidth, 0);
        this.context.lineTo(position * this.blockWidth, this.height);
        this.context.strokeStyle = "#696f75";
        this.context.lineWidth = .35;
        this.context.stroke();
        this.context.closePath();
    }

    roundRect(x, y, width, height, radius = 5, color) {
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