/*! @namespace {SDL.Client.Models.Base.VersionableItem} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.Base.VersionableItem");

/*
	Base implementation of an item with versioning (can check-out, check-in and undo check-out).
*/
SDL.Client.Models.Base.VersionableItem.$constructor = function SDL$Client$Models$Base$VersionableItem$constructor(id)
{
	this.addInterface("SDL.Client.Models.Base.EditableItem", [id]);

	var p = this.properties;
	p.checkingOut;
	p.cancelingCheckOut;
	p.checkingIn;

	p.canCheckOut;
	p.canCheckIn;
	p.canCancelCheckOut;
};

SDL.Client.Models.Base.VersionableItem.prototype.invalidateInterfaceCachedState = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$VersionableItem$invalidateInterfaceCachedState()
{
	var p = this.properties;
	p.canCheckOut =
	p.canCheckIn =
	p.canCancelCheckOut = undefined;
});

SDL.Client.Models.Base.VersionableItem.prototype.canCheckOut = function SDL$Client$Models$Base$VersionableItem$canCheckOut()
{
	return this.properties.canCheckOut;
};

SDL.Client.Models.Base.VersionableItem.prototype.canCheckIn = function SDL$Client$Models$Base$VersionableItem$canCheckIn()
{
	return this.properties.canCheckIn;
};

SDL.Client.Models.Base.VersionableItem.prototype.canCancelCheckOut = function SDL$Client$Models$Base$VersionableItem$canCancelCheckOut()
{
	return this.properties.canCancelCheckOut;
};

SDL.Client.Models.Base.VersionableItem.prototype.save = function SDL$Client$Models$Base$VersionableItem$save(doneEditing)
{
	if (doneEditing && !this.isCheckingIn())
	{
		if (this.canSave())
		{
			this._setCheckingIn();
			return this.callBase("SDL.Client.Models.Base.EditableItem", "save");
		}
		else
		{
			return this.checkIn();
		}
	}
	else
	{
		return this.callBase("SDL.Client.Models.Base.EditableItem", "save");
	}
};

SDL.Client.Models.Base.VersionableItem.prototype.isCheckedOut = function SDL$Client$Models$Base$VersionableItem$isCheckedOut()
{
	return (this.isLoaded() || undefined) && !this.canCheckOut() && (this.canCheckIn() || this.canCancelCheckOut());
};

SDL.Client.Models.Base.VersionableItem.prototype.isCheckingOut = function SDL$Client$Models$Base$VersionableItem$isCheckingOut()
{
	return this.properties.checkingOut;
};

SDL.Client.Models.Base.VersionableItem.prototype._setCheckingOut = function SDL$Client$Models$Base$VersionableItem$_setCheckingOut()
{
	this.properties.checkingOut = true;
	this.fireEvent("checkingout");
};

SDL.Client.Models.Base.VersionableItem.prototype._setCheckedOut = function SDL$Client$Models$Base$VersionableItem$_setCheckedOut()
{
	this.properties.checkingOut = false;
	this.fireEvent("checkout");
};

SDL.Client.Models.Base.VersionableItem.prototype._setCheckOutFailed = function SDL$Client$Models$Base$VersionableItem$_setCheckOutFailed(error, webRequest)
{
	this.properties.checkingOut = false;
	this.fireEvent("checkoutfailed", {error: error, errorCode: webRequest ? webRequest.statusCode : null});
};

SDL.Client.Models.Base.VersionableItem.prototype.checkOut = function SDL$Client$Models$Base$VersionableItem$checkOut()
{
	if (!this.isCheckedOut())
	{
		if (!this.isCheckingOut())
		{
			this._setCheckingOut();
			this._setLoading();
			this._executeCheckOut();
		}
		return true;
	}
	else
	{
		return false;
	}
};

SDL.Client.Models.Base.VersionableItem.prototype._executeCheckOut = function SDL$Client$Models$Base$VersionableItem$_executeCheckOut()
{
	this._onLoad();	// to be overridden
};

SDL.Client.Models.Base.VersionableItem.prototype.isCancelingCheckOut = function SDL$Client$Models$Base$VersionableItem$isCancelingCheckOut()
{
	return this.properties.cancelingCheckOut;
};

SDL.Client.Models.Base.VersionableItem.prototype._setCancelingCheckOut = function SDL$Client$Models$Base$VersionableItem$_setCancelingCheckOut()
{
	this.properties.cancelingCheckOut = true;
	this.fireEvent("cancelingcheckout");
};

SDL.Client.Models.Base.VersionableItem.prototype._setCanceledCheckOut = function SDL$Client$Models$Base$VersionableItem$_setCanceledCheckOut()
{
	this.properties.cancelingCheckOut = false;
	this.fireEvent("cancelcheckout");
};

SDL.Client.Models.Base.VersionableItem.prototype._setCancelCheckOutFailed = function SDL$Client$Models$Base$VersionableItem$_setCancelCheckOutFailed(error, webRequest)
{
	this.properties.cancelingCheckOut = false;
	this.fireEvent("cancelcheckoutfailed", {error: error, errorCode: webRequest ? webRequest.statusCode : null});
};


SDL.Client.Models.Base.VersionableItem.prototype.cancelCheckOut = function SDL$Client$Models$Base$VersionableItem$cancelCheckOut()
{
	if (!this.isCheckingIn() && this.canCancelCheckOut() != false)
	{
		if (!this.isCancelingCheckOut())
		{
			this._setCancelingCheckOut();
			if (this.properties.cancelingCheckOut) {
			  this._setLoading();
			  this._executeCancelCheckOut();
			} else {
			  return false;
			}
		}
		return true;
	}
	else
	{
		return false;
	}
};

SDL.Client.Models.Base.VersionableItem.prototype._executeCancelCheckOut = function SDL$Client$Models$Base$VersionableItem$_executeCancelCheckOut()
{
	this._onLoad();	// to be overridden
};

SDL.Client.Models.Base.VersionableItem.prototype.isCheckingIn = function SDL$Client$Models$Base$VersionableItem$isCheckingIn()
{
	return this.properties.checkingIn;
};

SDL.Client.Models.Base.VersionableItem.prototype._setCheckingIn = function SDL$Client$Models$Base$VersionableItem$_setCheckingIn()
{
	this.properties.checkingIn = true;
	this.fireEvent("checkingin");
};

SDL.Client.Models.Base.VersionableItem.prototype._setCheckedIn = function SDL$Client$Models$Base$VersionableItem$_setCheckedIn()
{
	this.properties.checkingIn = false;
	this.fireEvent("checkin");
};

SDL.Client.Models.Base.VersionableItem.prototype._setCheckInFailed = function SDL$Client$Models$Base$VersionableItem$_setCheckInFailed(error, webRequest)
{
	this.properties.checkingIn = false;
	this.fireEvent("checkinfailed", {error: error, errorCode: webRequest ? webRequest.statusCode : null});
};


SDL.Client.Models.Base.VersionableItem.prototype.checkIn = function SDL$Client$Models$Base$VersionableItem$checkIn()
{
	if (!this.isCancelingCheckOut() && this.canCheckIn() != false)
	{
		if (!this.isCheckingIn())
		{
			this._setCheckingIn();
			this._setLoading();
			this._executeCheckIn();
		}
		return true;
	}
	else
	{
		return false;
	}
};

SDL.Client.Models.Base.VersionableItem.prototype._executeCheckIn = function SDL$Client$Models$Base$VersionableItem$_executeCheckIn()
{
	this._onLoad();	// to be overridden
};

SDL.Client.Models.Base.VersionableItem.prototype.afterSetLoaded = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$VersionableItem$afterSetLoaded()
{
	if (this.isCheckingOut())
	{
		this._setCheckedOut();
	}
	if (this.isCancelingCheckOut())
	{
		this._setCanceledCheckOut();
	}
	if (this.isCheckingIn())
	{
		this._setCheckedIn();
	}
});

SDL.Client.Models.Base.VersionableItem.prototype.afterLoadFailed = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$VersionableItem$afterLoadFailed(error, webRequest)
{
	if (this.isCheckingOut())
	{
		this._setCheckOutFailed(error, webRequest);
	}
	if (this.isCancelingCheckOut())
	{
		this._setCancelCheckOutFailed(error, webRequest);
	}
	if (this.isCheckingIn())
	{
		this._setCheckInFailed(error, webRequest);
	}
});

// ------- SDL.Client.Models.MarshallableObject implementations/overrides
SDL.Client.Models.Base.VersionableItem.prototype.pack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$VersionableItem$pack()
{
	var p = this.properties;
	return {
		checkingOut: p.checkingOut,
		cancelingCheckOut: p.cancelingCheckOut,
		checkingOut: p.checkingOut,
		canCheckOut: p.canCheckOut,
		canCheckIn: p.canCheckIn,
		canCancelCheckOut: p.canCancelCheckOut
	};
});

SDL.Client.Models.Base.VersionableItem.prototype.unpack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$VersionableItem$unpack(data)
{
	if (data)
	{
		var p = this.properties;
		p.checkingOut = data.checkingOut;
		p.cancelingCheckOut = data.cancelingCheckOut;
		p.checkingOut = data.checkingOut;
		p.canCheckOut = data.canCheckOut;
		p.canCheckIn = data.canCheckIn;
		p.canCancelCheckOut = data.canCancelCheckOut;
	}
});

SDL.Client.Models.Base.VersionableItem.prototype._initializeMarshalledObject = function SDL$Client$Models$Base$VersionableItem$_initializeMarshalledObject(object)
{
	var p = this.properties;
	if (p.checkingOut || p.cancelingCheckOut || p.checkingIn)
	{
		p.loading = false;	// this is to prevent SDL.LoadableObject to load data, checkOut() will load data too
	}

	if (this.callBase("SDL.Client.Models.Base.EditableItem", "_initializeMarshalledObject", [object]))
	{
		if (p.checkingOut)
		{
			p.checkingOut = false;
			this.checkOut();
		}
		else if (p.cancelingCheckOut)
		{
			p.cancelingCheckOut = false;
			this.cancelCheckOut();
		}
		else if (p.checkingIn)
		{
			p.checkingIn = false;
			this.checkIn();
		}
		return true;
	}
};

// ------- end of SDL.Client.Models.MarshallableObject overrides
