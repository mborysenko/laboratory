/// <reference path="globalize.d.ts" />
/// <reference path="../jQuery/SDL.jQuery.d.ts" />
/// <reference path="../../Types/Types.d.ts" />
/// <reference path="../../Types/String.d.ts" />
/// <reference path="../../Localization/Localization.d.ts" />
/// <reference path="../../Event/EventRegister.d.ts" />
/// <reference path="../../Resources/FileResourceHandler.d.ts" />
declare module SDL {
    interface GlobalizeCultures {
        [index: string]: GlobalizeCulture;
    }
    interface SDLGlobalizeStatic extends GlobalizeStatic {
        findClosestCulture(cultureSelector: string, skipCount?: number): GlobalizeCulture;
        localize(key: string, parameters?: string[], cultureSelector?: string): string;
        localize(key: string, parameters?: any, cultureSelector?: string): string;
    }
    class GlobalizeClass extends Client.Types.ObjectWithEvents implements SDLGlobalizeStatic {
        private _globalize;
        constructor();
        public initializeNoConflict(): void;
        public TranslateDate(value: string): string;
        public cultures: GlobalizeCultures;
        public cultureSelector: string;
        public init(cultureSelector: string): GlobalizeStatic;
        public culture(cultureSelector: string): GlobalizeCulture;
        public culture(cultureSelector: string[]): GlobalizeCulture;
        public culture(): GlobalizeCulture;
        public addCultureInfo(cultureName: string, baseCultureName: any, info?: any): void;
        public findClosestCulture(cultureSelector: string, skipCount?: number): GlobalizeCulture;
        public format(value: any, format: string, cultureSelector?: string): string;
        public localize(key: string, parameters?: string[], cultureSelector?: string): string;
        public parseDate(value: string, formats?: any, cultureSelector?: string): Date;
        public parseInt(value: string, radix?: number, cultureSelector?: string): number;
        public parseFloat(value: string, radix?: number, cultureSelector?: string): number;
    }
}
declare module SDL {
    var Globalize: GlobalizeClass;
}
