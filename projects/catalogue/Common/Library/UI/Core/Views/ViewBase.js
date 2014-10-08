/*! @namespace {SDL.UI.Core.Views.ViewBase} */
SDL.Client.Types.OO.createInterface("SDL.UI.Core.Views.ViewBase");

/**
* Provides the base class for all tridion controls.
* @constructor
* @param {HTMLElement} markupElement The html element that contains the declarative markup for this control.
*/
SDL.UI.Core.Views.ViewBase.$constructor = function SDL$UI$Core$View$ViewBase$constructor(element, settings)
{
    this.addInterface("SDL.Client.Types.ObjectWithEvents");

    var p = this.properties;
	p.element = element;
	p.settings = settings;
};

SDL.UI.Core.Views.ViewBase.prototype.$initialize = function SDL$UI$Core$View$ViewBase$initialize()
{
	SDL.UI.Core.Renderers.ViewRenderer.onViewCreated(this);
	this.properties.templateName = this.getTypeName();
};

SDL.UI.Core.Views.ViewBase.prototype.getRenderOptions = function SDL$UI$Core$View$ViewBase$getRenderOptions()
{
	return null;
};

SDL.UI.Core.Views.ViewBase.prototype.render = function SDL$UI$Core$View$ViewBase$render(callback)
{
	this.getTemplateRenderer().render(this.getTemplateData(), this.properties.element, this.getRenderOptions(), callback);
};

SDL.UI.Core.Views.ViewBase.prototype.getTemplateData = function SDL$UI$Core$View$ViewBase$getTemplateData()
{
	var templateResource = this.getTemplateResource();
	if (!templateResource || !templateResource.loaded)
	{
		throw Error("Template resource '" + this.getTemplateName() + "' is not loaded.");
	}
	return templateResource.template;
};

SDL.UI.Core.Views.ViewBase.prototype.getTemplateResource = function SDL$UI$Core$View$ViewBase$getTemplateResource()
{
	return SDL.Client.Resources.ResourceManager.getTemplateResource(this.getTemplateName());
};

SDL.UI.Core.Views.ViewBase.prototype.getTemplateRenderer = function SDL$UI$Core$View$ViewBase$getTemplateRenderer()
{
	var templateName = this.getTemplateName();
	var templateResource = SDL.Client.Resources.ResourceManager.getTemplateResource(templateName);
	if (!templateResource || !templateResource.loaded)
	{
		throw Error("Template resource '" + templateName + "' is not loaded.");
	}
	var renderer = SDL.UI.Core.Renderers.ViewRenderer.getTemplateRenderer(templateResource.type);
	if (!renderer)
	{
		throw Error("No renderer is registered for tempalte type '" + templateResource.type + "' (tempalte '" + templateName + "'). ");
	}
	return renderer;
};

SDL.UI.Core.Views.ViewBase.prototype.getTemplateName = function SDL$UI$Core$View$ViewBase$getTemplateName()
{
    return this.properties.templateName;
}

SDL.UI.Core.Views.ViewBase.prototype.getElement = function SDL$UI$Core$View$ViewBase$getElement()
{
    return this.properties.element;
}

SDL.UI.Core.Views.ViewBase.prototype.disposeInterface = SDL.Client.Types.OO.nonInheritable(function SDL$UI$Core$View$ViewBase$disposeInterface()
{
	SDL.UI.Core.Renderers.ViewRenderer.onViewDisposed(this);
});