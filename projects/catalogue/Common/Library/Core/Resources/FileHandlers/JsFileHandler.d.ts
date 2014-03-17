/// <reference path="../../Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../FileResourceHandler.d.ts" />
declare module SDL.Client.Resources.FileHandlers {
    class JsFileHandler extends FileResourceHandler {
        public addSourceUrl(file: IFileResource): string;
        public _supports(ext: string): boolean;
        public _render(file: IFileResource): void;
    }
}
