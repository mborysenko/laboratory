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
            },
            {
                id: model.getCollectionListType(),
                alias: "LVF_COLLECTION_LIST",
                implementation: "LVF.Models.CollectionList"
            },
            {
                id: model.getCollectionType(),
                alias: "LVF_COLLECTION",
                implementation: "LVF.Models.Collection"
            }
        ]
    );

    export var Factory = model;

    export var ProductData = {
        "101": {
            "sku": "101",
            "stock": "15",
            "category": {"id": "201", "title": "Fishing Lines"},
            "visibility": "true",
            "vendor": "Drennan",
            "title": "Drennan Double Strength",
            "description": "<p><strong>Drennan Double Strength is the first Japanese hi-tech line made widely avail­able in the UK.<strong></p><p>It offers excel­lent strength to dia­meter ratios in a wide range of breaking strains. This soft and supple, neutral tone line behaves and handles very well in a wide range of uses.</p>"
        },
        "102": {
            "sku": "102",
            "stock": "7",
            "category": {"id": "201", "title": "Fishing Lines"},
            "visibility": "true",
            "vendor": "Drennan",
            "title": "Drennan Feeder Braid",
            "description": "<p>pecially formulated for feeder fishing, Drennan Feeder Braid is a Dyneema-based reel line with an exceptional high breaking strain and knot strength.</p>"
        },
        "103": {
            "sku": "103",
            "stock": "29",
            "category": {"id": "201", "title": "Fishing Lines"},
            "visibility": "true",
            "vendor": "Drennan",
            "title": "Drennan Float Fish",
            "description": "<p><strong>Drennan Float Fish</strong> is an excel­lent main line for all types of float fishing.</p>"
        }
    }
}

