/// <reference path="../Types/Types.d.ts" />
/// <reference path="../Types/ObjectWithEvents.d.ts" />
declare module SDL.Client {
    class LocalizationClass extends Types.ObjectWithEvents {
        private _culture;
        public setCulture(value: string): void;
        public getCulture(): string;
    }
}
declare module SDL.Client {
    var Localization: LocalizationClass;
}
