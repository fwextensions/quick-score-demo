import React from "react";
import List from "react-virtualized/dist/es/List";


const RowHeight = 45;
const Width = 600;


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
		var props = this.props,
			selectedIndex = props.selectedIndex,
			items = props.items,
			itemCount = Math.min(props.maxItems, items.length) - 1;

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

		props.setSelectedIndex(selectedIndex);
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


	rowRenderer = (
		data) =>
	{
		var props = this.props,
			item = props.items[data.index],
			ItemComponent = item.component || props.itemComponent;

		return <ItemComponent
			key={data.key}
			item={item}
			index={data.index}
			isSelected={props.selectedIndex == data.index}
			style={data.style}
			{...props}
		/>
	};


	render()
	{
		var props = this.props,
			itemCount = props.items.length,
			height = Math.min(itemCount, props.maxItems) * RowHeight,
			style = {
				display: height ? "block" : "none"
			};

		return (
			<div className="results-list-container"
				style={style}
			>
				<List
					ref={this.handleListRef}
					className="results-list"
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
			</div>
		);
	}
}
