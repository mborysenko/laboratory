/**
 *	implemented in SDL.Client.HostedApplication, copied to SDL.Client.Core
**/
module SDL.Client.Types.Url
{
	export function isSameDomain(url1: string, url2: string)
	{
		if (url1 && url2)
		{
			var m1 = url1.toLowerCase().match(/^(https?):\/{2,}([^\/:]+)(:(\d+))?/);
			var m2 = url2.toLowerCase().match(/^(https?):\/{2,}([^\/:]+)(:(\d+))?/);
			if (m1 && m2)
			{
				return (
					m1[1] == m2[1] &&
					m1[2] == m2[2] &&
					(
						m1[4] == m2[4] ||
						(m1[4] == null && m2[4] == (m2[1] == "http" ? "80" : "443")) ||
						(m2[4] == null && m1[4] == (m1[1] == "http" ? "80" : "443"))
					)
				);
			}
		}
		return false;
	}

	export function getDomain(url: string): string
	{
		if (url != null)
		{
			var m = url.toString().match(/^[\w]+:\/{2,}[^\/?#]*/);
			return m ? m[0] : "";
		}
	};
}