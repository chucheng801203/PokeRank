const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = (env, argv) => {
    return {
        entry: {
            main: "./src/index.tsx",
        },
        output: {
            filename: "js/[name].[contenthash].chunk.js",
            chunkFilename: "js/[id].[contenthash].chunk.js",
            path: path.resolve(__dirname, "../../public/static/"),
            publicPath: "/static/",
            clean: true,
        },
        devtool: argv.mode === "development" ? "inline-source-map" : false,
        plugins: [
            new MiniCssExtractPlugin({
                filename: "css/[name].[contenthash].chunk.css",
                chunkFilename: "css/[id].[contenthash].chunk.css",
            }),
            new HtmlWebpackPlugin({
                filename: "../../resources/views/welcome.blade.php",
                template: "./public/index.blade.php",
                scriptLoading: "blocking",
                inject: "body",
            }),
            new CopyPlugin({
                patterns: [
                    {
                        from: "./public",
                        to: "./",
                        filter: (resourcePath) => {
                            return !(
                                path.basename(resourcePath) === "index.blade.php"
                            );
                        },
                    },
                ],
            }),
        ],
        module: {
            rules: [
                {
                    test: /\.(sa|sc|c)ss$/i,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: "css-loader",
                            options: {
                                modules: {
                                    localIdentName:
                                        argv.mode === "development"
                                            ? "[name]__[local]"
                                            : "[hash:base64:8]",
                                },
                            },
                        },
                        "sass-loader",
                    ],
                },
                {
                    test: /\.(js|jsx|ts|tsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                "@babel/preset-env",
                                "@babel/preset-react",
                                "@babel/preset-typescript",
                            ],
                        },
                    },
                },
                {
                    test: /\.(png|jpe?g|gif|svg)$/i,
                    use: [
                        {
                            loader: "file-loader",
                        },
                    ],
                },
            ],
        },
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".jsx"],
        },
        optimization: {
            splitChunks: {
                chunks: "all",
                name: false,
                cacheGroups: {
                    reactVendors: {
                        test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                        reuseExistingChunk: true,
                        priority: -10,
                    },
                    vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        reuseExistingChunk: true,
                        priority: -20,
                    },
                },
            },
        },
    };
};
