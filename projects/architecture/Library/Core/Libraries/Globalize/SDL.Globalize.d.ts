/// <reference path="globalize.d.ts" />
/// <reference path="../jQuery/SDL.jQuery.d.ts" />
/// <reference path="../../Types/Types.d.ts" />
/// <reference path="../../Types/Date.d.ts" />
/// <reference path="../../Types/String.d.ts" />
/// <reference path="../../Localization/Localization.d.ts" />
/// <reference path="../../Event/EventRegister.d.ts" />
/// <reference path="../../Resources/FileResourceHandler.d.ts" />
declare module SDL {
    interface SDLGlobalizeStatic extends GlobalizeStatic {
        findClosestCulture(cultureSelector: string, skipCount?: number);
        localize(key: string, parameters?: string[], cultureSelector?);
    }
    class GlobalizeClass extends SDL.Client.Types.ObjectWithEvents implements SDLGlobalizeStatic {
        private _globalize;
        constructor();
        public initializeNoConflict(): void;
        public TranslateDate(date: string): string;
        public cultures: GlobalizeCultures;
        public cultureSelector: string;
        public init(cultureSelector: string);
        public culture(cultureSelector: string): GlobalizeCulture;
        public culture(cultureSelector: string[]): GlobalizeCulture;
        public culture(): GlobalizeCulture;
        public addCultureInfo(cultureName, baseCultureName, info?): void;
        public findClosestCulture(cultureSelector: string, skipCount?: number);
        public format(value, format, cultureSelector?);
        public localize(key, parameters?: string[], cultureSelector?): string;
        public parseDate(value: string, formats?, cultureSelector?: string): Date;
        public parseInt(value: string, radix?, cultureSelector?: string): number;
        public parseFloat(value: string, radix?, cultureSelector?: string): number;
    }
}
declare module SDL {
    var Globalize: GlobalizeClass;
}
