const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv');

dotenv.config();

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
    entry: './src/index.tsx',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),
        new webpack.DefinePlugin({
            'process.env.REACT_APP_REDDIT_CLIENT_ID': JSON.stringify(process.env.REACT_APP_REDDIT_CLIENT_ID),
            'process.env.REACT_APP_REDDIT_CLIENT_SECRET': JSON.stringify(process.env.REACT_APP_REDDIT_CLIENT_SECRET),
        }),
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 9000,
        proxy: isDevelopment
            ? [
                {
                    context: ['/api'],
                    target: 'http://localhost:5000', // прокси только для локальной разработки
                    changeOrigin: true,
                    pathRewrite: { '^/api': '' },
                    secure: false,
                },
            ]
            : undefined, // Нет прокси для продакшн-среды
    },
};
