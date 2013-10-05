/*! @namespace {SDL.Client.Models.Navigator} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.Navigator");

SDL.Client.Models.Navigator.$constructor = function SDL$Client$Models$Navigator$constructor()
{
	this.addInterface("SDL.Client.Types.DisposableObject");
};

SDL.Client.Models.Navigator.prototype.$initialize = function SDL$Client$Models$Navigator$constructor()
{
	var navigators = (SDL.Client.Models.getFromRepository("models-navigator-registry") ||
		SDL.Client.Models.createInRepository("models-navigator-registry", "SDL.Client.Models.MarshallableArray"));

	navigators.getArray().push(this);
};

SDL.Client.Models.Navigator.prototype.navigateTo = function SDL$Client$Models$Navigator$navigateTo(item, exploring, fromWindow)
{ };

SDL.Client.Models.Navigator.prototype.disposeInterface = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Navigator$disposeInterface()
{
	var reg = SDL.Client.Models.getFromRepository("models-navigator-registry");
	if (reg)
	{
		var navs = reg.getArray();
		SDL.Client.Types.Array.removeAt(navs, SDL.jQuery.inArray(this, navs));
	}
});

// static method
SDL.Client.Models.Navigator.getNavigator = function SDL$Client$Models$Navigator$getNavigator()
{
	var reg = SDL.Client.Models.getFromRepository("models-navigator-registry");
	if (reg)
	{
		return reg.getArray()[0];
	}
};
