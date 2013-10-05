/// <reference path="../Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../Localization/Localization.d.ts" />
/// <reference path="../Application/Application.d.ts" />
/// <reference path="../Net/Ajax.d.ts" />
/// <reference path="../Types/Array.d.ts" />
/// <reference path="CommonResourcesLoader.d.ts" />
declare module SDL.Client.Resources {
    interface IFileResourceDefinition {
        url: string;
        version?: string;
        context?: Object;
    }
    interface IPackageResourceDefinition extends IFileResourceDefinition {
        name: string;
        files?: string[];
        unpackaged?: boolean;
        rendered?: boolean;
    }
    interface IFileResource extends IFileResourceDefinition {
        parentPackages?: IPackageResourceDefinition[];
        loading?: boolean;
        loaded?: boolean;
        rendering?: boolean;
        rendered?: boolean;
        type?: string;
        data?: string;
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
        private static fileResources;
        private static packages;
        private static cultureResources;
        private static callbacks;
        private static errorcallbacks;
        public _supports(url: string): boolean;
        public _render(url: string, file: IFileResource): void;
        public supports(url: string): boolean;
        public render(url: string): void;
        static loadIfNotRendered(file: IFileResourceDefinition, callback?: (file: IFileResource) => void, errorcallback?: (file: IFileResource) => void, sync?: boolean): void;
        static load(file: IFileResourceDefinition, callback?: (file: IFileResource) => void, errorcallback?: (file: IFileResource) => void, sync?: boolean): void;
        static renderWhenLoaded(file: IFileResourceDefinition, callback?: (file: IFileResource) => void, errorcallback?: (file: IFileResource) => void, sync?: boolean): void;
        static getTemplateResource(templateId: string): IFileResource;
        static registerPackage(resourcesPackage: IPackageResourceDefinition): void;
        static registerPackageRendered(packageName: string): void;
        private static getPreferedPackage(packages);
        private static loadPackage(resourcesPackage, callback, errorcallback?, sync?);
        private static processPackageFileLoaded(resourcesPackage, file?);
        private static setRenderedPackage(resourcesPackage);
        static updateCultureResources(callback: () => void): void;
    }
}
