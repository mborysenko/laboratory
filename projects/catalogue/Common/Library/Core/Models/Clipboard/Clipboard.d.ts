declare module SDL.Client.Models.Clipboard
{
	enum PasteAction
	{
		COPY,
		CUT
	}

	export function setData(data: any, action: PasteAction): void;
	export function getData(): any;
	export function getDataTypes(): string[];
	export function getAction(): PasteAction;
	export function clearData(): void;
}