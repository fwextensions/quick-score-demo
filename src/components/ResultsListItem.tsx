import React from "react";
import styled, {css} from "styled-components";
import MatchedString from "./MatchedString";


const MaxTitleLength = 70;
const MaxURLLength = 75;


interface ItemProps {
	isSelected: boolean
}

interface FaviconProps {
	domain: string
}

const Item = styled.div<ItemProps>`
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
const Favicon = styled.div<FaviconProps>`
	left: 6px;
	top: 6px;
	width: 16px;
	height: 16px;
	background-size: cover;
	background-repeat: no-repeat;
		// we seem to have to pass https:// before the domain to avoid lots of 404s
	background-image: url(https://www.google.com/s2/favicons?domain=https://${props => props.domain});
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
	value: number)
{
		// for display purposes, ignore the rounding issues with toFixed().
		// fuzzysort returns whole numbers <= 0, so don't add unnecessary
		// decimal places to those scores (we'll live with 0.00000).
	return value < 0 ? value : value.toFixed(5);
}


export interface ResultsListItemProps {
	item: any, // TODO: specify item type
	isSelected: boolean,
	index: number,
	style: object
}

export default function ResultsListItem({
	item,
	isSelected,
	index,
	style}: ResultsListItemProps)
{
	const {item: {title, url, domain}, scores, matches} = item;
	const tooltip = [
		title.length > MaxTitleLength ? title : "",
		url.length > MaxURLLength ? url : ""
	].join("\n").trim();
	const titleScore = clip(scores.title);
	const urlScore = clip(scores.url);
	const scoresTooltip = `#${index + 1} scores:
title: ${titleScore}
url: ${urlScore}`;

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
			<Score title={scoresTooltip}>{titleScore}</Score>
			<URLScore title={scoresTooltip}>{urlScore}</URLScore>
		</Item>
	);
}
