const HtmlWebPackPlugin = require("html-webpack-plugin");
let HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
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
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "./index.html",
            inlineSource: '.(js|css)$', // embed all javascript and css inline
        }),
        new HtmlWebpackInlineSourcePlugin()
    ]
};
