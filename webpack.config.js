const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
	entry: {
		app: './src/index.js',
		'production-dependencies': ['phaser']
	},
	devServer: {
		contentBase: path.resolve(__dirname, 'dist/')
	},
	plugins: [
		new CopyWebpackPlugin([
			{
				from: path.resolve(__dirname, 'index.html'),
				to: path.resolve(__dirname, 'dist/')
			}
		]),
		new webpack.DefinePlugin({
			'typeof CANVAS_RENDERER': JSON.stringify(true),
			'typeof WEBGL_RENDERER': JSON.stringify(true)
		}),	  
	],
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader'
				]
			},
			{
				test: /\.js$/,
				include: path.resolve(__dirname, 'src/', 'src/scenes'),
				exclude: path.resolve(__dirname,'global.js'),
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['env']
					}
				}
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: [{
					loader: 'file-loader',
					options: {
						outputPath: 'assets/images/'
					}
				}]
			},
			{
				test: /\.(wav|mp3)$/,
				use: [{
					loader: 'file-loader',
					options: {
						outputPath: 'assets/audio/'
					}
				}]
			},
		]
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist/')
	},
	mode: 'development'
};
