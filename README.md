# QuickScore

![travis](https://travis-ci.com/fwextensions/quick-score-demo.svg?branch=dev)

<!--
const s = bookmarks.Store.getInstance().data;
const b = Array.from(s.selection.items).map(id => s.nodes[id]).map(({title, url}) => ({title, url}));
copy(JSON.stringify(b, null, 2));
-->


<!--
fuzzysort, very fast, good results
json has results that are slightly off

liquidmetal is slower, doesn't track hits
has same issues as Quicksilver algo with overweighting long strings
-->
