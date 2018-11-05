import React from "react";
import styled from "styled-components";
import ScorerSelector from "./ScorerSelector";
import SearchWidget from "./SearchWidget";
import scorers from "./scorers";
import bookmarks from "./bookmarks";


const AppContainer = styled.div`
	border-top: 1px solid #aaa;
	padding: 2em 0;
`;
const Title = styled.h2`
	font-size: 1.25em;
	margin: 0 0 1.5em 0;
	& ~ p {
		margin-bottom: 3em;
	}	
`;


export default class App extends React.Component {
	state = {
		query: "",
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
		const {
			query,
			selectedIndex,
			selectedConfig: rightScorerConfig
		} = this.state;

		return (
			<AppContainer>
				<Title id="demo">Demo</Title>
				<p>
					Below you can test the QuickScore algorithm and compare it
					to some other string-scoring libraries.  Typing a query in
					either search box will use QuickScore to match and sort
					bookmarks on the left, while you can choose among other
					scoring algorithms on the right.  Your typed query will be
					matched against the title and URL of about 300 bookmarks.
				</p>
				<ScorerSelector
					scorers={this.scorerConfigs}
					onChange={this.handleScorerChange}
				/>
				<div>
					<SearchWidget
						ref={this.handleLeftWidgetRef}
						query={query}
						scorerConfig={this.leftScorerConfig}
						selectedIndex={selectedIndex}
						setSelectedIndex={this.setSelectedIndex}
						onQueryChange={this.handleQueryChange}
						onKeyDown={this.handleKeyDown}
					/>
					<SearchWidget
						ref={this.handleRightWidgetRef}
						query={query}
						scorerConfig={rightScorerConfig}
						selectedIndex={selectedIndex}
						setSelectedIndex={this.setSelectedIndex}
						onQueryChange={this.handleQueryChange}
						onKeyDown={this.handleKeyDown}
					/>
				</div>
			</AppContainer>
		);
	}
}
