/**
*	implemented in SDL.Client.HostedApplication, copied to SDL.Client.Core
**/
declare module SDL.Client.Types.Url {
    function isSameDomain(url1: string, url2: string): boolean;
    function getDomain(url: string): string;
}
