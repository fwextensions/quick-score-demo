import fnv1a from "@sindresorhus/fnv1a";
import bookmarks from "./bookmarks-data";


const ProtocolPattern = /https?:\/\/(www\.)?/;


class Bookmarks {
	constructor(
		items)
	{
		this.setItems(items);
	}


	setItems(
		items)
	{
		this.originalItems = items;
		this.items = this.processItems(items);
		this.hash = fnv1a(this.toString());
	}


	processItems(
		items)
	{
		return items.map(({title, url}) => ({
			title,
			url: url.replace(ProtocolPattern, ""),
			domain: new URL(url).hostname
		}));
	}


	toString()
	{
		return JSON.stringify(this.originalItems, null, 2);
	}
}


export default new Bookmarks(bookmarks);
