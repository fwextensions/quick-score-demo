import React from "react";
import styled from "styled-components";
import ScorerSelector from "./ScorerSelector";
import SearchWidget from "./SearchWidget";
import ItemsEditor from "./ItemsEditor";
import scorers from "./scorers";
import Bookmarks from "./Bookmarks";


const AppContainer = styled.div`
	border-top: 1px solid #aaa;
	padding: 2em 0;
`;
const Title = styled.h2`
	font-size: 2em;
	margin: 0 0 1em 0;
	& ~ p {
		font-size: 1.25em;
		margin-bottom: 2em;
	}	
`;


export default class App extends React.Component {
	state = {
		query: "",
		itemsHash: Bookmarks.hash,
		selectedIndex: -1,
		selectedConfig: scorers[1]
	};


	leftWidget = null;
	rightWidget = null;
	leftScorerConfig = scorers[0];
	scorerConfigs = scorers.slice(1);


	setSelectedIndex = (
		index) =>
	{
		this.setState({ selectedIndex: index });
	};


	setItems = (
		items) =>
	{
			// update the Bookmarks singleton, and then update all of the
			// scorers, so that when the user switches to a different one, it's
			// got the right items
		Bookmarks.setItems(items);
		scorers.forEach(scorer => scorer.update(Bookmarks.items));

		this.setState({
				// use a hash of the JSON text, so that the memoized search
				// function in SearchWidget will return a different value when
				// the items are changed.  this is faster than making memoize()
				// run stringify on the whole items array every time.
			itemsHash: Bookmarks.hash
		});
	};


	handleScorerChange = (
		selectedConfig) =>
	{
		this.setState({
			selectedConfig,
			query: ""
		});
		this.leftWidget.focus();
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
		let cancel = true;

		switch (event.key) {
			case "Escape":
				this.setState({ query: "" });
				break;

			case "ArrowDown":
				this.setState({ selectedIndex: Math.min(selectedIndex + 1, Bookmarks.items.length) });
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

			default:
				cancel = false;
				break;
		}

		if (cancel) {
				// don't scroll the page when the user is paging up/down
			event.preventDefault();
		}
	};


	handleQueryChange = (
		{target}) =>
	{
console.time("search");

		this.setState({
			query: target.value,
			selectedIndex: 0
		});

			// reset the scroll to show the first match
		this.leftWidget.scrollToRow(0);
		this.rightWidget.scrollToRow(0);
	};


	handleKbdClick = (
		{target}) =>
	{
		if (target.tagName == "KBD") {
			this.leftWidget.focus();
			this.handleQueryChange({
				target: {
					value: target.textContent
				}
			});
		}
	};


	render()
	{
		const {
			itemsHash,
			query,
			selectedIndex,
			selectedConfig: rightScorerConfig
		} = this.state;

		const result =(
			<AppContainer>
				<Title id="demo">Demo</Title>
				<p>
					Type a query in either search box below to use QuickScore to
					match and sort bookmarks on the left, and choose among other
					scoring algorithms on the right.  Your typed query will be
					matched against the title and URL of about 300 bookmarks.
					Click text formatted as <kbd>keycaps</kbd> to quickly set
					the query to that string.  Edit the bookmarks <a href="#editor">below</a>.
				</p>
				<ScorerSelector
					scorers={this.scorerConfigs}
					onChange={this.handleScorerChange}
					onKbdClick={this.handleKbdClick}
				/>
				<div>
					<SearchWidget
						ref={this.handleLeftWidgetRef}
						itemsHash={itemsHash}
						query={query}
						scorerConfig={this.leftScorerConfig}
						selectedIndex={selectedIndex}
						setSelectedIndex={this.setSelectedIndex}
						onQueryChange={this.handleQueryChange}
						onKeyDown={this.handleKeyDown}
					/>
{
					<SearchWidget
						ref={this.handleRightWidgetRef}
						itemsHash={itemsHash}
						query={query}
						scorerConfig={rightScorerConfig}
						selectedIndex={selectedIndex}
						setSelectedIndex={this.setSelectedIndex}
						onQueryChange={this.handleQueryChange}
						onKeyDown={this.handleKeyDown}
					/>
}
				</div>
{/*
				<ItemsEditor
					itemsJSON={Bookmarks.toString()}
					setItems={this.setItems}
				/>
*/}
			</AppContainer>
		);
console.timeEnd("search");

		return result;
	}
}
