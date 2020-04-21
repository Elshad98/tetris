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
            for (let x = 0; x < line.length; x++) {
                const block = line[x];

                if (block) {
                    this.renderBlock(x * this.blockWidth, y * this.blockHeight, this.blockWidth, this.blockHeight, '#F04747');
                }
            }
        }
    }

    renderBlock(x, y, width, height, color) {
        this.contenxt.fillStyle = color;
        this.contenxt.strokeStyle = '#282b30';
        this.contenxt.lineWidth = 2;

        this.contenxt.fillRect(x, y, width, height);
        this.contenxt.strokeRect(x, y, width, height);
    }
}

export default View;