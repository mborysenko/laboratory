/// <reference path="../../SDL.Client.UI.Core/Controls/ControlBase.d.ts" />
declare module SDL.UI.Controls {
    export interface ITreeViewNodeData {
        id: string;
        name: string;
        dataType: string;
        parent: ITreeViewNode;
        children: ITreeViewNode[];
        isLeafNode: boolean;
        load: (node: ITreeViewNode, callback: (nodes: ITreeViewNode[]) => void) => void;
        isSelectable: boolean;
    }

    export interface ITreeViewNode {
        id: string;
        name: string;
        dataType: string;
        parent: ITreeViewNode;
        children: ITreeViewNode[];
        isLeafNode: boolean;
        load: (node: ITreeViewNode, callback: (nodes: ITreeViewNode[]) => void) => void;
        isSelectable: boolean;

        isLoading: boolean;
        isRenderering: boolean;
        isExpanded: boolean;
        isSelected: boolean;
        isPartiallySelected: boolean;
        depth: number;

        getPath(): string;
        hasRendered(): boolean;
        hasLoaded(): boolean;
    }

    export interface ITreeViewOptions {
        onSelectionChanged?: () => void;
        rootNodes: ITreeViewNode[];
        nodeContentRenderer?: (node: ITreeViewNode) => string;
        includeBranchNodesInSelection?: boolean;
        renderDataIdAttribute?: boolean;
        useCommonUILibraryScrollView?: boolean;
        multiselect?: boolean;
        activeNodeIdPath?: string;
    }

    class TreeView extends Core.Controls.ControlBase {
        constructor(element: HTMLElement, options: ITreeViewOptions);

        public update(options?: ITreeViewOptions): void;
        public dispose(): void;
        public getDisposed(): boolean;

        public createNode(id: string, name: string, dataType: string, parent: ITreeViewNode, children: ITreeViewNode[], isLeafNode: boolean, load: (callback: () => void) => void, isSelectable: boolean): ITreeViewNode
        public createNodeFromObject(data: ITreeViewNodeData): ITreeViewNode;

        public setActiveNode(node: ITreeViewNode): void;
        public setActiveNodeByPath(path: string): void;

        public selectNode(node: ITreeViewNode): void;
        public selectNodeByPath(path: string): void;

        public selectNodes(nodes: ITreeViewNode[]): void;
        public selectNodesByPath(paths: string[]): void;

        public deselectNode(node: ITreeViewNode): void;
        public deselectNodes(nodes: ITreeViewNode[]): void;
        
        public loadDescendants(node: ITreeViewNode): void;
        public expandDescendantsByIds(node: ITreeViewNode, descendantIds: string[], onComplete: (match: ITreeViewNode[]) => void): void;
    }
}