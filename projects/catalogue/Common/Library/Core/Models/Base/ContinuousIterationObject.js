/*! @namespace {SDL.Client.Models.Base.ContinuousIterationObject} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.Base.ContinuousIterationObject");
 
/**
 * Represents a Continuous Iteration object.
 * @namespace {SDL.Client.Models.Base}
 * @constructor
 * @param {String} parentId The parent item's Id    
 * @event update Fires when object is updated.
 * @event error Fires when object update failed.
 */
SDL.Client.Models.Base.ContinuousIterationObject.$constructor = function SDL$Client$Models$Base$ContinuousIterationObject$constructor(id)
{
	this.addInterface("SDL.Client.Models.MarshallableObject");

	var p = this.properties;
	p.id = id;
	p.operationId;
	p.active;
	p.toCancel;
	p.cancelled;
	p.timeout;
	p.itemsCount;
	p.itemsDoneCount;
	p.errorsCount;
	p.items;
	p.operation;
};

/**
 * Return iterations object id.
 * @return {String} The iterations object id.
 */
SDL.Client.Models.Base.ContinuousIterationObject.prototype.getId = function SDL$Client$Models$Base$ContinuousIterationObject$getId()
{
	return this.properties.id;
};

/**
 * Return the total operations count.
 * @return {Number} The total number of operations.
 */
SDL.Client.Models.Base.ContinuousIterationObject.prototype.getItemsCount = function SDL$Client$Models$Base$ContinuousIterationObject$getItemsCount()
{
	return this.properties.itemsCount;
};

/**
 * Return the operations done count.
 * @return {Number} The number of done operations.
 */
SDL.Client.Models.Base.ContinuousIterationObject.prototype.getItemsDoneCount = function SDL$Client$Models$Base$ContinuousIterationObject$getItemsDoneCount()
{
	return this.properties.itemsDoneCount;
};

/**
 * Return the operation errors count.
 * @return {Number} The number of errors.
 */
SDL.Client.Models.Base.ContinuousIterationObject.prototype.getErrorsCount = function SDL$Client$Models$Base$ContinuousIterationObject$getErrorsCount()
{
	return this.properties.errorsCount;
};

/**
 * Return the operation errors.
 * @return {Object} The errors list.
 */
SDL.Client.Models.Base.ContinuousIterationObject.prototype.getErrorDetails = function SDL$Client$Models$Base$ContinuousIterationObject$getErrorDetails()
{
};

/**
 * Indicates whether the operations is active or now.
 * @return {Boolean} <c>true</c> if the operation is active, otherwise <c>false</c>.
 */
SDL.Client.Models.Base.ContinuousIterationObject.prototype.isActive = function SDL$Client$Models$Base$ContinuousIterationObject$isActive()
{
	return this.properties.active || false;
};

/**
 * Stops iteration.
 */
SDL.Client.Models.Base.ContinuousIterationObject.prototype.stop = function SDL$Client$Models$Base$ContinuousIterationObject$stop()
{
	var p = this.properties;
	if (p.active && !p.cancelled)
	{
		if (p.operationId)
		{
			p.cancelled = true;
			p.toCancel = false;
			this._executeStopContinuousIteration(p.operationId, this.getDelegate(this._onUpdate), this.getDelegate(this._onError));
		}
		else
		{
			p.toCancel = true;
		}
	}
};

/**
 * Queries the iteration state.
 * @private
 */
SDL.Client.Models.Base.ContinuousIterationObject.prototype._queryState = function SDL$Client$Models$Base$ContinuousIterationObject$_queryState()
{
	var p = this.properties;
	if (p.active)
	{
		this._executeQueryContinuousIteration(p.operationId, this.getDelegate(this._onUpdate), this.getDelegate(this._onError));
	}
};

/**
 * Executes after the Iteration Item was updated.
 * @param {Object} result The update result.
 * @private
 */
SDL.Client.Models.Base.ContinuousIterationObject.prototype._onUpdate = function SDL$Client$Models$Base$ContinuousIterationObject$_onUpdate(result)
{
	this.fireEvent("update");
};

/**
 * Executes after this Item has failed iteration.
 * @param {Object} error The error.
 * @private
 */
SDL.Client.Models.Base.ContinuousIterationObject.prototype._onError = function SDL$Client$Models$Base$ContinuousIterationObject$_onError(error)
{
	var p = this.properties;
	p.active = false;
	SDL.Client.MessageCenter.registerError(error);
	this.fireEvent("error", { error: error });
};

/**
* Server call for stop Iteration item.
* @param {String} id The id of the Item to be loaded.
* @param {Function} success The callback to be caled on load success.
* @param {Function} failure the callback to be called on load failure.
*/
SDL.Client.Models.Base.ContinuousIterationObject.prototype._executeStopContinuousIteration = function SDL$Client$Models$Base$ContinuousIterationObject$_executeStopContinuousIteration(id, success, failure)
{
	SDL.Client.Diagnostics.Assert.raiseError("This method must be implemented in child implementations");
};

/**
* Server call for query Iteration item
* @param {String} id The id of the Item to be loaded.
* @param {Function} success The callback to be caled on load success.
* @param {Function} failure the callback to be called on load failure.
*/
SDL.Client.Models.Base.ContinuousIterationObject.prototype._executeQueryContinuousIteration = function SDL$Client$Models$Base$ContinuousIterationObject$_executeQueryContinuousIteration(id, success, failure)
{
	SDL.Client.Diagnostics.Assert.raiseError("This method must be implemented in child implementations");
};

// ------- SDL.Client.Models.MarshallableObject implementations/overrides
SDL.Client.Models.Base.ContinuousIterationObject.prototype.pack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$ContinuousIterationObject$pack()
{
	var p = this.properties;
	return {
		operationId: p.operationId,
		active: p.active,
		cancelled: p.cancelled,
		toCancel: p.toCancel,
		items: p.items,
		operation: p.operation
	};
});

SDL.Client.Models.Base.ContinuousIterationObject.prototype.unpack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$ContinuousIterationObject$unpack(data)
{
	if (data)
	{
		var p = this.properties;
		p.operationId = data.operationId;
		p.active = data.active;
		p.cancelled = data.cancelled;
		p.toCancel = data.toCancel;
		p.items = SDL.Client.Types.Array.clone(data.items);
		p.operation = data.operation;
	}
});
// ------- end of SDL.Client.Models.MarshallableObject overrides