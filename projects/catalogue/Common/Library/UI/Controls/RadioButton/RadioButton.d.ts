/// <reference path="../../SDL.Client.UI.Core/Controls/ControlBase.d.ts" />
declare module SDL.UI.Controls {
    class RadioButton extends Core.Controls.ControlBase {
        private _$elem;
        private _$img;
        private _input;
        public $initialize(): void;
        public getInputElement(): HTMLInputElement;
    }
}
