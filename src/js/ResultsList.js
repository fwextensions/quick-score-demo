import React from "react";
import List from "react-virtualized/dist/es/List";


const RowHeight = 45;
const Width = 500;


export default class ResultsList extends React.Component{
	static defaultProps = {
		maxItems: 20
	};


	startIndex = 0;
	stopIndex = 0;
	list = null;


	scrollByPage(
		direction)
	{
		let {items, maxItems, selectedIndex, setSelectedIndex} = this.props;
		const itemCount = Math.min(maxItems, items.length) - 1;

		if (direction == "down") {
			if (selectedIndex == this.stopIndex) {
				selectedIndex = Math.min(selectedIndex + itemCount, items.length - 1);
			} else {
				selectedIndex = this.stopIndex;
			}
		} else {
			if (selectedIndex == this.startIndex) {
				selectedIndex = Math.max(selectedIndex - itemCount, 0);
			} else {
				selectedIndex = this.startIndex;
			}
		}

		setSelectedIndex(selectedIndex);
	}


	scrollToRow(
		index)
	{
		this.list.scrollToRow(index);
	}


	handleListRef = (list) =>
	{
		this.list = list;
	};


	handleRowsRendered = (
		event) =>
	{
			// track the visible rendered rows so we know how to change the
			// selection when the App tells us to page up/down, since it
			// doesn't know what's visible
		this.startIndex = event.startIndex;
		this.stopIndex = event.stopIndex;
	};


	rowRenderer = ({
		index,
		key,
		style}) =>
	{
		const {items, itemComponent:ItemComponent, selectedIndex, query} = this.props;
		const item = items[index];

		return <ItemComponent
			key={key}
			item={item}
			index={index}
			isSelected={selectedIndex == index}
			style={style}
			query={query}
		/>
	};


	render()
	{
		var props = this.props,
			itemCount = props.items.length,
			height = Math.min(itemCount, props.maxItems) * RowHeight;

		return (
			<List
				ref={this.handleListRef}
				tabIndex={-1}
				width={Width}
				height={height}
				rowCount={itemCount}
				rowHeight={RowHeight}
				rowRenderer={this.rowRenderer}
				scrollToIndex={props.selectedIndex}
				onRowsRendered={this.handleRowsRendered}
				{...props}
			/>
		);
	}
}
