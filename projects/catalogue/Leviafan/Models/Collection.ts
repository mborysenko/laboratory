/// <reference path="../../Common/Library/Core/Types/OO.d.ts" />
/// <reference path="../../Common/Library/Core/Models/Base/ModelFactory.d.ts" />
/// <reference path="../../Common/Library/Core/Models/Models.d.ts" />
/// <reference path="../../Common/Library/Core/Models/UpdatableObject.d.ts" />

module LVF.Models
{
    eval(SDL.Client.Types.OO.enableCustomInheritance);

    export class Collection extends SDL.Client.Models.UpdatableObject
    {
        constructor(id: string)
        {
            super(id);
        }
    }

    SDL.Client.Types.OO.createInterface("LVF.Models.Collection", Collection);
}
