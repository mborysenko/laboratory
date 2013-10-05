/// <reference path="Exception.d.ts" />
declare module SDL.Client.Exception
{
	interface IValidationResults {[property: string]: Exception;}
    class ValidationException extends Exception
    {
        constructor(validationResults: IValidationResults);
        getValidationResults(): IValidationResults;
		addValidationResult(property: string, errorCode: string, message?: string, description?: string): void;
		addValidationResult(property: string, exception: Exception): void;
		removeValidationResult(property?: string): void;
    }
}