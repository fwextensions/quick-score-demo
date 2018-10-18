const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
//const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const {getIfUtils, removeEmpty} = require("webpack-config-utils");


module.exports = (env, argv) => {
	const {ifProduction} = getIfUtils(argv.mode);

	return {
		devtool: ifProduction() ? "source-map" : "eval-sourcemap",
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
			new CleanWebpackPlugin(["dist"]),
			new CopyWebpackPlugin([
				{ from: "./src/css/", to: "css" }
			]),
			new HtmlWebpackPlugin({
				template: "./src/index.html",
				filename: "index.html"
			})
		]
	}
};
