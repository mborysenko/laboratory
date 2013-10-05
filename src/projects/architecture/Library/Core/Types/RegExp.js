/*! @namespace {SDL.Client.Types.RegExp} */
SDL.Client.Type.registerNamespace("SDL.Client.Types.RegExp");

SDL.Client.Types.RegExp.escape = function SDL$Client$Types$RegExp$escape(string)
{
	return string ? string.replace(/([\(\)\{\}\[\]\\\^\$\?\.\:\|\+\*])/g, "\\$1") : string;
};