const GameUtils = {
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
    },

    setHighScore(score) {
        localStorage.setItem('highScore', score);
    }
};

export default GameUtils;