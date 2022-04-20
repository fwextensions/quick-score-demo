import React, {forwardRef, useImperativeHandle, useRef} from "react";
import styled from "styled-components";
import {Adapter} from "@/adapters/Adapter";
import SearchBox, {SearchBoxHandle} from "./SearchBox";
import ResultsList, {ResultsListHandle} from "./ResultsList";
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


export interface SearchWidgetHandle extends ResultsListHandle {
	focus: () => void
}

interface SearchWidgetProps {
	query: string,
	adapter: Adapter,
	selectedIndex: number,
	setSelectedIndex: (i: number) => void,
	onQueryChange: (e: React.ChangeEvent) => void,
	onKeyDown: (e: React.KeyboardEvent) => void
}

const SearchWidget = forwardRef<SearchWidgetHandle, SearchWidgetProps>(function SearchWidget(
	{
		query,
		adapter,
		selectedIndex,
		setSelectedIndex,
		onQueryChange,
		onKeyDown
	},
	ref)
{
	const resultsListRef = useRef<ResultsListHandle>(null);
	const searchBoxRef = useRef<SearchBoxHandle>(null);
	const items = adapter.search(query);
	const count = items.length;
	const countDisplay = `${count} result${count > 1 || count === 0 ? "s" : ""}`;
		// don't let the selection go beyond the last item in this SearchWidget,
		// even if the other one has more items
	const maxIndex = Math.min(selectedIndex, count - 1);


	useImperativeHandle(ref, () => ({
		scrollToRow(
			row)
		{
			resultsListRef.current?.scrollToRow(row);
		},


		scrollByPage(
			direction)
		{
			resultsListRef.current?.scrollByPage(direction);
		},


		focus()
		{
			searchBoxRef.current?.focus();
		}
	}));


	return (
		<Box>
			<SearchBox
				ref={searchBoxRef}
				query={query}
				scorerName={adapter.name}
				onChange={onQueryChange}
				onKeyDown={onKeyDown}
			/>
			{
				query
					? <SearchTime>{countDisplay} - {adapter.averageTime} ms avg</SearchTime>
					: ""
			}
			<ResultsList
				ref={resultsListRef}
				items={items}
				itemComponent={ResultsListItem}
				query={query}
				maxItems={10}
				selectedIndex={maxIndex}
				setSelectedIndex={setSelectedIndex}
			/>
		</Box>
	);
});


export default SearchWidget;
