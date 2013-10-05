/// <reference path="../Types/OO.d.ts" />
declare module SDL.Client.Types
{
    export interface IDisposableObject extends OO.IInheritable
    {
        dispose(): void;
        getDisposed(): boolean;
        getDisposing(): boolean;
    }
    export class DisposableObject extends OO.Inheritable
        implements IDisposableObject
    {
        dispose(): void;
        getDisposed(): boolean;
        getDisposing(): boolean;
		disposeInterface(): void;
    }
}