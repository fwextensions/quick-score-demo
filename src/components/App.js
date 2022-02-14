import React, {useCallback, useRef, useState} from "react";
import styled from "styled-components";
import ScorerSelector from "./ScorerSelector";
import SearchWidget from "./SearchWidget";
import ItemsEditor from "./ItemsEditor";
import scorers from "@/scorers/scorers";
import Bookmarks from "@/data/Bookmarks";


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


const leftScorerConfig = scorers[0];
const scorerConfigs = scorers.slice(1);


export default function App()
{
	const [query, setQuery] = useState("");
	const [selectedIndex, setSelectedIndex] = useState(-1);
	const [rightScorerConfig, setRightScorerConfig] = useState(scorers[1]);
	const [itemsHash, setItemsHash] = useState(Bookmarks.hash);
	const leftWidgetRef = useRef(null);
	const rightWidgetRef = useRef(null);

	const setItems = useCallback(
		items =>
	{
			// update the Bookmarks singleton, and then update all of the
			// scorers, so that when the user switches to a different one, it's
			// got the right items
		Bookmarks.setItems(items);
		scorers.forEach(scorer => scorer.update(Bookmarks.items));

			// use a hash of the JSON text, so that the memoized search
			// function in SearchWidget will return a different value when
			// the items are changed.  this is faster than making memoize()
			// run stringify on the whole items array every time.
		setItemsHash(Bookmarks.hash);
	}, [setItemsHash]);


	const handleScorerChange = useCallback(
		selectedConfig =>
	{
		setRightScorerConfig(selectedConfig);
		setQuery("");
		leftWidgetRef.current.focus();
	}, [setQuery, setRightScorerConfig, leftWidgetRef]);


	const handleKeyDown = useCallback(
		event =>
	{
		let cancel = true;

		switch (event.key) {
			case "Escape":
				setQuery("");
				break;

			case "ArrowDown":
					// since we're wrapped in useCallback(), selectedIndex will
					// be stale, so use a function to get the current index and
					// calculate the new one
				setSelectedIndex(selectedIndex =>
					Math.min(selectedIndex + 1, Bookmarks.items.length));
				break;

			case "ArrowUp":
				setSelectedIndex(selectedIndex =>
					Math.max(selectedIndex - 1, 0));
				break;

			case "PageDown":
				leftWidgetRef.current.scrollByPage("down");
				rightWidgetRef.current.scrollByPage("down");
				break;

			case "PageUp":
				leftWidgetRef.current.scrollByPage("up");
				rightWidgetRef.current.scrollByPage("up");
				break;

			default:
				cancel = false;
				break;
		}

		if (cancel) {
				// don't scroll the page when the user is paging up/down
			event.preventDefault();
		}
	}, [setSelectedIndex, leftWidgetRef, rightWidgetRef]);


	const handleQueryChange = useCallback((
		{target: {value}}) =>
	{
		setQuery(value);
		setSelectedIndex(0);

			// reset the scroll to show the first match
		leftWidgetRef.current.scrollToRow(0);
		rightWidgetRef.current.scrollToRow(0);
	}, [setQuery, setSelectedIndex, leftWidgetRef, rightWidgetRef]);


	const handleKbdClick = useCallback((
		{target}) =>
	{
		if (target.tagName == "KBD") {
			leftWidgetRef.current.focus();
			handleQueryChange({
				target: {
					value: target.textContent
				}
			});
		}
	}, [leftWidgetRef]);


	return (
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
				scorers={scorerConfigs}
				onChange={handleScorerChange}
				onKbdClick={handleKbdClick}
			/>
			<div>
				<SearchWidget
					ref={leftWidgetRef}
					itemsHash={itemsHash}
					query={query}
					scorerConfig={leftScorerConfig}
					selectedIndex={selectedIndex}
					setSelectedIndex={setSelectedIndex}
					onQueryChange={handleQueryChange}
					onKeyDown={handleKeyDown}
				/>
				<SearchWidget
					ref={rightWidgetRef}
					itemsHash={itemsHash}
					query={query}
					scorerConfig={rightScorerConfig}
					selectedIndex={selectedIndex}
					setSelectedIndex={setSelectedIndex}
					onQueryChange={handleQueryChange}
					onKeyDown={handleKeyDown}
				/>
			</div>
			<ItemsEditor
				itemsJSON={Bookmarks.toString()}
				setItems={setItems}
			/>
		</AppContainer>
	);
}
