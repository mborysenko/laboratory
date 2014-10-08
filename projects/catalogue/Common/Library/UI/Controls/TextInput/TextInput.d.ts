/// <reference path="../../SDL.Client.UI.Core/Controls/ControlBase.d.ts" />
declare module SDL.UI.Controls {
    interface ITextInputOptions {
        invalid?: boolean;
    }
    interface ITextInputProperties extends Core.Controls.IControlBaseProperties {
        options: ITextInputOptions;
    }
    class TextInput extends Core.Controls.ControlBase {
        public properties: ITextInputProperties;
        private _$elem;
        public $initialize(): void;
        public setInvalid(value: boolean): void;
        public isInvalid(): boolean;
        public update(options?: ITextInputOptions): void;
        private _updateInvalidState();
    }
}
