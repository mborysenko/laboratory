/// <reference path="Url1.d.ts" />
declare module SDL.Client.Types.Url {
    enum UrlParts {
        PROTOCOL,
        HOSTNAME,
        PORT,
        DOMAIN,
        PATH,
        FILE,
        SEARCH,
        HASH,
    }
    function isAbsoluteUrl(url: string): boolean;
    function getAbsoluteUrl(path: string): string;
    function combinePath(base: string, path: string): string;
    function normalize(url: string): string;
    function parseUrl(url: string): string[];
}
