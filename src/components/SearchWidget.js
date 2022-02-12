import React, {forwardRef, useImperativeHandle, useRef} from "react";
import styled from "styled-components";
import SearchBox from "./SearchBox";
import ResultsList from "./ResultsList";
import ResultsListItem from "./ResultsListItem";
import getMatchingItems from "@/scorers/getMatchingItems";


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


export default forwardRef(function SearchWidget(
	{
		query,
		itemsHash,
		scorerConfig,
		selectedIndex,
		setSelectedIndex,
		onQueryChange,
		onKeyDown
	},
	ref)
{
	const resultsListRef = useRef(null);
	const searchBoxRef = useRef(null);
	const [items, ms] = getMatchingItems(query, scorerConfig, itemsHash);
	const count = items.length;
	const countDisplay = `${count} result${count > 1 || count == 0 ? "s" : ""}`;


	useImperativeHandle(ref, () => ({
		scrollToRow(
			row)
		{
			resultsListRef.current.scrollToRow(row);
		},


		scrollByPage(
			direction)
		{
			resultsListRef.current.scrollByPage(direction);
		},


		focus()
		{
			searchBoxRef.current.focus();
		}
	}));


	return (
		<Box>
			<SearchBox
				ref={searchBoxRef}
				query={query}
				scorerName={scorerConfig.name}
				onChange={onQueryChange}
				onKeyDown={onKeyDown}
			/>
			{
				query
					? <SearchTime>{countDisplay} - {ms} ms avg</SearchTime>
					: ""
			}
			<ResultsList
				ref={resultsListRef}
				items={items}
				itemComponent={ResultsListItem}
				query={query}
				maxItems={10}
				selectedIndex={selectedIndex}
				setSelectedIndex={setSelectedIndex}
			/>
		</Box>
	);
});
