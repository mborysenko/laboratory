/// <reference path="../../Common/Library/Core/Types/OO.d.ts" />
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

            this.properties['removing'] = false;

            this.addInterface("SDL.Client.Models.ModelObject", [id]);
        }

        public _executeLoad(reload: boolean): void
        {
            var p: any = this.properties;

            p.items = [
                {
                    sku: "101",
                    title: "Drennan Double Strength",
                    description: "<p><strong>Drennan Double Strength is the first Japanese hi-tech line made widely avail­able in the UK.<strong></p><p>It offers excel­lent strength to dia­meter ratios in a wide range of breaking strains. This soft and supple, neutral tone line behaves and handles very well in a wide range of uses.</p>"
                },
                {
                    sku: "102",
                    title: "Drennan Feeder Braid",
                    description: "<p>pecially formulated for feeder fishing, Drennan Feeder Braid is a Dyneema-based reel line with an exceptional high breaking strain and knot strength.</p>"
                },
                {
                    sku: "103",
                    title: "Drennan Float Fish",
                    description: "<p><strong>Drennan Float Fish</strong> is an excel­lent main line for all types of float fishing.</p>"
                }
            ]
        }

    }

    SDL.Client.Types.OO.createInterface("LVF.Models.ProductList", ProductList);
}

