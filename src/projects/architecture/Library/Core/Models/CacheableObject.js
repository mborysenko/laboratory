/*! @namespace {SDL.Client.Models.CacheableObject} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.CacheableObject");

SDL.Client.Models.CacheableObject.$constructor = function SDL$Client$Models$CacheableObject$constructor()
{
	this.addInterface("SDL.Client.Models.MarshallableObject");

	var p = this.properties;
	p.timeStamps = {}; //times of loading of data, item can have multiple pieces of data cached separately
	p.maxAge;
};

SDL.Client.Models.CacheableObject.prototype.getMaxAge = function SDL$Client$Models$CacheableObject$getMaxAge()
{
	var p = this.properties;
	if (p.maxAge == undefined)
	{
		var interfaces = this.getInterfaceNames();
		var xpath = "//configuration/customSections/models:domainModels/models:caching/models:cache[(@implementation=\"" +
			interfaces.join("\" or @implementation=\"") + "\") and (number(@max-age) = @max-age) and (not(@priority) or number(@priority) = @priority)]";

		var settings = SDL.Client.Xml.selectNodes(SDL.Client.Configuration.ConfigurationManager.configuration, xpath);
		if (settings.length)
		{
			var maxAgeIndex = 0;
			var maxPrio = Number(settings[0].getAttribute("priority")) || 0;

			for (var i = 1, len = settings.length; i < len; i++)
			{
				var prio = Number(settings[i].getAttribute("priority")) || 0;
				if (prio > maxPrio)
				{
					maxAgeIndex = i;
					prio = maxPrio;
				}
			}
			p.maxAge = Number(settings[maxAgeIndex].getAttribute("max-age"));
		}
		else
		{
			p.maxAge = null;
		}
	}
	return p.maxAge;
};

SDL.Client.Models.CacheableObject.prototype.isCacheValid = function SDL$Client$Models$CacheableObject$isCacheValid(data)
{
	var maxAge = this.getMaxAge();
	return maxAge == undefined || (maxAge * 1000 > (new Date()).getTime() - this.getTimeStamp(data));
};

SDL.Client.Models.CacheableObject.prototype.invalidateCache = function SDL$Client$Models$CacheableObject$invalidateCache(data)
{
	if (data != undefined)
	{
		delete this.properties.timeStamps[data]
	}
	else
	{
		this.properties.timeStamps = {};
	}
};

/**
@return {Date}
*/
SDL.Client.Models.CacheableObject.prototype.getTimeStamp = function SDL$Client$Models$CacheableObject$getTimeStamp(data)
{
	return this.properties.timeStamps[data || ""] || 0;
};

SDL.Client.Models.CacheableObject.prototype.setTimeStamp = function SDL$Client$Models$CacheableObject$setTimeStamp(timeStamp, data)
{
	this.properties.timeStamps[data || ""] = timeStamp;
};

// ------- SDL.Client.Models.MarshallableObject implementations/overrides
SDL.Client.Models.CacheableObject.prototype.pack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$CacheableObject$pack()
{
	var p = this.properties;
	return {
				timeStamps: p.timeStamps,
				maxAge: p.maxAge
			};
});

SDL.Client.Models.CacheableObject.prototype.unpack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$CacheableObject$unpack(data)
{
	if (data)
	{
		var p = this.properties;
		p.timeStamps = SDL.Client.Types.Object.clone(data.timeStamps);
		p.maxAge = data.maxAge;
	}
});
// ------- end of SDL.Client.Models.MarshallableObject overrides