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

	function callWebMethod(url: string, body: string, httpVerb: string, mimeType: string, sync: boolean, onSuccess: (data: string, request?: IWebRequest) => void, onFailure: (error: string) => void);
	function getRequest(url: string, onSuccess: (data: string, request?: IWebRequest) => void, onFailure: (error: string) => void);
	function putRequest(url: string, body: string, mimeType: string, onSuccess: (data: string, request?: IWebRequest) => void, onFailure: (error: string) => void);
	function postRequest(url: string, body: string, mimeType: string, onSuccess: (data: string, request?: IWebRequest) => void, onFailure: (error: string) => void);
	function deleteRequest(url: string, onSuccess: (data: string, request?: IWebRequest) => void, onFailure: (error: string) => void);
}