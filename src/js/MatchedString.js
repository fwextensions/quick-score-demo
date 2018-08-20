import React from "react";
import styled from "styled-components";
import memoize from "fast-memoize";


const Match = styled.span`
	font-weight: bold;
`;


	// memoize this, since it could get called multiple times by render() with
	// the same values, such as when the selection changes but the query doesn't
const wrapMatches = memoize(function(
	query,
	string,
	matches)
{
	const substrings = [];
	let previousSubstringStart = 0;

	for (let [start, end] of matches) {
		const prefix = string.slice(previousSubstringStart, start);
		const match = string[start] && <Match>{string.substring(start, end)}</Match>;

		substrings.push(prefix, match);
		previousSubstringStart = end;
	}

		// add the part of the string after the final match, which will be the
		// whole string if there are no matches
	substrings.push(string.slice(previousSubstringStart));

		// toArray() automatically adds keys to the array items
	return React.Children.toArray(substrings);
});


export default function MatchedString({
	query,
	text,
	matches})
{
	return (
		<span>{wrapMatches(query, text, matches)}</span>
	);
};
