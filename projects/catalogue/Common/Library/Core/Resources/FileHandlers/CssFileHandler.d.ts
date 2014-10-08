/// <reference path="../../Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../FileResourceHandler.d.ts" />
declare module SDL.Client.Resources.FileHandlers {
    class CssFileHandler extends FileResourceHandler {
        static updatePaths(file: IFileResource, addHost?: boolean): string;
        static supports(url: string, fileType?: string): boolean;
        public _supports(ext: string): boolean;
        public _render(file: IFileResource): void;
    }
}
