/// <reference path="jQuery.d.ts" />
declare module SDL {
    interface JQueryBrowserInfo {
        safari?: boolean;
        opera?: boolean;
        msie?: boolean;
        mozilla?: boolean;
        webkit?: boolean;
        chrome?: boolean;
        macintosh?: boolean;
        mobile?: boolean;
        version?: string;
    }
    interface SDLJQueryStatic extends JQueryStatic {
        browser: JQueryBrowserInfo;
    }
    var jQuery: SDLJQueryStatic;
}
