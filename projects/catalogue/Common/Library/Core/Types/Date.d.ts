declare module SDL.Client.Types.Date
{
	var initTime: number;
	function getTimer(timeSince?: number): number;
	function inRange(date: any /*Date*/, startDate: any /*Date*/, endDate: any /*Date*/): boolean;
	function toString(date: any /*Date*/, format: string, localeInfo: any): string;
}