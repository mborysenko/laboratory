/// <reference path="../../Common/Library/Core/Types/OO.d.ts" />
/// <reference path="../../Common/Library/Core/Models/Base/ModelFactory.d.ts" />
/// <reference path="../../Common/Library/Core/Models/Models.d.ts" />

module LVF.Models
{
    eval(SDL.Client.Types.OO.enableCustomInheritance);

    export class ModelFactory extends SDL.Client.Models.Base.ModelFactory implements IModelFactory
    {
        constructor()
        {
            super();
        }

        public setPrefix(prefix: string): void
        {
            this.getSettings().prefix = prefix;
        }

        /**
         * Returns the ID of the global root folder {SDL.Client.Models.Base.ModelsBrowser}.
         *
         * @return {string}
         */
        public getSystemRootId(): string
        {
            return this.getModelSpecificUri("root", this.getSystemRootType());
        }

        /**
         * @return {string}
         */
        public getSystemRootType(): string
        {
            return this.getSettings().prefix + "root";
        }

        /**
         * @return {string}
         */
        public getProductType(): string
        {
            return this.getSettings().prefix + "product";
        }

        /**
         * @return {string}
         */
        public getProductListType(): string
        {
            return this.getSettings().prefix + "product_list";
        }

        /**
         * @return {string}
         */
        public getCollectionType(): string
        {
            return this.getSettings().prefix + "collection";
        }

        /**
         * @return {string}
         */
        public getCollectionListType(): string
        {
            return this.getSettings().prefix + "collection_list";
        }
    }

    export interface IModelFactory extends SDL.Client.Models.IModelFactory
    {
        getCollectionListType(): string
        getCollectionType(): string
        getProductListType(): string
        getProductType(): string
    }


    SDL.Client.Types.OO.createInterface("LVF.Models.ModelFactory", <any>ModelFactory);

}
