/// <reference path="../../Common/Library/Core/Types/OO.d.ts" />
/// <reference path="../../Common/Library/Core/Models/Base/ModelFactory.d.ts" />
/// <reference path="../../Common/Library/Core/Models/Models.d.ts" />
/// <reference path="../../Common/Library/Core/Models/UpdatableObject.d.ts" />

module LVF.Models
{
    eval(SDL.Client.Types.OO.enableCustomInheritance);

    export class Product extends SDL.Client.Models.Base.Item
    {
        public properties: any;

        constructor(id: string)
        {
            super(id);

            this.addInterface("SDL.Client.Models.UpdatableObject", [id]);
        }

        public updateData(data: any, parentId: string): void
        {
            var p: any = this.properties;

            p.title = data.title;
            p.sku = data.sku;
            p.stock = data.stock;
            p.categoryId = data.categoryId;
            p.vendor = data.vendor;
            p.visibility = data.visibility;
            p.description = data.description;
        }

        public _executeLoad(force: boolean): void
        {
            setTimeout(() => { this._onLoad(LVF.Models.ProductData.getDataItemAsString("products", this.getOriginalId())); }, 500);
        }

        public _processLoadResult(data: any, WebRequest: Net.IWebRequest): void
        {
            var p: any = this.properties;

            if (typeof data == "string")
            {
                data = SDL.jQuery.parseJSON(data);
            }

            p.name = data.name;
            p.sku = data.sku;
            p.stock = data.stock;
            p.categoryId = data.categoryId;
            p.vendor = data.vendor;
            p.visibility = data.visibility;
            p.description = data.description;
        }

        public getSku(): string
        {
            return this.properties.sku;
        }

        public getName(): string
        {
            return this.properties.name;
        }

        public getStock(): string
        {
            return this.properties.stock;
        }

        public getCategoryId(): string
        {
            return this.properties.categoryId;
        }

        public getVendor(): string
        {
            return this.properties.vendor;
        }

        public getVisibility(): string
        {
            return this.properties.visibility;
        }

        public getDescription(): string
        {
            return this.properties.description;
        }
    }

    SDL.Client.Types.OO.createInterface("LVF.Models.Product", Product);
}
