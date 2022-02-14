const path = require("path");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
//const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const {getIfUtils} = require("webpack-config-utils");


module.exports = (env) => {
	const {ifProduction} = getIfUtils(env);

	return {
		devtool: ifProduction("source-map", "eval-source-map"),
		entry: "./src/index.js",
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "src"),
			},
		},
		output: {
			path: __dirname + "/dist",
			filename: "bundle.js"
		},
		devServer: {
			static: {
				directory: "./dist"
			}
		},
		stats: {
				// log the build time in the console
			builtAt: true
		},
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
		plugins: [
			new CleanWebpackPlugin(),
			new CopyWebpackPlugin({
				patterns: [
					{ from: "./src/css/", to: "css" }
				]
			}),
			new HtmlWebpackPlugin({
				template: "./src/index.html",
				filename: "index.html",
				minify: false,
					// add a timestamp that's injected into an HTML comment
				buildTime: new Date().toISOString()
			})
		]
	}
};
