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
	position: relative;
`;
const SearchTime = styled.div`
	top: 9px; 
	right: 35px;
	text-align: right;
	font-style: italic;
	font-size: smaller;
	color: #aaa;
	position: absolute; 
`;


export default class SearchWidget extends React.PureComponent {
	resultsList = null;


	constructor(
		props)
	{
		super(props);
		this.totalMS = 0;
		this.searchCount = 0;
	}


	getMatchingItems(
		query)
	{
		const {scorer, minScore} = this.props;
		const start = performance.now();
		const matchingItems = scorer.search(query);

			// track every query to get an average time
		this.totalMS += performance.now() - start;
		this.searchCount++;

			// don't filter 0 scores when the query is empty
		return matchingItems.filter(({score}) => !query || score > minScore);
	}


	scrollToRow(
		row)
	{
		this.resultsList.scrollToRow(row);
	}


	scrollByPage(
		direction)
	{
		this.resultsList.scrollByPage(direction);
	}


	handleResultsListRef = (
		ref) =>
	{
		this.resultsList = ref;
	};


	render()
	{
		const {query, selectedIndex, setSelectedIndex, getData, onQueryChange, onKeyDown} = this.props;
		const items = this.getMatchingItems(query);
		const count = items.length;
		const countDisplay = `${count} result${count > 1 || count == 0 ? "s" : ""}`;
			// limit the time to 1 decimal point, but convert the string back to
			// a number so that 1.0 becomes 1
		const ms = +(this.totalMS / this.searchCount).toFixed(1);

		return (
			<Box>
				<SearchBox
					query={query}
					onChange={onQueryChange}
					onKeyDown={onKeyDown}
				/>
				{
					query
					? <SearchTime>{countDisplay} - {ms} ms avg</SearchTime>
					: ""
				}
				<ResultsList
					ref={this.handleResultsListRef}
					items={items}
					itemComponent={ResultsListItem}
					query={query}
					maxItems={10}
					selectedIndex={selectedIndex}
					setSelectedIndex={setSelectedIndex}
					getData={getData}
				/>
			</Box>
		);
	}
}
