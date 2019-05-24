import React from "react";
import styled from "styled-components";
import memoize from "fast-memoize";
import SearchBox from "./SearchBox";
import ResultsList from "./ResultsList";
import ResultsListItem from "./ResultsListItem";


const Box = styled.div`
	font-size: 14px;
	border: 1px solid #ccc;
	padding: 7px;
	vertical-align: top;
	display: inline-block;
	position: relative;
	& ~ & {
		margin-left: 30px;
	} 
`;
const SearchTime = styled.div`
	top: 9px; 
	right: 30px;
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
		scorerName,
			// this param isn't used, but it's included so that if the items
			// change, memoize() won't return the old result
		itemsHash) =>
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
			itemsHash,
			scorerConfig: {name: scorerName},
			selectedIndex,
			setSelectedIndex,
			onQueryChange,
			onKeyDown
		} = this.props;
		const items = this.getMatchingItems(query, scorerName, itemsHash);
			// get the search timing after calling getMatchingItems() so that we
			// don't miss the first call to it made after load
		const totalMS = this.times[scorerName];
		const searchCount = this.searchCounts[scorerName];
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
					scorerName={scorerName}
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
