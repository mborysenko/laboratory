/// <reference path="../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../../SDL.Client.Core/Types/Types.d.ts" />
/// <reference path="../../SDL.Client.Core/Types/Array.d.ts" />
/// <reference path="../../SDL.Client.Core/Types/OO.d.ts" />
/// <reference path="../../SDL.Client.Core/Diagnostics/Assert.d.ts" />
/// <reference path="../../SDL.Client.Core/Resources/ResourceManager.d.ts" />
/// <reference path="../Controls/ControlBase.d.ts" />
declare module SDL.UI.Core.Renderers {
    class ControlRenderer {
        private static types;
        private static createdControls;
        static renderControl(type: string, element: HTMLElement, settings: any, callback?: (control: Core.Controls.IControl) => void, errorcallback?: (error: string) => void): void;
        static onControlCreated(control: Core.Controls.IControlBase): void;
        static disposeControl(control: Core.Controls.IControl): void;
        static onControlDisposed(control: Core.Controls.IControlBase): void;
        static getCreatedControlCounts(): {
            [type: string]: number;
        };
        private static getTypeConstructor(type);
    }
}
