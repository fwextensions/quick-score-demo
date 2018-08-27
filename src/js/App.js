import React from "react";
import {createScorer, quickScore, quickeyQuickScore} from "quick-score";
import SearchWidget from "./SearchWidget";
import {qkQuickScore} from "./qk-quick-score";
import bookmarks from "./bookmarks";


function clone(
	obj)
{
	return JSON.parse(JSON.stringify(obj));
}


export default class App extends React.Component {
	state = {
		query: ""
	};


	leftWidget = null;
	rightWidget = null;
	leftBookmarks = clone(bookmarks);
	rightBookmarks = clone(bookmarks);
	leftScorer = createScorer(["title", "url"], quickeyQuickScore);
	rightScorer = createScorer(["title", "url"], qkQuickScore);
//	leftScorer = createScorer(["title", "url"], quickScore);
//	rightScorer = createScorer(["title", "url"], quickeyQuickScore);


	constructor(
		props)
	{
		super(props);
	}


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
		if (event.key == "Escape") {
			this.setState({ query: "" });
		}
	};


	handleQueryChange = (
		event) =>
	{
		this.setState({
			query: event.target.value
		});

			// reset the scroll to show the first match
		this.leftWidget.scrollToRow(0);
		this.rightWidget.scrollToRow(0);
	};


	render()
	{
		const {query} = this.state;

		return (
			<div>
				<SearchWidget
					ref={this.handleLeftWidgetRef}
					query={query}
					items={this.leftBookmarks}
					scorer={this.leftScorer}
					minScore={0}
					onQueryChange={this.handleQueryChange}
					onKeyDown={this.handleKeyDown}
				/>
				<SearchWidget
					ref={this.handleRightWidgetRef}
					query={query}
					items={this.rightBookmarks}
					scorer={this.rightScorer}
					minScore={0}
					onQueryChange={this.handleQueryChange}
					onKeyDown={this.handleKeyDown}
				/>
			</div>
		);
	}
}
