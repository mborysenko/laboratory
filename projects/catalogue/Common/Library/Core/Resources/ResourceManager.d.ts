/// <reference path="Resources.d.ts" />
/// <reference path="FileResourceHandler.d.ts" />
/// <reference path="../ConfigurationManager/ConfigurationManager.d.ts" />
/// <reference path="../Xml/Xml.d.ts" />
declare module SDL.Client.Resources {
    interface IResourceGroupOptions {
        name: string;
        files?: IFileResourceDefinition[];
        dependencies?: string[];
        extensions?: string[];
        loading?: boolean;
        rendered?: boolean;
    }
    enum ResourceManagerMode {
        NORMAL = 0,
        REVERSE = 1,
        SYNCHRONOUS = 2,
    }
    interface IResourceManager {
        setMode(mode: ResourceManagerMode): void;
        newResourceGroup(options: IResourceGroupOptions): void;
        getTemplateResource(templateId: string): IFileResource;
        resolveResources(resourceGroupName: string): IResolvedResourceGroupResult[];
        load(resourceGroupName: string, callback?: () => void, errorcallback?: (error: string) => void): void;
        readConfiguration(): void;
        storeFileData(url: string, data: string, isShared?: boolean): void;
        registerPackageRendered(packageName: string, url?: string, data?: string): void;
    }
    var ResourceManager: IResourceManager;
}
