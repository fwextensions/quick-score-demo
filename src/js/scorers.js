import React from "react";
import {QuickScore, QuicksilverConfig} from "quick-score";
import Fuse	from "fuse.js";
import LiquidMetal from "liquidmetal";
import FuzzySort from "./FuzzySort";
import bookmarks from "./bookmarks";
import {createFuse, createFuzzysort, createQuickScore} from "./convert-items";


const Keys = ["title", "url"];


export default [
	{
		name: "QuickScore",
		scorer: new QuickScore(bookmarks, Keys),
		converter: createQuickScore(Keys)
	},
	{
		name: "Fuse.js",
		scorer: new Fuse(bookmarks, {
			keys: Keys,
			includeMatches: true,
			includeScore: true,
			shouldSort: true
		}),
		converter: createFuse(Keys),
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
					results in that case, which is why there are no items shown
					on the right by default.
				</p>
			</div>,
			<div>
				<p>
					The fuzziness of Fuse.js means it often returns surprising
					results for a given query, especially when searching through
					long strings like webpage titles or URLs.  For instance,
					if you type <b>real</b> to match page titles that
					contain the word <b>realtime</b>, Fuse.js
					returns <b>Material-UI</b> as the top result, which has the
					query characters in a different order, while the bookmark
					titled <b>RethinkDB: the open-source database for the
					realtime web</b> is the 39th result.
				</p>
				<p>
					Fuse.js scores usually go from <code>0</code> as the best
					match to <code>1</code> as no match, but the scores below
					have been inverted to match QuickScore's range.
				</p>
			</div>
		]
	},
	{
		name: "Quicksilver (original algorithm)",
		scorer: new QuickScore(bookmarks, {
			keys: Keys,
			config: QuicksilverConfig
		}),
		converter: createQuickScore(Keys),
		description: [
			<div>
				<p>
					QuickScore tweaks the original Quicksilver algorithm to
					reduce its higher scoring of long strings, and bumps up
					matches that are denser (fewer skipped characters in between
					each matched letter) and that start earlier in the string.
					This reduces the scores of irrelevant matches on strings
					like URLs that have long guids or tokens at the end, and
					which often contain enough letters to match almost any short
					query.
				</p>
			</div>,
			<div>
				<p>
					The Quicksilver config generally produces very similar
					results to the default QuickScore config, and is a hair
					faster.  But you can see some differences when
					typing <b>libr</b> to match page titles that
					contain <b>library</b>.  The first ten QuickScore results all
					contain <b>library</b>, while there are some less relevant
					pages mixed in on the Quicksilver side.
				</p>
			</div>
		]
	},
	{
		name: "fuzzysort",
		scorer: new FuzzySort(bookmarks, { keys: Keys }),
		converter: createFuzzysort(Keys),
		description: [
			<div>
				<p>
					fuzzysort is usually faster than QuickScore, thanks to its
					aggressive caching, and generally produces similar results.
					The scores it returns range from <code>&#8209;Infinity</code>
					to <code>0</code>, though, which is a bit quirky.
				</p>
			</div>,
			<div>
				<p>
					fuzzysort's results are very similar to QuickScore's, though
					there are occasional misses.  If you wanted to find
					the <b>jQuery Zoom</b> bookmark and typed just <b>zom</b>,
					fuzzysort's first result is <b>phonegap.com</b>, due to the
					query letters appearing somewhere in the extremely long
					tracking parameter that happened to be saved with the
					bookmark.  QuickScore sorts <b>jQuery Zoom</b> to the top
					with that query.
				</p>
			</div>
		]
	},
	{
		name: "liquidmetal",
		scorer: new QuickScore(bookmarks, {
			keys: Keys,
			scorer: (...args) => LiquidMetal.score(...args)
		}),
		converter: createQuickScore(Keys),
		description: [
			<div>
				<p>
					liquidmetal is another implementation of the Quicksilver
					algorithm.  It's about as fast as QuickScore, but suffers
					from some of the same weaknesses of the original algorithm,
					like over-emphasizing longer strings and not prioritizing
					denser matches.
				</p>
			</div>,
			<div>
				<p>
					liquidmetal's results are usually similar to QuickScore's,
					though there are sometimes misses.  If you wanted to find
					the <b>jQuery Zoom</b> item and typed just <b>zom</b>,
					liquidmetal's first result is <b>jQuery Sparklines</b>, due to
					the query letters appearing somewhere in the extremely long
					tracking parameter that happened to be saved with the
					bookmark.  QuickScore sorts <b>jQuery Zoom</b> to the top
					with that query.
				</p>
				<p>
					liquidmetal doesn't return information about where the query
					matches each string, which is why nothing is bolded in this
					list.
				</p>
			</div>
		]
	}
];
