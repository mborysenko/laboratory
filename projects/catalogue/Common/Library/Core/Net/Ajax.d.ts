declare module SDL.Client.Net
{
	export interface IWebRequest
		{
			xmlHttp: XMLHttpRequest;
			url: string;
			body: string;
			httpVerb: string;
			responseText: string;
			requestHeaders: {[header: string]: string};
			responseContentType: string;
			hasError: boolean;
			statusCode: number;
			statusText: string;
		}

	function callWebMethod(url: string, body: string, httpVerb: string, requestHeaders?: {[header: string]: string}, sync?: boolean, onSuccess?: (data: string, request: IWebRequest) => void, onFailure?: (error: string, request: IWebRequest) => void, onPartialLoad?: (data: string, request: IWebRequest) => void): IWebRequest;
	function callWebMethod(url: string, body: string, httpVerb: "GET", requestHeaders?: {[header: string]: string}, sync?: boolean, onSuccess?: (data: string, request: IWebRequest) => void, onFailure?: (error: string, request: IWebRequest) => void, onPartialLoad?: (data: string, request: IWebRequest) => void): IWebRequest;
	function callWebMethod(url: string, body: string, httpVerb: "POST", requestHeaders?: {[header: string]: string}, sync?: boolean, onSuccess?: (data: string, request: IWebRequest) => void, onFailure?: (error: string, request: IWebRequest) => void, onPartialLoad?: (data: string, request: IWebRequest) => void): IWebRequest;
	function callWebMethod(url: string, body: string, httpVerb: "PUT", requestHeaders?: {[header: string]: string}, sync?: boolean, onSuccess?: (data: string, request: IWebRequest) => void, onFailure?: (error: string, request: IWebRequest) => void, onPartialLoad?: (data: string, request: IWebRequest) => void): IWebRequest;
	function callWebMethod(url: string, body: string, httpVerb: "DELETE", requestHeaders?: {[header: string]: string}, sync?: boolean, onSuccess?: (data: string, request: IWebRequest) => void, onFailure?: (error: string, request: IWebRequest) => void, onPartialLoad?: (data: string, request: IWebRequest) => void): IWebRequest;

	function getRequest(url: string, onSuccess?: (data: string, request: IWebRequest) => void, onFailure?: (error: string, request: IWebRequest) => void, onPartialLoad?: (data: string, request: IWebRequest) => void): IWebRequest;
	function putRequest(url: string, body: string, mimeType?: string, onSuccess?: (data: string, request: IWebRequest) => void, onFailure?: (error: string, request: IWebRequest) => void, onPartialLoad?: (data: string, request: IWebRequest) => void): IWebRequest;
	function postRequest(url: string, body: string, mimeType?: string, onSuccess?: (data: string, request: IWebRequest) => void, onFailure?: (error: string, request: IWebRequest) => void, onPartialLoad?: (data: string, request: IWebRequest) => void): IWebRequest;
	function deleteRequest(url: string, onSuccess?: (data: string, request: IWebRequest) => void, onFailure?: (error: string, request: IWebRequest) => void, onPartialLoad?: (data: string, request: IWebRequest) => void): IWebRequest;
}