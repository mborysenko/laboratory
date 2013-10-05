/// <reference path="FileResourceHandler.d.ts" />
/// <reference path="../ConfigurationManager/ConfigurationManager.d.ts" />
/// <reference path="../Xml/Xml.d.ts" />
declare module SDL.Client.Resources {
    interface IResourceGroupOptions {
        name: string;
        files?: Resources.IFileResourceDefinition[];
        dependencies?: string[];
        extensions?: string[];
        loaded?: boolean;
        loading?: boolean;
    }
    interface IResolvedResourceGroupResult {
        name: string;
        files: string[];
    }
    enum ResourceManagerMode {
        NORMAL,
        REVERSE,
        SYNCHRONOUS,
    }
    interface IResourceManager {
        setMode(mode: ResourceManagerMode): void;
        newResourceGroup(options: IResourceGroupOptions): void;
        getTemplateResource(templateId: string): Resources.IFileResource;
        resolveResources(resourceGroupName: string): IResolvedResourceGroupResult[];
        load(resourceGroupName: string, callback?: () => void, errorcallback?: (error: string) => void): void;
        readConfiguration(): void;
        registerPackageRendered(packageName: string): void;
    }
    var ResourceManager: IResourceManager;
}
