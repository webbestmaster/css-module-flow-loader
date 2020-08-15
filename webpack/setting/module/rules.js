const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const {isProduction, isDevelopment, pathToLoadedFileFolder} = require('./../../config');

const styleLoader = {
    loader: 'style-loader',
    options: {attributes: {'class': 'my-css-module'}},
};

const postCssLoader = {
    loader: 'postcss-loader',
    options: {sourceMap: true},
};

const cssLoader = isProduction ? MiniCssExtractPlugin.loader : styleLoader;

module.exports.rules = [
    {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
    },
    {
        test: /\.scss$/,
        use: [
            cssLoader,
            path.resolve('./dist/index.js'),
            {
                loader: 'css-loader',
                options: {
                    sourceMap: isDevelopment,
                    modules: {
                        localIdentName: isDevelopment ? '[local]----[hash:6]' : '[hash:6]', // '[local]----[path]--[name]--[hash:6]'
                        // localIdentName: '[local]', // '[local]----[path]--[name]--[hash:6]'
                    },
                },
            },
            postCssLoader,
            {loader: 'sass-loader', options: {sourceMap: isDevelopment}},
        ],
    },
    {
        test: /\.css$/,
        use: [
            cssLoader,
            path.resolve('./dist/index.js'),
            {
                loader: 'css-loader',
                options: {
                    sourceMap: isDevelopment,
                    modules: {
                        localIdentName: '[local]', // '[local]----[path]--[name]--[hash:6]'
                    },
                },
            },
            postCssLoader,
        ],
    }
];
