import LiquidMetal from "liquidmetal";
import { QuickScoreAdapter } from "./QuickScoreAdapter";


export class LiquidmetalAdapter<T> extends QuickScoreAdapter<T> {
	name = "liquidmetal";


	get defaultOptions()
	{
		return {
			scorer: (query: string, target: string) => LiquidMetal.score(query, target)
		};
	}
}
