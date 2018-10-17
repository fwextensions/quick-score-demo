import React from "react";
import styled, {css} from "styled-components";
import MatchedString from "./MatchedString";


const MaxTitleLength = 70;
const MaxURLLength = 75;


const Item = styled.div`
	margin: 0;
	padding: 4px 55px 5px 28px;
	max-width: 590px;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	position: relative;
	${props => props.isSelected && css`background: #ebebeb;`};
`;
const Text = styled.div`
	width: 100%;
	height: 19px;
	text-overflow: ellipsis;
	overflow: hidden;
`;
const URLText = styled(Text)`
	font-size: 12px;
	opacity: 0.7;
`;
const Favicon = styled.div`
	left: 6px;
	top: 6px;
	width: 16px;
	height: 16px;
	background-size: cover;
	background: url(https://www.google.com/s2/favicons?domain=${props => props.domain}) no-repeat;
	position: absolute;
`;
const Score = styled.div`
	font-size: 12px;
	opacity: 0.6;
	top: 6px;
	right: 6px;
	height: 19px;
	text-align: right;
	position: absolute;
`;
const URLScore = styled(Score)`
	top: 23px;
`;


function clip(
	value)
{
	return value.toPrecision(5);
}


export default function ResultsListItem({
	item,
	query,
	isSelected,
	style})
{
	const {item: {title, url, domain}, scores, matches} = item;
	const tooltip = [
		title.length > MaxTitleLength ? title : "",
		url.length > MaxURLLength ? url : ""
	].join("\n").trim();

		// make sure to apply props.style to the row container so it gets
		// positioned correctly in the virtual list
	return (
		<Item
			style={style}
			title={tooltip}
			isSelected={isSelected}
		>
			<Favicon domain={domain} />
			<Text>
				<MatchedString
					string={title}
					matches={matches.title}
				/>
			</Text>
			<URLText>
				<MatchedString
					string={url}
					matches={matches.url}
				/>
			</URLText>
			<Score>{clip(scores.title)}</Score>
			<URLScore>{clip(scores.url)}</URLScore>
		</Item>
	);
}
