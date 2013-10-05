/// <reference path="../Libraries/jQuery/SDL.jQuery.ts" />
/// <reference path="../Net/Ajax.d.ts" />
/// <reference path="../Xml/Xml.d.ts" />
/// <reference path="../Types/Types.d.ts" />
/// <reference path="../Types/Url.d.ts" />

module SDL.Client.Configuration
{
	export declare var settingsFile: string;
	export declare var settingsVersion: string;

	export interface IConfigurationManager
	{
		configuration: Node;
		corePath: string;
		coreVersion: string;
		init(callback?: () => void): void;
		init(settingsUrl: string, callback?: () => void): void;
		getAppSetting(name: string): string;
	};

	class ConfigurationManagerClass implements IConfigurationManager
	{
		public loadingCounter: number = 0;
		public configuration: Node;
		public corePath: string;
		public coreVersion: string;

		private confFiles: string[] = [];
		private initialized = false;
		private initCallbacks;

		init(settingsUrl: string, callback?: () => void): void;
		init(callback?: () => void): void;
		init(settingsUrl?: any, callback?: () => void): void
		{
			if (SDL.Client.Type.isString(settingsUrl))
			{
				settingsFile = <string>settingsUrl;
			}
			else
			{
				if (!callback)
				{
					callback = settingsUrl;
				}

				if (!settingsFile)
				{
					settingsFile = "/configuration.xml";
				}
			}

			if (settingsFile.charAt(0) != "/")
			{
				settingsFile = Types.Url.combinePath(window.location.pathname , settingsFile);	// making sure the path starts with "/"
			}

			if (!this.initialized)
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

				this.confFiles.push(settingsFile);

				if (settingsVersion)
				{
					settingsFile = Types.Url.combinePath(settingsFile, "?" + settingsVersion);
				}

				this.loadingCounter = 1;

				Net.getRequest(settingsFile, (result) => this.processConfigurationFile(result, settingsFile), null);
			}
			else if (callback)
			{
				callback();
			}
		}

		processConfigurationFile(xmlString: string, baseUrl: string, parentElement?: Element)
		{
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

			var includeNodes = Xml.selectNodes(data, "//configuration/include[not(configuration)]");	// do not load if configuration is already included (merged)

			if (parentElement)
			{
				parentElement.appendChild(data);
			}

			this.loadingCounter += includeNodes.length;

			SDL.jQuery.each(includeNodes, (i, node: Element) =>
			{
				var url = node.getAttribute("src");
				var resolvedUrl;
				var version;

				if (url.indexOf("~/") != 0)
				{
					url = Types.Url.combinePath(baseUrl, url);
				}

				if (url.indexOf("~/") == 0)
				{
					resolvedUrl = Types.Url.combinePath(this.corePath, url.slice(2));
					version = this.coreVersion;
				}
				else
				{
					resolvedUrl = url;
				}

				if (this.confFiles.indexOf(resolvedUrl) != -1)
				{
					// file is already included, skip it here
					this.loadingCounter--;
					return;
				}

				this.confFiles.push(resolvedUrl);

				if (!version)
				{
					var appVersionNodes =  Xml.selectNodes(node, "ancestor::configuration/appSettings/setting[@name='version']/@value");
					version = appVersionNodes.length ? appVersionNodes[appVersionNodes.length - 1].nodeValue : "";
				}

				var modification = node.getAttribute("modification");
				version = (version && modification) ? (version + "." + modification) : (version || modification);

				if (version)
				{
					resolvedUrl = Types.Url.combinePath(resolvedUrl, "?" + version);
				}

				Net.getRequest(resolvedUrl, (result) => this.processConfigurationFile(result, url, node), null);
			});

			if (baseUrl)
			{
				data.setAttribute("baseUrl", baseUrl);
			}

			this.loadingCounter--;

			if (this.loadingCounter == 0 )
			{
				this.initialized = true;
				this.callbacks();
			}
		}
	
		public toString(): string
		{
			return Xml.getOuterXml(this.configuration, null);
		}

		public getAppSetting(name: string): string
		{
			return Xml.getInnerText(this.configuration, "//configuration/appSettings/setting[@name='" + name +  "']/@value");
		}

		private callbacks()
		{
			if (this.initCallbacks)
			{
				SDL.jQuery.each(this.initCallbacks, function(i, callback) { callback(); });
				this.initCallbacks = null;
			}
		}
	};

	export var ConfigurationManager: IConfigurationManager = new ConfigurationManagerClass();
}