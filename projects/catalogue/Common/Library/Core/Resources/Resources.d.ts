declare module SDL.Client.Resources
{
	export var preloadPackages: {[key: string]: IPreloadPackageFileResource;};
	export var executingPackageUrl: string;

	export interface IFileResourceDefinition
	{
		url: string;
		version?: string;
	}

	export interface IPreloadPackageFileResource extends IFileResourceDefinition
	{
		packageName?: string;
		data?: string;
		isShared?: boolean;
		error?: string;
	}

	export interface IResolvedResourceGroupResult
	{
		name: string;
		files: string[];
	}
}