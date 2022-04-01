const WIDTH = 500;
const HEIGHT = 640;

const COLUMNS = 10;
const ROWS = 20;

const POINTS = {
    '1': 10,
    '2': 25,
    '3': 75,
    '4': 100
};

const SHAPES = [
    [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    [
        [0, 0, 0],
        [2, 2, 2],
        [0, 0, 2]
    ],
    [
        [0, 0, 0],
        [3, 3, 3],
        [3, 0, 0]
    ],
    [
        [0, 0, 0, 0],
        [0, 4, 4, 0],
        [0, 4, 4, 0],
        [0, 0, 0, 0]
    ],
    [
        [0, 0, 0],
        [0, 5, 5],
        [5, 5, 0]
    ],
    [
        [0, 0, 0],
        [6, 6, 6],
        [0, 6, 0]
    ],
    [
        [0, 0, 0],
        [7, 7, 0],
        [0, 7, 7]
    ]
];

const DEFAULT_INTERVAL = 150;

const MAX_UPDATE_INTERVAL = 800;
const MIN_UPDATE_INTERVAL = 200;

const KEYS = {
    RIGHT: 39,
    LEFT: 37,
    UP: 38,
    DOWN: 40,
    R: 82,
    P: 80,
    ENTER: 13,
    SPACE: 32
};

const COLORS = {
    '1': '#ffc90d',
    '2': '#ff7f26',
    '3': '#eb2325',
    '4': '#23b14d',
    '5': '#3f46cb',
    '6': '#a349a3',
    '7': '#01a2e8'
};

export {
    WIDTH,
    HEIGHT,
    COLUMNS,
    ROWS,
    POINTS,
    DEFAULT_INTERVAL,
    MAX_UPDATE_INTERVAL,
    MIN_UPDATE_INTERVAL,
    KEYS,
    COLORS,
    SHAPES
};