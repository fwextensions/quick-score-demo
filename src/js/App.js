import React from "react";
import {QuickScore, QuicksilverConfig} from "quick-score";
import SearchWidget from "./SearchWidget";
import bookmarks from "./bookmarks";


export default class App extends React.Component {
	state = {
		query: "",
		selectedIndex: -1
	};


	leftWidget = null;
	rightWidget = null;
	leftScorer = new QuickScore(bookmarks, ["title", "url"]);
	rightScorer = new QuickScore(bookmarks, {
		keys: ["title", "url"],
		config: QuicksilverConfig
	});


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
