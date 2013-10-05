/*! @namespace {SDL.Client.Models.Base.Item} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.Base.Item");

/*
	Base implementation for a typical domain model item.
*/
SDL.Client.Models.Base.Item.$constructor = function SDL$Client$Models$Base$Item$constructor(id)
{
	this.addInterface("SDL.Client.Models.ModelObject", [id]);
	this.addInterface("SDL.Client.Models.LoadableObject");

	var p = this.properties;
	p.title;
	p.lastModified;
};

SDL.Client.Models.Base.Item.prototype.invalidateInterfaceCachedState = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$Item$invalidateInterfaceCachedState()
{
	var p = this.properties;
	p.title = undefined;
});

SDL.Client.Models.Base.Item.prototype.getTitle = function SDL$Client$Models$Base$Item$getTitle()
{
	return this.properties.title;
};

/*
	Returns the last modified date of the item, presented as an ISO string.
*/
SDL.Client.Models.Base.Item.prototype.getLastModifiedDateString = function SDL$Client$Models$Base$Item$getLastModifiedDateString()
{
	return this.properties.lastModified;
};

/*
	Returns the ID of the item as stored in its managing CMS.
	Example:
		var id = Cmis.Model.getModelSpecificUri("workspace://SpacesStore/2c5de88b-92cb-403c-ab13-43e87f9490b1",
			"f16674d1-a258-4d64-bafb-55eb44a4d8be", {SDL.Client.Models.ItemType}.CMIS_DOCUMENT);
		var item = {SDL.Client.Models}.getItem(id);
		item.getId();			//	"cmis:document/f16674d1-a258-4d64-bafb-55eb44a4d8be/workspace%3A%2F%2FSpacesStore%2F2c5de88b-92cb-403c-ab13-43e87f9490b1"
		item.getOriginalId();	//	"workspace://SpacesStore/2c5de88b-92cb-403c-ab13-43e87f9490b1"
*/
SDL.Client.Models.Base.Item.prototype.getOriginalId = function SDL$Client$Models$Base$Item$getOriginalId()
{
	return this.getModelFactory().getOriginalId(this.getId());
};

// ------- SDL.Client.Models.MarshallableObject implementations/overrides
SDL.Client.Models.Base.Item.prototype.pack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$Item$pack()
{
	var p = this.properties;
	return {
		title: p.title,
		lastModified: p.lastModified
	};
});

SDL.Client.Models.Base.Item.prototype.unpack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$Item$unpack(data)
{
	if (data)
	{
		var p = this.properties;
		p.title = data.title;
		p.lastModified = data.lastModified;
	}
});
// ------- end of SDL.Client.Models.MarshallableObject overrides