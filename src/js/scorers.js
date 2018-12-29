import React from "react";
import {QuickScore, QuicksilverConfig} from "quick-score";
import Fuse	from "fuse.js";
import LiquidMetal from "liquidmetal";
import FuzzySort from "./FuzzySort";
import Bookmarks from "./Bookmarks";
import {convertFuse, convertFuzzysort, convertQuickScore} from "./convert-items";


const DefaultItems = Bookmarks.items;
const DefaultKeys = ["title", "url"];


function createQuickScore(
	items = DefaultItems,
	keys = DefaultKeys)
{
	return new QuickScore(items, keys);
}


function createQuicksilver(
	items = DefaultItems,
	keys = DefaultKeys)
{
	return new QuickScore(items, {
		keys,
		config: QuicksilverConfig
	});
}


function createLiquidMetal(
	items = DefaultItems,
	keys = DefaultKeys)
{
	return new QuickScore(items, {
		keys,
		scorer: (...args) => LiquidMetal.score(...args)
	});
}


function createFuse(
	items = DefaultItems,
	keys = DefaultKeys)
{
	return new Fuse(items, {
		keys,
		includeMatches: true,
		includeScore: true,
		shouldSort: true
	});
}


function createFuzzySort(
	items = DefaultItems,
	keys = DefaultKeys)
{
	return new FuzzySort(items, { keys });
}


function updateQuickScore(
	items)
{
	this.scorer.setItems(items);
}


export default [
	{
		name: "QuickScore",
		scorer: createQuickScore(),
		update: updateQuickScore,
		converter: convertQuickScore(DefaultKeys)
	},
	{
		name: "Fuse.js",
		scorer: createFuse(),
		update: function(
			items)
		{
			this.scorer = createFuse(items);
		},
		converter: convertFuse(DefaultKeys),
		description: [
			<div>
				<p>
					QuickScore is generally two or three times faster than Fuse.js
					when searching items.  Because QuickScore requires all of
					the characters in the query to appear in order in a result
					string, it usually produces more focused and relevant
					results (at the cost of not tolerating typos).
				</p>
				<p>
					When the query string is empty, QuickScore returns all the
					items sorted alphabetically.  Fuse.js doesn't return any
					results in that case, so the list on the right is empty initially.
				</p>
				<p>
					Fuse.js scores usually go from <code>0</code> as the best
					match to <code>1</code> as no match, but the scores in its
					list have been inverted to match QuickScore's range.
				</p>
			</div>,
			<div>
				<p>
					The fuzziness of Fuse.js means it often returns surprising
					results for a given query, especially when searching through
					long strings like webpage titles or URLs.  For instance,
					if you type <kbd>real</kbd> to match page titles that
					contain the word <b>realtime</b>, Fuse.js
					returns <b>Material-UI</b> as the top result, which has the
					query characters in a different order, while the bookmark
					titled <b>RethinkDB: the open-source database for the
					realtime web</b> is the 39th result.
				</p>
				<p>
					Or if you type <kbd>revi</kbd> to pull up
					the <b>react-virtualized</b> bookmark, Fuse.js puts that item
					on the second-to-last page of results.  Or
					typing <kbd>zom</kbd> to match <b>jQuery Zoom</b> returns <b>Moment.js</b> as
					the first result.
				</p>
			</div>
		]
	},
	{
		name: "liquidmetal",
		scorer: createLiquidMetal(),
		update: updateQuickScore,
		converter: convertQuickScore(DefaultKeys),
		description: [
			<div>
				<p>
					liquidmetal is another implementation of the Quicksilver
					algorithm that often produces identical scores as
					QuickScore. It's about half as fast as QuickScore, though,
					and suffers from some of the same weaknesses of the original
					algorithm, like over-emphasizing longer strings and not
					prioritizing denser matches.
				</p>
			</div>,
			<div>
				<p>
					There are sometimes misses with liquidmetal's results.  If
					you wanted to find the <b>jQuery Zoom</b> bookmark and typed
					just <kbd>zom</kbd>, liquidmetal's top two results look
					completely unrelated to the query.  They're included because
					the query letters appear somewhere in the extremely long
					tracking parameter that happened to be saved with the bookmark.
					QuickScore sorts <b>jQuery Zoom</b> to the top with that query,
					and sorts the <b>PhoneGap</b> and
					<b>jQuery Sparklines</b> items to the very bottom.
				</p>
				<p>
					liquidmetal doesn't return information about where the query
					matches each string, so nothing is bolded in this list.
				</p>
			</div>
		]
	},
	{
		name: "fuzzysort",
		scorer: createFuzzySort(),
		update: function(
			items)
		{
			this.scorer = createFuzzySort(items);
		},
		converter: convertFuzzysort(DefaultKeys),
		description: [
			<div>
				<p>
					fuzzysort is usually a bit faster than QuickScore, thanks to
					its aggressive caching and pre-processing, and generally
					produces very similar results.  The scores it returns range
					from <code>-Infinity</code> to <code>0</code>, though,
					which is a bit quirky.
				</p>
			</div>,
			<div>
				<p>
					There are occasional misses with fuzzysort's results.  If
					you wanted to find the <b>jQuery Zoom</b> bookmark and typed
					just <kbd>zom</kbd>, fuzzysort's top two results look
					completely unrelated to the query.  They're included because
					the query letters appear somewhere in the extremely long
					tracking parameter that happened to be saved with the bookmark.
					QuickScore sorts <b>jQuery Zoom</b> to the top with that query,
					and sorts the <b>PhoneGap</b> and
					<b>jQuery Sparklines</b> items to the very bottom.
				</p>
			</div>
		]
	},
	{
		name: "Quicksilver (original algorithm)",
		scorer: createQuicksilver(),
		update: updateQuickScore,
		converter: convertQuickScore(DefaultKeys),
		description: [
			<div>
				<p>
					QuickScore tweaks the original Quicksilver algorithm to
					reduce its higher scoring of long strings, and bumps up
					matches that are denser (fewer skipped characters in between
					each matched letter) and that start earlier in the string.
					This reduces the scores of irrelevant matches on strings
					like URLs that have long GUIDs or tokens at the end, and
					which often contain enough letters to match almost any short
					query.
				</p>
				<p>
					The precise behavior of the QuickScore algorithm can be
					tweaked via a <code>config</code> parameter to the constructor.
				</p>
			</div>,
			<div>
				<p>
					The Quicksilver config generally produces very similar
					results to the default QuickScore config, and is a hair
					faster.  But you can see some differences when
					typing <kbd>libr</kbd> to match page titles that
					contain <b>library</b>.  The first ten QuickScore results all
					contain <b>library</b>, while there are some less relevant
					pages mixed in on the Quicksilver side.
				</p>
			</div>
		]
	}
];
