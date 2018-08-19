import React from "react";
import SearchBox from "./SearchBox";
import ResultsList from "./ResultsList";
import ResultsListItem from "./ResultsListItem";
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
					itemComponent={ResultsListItem}
					maxItems={10}
				/>
			</div>
		);
	}
}
