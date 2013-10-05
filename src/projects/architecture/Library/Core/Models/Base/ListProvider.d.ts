///<reference path="List.d.ts"/>
///<reference path="..\ModelObject.d.ts"/>
///<reference path="..\..\Types\ObjectWithEvents.d.ts"/>
declare module SDL.Client.Models.Base
{ 
    export class ListProvider extends SDL.Client.Models.ModelObject
    {
        constructor (id: any);
        getListType(filter?: IListFilterProperties): string;
        getList(filter?: IListFilterProperties): List;
        properties: any;
    }
}