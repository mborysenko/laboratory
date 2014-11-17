/// <reference path="../../Common/Library/Core/Types/OO.d.ts" />
/// <reference path="../../Common/Library/Core/Models/Base/ModelFactory.d.ts" />
/// <reference path="../../Common/Library/Core/Models/Models.d.ts" />
/// <reference path="ModelFactory.ts" />

module LVF.Models
{
    var model = new ModelFactory();
    model.setPrefix("lvf:");

    SDL.Client.Models.registerModelFactory(
        model.getIdMatchRegExp(),
        model,
        [
            {
                id: model.getSystemRootType(),
                alias: "LVF_ROOT",
                implementation: "LVF.Models.Store"
            },
            {
                id: model.getListType(),
                alias: "LVF_LIST",
                implementation: "SDL.Client.Models.Base.List"
            },
            {
                id: model.getProductListType(),
                alias: "LVF_PRODUCT_LIST",
                implementation: "LVF.Models.ProductList"
            },
            {
                id: model.getProductType(),
                alias: "LVF_PRODUCT",
                implementation: "LVF.Models.Product"
            }
        ]
    );

    export var Factory = model;
}

