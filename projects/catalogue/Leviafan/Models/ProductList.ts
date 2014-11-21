/// <reference path="../../Common/Library/Core/Types/OO.d.ts" />
/// <reference path="../../Common/Library/Core/Net/Ajax.d.ts" />
/// <reference path="../../Common/Library/Core/Models/Base/ModelFactory.d.ts" />
/// <reference path="../../Common/Library/Core/Models/Models.d.ts" />
/// <reference path="../../Common/Library/Core/Models/Base/List.d.ts" />

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
            var p: any = this.properties;

            this._onLoad('[{ "sku": "101", "stock": "15", "category": { "id": "201", "title": "Fishing Lines" }, "visibility": "true", "vendor": "Drennan", "title": "Drennan Double Strength", "description": "<p><strong>Drennan Double Strength is the first Japanese hi-tech line made widely avail­able in the UK.<strong></p><p>It offers excel­lent strength to dia­meter ratios in a wide range of breaking strains. This soft and supple, neutral tone line behaves and handles very well in a wide range of uses.</p>" }, { "sku": "102", "stock": "7", "category": { "id": "201", "title": "Fishing Lines" }, "visibility": "true", "vendor": "Drennan", "title": "Drennan Feeder Braid", "description": "<p>pecially formulated for feeder fishing, Drennan Feeder Braid is a Dyneema-based reel line with an exceptional high breaking strain and knot strength.</p>" }, { "sku": "103", "stock": "29", "category": { "id": "201", "title": "Fishing Lines" }, "visibility": "true", "vendor": "Drennan", "title": "Drennan Float Fish", "description": "<p><strong>Drennan Float Fish</strong> is an excel­lent main line for all types of float fishing.</p>" }]', null)
        }

        public _processLoadResult(data: string, WebRequest: SDL.Client.Net.IWebRequest): void
        {
            debugger;
            var items = SDL.jQuery.parseJSON(data);
            var p: any = this.properties;

            p.items = items;
        }

        public getCount(): number
        {
            return this.getItems().length
        }

        public getItems(): any[]
        {
            return this.callBase("SDL.Client.Models.Base.List", "getItems");
        }
    }

    SDL.Client.Types.OO.createInterface("LVF.Models.ProductList", ProductList);
}

