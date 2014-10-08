/// <reference path="../../Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../../Libraries/Globalize/SDL.Globalize.d.ts" />
/// <reference path="../FileResourceHandler.d.ts" />
declare module SDL.Client.Resources.FileHandlers {
    class ResjsonFileHandler extends FileResourceHandler {
        public _supports(ext: string): boolean;
        public _render(file: IFileResource): void;
    }
}
