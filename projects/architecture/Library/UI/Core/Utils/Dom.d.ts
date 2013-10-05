/// <reference path="..\..\SDL.Client.Core\Libraries\jQuery\jQuery.d.ts" />
interface JQuery
{
	parentWindow(): JQuery;
	enableSelection(): JQuery;
	disableSelection(): JQuery;
	uniqueId(): string;
}

interface JQueryBrowserInfo
{
	macintosh: boolean;
}