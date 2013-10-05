/// <reference path="..\MarshallableObject.d.ts" />
declare module SDL.Client.Models.Base
{   
    export class Clipboard extends SDL.Client.Models.MarshallableObject
    {
        constructor ();
        static getInstance(): Clipboard;
        static setData(data: any, action: string): void;
        static getData(): any;
        static getDataTypes(): any[];
        static getAction(): string;
        static clearData(): void;
        static PasteAction: 
        { 
            COPY: number; 
            CUT: number;
        };
    }
}