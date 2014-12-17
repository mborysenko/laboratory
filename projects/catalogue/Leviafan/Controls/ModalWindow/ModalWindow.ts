/// <reference path="../../../Common/Library/UI/Core/Renderers/ViewRenderer.d.ts" />
/// <reference path="../../../Common/Library/UI/Core/Views/ViewBase.d.ts" />
/// <reference path="../../../Common/Library/UI/Core/Controls/Base.d.ts" />
/// <reference path="../../../Common/Library/UI/Core.Knockout/Libraries/knockout/knockout.d.ts" />
/// <reference path="../../../Common/Library/UI/Core.Knockout/Utils/knockout.ts" />
/// <reference path="../../../Common/Library/Core/Types/OO.d.ts" />
/// <reference path="../../../Common/Library/Core/Libraries/jQuery/jQuery.d.ts" />
/// <reference path="../../../Common/Library/UI/Core/Css/ZIndexManager.d.ts" />

module LVF.Controls
{
    export interface IInnerViewOptions
    {
        type: string;
        options: any;
    }

    export interface IModalWindowOptions
    {
        visible: boolean;
        withOverlay: boolean;
        fullScreen: boolean;
        innerView: IInnerViewOptions
        onClose: () => void;
    }

    eval(SDL.Client.Types.OO.enableCustomInheritance);

    export class ModalWindow extends SDL.UI.Core.Controls.ControlBase
    {
        private defaultOptions: any = {
            withOverlay: false,
            visible: false
        };

        private $element: JQuery = null;
        private $overlay: JQuery = null;
        private isVisible: boolean = false;
        private withOverlay: boolean = true;
        private isDOMRendered: boolean = false;

        private innerView: SDL.UI.Core.Views.ViewBase = null;
        private innerViewType: string = null;
        private innerViewOptions: any = {};

        static $screen: JQuery;

        constructor(element: HTMLElement, options?: IDialogOptions)
        {
            super(element, options || {});
        }

        $initialize(): void
        {
            var p = this.properties;

            this.$element = SDL.jQuery(p.element);

            this._renderDOM();

            if (p.options.visible != null && p.options.visible.toString() == "false")
            // show by default, unless visibility is set to false or "false"
            {
                this.hide();
            }
            else
            {
                this.show();
            }
        }

        public update(options?: IModalWindowOptions): void
        {
            var p = this.properties;

            if (options.data && options.data.innerViewType)
            {
                var $container = SDL.jQuery(".b-modal_content", this.properties.element);

                this._renderInnerView(options.data.innerViewType, $container.get(0), options.data.data, this.getDelegate(this._onInnerViewRendered));
            }


            if (options.visible != null && options.visible.toString() == "false")
            {
                this.hide();
            }
            else if (options.visible || this.isVisible)
            {
                this.show();
            }
        }

        public show(): void
        {
            if (this.isVisible != true)
            {
                this.isVisible = true;

                setTimeout(() =>
                    // timeout to allow the content to finish rendering for proper dimensions
                {
                    this.$element
                        .removeClass("__hidden")
                        .keydown(this.getDelegate(this._onKeyDown));

                    this.$overlay
                        .removeClass("__hidden")

                    this.fireEvent("show");
                });
            }
        }

        public hide(): void
        {
            if (this.isVisible != false)
            {
                this.isVisible = false;
                this.$element.addClass("__hidden");
                this.$overlay.addClass("__hidden");

                this._onHide();
                this.fireEvent("close");
            }
        }

        private _renderOverlay(): void
        {
            this.$overlay = SDL.jQuery('<div class="b-overlay"></div>').addClass("__hidden");

            this.$overlay.insertBefore(this.$element);
        }

        private _renderDOM(): void
        {
            var p = this.properties;
            var data = p.options.data;

            if (this.isDOMRendered)
            {
                return;
            }

            this.$element.addClass("b-modal");

            this._renderOverlay();

            var $content = SDL.jQuery('<div class="b-modal_content"></div>');
            var $actionBar = SDL.jQuery('<div class="b-modal_actions"></div>');
            var $actions = SDL.jQuery('<div class="b-actions __fr"></div>');

            var $closeAction = SDL.jQuery('<div class="b-icon __small __close"></div>');

            // Define actions
            $closeAction.on("click", this.getDelegate(this._close));

            $actions.append($closeAction);
            $actionBar.append($actions);
            this.$element.append($actionBar);
            this.$element.append($content);

            if (data && data.innerView)
            {
                this._renderInnerView(this.innerViewType, $content.get(0), this.innerViewOptions, this.getDelegate(this._onInnerViewRendered));
            }

            this.isDOMRendered = true;
        }

        private _renderInnerView(view: string, element: HTMLElement, options: any, callback?: (view: any) => any, errorcallback?: (error: string) => void)
        {
            ko.utils.domNodeDisposal.addDisposeCallback(element, ModalWindow._innerViewElementDisposalCallback);
            SDL.UI.Core.Renderers.ViewRenderer.renderView(view, element, options, callback, errorcallback);
        }

        private _onInnerViewRendered(view: any)
        {
            this.innerView = view;
            ko.utils.domNodeDisposal.addDisposeCallback(view.getElement(), (element: HTMLElement) =>
            {
                SDL.UI.Core.Renderers.ViewRenderer.disposeView(view);
            });
        }

        private _disposeInnerView(view): void
        {
            SDL.UI.Core.Renderers.ViewRenderer.disposeView(view);

            // Destroy htnl of inner view
            var $content = this.$element.find(".b-modal_content");
            ModalWindow._disposeElement($content.get(0));
            $content.empty();
        }

        private static _disposeElement(element: HTMLElement): void
        {
            SDL.jQuery(element).removeData();
        }

        private static _innerViewElementDisposalCallback(element: HTMLElement): void
        {
            SDL.jQuery(element).removeData();
        }

        private _onHide()
        {
            this._disposeInnerView(this.innerView);
        }

        private _onKeyDown(e: JQueryEventObject)
        {
            if (e.which == SDL.UI.Core.Event.Constants.Keys.ESCAPE)
            {
                e.stopPropagation();
                this._close();
            }
        }

        private _close()
        {
            this.hide();
        }

        private _cleanUp()
        {
            this._onHide();
            this.$element = null;
        }
    }

    ModalWindow.prototype.disposeInterface = SDL.Client.Types.OO.nonInheritable(function SDL$UI$Controls$Dialog$disposeInterface()
    {
        this._cleanUp();
    });

    SDL.Client.Types.OO.createInterface("LVF.Controls.ModalWindow", ModalWindow);
} 