/// <reference path="../../SDL.Client.Core/Types/Types.d.ts" />
/// <reference path="../../SDL.Client.Core/Types/DisposableObject.d.ts" />
/// <reference path="../../SDL.Client.Core/Libraries/Globalize/SDL.Globalize.d.ts" />
/// <reference path="../../SDL.Client.Core/Event/EventRegister.d.ts" />
/// <reference path="../Libraries/knockout/knockout.d.ts" />
declare module SDL.UI.Core.Knockout.ViewModels {
    class ViewModelBase extends SDL.Client.Types.DisposableObject {
        public culture: KnockoutObservable<string>;
        public localize(resource: string, parameters?: string[]): string;
        public format(value: number, format?: string): string;
        public format(value: Date, format?: string): string;
    }
}
