/// <reference path="..\..\SDL.Client.Core\Libraries\jQuery\jQuery.d.ts" />
interface JQueryStatic
{
	inArray(value: any, array: any[], fromIndex?: number, compareFunc?: (a: any, b: any) => boolean): number;
}

declare module SDL.Client.Types.Array
{
	function fromArguments(args: IArguments, startIndex?: number, stopIndex?: number): any[];
	function clone(array: any[]): any[];
	function areEqual(array1: any[], array2: any[]): boolean;
	function contains(array: any[], value: any, compareFunc?: (entry: any, value: any)=>boolean): boolean;
	function normalize(array: any[]): any[];
	function removeAt(array: any[], index: number): void;
	function move(array: any[], fromIndex: number, toIndex: number): void;
	function insert(array: any[], value: any, toIndex: number): void;
}