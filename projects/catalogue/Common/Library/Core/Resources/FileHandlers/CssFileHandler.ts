/// <reference path="../../Libraries/jQuery/SDL.jQuery.ts" />
/// <reference path="../FileResourceHandler.ts" />

module SDL.Client.Resources.FileHandlers
{
	export class CssFileHandler extends FileResourceHandler
	{
		public static updatePaths(file: IFileResource, addHost: boolean = false): string
		{
			var data = file.data;
			if (data)
			{
				var path: string;
				var version: string;

				return data.replace(/\{(PATH|ROOT|VERSION)\}(\/?)/g,
					<(substring: string, ...args: any[]) => string>function(substring: string, token: string, next: string): string
					{
						switch (token)
						{
							case "PATH":
								if (!path)
								{
									var url = file.url;
									if (url && url.indexOf("~/") == 0)
									{
										url = Types.Url.combinePath(FileResourceHandler.corePath, url.slice(2));
									}

									if (url)
									{
										var lastSlashPos = url.lastIndexOf("/");
										path = (lastSlashPos != -1) ? url.slice(0, lastSlashPos + 1) : (url + "/");
									}
									else
									{
										path = "/";
									}
								}
								return addHost ? Types.Url.combinePath(window.location.href, path) : path;
							case "ROOT":
								return addHost ? Types.Url.combinePath(window.location.href, FileResourceHandler.corePath) : FileResourceHandler.corePath;
							case "VERSION":
								if (version === undefined)
								{
									version = file.version;
									if (!version && file.parentPackages)
									{
										SDL.jQuery.each(file.parentPackages, (index: number, pckg: IPackageResourceDefinition) =>
											{
												version = pckg.version;
												if (version)
												{
													return false;
												}
											});
									}
									version = version ? "?" + version : "";
								}
								return version;
						}
					});
			}
			return data;
		}

		public static supports(url: string): boolean
		{
			return (/\.css(\?|\#|$)/i).test(url);
		}

		public _supports(ext: string): boolean
			{
				return (ext == "css");
			}

		public _render(file: IFileResource): void
			{
				file.type = "text/css";
				var $styles: JQuery;

				if (SDL.jQuery.browser.msie && ($styles = SDL.jQuery("link[type='text/css'], style")).length > 30)
				{
					// IE has a problem with dealing with more than 31 css/text links + style-tags...
					// if the number of styles exceed 31 in total,
					// we will gather the rest of the style sheets in one embedded <style> element
					var $lastStyle = $styles.last();
					if ($lastStyle.is("style"))
					{
						$lastStyle.text($lastStyle.text() + "\n\n/* APPENDED: (" + file.url + ") */\n\n" + CssFileHandler.updatePaths(file));
					}
					else //if ($lastStyle.is("link"))
					{
						// this is unlikely that the last style is linked as long as we add embedded styles
						// still, if for whatever reason it happens, load the linked style synchronously and replace the <link>
						// with an embedded <style>

						// 1. remove the linked style
						var url = $lastStyle.remove().attr("href");

						// 2. load its contents
						SDL.Client.Net.callWebMethod(url, "", "GET", null, true,
							(data: string) =>
								{
									// 3a. insert as a <style> element
									SDL.jQuery("head").append(SDL.jQuery("<style />",
									{
										id: url,
										text: data +
											"\n\n/* APPENDED: (" + file.url + ") */\n\n" + CssFileHandler.updatePaths(file)
									}));
								},
								(errorThrow: string) =>
								{
									// 3b. insert as a <style> element
									SDL.jQuery("head").append(SDL.jQuery("<style />",
									{
										id: url,
										text: "/* FAILED LOADING \"" + url + "\":\n" + errorThrow +
											"*/\n\n/* APPENDED: (" + file.url + ") */\n\n" + CssFileHandler.updatePaths(file)
									}));
								}
							);
					}
				}
				else
				{
					SDL.jQuery("head").append(SDL.jQuery("<style />",
					{
						id: file.url,
						text: CssFileHandler.updatePaths(file)
					}));
				}
			}
	}
	FileResourceHandler.registeredResourceHandlers.push(new CssFileHandler());
}