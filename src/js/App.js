import React from "react";
import ScorerSelector from "./ScorerSelector";
import SearchWidget from "./SearchWidget";
import scorers from "./scorers";
import bookmarks from "./bookmarks";


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


	componentDidMount() {
		this.leftWidget.focus();
	}


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
		this.rightWidget.focus();
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
		const {
			query,
			selectedIndex,
			selectedConfig: rightScorerConfig
		} = this.state;

		return (
			<div>
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
			</div>
		);
	}
}
