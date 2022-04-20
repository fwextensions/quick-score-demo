// the JSX blobs in the description arrays are rendered in separate parents,
// not a single array, so they don't need keys
/* eslint-disable react/jsx-key */
import React from "react";
import Bookmarks, {Bookmark} from "@/data/Bookmarks";
import {Adapter} from "./Adapter";
import {FuseAdapter} from "./FuseAdapter";
import {FuzzySortAdapter} from "./FuzzySortAdapter";
import {LiquidmetalAdapter} from "./LiquidmetalAdapter";
import {MatchSorterAdapter} from "./MatchSorterAdapter";
import {QuickScoreAdapter} from "./QuickScoreAdapter";
import {QuicksilverAdapter} from "./QuicksilverAdapter";


const defaults: [Bookmark[], (keyof Bookmark)[], number] = [
	Bookmarks.items,
	["title", "url"],
	Bookmarks.hash
];


export interface AdapterConfig {
	adapter: Adapter,
	description: JSX.Element[]
}

export default [
	{
		adapter: new QuickScoreAdapter(...defaults),
		description: []
	},
	{
		adapter: new FuseAdapter(...defaults),
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
					The fuzziness of <a href="https://fusejs.io/">Fuse.js</a> means
					it often returns surprising results for a
					given query, especially when searching through
					long strings like webpage titles or URLs.  For instance,
					if you type <kbd>real</kbd> to match page titles that
					contain the word <b>realtime</b>, Fuse.js
					returns <b>Material-UI</b> as the top result, which has the
					query characters in a different order, while the bookmark
					titled <b>RethinkDB: the open-source database for the
					realtime web</b> is the 49th result.
				</p>
				<p>
					Or if you type <kbd>revi</kbd> to pull up
					the <b>react-virtualized</b> bookmark, Fuse.js puts that item
					on the last page of results.  Or typing <kbd>zom</kbd> to
					match <b>jQuery Zoom</b> returns <b>Moment.js</b> before it.
				</p>
			</div>
		]
	},
	{
		adapter: new LiquidmetalAdapter(...defaults),
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
					There are sometimes misses
					with <a href="https://www.npmjs.com/package/liquidmetal">liquidmetal</a>'s results.
					If you wanted to find the <b>jQuery Zoom</b> bookmark and typed
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
		adapter: new MatchSorterAdapter(...defaults),
		description: [
			<div>
				<p>
					match-sorter and QuickScore almost always return the same
					results, though sometimes with differences in the sort order.
					For instance, if you wanted to find the <b>jQuery Zoom</b> bookmark
					and typed just <kbd>zom</kbd>, match-sorter does return the
					correct result first, though QuickScore is usually about
					twice as fast.
				</p>
			</div>,
			<div>
				<p>
					<a href="https://github.com/kentcdodds/match-sorter">match-sorter</a> doesn't
					prioritize camelCase matches, so if you type <kbd>gh</kbd> to
					find all the <b>GitHub</b> bookmarks, QuickScore sorts the
					ones starting with <b>GitHub</b> to the top, while match-sorter
					returns them starting about a quarter of the way down the list.
				</p>
				<p>
					match-sorter doesn't return information about where the query
					matches each string, so nothing is bolded in this list, and
					it doesn't return scores for individual results.
				</p>
			</div>
		]
	},
	{
		adapter: new FuzzySortAdapter(...defaults),
		description: [
			<div>
				<p>
					fuzzysort is usually faster than QuickScore, thanks to its
					aggressive caching and pre-processing, and generally
					produces very similar results.  The scores it returns range
					from <code>-Infinity</code> to <code>0</code>, though,
					which is a bit quirky.
				</p>
			</div>,
			<div>
				<p>
					There are occasional misses
					with <a href="https://github.com/farzher/fuzzysort">fuzzysort</a>'s results.
					If you wanted to find the <b>jQuery Zoom</b> bookmark and typed
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
		adapter: new QuicksilverAdapter(...defaults),
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
] as AdapterConfig[];
