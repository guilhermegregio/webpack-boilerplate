var webpack = require('webpack');
var path = require('path');
var buildPath = path.resolve(__dirname, '../', 'build');
var appPath = path.resolve(__dirname, '../', 'src');

var config = {
    context: appPath,
    entry: './index.js',
    output: {
        path: appPath,
        filename: 'bundle.js'
    },
    plugins: [
        new webpack.DefinePlugin({
            ON_TEST: process.env.NODE_ENV === 'test'
        })
    ],
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel',
            exclude: /node_modules/
        }, {
            test: /\.html$/,
            loader: 'raw',
            exclude: /node_modules/
        }, {
            test: /\.css$/,
            loader: 'style!css',
            exclude: /node_modules/
        }, {
            test: /\.styl$/,
            loader: 'style!css!stylus',
            exclude: /node_modules/
        }]
    }
};

if (process.env.NODE_ENV === 'production') {
    config.output.path = buildPath;
    config.plugins.push(new webpack.optimize.UglifyJsPlugin());
    config.devtool = 'source-map';
}

module.exports = config;
