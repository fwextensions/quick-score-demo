import React, {useCallback, useRef, useState} from "react";
import styled from "styled-components";
import configs from "@/adapters/configs";
import Bookmarks from "@/data/Bookmarks";
import ScorerSelector from "./ScorerSelector";
import SearchWidget, {SearchWidgetHandle} from "./SearchWidget";
import ItemsEditor from "./ItemsEditor";


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


export default function App()
{
	const [query, setQuery] = useState("");
	const [selectedIndex, setSelectedIndex] = useState(-1);
	const [rightConfig, setRightConfig] = useState(configs[1]);
	const leftWidgetRef = useRef<SearchWidgetHandle>(null);
	const rightWidgetRef = useRef<SearchWidgetHandle>(null);


	const handleItemsChange = useCallback(
		items =>
	{
			// update the Bookmarks singleton, and then update all of the
			// adapters, so that when the user switches to a different one, it's
			// got the right items and hash.  we use a hash of the JSON text, so
			// that the memoized search function in each scorer will return a
			// different value when the items are changed.  this is faster than
			// making memoize() run stringify on the whole items array every time.
		Bookmarks.setItems(items);
		configs.forEach(({adapter}) => adapter.update(Bookmarks.items, Bookmarks.hash));
	}, []);


	const handleScorerChange = useCallback(
		selectedConfig =>
	{
		setRightConfig(selectedConfig);
		setQuery("");
		leftWidgetRef.current?.focus();
	}, [leftWidgetRef]);


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
				setSelectedIndex(current => Math.min(current + 1, Bookmarks.items.length));
				break;

			case "ArrowUp":
				setSelectedIndex(current => Math.max(current - 1, 0));
				break;

			case "PageDown":
				leftWidgetRef.current?.scrollByPage("down");
				rightWidgetRef.current?.scrollByPage("down");
				break;

			case "PageUp":
				leftWidgetRef.current?.scrollByPage("up");
				rightWidgetRef.current?.scrollByPage("up");
				break;

			default:
				cancel = false;
				break;
		}

		if (cancel) {
				// don't scroll the page when the user is paging up/down
			event.preventDefault();
		}
	}, [leftWidgetRef, rightWidgetRef]);


	const handleQueryChange = useCallback((
		{target: {value}}) =>
	{
		setQuery(value);
		setSelectedIndex(0);

			// reset the scroll to show the first match
		leftWidgetRef.current?.scrollToRow(0);
		rightWidgetRef.current?.scrollToRow(0);
	}, [leftWidgetRef, rightWidgetRef]);


	const handleKbdClick = useCallback((
		{target}) =>
	{
		if (target.tagName === "KBD") {
			leftWidgetRef.current?.focus();
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
				configs={configs.slice(1)}
				onChange={handleScorerChange}
				onKbdClick={handleKbdClick}
			/>
			<div>
				<SearchWidget
					ref={leftWidgetRef}
					query={query}
					adapter={configs[0].adapter}
					selectedIndex={selectedIndex}
					setSelectedIndex={setSelectedIndex}
					onQueryChange={handleQueryChange}
					onKeyDown={handleKeyDown}
				/>
				<SearchWidget
					ref={rightWidgetRef}
					query={query}
					adapter={rightConfig.adapter}
					selectedIndex={selectedIndex}
					setSelectedIndex={setSelectedIndex}
					onQueryChange={handleQueryChange}
					onKeyDown={handleKeyDown}
				/>
			</div>
			<ItemsEditor
				itemsJSON={Bookmarks.toString()}
				onItemsChange={handleItemsChange}
			/>
		</AppContainer>
	);
}
