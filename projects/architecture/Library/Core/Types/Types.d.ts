declare module SDL.Client.Type
{
    function registerNamespace(namespace: string): void;
    function resolveNamespace(typeName: string): any;
    function isArray(value: any): boolean;
    function isDate(value: any): boolean;
    function isBoolean(value: any): boolean;
    function isFunction(value: any): boolean;
    function isNumber(value: any): boolean;
    function isObject(value: any): boolean;
    function isString(value: any): boolean;
    function isNode(value: any): boolean;
    function isHtmlElement(value: any): boolean;
    function isElement(value: any): boolean;
    function isDocument(value: any): boolean;
}