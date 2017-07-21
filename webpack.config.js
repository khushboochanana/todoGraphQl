(function () {
	'use strict';
	var webpack = require('webpack');

	module.exports =
	{
		entry: './server.js',
		output: {
			// path is required or the dev server will break
			path: "/dist",
			filename: 'bundle.js'
		},
		module: {
			loaders: [
				{ test: /\.jsx$/, loader: "jsx-loader" }
			]
		},
		resolve: {
			extensions: ['*', '.js', '.jsx']
		},

		devServer: {
			historyApiFallback: true,
			hot: true,
			inline: true,
			stats: {
				colors: true
			},
			host: 'localhost', // Defaults to `localhost`
			port: 3000, // Defaults to 8080
			proxy: {
				'^/api/*': {
					target: 'http://localhost:8080/api/',
					secure: false
				}
			}
		},
		// and separately, in your plugins section
		plugins: [
			new webpack.HotModuleReplacementPlugin({
				multiStep: true
			})
		],
		node: {
			fs: 'empty',
			net: 'empty',
			tls: 'empty',
			dns: 'empty'
		}
	}

}());