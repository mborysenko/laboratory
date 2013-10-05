/// <reference path="../../Libraries/jQuery/SDL.jQuery.ts" />
/// <reference path="../FileResourceHandler.ts" />

module SDL.Client.Resources.FileHandlers
{
	class JsFileHandler extends FileResourceHandler
	{
		public _supports(ext: string): boolean
			{
				return (ext == "js");
			}

		public _render(url: string, file: IFileResource): void
			{
				file.type = "text/javascript";
				if (file.context)
				{
					(function()
					{
						var url, file;	// hiding context variables
						eval(arguments[0]);
					}).apply(file.context, [file.data]);
				}
				else
				{
					SDL.jQuery.globalEval(file.data);
				}
			}
	}
	FileResourceHandler.registeredResourceHandlers.push(new JsFileHandler());
}