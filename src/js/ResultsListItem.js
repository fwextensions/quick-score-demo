import React from "react";
import styled from "styled-components";


const Item = styled.div`
	margin: 0;
	padding: 4px 6px 5px 28px;
	max-width: 490px;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	position: relative;
`;
const Text = styled.div`
	width: 100%;
	height: 19px;
	text-overflow: ellipsis;
	overflow: hidden;
`;
const URLText = Text.extend`
	font-size: 12px;
	opacity: 0.7;
`;
const Favicon = styled.div`
	left: 6px;
	top: 6px;
	width: 16px;
	height: 16px;
	background-image: url(https://www.google.com/s2/favicons?domain=${props => props.domain});
	background-size: cover;
	background-repeat: no-repeat;
	position: absolute;
`;


export default function ResultsListItem({
	item,
	style})
{
	const {title, url} = item;

		// make sure to apply props.style to the row container
	return (
		<Item style={style}>
			<Favicon domain={item.domain}/>
			<Text>{title}</Text>
			<URLText>{url}</URLText>
		</Item>
	);
}

/*
define([
	"jsx!./matched-string",
	"cp",
	"lib/copy-to-clipboard",
	"react",
	"lodash"
], function(
	MatchedString,
	cp,
	copyTextToClipboard,
	React,
	_
) {
	const MaxTitleLength = 70,
		MaxURLLength = 75,
		MinMouseMoveCount = 1,
		SuspendedFaviconOpacity = .5,
		FaviconURL = "chrome://favicon/";

	var IsDevMode = false;


	cp.management.getSelf()
		.then(function(info) {
			IsDevMode = info.installType == "development";
		});


	var ResultsListItem = React.createClass({
		mouseMoveCount: 0,


		onClick: function(
			event)
		{
			var item = this.props.item;

			if (IsDevMode && event.altKey) {
					// copy some debug info to the clipboard
				copyTextToClipboard([
					item.title,
					item.displayURL,
					this.props.query,
					item.recentBoost,
					_.toPairs(item.scores).map(function(a) { return a.join(": "); }).join("\n")
				].join("\n"));
			} else {
				this.props.onItemClicked(item, event.shiftKey);
			}
		},


		onClose: function(
			event)
		{
				// stop the click from bubbling so the tab doesn't get focused
				// just before it's closed
			event.stopPropagation();
			this.props.onTabClosed(this.props.item);
		},


		onMouseMove: function(
			event)
		{
			var props = this.props;

			if ((props.selectedIndex > 0 || this.mouseMoveCount > MinMouseMoveCount)
					&& !props.isSelected) {
					// the mouse is moving over this item but it's not
					// selected, which means this is the third mousemove
					// event and we haven't gotten another mouseenter.  so
					// force this item to be selected.  also select it when an
					// item beyond the first one is selected, which means this
					// mousemove isn't happening right after the menu was rendered
					// under the mouse, since the selection has already changed.
				props.setSelectedIndex(props.index);
			} else {
					// we want to swallow the first two mousemove events because
					// the item that's rendered under the mouse when the popup
					// first opens gets at least one mousemove.  on a high-DPI
					// screen, it sometimes gets a second one, which was causing
					// the menu item to be accidentally selected.
				this.mouseMoveCount++;
			}
		},


		onMouseEnter: function(
			event)
		{
			var props = this.props;

			if (props.selectedIndex > 0 || this.mouseMoveCount > MinMouseMoveCount) {
				props.setSelectedIndex(props.index);
			}
		},


		render: function()
		{
			var props = this.props,
				item = props.item,
				query = props.query,
				scores = item.scores,
				hitMasks = item.hitMasks,
				tooltip = [
					item.title.length > MaxTitleLength ? item.title : "",
					item.displayURL.length > MaxURLLength ? item.displayURL : ""
				].join("\n"),
				className = [
					"results-list-item",
					props.mode,
					(props.isSelected ? "selected" : ""),
					(item.unsuspendURL ? "suspended" : ""),
					(item.incognito ? "incognito" : ""),
					(item.sessionId ? "closed suspended" : "")
				].join(" "),
				faviconStyle = {
					backgroundImage: "url(" + item.faviconURL + ")"
				};

			if (IsDevMode) {
				tooltip = _.toPairs(item.scores).concat([["recentBoost", item.recentBoost], ["id", item.id]])
					.map(function(a) { return a.join(": "); }).join("\n") + "\n" + tooltip;
			}

				// blank lines at the end of the tooltip show up in macOS Chrome,
				// so trim them
			tooltip = tooltip.trim();

			if ((item.unsuspendURL && item.faviconURL.indexOf(FaviconURL) == 0)
					|| item.sessionId) {
					// this is a suspended tab, but The Great Suspender has
					// forgotten the faded favicon for it or has set its own
					// icon for some reason.  so we get the favicon through
					// chrome://favicon/ and then fade it ourselves.  or it's a
					// tab from a closed session.
				faviconStyle.opacity = SuspendedFaviconOpacity;
			}

			return <div className={className}
				style={props.style}
				title={tooltip}
				onClick={this.onClick}
				onMouseMove={this.onMouseMove}
				onMouseEnter={this.onMouseEnter}
			>
				<span className="favicon"
					style={faviconStyle}
				/>
				<MatchedString className="title"
					query={query}
					text={item.title}
					score={scores.title}
					hitMask={hitMasks.title}
				/>
				<MatchedString className="url"
					query={query}
					text={item.displayURL}
					score={scores.displayURL}
					hitMask={hitMasks.displayURL}
				/>
				<button className="close-button"
					title="Close tab"
					onClick={this.onClose}
				/>
			</div>
		}
	});


	return ResultsListItem;
});
*/
