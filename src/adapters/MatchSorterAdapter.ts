import {matchSorter} from "match-sorter";
import {Adapter} from "@/adapters/Adapter";
import {RangeTuple, ScoredResult} from "quick-score";


export class MatchSorterAdapter<T> extends Adapter<T> {
	name = "match-sorter";


	initScorer()
	{
		return this.scorer = {
			search: (query: string) => matchSorter<T>(this.items, query, this.options)
		};
	}


	convertResults(
		results: T[]
	): ScoredResult<T>[]
	{
		const scores: { [k: string]: number } = {};
		const matches: { [k: string]: RangeTuple[] } = {};
			// MatchSorter doesn't tell you which key scored highest, so just
			// default it to the first key
		const [scoreKey] = this.keys;

			// MatchSorter doesn't return any scores or matches, so just use
			// 0/empty defaults
		this.keys.forEach(key => {
			scores[key] = 0;
			matches[key] = [];
		});

		return results.map(item => ({
			item,
			score: 0,
			scoreKey,
			scoreValue: String(item[scoreKey as keyof T]),
			scores,
			matches
		} as ScoredResult<T>));
	}
}
