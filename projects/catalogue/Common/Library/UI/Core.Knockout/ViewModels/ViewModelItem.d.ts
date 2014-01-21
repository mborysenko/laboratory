/// <reference path="../../SDL.Client.Core/Types/Types.d.ts" />
/// <reference path="../../SDL.Client.Core/Models/Models.d.ts" />
/// <reference path="../../SDL.Client.Core/Types/DisposableObject.d.ts" />
/// <reference path="../../SDL.Client.Core/Event/EventRegister.d.ts" />
/// <reference path="../Libraries/knockout/knockout.d.ts" />
declare module SDL.UI.Core.Knockout.ViewModels {
    interface IPropertyDef {
        getter?: string;
        setter?: string;
        events?: string[];
    }
    interface IMethodDef {
        method?: any;
        args?: any[];
    }
    interface IViewModelItemProperties {
        item: Object;
        properties: {
            [property: string]: IPropertyDef;
        };
        methods: {
            [method: string]: IMethodDef;
        };
        observables: {
            [event: string]: KnockoutObservable<number>;
        };
    }
    class ViewModelItem extends SDL.Client.Types.DisposableObject {
        public properties: IViewModelItemProperties;
        constructor(item: Object, properties: {
            [property: string]: IPropertyDef;
        }, methods: {
            [method: string]: IMethodDef;
        });
        constructor(item: string, properties: {
            [property: string]: IPropertyDef;
        }, methods: {
            [method: string]: IMethodDef;
        });
        public $initialize(): void;
        private _createProperties();
        private _createPropertyReader(events, getter);
        private _createPropertyWriter(setter);
        private _createEventObservables(events);
        private _createMethods();
        private _createMethod(methodName, methodEntry);
        private _checkMethod(methodName);
        public _onEvent(evt: JQueryEventObject): void;
    }
}
