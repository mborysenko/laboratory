declare module SDL.Client.Diagnostics.Assert
{
	function isTrue(value: any, description?: string): boolean;
	function isFalse(value: any, description?: string): boolean;
	function isBoolean(value: any, description?: string): boolean;
	function isDefined(value: any, description?: string): boolean;
	function isNotNull(value: any, description?: string): boolean;
	function isNotNullOrUndefined(value: any, description?: string): boolean;
	function areEqual(value1: any, value2: any, description?: string): boolean;
	function areNotEqual(value1: any, value2: any, description?: string): boolean;
	function isString(value: any, description?: string): boolean;
	function isNumber(value: any, description?: string): boolean;
	function isDate(value: any, description?: string): boolean;
	function isNumeric(value: any, description?: string): boolean;
	function isObject(value: any, description?: string): boolean;
	function isArray(value: any, description?: string): boolean;
	function isFunction(value: any, description?: string): boolean;
	function implementsInterface(object: any, interfaceName: string, description?: string): boolean;
	function isNode(value: any, description?: string): boolean;
	function isElement(value: any, description?: string): boolean;
	function isHtmlElement(value: any, description?: string): boolean;
	function isDocument(value: any, description?: string): boolean;
	function isWindow(value: any, description?: string): boolean;
	function raiseError(description: string): void;
}