import React from "react";
import styled from "styled-components";
import memoize from "fast-memoize";


const Match = styled.span`
	font-weight: bold;
`;


	// memoize this, since it could get called multiple times by render() with
	// the same values, such as when the selection changes but the query doesn't
const wrapMatches = memoize(function(
	string,
	matches)
{
	const substrings = [];
	let previousEnd = 0;

	for (let [start, end] of matches) {
		const prefix = string.substring(previousEnd, start);
		const match = <Match>{string.substring(start, end)}</Match>;

		substrings.push(prefix, match);
		previousEnd = end;
	}

		// add the part of the string after the final match, which will be the
		// whole string if there are no matches
	substrings.push(string.substring(previousEnd));

		// toArray() automatically adds keys to the array items
	return React.Children.toArray(substrings);
});


export default function MatchedString({
	string,
	matches})
{
	return (
		<span>{wrapMatches(string, matches)}</span>
	);
};
