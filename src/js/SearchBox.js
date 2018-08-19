import React from "react";
import styled from "styled-components";
import Input from "./Input";


const StyledInput = styled(Input)`	
	font-weight: bold;
	width: 600px;
	height: 25px;
	margin: 5px 0;
	border: none;
	border-bottom: 1px solid #ddd;
	padding: 2px 2px 5px 27px;
	outline: none;
	&::-webkit-input-placeholder {
		font-weight: normal;
		font-style: italic;
	} 
`;


export default class SearchBox extends React.Component {
	static defaultProps = {
		query: ""
	};


	input = null;


	componentDidMount()
	{
		const queryLength = this.props.query.length;

			// even if there's a default value, the insertion point gets set
			// to the beginning of the input field, instead of at the end.
			// so move it there after the field is created.
		this.input.setSelectionRange(queryLength, queryLength);
	}


	handleRef = (input) => {
		this.input = input;
	};


	render()
	{
		const props = this.props;

		return (
			<StyledInput
				type="search"
				tabIndex="0"
				placeholder="Search for a title or URL"
				innerRef={this.handleRef}
				spellCheck={false}
				autoFocus={true}
				value={props.query}
				{...props}
			/>
		);
	}
}
