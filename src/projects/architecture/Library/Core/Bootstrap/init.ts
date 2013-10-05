/// <reference path="../Libraries/jQuery/SDL.jQuery.ts" />
/// <reference path="../ConfigurationManager/ConfigurationManager.ts" />
/// <reference path="../Resources/ResourceManager.ts" />
/// <reference path="../Event/EventRegister.d.ts" />

module SDL.Client
{
	Resources.ResourceManager.registerPackageRendered("SDL.Client.Init");
	var cm = Configuration.ConfigurationManager;
	cm.init(function()
	{
		Localization.setCulture(cm.getAppSetting("culture") || "en");

		Resources.ResourceManager.readConfiguration();
		Application.initialize(function()
		{
			if (!Application.isReloading)
			{
				var pageNode;
				var pageNodes = Xml.selectNodes(cm.configuration, "//configuration/pages/page[@url!='*']");
				var path = window.location.pathname.toLowerCase();

				for (var i = 0, len = pageNodes.length; i < len; i++)
				{
					var _pageNode = <Element>pageNodes[i];
					if (_pageNode.getAttribute("url").toLowerCase() == path)
					{
						pageNode = _pageNode;
						break;
					}
				}
				if (!pageNode)
				{
					pageNode = Xml.selectSingleNode(cm.configuration, "//configuration/pages/page[@url='*']")
				}

				if (pageNode)
				{
					window.document.title = pageNode.getAttribute("title");

					var resource = pageNode.getAttribute("resource");
					if (resource)
					{
						Resources.ResourceManager.load(resource);
					}

					return;
				}
				SDL.Client.Diagnostics.Assert.raiseError("Unable to find configuration for page \"" + path + "\"");
			}
		});
	});
}