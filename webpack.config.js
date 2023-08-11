const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: {
        index: "./app/scss/index.scss",
        "stories-fs-style": "./app/scss/stories-fs.scss",
        "stories-fs": "./app/ts/stories-fs.ts",
        init: "./app/scripts/init.js",
    },
    output: {
        library: {
            name: "StoriesFs",
            type: "umd",
            export: "default",
        },
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },
    devServer: {
        watchFiles: "app/",
        port: 9000,
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./app/html/index.html",
            minify: false,
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: "./app/images/",
                    to: "./images/",
                },
            ],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader", "sass-loader"],
            },
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
};
