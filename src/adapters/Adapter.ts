import memoize from "fast-memoize";
import {Bookmark} from "@/data/Bookmarks";
import {ScoredResult} from "quick-score";


interface ScorerInstance {
	search: (s: string) => unknown[]
}

export class Adapter<T = Bookmark> {
	name = "BaseAdapter";
	items: T[] = [];
	keys: string[] = [];
	options = {};
	hash = 0;
	perf = {
		time: 0,
		count: 0
	};
	scorer: ScorerInstance = this.initScorer();


	constructor(
		items: T[],
		keys: string[],
		hash: number)
	{
		this.items = items;
		this.keys = keys;
		this.hash = hash;
		this.options = { ...this.defaultOptions, keys };
		this.initScorer();
	}


	get defaultOptions()
	{
		return {};
	}


	get averageTime()
	{
		return Number((this.perf.time / this.perf.count).toFixed(1));
	}


	initScorer()
	{
		return this.scorer = { search: () => ([]) } as ScorerInstance;
	}


	update(
		items: T[],
		hash: number)
	{
		this.items = items;
		this.hash = hash;
		this.initScorer();
	}


	convertResults(
		results: unknown[]
	): ScoredResult<T>[]
	{
		return results as ScoredResult<T>[];
	}


	search(
		query: string)
	{
		return this.cachedSearch(query, this.hash);
	}


	cachedSearch = memoize((
		query: string,
		hash: number) =>
	{
		const start = performance.now();
		const matchingItems = this.scorer.search(query);
		const end = performance.now();

			// track every query to get an average time per scorer.  we do this
			// inside the memoized search function so that the time and counts
			// only update when there's a new search.
		this.perf.time += end - start;
		this.perf.count++;

		return this.convertResults(matchingItems);
	})
}
