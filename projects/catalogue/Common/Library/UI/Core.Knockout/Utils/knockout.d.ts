/// <reference path="../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../../SDL.Client.Core/Types/Types.d.ts" />
/// <reference path="../Libraries/knockout/knockout.d.ts" />
declare module SDL.UI.Core.Knockout.Utils {
    function unwrapRecursive(value: any, maxDepth?: number): any;
}
