/// <reference path="../../../SDL.Client.Core/Application/Application.d.ts" />
/// <reference path="../../../SDL.Client.Core/Application/ApplicationHost.d.ts" />
/// <reference path="../../../SDL.Client.UI.Core/Renderers/ControlRenderer.d.ts" />
/// <reference path="../TopBar.d.ts" />
declare module SDL.UI.Controls.Application {
    interface ITopBar extends Client.Types.IObjectWithEvents {
        setOptions(options: ITopBarOptions): void;
    }
    class TopBarClass extends Client.Types.ObjectWithEvents implements ITopBar {
        private optionsToApply;
        public $initialize(): void;
        public setOptions(options: Client.Application.ITopBarOptions): void;
    }
    var TopBar: ITopBar;
}
