/// <reference path="Url2.d.ts" />
declare module SDL.Client.Types.Url {
    function makeRelativeUrl(base: string, url: string): string;
    function getFileExtension(file: string): string;
    function getFileName(file: string): string;
    function getUrlParameter(url: string, parameterName: string): string;
    function getHashParameter(url: string, parameterName: string): string;
    function setHashParameter(url: string, parameterName: string, value: string): string;
}
