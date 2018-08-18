import React from "react";
import SearchBox from "./SearchBox";
import ResultsList from "./ResultsList";
import bookmarks from "./bookmarks";


export default class App extends React.Component {
	state = {
		query: ""
	};


	constructor(
		props)
	{
		super(props);
	}


	handleKeyDown = (
		event) =>
	{
		if (event.key == "Escape") {
			this.setState({ query: "" });
		}
	};


	handleQueryChange = (
		event) =>
	{
		this.setState({ query: event.target.value });
	};


	render()
	{
		return (
			<div>
				<SearchBox
					query={this.state.query}
					onChange={this.handleQueryChange}
					onKeyDown={this.handleKeyDown}
				/>
				<ResultsList
					items={bookmarks}
					itemComponent={Item}
					maxItems={10}
				/>
			</div>
		);
	}
}


function Item({item, style})
{
	const {title, url} = item;

		// make sure to apply props.style to the row container
	return (
		<div style={style}>
			<div
				style={{
					height: 45,
					padding: ".25em .5em",
					fontSize: 12,
					borderBottom: "1px solid silver",
					overflow: "hidden"
				}}
			>
				<div>{title}</div>
				<div>{url}</div>
			</div>
		</div>
	);
}
