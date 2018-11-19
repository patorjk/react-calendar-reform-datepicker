const path = require('path');
const webpack = require('webpack');
const pkg = require('./package.json');

const libraryName = pkg.name;

module.exports = {
	entry: ['./src/components/Datepicker/index.js'],
	output: {
		path: path.join(__dirname, '/dist'),
		filename: 'index_bundle.js',
		publicPath: '/dist/',
		umdNamedDefine: true,
		library: libraryName,
		libraryTarget: 'umd',
	},

	resolve: {      
		alias: {          
			'react': path.resolve(__dirname, './node_modules/react'),
			'react-dom': path.resolve(__dirname, './node_modules/react-dom'),      
		}  
	}, 

	externals: {
		'react': 'react',
		"react-dom": 'reactDOM',
		'bootstrap': 'bootstrap',
		'styled-components': 'styled-components',
		'reactstrap': 'Reactstrap',
	},

	mode: 'production',

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
}