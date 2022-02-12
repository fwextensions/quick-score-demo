import React, {useRef} from "react";
import styled from "styled-components";
import copy from "@/utils/copy-to-clipboard";


const ItemsContainer = styled.div`
	margin-top: 4em;
`;
const ItemsTextArea = styled.textarea`
	font-family: Consolas, Lucida Console, Courier New, monospace;
	color: #444;
	width: 516px;
	height: 35em;
	padding: .5em;
	border: 1px solid #ccc;
	display: inline-block;
	vertical-align: top;
`;
const OrderedList = styled.ol`
	width: 50%;
	margin: 0;
	padding: 0 2.5em;
	display: inline-block;
	vertical-align: top;

	& li {
		margin: 0 0 1em 0;
	}
`;
const Code = styled.div`
	font-family: Consolas, Lucida Console, Courier New, monospace;
	white-space: pre-wrap;
	margin: .5em 0;
	padding: .25em .5em;
	background-color: rgba(27, 31, 35, 0.05);
`;
const BookmarksCopyCode = `var s = bookmarks.Store.getInstance().data;
var b = Array.from(s.selection.items).map(id => s.nodes[id]).map(({title, url}) => ({title, url}));
copy(JSON.stringify(b, null, 2));
`;


export default function ItemsEditor({
	itemsJSON,
	setItems})
{
	const editorRef = useRef(null);


	const handleCopyClick = () => copy(BookmarksCopyCode);


	const handleDelete = () =>
	{
		editorRef.current.value = "";
		editorRef.current.focus();
	};


	const handleTextChange = (
		{target: {value}}) =>
	{
		let items;

		try {
			items = JSON.parse(value);
		} catch (e) {}

		if (items) {
			setItems(items);
		}
	};


	return (
		<ItemsContainer id="editor">
			<p style={{ marginBottom: "1.75em" }}>
				The bookmark JSON data used in the search widgets above can
				be edited here.  If you're using Chrome, you can copy and
				paste your own bookmarks by following the directions below,
				which may make it a little easier to evaluate the QuickScore
				algorithm by searching for familiar bookmarks.
			</p>
			<ItemsTextArea
				ref={editorRef}
				autoComplete="off"
				autoCorrect="off"
				autoCapitalize="off"
				spellCheck="false"
				defaultValue={itemsJSON}
				onChange={handleTextChange}
			/>
			<OrderedList id="directions">
				<li>
					<button onClick={handleCopyClick}>Copy</button> the code
					below to the clipboard:
					<Code>{BookmarksCopyCode}</Code>
				</li>
				<li>
					Open the Bookmark manager from <i>Main menu > Bookmarks >
					Bookmark manager</i>.
				</li>
				<li>
					Select the bookmarks you want to copy.  You can shift-click
					bookmarks to select a range, or
					press <kbd>ctrl</kbd><kbd>A</kbd> or <kbd>cmd</kbd><kbd>A</kbd> to
					select all of them in the current folder.
				</li>
				<li>
					Press <kbd>ctrl</kbd><kbd>shift</kbd><kbd>J</kbd> on
					Windows/Linux or <kbd>cmd</kbd><kbd>opt</kbd><kbd>J</kbd> on
					macOS to open the Chrome Developer tools console.
				</li>
				<li>
					Paste the copied code next to the > in the console.
				</li>
				<li>
					Press <kbd>enter</kbd> to execute the code.
				</li>
				<li>
					In the text editor to the
					left, <button onClick={handleDelete}>delete</button> all
					the JSON and then paste the copied bookmarks.
				</li>
			</OrderedList>
		</ItemsContainer>
	);
}
