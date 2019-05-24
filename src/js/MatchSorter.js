import matchSorter from "match-sorter";


export default class MatchSorter {
	constructor(
		items,
		options = {})
	{
		this.items = items;
		this.options = options;
	}


	search(
		query)
	{
		return matchSorter(this.items, query, this.options);
	}
}
