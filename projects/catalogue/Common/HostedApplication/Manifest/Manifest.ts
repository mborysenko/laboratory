if (parent && parent != window)
{
	var x: XMLHttpRequest = new XMLHttpRequest();
	x.onreadystatechange = function()
	{
		if (x.readyState == 4)
		{
			var statusCode: number = x.status;
			if (statusCode < 200 || statusCode >= 300)
			{
				var error: string;
				try
				{
					error = x.statusText;
				}
				catch (err)
				{ }
				throw Error(error || x.responseText);
			}

			parent.postMessage("sdl:" + JSON.stringify({method: "SDL.Client.ApplicationHost.ApplicationManifestReceiver.registerApplication",
							args: [x.responseText]}), "*");
		}
	};
	x.open("GET", "manifest.xml?" + location.hash.slice(3), true);
	x.send();
}