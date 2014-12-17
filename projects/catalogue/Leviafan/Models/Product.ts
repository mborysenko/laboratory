/// <reference path="../../Common/Library/Core/Types/OO.d.ts" />
/// <reference path="../../Common/Library/Core/Models/Base/ModelFactory.d.ts" />
/// <reference path="../../Common/Library/Core/Models/Models.d.ts" />
/// <reference path="../../Common/Library/Core/Models/UpdatableObject.d.ts" />

module LVF.Models
{
    eval(SDL.Client.Types.OO.enableCustomInheritance);

    export class Product extends SDL.Client.Models.UpdatableObject
    {
        constructor(id: string)
        {
            super(id);
        }

        public updateData(data: any, parentId: string): void
        {}

        public _executeLoad(force: boolean): void
        {

        }

        public _processLoadResult(result: string, WebRequest: Net.IWebRequest): void
        {}

    }

    SDL.Client.Types.OO.createInterface("LVF.Models.Product", Product);
}
