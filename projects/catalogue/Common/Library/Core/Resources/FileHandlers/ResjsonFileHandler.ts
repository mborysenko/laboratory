/// <reference path="../../Libraries/jQuery/SDL.jQuery.ts" />
/// <reference path="../../Libraries/Globalize/SDL.Globalize.ts" />
/// <reference path="../FileResourceHandler.ts" />

module SDL.Client.Resources.FileHandlers
{
	export class ResjsonFileHandler extends FileResourceHandler
	{
		public _supports(ext: string): boolean
			{
				return (ext == "resjson");
			}

		public _render(file: IFileResource): void
			{
				var cultureMatch = file.url.match(/([^\.]*).resjson$/i);
				if (cultureMatch)
				{
					SDL.Globalize.addCultureInfo(cultureMatch[1] || "default", {
						messages: JSON.parse(file.data)
						});
				}
			}
	}
	FileResourceHandler.registeredResourceHandlers.push(new ResjsonFileHandler());
}