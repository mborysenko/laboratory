/*! @namespace {SDL.Client.Types.OO} */
SDL.Client.Type.registerNamespace("SDL.Client.Types.OO");

// TypeScript's implementation of inheritance conflicts with SDL.Client.Types.OO inheritance (i.e. implementingInterface property)
// override for TypeScript's implementation of inheritance call [eval(SDL.Client.Types.OO.enableCustomInheritance);] in module's local scope
SDL.Client.Types.OO.enableCustomInheritance = "var __extends = SDL.jQuery.noop;";

SDL.Client.Types.OO.Inheritable = function SDL$Client$Types$OO$Inheritable()
{
	// this is a class that will never be instantiated, it's needed to be able to inherit from TypeScript
};

SDL.Client.Types.OO.createInterface = function SDL$Client$Types$OO$createInterface(interfaceName, implementation)
{
	SDL.Client.Type.registerNamespace(interfaceName);
	result = SDL.Client.Types.OO._generateConstructor(interfaceName || "");

	if (implementation)
	{
		SDL.jQuery.extend(result, implementation);		// copy all static members to the new constructor
		result.prototype = implementation.prototype;	// including 'prototype'
		result.$constructor = implementation;			// copy the provided class constructor to $constructor method
	}

	return result;
};

SDL.Client.Types.OO._generateConstructor = function SDL$Client$Types$OO$_generateConstructor()
{
	if (arguments[0])
	{
		// using eval to give a name to the function
		// not defining argument names nor local variables to prevent name conflicts to make sure the function name becomes global
		return window.eval(arguments[0] + "= function " + arguments[0].replace(/\./g, "$") +
			"() { return SDL.Client.Types.OO.enableInterface(this, \"" + arguments[0] + "\", arguments); }");
	}
	else
	{
		return function()
		{
			return SDL.Client.Types.OO.enableInterface(this, "", arguments);
		};
	}
};

SDL.Client.Types.OO.extendInterface = function SDL$Client$Types$OO$extendInterface(baseInterfaceName, newInterfaceName)
{
	if (!this.extendedInterfaces) this.extendedInterfaces = {};
	if (!this.extendedInterfaces[baseInterfaceName])
	{
		this.extendedInterfaces[baseInterfaceName] = [newInterfaceName];
	}
	else
	{
		this.extendedInterfaces[baseInterfaceName].push(newInterfaceName);
	}
};

SDL.Client.Types.OO.implementsInterface = function SDL$Client$Types$OO$implementsInterface(object, interfaceName)
{
	return (object && interfaceName && (interfaceName in (object.interfaces || {})));
};

SDL.Client.Types.OO.importObject = function SDL$Client$Types$OO$importObject(object)
{
	var typeOfObject = (typeof(object)).toLowerCase();

	if (typeOfObject == "number" || typeOfObject == "string" || typeOfObject == "boolean")
	{
		return object;
	}
	else
	{
		var typeName;
		if (SDL.Client.Types.OO.implementsInterface(object, "SDL.Client.Models.MarshallableObject") && (typeName = object.getTypeName()))
		{
			// make sure all 'upgrade' interfaces are added too
			var baseInterfaceName = typeName;
			var ifaces = object.interfaces;
			var upgradedInterface = ifaces[baseInterfaceName].defaultBase;
			while (upgradedInterface && ifaces[upgradedInterface].upgradedToType)
			{
				baseInterfaceName = upgradedInterface;
				upgradedInterface = ifaces[baseInterfaceName].defaultBase;
			}

			var typeConstructor = SDL.Client.Types.OO.resolveInterface(baseInterfaceName);
			SDL.Client.Diagnostics.Assert.isFunction(typeConstructor, baseInterfaceName + " should be a constructor.");
			var newObject = new typeConstructor();
			
			if (baseInterfaceName != typeName)	// interface has been upgraded -> upgrade too
			{
				var upgradeType = ifaces[baseInterfaceName].upgradedToType;
				while (upgradeType)
				{
					if (!newObject.interfaces[upgradeType])
					{
						newObject = newObject.upgradeToType(upgradeType);
					}
					upgradeType = ifaces[upgradeType].upgradedToType;
				}
			}

			newObject._initializeMarshalledObject(object);
			object.dispose();
			return newObject;
		}
		else
		{
			if (SDL.Client.Types.OO.implementsInterface(object, "SDL.Client.Types.DisposableObject"))
			{
				object.dispose();
			}
			return null;
		}
	}
};

SDL.Client.Types.OO.executeBase = function SDL$Client$Types$OO$executeBase(interfaceName, object, args)
{
	var caller = arguments.callee.caller;
	var $execute;
	var extensions = SDL.Client.Types.OO.extendedInterfaces && SDL.Client.Types.OO.extendedInterfaces[interfaceName];
	if (extensions)
	{
		for (var i = 0, len = extensions.length; i < len; i++)
		{
			var extension = SDL.Client.Types.OO.resolveInterface(extensions[i]);
			if (!extension)
			{
				throw Error("Unable to upgrade to type \"" + extensions[i] + "\". Type is not defined!");
			}
			
			var execute = extension.$execute;
			if (execute)
			{
				if (execute == caller)
				{
					break;
				}
				$execute = execute;
			}
		}
	}

	if (!$execute)	// no extension ovewrites the $execute method -> call the base
	{
		var base = SDL.Client.Types.OO.resolveInterface(interfaceName);
		if (!base)
		{
			throw Error("Unable to call base constructor: \"" + extensions[i] + "\" is not defined!");
		}
		$execute = base.$execute || base.$constructor;
	}

	if ($execute)
	{
		return $execute.apply(object, args || []);
	}
};

SDL.Client.Types.OO.nonInheritable = function SDL$Client$Types$OO$nonInheritable(member)
{
	member.noninheritable = true;
	return member;
};

(function()
{
	var namespaces = {};
	SDL.Client.Types.OO.resolveInterface = function SDL$Client$Types$OO$resolveInterface(namespace)
	{
		return (namespace in namespaces) ? namespaces[namespace] : (namespaces[namespace] = SDL.Client.Type.resolveNamespace(namespace));
	};
})();

(function()
{
	SDL.Client.Types.OO.enableInterface = function SDL$Client$Types$OO$enableInterface(object, interfaceName, args)
	{
		var iface = SDL.Client.Types.OO.resolveInterface(interfaceName);	// arguments.callee.caller <-- seems to be very slow in FF
		var isMainInterface = !object.interfaces;

		if (isMainInterface)
		{
			if (!(object instanceof iface))
			{
				// not called with 'new' -> call $constructor
				return this.executeBase(interfaceName, object, args);
			}

			var m = object.prototypeMembers = {};
			for (var p in object) //make sure we preserve members defined with prototype when adding interfaces
			{
				m[p] = true;
			}
			object.interfaces = { type:interfaceName };
			object.properties = { delegates:[] };
		}
		else if (object.addInterface == addInterface)	// .addInterface should not be defined yet -> superclass constructor must have not been called using addInterface
		{
			// if (arguments.callee.caller.caller != addInterface)
			return object.addInterface(interfaceName, args || []);
		}
		else if (interfaceName in object.interfaces)
		{
			return false;
		}

		object.addInterface = addInterface;
		object.upgradeToType = upgradeToType;
		object.getTypeName = getTypeName;
		object.getInterface = getInterface;
		object.getInterfaceNames = getInterfaceNames;
		object.getMainInterface = getMainInterface;
		object.getDelegate = getDelegate;
		object.removeDelegate = removeDelegate;
		object.callInterfaces = callInterfaces;
		object.callBase = callBase;

		object.interfaces[interfaceName] = object;

		if (iface.$constructor)
		{
			iface.$constructor.apply(object, args || []);
		}

		if (!object.$initialize)
		{
			object.$initialize = function() {};
		}

		var extensions = SDL.Client.Types.OO.extendedInterfaces && SDL.Client.Types.OO.extendedInterfaces[interfaceName];
		if (extensions)
		{
			for (var i = 0; i < extensions.length; i++)
			{
				object = object.upgradeToType(extensions[i], args, interfaceName);
			}
		}

		if (isMainInterface)
		{
			object.$initialize();
		}

		return object;
	};

	var addInterface = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Types$OO$addInterface(interfaceName, args)
	{
		var object = this;
		var iface = object.interfaces[interfaceName];
		if (!iface)
		{
			var constructor = SDL.Client.Types.OO.resolveInterface(interfaceName);

			if (!constructor)
			{
				SDL.Client.Diagnostics.Assert.raiseError("Unable to inherit from \"" + interfaceName + "\": constructor is not defined.");
			}
			else
			{
				// not using an ordinary object creation with a constructor as we need to have
				// "interfaces" property set before running the constructor
				iface = {};
				iface.interfaces = object.interfaces;
				iface.properties = object.properties;
				iface.prototypeMembers = {};

				var m = iface.prototypeMembers;
				var p = constructor.prototype;

				if (p)
				{
					for (var prop in p)
					{
						iface[prop] = p[prop];
						m[prop] = true;
					}
				}
				constructor.apply(iface, args || []);
			}
		}

		while (iface.upgradedToType)
		{
			interfaceName = iface.upgradedToType;
			iface = object.interfaces[interfaceName];
		}

		delete iface["prototypeMembers"];
		for (var member in iface)
		{
			switch (member)
			{
				case "interfaces":
				case "properties":
					// these properties are already added
					break;
				case "upgradedToType":
				case "$constructor":
					// these properties should not be inherited
					break;
				default:
					var value = iface[member];
					if (value && !value.noninheritable)
					{
						if (!(member in object.prototypeMembers))
						{
							object[member] = value;
						}

						if (!value.implementingInterface)
						{
							value.implementingInterface = interfaceName;
						}
					}
			}
		}

		object.defaultBase = interfaceName;
	});
	var upgradeToType = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Types$OO$upgradeToType(interfaceName, args, typeToExtend)
	{
		var object = this;
		var interfaces = object.interfaces;
		var iface = interfaces[interfaceName];
		if (!iface)
		{
			var constructor = SDL.Client.Types.OO.resolveInterface(interfaceName);
			if (!constructor)
			{
				throw Error("Unable to upgrade to type \"" + interfaceName + "\". Constructor is not defined!");
			}
			else
			{
				var baseType;

				while (typeToExtend && interfaces[typeToExtend].upgradedToType)
				{
					typeToExtend = interfaces[typeToExtend].upgradedToType;
				}

				if (!typeToExtend || interfaces.type == typeToExtend)
				{
					baseType = interfaces.type;
					interfaces.type = interfaceName;
				}
				else
				{
					baseType = typeToExtend;
				}

				// not using an ordinary object creation with a constructor as we need to have "interfaces" property set before running the constructor
				iface = { "interfaces": interfaces, "properties": object.properties };
				var m = iface.prototypeMembers = {};
				var p = constructor.prototype;
				if (p)
				{
					for (var prop in p)
					{
						iface[prop] = p[prop];
						m[prop] = true;
					}
				}
				constructor.apply(iface, args || []);

				while (iface.upgradedToType)
				{
					interfaceName = iface.upgradedToType;
					iface = object.interfaces[interfaceName];
				}
				
				if (iface.defaultBase != baseType)
				{
					var baseUpgradedToType = interfaces[baseType].upgradedToType;
					while (baseUpgradedToType && baseUpgradedToType != iface.defaultBase)
					{
						baseUpgradedToType = interfaces[baseUpgradedToType].upgradedToType;
					}

					if (!baseUpgradedToType)
					{
						SDL.Client.Diagnostics.Assert.raiseError("Unable to upgrade \"" + baseType + "\" to \"" + interfaceName + "\". Interface \"" + baseType + "\" or its upgraded interface must be the default interface for \"" + interfaceName + "\".");
					}

					delete object["prototypeMembers"];
					for (var member in object)
					{
						switch (member)
						{
							case "interfaces":
							case "properties":
								// these properties are already added
								break;
							case "upgradedToType":
							case "$constructor":
								// these properties should not be inherited
								break;
							default:
								var value = object[member];
								if (value && !value.noninheritable)
								{
									if (!(member in iface))
									{
										iface[member] = value;
									}

									if (!value.implementingInterface)
									{
										value.implementingInterface = baseUpgradedToType;
									}
								}
						}
					}
				}

				object.upgradedToType = interfaceName;
				delete iface["prototypeMembers"];
			}
		}
		else
		{
			SDL.Client.Diagnostics.Assert.raiseError("Unable to upgrade \"" + baseType + "\" to \"" + interfaceName + "\". Interface \"" + baseType + "\" already implements \"" + interfaceName + "\".");
		}
		return iface;
	});
	var getTypeName = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Types$OO$getTypeName()
	{
		var interfaces = this.interfaces;
		return interfaces ? interfaces.type : undefined;
	});
	var getInterface = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Types$OO$getInterface(interfaceName)
	{
		var object = this;
		if (interfaceName in object.interfaces)
		{
			return object.interfaces[interfaceName];
		}
		else
		{
			throw Error("Object does not implement interface " + interfaceName + ".");
		}
	});
	var getInterfaceNames = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Types$OO$getInterfaceNames()
	{
		var object = this;
		var interfaces = [];
		for (var i in object.interfaces)
		{
			if (i != "type")
			{
				interfaces.push(i);
			}
		}
		return interfaces;
	});
	var getMainInterface = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Types$OO$getMainInterface()
	{
		var interfaces = this.interfaces;
		return interfaces[interfaces.type];
	});
	var getDelegate = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Types$OO$getDelegate(method)
	{
		var delegates = this.properties.delegates;
		if (delegates)
		{
			var delegate;
			for (var i = 0, len = delegates.length; i < len; i++)
			{
				delegate = delegates[i];
				if (delegate.method == method)
				{
					return delegate.delegate;
				}
			}

			delegate = SDL.jQuery.proxy(method, this.getMainInterface());
			delegates.push({method: method, delegate: delegate});
			return delegate;
		}
	});
	var removeDelegate = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Types$OO$removeDelegate(method)
	{
		var delegates = this.properties.delegates;
		if (delegates)
		{
			var delegate;
			for (var i = 0; i < delegates.length; i++)
			{
				if (delegate.method == method)
				{
					delegate = delegates[i].delegate;
					SDL.Client.Types.Array.removeAt(delegates, i);
					return delegate;
				}
			}
			return;
		}
	});
	var callInterfaces = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Types$OO$callInterfaces(method, args)
	{
		var interfaces = this.interfaces;
		if (interfaces)
		{
			for (var i in interfaces)
			{
				var iface = interfaces[i];
				var fnc = iface[method];
				if (fnc && fnc.noninheritable)
				{
					fnc.apply(this, args || []);
				}
			}
		}
	});
	var callBase = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Types$OO$callBase(interfaceName, methodName, args)
	{
		var interfaces = this.interfaces;

		if (!interfaces[interfaceName])
		{
			SDL.Client.Diagnostics.Assert.raiseError("Current object doesn't implement interface '" + interfaceName + "'");
		}

		var callingInterface = arguments.callee.caller && arguments.callee.caller.implementingInterface || interfaces.type;

		var interfaceUpgradedToType = interfaces[interfaceName].upgradedToType;
		if (interfaceUpgradedToType && callingInterface != interfaceUpgradedToType)
		{
			do
			{
				interfaceName = interfaceUpgradedToType;
				if (!interfaces[interfaceName])
				{
					SDL.Client.Diagnostics.Assert.raiseError("Current object doesn't implement interface '" + interfaceName + "'");
				}
				interfaceUpgradedToType = interfaces[interfaceName].upgradedToType;
			} while (interfaceUpgradedToType && callingInterface != interfaceUpgradedToType);
		}

		var method = interfaces[interfaceName][methodName];
		if (!method)
		{
			SDL.Client.Diagnostics.Assert.raiseError("Interface '" + interfaceName + "' doesn't implement method '" + methodName + "'");
		}
		if (method.noninheritable)
		{
			SDL.Client.Diagnostics.Assert.raiseError("Unable to execute a non-inheritable method with callBase('" + interfaceName + "', '" + methodName + "').");
		}
		if (!method.implementingInterface)
		{
			SDL.Client.Diagnostics.Assert.raiseError("Unable to execute a method that was not inherited: callBase('" + interfaceName + "', '" + methodName + "').");
		}
		return interfaces[interfaceName][methodName].apply(this, args || []);
	});
})();
