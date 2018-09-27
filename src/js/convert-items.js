export function createQuickScore(
	keys)
{
	return function(
		items)
	{
		return items;
	};
}


export function createFuse(
	keys)
{
	return function(
		items)
	{
		return items.map(item => {
			const {score, matches} = item;
			const matchesHash = {};
			const matchesByKey = {};
			const qsScore = 1 - score;
			const scores = {};
			const bestMatch = matches[0];
			const scoreKey = bestMatch && bestMatch.key || "";

			for	(const match of matches) {
					// add 1 to the end of the range so it can be passed to substring()
				matchesByKey[match.key] = match.indices.map(([start, end]) => [start, end + 1]);
			}

			for	(const key of keys) {
				scores[key] = key == scoreKey ? qsScore : 0;
				matchesHash[key] = matchesByKey[key] || [];
			}

			return {
				item: item.item,
				score: qsScore,
				scoreKey,
				scores,
				matches: matchesHash
			};
		});
	};
}


export function createFuzzysort(
	keys)
{
	return function(
		items)
	{
		return items.map(item => {
			const {obj, score} = item;
			const scores = {};
			const matches = {};
			let scoreKey = "";

			for (let i = 0, len = item.length; i < len; i++) {
				const itemMatch = item[i];
				const key = keys[i];

				if (itemMatch) {
					const indexes = itemMatch.indexes;

					scores[key] = itemMatch.score;
					matches[key] = [];

					for (let j = 0, jLen = indexes.length; j < jLen; j++) {
						const start = indexes[j];
						let current = start;
						let next = j + 1;

						while (next < jLen && indexes[next] == current + 1) {
							current = indexes[next];
							next++;
							j++;
						}

						matches[key].push([start, current + 1]);
					}

					if (itemMatch.score == score) {
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
				scores,
				matches
			};
		});
	};
}
