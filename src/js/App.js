import React from "react";
import {QuickScore} from "quick-score";
import Fuse	from "fuse.js";
import LiquidMetal from "liquidmetal";
import SearchWidget from "./SearchWidget";
import FuzzySort from "./FuzzySort";
import {createFuse, createFuzzysort, createQuickScore} from "./convert-items";
import bookmarks from "./bookmarks";


const Keys = ["title", "url"];


export default class App extends React.Component {
	state = {
		query: "",
		selectedIndex: -1
	};


	leftWidget = null;
	rightWidget = null;
	leftScorer = new QuickScore(bookmarks, Keys);
//	rightScorer = new Fuse(bookmarks, {
//		keys: ["title", "url"],
//		includeMatches: true,
//		includeScore: true,
//		shouldSort: true
//	});
	rightScorer = new FuzzySort(bookmarks, { keys: Keys });
//	rightScorer = new QuickScore(bookmarks, {
//		keys: Keys,
//		scorer: (...args) => LiquidMetal.score(...args)
//	});
	leftConverter = createQuickScore(Keys);
//	rightConverter = createFuse(Keys);
	rightConverter = createFuzzysort(Keys);
//	rightConverter = createQuickScore(Keys);


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
					convertItems={this.leftConverter}
					onQueryChange={this.handleQueryChange}
					onKeyDown={this.handleKeyDown}
				/>
				<SearchWidget
					ref={this.handleRightWidgetRef}
					query={query}
					scorer={this.rightScorer}
					minScore={-Infinity}
					selectedIndex={selectedIndex}
					setSelectedIndex={this.setSelectedIndex}
					convertItems={this.rightConverter}
					onQueryChange={this.handleQueryChange}
					onKeyDown={this.handleKeyDown}
				/>
			</div>
		);
	}
}
