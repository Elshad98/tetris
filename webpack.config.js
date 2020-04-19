const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const config = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, './build'),
        filename: 'main.js',
        publicPath: 'build/'
    },
    devServer: {
        overlay: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: '/node_modules/'
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            {
                test: /\.html$/i,
                use: [
                    {
                        loader: "html-loader"
                    }
                ]
            },
        ],
    },
    plugins: [
        new ExtractTextPlugin("main.css"),
    ]
};

module.exports = (env, options) => {
    const production = options.mode === 'production';

    config.devtool = production ? false : 'evel-sourcemap';

    return config;
};