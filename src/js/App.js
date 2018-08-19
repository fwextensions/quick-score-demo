import React from "react";
import SearchBox from "./SearchBox";
import ResultsList from "./ResultsList";
import ResultsListItem from "./ResultsListItem";
import {createScorer} from "quick-score/lib";
import bookmarks from "./bookmarks";


const MinScore = .5;
const score = createScorer(["title", "url"]);


export default class App extends React.Component {
	state = {
		query: "",
		items: []
	};


	constructor(
		props)
	{
		super(props);

		this.state.items = this.getMatchingItems("");
	}


	getMatchingItems(
		query)
	{
		const items = score(bookmarks, query);

		return items.filter(({score}) => score > MinScore);
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
		const query = event.target.value;

		this.setState({
			query,
			items: this.getMatchingItems(query)
		});
	};


	render()
	{
		const {query, items} = this.state;

		return (
			<div>
				<SearchBox
					query={query}
					onChange={this.handleQueryChange}
					onKeyDown={this.handleKeyDown}
				/>
				<ResultsList
					items={items}
					itemComponent={ResultsListItem}
					maxItems={10}
				/>
			</div>
		);
	}
}
