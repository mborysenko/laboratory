/// <reference path="Resources.d.ts" />
/// <reference path="../Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../Localization/Localization.d.ts" />
/// <reference path="../ApplicationHost/ApplicationHost.d.ts" />
/// <reference path="../Application/Application.d.ts" />
/// <reference path="../Net/Ajax.d.ts" />
/// <reference path="../Types/Array.d.ts" />
/// <reference path="../ConfigurationManager/ConfigurationManager.d.ts" />
/// <reference path="ResourceLoader.d.ts" />
declare module SDL.Client.Resources {
    interface IResourceGroupDefinition {
        name: string;
        files: string[];
    }
    interface IPackageResourceDefinition extends IFileResourceDefinition {
        name: string;
        resourceGroups?: IResourceGroupDefinition[];
        unpacked?: boolean;
        rendered?: boolean;
    }
    interface IFileResource extends IFileResourceDefinition {
        parentPackages?: IPackageResourceDefinition[];
        context?: Object;
        loading?: boolean;
        loaded?: boolean;
        rendering?: boolean;
        rendered?: boolean;
        type?: string;
        data?: string;
        isShared?: boolean;
        template?: string;
        error?: string;
    }
    class FileResourceHandler {
        static registeredResourceHandlers: FileResourceHandler[];
        static templates: {
            [index: string]: IFileResource;
        };
        static corePath: string;
        static enablePackaging: boolean;
        static fileResources: {
            [index: string]: IFileResource;
        };
        static packages: {
            [index: string]: IPackageResourceDefinition;
        };
        static cultureResources: {
            [index: string]: IFileResource;
        };
        static callbacks: {
            [index: string]: JQueryCallback;
        };
        static errorcallbacks: {
            [index: string]: JQueryCallback;
        };
        public _supports(url: string): boolean;
        public _render(file: IFileResource): void;
        public supports(url: string): boolean;
        public render(url: string): void;
        static loadIfNotRendered(file: IFileResourceDefinition, callback?: (file: IFileResource) => void, errorcallback?: (file: IFileResource) => void, sync?: boolean): void;
        static load(file: IFileResourceDefinition, callback?: (file: IFileResource) => void, errorcallback?: (file: IFileResource) => void, sync?: boolean, caller?: ApplicationHost.ICallerSignature): void;
        static renderWhenLoaded(file: IFileResourceDefinition, callback?: (file: IFileResource) => void, errorcallback?: (file: IFileResource) => void, sync?: boolean): void;
        static getTemplateResource(templateId: string): IFileResource;
        static registerPackage(resourcesPackage: IPackageResourceDefinition): void;
        static storeFileData(url: string, data: string, isShared?: boolean): IFileResource;
        static registerPackageRendered(packageName: string, url?: string, data?: string): void;
        private static getPreferedPackage(packages);
        private static loadPackage(resourcesPackage, callback, errorcallback?, sync?, caller?);
        private static processPackageFileLoaded(resourcesPackage, file);
        private static setRenderedPackage(resourcesPackage);
        static updateCultureResources(callback: () => void): void;
    }
}
