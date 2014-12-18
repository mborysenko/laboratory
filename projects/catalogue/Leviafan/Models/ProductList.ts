/// <reference path="../../Common/Library/Core/Types/OO.d.ts" />
/// <reference path="../../Common/Library/Core/Net/Ajax.d.ts" />
/// <reference path="../../Common/Library/Core/Models/Base/ModelFactory.d.ts" />
/// <reference path="../../Common/Library/Core/Models/Models.d.ts" />
/// <reference path="../../Common/Library/Core/Models/Base/List.d.ts" />
/// <reference path="Factory.ts" />

module LVF.Models
{
    eval(SDL.Client.Types.OO.enableCustomInheritance);

    export class ProductList extends SDL.Client.Models.Base.List
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
            setTimeout(() => { this._onLoad(LVF.Models.ProductData.getDataAsString("products"), null); }, 500);
        }

        public _processLoadResult(data: any, WebRequest: SDL.Client.Net.IWebRequest): void
        {
            if (typeof data == "string")
            {
                data = SDL.jQuery.parseJSON(data);
            }

            var items = data;
            var p: any = this.properties;

            p.items = items;

            if (items)
            {
                var type = LVF.Models.Factory.getProductType();
                for (var i = 0, len = items.length; i < len; i++)
                {
                    var item = items[i];
                    // Generate repository specific ID
                    item.id = LVF.Models.Factory.getModelSpecificUri(item.id, type);
                }
            }

        }

        public getCount(): number
        {
            return this.getItems().length
        }

        public itemRemoved(itemId: any): void
        {}

        public updateItemData(item: SDL.Client.Models.UpdatableObject): void
        {}

        public itemUpdated(item: any): void
        {}

    }

    SDL.Client.Types.OO.createInterface("LVF.Models.ProductList", ProductList);
}

