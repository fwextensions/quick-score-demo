import React from "react";
import styled from "styled-components";
import Input from "./Input";


const StyledInput = styled(Input)`	
	font-weight: bold;
	width: 500px;
	height: 25px;
	margin: 0 0 .5em 0;
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


	focus()
	{
		this.input.focus();
	}


	handleInputRef = (
		ref) =>
	{
			// the Input component adds a ref to the actual <input> DOM element
			// as an input property
		this.input = ref.input;
	};


	render()
	{
		const {props} = this;

		return (
			<StyledInput
				type="search"
				innerRef={this.handleInputRef}
				tabIndex="0"
				placeholder="Search for a title or URL"
				spellCheck={false}
				value={props.query}
				{...props}
			/>
		);
	}
}
