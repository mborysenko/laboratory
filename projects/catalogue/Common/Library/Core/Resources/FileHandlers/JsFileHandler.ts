/// <reference path="../../Libraries/jQuery/SDL.jQuery.ts" />
/// <reference path="../FileResourceHandler.ts" />

module SDL.Client.Resources.FileHandlers
{
	export class JsFileHandler extends FileResourceHandler
	{
		public getSourceUrlFooter(file: IFileResource): string
			{
				return "\n//@ sourceURL=" + (
					(file.url.indexOf("~/") == 0)
						? Types.Url.combinePath(
							file.isShared ? Application.applicationHostCorePath : Types.Url.getAbsoluteUrl(Configuration.ConfigurationManager.corePath),
							file.url.slice(2))
						: Types.Url.getAbsoluteUrl(file.url));
			}

		public _supports(ext: string): boolean
			{
				return (ext == "js");
			}

		public _render(file: IFileResource): void
			{
				file.type = "text/javascript";
				if (file.context)
				{
					eval("(function(){\n" + file.data + "\n}).apply(arguments[0].context);" + this.getSourceUrlFooter(file));
					// using arguments[0] instead of 'file' beacause js-minimizer will rename the variable
				}
				else
				{
					SDL.jQuery.globalEval(file.data + this.getSourceUrlFooter(file));
				}
			}
	}
	FileResourceHandler.registeredResourceHandlers.push(new JsFileHandler());
}