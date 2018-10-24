var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    node: {
        console: true,
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    },
    cache: true,
    // devtool: 'cheap-module-eval-source-map',
   devtool: 'false',
    entry :{
        //'webpack-hot-middleware/client?reload=true',
        // app : './pages-react/index',
        /************************************************基本界面 start****************************************************************/
        Login:["webpack-hot-middleware/client?reload=true","./dispersePages/Login"],
        TradePage:["webpack-hot-middleware/client?reload=true","./dispersePages/TradePage"],
    },
    output: {
        publicPath: '/static/', //服务器根路径 static/
        path: path.join(__dirname, 'disperseDist'), //编译到当前目录
        filename: '[name].js', //编译后的文件名字
        chunkFilename: "[name].js"
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /^node_modules$/,
            loader: 'babel?presets[]=es2015,presets[]=stage-0',
        }, {
            test: /\.css$/,
            exclude: /^node_modules$/,
            //loader: ExtractTextPlugin.extract('style-loader', 'css-loader!autoprefixer-loader')
            loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules!autoprefixer-loader')
        }, {
            test: /\.less/,
            exclude: /^node_modules$/,
            //loader: ExtractTextPlugin.extract('style-loader', 'css-loader!autoprefixer-loader!less-loader')
            loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules!autoprefixer-loader!less-loader')
        }, {
            test: /\.(eot|woff|svg|ttf|woff2|gif|appcache)(\?|$)/,
            exclude: /^node_modules$/,
            loader: 'file-loader?name=[name].[ext]'
        }, {
            test: /\.(png|jpg|wav)$/,
            exclude: /^node_modules$/,
            loader: 'url?limit=2000000&name=[name].[ext]' //注意后面那个limit的参数，当你图片大小小于这个限制的时候，会自动启用base64编码图片
        }, {
            test: /\.jsx$/,
            exclude: /^node_modules$/,
            loaders: ['jsx', 'babel?presets[]=es2015,presets[]=stage-0,presets[]=react']
        },
            {
                test:/\.json$/,
                loader:'json'
            }
        ]
    },
    plugins: [
        // new webpack.DefinePlugin({ //编译成生产版本
        //     'process.env': {
        //         NODE_ENV: JSON.stringify('production')
        //     }
        // }),
        // new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new ExtractTextPlugin('[name].css'),
        new webpack.optimize.CommonsChunkPlugin('vendor',  'vendor.js'),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('./manifest.json'),
        }),
         // new webpack.optimize.UglifyJsPlugin({
         //     compress: {
         //         warnings: false
         //     }
         // })
       // new HtmlWebpackPlugin(),
    ],
    resolve: {
        extensions: ['', '.js', '.jsx'], //后缀名自动补全
        modulesDirectories: ["node_modules"],
    }
};