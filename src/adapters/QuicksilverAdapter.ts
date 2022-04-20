import {QuicksilverConfig} from "quick-score";
import {QuickScoreAdapter} from "./QuickScoreAdapter";


export class QuicksilverAdapter<T> extends QuickScoreAdapter<T> {
	name = "Quicksilver (original algorithm)";


	get defaultOptions()
	{
		return {
			config: QuicksilverConfig
		};
	}
}
