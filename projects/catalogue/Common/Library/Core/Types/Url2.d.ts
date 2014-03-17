/// <reference path="Url1.d.ts" />
declare module SDL.Client.Types.Url {
    enum UrlParts {
        PROTOCOL = 0,
        HOSTNAME = 1,
        PORT = 2,
        DOMAIN = 3,
        PATH = 4,
        FILE = 5,
        SEARCH = 6,
        HASH = 7,
    }
    function isAbsoluteUrl(url: string): boolean;
    function getAbsoluteUrl(path: string): string;
    function combinePath(base: string, path: string): string;
    function normalize(url: string): string;
    function parseUrl(url: string): string[];
}
