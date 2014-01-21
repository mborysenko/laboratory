/// <reference path="../../Libraries/jQuery/SDL.jQuery.ts" />
/// <reference path="../FileResourceHandler.ts" />

module SDL.Client.Resources.FileHandlers
{
	class HtmlFileHandler extends FileResourceHandler
	{
		public _supports(ext: string): boolean
			{
				return (ext == "htm" || ext == "html");
			}

		public _render(file: IFileResource): void
			{
				var templ = SDL.jQuery(file.data);
				file.type = templ.attr("type");
				file.template = templ.html();
				FileResourceHandler.templates[templ.attr("id")] = file;
			}
	}
	FileResourceHandler.registeredResourceHandlers.push(new HtmlFileHandler());
}