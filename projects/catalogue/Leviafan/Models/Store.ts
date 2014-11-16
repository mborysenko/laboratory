/// <reference path="../../Common/Library/Core/Types/OO.d.ts" />
/// <reference path="../../Common/Library/Core/Models/Base/ModelFactory.d.ts" />
/// <reference path="../../Common/Library/Core/Models/Models.d.ts" />
/// <reference path="../../Common/Library/Core/Models/Base/ListProvider.d.ts" />
/// <reference path="ProductList.ts" />

module LVF.Models
{
    eval(SDL.Client.Types.OO.enableCustomInheritance);

    export class Store extends SDL.Client.Models.Base.ListProvider
    {
        constructor(id: string)
        {
            super(id);
        }

        /**
         * @return ProductList
         */
        public getProductList(): LVF.Models.ProductList
        {
            return this.getList(<any>{itemTypes: [(<any>this.getModelFactory()).getProductListType()]});
        }

    }

    SDL.Client.Types.OO.createInterface("LVF.Models.Store", Store);
}
