declare module SDL.Client.Types.Date
{
	var initTime: number;
	function getTimer(timeSince?: number): number;
	function parse(dateValue: string): any /*Date*/;
	function inRange(date: any /*Date*/, startDate: any /*Date*/, endDate: any /*Date*/): boolean;
	function toIsoString(date: any /*Date*/): string;
	function toString(date: any /*Date*/, format: string, localeInfo: any): string;
}