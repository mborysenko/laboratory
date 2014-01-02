function Fader(opts) {
	var fader = {
		box		: $('#' + opts.container),
		page	: $('#page'),
		visible	: false
	};
	
	var	w	= $(window),
		ie	= new RegExp(/MSIE [6.0|7.0|8.0]/),
		ua	= navigator.userAgent;
	
	fader.show = function(){
		if(fader.visible) return;
		
		fader
			.prepare()
			.box.removeClass('hidden');
	};
	
	fader.hide = function(){
		if( ! fader.visible) return;
		
		fader
			.destroy()
			.box.addClass('hidden');
		
	};
	
	fader.destroy = function(){
		fader.visible = false;
		
		if(ie.test(ua))
			fader.page.unbind('resize');
		else
			w.unbind('resize');
		
		return fader;
	};
	
	fader.prepare = function(){
		fader.visible = true;
		
		var p = fader.page, h = p.height();
		if(ie.test(ua)){
			p.resize(fader.update);
		} else {
			w.resize(fader.update);
		}
		
		fader.box.css({'height': h + 'px'});
		
		return fader;
	};
	
	fader.update = function(){
		var h = fader.page.height();
		
		fader.box.css({'height' : h + 'px'});
	};
	
	return fader;
}
