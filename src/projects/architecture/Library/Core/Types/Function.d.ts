declare module SDL.Client.Types.Function
{
	function timedProcessItems(items: any[], process: (item:any)=>void, completeCallback: (item:any[])=>void): void;
}