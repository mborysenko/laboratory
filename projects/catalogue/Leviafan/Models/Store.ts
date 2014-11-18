/// <reference path="../../Common/Library/Core/Types/OO.d.ts" />
/// <reference path="../../Common/Library/Core/Models/Base/ModelFactory.d.ts" />
/// <reference path="../../Common/Library/Core/Models/Models.d.ts" />
/// <reference path="../../Common/Library/Core/Models/Base/ListProvider.d.ts" />
/// <reference path="ProductList.ts" />
/// <reference path="ModelFactory.ts" />

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
        public getProductList():  SDL.Client.Models.Base.List
        {
            return this.getList(<any>{itemTypes: [(<any>this.getModelFactory()).getProductType()]});
        }

        public getListType(filterOptions?: any): string
        {
            var itemTypes = filterOptions && filterOptions.itemTypes;

            if (itemTypes && itemTypes.length == 1)
            {
                var factory = <LVF.Models.IModelFactory>this.getModelFactory();
                switch (itemTypes[0])
                {
                    case factory.getProductType():
                        return "LVF.Models.ProductList";
                    default:
                        return this.callBase("SDL.Client.Models.Base.ListProvider", "getListType", [filterOptions]);
                }
            }
        }


    }

    SDL.Client.Types.OO.createInterface("LVF.Models.Store", Store);
}
