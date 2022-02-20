export default function copyTextToClipboard(
	text)
{
	const copyFrom = document.createElement("textarea");
	const {body} = document;
	const {activeElement} = document;

	copyFrom.textContent = text;
	body.appendChild(copyFrom);
	copyFrom.focus();
	copyFrom.select();

	if (!document.execCommand("copy")) {
		// eslint-disable-next-line no-alert
		alert("The browser blocked the copy action for some reason.");
	}

		// now that the selected text is copied, remove the copy source
	body.removeChild(copyFrom);

	if (activeElement) {
			// refocus the previously active element, since we stole the
			// focus to copy the text from the temp textarea
		activeElement.focus();
	}
}
