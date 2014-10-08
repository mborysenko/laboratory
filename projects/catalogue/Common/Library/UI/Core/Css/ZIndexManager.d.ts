declare module SDL.UI.Core.Css.ZIndexManager {
    var baseZIndex: number;
    function setNextZIndex(element: HTMLElement, bringToFront?: boolean): void;
    function getZIndex(element: HTMLElement): number;
    function insertZIndexBefore(element: HTMLElement, beforeElement: HTMLElement): void;
    function releaseZIndex(element: HTMLElement): void;
}
