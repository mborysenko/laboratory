/// <reference path="../Types/OO.d.ts" />
declare module SDL.Client.Types
{
	export interface IDisposableObjectProperties
	{
		disposed?: boolean;
		disposing?: boolean;
	}

    export interface IDisposableObject extends OO.IInheritable
    {
        dispose(): void;
        getDisposed(): boolean;
        getDisposing(): boolean;
    }
    export class DisposableObject extends OO.Inheritable
        implements IDisposableObject
    {
		properties: IDisposableObjectProperties;
        dispose(): void;
        getDisposed(): boolean;
        getDisposing(): boolean;
		disposeInterface(): void;
    }
}