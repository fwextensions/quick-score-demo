import fnv1a from "@sindresorhus/fnv1a";
import bookmarks from "./bookmarks-data";


const ProtocolPattern = /https?:\/\/(www\.)?/;


export interface Bookmark {
	title: string,
	url: string
}

class Bookmarks {
	items: Bookmark[] = [];
	originalItems: Bookmark[] = [];
	hash = 0;


	constructor(
		items: Bookmark[])
	{
		this.setItems(items);
	}


	setItems(
		items: Bookmark[])
	{
		this.originalItems = items;
		this.items = this.processItems(items);
		this.hash = fnv1a(this.toString());
	}


	processItems(
		items: Bookmark[])
	{
		return items.map(({title, url}) => {
			let domain = url;

			try {
				domain = new URL(url).hostname;
			} catch (e) {
				// ignore errors
			}

			return {
				title,
				domain,
				url: url.replace(ProtocolPattern, "")
			};
		});
	}


	toString()
	{
		return JSON.stringify(this.originalItems, null, 2);
	}
}


export default new Bookmarks(bookmarks);
