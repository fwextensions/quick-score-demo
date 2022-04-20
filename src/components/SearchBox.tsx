import React, {forwardRef, useImperativeHandle, useRef} from "react";
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


export interface SearchBoxHandle {
	focus: () => void
}

interface SearchBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
	query?: string,
	scorerName: string
}

const SearchBox = forwardRef<SearchBoxHandle, SearchBoxProps>(function SearchBox(
	{
		query = "",
		scorerName,
		...props
	},
	ref)
{
	const inputRef = useRef<HTMLInputElement>(null);

	useImperativeHandle(ref, () => ({
		focus() { inputRef.current?.focus(); }
	}));

	return (
		<StyledInput
			type="search"
			ref={inputRef}
			tabIndex={0}
			placeholder={`Search for a title or URL using ${scorerName}`}
			spellCheck={false}
			value={query}
			{...props}
		/>
	);
});


export default SearchBox;
