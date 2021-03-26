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
const SpacePattern = /\s+/;


function compareByTitle(
	a,
	b)
{
		// use the lowercase versions of the strings for sorting
	const itemA = a._;
	const itemB = b._;
	const itemAString = typeof itemA == "string" ? itemA :
		itemA.title;
	const itemBString = typeof itemB == "string" ? itemB :
		itemB.title;

		// sort undefineds to the end of the array, as per the ES spec
	if (itemAString === undefined || itemBString === undefined) {
		if (itemAString === undefined && itemBString === undefined) {
			return 0;
		} else if (itemAString == undefined) {
			return 1;
		} else {
			return -1;
		}
	} else if (itemAString == itemBString) {
		return 0;
	} else if (itemAString < itemBString) {
		return -1;
	} else {
		return 1;
	}
}


function compareRanges(
	[a],
	[b])
{
	return a - b;
}


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
console.log(query, end - start);

		if (!times[scorerName]) {
			times[scorerName] = 0;
			searchCounts[scorerName] = 0;
		}

			// track every query to get an average time per scorer
		times[scorerName] += end - start;
		searchCounts[scorerName]++;

		return converter(matchingItems);
	});


	processQuery = memoize((
		query,
		scorerName,
		itemsHash) =>
	{
		const {scorerConfig: {scorer}} = this.props;
		const tokens = query.split(SpacePattern).filter(token => token);
		const tokenCount = tokens.length;

		if (scorerName == "QuickScore" && tokenCount > 1) {
// TODO: need to remove matching chars from lc string before next call to getMatchingItems
// but if you type the same string in two tokens, the memoized result from the first token will be returned for the second,
// but the matches should be different
			const tokenResults = tokens.map(token => this.getMatchingItems(token, scorerName, itemsHash).sort(compareByTitle));
			const [firstResults] = tokenResults;
			const keys = scorer.keys.map(({name}) => name);
			const keyCount = keys.length;
			const results = [];

			for (let i = 0, len = firstResults.length; i < len; i++) {
				const item = firstResults[i];
				const scores = {};
				const matches = {};
				let scoreKey = "";
				let highScore = 0;

				for (let k = 0; k < keyCount; k++) {
					const key = keys[k];
					const keyMatches = [];
					let score = 0;
					let tokenMatchCount = 0;

					for (let j = 0; j < tokenCount; j++) {
						const tokenItem = tokenResults[j][i];
						const keyScore = tokenItem.scores[key];

						score += keyScore;

						if (keyScore) {
							tokenMatchCount++;
console.log(tokens[j], tokenResults[j][i], key);
							keyMatches.push(...tokenItem.matches[key]);
console.log(key, keyScore, item.item[key], tokenItem.matches[key], keyMatches);
						}
					}

					if (tokenMatchCount == tokenCount) {
						scores[key] = score / tokenCount;
						matches[key] = keyMatches.sort(compareRanges);
						console.log(key, item.item[key], matches[key]);

						if (scores[key] > highScore) {
							highScore = scores[key];
							scoreKey = key;
						}
					} else {
						scores[key] = 0;
						matches[key] = [];
					}
				}

				results.push({
					...item,
					score: highScore,
					scoreKey,
					scores,
					matches
				});
//				item.score = highScore;
//				item.scores = scores;
//				item.matches = matches;
//				item.scoreKey = scoreKey;
			}

			return results.sort(scorer.compareScoredStrings);
//			return firstResults.sort(scorer.compareScoredStrings);
		} else {
			return this.getMatchingItems(tokens[0] || "", scorerName, itemsHash);
		}
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
		const items = this.processQuery(query, scorerName, itemsHash);
//		const items = this.getMatchingItems(query, scorerName, itemsHash);
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
