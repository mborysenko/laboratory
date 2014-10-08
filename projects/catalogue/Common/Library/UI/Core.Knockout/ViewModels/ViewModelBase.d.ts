/// <reference path="../../SDL.Client.Core/Types/Types.d.ts" />
/// <reference path="../../SDL.Client.Core/ConfigurationManager/ConfigurationManager.d.ts" />
/// <reference path="../../SDL.Client.Core/Types/DisposableObject.d.ts" />
/// <reference path="../../SDL.Client.Core/Libraries/Globalize/SDL.Globalize.d.ts" />
/// <reference path="../../SDL.Client.Core/Event/EventRegister.d.ts" />
/// <reference path="../../SDL.Client.Core/Resources/FileResourceHandler.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Views/ViewBase.d.ts" />
/// <reference path="../Libraries/knockout/knockout.d.ts" />
declare module SDL.UI.Core.Knockout.ViewModels {
    interface ITemplateResource {
        url: string;
        version: string;
    }
    class ViewModelBase extends Client.Types.DisposableObject {
        private view;
        public culture: KnockoutObservable<string>;
        public template: ITemplateResource;
        constructor(view?: Views.ViewBase);
        public localize(resource: string, parameters?: string[]): string;
        public format(value: number, format?: string): string;
        public format(value: Date, format?: string): string;
        public setting(name: string): string;
        public path(path?: string): string;
    }
}
