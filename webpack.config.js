const path = require('path');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const config = {
    entry: './src/js/index.js',
    output: {
        path: path.resolve(__dirname, './build'),
        filename: 'js/main.js',
        publicPath: ''
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
                test: /\.(sa|sc|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                autoprefixer({
                                    overrideBrowserslist: ['last 100 versions'],
                                    cascade: false
                                }),
                            ],
                        },
                    }
                ]
            },
            {
                test: /\.html$/,
                use: [{
                    loader: 'html-loader'
                }]
            },
            {
                test: /\.ico$/,
                loader: 'url-loader',
                query: {
                    mimetype: ''
                }
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts/',
                        publicPath: '../fonts/'
                    }
                }]
            },
            {
                test: /\.(ogg|mp3|wav|mpe?g)$/i,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'sounds/'
                    },
                }]
            }
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/main.css',
            chunkFilename: 'css/main.css',
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: cssnano,
            cssProcessorPluginOptions: {
                preset: ['default', {
                    discardComments: {
                        removeAll: true
                    }
                }],
            },
            canPrint: true
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: __dirname + '/src/index.html',
            favicon: __dirname + '/src/favicon.ico',
            inject: 'body',
            files: {
                css: [__dirname + 'main.css'],
                js: [__dirname + 'main.js'],
            }
        })
    ]
};

module.exports = (env, options) => {
    const production = options.mode === 'production';

    config.devtool = production ? false : 'evel-sourcemap';

    return config;
};