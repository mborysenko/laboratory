declare module SDL.Client.Types. Object
{
	function serialize(object: any): string;
	function deserialize(value: string): any;
	function clone(object: any): any;
	function find(object: any, value: any): string;
	function getUniqueId(object: any): string;
	function getNextId(): number;
}