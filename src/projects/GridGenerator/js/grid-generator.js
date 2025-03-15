window.SDL = (window.SDL || {});
window.SDL.GridGenerator = SDL.GridGenerator || {};

SDL.GridGenerator = (function () {
	var defaults = {
		/** Interval set in seconds */
		interval: 2,
		rowNumber: 30,
		columnNumber: 30,
		enableDashboard: false,
		enableRotation: false
	};

	function GridGenerator(options) {
		var block;

		if (!options.container || !(block = document.getElementById(options.container))) {
			throw new Error("Error: container has not been defined.")
		}

		this.container = block;
		this.interval = options.interval || defaults.interval;
		this.rowNumber = options.rowNumber || defaults.rowNumber;
		this.columnNumber = options.columnNumber || defaults.columnNumber;
		this.dashboard = options.dashboard || null;
		this.enableRotation = options.enableRotation || defaults.enableRotation;

		this.cache = [];

		this.init();
	}

	GridGenerator.prototype.init = function () {
		this._render();

		if (this.enableRotation) {
			this._startRotation();
		}

	};

	GridGenerator.prototype._render = function () {
		if (this.dashboard)
		{
			this.dashboard.display();
		}
		this.container.innerHTML = this._createGrid();
	};

	GridGenerator.prototype._getRandomColor = function () {
		var system = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'], color = '#';
		for (var i = 0; i < 6; i++) {
			var salt = Math.floor(Math.random() * 16);
			color += system[salt];
		}

		return color;
	};

	GridGenerator.prototype._createGrid = function () {
		var grid = '<table style="height: 100%; width: 100%; border-collapse: collapse; border: none">';
		var rows = [];
		for (var i = 0; i < this.rowNumber; i++) {
			var cells = [];
			var row = '<tr>';

			for (var c = 0; c < this.columnNumber; c++) {
				cells.push('<td style="background-color: ' + this._getRandomColor() + '"></td>');
			}
			row += cells.join("") + '</tr>';
			rows.push(row);
		}
		grid += rows.join("") + '</table>';

		return grid;
	};

	GridGenerator.prototype._startRotation = function () {
		this.rotate()
	};

	GridGenerator.prototype.rotate = function () {
		this._updateCellColors();
		this._attachRotator();
	};

	GridGenerator.prototype._attachRotator = function () {
		var $this = this;
		setTimeout(function () {
			$this.rotate();
		}, this.interval * 1000);
	};

	GridGenerator.prototype._updateCellColors = function () {
		console.time("update color");
		if (this.cache.length == 0)
		{
			this.cache = this.container.getElementsByTagName("td");
		}

		for (var i = 0, len = this.cache.length; i < len; i++) {
			var cell = this.cache[i];
			cell.style.cssText = "background-color: " + this._getRandomColor();
		}
		console.timeEnd("update color");
	};

	return GridGenerator;
})();

function GridGenerator() {
	var opts = arguments[0] || {};
	var defaults = {
		container: false,
		/** Interval set in seconds */
		interval: 2,
		rowNumber: 7,
		columnNumber: 7,
		enableDashboard: true,
		enableRotation: false
	};

	this.interval = opts.interval || defaults.interval;
	this.rowNumber = opts.rowNumber || defaults.rowNumber;
	this.columnNumber = opts.columnNumber || defaults.columnNumber;
	this.enableDashboard = opts.enableDashboard || defaults.enableDashboard;
	this.enableRotation = opts.enableRotation || defaults.enableRotation;
	this.gridElement = null;
	this.intervalId = null;
	this.updateTimeouts = {};

	this.settings = {
		rowNumber: [ 'text', 'number', 'Rows' ],
		columnNumber: [ 'text', 'number', 'Columns' ]
	};

	if (this.enableRotation)
		this.settings['interval'] = [ 'text', 'number', 'Interval' ];
	this.init()
}

GridGenerator.prototype.init = function () {
	var b = d.getElementsByTagName('body')[0], h = document.getElementsByTagName('html')[0]; // Main instance

	b.style.cssText = 'height: 100%';
	h.style.cssText = 'height: 100%';

	this.renderDashboard();
	b.innerHTML = this._createGrid();
};

GridGenerator.prototype._createGrid = function () {
	var grid = '<table style="height: 100%; width: 100%; border-collapse: collapse" id="grid">';
	var rows = "";
	for (var i = 0; i < this.rowNumber; i++) {
		var row = '<tr>';
		for (var c = 0; c < this.columnNumber; c++) {
			var cell = '<td style="background-color: ' + this._getRandomColor() + '">&nbsp;</td>';
			row += cell;
		}
		row += '</tr>';
		rows += row;
	}
	grid += rows + '</table>';
	return grid;
};

GridGenerator.prototype.renderDashboard = function () {
	var d = document, mi = this, b = d.getElementsByTagName('body')[0], wrapper = d.createElement('div'), inner = d.createElement('div');

	wrapper.setAttribute('id', 'settings');
	wrapper.className = 'dashboard';
	inner.className = 'dashboard-inner';

	var table = d.createElement('table');
	table.className = 'wide settings-grid';

	var row = d.createElement('tr');

	for (var s in this.settings) {
		if (!this.settings.hasOwnProperty(s)) continue;
		var widget = this.settings[s], label = d.createElement('td'), cell = d.createElement('td'), input = d.createElement('input');
		label.className = 'label';
		cell.className = 'widget';

		input.name = s;
		input.type = widget[0];
		input.className = widget[1];
		input.value = this[s];

		input.onchange = function () {
			mi.updateGrid(this);
		};
		input.onkeyup = function () {
			mi.updateGrid(this);
		};

		label.innerHTML = widget[2];
		cell.appendChild(input);
		row.appendChild(label);
		row.appendChild(cell);
	}

	table.appendChild(row);
	inner.appendChild(table);
	wrapper.appendChild(inner);
	b.appendChild(wrapper);
};

GridGenerator.prototype._startRotation = function () {
	if (this.enableRotation) {
		if (this.intervalId) clearInterval(this.intervalId);
		this.intervalId = setInterval(function () {
			mi.render();
		}, parseInt(this.interval * 1000));
	}
};

GridGenerator.prototype._attachRotator = function () {
	if (this.enableRotation) {
		if (this.intervalId) clearInterval(this.intervalId);
		this.intervalId = setInterval(function () {
			mi.render();
		}, parseInt(this.interval * 1000));
	}
};

GridGenerator.prototype.updateGrid = function (elem) {
	var v = elem.value, mi = this;
	if (this.updateTimeouts[elem.name]) clearTimeout(this.updateTimeouts[elem.name]);
	this.updateTimeouts[elem.name] = setTimeout(function () {
		if (!isNaN(v) && v && v.trim() !== '') {
			if (v === mi[elem.name]) return;
			mi[elem.name] = v;
			mi.render();
		}
	}, 300)
};

GridGenerator.prototype._getRandomColor = function () {
	var system = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'], color = '#';
	for (var i = 0; i < 6; i++) {
		var salt = Math.floor(Math.random() * 16);
		color += system[salt];
	}

	return color;
};

window.addEventListener("DOMContentLoaded", function () {
	new GridGenerator({
		container: "grid",
		interval: 7,
		rowNumber: 150,
		columnNumber: 150,
		enableDashboard: true,
		enableRotation: true
	});
});
