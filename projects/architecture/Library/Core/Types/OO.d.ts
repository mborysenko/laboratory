declare module SDL.Client.Types.OO
{
	var enableCustomInheritance: string;
	function createInterface(interfaceName: string, implementation?: Function): Function;
	function extendInterface(baseInterfaceName: string, newInterfaceName: string): void;
	function implementsInterface(object: any, interfaceName: string): boolean;
	function importObject(object: any): any;
	function nonInheritable(member: (...args: any[]) => any): (...args: any[]) => any;
	function executeBase(interfaceName: string, thisObject: any, args?: IArguments): void;
	function executeBase(interfaceName: string, thisObject: any, args?: any[]): void;
	function executeBase(interfaceName: string, thisObject: any): void;

	interface IInheritable
	{
		addInterface:
			{
				(interfaceName: string, args: any[]): void;
				(interfaceName: string, args: IArguments): void;
				(interfaceName: string): void;
			};
		upgradeToType:
			{
				(interfaceName: string, args: any[]): IInheritable;
				(interfaceName: string, args: IArguments): IInheritable;
				(interfaceName: string): IInheritable;
			};
		getTypeName(): string;
		getInterface(interfaceName: string): IInheritable;
		getMainInterface(): IInheritable;
		getDelegate(method: Function): (...args: any[]) => any;
		removeDelegate(method: Function): (...args: any[]) => any;
		callInterfaces(method: Function, args?: any[]): any;
		callBase:
			{
				(interfaceName: string, methodName: string, args: any[]): any;
				(interfaceName: string, methodName: string, args: IArguments): any;
				(interfaceName: string, methodName: string): any;
			};
	}

	class Inheritable implements IInheritable
	{
		properties: any;
		addInterface:
			{
				(interfaceName: string, args: any[]): void;
				(interfaceName: string, args: IArguments): void;
				(interfaceName: string): void;
			};
		upgradeToType:
			{
				(interfaceName: string, args: any[]): IInheritable;
				(interfaceName: string, args: IArguments): IInheritable;
				(interfaceName: string): IInheritable;
			};
		getTypeName(): string;
		getInterface(interfaceName: string): OO.IInheritable;
		getMainInterface(): OO.IInheritable;
		getDelegate(method: Function): (...args: any[]) => any;
		removeDelegate(method: Function): (...args: any[]) => any;
		callInterfaces(method: Function, args?: any[]): any;
		callBase:
			{
				(interfaceName: string, methodName: string, args: any[]): any;
				(interfaceName: string, methodName: string, args: IArguments): any;
				(interfaceName: string, methodName: string): any;
			};
	}
}