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
		return items.map(({title, url}) => {
			let domain = url;

			try {
				domain = new URL(url).hostname;
			} catch (e) {}

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


//let data = [];
//
//for (let i = 0; i < 18; i++) {
//	data = data.concat(JSON.parse(JSON.stringify(bookmarks)));
//}

//export default new Bookmarks(data);

//export default new Bookmarks(bookmarks);
export default new Bookmarks(bookmarks.slice(0, 10));
