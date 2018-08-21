import React from "react";
import styled from "styled-components";
import SearchBox from "./SearchBox";
import ResultsList from "./ResultsList";
import ResultsListItem from "./ResultsListItem";
import {createScorer} from "quick-score/lib";
import bookmarks from "./bookmarks";


const MinScore = .75;
const score = createScorer(["title", "url"]);


const Box = styled.div`
	border: 1px solid #ccc;
	padding: .5em;
	margin: 1em;
	display: inline-block;
`;


export default class App extends React.Component {
	state = {
		query: "",
		items: []
	};


	resultsList = null;


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


	handleResultsListRef = (
		ref) =>
	{
		this.resultsList = ref;
	};


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

			// reset the scroll to show the first match
		this.resultsList.scrollToRow(0);
	};


	render()
	{
		const {query, items} = this.state;

		return (
			<Box>
				<SearchBox
					query={query}
					onChange={this.handleQueryChange}
					onKeyDown={this.handleKeyDown}
				/>
				<ResultsList
					ref={this.handleResultsListRef}
					items={items}
					itemComponent={ResultsListItem}
					query={query}
					maxItems={10}
				/>
			</Box>
		);
	}
}
