import fuzzysort from "fuzzysort";
import {Adapter} from "@/adapters/Adapter";
import {RangeTuple, ScoredResult} from "quick-score";


export class FuzzySortAdapter<T> extends Adapter<T> {
	name = "fuzzysort";


	get defaultOptions()
	{
		return {
			allowTypo: false
		};
	}


	initScorer()
	{
		return this.scorer = {
				// convert the results to a regular array to get rid of the
				// readonly typing
			search: (query: string) => ([...fuzzysort.go(query, this.items, this.options as Fuzzysort.KeysOptions<T>)])
		};
	}


	convertResults(
		results: Fuzzysort.KeysResult<T>[]
	): ScoredResult<T>[]
	{
		const {keys} = this;

		return results.map((item) => {
			const {obj, score} = item;
			const scores: { [k: string]: number } = {};
			const matches: { [k: string]: RangeTuple[] } = {};
			let scoreKey = "";

			for (let i = 0, len = item.length; i < len; i++) {
				const itemMatch = item[i];
				const key = keys[i];

				if (itemMatch) {
					const {indexes} = itemMatch;

					scores[key] = itemMatch.score;
					matches[key] = [];

					for (let j = 0, jLen = indexes.length; j < jLen; j++) {
						const start = indexes[j];
						let current = start;
						let next = j + 1;

						while (next < jLen && indexes[next] === current + 1) {
							current = indexes[next];
							next++;
							j++;
						}

						matches[key].push([start, current + 1]);
					}

					if (itemMatch.score === score) {
						scoreKey = key;
					}
				} else {
					matches[key] = [];
					scores[key] = -Infinity;
				}
			}

			return {
				item: obj,
				score,
				scoreKey,
				scoreValue: String(obj[scoreKey as keyof T]),
				scores,
				matches
			} as ScoredResult<T>;
		});
	}
}
