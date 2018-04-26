/**
 * Created by cuongdd on 1/21/2017.
 */

var path = require('path'),
    minimize = process.argv.indexOf('--minimize') !== -1,
    plugins = [];

module.exports = {

    entry: {
        main: path.resolve("client/src/Main.ts")
    },
    output: {
        path: __dirname + '/public',
        // path: __dirname + '/mobile/www/js',
        filename: 'bundle.min.js'
    },
    devtool : "source-map",
    module: {
        loaders: [
            {test: /.ts$/, loader: 'awesome-typescript-loader'}
        ]
    },
    plugins: plugins,
    resolve: {
        extensions: ['.ts', '.js', '.json']
    }
};