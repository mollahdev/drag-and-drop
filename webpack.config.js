const path = require('path');

module.exports = {
    mode: 'development',
    entry: "./src/app.ts",
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/dist/',
        filename: 'app.bundle.js'
    },
    devtool: 'source-map',
    devServer: {
        static: path.join(__dirname, "/"),
        compress: true,
        port: 3000,
        open: true
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },

    resolve: {
        extensions: ['.ts', '.js']
    }
}