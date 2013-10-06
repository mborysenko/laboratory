/// <reference path="../Models/MarshallableObject.d.ts" />
declare module SDL.Client.Repository
{
	export enum ModelRepositoryDiscoveryMode
	{
		NONE,
		TOP,
		OPENER,
		FULL
	}

    class RepositoryBase extends SDL.Client.Models.MarshallableObject {
        static findRepository(mode: ModelRepositoryDiscoveryMode): RepositoryBase;
        static initRepository(mode?: ModelRepositoryDiscoveryMode, identifier?: string): void;
        getOwningWindow(): Window;
        getUniqueId(): string;
        getItem(id: string): any;
        setItem(id: string, item: any): void;
        removeItem(id: string): void;
        createItem(id: string, type: any, ...arg1: any[]);
        getItems(): any;
    }
}
