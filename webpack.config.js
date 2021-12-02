/* eslint-disable no-undef */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');


const env = process.env.NODE_ENV || 'development';

const config = {
    entry: [
        '@babel/polyfill', path.resolve(__dirname, 'src', 'main.js'),
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        /* publicPath: '/', */
        filename: '[name].[hash].js',
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                shared: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    enforce: true,
                    chunks: 'all',
                },
            },
        },
        minimizer: (env === 'development') ? [
            new OptimizeCSSAssetsPlugin(),
            new TerserPlugin(),
        ] : undefined,
    },
    mode: env,
    devtool: (env === 'development') ? 'cheap-module-eval-source-map' : undefined,
    devServer: {
        historyApiFallback: true,
        compress: true,
        disableHostCheck: true, 
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['eslint-loader'],
            },
            {
                test: /\.(css)$/,
                use: [
                    // For hot reload in dev https://github.com/webpack-contrib/mini-css-extract-plugin/issues/34
                    (env === 'development') ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                ],
            },
            {
                test: /\.(png|jpg|gif|otf|mp3)$/,
                use: [{
                    loader: 'file-loader',
                    options: {},
                }],
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                  {
                    loader: 'file-loader',
                    options: {
                      name: '[name].[ext]',
                      outputPath: 'fonts/'
                    }
                  }
                ]
              },
              {
                test: /\.(glb|json|obj)$/,
                loader: 'url-loader'
              }
        ],
    },
    plugins: [
        new CleanWebpackPlugin('dist', {}),
        new HtmlWebpackPlugin({
            title: 'modern-webpack-starter',
            template: path.resolve(__dirname, 'src', 'index.html'),
            inject: true,
            minify: (env === 'development') ? undefined : {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true,
            },
        }),
        new MiniCssExtractPlugin({
            filename: (env === 'development') ? '[name].css' : '[name].[hash].css',
            chunkFilename: (env === 'development') ? '[id].css' : '[id].[hash].css',
        }),
        new CopyWebpackPlugin(
            [
                { from: 'static', to: 'static' },
            ]
        )
    ],
    resolve: {
        extensions: ['.js', '.json'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },

};

module.exports = config;