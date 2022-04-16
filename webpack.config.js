const path = require("path");
const webpack = require("webpack");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin

module.exports = {
    // the entry point is
    //  - the root of the bundle and the beggining
    //  - and the beginning of the dependency graph
    //  - so give it the relative path to the client's code
    entry: {
        app: "./assets/js/script.js",
        events: "./assets/js/events.js",
        schedule: "./assets/js/schedule.js",
        tickets: "./assets/js/tickets.js"
    },
    //  - webpack will bundle that code and 'output' that bundled code to a folder that we specify
    output: {
        filename: "[name].bundle.js",
        path: __dirname + "/dist",
    },
    module: {
        rules: [
            {
                test: /\.jpg$/i,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            // we need to change the names of the images output
                            esModule: false,
                            name (file) {
                                return "[path][name].[ext]"
                            },
                            // creates a folder 'assets/img' to place the images
                            publicPath: function(url) {
                                return url.replace("../", "/assets/")
                            }
                        }
                    },
                    // file-loader processes the images first so that image-webpack-loader can optimize the emitted files. so make sure 'loader' is listed in the previous object
                    { 
                        loader: 'image-webpack-loader'
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: "static", // the report outputs to an HTML file in the dist folder
        })
    ],
    mode: 'development'
};