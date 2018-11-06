# QuickScore

![travis](https://travis-ci.com/fwextensions/quick-score-demo.svg?branch=dev)

This is a demo of the [QuickScore](https://github.com/fwextensions/quick-score) string-scoring and fuzzy-matching library, which is based on the Quicksilver algorithm and is designed for smart auto-complete.  It lets you auto-complete against a few hundred bookmarks (title and URL) and to compare the results and speed against these string matching libraries:

* Fuse.js
* fuzzysort
* liquidmetal

The demo UI is built with React.

<!--
const s = bookmarks.Store.getInstance().data;
const b = Array.from(s.selection.items).map(id => s.nodes[id]).map(({title, url}) => ({title, url}));
copy(JSON.stringify(b, null, 2));
-->
