import React from "react";
import styled from "styled-components";
import SearchBox from "./SearchBox";
import ResultsList from "./ResultsList";
import ResultsListItem from "./ResultsListItem";


const Box = styled.div`
	border: 1px solid #ccc;
	padding: .5em;
	margin: 1em;
	vertical-align: top;
	display: inline-block;
`;


export default class SearchWidget extends React.PureComponent {
	resultsList = null;


	constructor(
		props)
	{
		super(props);
	}


	getMatchingItems(
		query,
		items)
	{
		const {scorer, minScore} = this.props;
		const matchingItems = scorer(items, query);

			// don't filter 0 scores when the query is empty
		return matchingItems.filter(({score}) => !query || score > minScore);
	}


	scrollToRow(
		row)
	{
		this.resultsList.scrollToRow(row);
	}


	handleResultsListRef = (
		ref) =>
	{
		this.resultsList = ref;
	};


	render()
	{
		const {query, items, onQueryChange, onKeyDown} = this.props;

		return (
			<Box>
				<SearchBox
					query={query}
					onChange={onQueryChange}
					onKeyDown={onKeyDown}
				/>
				<ResultsList
					ref={this.handleResultsListRef}
					items={this.getMatchingItems(query, items)}
					itemComponent={ResultsListItem}
					query={query}
					maxItems={10}
				/>
			</Box>
		);
	}
}