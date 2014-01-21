/// <reference path="..\MarshallableObject.d.ts" />
declare module SDL.Client.Models.Base 
{
    export interface IContinuousIterationObjProperties extends IMarshallableObjectProperties
	{
		id: string;        
        active: boolean;
        toCancel: boolean;
	    cancelled: boolean;
	    timeout: number;
	    itemsCount: number;
	    itemsDoneCount: number;
	    errorsCount: number;
	    items: Array;
	    operation: any;
        operationId: string;
	}    
    class ContinuousIterationObject extends MarshallableObject 
    {
        constructor(id?: string);
        getId(): string;
        getItemsCount(): number;
        getItemsDoneCount(): number;
        getErrorsCount(): number;
        getErrorDetails(): Object;
        isActive(): boolean;
        stop(): void;
        showError(error: any): void;
        properties: IContinuousIterationObjProperties;
        _queryState(): void;
        _onUpdate(result: any): void;
        _onError(error: any): void;        
        _executeStopContinuousIteration(id: string, sucess: boolean, faliure: boolean): void;        
    }
}
