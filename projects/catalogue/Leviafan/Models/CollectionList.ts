/// <reference path="../../Common/Library/Core/Types/OO.d.ts" />
/// <reference path="../../Common/Library/Core/Net/Ajax.d.ts" />
/// <reference path="../../Common/Library/Core/Models/Base/ModelFactory.d.ts" />
/// <reference path="../../Common/Library/Core/Models/Models.d.ts" />
/// <reference path="../../Common/Library/Core/Models/Base/List.d.ts" />

module LVF.Models
{
    eval(SDL.Client.Types.OO.enableCustomInheritance);

    export class CollectionList extends SDL.Client.Models.Base.List
    {
        constructor(id: any, parentId: any, filter: any)
        {
            super(id, parentId, filter);

            // Initialize items with empty
            this.properties.items = [];

            this.addInterface("SDL.Client.Models.ModelObject", [id]);
        }

        public _executeLoad(reload: boolean): void
        {
            var p: any = this.properties;

            this._onLoad('[' +
            '{ "id": "301", "title": "Fishing Rods", "thumbnail": "null" }, ' +
            '{ "id": "302", "title": "Reels", "thumbnail": "null"}, ' +
            '{ "id": "303", "title": "Fishing Lines", "thumbnail": "null" }]', null)
        }

        public _processLoadResult(data: string, WebRequest: SDL.Client.Net.IWebRequest): void
        {
            var items = SDL.jQuery.parseJSON(data);
            var p: any = this.properties;

            p.items = items;
        }

        public getCount(): number
        {
            return this.getItems().length
        }
    }

    SDL.Client.Types.OO.createInterface("LVF.Models.CollectionList", CollectionList);
}

