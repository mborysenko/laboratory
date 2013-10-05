/// <reference path="FileResourceHandler.ts" />
/// <reference path="..\ConfigurationManager\ConfigurationManager.ts" />
/// <reference path="..\Xml\Xml.d.ts" />

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
		loaded?: boolean;
		loading?: boolean;
	}

	export interface IResolvedResourceGroupResult
	{
		name: string;
		files: string[];
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
		registerPackageRendered(packageName: string): void;
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
				return SDL.jQuery.map(this._resolve(resourceGroupName), (name) =>
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
				var config = Configuration.ConfigurationManager.configuration;

				FileResourceHandler.corePath = Configuration.ConfigurationManager.corePath;
				FileResourceHandler.enablePackaging = Configuration.ConfigurationManager.getAppSetting("debug") != "true";

				SDL.jQuery.each(Xml.selectNodes(config, "//resourceGroups[parent::configuration and resourceGroup]"), (index, resourceGroupsElement: Element) =>
				{
					var appVersionNodes =  Xml.selectNodes(resourceGroupsElement, "ancestor::configuration/appSettings/setting[@name='version']/@value");
					var appVersion = appVersionNodes.length ? appVersionNodes[appVersionNodes.length - 1].nodeValue : "";

					var baseUrlNodes =  Xml.selectNodes(resourceGroupsElement, "ancestor::configuration/@baseUrl");
					var baseUrl = baseUrlNodes.length ? baseUrlNodes[baseUrlNodes.length - 1].nodeValue : "";

					SDL.jQuery.each(Xml.selectNodes(resourceGroupsElement, "resourceGroup"), (index, resourceGroupElement: Element) =>
					{
						var name = resourceGroupElement.getAttribute("name");
						var resourceGroup: IResourceGroupOptions = { name: name, files: [], dependencies: [], extensions: [] };
					
						SDL.jQuery.each(Xml.selectNodes(resourceGroupElement, "files/file[@name]"), (index, fileElement: Element) =>
						{
							var modification = fileElement.getAttribute("modification");
							var url = fileElement.getAttribute("name");
							var file = {
								url: url.indexOf("~/") == 0 ? url : Types.Url.combinePath(baseUrl, url),
								version: (appVersion && modification) ? (appVersion + "." + modification) : (appVersion || modification)
							};
							resourceGroup.files.push(file);
						});

						SDL.jQuery.each(Xml.selectNodes(resourceGroupElement, "dependencies/dependency/@name"), (index, dependency) =>
						{
							resourceGroup.dependencies.push((<Attr>dependency).value);
						});

						SDL.jQuery.each(Xml.selectNodes(config,
								"//configuration/extensions/resourceExtension[@for = \"" + name + "\"]/insert[@position = 'before']/@name"),
							(index, dependency) =>
						{
							resourceGroup.dependencies.push((<Attr>dependency).value);
						});

						SDL.jQuery.each(Xml.selectNodes(config,
								"//configuration/extensions/resourceExtension[@for = \"" + name + "\"]/insert[not(@position) or @position = 'after']/@name"),
							(index, extension) =>
						{
							resourceGroup.extensions.push((<Attr>extension).value);
						});

						this.newResourceGroup(resourceGroup);
					});
				});

				SDL.jQuery.each(Xml.selectNodes(config, "//packages[parent::configuration and package]"), (index, packagesNode: Element) =>
				{
					var appVersionNodes =  Xml.selectNodes(packagesNode, "ancestor::configuration/appSettings/setting[@name='version']/@value");
					var appVersion = appVersionNodes.length ? appVersionNodes[appVersionNodes.length - 1].nodeValue : "";

					var baseUrlNodes =  Xml.selectNodes(packagesNode, "ancestor::configuration/@baseUrl");
					var baseUrl = baseUrlNodes.length ? baseUrlNodes[baseUrlNodes.length - 1].nodeValue : "";

					SDL.jQuery.each(Xml.selectNodes(packagesNode, "package"), (index, packageElement: Element) =>
					{
						var url = packageElement.getAttribute("src");
						var modification = packageElement.getAttribute("modification");

						var resourcesPackage:IPackageResourceDefinition = {
							name: packageElement.getAttribute("name"),
							url: url.indexOf("~/") == 0 ? url : Types.Url.combinePath(baseUrl, url),
							version: (appVersion && modification) ? (appVersion + "." + modification) : (appVersion || modification),
							files: []};

						SDL.jQuery.each(Xml.selectNodes(packageElement, ".//resourceGroups/resourceGroup"), (index, groupElement: Element) =>
						{
							SDL.jQuery.each(this.registeredResources[groupElement.getAttribute("name")].files, (index, file) => 
								{
									if (file.url.indexOf("{CULTURE}") == -1)	// culture files are not included in packages
									{
										resourcesPackage.files.push(file.url);
									}
								});
						});
						FileResourceHandler.registerPackage(resourcesPackage);
					});
				});
			}

		registerPackageRendered(packageName: string): void
		{
			FileResourceHandler.registerPackageRendered(packageName);
		}

		private _resolve(resourceGroupName: string, resources?: string[]): string[]
			{
				if (!resources)
				{
					resources = [];
				}

				var resourceSettings = this.registeredResources[resourceGroupName];
				if (!resourceSettings)
				{
					throw Error("Resource group with name '" + resourceGroupName + "' does not exist");
				}

				if (resourceSettings.dependencies && resourceSettings.dependencies.length)
				{
					SDL.jQuery.each(
							(this.mode & ResourceManagerMode.REVERSE)
								? resourceSettings.dependencies.reverse()
								: resourceSettings.dependencies,
							(index, value) => this._resolve(value, resources));
				}

				if (resources.indexOf(resourceGroupName) == -1)
				{
					resources.push(resourceGroupName);
				}

				if (resourceSettings.extensions && resourceSettings.extensions.length)
				{
					SDL.jQuery.each(
						(this.mode & ResourceManagerMode.REVERSE)
							? resourceSettings.extensions.reverse()
							: resourceSettings.extensions,
						(index, value) => this._resolve(value, resources));
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

				var extensions = resourceSettings.extensions;
				if (extensions)
				{
					var extensionsCount = extensions.length;
					if (extensionsCount && (!callstack || SDL.jQuery.inArray(resourceGroupName, callstack) == -1))
					{
						// make sure the extensions get loaded too unless the current group is already in the callstack
						// if it is, the extensions will be loaded by the earlier call in the callstack

						var _callback = callback;
						callback = () =>
							{
								var extensionInCallstack = -1;

								var onExtensionLoaded;

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

				if (resourceSettings.loaded)
				{
					if (callback)
					{
						callback();
					}
				}
				else if (resourceSettings.loading)
				{
					if (callstack)
					{
						var index = SDL.jQuery.inArray(resourceGroupName, callstack);
						if (index != -1)	// the resource group is already in the callstack -> circular reference
						{
							index++;
							for (var len = callstack.length; index < len; index++)
							{
								if (this.registeredResources[callstack[index]].loaded)	// one of dependent groups is loaded
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
					resourceSettings.loading = true;

					this.callbacks[resourceGroupName] = SDL.jQuery.Callbacks("once");

					var renderCallbackHandler = () =>
						{
							resourceSettings.loaded = true;
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
								(index, value) => FileResourceHandler.loadIfNotRendered(value, null,
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
									(index, value) => this._render(value, dependencyCallbackHandler, errorcallback, ownCallstack));
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

	export var ResourceManager: IResourceManager = new ResourceManagerClass();
}