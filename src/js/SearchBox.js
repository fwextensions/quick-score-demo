import React from "react";
import Input from "./Input";


export default class SearchBox extends React.Component {
	searchBox = null;


	componentDidMount()
	{
		const queryLength = this.props.query.length;

			// even if there's a default value, the insertion point gets set
			// to the beginning of the input field, instead of at the end.
			// so move it there after the field is created.
		this.searchBox.setSelectionRange(queryLength, queryLength);
	}


	handleRef = (searchBox) => {
		this.searchBox = searchBox;
	};


	render()
	{
		const props = this.props;
		const {query} = props;

			// we want to show the placeholders only when the user's entered
			// the history or bookmarks mode and the query length is 3, which
			// is /h|b space.  we need to use an Input component that ignores
			// the value prop when it's focused, so that the insertion point
			// position isn't lost if the user moves it from the end and
			// starts typing.  that change is forced when the app gets an
			// esc and clears the text.
		return (
			<div>
				<Input type="search"
					ref={this.handleRef}
					className="search-box"
					tabIndex="0"
					placeholder="Search for a title or URL"
					spellCheck={false}
					autoFocus={true}
					value={query}
					forceUpdate={props.forceUpdate}
					onChange={props.onChange}
					onKeyDown={props.onKeyDown}
					onKeyUp={props.onKeyUp}
				/>
			</div>
		);
	}
}
