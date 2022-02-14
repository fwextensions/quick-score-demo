import memoize from "fast-memoize";


const searchData = {};


const search = memoize((
	query,
	name,
	scorer,
		// this param isn't used, but it's included so that if the items
		// change, memoize() won't return the old result
	itemsHash) =>
{
	const start = performance.now();
	const matchingItems = scorer.search(query);
	const end = performance.now();
	const data = searchData[name];

		// track every query to get an average time per scorer.  we do this
		// inside the memoized search function so that the time and counts only
		// update when there's a new search.
	data.time += end - start;
	data.count++;

	return matchingItems;
});


export default function getMatchingItems(
	query,
	config,
	itemsHash)
{
	const {name, scorer, converter} = config;
	let data = searchData[name];

	if (!data) {
		data = searchData[name] = {
			time: 0,
			count: 0
		};
	}

	const items = search(query, name, scorer, itemsHash);

		// limit the average time to 1 decimal point, but convert the string
		// back to a number so that 1.0 becomes 1
	return [converter(items), +(data.time / data.count).toFixed(1)];
}
