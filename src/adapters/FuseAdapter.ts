import Fuse from "fuse.js";
import {Adapter} from "@/adapters/Adapter";
import {RangeTuple, ScoredResult} from "quick-score";


export class FuseAdapter<T> extends Adapter<T> {
	name = "Fuse.js";


	get defaultOptions()
	{
		return {
			includeMatches: true,
			includeScore: true,
			shouldSort: true
		};
	}


	initScorer()
	{
		return this.scorer = new Fuse<T>(this.items, this.options);
	}


	convertResults(
		results: Fuse.FuseResult<T>[]
	): ScoredResult<T>[]
	{
		return results.map(item => {
			const {score = 0, matches = []} = item;
			const matchesHash: { [k: string]: RangeTuple[] } = {};
			const matchesByKey: { [k: string]: RangeTuple[] } = {};
			const scores: { [k: string]: number } = {};
			const qsScore = 1 - score;
			const [bestMatch] = matches;
			const scoreKey = (bestMatch && bestMatch.key) || "";

			for (const match of matches) {
					// key is marked optional on FuseResult, so make TS happy
				if (match.key) {
						// add 1 to the end of the range so it can be passed
						// to substring()
					matchesByKey[match.key] =
						match.indices.map(([start, end]) => [start, end + 1]);
				}
			}

			for (const key of this.keys) {
				scores[key] = key === scoreKey ? qsScore : 0;
				matchesHash[key] = matchesByKey[key] || [];
			}

			return {
				item: item.item,
				score: qsScore,
				scoreKey,
					// cast scoreKey to keyof T so TS knows it's a key on the
					// original item
				scoreValue: String(item.item[scoreKey as keyof T]),
				scores,
				matches: matchesHash
			} as ScoredResult<T>;
		});
	}
}
