import APP_CONFIG from './config';

class Game {

    static points = {
        '1': 10,
        '2': 25,
        '3': 75,
        '4': 100
    }

    static TYPES = 'IJLOSTZ';
    static NUMBER_SHAPES = 7;

    constructor() {
        this.reset();
    }

    get level() {
        return Math.floor(this.lines * 0.1);
    }

    getState() {
        const playfield = this.createPlayfield();
        const { y: pieceY, x: pieceX, blocks } = this.activePiece;

        for (let y = 0; y < this.playfield.length; y++) {
            playfield[y] = [];

            for (let x = 0; x < this.playfield[y].length; x++) {
                playfield[y][x] = this.playfield[y][x];
            }
        }

        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {
                if (blocks[y][x]) {
                    playfield[pieceY + y][pieceX + x] = blocks[y][x];
                }
            }
        }

        return {
            playfield: playfield,
            level: this.level,
            lines: this.lines,
            nextPiece: this.nextPiece,
            score: this.score,
            isGameOver: this.topOut,
            highScore: this.highScore
        };
    }

    reset() {
        this.score = 0;
        this.lines = 0;
        this.topOut = false;
        this.pieces = [];
        this.highScore = this.getHighScore();
        this.playfield = this.createPlayfield();
        this.activePiece = this.createPiece();
        this.nextPiece = this.createPiece();
    }

    createPlayfield() {
        const playfield = [];

        for (let y = 0; y < APP_CONFIG.playField.rows; y++) {
            playfield[y] = [];

            for (let x = 0; x < APP_CONFIG.playField.columns; x++) {
                playfield[y][x] = 0;
            }
        }

        return playfield;
    }

    createPiece() {
        const piece = {};
        let currentType;
        do {
            const index = Math.floor(Math.random() * Game.NUMBER_SHAPES);
            currentType = Game.TYPES[index];

            if (currentType === 'I') {
                piece.blocks = [
                    [0, 0, 0, 0],
                    [1, 1, 1, 1],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ];
            } else if (currentType === 'J') {
                piece.blocks = [
                    [0, 0, 0],
                    [2, 2, 2],
                    [0, 0, 2]
                ];
            } else if (currentType === 'L') {
                piece.blocks = [
                    [0, 0, 0],
                    [3, 3, 3],
                    [3, 0, 0]
                ];
            } else if (currentType === 'O') {
                piece.blocks = [
                    [0, 0, 0, 0],
                    [0, 4, 4, 0],
                    [0, 4, 4, 0],
                    [0, 0, 0, 0]
                ];
            } else if (currentType === 'S') {
                piece.blocks = [
                    [0, 0, 0],
                    [0, 5, 5],
                    [5, 5, 0]
                ];
            } else if (currentType === 'T') {
                piece.blocks = [
                    [0, 0, 0],
                    [6, 6, 6],
                    [0, 6, 0]
                ];
            } else if (currentType === 'Z') {
                piece.blocks = [
                    [0, 0, 0],
                    [7, 7, 0],
                    [0, 7, 7]
                ];
            } else {
                throw new Error('Unknown type of figure');
            }
        } while (this.isRepeated(currentType));

        piece.x = Math.floor((10 - piece.blocks[0].length) / 2);
        piece.y = -1;

        return piece;
    }

    isRepeated(type) {
        let result = false;
        if (this.pieces[0] !== type) {
            this.pieces = [type];
        } else {
            this.pieces.push(type);
        }
        if (this.pieces.length > 2) {
            result = true;
        }
        return result;
    }

    movePieceLeft() {
        this.activePiece.x -= 1;

        if (this.hasCollision()) {
            this.activePiece.x += 1;
        }
    }

    movePieceRight() {
        this.activePiece.x += 1;

        if (this.hasCollision()) {
            this.activePiece.x -= 1;
        }
    }

    movePieceDown() {
        if (this.topOut) {
            return;
        }
        this.activePiece.y += 1;

        if (this.hasCollision()) {
            this.activePiece.y -= 1;
            this.lockPiece();
            this.clearLines();
            this.updatePieces();
        }

        if (this.hasCollision()) {
            this.topOut = true;
            if (this.score > this.highScore) {
                localStorage.setItem('highScore', this.score);
            }
        }
    }

    rotatePiece() {
        this.rotateBlocks();

        if (this.hasCollision()) {
            this.rotateBlocks(false);
        }
    }

    rotateBlocks(clockwise = true) {
        const { blocks } = this.activePiece;
        const length = blocks.length;
        const x = Math.floor(length / 2);
        const y = length - 1;

        for (let i = 0; i < x; i++) {
            for (let j = i; j < y - i; j++) {
                const temp = blocks[i][j];

                if (clockwise) {
                    blocks[i][j] = blocks[y - j][i];
                    blocks[y - j][i] = blocks[y - i][y - j];
                    blocks[y - i][y - j] = blocks[j][y - i];
                    blocks[j][y - i] = temp;
                } else {
                    blocks[i][j] = blocks[j][y - i];
                    blocks[j][y - i] = blocks[y - i][y - j];
                    blocks[y - i][y - j] = blocks[y - j][i];
                    blocks[y - j][i] = temp;
                }
            }
        }
    }

    hasCollision() {
        const playfield = this.playfield;
        const { blocks, y: pieceY, x: pieceX } = this.activePiece;

        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {
                if (blocks[y][x] &&
                    ((playfield[pieceY + y] === undefined || playfield[pieceY + y][pieceX + x] === undefined) ||
                        playfield[pieceY + y][pieceX + x])) {
                    return true;
                }
            }
        }

        return false;
    }

    lockPiece() {
        const activePiece = this.activePiece;
        const { blocks, y: pieceY, x: pieceX } = activePiece;

        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {
                if (blocks[y][x]) {
                    this.playfield[pieceY + y][pieceX + x] = blocks[y][x];
                }
            }
        }
    }

    clearLines() {
        const { columns, rows } = APP_CONFIG.playField;
        let lines = [];

        for (let y = rows - 1; y >= 0; y--) {
            let numberOfBlocks = 0;

            for (let x = 0; x < columns; x++) {
                if (this.playfield[y][x]) {
                    numberOfBlocks += 1;
                }
            }

            if (numberOfBlocks === 0) {
                break;
            } else if (numberOfBlocks < columns) {
                continue;
            } else if (numberOfBlocks === columns) {
                lines.unshift(y);
            }
        }

        for (let index of lines) {
            this.playfield.splice(index, 1);
            this.playfield.unshift(this.getPlayfieldLine(columns, 0));
        }

        this.updateScore(lines.length);
    }

    getPlayfieldLine(length, value) {
        let arr = new Array(length);
        for (let i = 0; i < arr.length; i++) {
            arr[i] = value;
        }
        return arr
    }

    updateScore(clearLines) {
        if (clearLines > 0) {
            this.score += Game.points[clearLines] * (this.level + 1);
            this.lines += clearLines;
        }
    }

    updatePieces() {
        this.activePiece = this.nextPiece;
        this.nextPiece = this.createPiece();
    }

    getHighScore() {
        let highScore;
        try {
            highScore = localStorage.getItem('highScore');
        } catch (error) {
            console.error(error.message);
        }
        if (/^\d+$/.test(highScore)) {
            return Number(highScore);
        } else {
            return 0;
        }
    }
}

export default Game;