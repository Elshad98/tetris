const HIGH_SCORE = 'highScore';

const GameUtils = {
    getHighScore() {
        let highScore;
        try {
            highScore = localStorage.getItem(HIGH_SCORE);
        } catch (error) {
            console.error(error.message);
        }
        if (/^\d+$/.test(highScore)) {
            return Number(highScore);
        } else {
            return 0;
        }
    },

    setHighScore(score) {
        localStorage.setItem(HIGH_SCORE, score);
    }
};

export default GameUtils;