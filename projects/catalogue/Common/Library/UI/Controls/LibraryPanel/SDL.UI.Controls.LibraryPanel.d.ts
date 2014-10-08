/// <reference path="../../SDL.Client.UI.Core/Controls/ControlBase.d.ts" />
declare module SDL.UI.Controls {

    export interface ILibraryPanelOptions {
        data: Object[];
        onSelectionCallback?: (selectedItem: Object) => void;
        rootName: string;
        title: string;
        subTitle?: string;
        onClose?: () => void;
        isClosable?: boolean;
        useCommonUILibraryScrollView?: boolean;
    }

    class LibraryPanel extends Core.Controls.ControlBase {
        constructor(element: HTMLElement, options: ILibraryPanelOptions);

        public update(options?: ILibraryPanelOptions): void;
        public dispose(): void;
        public getDisposed(): boolean;

        public selectItemById(selectedId: string, isDrillAction: boolean): void;
    }
}