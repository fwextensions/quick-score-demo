import React from "react";
import {QuickScore} from "quick-score";
import Fuse	from "fuse.js";
import SearchWidget from "./SearchWidget";
import bookmarks from "./bookmarks";


const getQSData = ({item: {title, url}, scores, matches}) => ({ title, url, scores, matches });
const getFuseData = ({item: {title, url}, score, matches}) => {
	const matchesHash = {};
	const matchesByKey = {};
	const qsScore = 1 - score;
	const scores = {};
	const bestMatch = matches[0];
	const scoreKey = bestMatch && bestMatch.key || "";

	for	(const match of matches) {
			// add 1 to the end of the range so it can be passed to substring()
		matchesByKey[match.key] = match.indices.map(([start, end]) => [start, end + 1]);
	}

	for	(const key of ["title", "url"]) {
		scores[key] = key == scoreKey ? qsScore : 0;
		matchesHash[key] = matchesByKey[key] || [];
	}

	return {
		title,
		url,
		score: qsScore,
		scoreKey,
		scores,
		matches: matchesHash
	};
};


export default class App extends React.Component {
	state = {
		query: "",
		selectedIndex: -1
	};


	leftWidget = null;
	rightWidget = null;
	leftScorer = new QuickScore(bookmarks, ["title", "url"]);
	rightScorer = new Fuse(bookmarks, {
		keys: ["title", "url"],
		includeMatches: true,
		includeScore: true,
		shouldSort: true
	});


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
					getData={getQSData}
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
					getData={getFuseData}
					onQueryChange={this.handleQueryChange}
					onKeyDown={this.handleKeyDown}
				/>
			</div>
		);
	}
}
