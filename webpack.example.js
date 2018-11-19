const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: ['babel-polyfill', './src/example/index.js'],
	output: {
		path: path.join(__dirname, '/dist'),
		filename: 'index_example_bundle.js',
		publicPath: '/'
	},

	mode: 'development',
	devtool: 'inline-source-map',
	
	devServer: {
		contentBase: './dist',
		historyApiFallback: {
			index: 'index.html',
		}
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
				}
			},
			{
				test: /\.css$/,
				use: [ 'style-loader', 'css-loader' ]
			},
			{
				test: /\.(jpe?g|gif|png|svg|woff|ttf|wav|mp3)$/, 
				loader: "file-loader" ,
				options: {
					outputPath: "/images",
					publicPath: '/images',
				}
			}
		]
	},

	plugins: [
		new HtmlWebpackPlugin({
			template: './src/example/index.html'
		}),
	]
}