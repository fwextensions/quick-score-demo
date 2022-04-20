import React, {
	ComponentType,
	forwardRef,
	useImperativeHandle,
	useRef
} from "react";
import List, {ListRowProps} from "react-virtualized/dist/es/List";
import {ResultsListItemProps} from "@/components/ResultsListItem";
import {IndexRange} from "react-virtualized";


const RowHeight = 45;
const Width = 500;


export interface ResultsListHandle {
	scrollToRow: (row: number) => void,
	scrollByPage: (direction: "up" | "down") => void
}

interface ResultsListProps {
	maxItems?: number,
	itemComponent: ComponentType<ResultsListItemProps>,
	items: any[], // TODO: specify items type
	query: string,
	selectedIndex: number,
	setSelectedIndex: (index: number) => void
}

const ResultsList = forwardRef<ResultsListHandle, ResultsListProps>(function ResultsList(
	{
		maxItems = 20,
		itemComponent: ItemComponent,
		items,
		query,
		selectedIndex,
		setSelectedIndex,
		...props
	},
	ref)
{
	const listRef = useRef<List>(null);
	const startIndex = useRef(0);
	const stopIndex = useRef(0);
	const itemCount = items.length;
	const height = Math.min(itemCount, maxItems) * RowHeight;


	useImperativeHandle(ref, () => ({
		scrollToRow(
			index)
		{
			listRef.current?.scrollToRow(index);
		},


		scrollByPage(
			direction)
		{
			const pageIncrement = Math.min(maxItems, items.length) - 1;
			let newIndex = selectedIndex;

			if (direction === "down") {
				if (selectedIndex === stopIndex.current) {
					newIndex = Math.min(selectedIndex + pageIncrement, items.length - 1);
				} else {
					newIndex = stopIndex.current;
				}
			} else if (selectedIndex === startIndex.current) {
				newIndex = Math.max(selectedIndex - pageIncrement, 0);
			} else {
				newIndex = startIndex.current;
			}

			setSelectedIndex(newIndex);
		}
	}));


	function rowRenderer({
		index,
		key,
		style
	}: ListRowProps)
	{
		const item = items[index];

		return (
			<ItemComponent
				key={key}
				index={index}
				item={item}
				isSelected={selectedIndex === index}
				style={style}
			/>
		);
	}


	function handleRowsRendered(
		event: IndexRange)
	{
			// track the visible rendered rows so we know how to change the
			// selection when the App tells us to page up/down, since the App
			// doesn't know what's visible
		startIndex.current = event.startIndex;
		stopIndex.current = event.stopIndex;
	}


	return (
		<List
			ref={listRef}
			tabIndex={-1}
			width={Width}
			height={height}
			rowCount={itemCount}
			rowHeight={RowHeight}
			rowRenderer={rowRenderer}
			scrollToIndex={selectedIndex}
			onRowsRendered={handleRowsRendered}
			{...props}
		/>
	);
});


export default ResultsList;
