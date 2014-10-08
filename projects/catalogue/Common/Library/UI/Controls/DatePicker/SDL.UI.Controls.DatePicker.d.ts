/// <reference path="../../SDL.Client.UI.Core/Controls/ControlBase.d.ts" />
declare module SDL.UI.Controls {
    interface IDatePickerOptions {
        maxDate: Date;
        minDate: Date;
        yearRange: any;
        onMouseDown(): void; 
    }

    class DatePicker extends Core.Controls.ControlBase {
        constructor(element: HTMLElement, options: IDatePickerOptions);
        public getMomentLongDateFormatForCulture(): string;
        public initializeHTML5DatePicker(element: HTMLElement, options: IDatePickerOptions): void;
        public initializePikadayDatePicker(element: HTMLElement, options: IDatePickerOptions): void;
        public isValid(): boolean;
        public convertFromGlobalizeToMomentDatePattern(globalizeDateFormat: string): string;
        public update(options?: IDatePickerOptions): void;
        private _isTouchDevice(): boolean;
    }
}