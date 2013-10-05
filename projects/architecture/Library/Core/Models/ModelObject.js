/*! @namespace {SDL.Client.Models.ModelObject} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.ModelObject");

/*
	Makes an object "model-aware".
	Model object knows its implementing model (model factory), its own item type, it can be marshalled and trigger events.
*/
SDL.Client.Models.ModelObject.$constructor = function SDL$Client$Models$ModelObject$constructor(id)
{
	SDL.Client.Diagnostics.Assert.areEqual(SDL.Client.Models.getRepositoryOwningWindow(), window,
		"An object of type SDL.Client.Models.ModelObject can only be created in the context of ModelRepository");

	this.addInterface("SDL.Client.Models.IdentifiableObject", [id]);

	var p = this.properties;
	p.modelFactory;
	p.itemType;
};

/*
	Returns the Model object that manages the current item.
	Different models can be registered with the system, each managing a specific domain.
	A Model is determined based on the item ID (the prefix used in the ID).
*/
SDL.Client.Models.ModelObject.prototype.getModelFactory = function SDL$Client$Models$ModelObject$getModelFactory()
{
	var p = this.properties;
	if (p.modelFactory === undefined)
	{
		p.modelFactory = SDL.Client.Models.getModelFactory(this.getId());
	}
	return p.modelFactory;
};

/*
	Returns the string specifying the type of the item defined by the corresponding domain model.
*/
SDL.Client.Models.ModelObject.prototype.getItemType = function SDL$Client$Models$ModelObject$getItemType()
{
	var p = this.properties;
	if (p.itemType === undefined)
	{
		p.itemType = this.getModelFactory().getItemType(this.getId());
	}
	return p.itemType;
};