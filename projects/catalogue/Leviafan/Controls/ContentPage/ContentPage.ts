/// <reference path="../../../Common/Library/Core/Types/OO.d.ts" />
/// <reference path="../../../Common/Library/UI/Core/Views/ViewBase.d.ts" />
/// <reference path="../../../Common/Library/UI/Core/Controls/ControlBase.d.ts" />
/// <reference path="../../../Common/Library/UI/Core/Renderers/ViewRenderer.d.ts" />
/// <reference path="../../../Common/Library/UI/Core.Knockout/Libraries/knockout/knockout.d.ts" />
/// <reference path="../../../Common/Library/Core/Libraries/jQuery/jQuery.d.ts" />
/// <reference path="../../../Common/Library/Core/Libraries/jQuery/SDL.jQuery.d.ts" />

module LVF.Controls
{
    eval(SDL.Client.Types.OO.enableCustomInheritance);

    export class ContentPage extends SDL.UI.Core.Controls.ControlBase
    {
        private $element: JQuery;
        public context: KnockoutObservable<any>;

        constructor(element: HTMLElement, options?: any)
        {
            super(element, options);

            this.context = ko.observable(null);
        }

        public render()
        {
            var p = this.properties;
            this._renderInnerView(p.options.view);
        }

        private _renderInnerView(view: string): void
        {
            var p = this.properties;
            var _this = this;
            if(!this.$element)
            {
                this.$element = SDL.jQuery("#page-content", p.element);
            }
            SDL.UI.Core.Renderers.ViewRenderer.renderView(view, this.$element, null, function(view: any){
                _this.context(view.properties.model);
            })
        }

        public update(options: any): void
        {
            debugger;

            this._renderInnerView(options.view);
            this.callBase("SDL.UI.Core.Controls.ControlBase", "update", arguments);
        }
    }

    SDL.Client.Types.OO.createInterface("LVF.Controls.ContentPage", ContentPage);
}
