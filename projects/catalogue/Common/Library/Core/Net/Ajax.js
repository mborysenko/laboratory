/*! @namespace {SDL.Client.Net} */
SDL.Client.Type.registerNamespace("SDL.Client.Net");

SDL.Client.Net.WebRequest = function SDL$Client$Net$WebRequest()
{
	this.xmlHttp;
	this.url;
	this.body;
	this.httpVerb;
	this.invokeCalled;
	this.isRetry;
	this.responseText;
	this.requestHeaders;
	this.responseContentType;
	this.hasError;
	this.statusCode;
	this.statusText;
	this.onComplete;
	this.onPartialLoad;
	this.webRequest = SDL.Client.Net.WebRequest;
};

SDL.Client.Net.WebRequest.prototype =
{
	invoke: function SDL$Client$Net$WebRequest$invoke()
	{
		if (!this.invokeCalled)
		{
			this.invokeCalled = true;

			if (window.XMLHttpRequest)
			{
				this.xmlHttp = new window.XMLHttpRequest();
			}
      
			if (!this.synchronous)		// IE will call onreadystatechange even for synchronous calls, but FF doesn't seem to do this
			{
				this.xmlHttp.onreadystatechange = SDL.jQuery.proxy(this.completed, this);
			}

			this.responseText = null;
			this.responseContentType = null;
			this.statusCode = 0;
			this.statusText = "";
			this.hasError = false;

			try
			{
				this.xmlHttp.open(this.httpVerb, this.url, !this.synchronous);
			}
			catch (err)
			{
				this.hasError = true;
				this.statusText = err.message;
				this.completed();
			}

			if (!this.hasError)
			{
				var isSetContentType = false;
				if (this.requestHeaders)
				{
					for (var header in this.requestHeaders)
					{
						isSetContentType = isSetContentType || (header.toLowerCase() == "content-type");
						this.xmlHttp.setRequestHeader(header, this.requestHeaders[header]);
					}
				}

				if (SDL.Client.Net.WebRequest.csrfTokenHeaderName === undefined)
				{
					SDL.Client.Net.WebRequest.csrfTokenHeaderName = SDL.Client.Configuration.ConfigurationManager.getAppSetting("antiCsrfTokenHttpHeaderName") || null;
				}

				if (SDL.Client.Net.WebRequest.csrfTokenHeaderName)
				{
					var header;
					if (document.cookie)
					{
						if (SDL.Client.Net.WebRequest.csrfTokenCookieName === undefined)
						{
							SDL.Client.Net.WebRequest.csrfTokenCookieName = SDL.Client.Configuration.ConfigurationManager.getAppSetting("antiCsrfTokenCookieName") || null;
						}

						if (SDL.Client.Net.WebRequest.csrfTokenCookieName)
						{
							var regEx = new RegExp("(^\\s*|;\\s*)" + SDL.Client.Types.RegExp.escape(SDL.Client.Net.WebRequest.csrfTokenCookieName) + "=([^;]*)(;|$)", "i");
							var m = document.cookie.match(regEx);
							if (m)
							{
								header = m[2];
							}
						}
					}
					this.xmlHttp.setRequestHeader(SDL.Client.Net.WebRequest.csrfTokenHeaderName, header || (new Date()).getTime());
				}

				if (isSetContentType)
				{
					if (this.xmlHttp.sendAsBinary)
					{
						// .send() adds "; charset=UTF-8" to Content-Type header in FF, .sendAsBinary() doesn't
						this.xmlHttp.sendAsBinary(SDL.Client.Types.String.utf8encode(this.body));
					}
					else
					{
						this.xmlHttp.send(this.body);
					}
				}
				else
				{
					this.xmlHttp.send(this.body);
				}

				if (this.synchronous)		// IE will call onreadystatechange even for synchronous calls, but FF doesn't seem to do this -> call it explicitly
				{
					this.completed();
				}
			}
			return this;
		}
	},
	completed: function SDL$Client$Net$WebRequest$completed()
	{
		if (typeof SDL != "undefined")	// sometimes breaks (in IE9) after iframe has been unloaded
		{
			if (this.onPartialLoad && this.xmlHttp && this.xmlHttp.readyState == 3)
			{
				this.onPartialLoad(this);
			}
			else if (this.hasError || (this.xmlHttp && this.xmlHttp.readyState == 4))
			{
				var xmlHttp = this.xmlHttp;

				if (!this.synchronous)
				{
					xmlHttp.onreadystatechange = SDL.jQuery.noop;
				}

				if (!this.hasError)
				{
					var statusCode = this.statusCode = xmlHttp.status;

					if (statusCode == 409 &&	// anti CSRF filters will return http code 409 in case of invalid headers
						!this.isRetry && SDL.Client.Net.WebRequest.csrfTokenHeaderName && document.cookie)
					{
						//probably failed the anti CSRF filter, try again with the new token
						this.invokeCalled = false;
						this.isRetry = true;
						this.invoke();
					}
					else
					{
						this.responseContentType = xmlHttp.getResponseHeader("Content-Type");
						try
						{
							this.statusText = xmlHttp.statusText;
						}
						catch (err)
						{
							// fails in FF sometimes
							this.statusText = "";
						}
						this.hasError = (statusCode < 200 || statusCode >= 300 || xmlHttp.getResponseHeader("jsonerror") == "true");
						this.responseText = xmlHttp.responseText;

						if (this.onComplete)
						{
							this.onComplete(this);
						}

						this.xmlHttp = null;
					}
				}
			}
		}
	}
};

SDL.Client.Net.callWebMethod = function SDL$Client$Net$callWebMethod(url, body, httpVerb, requestHeaders, sync, onSuccess, onFailure, onPartialLoad)
{
	if (typeof SDL != "undefined")	// sometimes breaks (in IE9) after iframe has been unloaded
	{
		function SDL$Client$Net$callWebMethod$onComplete(request) 
		{
			if (request.hasError)
			{
				var error = "\"" + url + "\" failed to load (" + request.statusCode + "):" + request.statusText;
				if (onFailure)
				{
					onFailure(error, request);
				}
				else
				{
					SDL.Client.Diagnostics.Assert.raiseError(error);
				}
			}
			else if (onSuccess)
			{
				onSuccess(request.responseText, request);
			}
		};

		var request = new SDL.Client.Net.WebRequest();
		request.url = url;
		request.body = body || "";
		request.httpVerb = httpVerb;
		request.requestHeaders = requestHeaders;
		request.synchronous = sync;
		request.onComplete = SDL$Client$Net$callWebMethod$onComplete;
		request.onPartialLoad = onPartialLoad;
		request.invoke();

		return request;
	}
};

SDL.Client.Net.getRequest = function SDL$Client$Net$getRequest(url, onSuccess, onFailure, onPartialLoad)
{
	return this.callWebMethod(url, "", "GET", null, false, onSuccess, onFailure, onPartialLoad);
};

SDL.Client.Net.putRequest = function SDL$Client$Net$putRequest(url, body, mimeType, onSuccess, onFailure, onPartialLoad)
{
	var headers;
	if (mimeType)
	{
		headers = {"Content-Type": mimeType};
	}

	return this.callWebMethod(url, body, "PUT", headers, false, onSuccess, onFailure, onPartialLoad);
};

SDL.Client.Net.postRequest = function SDL$Client$Net$postRequest(url, body, mimeType, onSuccess, onFailure, onPartialLoad)
{
	var headers;
	if (mimeType)
	{
		headers = {"Content-Type": mimeType};
	}

	return this.callWebMethod(url, body, "POST", headers, false, onSuccess, onFailure, onPartialLoad);
};

SDL.Client.Net.deleteRequest = function SDL$Client$Net$deleteRequest(url, onSuccess, onFailure, onPartialLoad)
{
	return this.callWebMethod(url, "", "DELETE", null, false, onSuccess, onFailure, onPartialLoad);
};