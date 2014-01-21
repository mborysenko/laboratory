declare module SDL.Client.Net
{
	export interface IWebRequest
		{
			xmlHttp: any;
			url: string;
			body: string;
			httpVerb: string;
			responseText: string;
			requestContentType: string;
			responseContentType: string;
			hasError: string;
			statusCode: number;
			statusText: string;
		}

	function callWebMethod(url: string, body: string, httpVerb: string, mimeType: string, sync: boolean, onSuccess: (data: string, request: IWebRequest) => void, onFailure: (error: string, request: IWebRequest) => void): IWebRequest;
	function getRequest(url: string, onSuccess: (data: string, request: IWebRequest) => void, onFailure: (error: string, request: IWebRequest) => void): IWebRequest;
	function putRequest(url: string, body: string, mimeType: string, onSuccess: (data: string, request: IWebRequest) => void, onFailure: (error: string, request: IWebRequest) => void): IWebRequest;
	function postRequest(url: string, body: string, mimeType: string, onSuccess: (data: string, request: IWebRequest) => void, onFailure: (error: string, request: IWebRequest) => void): IWebRequest;
	function deleteRequest(url: string, onSuccess: (data: string, request: IWebRequest) => void, onFailure: (error: string, request: IWebRequest) => void): IWebRequest;
}