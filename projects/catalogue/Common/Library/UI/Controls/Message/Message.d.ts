/// <reference path="../../SDL.Client.UI.Core/Controls/ControlBase.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Event/Constants.d.ts" />
declare module SDL.UI.Controls {
    enum MessageType {
        INFO,
        QUESTION,
        WARNING,
        ERROR,
        PROGRESS,
        GOAL,
    }
    interface IMessageOptions {
        type: MessageType;
        title: string;
    }
    interface IMessageProperties extends Core.Controls.IControlBaseProperties {
        options: IMessageOptions;
    }
    class Message extends Core.Controls.ControlBase {
        public properties: IMessageProperties;
        private $element;
        private $title;
        constructor(element: HTMLElement, options?: IMessageOptions);
        public $initialize(): void;
        public update(options?: IMessageOptions): void;
        private cleanUp();
    }
}
