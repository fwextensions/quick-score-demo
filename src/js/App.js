import React from "react";
import {createScorer, quickScore, QuicksilverConfig} from "quick-score";
import SearchWidget from "./SearchWidget";
import bookmarks from "./bookmarks";


function clone(
	obj)
{
	return JSON.parse(JSON.stringify(obj));
}


export default class App extends React.Component {
	state = {
		query: "",
		selectedIndex: -1
	};


	leftWidget = null;
	rightWidget = null;
	leftBookmarks = clone(bookmarks);
	rightBookmarks = clone(bookmarks);
	leftScorer = createScorer(["title", "url"], quickScore);
	rightScorer = createScorer(["title", "url"], quickScore, QuicksilverConfig);


	constructor(
		props)
	{
		super(props);
	}


	setSelectedIndex = (
		index) =>
	{
		this.setState({ selectedIndex: index });
	};


	handleLeftWidgetRef = (
		ref) =>
	{
		this.leftWidget = ref;
	};


	handleRightWidgetRef = (
		ref) =>
	{
		this.rightWidget = ref;
	};


	handleKeyDown = (
		event) =>
	{
		const {selectedIndex} = this.state;

		switch (event.key) {
			case "Escape":
				this.setState({ query: "" });
				break;

			case "ArrowDown":
				this.setState({ selectedIndex: Math.min(selectedIndex + 1, bookmarks.length) });
				break;

			case "ArrowUp":
				this.setState({ selectedIndex: Math.max(selectedIndex - 1, 0) });
				break;

			case "PageDown":
				this.leftWidget.scrollByPage("down");
				this.rightWidget.scrollByPage("down");
				break;

			case "PageUp":
				this.leftWidget.scrollByPage("up");
				this.rightWidget.scrollByPage("up");
				break;
		}
	};


	handleQueryChange = (
		event) =>
	{
		this.setState({
			query: event.target.value,
			selectedIndex: 0
		});

			// reset the scroll to show the first match
		this.leftWidget.scrollToRow(0);
		this.rightWidget.scrollToRow(0);
	};


	render()
	{
		const {query, selectedIndex} = this.state;

		return (
			<div>
				<SearchWidget
					ref={this.handleLeftWidgetRef}
					query={query}
					items={this.leftBookmarks}
					scorer={this.leftScorer}
					minScore={0}
					selectedIndex={selectedIndex}
					setSelectedIndex={this.setSelectedIndex}
					onQueryChange={this.handleQueryChange}
					onKeyDown={this.handleKeyDown}
				/>
				<SearchWidget
					ref={this.handleRightWidgetRef}
					query={query}
					items={this.rightBookmarks}
					scorer={this.rightScorer}
					minScore={0}
					selectedIndex={selectedIndex}
					setSelectedIndex={this.setSelectedIndex}
					onQueryChange={this.handleQueryChange}
					onKeyDown={this.handleKeyDown}
				/>
			</div>
		);
	}
}
