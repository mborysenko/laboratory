/// <reference path="../Application/Application.ts" />
/// <reference path="../Types/Url2.ts" />
/// <reference path="../Xml/Xml.Base.ts" />

module SDL.Client.Configuration
{
	export declare var settingsFile: string;
	export declare var settingsVersion: string;

	export interface IConfigurationManager
	{
		configuration: Node;
		configurationFiles: {[resolvedUrl: string]: {url: string; data?: string;}};
		corePath: string;
		coreVersion: string;
		initialize(callback?: () => void, nonCoreInitCallback?: () => void): void;
		isInitialized: boolean;
		getAppSetting(name: string): string;
		isApplicationHost: boolean;
	};

	class ConfigurationManagerClass implements IConfigurationManager
	{
		public configuration: Node;
		public corePath: string;
		public coreVersion: string;
		public configurationFiles: {[resolvedUrl: string]: {url: string; data?: string;}} = {};
		public isApplicationHost: boolean;
		public isInitialized: boolean = false;

		private nonCoreInitialized = false;
		private initCallbacks: {(): void;}[];
		private nonCoreInitCallbacks: {(): void;}[];
		private loadingCounter: number = 0;
		private coreConfigurationToLoad: Element[] = [];

		initialize(callback?: () => void, nonCoreInitCallback?: () => void): void
		{
			if (nonCoreInitCallback)
			{
				if (this.nonCoreInitialized)
				{
					nonCoreInitCallback();
				}
				else if (this.nonCoreInitCallbacks)
				{
					this.nonCoreInitCallbacks.push(nonCoreInitCallback);
				}
				else
				{
					this.nonCoreInitCallbacks = [nonCoreInitCallback];
				}
			}

			if (!this.isInitialized)
			{
				if (callback)
				{
					if (this.initCallbacks)
					{
						this.initCallbacks.push(callback);
					}
					else
					{
						this.initCallbacks = [callback];
					}
				}

				if (this.isInitialized === false)
				{
					this.isInitialized = undefined;

					if (!Application.isInitialized)
					{
						this.coreConfigurationToLoad = [];
						Application.addInitializeCallback(() => this.loadPostponedCoreConfiguration());
					}

					if (!settingsFile)
					{
						settingsFile = "/configuration.xml";
					}

					if (settingsFile.charAt(0) != "/")
					{
						settingsFile = Types.Url.combinePath(window.location.pathname , settingsFile);	// making sure the path starts with "/"
					}

					this.configurationFiles[settingsFile.toLowerCase()] = {url: settingsFile};

					this.loadingCounter = 1;

					xhr(settingsVersion ? Types.Url.combinePath(settingsFile, "?" + settingsVersion) : settingsFile,
						(result) => this.processConfigurationFile(result, settingsFile));
				}
			}
			else if (callback)
			{
				callback();
			}
		}

		public getAppSetting(name: string): string
		{
			return Xml.getInnerText(this.configuration, "//configuration/appSettings/setting[@name='" + name +  "']/@value");
		}

		private callbacks()
		{
			if (this.initCallbacks)
			{
				for (var i = 0, len = this.initCallbacks.length; i < len; i++)
				{
					this.initCallbacks[i]();
				}
				this.initCallbacks = null;
			}
		}

		private nonCoreCallbacks()
		{
			if (this.nonCoreInitCallbacks)
			{
				for (var i = 0, len = this.nonCoreInitCallbacks.length; i < len; i++)
				{
					this.nonCoreInitCallbacks[i]();
				}
				this.nonCoreInitCallbacks = null;
			}
		}

		private processConfigurationFile(xmlString: string, baseUrl: string, parentElement?: Element)
		{
			this.configurationFiles[(baseUrl.indexOf("~/") == 0 ? Types.Url.combinePath(this.corePath, baseUrl.slice(2)) : baseUrl).toLowerCase()].data = xmlString;

			var document: Document = Xml.getNewXmlDocument(xmlString);
			if (Xml.hasParseError(document))
			{
				throw Error("Invalid xml loaded: " + baseUrl + "\n" + Xml.getParseError(document));
			}

			var data: Element = document.documentElement;

			if (!this.configuration)
			{
				this.configuration = data;
			}

			if (!this.corePath)
			{
				var corePath = Xml.getInnerText(data, "//configuration/appSettings/setting[@name='corePath']/@value");
				if (corePath != null)
				{
					if (!corePath)
					{
						corePath = "/";
					}
					else if (corePath.slice(-1) != "/")
					{
						corePath += "/";
					}
					this.corePath = Types.Url.combinePath(baseUrl, corePath);
				}
			}

			if (this.coreVersion == null)
			{
				this.coreVersion = Xml.getInnerText(data, "//configuration/appSettings/setting[@name='coreVersion']/@value");
			}

			var includeNodes = <Element[]>Xml.selectNodes(data, "//configuration/include[not(configuration)]");	// do not load if configuration is already included (merged)

			if (parentElement)
			{
				parentElement.appendChild(data);
			}

			var len = includeNodes.length;
			this.loadingCounter += len;

			if (baseUrl)
			{
				data.setAttribute("baseUrl", baseUrl);
			}

			for (var i = 0; i < len; i++)
			{
				this.loadIncludedConfigurationFile(includeNodes[i], baseUrl);
			};

			this.loadingCounter--;

			if (!this.nonCoreInitialized && this.loadingCounter == (this.coreConfigurationToLoad ? this.coreConfigurationToLoad.length : 0))
			{
				this.nonCoreInitialized = true;
				this.isApplicationHost = !!Xml.selectSingleNode(this.configuration, "//configuration/applicationHost");
				this.nonCoreCallbacks();
			}

			if (!this.loadingCounter)
			{
				this.isInitialized = true;
				this.callbacks();
			}
		}

		private loadPostponedCoreConfiguration()
		{
			if (this.coreConfigurationToLoad)
			{
				var libraryConfigurationToLoad = this.coreConfigurationToLoad;
				this.coreConfigurationToLoad = null;
				for (var i = 0, len = libraryConfigurationToLoad.length; i < len; i++)
				{
					this.loadCoreConfigurationFile(null, libraryConfigurationToLoad[i]);
				}
			}
		}

		private loadCoreConfigurationFile(url: string, node: Element)
		{
			if (!url)
			{
				url = node.getAttribute("src");
			}

			this.loadConfigurationFile(url, Types.Url.combinePath(this.corePath, url.slice(2)), node);
		}

		private loadIncludedConfigurationFile(node: Element, baseUrl: string)
		{
			var url = node.getAttribute("src");

			if (url.indexOf("~/") == 0)	// loading core library resource
			{
				if (this.coreConfigurationToLoad)	// need to postpone core configuration files
				{
					this.coreConfigurationToLoad.push(node);
				}
				else
				{
					this.loadCoreConfigurationFile(url, node);
				}
			}
			else
			{
				url = Types.Url.combinePath(baseUrl, url);
				if (url.indexOf("~/") == 0)
				{
					this.loadCoreConfigurationFile(url, node);
				}
				else
				{
					this.loadConfigurationFile(url, url, node);
				}
			}
		}

		private loadConfigurationFile(url: string, resolvedUrl: string, node: Element)
		{
			if (this.configurationFiles[resolvedUrl.toLowerCase()])
			{
				// file is already included, skip it here
				this.loadingCounter--;
				return;
			}

			this.configurationFiles[resolvedUrl.toLowerCase()] = {url: url};

			var version: string;
			var appVersionNodes = <Element[]>Xml.selectNodes(node, "ancestor::configuration/appSettings/setting[@name='version' and @value]");
			
			if (appVersionNodes.length)
			{
				var appVersionNode = appVersionNodes[appVersionNodes.length - 1];
				if (url.indexOf("~/") == 0)
				{
					version = Xml.getInnerText(appVersionNode, "../../appSettings/setting[@name='coreVersion']/@value");
				}
				if (!version)
				{
					version = appVersionNode.getAttribute("value");
				}
			}

			var modification = node.getAttribute("modification");
			version = (version && modification) ? (version + "." + modification) : (version || modification);

			if (Application.isHosted && Application.useHostedLibraryResources && url.indexOf("~/") == 0)
			{
				Application.ApplicationHost.getCommonLibraryResource({url: url, version: version}, Application.libraryVersion, (result) => this.processConfigurationFile(result, url, node));
			}
			else
			{
				xhr(version ? Types.Url.combinePath(resolvedUrl, "?" + version) : resolvedUrl, (result) => this.processConfigurationFile(result, url, node));
			}
		}
	};

	function xhr(url: string, callback: (result: string) => void): void
	{
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function ()
		{
			if (xhr.readyState == 4)
			{
				var statusCode = xhr.status;
				if (statusCode < 200 || statusCode >= 300)
				{
					var error: string;
					try
					{
						error = xhr.statusText;
					}
					catch (err)
					{ }

					throw Error(error || xhr.responseText);
				}

				callback(xhr.responseText);
			}
		};
		xhr.open("GET", url, true);
		xhr.send();
	}

	export var ConfigurationManager: IConfigurationManager = new ConfigurationManagerClass();
}