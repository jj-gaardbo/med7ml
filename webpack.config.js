const HtmlWebPackPlugin = require("html-webpack-plugin");
let HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
module.exports = {
    output: {
        path: __dirname + '/templates'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader',
                })
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader"
                    }
                ]
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('main.css'),
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "./index.html",
            inlineSource: '.(js|css)$', // embed all javascript and css inline
        }),
        new HtmlWebpackInlineSourcePlugin()
    ],
    optimization: {
        minimizer: [
            new TerserPlugin({
                cache: false,
                parallel: true,
                sourceMap: true,
                terserOptions: {
                    compress: {
                        drop_console: true
                    }
                }
            }),
        ],
    }
};
