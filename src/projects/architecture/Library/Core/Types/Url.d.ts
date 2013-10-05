declare module SDL.Client.Types.Url
{
	enum UrlParts {
		PROTOCOL,
		HOSTNAME,
		PORT,
		DOMAIN,
		PATH,
		SEARCH,
		HASH
	}

	function makeRelativeUrl(base: string, url: string): string;
	function combinePath(base: string, path: string): string;
	function normalize(url: string): string;
	function isAbsoluteUrl(url: string): boolean;
	function getAbsoluteUrl(path: string): string;
	function getFileExtension(file: string): string;
	function getFileName(file: string): string;
	function getUrlParameter(url: string, paramaterName: string): string;
	function getHashParameter(url: string, paramaterName: string): string;
	function setHashParameter(url: string, paramaterName: string, value: string): string;
	function isSameDomain(url1: any, url2: any): boolean;
	function getDomain(url: string): string;
	function parseUrl(url: string): string[];
}