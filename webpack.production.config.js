'use strict';

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');

var PATHS = {
    main: path.join(__dirname, 'app', 'client.js'),         // app folder: source code
    build: path.join(__dirname, 'build'),                   // build folder: bundle code
    style: [
        path.join(__dirname, 'app', 'styles', 'main.css'),
        path.join(__dirname, 'app', 'styles', 'csshake.css')
    ]
};

module.exports = {
    entry: {
        main: PATHS.main,
        style: PATHS.style,
        vendor: ['react', 'react-dom', 'react-grid-layout', 'react-redux', 'react-addons-test-utils', 
            'react-tap-event-plugin', 'redux', 'socket.io-client', 'superagent']
    },
    
    output: {
        path: PATHS.build,
        filename: '[name]-[hash].min.js',
        publicPath: '/'
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: 'app/index.tpl.html',
            inject: 'body',
            filename: 'index.html'
        }),
        new CleanWebpackPlugin([ PATHS.build ], {
            root: process.cwd()
        }),
        new webpack.optimize.CommonsChunkPlugin({
            names: [ 'vendor' ],
            minChunks: Infinity
        }),
        new ExtractTextPlugin('[name]-[hash].min.css'),
        // new webpack.optimize.UglifyJsPlugin({
        //     compressor: {
        //         warnings: false,
        //         screw_ie8: true
        //     }
        // }),
        new webpack.DefinePlugin({
            'global.GENTLY': false
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        })
    ],

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                enforce: 'pre',
                loader: 'babel-loader',
                options: {
                    presets: [ 'react', 'es2017', 'stage-0' ]
                },
            }, {
                test: /\.css$/,
                use: [{ loader: 'style-loader' }, { loader: 'css-loader', options: { modules: true }}]
            }, {
                test: /\.json?$/,
                loader: 'json-loader'
            }, {
                test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
                loader: 'url-loader?limit=10000'
            }
        ]
    },

    node: {
        __dirname: true,
        fs: 'empty',
        tls: 'empty'
    }
};
