const path=require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");



module.exports = {
    // /production/ 
    mode:'production',
    entry: ['@babel/polyfill','./src/index.js'],
    output:{
      path:path.resolve(__dirname,'dist'),
      filename:'main.[hash].bundle.js'
    },
    devServer: {
       static:{
           directory:path.join(__dirname,'dist')
       }
    },
    module:{
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
            {
                test: /\.html$/i,
                use:[
                    {
                        loader:'html-loader',
                    }
                ]
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                }
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'img/[hash][ext]'
                }
            },
        ],
    },
    devtool:'source-map',
    plugins:[
        new HtmlWebpackPlugin(
            {
                template:'./src/index.html'
            }
        ),
        new MiniCssExtractPlugin(
            {
                filename:'main.[hash].css'
            }
        )
    ]
};