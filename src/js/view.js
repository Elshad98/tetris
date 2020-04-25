class View {
    constructor(element, width, height, rows, columns) {
        this.element = element;
        this.width = width;
        this.height = height;

        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.contenxt = this.canvas.getContext('2d');

        this.blockWidth = this.width / columns;
        this.blockHeight = this.height / rows;

        this.element.appendChild(this.canvas);
    }

    static colors = {
        '1': '#00E0A7',
        '2': '#F26522',
        '3': '#4285F4',
        '4': '#FFD01A',
        '5': '#C53DFF',
        '6': '#F04747',
        '7': '#49d5ff'
    };

    render({ playfield }) {
        this.clearScreen();
        this.renderPlayfield(playfield);
    }

    clearScreen() {
        this.contenxt.clearRect(0, 0, this.width, this.height);
    }

    renderPlayfield(playfield) {
        for (let y = 0; y < playfield.length; y++) {
            const line = playfield[y];
            this.drawLine(y);
            for (let x = 0; x < line.length; x++) {
                const block = line[x];

                if (block) {
                    this.renderBlock(x * this.blockWidth, y * this.blockHeight, this.blockWidth, this.blockHeight, View.colors[block]);
                }
            }
        }
    }

    drawLine(position) {
        this.contenxt.beginPath();
        this.contenxt.moveTo(0, position * this.blockWidth);
        this.contenxt.lineTo(this.width, position * this.blockWidth);

        this.contenxt.moveTo(position * this.blockWidth, 0);
        this.contenxt.lineTo(position * this.blockWidth, this.height);
        this.contenxt.strokeStyle = "#696f75";
        this.contenxt.lineWidth = .5;
        this.contenxt.stroke();
        this.contenxt.closePath();
    }

    renderBlock(x, y, width, height, color) {
        this.contenxt.fillStyle = color;
        this.contenxt.strokeStyle = '#36393e';

        this.contenxt.fillRect(x, y, width, height);
        this.contenxt.strokeRect(x, y, width, height);
    }
}

export default View;