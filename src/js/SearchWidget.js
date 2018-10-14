import React from "react";
import styled from "styled-components";
import memoize from "fast-memoize";
import SearchBox from "./SearchBox";
import ResultsList from "./ResultsList";
import ResultsListItem from "./ResultsListItem";


const Box = styled.div`
	font-size: 14px;
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
	searchBox = null;


	constructor(
		...args)
	{
		super(...args);

		this.times = {};
		this.searchCounts = {};
	}


	getMatchingItems = memoize((
		query,
			// although scorerName could be retrieved inside getMatchingItems,
			// we pass it in from render() so that memoize() distinguishes the
			// same queries on different scorers
		scorerName) =>
	{
		const {
			scorerConfig: {
				scorer,
				converter
			}
		} = this.props;
		const {
			times,
			searchCounts
		} = this;
		const start = performance.now();
		const matchingItems = scorer.search(query);
		const end = performance.now();

		if (!times[scorerName]) {
			times[scorerName] = 0;
			searchCounts[scorerName] = 0;
		}

			// track every query to get an average time per scorer
		times[scorerName] += end - start;
		searchCounts[scorerName]++;

		return converter(matchingItems);
	});


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


	focus()
	{
		this.searchBox.focus();
	}


	handleSearchBoxRef = (
		ref) =>
	{
		this.searchBox = ref;
	};


	handleResultsListRef = (
		ref) =>
	{
		this.resultsList = ref;
	};


	render()
	{
		const {
			query,
			scorerConfig: {name: scorerName},
			selectedIndex,
			setSelectedIndex,
			onQueryChange,
			onKeyDown
		} = this.props;
		const totalMS = this.times[scorerName];
		const searchCount = this.searchCounts[scorerName];
		const items = this.getMatchingItems(query, scorerName);
		const count = items.length;
		const countDisplay = `${count} result${count > 1 || count == 0 ? "s" : ""}`;
			// limit the time to 1 decimal point, but convert the string back to
			// a number so that 1.0 becomes 1
		const ms = +(totalMS / searchCount).toFixed(1);

		return (
			<Box>
				<SearchBox
					ref={this.handleSearchBoxRef}
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
				/>
			</Box>
		);
	}
}
