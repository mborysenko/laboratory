/// <reference path="../Types/OO.d.ts" />
declare module SDL.Client.Exception
{
    class Exception extends SDL.Client.Types.OO.Inheritable 
    {
        constructor (errorCode?: any, message?: string, description?: string);
        getDescription(): string;
        getMessage(): string;
        getErrorCode(): any;
    }

	var ErrorCodes: {[code: string]: any;};
	export function registerErrorCode(alias: string): void
}