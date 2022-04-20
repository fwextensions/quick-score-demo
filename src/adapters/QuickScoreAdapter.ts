import {QuickScore} from "quick-score";
import {Adapter} from "@/adapters/Adapter";


export class QuickScoreAdapter<T> extends Adapter<T> {
	name = "QuickScore";


	initScorer()
	{
		return this.scorer = new QuickScore<T>(this.items, this.options);
	}


	update(
		items: T[],
		hash: number)
	{
		this.items = items;
		this.hash = hash;

			// cast the scorer property to a QuickScore so we can call its
			// setItems() method
		(this.scorer as QuickScore<T>).setItems(this.items);
	}
}
