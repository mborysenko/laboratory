/// <reference path="typings/requirejs/require.d.ts" />
requirejs.config({
	baseUrl: 'scripts/Leviafan',
	paths: {
		app: '../app'
	}
});

requirejs(["app/main"]);