/// <reference path="../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Controls/jQuery.d.ts" />
/// <reference path="TopPageTabs.d.ts" />
declare module SDL.UI.Controls {
    interface JQueryTopPageTabs extends Core.Controls.JQueryControl {
        selectNext(): JQueryTopPageTabs;
        selectPrevious(): JQueryTopPageTabs;
        selectFirst(): JQueryTopPageTabs;
        selectLast(): JQueryTopPageTabs;
        selectedIndex(): number;
        selection(): JQuery;
        setSelection(index: number): JQueryTopPageTabs;
        setSelectedIndex(index: number): JQueryTopPageTabs;
    }
}
interface JQuery {
    topPageTabs(options?: SDL.UI.Controls.ITabsOptions): SDL.UI.Controls.JQueryTopPageTabs;
}
