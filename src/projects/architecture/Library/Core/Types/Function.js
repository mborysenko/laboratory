/*! @namespace {SDL.Client.Types.Function} */
SDL.Client.Type.registerNamespace("SDL.Client.Types.Function");

/*
	This function is useful when many items have to be processed in a loop, which might take long time to complete
	The UI would become unresponsive and browsers might report a long-running script warning
*/
SDL.Client.Types.Function.timedProcessItems = function SDL$Client$Types$Function$timedProcessItems(items, process, completeCallback)
{
	var todo = items.concat();   //create a clone of the original

	setTimeout(function()
	{
		var start = +new Date();
		do
		{
			process(todo.shift());
		}
		while (todo.length > 0 && (+new Date() - start < 100));
			
		if (todo.length > 0)
		{
			setTimeout(arguments.callee, 0);
		} 
		else
		{
			completeCallback(items);
		}
	}, 0);
};