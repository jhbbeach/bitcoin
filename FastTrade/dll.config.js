/**
 * Created by apple on 2017/6/7.
 */
const webpack = require('webpack');

const vendors = [
    'react',
    'react-dom',
   // 'react-router',
    "superagent",
    "jquery",
];

module.exports = {
    output: {
        path: 'dllBuild',
        filename: '[name].js',
        library: '[name]',
    },
    entry: {
        "lib": vendors,
    },
    plugins: [
        // new webpack.DefinePlugin({ //编译成生产版本
        //     'process.env': {
        //         NODE_ENV: JSON.stringify('production')
        //     }
        // }),
        // new webpack.optimize.UglifyJsPlugin(),
        new webpack.DllPlugin({
            path: 'manifest.json',
            name: '[name]',
            context: __dirname,
        }),
    ],
};