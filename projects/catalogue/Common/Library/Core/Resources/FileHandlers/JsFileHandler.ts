/// <reference path="../../Libraries/jQuery/SDL.jQuery.ts" />
/// <reference path="../FileResourceHandler.ts" />

module SDL.Client.Resources.FileHandlers
{
	export class JsFileHandler extends FileResourceHandler
	{
		public addSourceUrl(file: IFileResource)
			{
				return file.data + "\n//@ sourceURL=" + (
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
					(function()
					{
						SDL.jQuery.globalEval(arguments[0]);
					}).apply(file.context, [this.addSourceUrl(file)]);
				}
				else
				{
					SDL.jQuery.globalEval(this.addSourceUrl(file));
				}
			}
	}
	FileResourceHandler.registeredResourceHandlers.push(new JsFileHandler());
}