const path = require("path");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
//const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const {getIfUtils} = require("webpack-config-utils");


	// we don't access the argv param here because including it confuses Webstorm
	// and causes it to not parse this config
module.exports = env => {
	const {ifProduction} = getIfUtils(env);

	return {
		mode: ifProduction("production", "development"),
		devtool: ifProduction("source-map", "eval-source-map"),
		entry: "./src/index.tsx",
		resolve: {
			extensions: [".ts", ".tsx", "..."],
			alias: {
				"@": path.resolve(__dirname, "src")
			}
		},
		output: {
			path: __dirname + "/dist",
			filename: "bundle.js"
		},
		devServer: {
			port: 3100,
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
					test: /\.tsx?$/,
					loader: "ts-loader"
				},
				{
					test: /\.js$/,
					loader: "source-map-loader"
				},
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
	};
};
