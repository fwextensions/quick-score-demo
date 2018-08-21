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


const SearchBox = (props) => (
	<StyledInput
		type="search"
		tabIndex="0"
		placeholder="Search for a title or URL"
		spellCheck={false}
		autoFocus={true}
		value={props.query}
		{...props}
	/>
);

SearchBox.defaultProps = {
	query: ""
};

export default SearchBox;
