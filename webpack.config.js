const path = require("path");
const webpack = require("webpack");

module.exports = {
    // the entry point is
    //  - the root of the bundle and the beggining
    //  - and the beginning of the dependency graph
    //  - so give it the relative path to the client's code
    entry:'./assets/js/script.js',
    //  - webpack will bundle that code and 'output' that bundled code to a folder that we specify
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.bundle.js'
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
    ],
    mode: 'development'
};