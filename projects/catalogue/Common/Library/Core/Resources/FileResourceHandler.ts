/// <reference path="Resources.d.ts" />
/// <reference path="../Libraries/jQuery/SDL.jQuery.ts" />
/// <reference path="../Localization/Localization.ts" />
/// <reference path="../Application/Application.ts" />
/// <reference path="../Net/Ajax.d.ts" />
/// <reference path="../Types/Array.d.ts" />
/// <reference path="../ConfigurationManager/ConfigurationManager.ts" />
/// <reference path="ResourceLoader.ts" />

module SDL.Client.Resources
{
	export interface IResourceGroupDefinition
	{
		name: string;
		files: string[];
	}

	export interface IPackageResourceDefinition extends IFileResourceDefinition
	{
		name: string;
		resourceGroups?: IResourceGroupDefinition[];
		unpacked?: boolean;
		rendered?: boolean;
	}

	export interface IFileResource extends IFileResourceDefinition
	{
		parentPackages?: IPackageResourceDefinition[];
		context?: Object;
		loading?: boolean;
		loaded?: boolean;
		rendering?: boolean;
		rendered?: boolean;
		type?: string;
		data?: string;
		isShared?: boolean;
		template?: string;
		error?: string;
	}

	export class FileResourceHandler
	{
		// Collection of all registered resource loaders
		public static registeredResourceHandlers: FileResourceHandler[] = [];

		// Index of all loaded templates
		public static templates: {[index: string]: IFileResource;} = {};

		// Rootpath for files to include
		static corePath: string;

		static enablePackaging: boolean;

		// Collection of all loaded resource files
		/*private*/ static fileResources: {[index: string]: IFileResource;} = {};	// commenting 'private' otherwise TypeScript definition file is missing type definition (ts 1.0rc)

		// Collection of all packages
		/*private*/ static packages: {[index: string]: IPackageResourceDefinition;} = {};	// commenting 'private' otherwise TypeScript definition file is missing type definition (ts 1.0rc)

		// Index of all culture specific resources
		/*private*/ static cultureResources: {[index: string]: IFileResource;} = {};	// commenting 'private' otherwise TypeScript definition file is missing type definition (ts 1.0rc)

		/*private*/ static callbacks: { [index: string]: JQueryCallback; } = {};	// commenting 'private' otherwise TypeScript definition file is missing type definition (ts 1.0rc)
		/*private*/ static errorcallbacks: { [index: string]: JQueryCallback; } = {};	// commenting 'private' otherwise TypeScript definition file is missing type definition (ts 1.0rc)

		_supports(url: string): boolean { return false; }
		_render(file: IFileResource): void {}
		public supports(url: string): boolean
			{
				var m = url.match(/\.([^\.\/\?\#]+)(\?|\#|$)/);
				var ext = m ? m[1].toLowerCase() : "";
				return this._supports(ext);
			}

		public render(url: string): void
			{
				var file = FileResourceHandler.fileResources[url.toLowerCase()];

				if (!file || (!file.rendering && !file.rendered))
				{
					if (!file || !file.loaded)
					{
						throw Error("Cannot render file '" + url + "': file not loaded.");
					}
					else //if (!file.rendering && !file.rendered)
					{
						file.rendering = true;
						if (file.data)
						{
							this._render(file);
						}
						file.rendered = true;
						delete file.rendering;
						if (!Configuration.ConfigurationManager.isApplicationHost ||	// ApplicationHost needs the data stored, for hosted applications
							file.url.indexOf("~/") != 0)
						{
							delete file.data;
						}
					}
				}
			}

		static loadIfNotRendered(file: IFileResourceDefinition, callback?: (file: IFileResource) => void, errorcallback?: (file: IFileResource) => void, sync?: boolean): void
		{
			if (file && file.url)
			{
				var key = file.url.toLowerCase();
				var fileResource = FileResourceHandler.fileResources[key];
				if (fileResource && fileResource.rendered)
				{
					if (callback)
					{
						callback(fileResource);
					}
					return;
				}
			}
			FileResourceHandler.load(file, callback, errorcallback, sync);
		}

		static load(file: IFileResourceDefinition, callback?: (file: IFileResource) => void, errorcallback?: (file: IFileResource) => void, sync?: boolean): void
			{
				if (file && file.url)
				{
					var key = file.url.toLowerCase();
					var fileResource = FileResourceHandler.fileResources[key];
					
					if (!fileResource)
					{
						fileResource = FileResourceHandler.fileResources[key] = <IFileResourceDefinition>SDL.jQuery.extend({}, file);
						if (Resources.preloadPackages)
						{
							var pckg = Resources.preloadPackages[key];
							if (pckg)
							{
								if (pckg.error)
								{
									fileResource.error = pckg.error;
									delete Resources.preloadPackages[key];
								}
								else
								{
									fileResource.loading = true;
									FileResourceHandler.callbacks[key] = SDL.jQuery.Callbacks("once");
									FileResourceHandler.errorcallbacks[key] = SDL.jQuery.Callbacks("once");
								}
							}
						}
					}

					if (fileResource.error)	// File already fully loaded - just call the single callback
					{
						if (errorcallback) errorcallback(fileResource);
					}
					else if (fileResource.loaded)	// File already fully loaded - just call the single callback
					{
						if (callback) callback(fileResource);
					}
					else if (fileResource.loading)	// File loading started but not finished YET
					{
						if (callback)
						{
							// Handle same file being requested multiple times - add another callback to the list 
							FileResourceHandler.callbacks[key].add(function()
								{
									callback(fileResource);
								});
						}
						if (errorcallback)
						{
							// Handle same file being requested multiple times - add another callback to the list 
							FileResourceHandler.errorcallbacks[key].add(function()
								{
									errorcallback(fileResource);
								});
						}
						else
						{
							FileResourceHandler.errorcallbacks[key].add(function(error: string)
								{
									throw Error(error);
								});
						}
					}
					else	// not loaded, not loading -> load
					{
						fileResource.loading = true;
						FileResourceHandler.callbacks[key] = SDL.jQuery.Callbacks("once");
						FileResourceHandler.errorcallbacks[key] = SDL.jQuery.Callbacks("once");

						if (file.url.indexOf("{CULTURE}") != -1)
						{
							FileResourceHandler.cultureResources[key] = fileResource;

							var culture = Localization.getCulture();
							var filesToLoadCount = 1;
							var _loadFileCallback = (cultureFile?: IFileResource) =>
							{
								if (cultureFile && !cultureFile.loaded && cultureFile.error)
								{
									cultureFile.loaded = true;		// ignore loading errors for culture files
									cultureFile.rendered = true;	// ignore loading errors for culture files
									if (window.console) window.console.log(cultureFile.error);
								}

								if (!--filesToLoadCount)
								{
									delete fileResource.loading;

									if (culture == Localization.getCulture())
									{
										fileResource.loaded = true;
										var errorcallbacks = FileResourceHandler.errorcallbacks[key];
										if (errorcallbacks)
										{
											errorcallbacks.empty();
											delete FileResourceHandler.errorcallbacks[key];
										}

										// This call will execute callback of the first component that requested this file
										if (callback) callback(fileResource);
										// The call will execute all other components callbacks that requested same file after it started loading
										var callbacks = FileResourceHandler.callbacks[key];
										if (callbacks)
										{
											callbacks.fire();
											callbacks.empty();
											delete FileResourceHandler.callbacks[key];
										}
									}
									else
									{
										// call load() on the same file resource again, now that culture has changed, to load the required culture files
										FileResourceHandler.load(file, callback, errorcallback, sync);
									}
								}
							};

							if (culture && culture != "en")
							{
								var dashIndex = culture.indexOf("-");
								if (dashIndex > 0)
								{
									var lang = culture.slice(0, dashIndex);
									if (lang != "en")
									{
										// load the neutral culture file
										filesToLoadCount++;
										FileResourceHandler.load(<IFileResource>SDL.jQuery.extend({}, file, {url: file.url.replace(/\{CULTURE\}/g, lang), context: SDL}),
											_loadFileCallback, _loadFileCallback, sync);
									}
								}
								// load the culture file
								FileResourceHandler.load(<IFileResource>SDL.jQuery.extend({}, file, {url: file.url.replace(/\{CULTURE\}/g, culture), context: SDL}),
									_loadFileCallback, _loadFileCallback, sync);
							}
							else
							{
								_loadFileCallback();	// no culture to load
							}
						}
						else if (FileResourceHandler.enablePackaging && fileResource.parentPackages)
						{
							if (callback)
							{
								FileResourceHandler.callbacks[key].add(function()
									{
										callback(fileResource);
									});
							}
							if (errorcallback)
							{
								FileResourceHandler.errorcallbacks[key].add(function(packageResource: IFileResource)
									{
										fileResource.error = packageResource.error;
										errorcallback(fileResource);
									});
							}

							FileResourceHandler.loadPackage(FileResourceHandler.getPreferedPackage(fileResource.parentPackages), null, null, sync);
						}
						else
						{
							ResourceLoader.load({ url: fileResource.url, version: fileResource.version }, FileResourceHandler.corePath, sync,
								(data: string, isShared: boolean) =>
									{
										fileResource.data = data;
										fileResource.isShared = isShared;
										fileResource.loaded = true;
										delete fileResource.loading;

										var errorcallbacks = FileResourceHandler.errorcallbacks[key];
										if (errorcallbacks)
										{
											errorcallbacks.empty();
											delete FileResourceHandler.errorcallbacks[key];
										}

										// This call will execute callback of the first component that requested this file
										if (callback) callback(fileResource);
										// The call will execute all other components callbacks that requested same file after it started loading
										var callbacks = FileResourceHandler.callbacks[key];
										if (callbacks)
										{
											callbacks.fire();
											callbacks.empty();
											delete FileResourceHandler.callbacks[key];
										}
									},
								(error: string) =>
									{
										fileResource.error = file.url + ": " + error;
										if (errorcallback)
										{
											var callbacks = FileResourceHandler.callbacks[key];
											if (callbacks)
											{
												callbacks.empty();
												delete FileResourceHandler.callbacks[key];
											}

											// This call will execute errorcallback of the first component that requested this file
											errorcallback(fileResource);

											// The call will execute errorcallbacks for all other components that requested same file after it started loading
											var errorcallbacks = FileResourceHandler.errorcallbacks[key];
											if (errorcallbacks)
											{
												errorcallbacks.fire();
												errorcallbacks.empty();
												delete FileResourceHandler.errorcallbacks[key];
											}
										}
										else
										{
											throw Error(file.url + ": " + error);
										}
									}
							);
						}
					}
				}
				else if (callback) callback(null);
			}
		static renderWhenLoaded(file: IFileResourceDefinition, callback?: (file: IFileResource) => void, errorcallback?: (file: IFileResource) => void, sync?: boolean): void
			{
				if (file)
				{
					var key = file.url.toLowerCase();
					var fileResource = FileResourceHandler.fileResources[key];

					if (fileResource && fileResource.rendered)
					{
						if (callback)
						{
							callback(fileResource);
						}
					}
					else if (!fileResource || !fileResource.loaded)
					{
						FileResourceHandler.load(file, (file: IFileResource) => FileResourceHandler.renderWhenLoaded(file, callback, errorcallback), errorcallback, sync);
					}
					else	// loaded, not rendered -> render
					{
						if (file.url.indexOf("{CULTURE}") != -1)
						{
							var culture = Localization.getCulture();
							var filesToRenderCount = 1;
							var _renderFileCallback = (cultureFile?: IFileResource) =>
							{
								if (cultureFile && !cultureFile.rendered && cultureFile.error)
								{
									cultureFile.loaded = true;
									cultureFile.rendered = true;
								}

								if (!--filesToRenderCount)
								{
									if (culture == Localization.getCulture())
									{
										fileResource.rendered = true;
										if (callback)
										{
											callback(fileResource);
										}
									}
									else
									{
										FileResourceHandler.renderWhenLoaded(file, callback, errorcallback, sync);
									}
								}
							};
							if (culture && culture != "en")
							{
								var dashIndex = culture.indexOf("-");
								if (dashIndex > 0)
								{
									var lang = culture.slice(0, dashIndex);
									if (lang != "en")
									{
										// render the neutral culture file
										filesToRenderCount++;
										FileResourceHandler.renderWhenLoaded(<IFileResource>SDL.jQuery.extend({}, file, {url: file.url.replace(/\{CULTURE\}/g, lang), context: SDL}),
											_renderFileCallback, _renderFileCallback, sync);
									}
								}
								FileResourceHandler.renderWhenLoaded(<IFileResource>SDL.jQuery.extend({}, file, {url: file.url.replace(/\{CULTURE\}/g, culture), context: SDL}),
									_renderFileCallback, _renderFileCallback, sync);
							}
							else
							{
								_renderFileCallback();	// nothing to render
							}
						}
						else
						{
							// Loop through all registered resource handlers until one can handle this type
							for (var i = 0; i < FileResourceHandler.registeredResourceHandlers.length; i++)
							{
								var handler = FileResourceHandler.registeredResourceHandlers[i];
								if (handler.supports(file.url))
								{
									if (errorcallback)
									{
										try
										{
											handler.render(file.url);
										}
										catch (err)
										{
											fileResource.error = "Error executing '" + fileResource.url + "': " + err.message;
											errorcallback(fileResource);
											return;
										}
									}
									else
									{
										handler.render(file.url);
									}

									if (callback)
									{
										callback(fileResource);
										return;
									}
								}
							}

							throw Error("There is no handler registered for file '" + file.url + "'.");
						}
					}
				}
				else if (callback)
				{
					callback(null);
				}
			}

		static getTemplateResource(templateId: string): IFileResource
			{
				return FileResourceHandler.templates[templateId];
			}

		static registerPackage(resourcesPackage: IPackageResourceDefinition)
			{
				if (resourcesPackage)
				{
					var registeredPackage = FileResourceHandler.packages[resourcesPackage.name];
					if (resourcesPackage.resourceGroups)
					{
						var packageSetToRender = registeredPackage && registeredPackage.rendered && !registeredPackage.resourceGroups;
						if (!registeredPackage || packageSetToRender)
						{
							FileResourceHandler.packages[resourcesPackage.name] = resourcesPackage;

							var resourceFiles = FileResourceHandler.fileResources;

							SDL.jQuery.each(resourcesPackage.resourceGroups, (index: number, resourceGroup: IResourceGroupDefinition) =>
								SDL.jQuery.each(resourceGroup.files, (index: number, url: string) =>
									{
										var key = url.toLowerCase();
										var file = resourceFiles[key] || (resourceFiles[key] = <IFileResource>{url: url});
										if (!file.parentPackages)
										{
											file.parentPackages = [resourcesPackage];
										}
										else
										{
											file.parentPackages.push(resourcesPackage);
										}
									}));

							if (packageSetToRender)
							{
								FileResourceHandler.setRenderedPackage(resourcesPackage);
							}
						}
					}
					else if (!registeredPackage)
					{
						FileResourceHandler.packages[resourcesPackage.name] = resourcesPackage;
					}
				}
			}

		static storeFileData(url: string, data: string, isShared?: boolean): IFileResource
		{
			var key = url.toLowerCase();
			var fileResource: IFileResource = FileResourceHandler.fileResources[key];
			if (!fileResource)
			{
				fileResource = FileResourceHandler.fileResources[key] = { url: url };
			}

			if (!fileResource.loaded || !fileResource.data)
			{
				fileResource.isShared = isShared;
				fileResource.data = data;
				fileResource.loaded = true;
				delete fileResource.loading;

				var errorcallbacks = FileResourceHandler.errorcallbacks[key];
				if (errorcallbacks)
				{
					errorcallbacks.empty();
					delete FileResourceHandler.errorcallbacks[key];
				}

				var callbacks = FileResourceHandler.callbacks[key];
				if (callbacks)
				{
					callbacks.fire();
					callbacks.empty();
					delete FileResourceHandler.callbacks[key];
				}
			}
			return fileResource;
		}

		static registerPackageRendered(packageName: string, url?: string, data?: string)
			{
				var packageFile: IFileResource;
				if (url)
				{
					if (data)
					{
						packageFile = FileResourceHandler.storeFileData(url, data);
					}
					else
					{
						var key = url.toLowerCase();
						packageFile = FileResourceHandler.fileResources[key];
						if (!packageFile)
						{
							packageFile = FileResourceHandler.fileResources[key] = { url: url };
						}
					}

					packageFile.rendered = true;
				}

				var registeredPackage = FileResourceHandler.packages[packageName];
				if (!registeredPackage)
				{
					FileResourceHandler.registerPackage({name: packageName, url: url, rendered: true});
				}
				else if (registeredPackage.resourceGroups)	// package is already initialized from configuration
				{
					FileResourceHandler.setRenderedPackage(registeredPackage);
				}
			}

		private static getPreferedPackage(packages: IPackageResourceDefinition[]): IPackageResourceDefinition
		{
			var len = packages && packages.length;
			if (!len)
			{
				return null;
			}
			else if (len == 1)
			{
				return packages[0];
			}
			else
			{
				var parentPackage: IPackageResourceDefinition;
				var parentPackageUrl: string;

				for (var i = 0, len = packages.length; i < len; i++)
				{
					var newPackage = packages[i];
					var newPackageUrl = newPackage.url;
					var key = newPackageUrl.toLowerCase();
					var newPackageFileResource = FileResourceHandler.fileResources[key];

					if ((newPackageFileResource && (newPackageFileResource.loading || newPackageFileResource.loaded)) ||
						(Resources.preloadPackages && Resources.preloadPackages[key] && !Resources.preloadPackages[key].error))
					{
						return newPackage;
					}

					var useNewPackage: boolean = null;

					if (!parentPackage)
					{
						useNewPackage = true;
					}
					else
					{
						var parentPackageUrlCommon = (parentPackageUrl.indexOf("~/") == 0);
						var newPackageUrlCommon = (newPackageUrl.indexOf("~/") == 0);
						if (parentPackageUrlCommon != newPackageUrlCommon)
						{
							// prefer shared over local
							if (newPackageUrlCommon)
							{
								useNewPackage = true;
							}
							else //if (parentPackageUrlCommon)
							{
								useNewPackage = false;
							}
						}
						else if (newPackageUrlCommon && Application.isHosted && Application.useHostedLibraryResources)	// && parentPackageUrlCommon)
						{
							// rendered or not locally (next check) is not relevant if loading via host
						}
						else if (newPackage.rendered)
						{
							if (!parentPackage.rendered)
							{
								useNewPackage = true;
							}
							else
							{
								var oldUrl = parentPackageUrl;
								var newUrl = newPackageUrl;

								if (parentPackageUrlCommon)
								{
									oldUrl = Types.Url.combinePath(FileResourceHandler.corePath, oldUrl.slice(2));
								}
								oldUrl = Types.Url.combinePath(window.location.href, oldUrl);

								if (newPackageUrlCommon)
								{
									newUrl = Types.Url.combinePath(FileResourceHandler.corePath, newUrl.slice(2));
								}
								newUrl = Types.Url.combinePath(window.location.href, newUrl);

								var scripts = SDL.jQuery("script[src]");
								var oldUrlFound = false;
								var newUrlFound = false;
			
								for (var i = 0, len = scripts.length; i < len && (!oldUrlFound || !newUrlFound); i++)
								{
									var src = (<HTMLScriptElement>scripts[i]).src;
									var index = src.indexOf("?");
									if (index != -1)
									{
										src = src.slice(0, index);
									}

									if (src == oldUrl)
									{
										oldUrlFound = true;
									}
									else if (src == newUrl)
									{
										newUrlFound = true;
									}
								}

								if (newUrlFound != oldUrlFound)
								{
									useNewPackage = newUrlFound;
								}
							}
						}

						if (useNewPackage == null && newPackage.resourceGroups)
						{
							//take the package with most resource groups for better reuse
							useNewPackage = !parentPackage.resourceGroups || (newPackage.resourceGroups.length > parentPackage.resourceGroups.length);
						}
					}

					if (useNewPackage)
					{
						parentPackage = newPackage;
						parentPackageUrl = newPackageUrl;
					}
				}
				return parentPackage;
			}
		}

		private static loadPackage(resourcesPackage: IPackageResourceDefinition, callback: () => void,
									errorcallback?: (fileResource: IFileResource) => void, sync?: boolean)
		{
			var key = resourcesPackage.url.toLowerCase();
			var file = FileResourceHandler.fileResources[key];

			if (!file || !file.loaded)
			{
				FileResourceHandler.load(resourcesPackage, (file?: IFileResource) => FileResourceHandler.processPackageFileLoaded(resourcesPackage, file), errorcallback, sync);
			}
			else if (!resourcesPackage.unpacked)
			{
				FileResourceHandler.processPackageFileLoaded(resourcesPackage, file);
			}
			else if (callback)
			{
				callback();
			}
		}

		private static processPackageFileLoaded(resourcesPackage: IPackageResourceDefinition, file: IFileResource)
		{
			if (file && file.loaded && resourcesPackage && !resourcesPackage.unpacked)
			{
				resourcesPackage.unpacked = true;

				var data = file.data;

				if (!Configuration.ConfigurationManager.isApplicationHost ||	// ApplicationHost needs the data stored, for hosted applications
							file.url.indexOf("~/") != 0)
				{
					delete file.data;
				}

				var start: number;
				var sizes: any[];
				var contentMatches: string[];

				var m = data && data.match(/^\/\*(\d+(?:,\d+)*)\*\//);
				if (m)
				{
					start = m[0].length;
					sizes = m[1].split(",");
				}
				else
				{
					if (data.indexOf("/*SDL-PACKAGE*/") == 0)
					{
						// this is self-extracting package
						contentMatches = data.match(/\/\*FILE-BEGIN\*\/.*?\/\*FILE-END\*\//g);
					}
					else
					{
						start = 0;
						sizes = [data.length];
					}
				}

				var fileResources = FileResourceHandler.fileResources;
				var allRendered = true;
				var calls: JQueryCallback[] = [];
				var fileNumber = -1;

				SDL.jQuery.each(resourcesPackage.resourceGroups, (index: number, resourceGroup: IResourceGroupDefinition) =>
					SDL.jQuery.each(resourceGroup.files, (index: number, url: string) =>
					{
						++fileNumber;
						var key = url.toLowerCase();
						var resourceFile = fileResources[key] || (fileResources[key] = <IFileResource>{url: url});
						var size = sizes && sizes[fileNumber] || 0;

						resourceFile.loaded = true;
						delete resourceFile.loading;
						
						if (!resourceFile.rendered)
						{
							if (file.rendered)
							{
								resourceFile.rendered = true;
							}
							else
							{
								allRendered = false;
							}
						}

						if (!resourceFile.rendered || Configuration.ConfigurationManager.isApplicationHost)	// ApplicationHost needs the data stored, for hosted applications
						{
							if (sizes)
							{
								resourceFile.data = data.substr(start, size);
							}
							else
							{
								resourceFile.data = JSON.parse((contentMatches[fileNumber] || "").slice(14, -12));
							}
							
							if (file.isShared)
							{
								resourceFile.isShared = true;
							}
						}
						
						start += Number(size);

						var callbacks = FileResourceHandler.callbacks[key];
						if (callbacks)
						{
							calls.push(callbacks);
							delete FileResourceHandler.callbacks[key];
						}

						var errorcallbacks = FileResourceHandler.errorcallbacks[key];
						if (errorcallbacks)
						{
							errorcallbacks.empty();
							delete FileResourceHandler.errorcallbacks[key];
						}
					}));

				if (allRendered)
				{
					resourcesPackage.rendered = file.rendered = true;
				}

				for (var j = 0, lenj = calls.length; j < lenj; j++)
				{
					calls[j].fire();
					calls[j].empty();
				}
			}
		}

		private static setRenderedPackage(resourcesPackage: IPackageResourceDefinition)
		{
			if (resourcesPackage && !resourcesPackage.rendered)
			{
				resourcesPackage.rendered = true;

				var fileResources = FileResourceHandler.fileResources;
				var key = resourcesPackage.url.toLowerCase();
				var resourceFile = fileResources[key] || (fileResources[key] = <IFileResource>{url: resourcesPackage.url});
				resourceFile.rendered = true;
				if (resourceFile.data &&
						(!Configuration.ConfigurationManager.isApplicationHost ||	// ApplicationHost needs the data stored, for hosted applications
							resourceFile.url.indexOf("~/") != 0))
				{
					delete resourceFile.data;
				}

				SDL.jQuery.each(resourcesPackage.resourceGroups, (index: number, resourceGroup: IResourceGroupDefinition) =>
					SDL.jQuery.each(resourceGroup.files, (index: number, url: string) =>
					{
						var key = url.toLowerCase();
						var resourceFile = fileResources[key] || (fileResources[key] = <IFileResource>{url: url});
						resourceFile.rendered = true;
						if (resourceFile.data &&
								(!Configuration.ConfigurationManager.isApplicationHost ||	// ApplicationHost needs the data stored, for hosted applications
									resourceFile.url.indexOf("~/") != 0))
						{
							delete resourceFile.data;
						}
					}));
			}
		}

		static updateCultureResources(callback: () => void)
		{
			var culturesToRender = 1;	// 1 to make sure the callback is not invoked too soon
			var cultureRenderedCallback = () =>
				{
					if (!--culturesToRender && callback)
					{
						callback();
					}
				};

			SDL.jQuery.each(FileResourceHandler.cultureResources, (key: string, resource: IFileResource) =>
				{
					var toRender = resource.rendered;
					var toLoad = toRender || resource.loaded || resource.loading;
					
					resource.loaded = false;
					resource.rendered = false;

					if (toLoad)
					{
						FileResourceHandler.load(<IFileResourceDefinition>{url: resource.url, version: resource.version});
					}

					if (toRender)
					{
						culturesToRender++;
						FileResourceHandler.renderWhenLoaded(<IFileResourceDefinition>{url: resource.url, version: resource.version}, cultureRenderedCallback);
					}
				});

			cultureRenderedCallback();	// to take care of the initial culturesToRender = 1
		}
	}
}
