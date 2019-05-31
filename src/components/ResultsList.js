import React, {forwardRef, useImperativeHandle, useRef} from "react";
import List from "react-virtualized/dist/es/List";


const RowHeight = 45;
const Width = 500;


export default forwardRef(function ResultsList(
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
	const listRef = useRef(null);
	const startIndex = useRef(0);
	const stopIndex = useRef(0);
	const itemCount = items.length;
	const height = Math.min(itemCount, maxItems) * RowHeight;


	useImperativeHandle(ref, () => ({
		scrollToRow(
			index)
		{
			listRef.current.scrollToRow(index);
		},


		scrollByPage(
			direction)
		{
			const itemCount = Math.min(maxItems, items.length) - 1;
			let newIndex = selectedIndex;

			if (direction == "down") {
				if (selectedIndex === stopIndex.current) {
					newIndex = Math.min(selectedIndex + itemCount, items.length - 1);
				} else {
					newIndex = stopIndex.current;
				}
			} else {
				if (selectedIndex === startIndex.current) {
					newIndex = Math.max(selectedIndex - itemCount, 0);
				} else {
					newIndex = startIndex.current;
				}
			}

			setSelectedIndex(newIndex);
		}
	}));


	const rowRenderer = ({
		index,
		key,
		style}) =>
	{
		const item = items[index];

		return <ItemComponent
			key={key}
			index={index}
			item={item}
			isSelected={selectedIndex === index}
			style={style}
			query={query}
		/>
	};


	const handleRowsRendered = (
		event) =>
	{
			// track the visible rendered rows so we know how to change the
			// selection when the App tells us to page up/down, since the App
			// doesn't know what's visible
		startIndex.current = event.startIndex;
		stopIndex.current = event.stopIndex;
	};


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