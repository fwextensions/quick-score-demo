import React from "react";
import styled from "styled-components";


const StyledInput = styled.input`
	font-weight: bold;
	width: 500px;
	height: 25px;
	margin: 0 0 .5em 0;
	border: none;
	border-bottom: 1px solid #ddd;
	padding: 2px 2px 5px 28px;
	outline: none;
	&::placeholder {
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
		this.input = ref;
	};


	render()
	{
		const {query, scorerName, ...props} = this.props;

		return (
			<StyledInput
				type="search"
				ref={this.handleInputRef}
				tabIndex="0"
				placeholder={`Search for a title or URL using ${scorerName}`}
				spellCheck={false}
				value={query}
				{...props}
			/>
		);
	}
}
