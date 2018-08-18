const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
//const {getIfUtils, removeEmpty} = require("webpack-config-utils");


module.exports = (env, argv) => {
//	const {ifProduction, ifNotProduction} = getIfUtils(argv.mode);

	return {
//		devtool: ifProduction() ? "source-map" : "eval-sourcemap",
		devtool: "eval-sourcemap",
		entry: "./src/js/index.js",
		module: {
			rules: [
				{
					test: /\.css$/,
					use: ["style-loader", "css-loader"]
				},
				{
					test: /\.(js|jsx)$/,
					exclude: /node_modules/,
					use: ["babel-loader"]
				}
			]
		},
		resolve: {
			extensions: ["*", ".js", ".jsx"]
		},
		output: {
			path: __dirname + "/dist",
			filename: "bundle.js"
		},
		devServer: {
			contentBase: "./dist"
		},
		plugins: [
//		plugins: removeEmpty([
//			new BundleAnalyzerPlugin(),
			new CleanWebpackPlugin(["dist"]),
//			new CopyWebpackPlugin(removeEmpty([
//				ifNotProduction({ from: "./src/manifest.json", to: "." }),
//				{ from: "./src/css/", to: "css" },
//				{ from: "./node_modules/bootstrap/dist/css/bootstrap.css", to: "css" },
//				{ from: "./src/img/", to: "img" }
//			])),
			new CopyWebpackPlugin([
				{ from: "./src/css/", to: "css" }
			]),
			new HtmlWebpackPlugin({
				template: "./src/index.html",
				filename: "index.html"
//				chunks: ["js/evaluate"]
			})
		]
//		])
	}
};