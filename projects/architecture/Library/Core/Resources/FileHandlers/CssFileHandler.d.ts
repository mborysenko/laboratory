/// <reference path="../../Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../FileResourceHandler.d.ts" />
declare module SDL.Client.Resources.FileHandlers {
    class CssFileHandler extends Resources.FileResourceHandler {
        static updatePaths(data: string, url: string, addHost?: boolean): string;
        static supports(url: string): boolean;
        public _supports(ext: string): boolean;
        public _render(url: string, file: Resources.IFileResource): void;
    }
}
