Function.prototype.extend = function (superClass) {
	var mi = this;
	var F = function() {
		this.constructor = mi;
	};
	F.prototype = superClass.prototype;

	this.prototype = new F();
	this.prototype.constructor = this;
	this.superclass = superClass.prototype;
	if(superClass.prototype.constructor == Object.prototype.constructor) {
		superClass.prototype.constructor = superClass;
	}

	return this;
};

Function.prototype.augment = function (givingClass) {
	if(arguments[2]) { // Only give certain methods.
		for(var i = 2, len = arguments.length; i < len; i++) {
			this.prototype[arguments[i]] = givingClass.prototype[arguments[i]];
		}
	}
	else { // Give all methods.
		for(var methodName in givingClass.prototype) {
			if(!this.prototype[methodName]) {
				this.prototype[methodName] = givingClass.prototype[methodName];
			}
		}
	}

	return this;
};
