/// <reference path="..\..\SDL.Client.Core\Libraries\jQuery\jQuery.d.ts" />
interface JQueryStatic
{
	inArray<T>(value: T, array: T[], fromIndex?: number, compareFunc?: (entry: T, value: T) => boolean): number;
}

declare module SDL.Client.Types.Array
{
	function fromArguments(args: IArguments, startIndex?: number, stopIndex?: number): any[];
	function clone<T>(array: T[]): T[];
	function areEqual<T>(array1: T[], array2: T[]): boolean;
	function contains<T>(array: T[], value: T, compareFunc?: (entry: T, value: T)=>boolean): boolean;
	function normalize<T>(array: T[]): T[];
	function removeAt(array: any[], index: number): void;
	function move(array: any[], fromIndex: number, toIndex: number): void;
	function insert<T>(array: T[], value: T, toIndex: number): void;
}