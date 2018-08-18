import React from "react";
import Input from "./Input";


export default class SearchBox extends React.Component {
	static defaultProps = {
		query: ""
	};


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

		return (
			<Input
				type="search"
				className="search-box"
				tabIndex="0"
				placeholder="Search for a title or URL"
				ref={this.handleRef}
				spellCheck={false}
				autoFocus={true}
				value={props.query}
				{...props}
			/>
		);
	}
}
