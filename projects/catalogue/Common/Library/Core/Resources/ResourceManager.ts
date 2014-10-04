/// <reference path="Resources.d.ts" />
/// <reference path="FileResourceHandler.ts" />
/// <reference path="../ConfigurationManager/ConfigurationManager.ts" />
/// <reference path="../Xml/Xml.ts" />

module SDL.Client.Resources
{
	SDL.jQuery.ajaxSetup({
			// Enable caching of AJAX responses
			cache: true
		});

	export interface IResourceGroupOptions
	{
		name: string;
		files?: IFileResourceDefinition[];
		dependencies?: string[];
		extensions?: string[];
		loading?: boolean;
		rendered?: boolean;
	}

	export enum ResourceManagerMode	// bitwise flag
	{
		NORMAL = 0,			// asynchronous, independent resources are loaded in the order they are specified
		REVERSE = 1,		// reverse the loading order of independent resources
		SYNCHRONOUS = 2		// load resources synchronously
	}

	export interface IResourceManager
	{
		setMode(mode: ResourceManagerMode): void;
		newResourceGroup(options: IResourceGroupOptions): void;
		getTemplateResource(templateId: string): IFileResource;
		resolveResources(resourceGroupName: string): IResolvedResourceGroupResult[];
		load(resourceGroupName: string, callback?: () => void, errorcallback?: (error: string) => void): void;
		readConfiguration():void;
		storeFileData(url: string, data: string, isShared?: boolean): void;
		registerPackageRendered(packageName: string, url?: string, data?: string): void;
	}

	class ResourceManagerClass implements IResourceManager
	{
		private mode = ResourceManagerMode.NORMAL;

		// Collection of all registered resource groups
		private registeredResources: {[index: string]: IResourceGroupOptions;} = {};
		private callbacks: {[index: string]: JQueryCallback;} = {};

		setMode(mode: ResourceManagerMode): void
			{
				this.mode = mode;
			}

		newResourceGroup(options: IResourceGroupOptions): void
			{
				if (!this.registeredResources[options.name])
				{
					this.registeredResources[options.name] = options;
				}
				else
				{
					throw Error("Resource group with name '" + options.name + "' is already registered.");
				}
			}

		getTemplateResource(templateId: string): IFileResource
			{
				return FileResourceHandler.getTemplateResource(templateId);
			}

		resolveResources(resourceGroupName: string): IResolvedResourceGroupResult[]
			{
				return SDL.jQuery.map(this._resolve(resourceGroupName), (name: string) =>
					{
						var resource = this.registeredResources[name];
						if (resource.files && resource.files.length)
						{
							return {
									name: resource.name,
									files: SDL.jQuery.map(resource.files, file => file.url)
								}
						}
					});
			}

		load(resourceGroupName: string, callback?: () => void, errorcallback?: (error: string) => void): void
			{
				this._render(resourceGroupName, callback, errorcallback);
			}

		readConfiguration():void
			{
				var config: Element = Configuration.ConfigurationManager.configuration;

				FileResourceHandler.corePath = Configuration.ConfigurationManager.corePath;
				FileResourceHandler.enablePackaging = Configuration.ConfigurationManager.getAppSetting("debug") != "true";

				if (Configuration.ConfigurationManager.isApplicationHost)
				{
					SDL.jQuery.each(Configuration.ConfigurationManager.configurationFiles,
						(url: string, file: {url: string; data: string;}) =>
							{
								if (file.url.indexOf("~/") == 0)	// only store library files
								{
									FileResourceHandler.storeFileData(file.url, file.data);
								}
							});
				}
				Configuration.ConfigurationManager.configurationFiles = null;

				// traversing xml rather than using xpath, for performance optimization
				var extensions: {[group: string]: string[];} = {};		// collections populated by extensions configuration
				var dependencies: {[group: string]: string[];} = {};	// collections populated by extensions configuration
				var packageResourcesToRegister: IPackageResourceDefinition[] = [];

				var processConfigurationElement = (configuration: Element, baseUrl: string, version: string, locales: {[locale: string]: boolean;}) =>
				{
					baseUrl = configuration.getAttribute("baseUrl") || baseUrl;

					var childNode: Element = <Element>configuration.firstChild;
					while (childNode)
					{
						if (childNode.nodeType == 1 && !childNode.namespaceURI)
						{
							switch (Xml.getLocalName(childNode))
							{
								case "appSettings":
									version = getVersionSetting(childNode);
									break;
								case "locales":
									locales = getSupportedLocales(childNode);
									break;
							}
						}
						childNode = <Element>childNode.nextSibling;
					}

					childNode = <Element>configuration.firstChild;
					while (childNode)
					{
						if (childNode.nodeType == 1 && !childNode.namespaceURI)
						{
							switch (Xml.getLocalName(childNode))
							{
								case "appSettings":
									break;
								case "resourceGroups":
									processResourceGroupsElement(childNode, baseUrl, version, locales);
									break;
								case "extensions":
									processExtensionsElement(childNode);
									break;
								case "packages":
									processPackagesElement(childNode, baseUrl, version);
									break;
								case "configuration":
									processConfigurationElement(childNode, baseUrl, version, locales);
									break;
								case "include":
									processIncludedConfiguration(childNode, baseUrl, version, locales);
									break;
									
							}
						}
						childNode = <Element>childNode.nextSibling;
					}
				};

				var processIncludedConfiguration = (node: Element, baseUrl: string, appVersion: string, locales: {[locale: string]: boolean;}) =>
				{
					var childNode: Element = <Element>node.firstChild;
					while (childNode)
					{
						if (childNode.nodeType == 1 && !childNode.namespaceURI)
						{
							switch (Xml.getLocalName(childNode))
							{
								case "configuration":
									processConfigurationElement(childNode, baseUrl, appVersion, locales);
									break;
								case "include":
									processIncludedConfiguration(childNode, baseUrl, appVersion, locales);
									break;
							}
						}
						childNode = <Element>childNode.nextSibling;
					}
				};

				var getVersionSetting = (settings: Node) =>
				{
					var childNode: Element = <Element>settings.firstChild;
					while (childNode)
					{
						if (childNode.nodeType == 1 &&
							Xml.getLocalName(childNode) == "setting" && childNode.getAttribute("name") == "version" &&
							!childNode.namespaceURI)
						{
							return childNode.getAttribute("value");
						}
						childNode = <Element>childNode.nextSibling;
					}
				};

				var getSupportedLocales = (settings: Node) =>
				{
					var childNode: Element = <Element>settings.firstChild;
					var locales: {[locale: string]: boolean;} = {};
					while (childNode)
					{
						if (childNode.nodeType == 1 && !childNode.namespaceURI && Xml.getLocalName(childNode) == "locale")
						{
							locales[Xml.getInnerText(childNode).trim().toLowerCase()] = true;
						}
						childNode = <Element>childNode.nextSibling;
					}
					return locales;
				};

				var processResourceGroupsElement = (resourceGroups: Element, baseUrl: string, appVersion: string, locales: {[locale: string]: boolean;}) =>
				{
					var resourceGroup: Element = <Element>resourceGroups.firstChild;
					while (resourceGroup)
					{
						if (resourceGroup.nodeType == 1 && Xml.getLocalName(resourceGroup) == "resourceGroup" && !resourceGroup.namespaceURI)
						{
							processResourceGroupElement(resourceGroup, baseUrl, appVersion, locales);
						}
						resourceGroup = <Element>resourceGroup.nextSibling;
					}
				};

				var processResourceGroupElement = (resourceGroupElement: Element, baseUrl: string, appVersion: string, locales: {[locale: string]: boolean;}) =>
				{
					var name: string = resourceGroupElement.getAttribute("name");
					var resourceGroup: IResourceGroupOptions = { name: name, files: [],
																dependencies: dependencies[name] || (dependencies[name] = []),
																extensions: extensions[name] || (extensions[name] = []) };
					var childNode: Element = <Element>resourceGroupElement.firstChild;
					while (childNode)
					{
						if (childNode.nodeType == 1 && !childNode.namespaceURI)
						{
							switch (Xml.getLocalName(childNode))
							{
								case "files":
									processResourceGroupFilesElement(childNode, resourceGroup, baseUrl, appVersion, locales);
									break;
								case "dependencies":
									processResourceGroupDependenciesElement(childNode, resourceGroup);
									break;
							}
						}
						childNode = <Element>childNode.nextSibling;
					}
					this.newResourceGroup(resourceGroup);
				};

				var processResourceGroupFilesElement = (resourceGroupFilesElement: Element,
														resourceGroup: IResourceGroupOptions,
														baseUrl: string,
														appVersion: string,
														locales: {[locale: string]: boolean;}) =>
				{
					var fileElement: Element = <Element>resourceGroupFilesElement.firstChild;
					while (fileElement)
					{
						if (fileElement.nodeType == 1 && Xml.getLocalName(fileElement) == "file" && !fileElement.namespaceURI)
						{
							var modification = fileElement.getAttribute("modification");
							var url = fileElement.getAttribute("name");
							var file = {
								url: url.indexOf("~/") == 0 ? url : Types.Url.combinePath(baseUrl, url),
								version: (appVersion && modification) ? (appVersion + "." + modification) : (appVersion || modification),
								locales: locales
							};
							resourceGroup.files.push(file);
						}
						fileElement = <Element>fileElement.nextSibling;
					}
				};

				var processResourceGroupDependenciesElement = (resourceGroupDependenciesElement: Element,
																resourceGroup: IResourceGroupOptions) =>
				{
					var dependencyElement: Element = <Element>resourceGroupDependenciesElement.firstChild;
					while (dependencyElement)
					{
						if (dependencyElement.nodeType == 1 && Xml.getLocalName(dependencyElement) == "dependency" && !dependencyElement.namespaceURI)
						{
							resourceGroup.dependencies.push(dependencyElement.getAttribute("name"));
						}
						dependencyElement = <Element>dependencyElement.nextSibling;
					}
				}

				var processExtensionsElement = (extensions: Element) =>
				{
					var resourceExtension: Element = <Element>extensions.firstChild;
					while (resourceExtension)
					{
						if (resourceExtension.nodeType == 1 && Xml.getLocalName(resourceExtension) == "resourceExtension" && !resourceExtension.namespaceURI)
						{
							processResourceExtensionElement(resourceExtension);
						}
						resourceExtension = <Element>resourceExtension.nextSibling;
					}
				};

				var processResourceExtensionElement = (resourceExtension: Element) =>
				{
					var forResource = resourceExtension.getAttribute("for");
					var extension: Element = <Element>resourceExtension.firstChild;
					while (extension)
					{
						if (extension.nodeType == 1 && !extension.namespaceURI)
						{
							switch (Xml.getLocalName(extension))
							{
								case "insert":
									var extensionName = extension.getAttribute("name");
									switch (extension.getAttribute("position"))
									{
										case "before":
											if (!dependencies[forResource])
											{
												dependencies[forResource] = [extensionName];
											}
											else
											{
												dependencies[forResource].push(extensionName);
											}
											break;
										//case "after":
										//case null:
										default:
											if (!extensions[forResource])
											{
												extensions[forResource] = [extensionName];
											}
											else
											{
												extensions[forResource].push(extensionName);
											}
											break;
									}
									break;
							}
						}
						extension = <Element>extension.nextSibling;
					}
				};

				var processPackagesElement = (packages: Element, baseUrl: string, appVersion: string) =>
				{
					var packageElement: Element = <Element>packages.firstChild;
					while (packageElement)
					{
						if (packageElement.nodeType == 1 && Xml.getLocalName(packageElement) == "package" && !packageElement.namespaceURI)
						{
							processPackageElement(packageElement, baseUrl,appVersion);
						}
						packageElement = <Element>packageElement.nextSibling;
					}
				};

				var processPackageElement = (packageElement: Element, baseUrl: string, appVersion: string) =>
				{
					var url = packageElement.getAttribute("src");
					var modification = packageElement.getAttribute("modification");

					var resourcesPackage: IPackageResourceDefinition = {
						name: packageElement.getAttribute("name"),
						url: url.indexOf("~/") == 0 ? url : Types.Url.combinePath(baseUrl, url),
						version: (appVersion && modification) ? (appVersion + "." + modification) : (appVersion || modification),
						resourceGroups: []};

					var packageResourceGroupsElement: Element = <Element>packageElement.firstChild;
					while (packageResourceGroupsElement)
					{
						if (packageResourceGroupsElement.nodeType == 1 && Xml.getLocalName(packageResourceGroupsElement) == "resourceGroups" && !packageResourceGroupsElement.namespaceURI)
						{
							processPackageResourceGroupsElement(packageResourceGroupsElement, resourcesPackage);
						}
						packageResourceGroupsElement = <Element>packageResourceGroupsElement.nextSibling;
					}
					packageResourcesToRegister.push(resourcesPackage);
				}

				var processPackageResourceGroupsElement = (resourceGroupsElement: Element, resourcesPackage: IPackageResourceDefinition) =>
				{
					var packageResourceGroup: Element = <Element>resourceGroupsElement.firstChild;
					while (packageResourceGroup)
					{
						if (packageResourceGroup.nodeType == 1 && Xml.getLocalName(packageResourceGroup) == "resourceGroup" && !packageResourceGroup.namespaceURI)
						{
							resourcesPackage.resourceGroups.push({name: packageResourceGroup.getAttribute("name"), files: []});
						}
						packageResourceGroup = <Element>packageResourceGroup.nextSibling;
					}
				}

				processConfigurationElement(config, "", "", null);

				// process and register collected packages
				for (var i = 0, len = packageResourcesToRegister.length; i < len; i++)
				{
					var packageResource = packageResourcesToRegister[i];
					var resourceGroups = packageResource.resourceGroups;
					for (var j = 0, lenj = resourceGroups.length; j < lenj; j++)
					{
						var resourceGroup = resourceGroups[j];
						var resources = this.registeredResources[resourceGroup.name];
						if (resources)
						{
							for (var k = 0, lenk = resources.files.length; k < lenk; k++)
							{
								var fileDefinition = resources.files[k];
								var url = fileDefinition.url;
								if (url.indexOf("{CULTURE}") == -1)	// culture files are not included in packages
								{
									resourceGroup.files.push(fileDefinition);
								}
								else
								{
									if (!resourceGroup.cultureFiles)
									{
										resourceGroup.cultureFiles = [];
									}
									resourceGroup.cultureFiles.push(fileDefinition);
								}
							}
						}
						else
						{
							throw Error("Unknown resource group name '" + resourceGroup.name + "' encountered in package '" + packageResource.name + "'.");
						}
					}

					FileResourceHandler.registerPackage(packageResource);
				}
			}

		storeFileData(url: string, data: string, isShared?: boolean): void
		{
			FileResourceHandler.storeFileData(url, data, isShared);
		}

		registerPackageRendered(packageName: string, url?: string, data?: string): void
		{
			FileResourceHandler.registerPackageRendered(packageName, url, data);
		}

		private _resolve(resourceGroupName: string, resources?: string[], callstack?: string[]): string[]
			{
				if (!resources)
				{
					resources = [];
				}

				if (!callstack)
				{
					callstack = [];
				}

				if (resources.indexOf(resourceGroupName) == -1)
				{
					var resourceSettings = this.registeredResources[resourceGroupName];
					if (!resourceSettings)
					{
						throw Error("Resource group with name '" + resourceGroupName + "' does not exist");
					}

					if (callstack.indexOf(resourceGroupName) != -1)
					{
						throw Error("Circular dependency detected: '" + callstack.join(" -> ") + " -> " + resourceGroupName);
					}

					if (resourceSettings.dependencies && resourceSettings.dependencies.length)
					{
						callstack = callstack.concat(resourceGroupName);
						SDL.jQuery.each(
								(this.mode & ResourceManagerMode.REVERSE)
									? resourceSettings.dependencies.reverse()
									: resourceSettings.dependencies,
								(index: number, value: string) => this._resolve(value, resources, callstack));
					}

					if (resources.indexOf(resourceGroupName) == -1)
					{
						resources.push(resourceGroupName);

						if (resourceSettings.extensions && resourceSettings.extensions.length)
						{
							SDL.jQuery.each(
								(this.mode & ResourceManagerMode.REVERSE)
									? resourceSettings.extensions.reverse()
									: resourceSettings.extensions,
								(index: number, value: string) => this._resolve(value, resources));
						}
					}
				}
				
				return resources;
			}

		private _render(resourceGroupName: string, callback: () => void, errorcallback?: (error: string) => void, callstack?: string[]): void
			{
				var resourceSettings = this.registeredResources[resourceGroupName];
				if (!resourceSettings)
				{
					var error = "Resource group with name '" + resourceGroupName + "' does not exist";
					if (errorcallback)
					{
						errorcallback(error);
						return;
					}
					else
					{
						throw Error(error);
					}
				}
				else if (resourceSettings.rendered)
				{
					if (callback)
					{
						callback();
					}
				}
				else
				{
					if (resourceSettings.loading)
					{
						if (callstack)
						{
							var index = SDL.jQuery.inArray(resourceGroupName, callstack);
							if (index != -1)	// the resource group is already in the callstack -> circular reference
							{
								index++;
								for (var len = callstack.length; index < len; index++)
								{
									if (this.registeredResources[callstack[index]].rendered)	// one of dependent groups is loaded
									// -> 'self' must be (part of) an extension of the dependent group -> return for now, will load 'self' when dependency returns
									{
										if (callback)
										{
											callback();
										}
										return;
									}
								}

								var error = "Circular dependency detected: " + callstack.join(" -> ") + " -> " + resourceGroupName;
								if (errorcallback)
								{
									errorcallback(error);
								}
								else
								{
									throw Error(error);
								}
								return;
							}
						}

						// loading -> wait for an event
						if (callback) this.callbacks[resourceGroupName].add(callback);
					}
					else
					{
						var extensions = resourceSettings.extensions;
						if (extensions)
						{
							var extensionsCount = extensions.length;
							if (extensionsCount)
							{
								var _callback = callback;
								callback = () =>
									{
										var extensionInCallstack = -1;

										var onExtensionLoaded: () => void;

										if (_callback)
										{
											if (callstack)
											{
												for (var i = 0; i < extensionsCount; i++)
												{
													if (SDL.jQuery.inArray(extensions[i], callstack) != -1)
													{
														extensionInCallstack = i;
														break;
													}
												}
											}

											if (extensionInCallstack != -1)
											{
												// an extension in the callstack is waiting for a callback from the current group -> execute callback to prevent deadlocks
												// (could be smarter and call the callback only if other extensions are dependent on the extension in the callstack)
												_callback();
												errorcallback = null;
											}
											else
											{
												var renderedExtensions = 0;
												onExtensionLoaded = () =>
													{
														if (++renderedExtensions == extensionsCount)
														{
															_callback();
														}
													}
											}
										}

										var ownCallstack = callstack
											? callstack.concat([resourceGroupName])	// creating a copy to keep the parent's callstack intact
											: [resourceGroupName];

										for (var i = 0; i < extensionsCount; i++)
										{
											if (extensionInCallstack != i)	// no need to load a resource, which we know is already in the callstack (just optimization)
											{
												this._render(extensions[i], onExtensionLoaded, errorcallback, ownCallstack);
											}
										}
									};
							}
						}

						resourceSettings.loading = true;

						this.callbacks[resourceGroupName] = SDL.jQuery.Callbacks("once");

						var renderCallbackHandler = () =>
							{
								resourceSettings.rendered = true;
								resourceSettings.loading = false;
								if (callback) callback();
								this.callbacks[resourceGroupName].fire();
								this.callbacks[resourceGroupName].empty();
								delete this.callbacks[resourceGroupName];
							};

						var dependenciesCount = resourceSettings.dependencies ? resourceSettings.dependencies.length : 0;
						var filesCount = resourceSettings.files ? resourceSettings.files.length : 0;

						if (dependenciesCount || filesCount)
						{
							var renderedDependenciesCount = 0;
							var nextFileToLoad = 0;

							var renderNextFile = () =>
								{
									if (nextFileToLoad < filesCount)
									{
										var file = resourceSettings.files[nextFileToLoad];
										nextFileToLoad++;
										FileResourceHandler.renderWhenLoaded(file, renderNextFile,
																		errorcallback ? (file: IFileResource) => errorcallback(file && file.error) : null,
																		(this.mode & ResourceManagerMode.SYNCHRONOUS) != 0);
									}
									else
									{
										renderCallbackHandler();
									}
								};

							var dependencyCallbackHandler = () =>
							{
								if (++renderedDependenciesCount == dependenciesCount)
								{
									renderNextFile();
								}
							}

							if (filesCount)
							{
								// Start loading this resource group's files
								SDL.jQuery.each(
									resourceSettings.files,
									(index: number, value: IFileResourceDefinition) => FileResourceHandler.loadIfNotRendered(value, null,
																		errorcallback ? (file: IFileResource) => errorcallback(file && file.error) : null,
																		(this.mode & ResourceManagerMode.SYNCHRONOUS) != 0));
							}

							if (dependenciesCount)
							{
								// add the resource group to the dependency callstack to be able to detect circular references
								var ownCallstack = callstack
									? callstack.concat([resourceGroupName])	// creating a copy to keep the parent's callstack intact
									: [resourceGroupName];

								SDL.jQuery.each(
										(this.mode & ResourceManagerMode.REVERSE)
											? resourceSettings.dependencies.reverse()
											: resourceSettings.dependencies,
										(index: number, value: string) => this._render(value, dependencyCallbackHandler, errorcallback, ownCallstack));
							}
							else
							{
								renderNextFile();
							}
						}
						else
						{
							renderCallbackHandler();
						}
					}
				}
			}
	}

	export var ResourceManager: IResourceManager = new ResourceManagerClass();
}