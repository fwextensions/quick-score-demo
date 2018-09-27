import fuzzysort from "fuzzysort";


const DefaultOptions = {
	allowTypo: false
};


export default class FuzzySort {
	constructor(
		items,
		options = {})
	{
		this.items = items;
		this.options = Object.assign({}, DefaultOptions, options);
	}


	search(
		query)
	{
		return fuzzysort.go(query, this.items, this.options);
	}
}
