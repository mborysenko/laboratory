/*83523,1407,5593,11919,5069,21677,786,4751,822,16880,5448,1685,6542,13025,5099,287,8784,7970,9596,10912,9724,4731,1752,1882,30733,6277,1843,1982,19420,174*//*! jQuery v2.0.1 | (c) 2005, 2013 jQuery Foundation, Inc. | jquery.org/license
//@ sourceMappingURL=jquery-2.0.1.min.map
*/
(function(e,undefined){var t,n,r=typeof undefined,i=e.location,o=e.document,s=o.documentElement,a=e.jQuery,u=e.$,l={},c=[],f="2.0.1",p=c.concat,h=c.push,d=c.slice,g=c.indexOf,m=l.toString,y=l.hasOwnProperty,v=f.trim,x=function(e,n){return new x.fn.init(e,n,t)},b=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,w=/\S+/g,T=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,C=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,k=/^-ms-/,N=/-([\da-z])/gi,E=function(e,t){return t.toUpperCase()},S=function(){o.removeEventListener("DOMContentLoaded",S,!1),e.removeEventListener("load",S,!1),x.ready()};x.fn=x.prototype={jquery:f,constructor:x,init:function(e,t,n){var r,i;if(!e)return this;if("string"==typeof e){if(r="<"===e.charAt(0)&&">"===e.charAt(e.length-1)&&e.length>=3?[null,e,null]:T.exec(e),!r||!r[1]&&t)return!t||t.jquery?(t||n).find(e):this.constructor(t).find(e);if(r[1]){if(t=t instanceof x?t[0]:t,x.merge(this,x.parseHTML(r[1],t&&t.nodeType?t.ownerDocument||t:o,!0)),C.test(r[1])&&x.isPlainObject(t))for(r in t)x.isFunction(this[r])?this[r](t[r]):this.attr(r,t[r]);return this}return i=o.getElementById(r[2]),i&&i.parentNode&&(this.length=1,this[0]=i),this.context=o,this.selector=e,this}return e.nodeType?(this.context=this[0]=e,this.length=1,this):x.isFunction(e)?n.ready(e):(e.selector!==undefined&&(this.selector=e.selector,this.context=e.context),x.makeArray(e,this))},selector:"",length:0,toArray:function(){return d.call(this)},get:function(e){return null==e?this.toArray():0>e?this[this.length+e]:this[e]},pushStack:function(e){var t=x.merge(this.constructor(),e);return t.prevObject=this,t.context=this.context,t},each:function(e,t){return x.each(this,e,t)},ready:function(e){return x.ready.promise().done(e),this},slice:function(){return this.pushStack(d.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(e){var t=this.length,n=+e+(0>e?t:0);return this.pushStack(n>=0&&t>n?[this[n]]:[])},map:function(e){return this.pushStack(x.map(this,function(t,n){return e.call(t,n,t)}))},end:function(){return this.prevObject||this.constructor(null)},push:h,sort:[].sort,splice:[].splice},x.fn.init.prototype=x.fn,x.extend=x.fn.extend=function(){var e,t,n,r,i,o,s=arguments[0]||{},a=1,u=arguments.length,l=!1;for("boolean"==typeof s&&(l=s,s=arguments[1]||{},a=2),"object"==typeof s||x.isFunction(s)||(s={}),u===a&&(s=this,--a);u>a;a++)if(null!=(e=arguments[a]))for(t in e)n=s[t],r=e[t],s!==r&&(l&&r&&(x.isPlainObject(r)||(i=x.isArray(r)))?(i?(i=!1,o=n&&x.isArray(n)?n:[]):o=n&&x.isPlainObject(n)?n:{},s[t]=x.extend(l,o,r)):r!==undefined&&(s[t]=r));return s},x.extend({expando:"jQuery"+(f+Math.random()).replace(/\D/g,""),noConflict:function(t){return e.$===x&&(e.$=u),t&&e.jQuery===x&&(e.jQuery=a),x},isReady:!1,readyWait:1,holdReady:function(e){e?x.readyWait++:x.ready(!0)},ready:function(e){(e===!0?--x.readyWait:x.isReady)||(x.isReady=!0,e!==!0&&--x.readyWait>0||(n.resolveWith(o,[x]),x.fn.trigger&&x(o).trigger("ready").off("ready")))},isFunction:function(e){return"function"===x.type(e)},isArray:Array.isArray,isWindow:function(e){return null!=e&&e===e.window},isNumeric:function(e){return!isNaN(parseFloat(e))&&isFinite(e)},type:function(e){return null==e?e+"":"object"==typeof e||"function"==typeof e?l[m.call(e)]||"object":typeof e},isPlainObject:function(e){if("object"!==x.type(e)||e.nodeType||x.isWindow(e))return!1;try{if(e.constructor&&!y.call(e.constructor.prototype,"isPrototypeOf"))return!1}catch(t){return!1}return!0},isEmptyObject:function(e){var t;for(t in e)return!1;return!0},error:function(e){throw Error(e)},parseHTML:function(e,t,n){if(!e||"string"!=typeof e)return null;"boolean"==typeof t&&(n=t,t=!1),t=t||o;var r=C.exec(e),i=!n&&[];return r?[t.createElement(r[1])]:(r=x.buildFragment([e],t,i),i&&x(i).remove(),x.merge([],r.childNodes))},parseJSON:JSON.parse,parseXML:function(e){var t,n;if(!e||"string"!=typeof e)return null;try{n=new DOMParser,t=n.parseFromString(e,"text/xml")}catch(r){t=undefined}return(!t||t.getElementsByTagName("parsererror").length)&&x.error("Invalid XML: "+e),t},noop:function(){},globalEval:function(e){var t,n=eval;e=x.trim(e),e&&(1===e.indexOf("use strict")?(t=o.createElement("script"),t.text=e,o.head.appendChild(t).parentNode.removeChild(t)):n(e))},camelCase:function(e){return e.replace(k,"ms-").replace(N,E)},nodeName:function(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()},each:function(e,t,n){var r,i=0,o=e.length,s=j(e);if(n){if(s){for(;o>i;i++)if(r=t.apply(e[i],n),r===!1)break}else for(i in e)if(r=t.apply(e[i],n),r===!1)break}else if(s){for(;o>i;i++)if(r=t.call(e[i],i,e[i]),r===!1)break}else for(i in e)if(r=t.call(e[i],i,e[i]),r===!1)break;return e},trim:function(e){return null==e?"":v.call(e)},makeArray:function(e,t){var n=t||[];return null!=e&&(j(Object(e))?x.merge(n,"string"==typeof e?[e]:e):h.call(n,e)),n},inArray:function(e,t,n){return null==t?-1:g.call(t,e,n)},merge:function(e,t){var n=t.length,r=e.length,i=0;if("number"==typeof n)for(;n>i;i++)e[r++]=t[i];else while(t[i]!==undefined)e[r++]=t[i++];return e.length=r,e},grep:function(e,t,n){var r,i=[],o=0,s=e.length;for(n=!!n;s>o;o++)r=!!t(e[o],o),n!==r&&i.push(e[o]);return i},map:function(e,t,n){var r,i=0,o=e.length,s=j(e),a=[];if(s)for(;o>i;i++)r=t(e[i],i,n),null!=r&&(a[a.length]=r);else for(i in e)r=t(e[i],i,n),null!=r&&(a[a.length]=r);return p.apply([],a)},guid:1,proxy:function(e,t){var n,r,i;return"string"==typeof t&&(n=e[t],t=e,e=n),x.isFunction(e)?(r=d.call(arguments,2),i=function(){return e.apply(t||this,r.concat(d.call(arguments)))},i.guid=e.guid=e.guid||x.guid++,i):undefined},access:function(e,t,n,r,i,o,s){var a=0,u=e.length,l=null==n;if("object"===x.type(n)){i=!0;for(a in n)x.access(e,t,a,n[a],!0,o,s)}else if(r!==undefined&&(i=!0,x.isFunction(r)||(s=!0),l&&(s?(t.call(e,r),t=null):(l=t,t=function(e,t,n){return l.call(x(e),n)})),t))for(;u>a;a++)t(e[a],n,s?r:r.call(e[a],a,t(e[a],n)));return i?e:l?t.call(e):u?t(e[0],n):o},now:Date.now,swap:function(e,t,n,r){var i,o,s={};for(o in t)s[o]=e.style[o],e.style[o]=t[o];i=n.apply(e,r||[]);for(o in t)e.style[o]=s[o];return i}}),x.ready.promise=function(t){return n||(n=x.Deferred(),"complete"===o.readyState?setTimeout(x.ready):(o.addEventListener("DOMContentLoaded",S,!1),e.addEventListener("load",S,!1))),n.promise(t)},x.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(e,t){l["[object "+t+"]"]=t.toLowerCase()});function j(e){var t=e.length,n=x.type(e);return x.isWindow(e)?!1:1===e.nodeType&&t?!0:"array"===n||"function"!==n&&(0===t||"number"==typeof t&&t>0&&t-1 in e)}t=x(o),function(e,undefined){var t,n,r,i,o,s,a,u,l,c,f,p,h,d,g,m,y,v="sizzle"+-new Date,b=e.document,w=0,T=0,C=at(),k=at(),N=at(),E=!1,S=function(){return 0},j=typeof undefined,D=1<<31,A={}.hasOwnProperty,L=[],H=L.pop,q=L.push,O=L.push,F=L.slice,P=L.indexOf||function(e){var t=0,n=this.length;for(;n>t;t++)if(this[t]===e)return t;return-1},R="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",M="[\\x20\\t\\r\\n\\f]",W="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",$=W.replace("w","w#"),B="\\["+M+"*("+W+")"+M+"*(?:([*^$|!~]?=)"+M+"*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|("+$+")|)|)"+M+"*\\]",I=":("+W+")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|"+B.replace(3,8)+")*)|.*)\\)|)",z=RegExp("^"+M+"+|((?:^|[^\\\\])(?:\\\\.)*)"+M+"+$","g"),_=RegExp("^"+M+"*,"+M+"*"),X=RegExp("^"+M+"*([>+~]|"+M+")"+M+"*"),U=RegExp(M+"*[+~]"),Y=RegExp("="+M+"*([^\\]'\"]*)"+M+"*\\]","g"),V=RegExp(I),G=RegExp("^"+$+"$"),J={ID:RegExp("^#("+W+")"),CLASS:RegExp("^\\.("+W+")"),TAG:RegExp("^("+W.replace("w","w*")+")"),ATTR:RegExp("^"+B),PSEUDO:RegExp("^"+I),CHILD:RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+M+"*(even|odd|(([+-]|)(\\d*)n|)"+M+"*(?:([+-]|)"+M+"*(\\d+)|))"+M+"*\\)|)","i"),bool:RegExp("^(?:"+R+")$","i"),needsContext:RegExp("^"+M+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+M+"*((?:-\\d)?\\d*)"+M+"*\\)|)(?=[^-]|$)","i")},Q=/^[^{]+\{\s*\[native \w/,K=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,Z=/^(?:input|select|textarea|button)$/i,et=/^h\d$/i,tt=/'|\\/g,nt=RegExp("\\\\([\\da-f]{1,6}"+M+"?|("+M+")|.)","ig"),rt=function(e,t,n){var r="0x"+t-65536;return r!==r||n?t:0>r?String.fromCharCode(r+65536):String.fromCharCode(55296|r>>10,56320|1023&r)};try{O.apply(L=F.call(b.childNodes),b.childNodes),L[b.childNodes.length].nodeType}catch(it){O={apply:L.length?function(e,t){q.apply(e,F.call(t))}:function(e,t){var n=e.length,r=0;while(e[n++]=t[r++]);e.length=n-1}}}function ot(e,t,r,i){var o,s,a,u,l,p,g,m,x,w;if((t?t.ownerDocument||t:b)!==f&&c(t),t=t||f,r=r||[],!e||"string"!=typeof e)return r;if(1!==(u=t.nodeType)&&9!==u)return[];if(h&&!i){if(o=K.exec(e))if(a=o[1]){if(9===u){if(s=t.getElementById(a),!s||!s.parentNode)return r;if(s.id===a)return r.push(s),r}else if(t.ownerDocument&&(s=t.ownerDocument.getElementById(a))&&y(t,s)&&s.id===a)return r.push(s),r}else{if(o[2])return O.apply(r,t.getElementsByTagName(e)),r;if((a=o[3])&&n.getElementsByClassName&&t.getElementsByClassName)return O.apply(r,t.getElementsByClassName(a)),r}if(n.qsa&&(!d||!d.test(e))){if(m=g=v,x=t,w=9===u&&e,1===u&&"object"!==t.nodeName.toLowerCase()){p=vt(e),(g=t.getAttribute("id"))?m=g.replace(tt,"\\$&"):t.setAttribute("id",m),m="[id='"+m+"'] ",l=p.length;while(l--)p[l]=m+xt(p[l]);x=U.test(e)&&t.parentNode||t,w=p.join(",")}if(w)try{return O.apply(r,x.querySelectorAll(w)),r}catch(T){}finally{g||t.removeAttribute("id")}}}return St(e.replace(z,"$1"),t,r,i)}function st(e){return Q.test(e+"")}function at(){var e=[];function t(n,r){return e.push(n+=" ")>i.cacheLength&&delete t[e.shift()],t[n]=r}return t}function ut(e){return e[v]=!0,e}function lt(e){var t=f.createElement("div");try{return!!e(t)}catch(n){return!1}finally{t.parentNode&&t.parentNode.removeChild(t),t=null}}function ct(e,t,n){e=e.split("|");var r,o=e.length,s=n?null:t;while(o--)(r=i.attrHandle[e[o]])&&r!==t||(i.attrHandle[e[o]]=s)}function ft(e,t){var n=e.getAttributeNode(t);return n&&n.specified?n.value:e[t]===!0?t.toLowerCase():null}function pt(e,t){return e.getAttribute(t,"type"===t.toLowerCase()?1:2)}function ht(e){return"input"===e.nodeName.toLowerCase()?e.defaultValue:undefined}function dt(e,t){var n=t&&e,r=n&&1===e.nodeType&&1===t.nodeType&&(~t.sourceIndex||D)-(~e.sourceIndex||D);if(r)return r;if(n)while(n=n.nextSibling)if(n===t)return-1;return e?1:-1}function gt(e){return function(t){var n=t.nodeName.toLowerCase();return"input"===n&&t.type===e}}function mt(e){return function(t){var n=t.nodeName.toLowerCase();return("input"===n||"button"===n)&&t.type===e}}function yt(e){return ut(function(t){return t=+t,ut(function(n,r){var i,o=e([],n.length,t),s=o.length;while(s--)n[i=o[s]]&&(n[i]=!(r[i]=n[i]))})})}s=ot.isXML=function(e){var t=e&&(e.ownerDocument||e).documentElement;return t?"HTML"!==t.nodeName:!1},n=ot.support={},c=ot.setDocument=function(e){var t=e?e.ownerDocument||e:b;return t!==f&&9===t.nodeType&&t.documentElement?(f=t,p=t.documentElement,h=!s(t),n.attributes=lt(function(e){return e.innerHTML="<a href='#'></a>",ct("type|href|height|width",pt,"#"===e.firstChild.getAttribute("href")),ct(R,ft,null==e.getAttribute("disabled")),e.className="i",!e.getAttribute("className")}),n.input=lt(function(e){return e.innerHTML="<input>",e.firstChild.setAttribute("value",""),""===e.firstChild.getAttribute("value")}),ct("value",ht,n.attributes&&n.input),n.getElementsByTagName=lt(function(e){return e.appendChild(t.createComment("")),!e.getElementsByTagName("*").length}),n.getElementsByClassName=lt(function(e){return e.innerHTML="<div class='a'></div><div class='a i'></div>",e.firstChild.className="i",2===e.getElementsByClassName("i").length}),n.getById=lt(function(e){return p.appendChild(e).id=v,!t.getElementsByName||!t.getElementsByName(v).length}),n.getById?(i.find.ID=function(e,t){if(typeof t.getElementById!==j&&h){var n=t.getElementById(e);return n&&n.parentNode?[n]:[]}},i.filter.ID=function(e){var t=e.replace(nt,rt);return function(e){return e.getAttribute("id")===t}}):(delete i.find.ID,i.filter.ID=function(e){var t=e.replace(nt,rt);return function(e){var n=typeof e.getAttributeNode!==j&&e.getAttributeNode("id");return n&&n.value===t}}),i.find.TAG=n.getElementsByTagName?function(e,t){return typeof t.getElementsByTagName!==j?t.getElementsByTagName(e):undefined}:function(e,t){var n,r=[],i=0,o=t.getElementsByTagName(e);if("*"===e){while(n=o[i++])1===n.nodeType&&r.push(n);return r}return o},i.find.CLASS=n.getElementsByClassName&&function(e,t){return typeof t.getElementsByClassName!==j&&h?t.getElementsByClassName(e):undefined},g=[],d=[],(n.qsa=st(t.querySelectorAll))&&(lt(function(e){e.innerHTML="<select><option selected=''></option></select>",e.querySelectorAll("[selected]").length||d.push("\\["+M+"*(?:value|"+R+")"),e.querySelectorAll(":checked").length||d.push(":checked")}),lt(function(e){var n=t.createElement("input");n.setAttribute("type","hidden"),e.appendChild(n).setAttribute("t",""),e.querySelectorAll("[t^='']").length&&d.push("[*^$]="+M+"*(?:''|\"\")"),e.querySelectorAll(":enabled").length||d.push(":enabled",":disabled"),e.querySelectorAll("*,:x"),d.push(",.*:")})),(n.matchesSelector=st(m=p.webkitMatchesSelector||p.mozMatchesSelector||p.oMatchesSelector||p.msMatchesSelector))&&lt(function(e){n.disconnectedMatch=m.call(e,"div"),m.call(e,"[s!='']:x"),g.push("!=",I)}),d=d.length&&RegExp(d.join("|")),g=g.length&&RegExp(g.join("|")),y=st(p.contains)||p.compareDocumentPosition?function(e,t){var n=9===e.nodeType?e.documentElement:e,r=t&&t.parentNode;return e===r||!(!r||1!==r.nodeType||!(n.contains?n.contains(r):e.compareDocumentPosition&&16&e.compareDocumentPosition(r)))}:function(e,t){if(t)while(t=t.parentNode)if(t===e)return!0;return!1},n.sortDetached=lt(function(e){return 1&e.compareDocumentPosition(t.createElement("div"))}),S=p.compareDocumentPosition?function(e,r){if(e===r)return E=!0,0;var i=r.compareDocumentPosition&&e.compareDocumentPosition&&e.compareDocumentPosition(r);return i?1&i||!n.sortDetached&&r.compareDocumentPosition(e)===i?e===t||y(b,e)?-1:r===t||y(b,r)?1:l?P.call(l,e)-P.call(l,r):0:4&i?-1:1:e.compareDocumentPosition?-1:1}:function(e,n){var r,i=0,o=e.parentNode,s=n.parentNode,a=[e],u=[n];if(e===n)return E=!0,0;if(!o||!s)return e===t?-1:n===t?1:o?-1:s?1:l?P.call(l,e)-P.call(l,n):0;if(o===s)return dt(e,n);r=e;while(r=r.parentNode)a.unshift(r);r=n;while(r=r.parentNode)u.unshift(r);while(a[i]===u[i])i++;return i?dt(a[i],u[i]):a[i]===b?-1:u[i]===b?1:0},t):f},ot.matches=function(e,t){return ot(e,null,null,t)},ot.matchesSelector=function(e,t){if((e.ownerDocument||e)!==f&&c(e),t=t.replace(Y,"='$1']"),!(!n.matchesSelector||!h||g&&g.test(t)||d&&d.test(t)))try{var r=m.call(e,t);if(r||n.disconnectedMatch||e.document&&11!==e.document.nodeType)return r}catch(i){}return ot(t,f,null,[e]).length>0},ot.contains=function(e,t){return(e.ownerDocument||e)!==f&&c(e),y(e,t)},ot.attr=function(e,t){(e.ownerDocument||e)!==f&&c(e);var r=i.attrHandle[t.toLowerCase()],o=r&&A.call(i.attrHandle,t.toLowerCase())?r(e,t,!h):undefined;return o===undefined?n.attributes||!h?e.getAttribute(t):(o=e.getAttributeNode(t))&&o.specified?o.value:null:o},ot.error=function(e){throw Error("Syntax error, unrecognized expression: "+e)},ot.uniqueSort=function(e){var t,r=[],i=0,o=0;if(E=!n.detectDuplicates,l=!n.sortStable&&e.slice(0),e.sort(S),E){while(t=e[o++])t===e[o]&&(i=r.push(o));while(i--)e.splice(r[i],1)}return e},o=ot.getText=function(e){var t,n="",r=0,i=e.nodeType;if(i){if(1===i||9===i||11===i){if("string"==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=o(e)}else if(3===i||4===i)return e.nodeValue}else for(;t=e[r];r++)n+=o(t);return n},i=ot.selectors={cacheLength:50,createPseudo:ut,match:J,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace(nt,rt),e[3]=(e[4]||e[5]||"").replace(nt,rt),"~="===e[2]&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),"nth"===e[1].slice(0,3)?(e[3]||ot.error(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*("even"===e[3]||"odd"===e[3])),e[5]=+(e[7]+e[8]||"odd"===e[3])):e[3]&&ot.error(e[0]),e},PSEUDO:function(e){var t,n=!e[5]&&e[2];return J.CHILD.test(e[0])?null:(e[3]&&e[4]!==undefined?e[2]=e[4]:n&&V.test(n)&&(t=vt(n,!0))&&(t=n.indexOf(")",n.length-t)-n.length)&&(e[0]=e[0].slice(0,t),e[2]=n.slice(0,t)),e.slice(0,3))}},filter:{TAG:function(e){var t=e.replace(nt,rt).toLowerCase();return"*"===e?function(){return!0}:function(e){return e.nodeName&&e.nodeName.toLowerCase()===t}},CLASS:function(e){var t=C[e+" "];return t||(t=RegExp("(^|"+M+")"+e+"("+M+"|$)"))&&C(e,function(e){return t.test("string"==typeof e.className&&e.className||typeof e.getAttribute!==j&&e.getAttribute("class")||"")})},ATTR:function(e,t,n){return function(r){var i=ot.attr(r,e);return null==i?"!="===t:t?(i+="","="===t?i===n:"!="===t?i!==n:"^="===t?n&&0===i.indexOf(n):"*="===t?n&&i.indexOf(n)>-1:"$="===t?n&&i.slice(-n.length)===n:"~="===t?(" "+i+" ").indexOf(n)>-1:"|="===t?i===n||i.slice(0,n.length+1)===n+"-":!1):!0}},CHILD:function(e,t,n,r,i){var o="nth"!==e.slice(0,3),s="last"!==e.slice(-4),a="of-type"===t;return 1===r&&0===i?function(e){return!!e.parentNode}:function(t,n,u){var l,c,f,p,h,d,g=o!==s?"nextSibling":"previousSibling",m=t.parentNode,y=a&&t.nodeName.toLowerCase(),x=!u&&!a;if(m){if(o){while(g){f=t;while(f=f[g])if(a?f.nodeName.toLowerCase()===y:1===f.nodeType)return!1;d=g="only"===e&&!d&&"nextSibling"}return!0}if(d=[s?m.firstChild:m.lastChild],s&&x){c=m[v]||(m[v]={}),l=c[e]||[],h=l[0]===w&&l[1],p=l[0]===w&&l[2],f=h&&m.childNodes[h];while(f=++h&&f&&f[g]||(p=h=0)||d.pop())if(1===f.nodeType&&++p&&f===t){c[e]=[w,h,p];break}}else if(x&&(l=(t[v]||(t[v]={}))[e])&&l[0]===w)p=l[1];else while(f=++h&&f&&f[g]||(p=h=0)||d.pop())if((a?f.nodeName.toLowerCase()===y:1===f.nodeType)&&++p&&(x&&((f[v]||(f[v]={}))[e]=[w,p]),f===t))break;return p-=i,p===r||0===p%r&&p/r>=0}}},PSEUDO:function(e,t){var n,r=i.pseudos[e]||i.setFilters[e.toLowerCase()]||ot.error("unsupported pseudo: "+e);return r[v]?r(t):r.length>1?(n=[e,e,"",t],i.setFilters.hasOwnProperty(e.toLowerCase())?ut(function(e,n){var i,o=r(e,t),s=o.length;while(s--)i=P.call(e,o[s]),e[i]=!(n[i]=o[s])}):function(e){return r(e,0,n)}):r}},pseudos:{not:ut(function(e){var t=[],n=[],r=a(e.replace(z,"$1"));return r[v]?ut(function(e,t,n,i){var o,s=r(e,null,i,[]),a=e.length;while(a--)(o=s[a])&&(e[a]=!(t[a]=o))}):function(e,i,o){return t[0]=e,r(t,null,o,n),!n.pop()}}),has:ut(function(e){return function(t){return ot(e,t).length>0}}),contains:ut(function(e){return function(t){return(t.textContent||t.innerText||o(t)).indexOf(e)>-1}}),lang:ut(function(e){return G.test(e||"")||ot.error("unsupported lang: "+e),e=e.replace(nt,rt).toLowerCase(),function(t){var n;do if(n=h?t.lang:t.getAttribute("xml:lang")||t.getAttribute("lang"))return n=n.toLowerCase(),n===e||0===n.indexOf(e+"-");while((t=t.parentNode)&&1===t.nodeType);return!1}}),target:function(t){var n=e.location&&e.location.hash;return n&&n.slice(1)===t.id},root:function(e){return e===p},focus:function(e){return e===f.activeElement&&(!f.hasFocus||f.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},enabled:function(e){return e.disabled===!1},disabled:function(e){return e.disabled===!0},checked:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&!!e.checked||"option"===t&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,e.selected===!0},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeName>"@"||3===e.nodeType||4===e.nodeType)return!1;return!0},parent:function(e){return!i.pseudos.empty(e)},header:function(e){return et.test(e.nodeName)},input:function(e){return Z.test(e.nodeName)},button:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&"button"===e.type||"button"===t},text:function(e){var t;return"input"===e.nodeName.toLowerCase()&&"text"===e.type&&(null==(t=e.getAttribute("type"))||t.toLowerCase()===e.type)},first:yt(function(){return[0]}),last:yt(function(e,t){return[t-1]}),eq:yt(function(e,t,n){return[0>n?n+t:n]}),even:yt(function(e,t){var n=0;for(;t>n;n+=2)e.push(n);return e}),odd:yt(function(e,t){var n=1;for(;t>n;n+=2)e.push(n);return e}),lt:yt(function(e,t,n){var r=0>n?n+t:n;for(;--r>=0;)e.push(r);return e}),gt:yt(function(e,t,n){var r=0>n?n+t:n;for(;t>++r;)e.push(r);return e})}};for(t in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})i.pseudos[t]=gt(t);for(t in{submit:!0,reset:!0})i.pseudos[t]=mt(t);function vt(e,t){var n,r,o,s,a,u,l,c=k[e+" "];if(c)return t?0:c.slice(0);a=e,u=[],l=i.preFilter;while(a){(!n||(r=_.exec(a)))&&(r&&(a=a.slice(r[0].length)||a),u.push(o=[])),n=!1,(r=X.exec(a))&&(n=r.shift(),o.push({value:n,type:r[0].replace(z," ")}),a=a.slice(n.length));for(s in i.filter)!(r=J[s].exec(a))||l[s]&&!(r=l[s](r))||(n=r.shift(),o.push({value:n,type:s,matches:r}),a=a.slice(n.length));if(!n)break}return t?a.length:a?ot.error(e):k(e,u).slice(0)}function xt(e){var t=0,n=e.length,r="";for(;n>t;t++)r+=e[t].value;return r}function bt(e,t,n){var i=t.dir,o=n&&"parentNode"===i,s=T++;return t.first?function(t,n,r){while(t=t[i])if(1===t.nodeType||o)return e(t,n,r)}:function(t,n,a){var u,l,c,f=w+" "+s;if(a){while(t=t[i])if((1===t.nodeType||o)&&e(t,n,a))return!0}else while(t=t[i])if(1===t.nodeType||o)if(c=t[v]||(t[v]={}),(l=c[i])&&l[0]===f){if((u=l[1])===!0||u===r)return u===!0}else if(l=c[i]=[f],l[1]=e(t,n,a)||r,l[1]===!0)return!0}}function wt(e){return e.length>1?function(t,n,r){var i=e.length;while(i--)if(!e[i](t,n,r))return!1;return!0}:e[0]}function Tt(e,t,n,r,i){var o,s=[],a=0,u=e.length,l=null!=t;for(;u>a;a++)(o=e[a])&&(!n||n(o,r,i))&&(s.push(o),l&&t.push(a));return s}function Ct(e,t,n,r,i,o){return r&&!r[v]&&(r=Ct(r)),i&&!i[v]&&(i=Ct(i,o)),ut(function(o,s,a,u){var l,c,f,p=[],h=[],d=s.length,g=o||Et(t||"*",a.nodeType?[a]:a,[]),m=!e||!o&&t?g:Tt(g,p,e,a,u),y=n?i||(o?e:d||r)?[]:s:m;if(n&&n(m,y,a,u),r){l=Tt(y,h),r(l,[],a,u),c=l.length;while(c--)(f=l[c])&&(y[h[c]]=!(m[h[c]]=f))}if(o){if(i||e){if(i){l=[],c=y.length;while(c--)(f=y[c])&&l.push(m[c]=f);i(null,y=[],l,u)}c=y.length;while(c--)(f=y[c])&&(l=i?P.call(o,f):p[c])>-1&&(o[l]=!(s[l]=f))}}else y=Tt(y===s?y.splice(d,y.length):y),i?i(null,s,y,u):O.apply(s,y)})}function kt(e){var t,n,r,o=e.length,s=i.relative[e[0].type],a=s||i.relative[" "],l=s?1:0,c=bt(function(e){return e===t},a,!0),f=bt(function(e){return P.call(t,e)>-1},a,!0),p=[function(e,n,r){return!s&&(r||n!==u)||((t=n).nodeType?c(e,n,r):f(e,n,r))}];for(;o>l;l++)if(n=i.relative[e[l].type])p=[bt(wt(p),n)];else{if(n=i.filter[e[l].type].apply(null,e[l].matches),n[v]){for(r=++l;o>r;r++)if(i.relative[e[r].type])break;return Ct(l>1&&wt(p),l>1&&xt(e.slice(0,l-1).concat({value:" "===e[l-2].type?"*":""})).replace(z,"$1"),n,r>l&&kt(e.slice(l,r)),o>r&&kt(e=e.slice(r)),o>r&&xt(e))}p.push(n)}return wt(p)}function Nt(e,t){var n=0,o=t.length>0,s=e.length>0,a=function(a,l,c,p,h){var d,g,m,y=[],v=0,x="0",b=a&&[],T=null!=h,C=u,k=a||s&&i.find.TAG("*",h&&l.parentNode||l),N=w+=null==C?1:Math.random()||.1;for(T&&(u=l!==f&&l,r=n);null!=(d=k[x]);x++){if(s&&d){g=0;while(m=e[g++])if(m(d,l,c)){p.push(d);break}T&&(w=N,r=++n)}o&&((d=!m&&d)&&v--,a&&b.push(d))}if(v+=x,o&&x!==v){g=0;while(m=t[g++])m(b,y,l,c);if(a){if(v>0)while(x--)b[x]||y[x]||(y[x]=H.call(p));y=Tt(y)}O.apply(p,y),T&&!a&&y.length>0&&v+t.length>1&&ot.uniqueSort(p)}return T&&(w=N,u=C),b};return o?ut(a):a}a=ot.compile=function(e,t){var n,r=[],i=[],o=N[e+" "];if(!o){t||(t=vt(e)),n=t.length;while(n--)o=kt(t[n]),o[v]?r.push(o):i.push(o);o=N(e,Nt(i,r))}return o};function Et(e,t,n){var r=0,i=t.length;for(;i>r;r++)ot(e,t[r],n);return n}function St(e,t,r,o){var s,u,l,c,f,p=vt(e);if(!o&&1===p.length){if(u=p[0]=p[0].slice(0),u.length>2&&"ID"===(l=u[0]).type&&n.getById&&9===t.nodeType&&h&&i.relative[u[1].type]){if(t=(i.find.ID(l.matches[0].replace(nt,rt),t)||[])[0],!t)return r;e=e.slice(u.shift().value.length)}s=J.needsContext.test(e)?0:u.length;while(s--){if(l=u[s],i.relative[c=l.type])break;if((f=i.find[c])&&(o=f(l.matches[0].replace(nt,rt),U.test(u[0].type)&&t.parentNode||t))){if(u.splice(s,1),e=o.length&&xt(u),!e)return O.apply(r,o),r;break}}}return a(e,p)(o,t,!h,r,U.test(e)),r}i.pseudos.nth=i.pseudos.eq;function jt(){}jt.prototype=i.filters=i.pseudos,i.setFilters=new jt,n.sortStable=v.split("").sort(S).join("")===v,c(),[0,0].sort(S),n.detectDuplicates=E,x.find=ot,x.expr=ot.selectors,x.expr[":"]=x.expr.pseudos,x.unique=ot.uniqueSort,x.text=ot.getText,x.isXMLDoc=ot.isXML,x.contains=ot.contains}(e);var D={};function A(e){var t=D[e]={};return x.each(e.match(w)||[],function(e,n){t[n]=!0}),t}x.Callbacks=function(e){e="string"==typeof e?D[e]||A(e):x.extend({},e);var t,n,r,i,o,s,a=[],u=!e.once&&[],l=function(f){for(t=e.memory&&f,n=!0,s=i||0,i=0,o=a.length,r=!0;a&&o>s;s++)if(a[s].apply(f[0],f[1])===!1&&e.stopOnFalse){t=!1;break}r=!1,a&&(u?u.length&&l(u.shift()):t?a=[]:c.disable())},c={add:function(){if(a){var n=a.length;(function s(t){x.each(t,function(t,n){var r=x.type(n);"function"===r?e.unique&&c.has(n)||a.push(n):n&&n.length&&"string"!==r&&s(n)})})(arguments),r?o=a.length:t&&(i=n,l(t))}return this},remove:function(){return a&&x.each(arguments,function(e,t){var n;while((n=x.inArray(t,a,n))>-1)a.splice(n,1),r&&(o>=n&&o--,s>=n&&s--)}),this},has:function(e){return e?x.inArray(e,a)>-1:!(!a||!a.length)},empty:function(){return a=[],o=0,this},disable:function(){return a=u=t=undefined,this},disabled:function(){return!a},lock:function(){return u=undefined,t||c.disable(),this},locked:function(){return!u},fireWith:function(e,t){return t=t||[],t=[e,t.slice?t.slice():t],!a||n&&!u||(r?u.push(t):l(t)),this},fire:function(){return c.fireWith(this,arguments),this},fired:function(){return!!n}};return c},x.extend({Deferred:function(e){var t=[["resolve","done",x.Callbacks("once memory"),"resolved"],["reject","fail",x.Callbacks("once memory"),"rejected"],["notify","progress",x.Callbacks("memory")]],n="pending",r={state:function(){return n},always:function(){return i.done(arguments).fail(arguments),this},then:function(){var e=arguments;return x.Deferred(function(n){x.each(t,function(t,o){var s=o[0],a=x.isFunction(e[t])&&e[t];i[o[1]](function(){var e=a&&a.apply(this,arguments);e&&x.isFunction(e.promise)?e.promise().done(n.resolve).fail(n.reject).progress(n.notify):n[s+"With"](this===r?n.promise():this,a?[e]:arguments)})}),e=null}).promise()},promise:function(e){return null!=e?x.extend(e,r):r}},i={};return r.pipe=r.then,x.each(t,function(e,o){var s=o[2],a=o[3];r[o[1]]=s.add,a&&s.add(function(){n=a},t[1^e][2].disable,t[2][2].lock),i[o[0]]=function(){return i[o[0]+"With"](this===i?r:this,arguments),this},i[o[0]+"With"]=s.fireWith}),r.promise(i),e&&e.call(i,i),i},when:function(e){var t=0,n=d.call(arguments),r=n.length,i=1!==r||e&&x.isFunction(e.promise)?r:0,o=1===i?e:x.Deferred(),s=function(e,t,n){return function(r){t[e]=this,n[e]=arguments.length>1?d.call(arguments):r,n===a?o.notifyWith(t,n):--i||o.resolveWith(t,n)}},a,u,l;if(r>1)for(a=Array(r),u=Array(r),l=Array(r);r>t;t++)n[t]&&x.isFunction(n[t].promise)?n[t].promise().done(s(t,l,n)).fail(o.reject).progress(s(t,u,a)):--i;return i||o.resolveWith(l,n),o.promise()}}),x.support=function(t){var n=o.createElement("input"),r=o.createDocumentFragment(),i=o.createElement("div"),s=o.createElement("select"),a=s.appendChild(o.createElement("option"));return n.type?(n.type="checkbox",t.checkOn=""!==n.value,t.optSelected=a.selected,t.reliableMarginRight=!0,t.boxSizingReliable=!0,t.pixelPosition=!1,n.checked=!0,t.noCloneChecked=n.cloneNode(!0).checked,s.disabled=!0,t.optDisabled=!a.disabled,n=o.createElement("input"),n.value="t",n.type="radio",t.radioValue="t"===n.value,n.setAttribute("checked","t"),n.setAttribute("name","t"),r.appendChild(n),t.checkClone=r.cloneNode(!0).cloneNode(!0).lastChild.checked,t.focusinBubbles="onfocusin"in e,i.style.backgroundClip="content-box",i.cloneNode(!0).style.backgroundClip="",t.clearCloneStyle="content-box"===i.style.backgroundClip,x(function(){var n,r,s="padding:0;margin:0;border:0;display:block;-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box",a=o.getElementsByTagName("body")[0];a&&(n=o.createElement("div"),n.style.cssText="border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px",a.appendChild(n).appendChild(i),i.innerHTML="",i.style.cssText="-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%",x.swap(a,null!=a.style.zoom?{zoom:1}:{},function(){t.boxSizing=4===i.offsetWidth}),e.getComputedStyle&&(t.pixelPosition="1%"!==(e.getComputedStyle(i,null)||{}).top,t.boxSizingReliable="4px"===(e.getComputedStyle(i,null)||{width:"4px"}).width,r=i.appendChild(o.createElement("div")),r.style.cssText=i.style.cssText=s,r.style.marginRight=r.style.width="0",i.style.width="1px",t.reliableMarginRight=!parseFloat((e.getComputedStyle(r,null)||{}).marginRight)),a.removeChild(n))}),t):t}({});var L,H,q=/(?:\{[\s\S]*\}|\[[\s\S]*\])$/,O=/([A-Z])/g;function F(){Object.defineProperty(this.cache={},0,{get:function(){return{}}}),this.expando=x.expando+Math.random()}F.uid=1,F.accepts=function(e){return e.nodeType?1===e.nodeType||9===e.nodeType:!0},F.prototype={key:function(e){if(!F.accepts(e))return 0;var t={},n=e[this.expando];if(!n){n=F.uid++;try{t[this.expando]={value:n},Object.defineProperties(e,t)}catch(r){t[this.expando]=n,x.extend(e,t)}}return this.cache[n]||(this.cache[n]={}),n},set:function(e,t,n){var r,i=this.key(e),o=this.cache[i];if("string"==typeof t)o[t]=n;else if(x.isEmptyObject(o))x.extend(this.cache[i],t);else for(r in t)o[r]=t[r];return o},get:function(e,t){var n=this.cache[this.key(e)];return t===undefined?n:n[t]},access:function(e,t,n){return t===undefined||t&&"string"==typeof t&&n===undefined?this.get(e,t):(this.set(e,t,n),n!==undefined?n:t)},remove:function(e,t){var n,r,i,o=this.key(e),s=this.cache[o];if(t===undefined)this.cache[o]={};else{x.isArray(t)?r=t.concat(t.map(x.camelCase)):(i=x.camelCase(t),t in s?r=[t,i]:(r=i,r=r in s?[r]:r.match(w)||[])),n=r.length;while(n--)delete s[r[n]]}},hasData:function(e){return!x.isEmptyObject(this.cache[e[this.expando]]||{})},discard:function(e){e[this.expando]&&delete this.cache[e[this.expando]]}},L=new F,H=new F,x.extend({acceptData:F.accepts,hasData:function(e){return L.hasData(e)||H.hasData(e)},data:function(e,t,n){return L.access(e,t,n)},removeData:function(e,t){L.remove(e,t)},_data:function(e,t,n){return H.access(e,t,n)},_removeData:function(e,t){H.remove(e,t)}}),x.fn.extend({data:function(e,t){var n,r,i=this[0],o=0,s=null;if(e===undefined){if(this.length&&(s=L.get(i),1===i.nodeType&&!H.get(i,"hasDataAttrs"))){for(n=i.attributes;n.length>o;o++)r=n[o].name,0===r.indexOf("data-")&&(r=x.camelCase(r.slice(5)),P(i,r,s[r]));H.set(i,"hasDataAttrs",!0)}return s}return"object"==typeof e?this.each(function(){L.set(this,e)}):x.access(this,function(t){var n,r=x.camelCase(e);if(i&&t===undefined){if(n=L.get(i,e),n!==undefined)return n;if(n=L.get(i,r),n!==undefined)return n;if(n=P(i,r,undefined),n!==undefined)return n}else this.each(function(){var n=L.get(this,r);L.set(this,r,t),-1!==e.indexOf("-")&&n!==undefined&&L.set(this,e,t)})},null,t,arguments.length>1,null,!0)},removeData:function(e){return this.each(function(){L.remove(this,e)})}});function P(e,t,n){var r;if(n===undefined&&1===e.nodeType)if(r="data-"+t.replace(O,"-$1").toLowerCase(),n=e.getAttribute(r),"string"==typeof n){try{n="true"===n?!0:"false"===n?!1:"null"===n?null:+n+""===n?+n:q.test(n)?JSON.parse(n):n}catch(i){}L.set(e,t,n)}else n=undefined;return n}x.extend({queue:function(e,t,n){var r;return e?(t=(t||"fx")+"queue",r=H.get(e,t),n&&(!r||x.isArray(n)?r=H.access(e,t,x.makeArray(n)):r.push(n)),r||[]):undefined},dequeue:function(e,t){t=t||"fx";var n=x.queue(e,t),r=n.length,i=n.shift(),o=x._queueHooks(e,t),s=function(){x.dequeue(e,t)};"inprogress"===i&&(i=n.shift(),r--),o.cur=i,i&&("fx"===t&&n.unshift("inprogress"),delete o.stop,i.call(e,s,o)),!r&&o&&o.empty.fire()
},_queueHooks:function(e,t){var n=t+"queueHooks";return H.get(e,n)||H.access(e,n,{empty:x.Callbacks("once memory").add(function(){H.remove(e,[t+"queue",n])})})}}),x.fn.extend({queue:function(e,t){var n=2;return"string"!=typeof e&&(t=e,e="fx",n--),n>arguments.length?x.queue(this[0],e):t===undefined?this:this.each(function(){var n=x.queue(this,e,t);x._queueHooks(this,e),"fx"===e&&"inprogress"!==n[0]&&x.dequeue(this,e)})},dequeue:function(e){return this.each(function(){x.dequeue(this,e)})},delay:function(e,t){return e=x.fx?x.fx.speeds[e]||e:e,t=t||"fx",this.queue(t,function(t,n){var r=setTimeout(t,e);n.stop=function(){clearTimeout(r)}})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,t){var n,r=1,i=x.Deferred(),o=this,s=this.length,a=function(){--r||i.resolveWith(o,[o])};"string"!=typeof e&&(t=e,e=undefined),e=e||"fx";while(s--)n=H.get(o[s],e+"queueHooks"),n&&n.empty&&(r++,n.empty.add(a));return a(),i.promise(t)}});var R,M,W=/[\t\r\n\f]/g,$=/\r/g,B=/^(?:input|select|textarea|button)$/i;x.fn.extend({attr:function(e,t){return x.access(this,x.attr,e,t,arguments.length>1)},removeAttr:function(e){return this.each(function(){x.removeAttr(this,e)})},prop:function(e,t){return x.access(this,x.prop,e,t,arguments.length>1)},removeProp:function(e){return this.each(function(){delete this[x.propFix[e]||e]})},addClass:function(e){var t,n,r,i,o,s=0,a=this.length,u="string"==typeof e&&e;if(x.isFunction(e))return this.each(function(t){x(this).addClass(e.call(this,t,this.className))});if(u)for(t=(e||"").match(w)||[];a>s;s++)if(n=this[s],r=1===n.nodeType&&(n.className?(" "+n.className+" ").replace(W," "):" ")){o=0;while(i=t[o++])0>r.indexOf(" "+i+" ")&&(r+=i+" ");n.className=x.trim(r)}return this},removeClass:function(e){var t,n,r,i,o,s=0,a=this.length,u=0===arguments.length||"string"==typeof e&&e;if(x.isFunction(e))return this.each(function(t){x(this).removeClass(e.call(this,t,this.className))});if(u)for(t=(e||"").match(w)||[];a>s;s++)if(n=this[s],r=1===n.nodeType&&(n.className?(" "+n.className+" ").replace(W," "):"")){o=0;while(i=t[o++])while(r.indexOf(" "+i+" ")>=0)r=r.replace(" "+i+" "," ");n.className=e?x.trim(r):""}return this},toggleClass:function(e,t){var n=typeof e,i="boolean"==typeof t;return x.isFunction(e)?this.each(function(n){x(this).toggleClass(e.call(this,n,this.className,t),t)}):this.each(function(){if("string"===n){var o,s=0,a=x(this),u=t,l=e.match(w)||[];while(o=l[s++])u=i?u:!a.hasClass(o),a[u?"addClass":"removeClass"](o)}else(n===r||"boolean"===n)&&(this.className&&H.set(this,"__className__",this.className),this.className=this.className||e===!1?"":H.get(this,"__className__")||"")})},hasClass:function(e){var t=" "+e+" ",n=0,r=this.length;for(;r>n;n++)if(1===this[n].nodeType&&(" "+this[n].className+" ").replace(W," ").indexOf(t)>=0)return!0;return!1},val:function(e){var t,n,r,i=this[0];{if(arguments.length)return r=x.isFunction(e),this.each(function(n){var i;1===this.nodeType&&(i=r?e.call(this,n,x(this).val()):e,null==i?i="":"number"==typeof i?i+="":x.isArray(i)&&(i=x.map(i,function(e){return null==e?"":e+""})),t=x.valHooks[this.type]||x.valHooks[this.nodeName.toLowerCase()],t&&"set"in t&&t.set(this,i,"value")!==undefined||(this.value=i))});if(i)return t=x.valHooks[i.type]||x.valHooks[i.nodeName.toLowerCase()],t&&"get"in t&&(n=t.get(i,"value"))!==undefined?n:(n=i.value,"string"==typeof n?n.replace($,""):null==n?"":n)}}}),x.extend({valHooks:{option:{get:function(e){var t=e.attributes.value;return!t||t.specified?e.value:e.text}},select:{get:function(e){var t,n,r=e.options,i=e.selectedIndex,o="select-one"===e.type||0>i,s=o?null:[],a=o?i+1:r.length,u=0>i?a:o?i:0;for(;a>u;u++)if(n=r[u],!(!n.selected&&u!==i||(x.support.optDisabled?n.disabled:null!==n.getAttribute("disabled"))||n.parentNode.disabled&&x.nodeName(n.parentNode,"optgroup"))){if(t=x(n).val(),o)return t;s.push(t)}return s},set:function(e,t){var n,r,i=e.options,o=x.makeArray(t),s=i.length;while(s--)r=i[s],(r.selected=x.inArray(x(r).val(),o)>=0)&&(n=!0);return n||(e.selectedIndex=-1),o}}},attr:function(e,t,n){var i,o,s=e.nodeType;if(e&&3!==s&&8!==s&&2!==s)return typeof e.getAttribute===r?x.prop(e,t,n):(1===s&&x.isXMLDoc(e)||(t=t.toLowerCase(),i=x.attrHooks[t]||(x.expr.match.bool.test(t)?M:R)),n===undefined?i&&"get"in i&&null!==(o=i.get(e,t))?o:(o=x.find.attr(e,t),null==o?undefined:o):null!==n?i&&"set"in i&&(o=i.set(e,n,t))!==undefined?o:(e.setAttribute(t,n+""),n):(x.removeAttr(e,t),undefined))},removeAttr:function(e,t){var n,r,i=0,o=t&&t.match(w);if(o&&1===e.nodeType)while(n=o[i++])r=x.propFix[n]||n,x.expr.match.bool.test(n)&&(e[r]=!1),e.removeAttribute(n)},attrHooks:{type:{set:function(e,t){if(!x.support.radioValue&&"radio"===t&&x.nodeName(e,"input")){var n=e.value;return e.setAttribute("type",t),n&&(e.value=n),t}}}},propFix:{"for":"htmlFor","class":"className"},prop:function(e,t,n){var r,i,o,s=e.nodeType;if(e&&3!==s&&8!==s&&2!==s)return o=1!==s||!x.isXMLDoc(e),o&&(t=x.propFix[t]||t,i=x.propHooks[t]),n!==undefined?i&&"set"in i&&(r=i.set(e,n,t))!==undefined?r:e[t]=n:i&&"get"in i&&null!==(r=i.get(e,t))?r:e[t]},propHooks:{tabIndex:{get:function(e){return e.hasAttribute("tabindex")||B.test(e.nodeName)||e.href?e.tabIndex:-1}}}}),M={set:function(e,t,n){return t===!1?x.removeAttr(e,n):e.setAttribute(n,n),n}},x.each(x.expr.match.bool.source.match(/\w+/g),function(e,t){var n=x.expr.attrHandle[t]||x.find.attr;x.expr.attrHandle[t]=function(e,t,r){var i=x.expr.attrHandle[t],o=r?undefined:(x.expr.attrHandle[t]=undefined)!=n(e,t,r)?t.toLowerCase():null;return x.expr.attrHandle[t]=i,o}}),x.support.optSelected||(x.propHooks.selected={get:function(e){var t=e.parentNode;return t&&t.parentNode&&t.parentNode.selectedIndex,null}}),x.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){x.propFix[this.toLowerCase()]=this}),x.each(["radio","checkbox"],function(){x.valHooks[this]={set:function(e,t){return x.isArray(t)?e.checked=x.inArray(x(e).val(),t)>=0:undefined}},x.support.checkOn||(x.valHooks[this].get=function(e){return null===e.getAttribute("value")?"on":e.value})});var I=/^key/,z=/^(?:mouse|contextmenu)|click/,_=/^(?:focusinfocus|focusoutblur)$/,X=/^([^.]*)(?:\.(.+)|)$/;function U(){return!0}function Y(){return!1}function V(){try{return o.activeElement}catch(e){}}x.event={global:{},add:function(e,t,n,i,o){var s,a,u,l,c,f,p,h,d,g,m,y=H.get(e);if(y){n.handler&&(s=n,n=s.handler,o=s.selector),n.guid||(n.guid=x.guid++),(l=y.events)||(l=y.events={}),(a=y.handle)||(a=y.handle=function(e){return typeof x===r||e&&x.event.triggered===e.type?undefined:x.event.dispatch.apply(a.elem,arguments)},a.elem=e),t=(t||"").match(w)||[""],c=t.length;while(c--)u=X.exec(t[c])||[],d=m=u[1],g=(u[2]||"").split(".").sort(),d&&(p=x.event.special[d]||{},d=(o?p.delegateType:p.bindType)||d,p=x.event.special[d]||{},f=x.extend({type:d,origType:m,data:i,handler:n,guid:n.guid,selector:o,needsContext:o&&x.expr.match.needsContext.test(o),namespace:g.join(".")},s),(h=l[d])||(h=l[d]=[],h.delegateCount=0,p.setup&&p.setup.call(e,i,g,a)!==!1||e.addEventListener&&e.addEventListener(d,a,!1)),p.add&&(p.add.call(e,f),f.handler.guid||(f.handler.guid=n.guid)),o?h.splice(h.delegateCount++,0,f):h.push(f),x.event.global[d]=!0);e=null}},remove:function(e,t,n,r,i){var o,s,a,u,l,c,f,p,h,d,g,m=H.hasData(e)&&H.get(e);if(m&&(u=m.events)){t=(t||"").match(w)||[""],l=t.length;while(l--)if(a=X.exec(t[l])||[],h=g=a[1],d=(a[2]||"").split(".").sort(),h){f=x.event.special[h]||{},h=(r?f.delegateType:f.bindType)||h,p=u[h]||[],a=a[2]&&RegExp("(^|\\.)"+d.join("\\.(?:.*\\.|)")+"(\\.|$)"),s=o=p.length;while(o--)c=p[o],!i&&g!==c.origType||n&&n.guid!==c.guid||a&&!a.test(c.namespace)||r&&r!==c.selector&&("**"!==r||!c.selector)||(p.splice(o,1),c.selector&&p.delegateCount--,f.remove&&f.remove.call(e,c));s&&!p.length&&(f.teardown&&f.teardown.call(e,d,m.handle)!==!1||x.removeEvent(e,h,m.handle),delete u[h])}else for(h in u)x.event.remove(e,h+t[l],n,r,!0);x.isEmptyObject(u)&&(delete m.handle,H.remove(e,"events"))}},trigger:function(t,n,r,i){var s,a,u,l,c,f,p,h=[r||o],d=y.call(t,"type")?t.type:t,g=y.call(t,"namespace")?t.namespace.split("."):[];if(a=u=r=r||o,3!==r.nodeType&&8!==r.nodeType&&!_.test(d+x.event.triggered)&&(d.indexOf(".")>=0&&(g=d.split("."),d=g.shift(),g.sort()),c=0>d.indexOf(":")&&"on"+d,t=t[x.expando]?t:new x.Event(d,"object"==typeof t&&t),t.isTrigger=i?2:3,t.namespace=g.join("."),t.namespace_re=t.namespace?RegExp("(^|\\.)"+g.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,t.result=undefined,t.target||(t.target=r),n=null==n?[t]:x.makeArray(n,[t]),p=x.event.special[d]||{},i||!p.trigger||p.trigger.apply(r,n)!==!1)){if(!i&&!p.noBubble&&!x.isWindow(r)){for(l=p.delegateType||d,_.test(l+d)||(a=a.parentNode);a;a=a.parentNode)h.push(a),u=a;u===(r.ownerDocument||o)&&h.push(u.defaultView||u.parentWindow||e)}s=0;while((a=h[s++])&&!t.isPropagationStopped())t.type=s>1?l:p.bindType||d,f=(H.get(a,"events")||{})[t.type]&&H.get(a,"handle"),f&&f.apply(a,n),f=c&&a[c],f&&x.acceptData(a)&&f.apply&&f.apply(a,n)===!1&&t.preventDefault();return t.type=d,i||t.isDefaultPrevented()||p._default&&p._default.apply(h.pop(),n)!==!1||!x.acceptData(r)||c&&x.isFunction(r[d])&&!x.isWindow(r)&&(u=r[c],u&&(r[c]=null),x.event.triggered=d,r[d](),x.event.triggered=undefined,u&&(r[c]=u)),t.result}},dispatch:function(e){e=x.event.fix(e);var t,n,r,i,o,s=[],a=d.call(arguments),u=(H.get(this,"events")||{})[e.type]||[],l=x.event.special[e.type]||{};if(a[0]=e,e.delegateTarget=this,!l.preDispatch||l.preDispatch.call(this,e)!==!1){s=x.event.handlers.call(this,e,u),t=0;while((i=s[t++])&&!e.isPropagationStopped()){e.currentTarget=i.elem,n=0;while((o=i.handlers[n++])&&!e.isImmediatePropagationStopped())(!e.namespace_re||e.namespace_re.test(o.namespace))&&(e.handleObj=o,e.data=o.data,r=((x.event.special[o.origType]||{}).handle||o.handler).apply(i.elem,a),r!==undefined&&(e.result=r)===!1&&(e.preventDefault(),e.stopPropagation()))}return l.postDispatch&&l.postDispatch.call(this,e),e.result}},handlers:function(e,t){var n,r,i,o,s=[],a=t.delegateCount,u=e.target;if(a&&u.nodeType&&(!e.button||"click"!==e.type))for(;u!==this;u=u.parentNode||this)if(u.disabled!==!0||"click"!==e.type){for(r=[],n=0;a>n;n++)o=t[n],i=o.selector+" ",r[i]===undefined&&(r[i]=o.needsContext?x(i,this).index(u)>=0:x.find(i,this,null,[u]).length),r[i]&&r.push(o);r.length&&s.push({elem:u,handlers:r})}return t.length>a&&s.push({elem:this,handlers:t.slice(a)}),s},props:"altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(e,t){return null==e.which&&(e.which=null!=t.charCode?t.charCode:t.keyCode),e}},mouseHooks:{props:"button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(e,t){var n,r,i,s=t.button;return null==e.pageX&&null!=t.clientX&&(n=e.target.ownerDocument||o,r=n.documentElement,i=n.body,e.pageX=t.clientX+(r&&r.scrollLeft||i&&i.scrollLeft||0)-(r&&r.clientLeft||i&&i.clientLeft||0),e.pageY=t.clientY+(r&&r.scrollTop||i&&i.scrollTop||0)-(r&&r.clientTop||i&&i.clientTop||0)),e.which||s===undefined||(e.which=1&s?1:2&s?3:4&s?2:0),e}},fix:function(e){if(e[x.expando])return e;var t,n,r,i=e.type,s=e,a=this.fixHooks[i];a||(this.fixHooks[i]=a=z.test(i)?this.mouseHooks:I.test(i)?this.keyHooks:{}),r=a.props?this.props.concat(a.props):this.props,e=new x.Event(s),t=r.length;while(t--)n=r[t],e[n]=s[n];return e.target||(e.target=o),3===e.target.nodeType&&(e.target=e.target.parentNode),a.filter?a.filter(e,s):e},special:{load:{noBubble:!0},focus:{trigger:function(){return this!==V()&&this.focus?(this.focus(),!1):undefined},delegateType:"focusin"},blur:{trigger:function(){return this===V()&&this.blur?(this.blur(),!1):undefined},delegateType:"focusout"},click:{trigger:function(){return"checkbox"===this.type&&this.click&&x.nodeName(this,"input")?(this.click(),!1):undefined},_default:function(e){return x.nodeName(e.target,"a")}},beforeunload:{postDispatch:function(e){e.result!==undefined&&(e.originalEvent.returnValue=e.result)}}},simulate:function(e,t,n,r){var i=x.extend(new x.Event,n,{type:e,isSimulated:!0,originalEvent:{}});r?x.event.trigger(i,null,t):x.event.dispatch.call(t,i),i.isDefaultPrevented()&&n.preventDefault()}},x.removeEvent=function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n,!1)},x.Event=function(e,t){return this instanceof x.Event?(e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||e.getPreventDefault&&e.getPreventDefault()?U:Y):this.type=e,t&&x.extend(this,t),this.timeStamp=e&&e.timeStamp||x.now(),this[x.expando]=!0,undefined):new x.Event(e,t)},x.Event.prototype={isDefaultPrevented:Y,isPropagationStopped:Y,isImmediatePropagationStopped:Y,preventDefault:function(){var e=this.originalEvent;this.isDefaultPrevented=U,e&&e.preventDefault&&e.preventDefault()},stopPropagation:function(){var e=this.originalEvent;this.isPropagationStopped=U,e&&e.stopPropagation&&e.stopPropagation()},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=U,this.stopPropagation()}},x.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(e,t){x.event.special[e]={delegateType:t,bindType:t,handle:function(e){var n,r=this,i=e.relatedTarget,o=e.handleObj;return(!i||i!==r&&!x.contains(r,i))&&(e.type=o.origType,n=o.handler.apply(this,arguments),e.type=t),n}}}),x.support.focusinBubbles||x.each({focus:"focusin",blur:"focusout"},function(e,t){var n=0,r=function(e){x.event.simulate(t,e.target,x.event.fix(e),!0)};x.event.special[t]={setup:function(){0===n++&&o.addEventListener(e,r,!0)},teardown:function(){0===--n&&o.removeEventListener(e,r,!0)}}}),x.fn.extend({on:function(e,t,n,r,i){var o,s;if("object"==typeof e){"string"!=typeof t&&(n=n||t,t=undefined);for(s in e)this.on(s,t,n,e[s],i);return this}if(null==n&&null==r?(r=t,n=t=undefined):null==r&&("string"==typeof t?(r=n,n=undefined):(r=n,n=t,t=undefined)),r===!1)r=Y;else if(!r)return this;return 1===i&&(o=r,r=function(e){return x().off(e),o.apply(this,arguments)},r.guid=o.guid||(o.guid=x.guid++)),this.each(function(){x.event.add(this,e,r,n,t)})},one:function(e,t,n,r){return this.on(e,t,n,r,1)},off:function(e,t,n){var r,i;if(e&&e.preventDefault&&e.handleObj)return r=e.handleObj,x(e.delegateTarget).off(r.namespace?r.origType+"."+r.namespace:r.origType,r.selector,r.handler),this;if("object"==typeof e){for(i in e)this.off(i,t,e[i]);return this}return(t===!1||"function"==typeof t)&&(n=t,t=undefined),n===!1&&(n=Y),this.each(function(){x.event.remove(this,e,n,t)})},trigger:function(e,t){return this.each(function(){x.event.trigger(e,t,this)})},triggerHandler:function(e,t){var n=this[0];return n?x.event.trigger(e,t,n,!0):undefined}});var G=/^.[^:#\[\.,]*$/,J=/^(?:parents|prev(?:Until|All))/,Q=x.expr.match.needsContext,K={children:!0,contents:!0,next:!0,prev:!0};x.fn.extend({find:function(e){var t,n=[],r=this,i=r.length;if("string"!=typeof e)return this.pushStack(x(e).filter(function(){for(t=0;i>t;t++)if(x.contains(r[t],this))return!0}));for(t=0;i>t;t++)x.find(e,r[t],n);return n=this.pushStack(i>1?x.unique(n):n),n.selector=this.selector?this.selector+" "+e:e,n},has:function(e){var t=x(e,this),n=t.length;return this.filter(function(){var e=0;for(;n>e;e++)if(x.contains(this,t[e]))return!0})},not:function(e){return this.pushStack(et(this,e||[],!0))},filter:function(e){return this.pushStack(et(this,e||[],!1))},is:function(e){return!!et(this,"string"==typeof e&&Q.test(e)?x(e):e||[],!1).length},closest:function(e,t){var n,r=0,i=this.length,o=[],s=Q.test(e)||"string"!=typeof e?x(e,t||this.context):0;for(;i>r;r++)for(n=this[r];n&&n!==t;n=n.parentNode)if(11>n.nodeType&&(s?s.index(n)>-1:1===n.nodeType&&x.find.matchesSelector(n,e))){n=o.push(n);break}return this.pushStack(o.length>1?x.unique(o):o)},index:function(e){return e?"string"==typeof e?g.call(x(e),this[0]):g.call(this,e.jquery?e[0]:e):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(e,t){var n="string"==typeof e?x(e,t):x.makeArray(e&&e.nodeType?[e]:e),r=x.merge(this.get(),n);return this.pushStack(x.unique(r))},addBack:function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}});function Z(e,t){while((e=e[t])&&1!==e.nodeType);return e}x.each({parent:function(e){var t=e.parentNode;return t&&11!==t.nodeType?t:null},parents:function(e){return x.dir(e,"parentNode")},parentsUntil:function(e,t,n){return x.dir(e,"parentNode",n)},next:function(e){return Z(e,"nextSibling")},prev:function(e){return Z(e,"previousSibling")},nextAll:function(e){return x.dir(e,"nextSibling")},prevAll:function(e){return x.dir(e,"previousSibling")},nextUntil:function(e,t,n){return x.dir(e,"nextSibling",n)},prevUntil:function(e,t,n){return x.dir(e,"previousSibling",n)},siblings:function(e){return x.sibling((e.parentNode||{}).firstChild,e)},children:function(e){return x.sibling(e.firstChild)},contents:function(e){return x.nodeName(e,"iframe")?e.contentDocument||e.contentWindow.document:x.merge([],e.childNodes)}},function(e,t){x.fn[e]=function(n,r){var i=x.map(this,t,n);return"Until"!==e.slice(-5)&&(r=n),r&&"string"==typeof r&&(i=x.filter(r,i)),this.length>1&&(K[e]||x.unique(i),J.test(e)&&i.reverse()),this.pushStack(i)}}),x.extend({filter:function(e,t,n){var r=t[0];return n&&(e=":not("+e+")"),1===t.length&&1===r.nodeType?x.find.matchesSelector(r,e)?[r]:[]:x.find.matches(e,x.grep(t,function(e){return 1===e.nodeType}))},dir:function(e,t,n){var r=[],i=n!==undefined;while((e=e[t])&&9!==e.nodeType)if(1===e.nodeType){if(i&&x(e).is(n))break;r.push(e)}return r},sibling:function(e,t){var n=[];for(;e;e=e.nextSibling)1===e.nodeType&&e!==t&&n.push(e);return n}});function et(e,t,n){if(x.isFunction(t))return x.grep(e,function(e,r){return!!t.call(e,r,e)!==n});if(t.nodeType)return x.grep(e,function(e){return e===t!==n});if("string"==typeof t){if(G.test(t))return x.filter(t,e,n);t=x.filter(t,e)}return x.grep(e,function(e){return g.call(t,e)>=0!==n})}var tt=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,nt=/<([\w:]+)/,rt=/<|&#?\w+;/,it=/<(?:script|style|link)/i,ot=/^(?:checkbox|radio)$/i,st=/checked\s*(?:[^=]|=\s*.checked.)/i,at=/^$|\/(?:java|ecma)script/i,ut=/^true\/(.*)/,lt=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,ct={option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};ct.optgroup=ct.option,ct.tbody=ct.tfoot=ct.colgroup=ct.caption=ct.thead,ct.th=ct.td,x.fn.extend({text:function(e){return x.access(this,function(e){return e===undefined?x.text(this):this.empty().append((this[0]&&this[0].ownerDocument||o).createTextNode(e))},null,e,arguments.length)},append:function(){return this.domManip(arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=ft(this,e);t.appendChild(e)}})},prepend:function(){return this.domManip(arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=ft(this,e);t.insertBefore(e,t.firstChild)}})},before:function(){return this.domManip(arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this)})},after:function(){return this.domManip(arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this.nextSibling)})},remove:function(e,t){var n,r=e?x.filter(e,this):this,i=0;for(;null!=(n=r[i]);i++)t||1!==n.nodeType||x.cleanData(mt(n)),n.parentNode&&(t&&x.contains(n.ownerDocument,n)&&dt(mt(n,"script")),n.parentNode.removeChild(n));return this},empty:function(){var e,t=0;for(;null!=(e=this[t]);t++)1===e.nodeType&&(x.cleanData(mt(e,!1)),e.textContent="");return this},clone:function(e,t){return e=null==e?!1:e,t=null==t?e:t,this.map(function(){return x.clone(this,e,t)})},html:function(e){return x.access(this,function(e){var t=this[0]||{},n=0,r=this.length;if(e===undefined&&1===t.nodeType)return t.innerHTML;if("string"==typeof e&&!it.test(e)&&!ct[(nt.exec(e)||["",""])[1].toLowerCase()]){e=e.replace(tt,"<$1></$2>");try{for(;r>n;n++)t=this[n]||{},1===t.nodeType&&(x.cleanData(mt(t,!1)),t.innerHTML=e);t=0}catch(i){}}t&&this.empty().append(e)},null,e,arguments.length)},replaceWith:function(){var e=x.map(this,function(e){return[e.nextSibling,e.parentNode]}),t=0;return this.domManip(arguments,function(n){var r=e[t++],i=e[t++];i&&(r&&r.parentNode!==i&&(r=this.nextSibling),x(this).remove(),i.insertBefore(n,r))},!0),t?this:this.remove()},detach:function(e){return this.remove(e,!0)},domManip:function(e,t,n){e=p.apply([],e);var r,i,o,s,a,u,l=0,c=this.length,f=this,h=c-1,d=e[0],g=x.isFunction(d);if(g||!(1>=c||"string"!=typeof d||x.support.checkClone)&&st.test(d))return this.each(function(r){var i=f.eq(r);g&&(e[0]=d.call(this,r,i.html())),i.domManip(e,t,n)});if(c&&(r=x.buildFragment(e,this[0].ownerDocument,!1,!n&&this),i=r.firstChild,1===r.childNodes.length&&(r=i),i)){for(o=x.map(mt(r,"script"),pt),s=o.length;c>l;l++)a=r,l!==h&&(a=x.clone(a,!0,!0),s&&x.merge(o,mt(a,"script"))),t.call(this[l],a,l);if(s)for(u=o[o.length-1].ownerDocument,x.map(o,ht),l=0;s>l;l++)a=o[l],at.test(a.type||"")&&!H.access(a,"globalEval")&&x.contains(u,a)&&(a.src?x._evalUrl(a.src):x.globalEval(a.textContent.replace(lt,"")))}return this}}),x.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,t){x.fn[e]=function(e){var n,r=[],i=x(e),o=i.length-1,s=0;for(;o>=s;s++)n=s===o?this:this.clone(!0),x(i[s])[t](n),h.apply(r,n.get());return this.pushStack(r)}}),x.extend({clone:function(e,t,n){var r,i,o,s,a=e.cloneNode(!0),u=x.contains(e.ownerDocument,e);if(!(x.support.noCloneChecked||1!==e.nodeType&&11!==e.nodeType||x.isXMLDoc(e)))for(s=mt(a),o=mt(e),r=0,i=o.length;i>r;r++)yt(o[r],s[r]);if(t)if(n)for(o=o||mt(e),s=s||mt(a),r=0,i=o.length;i>r;r++)gt(o[r],s[r]);else gt(e,a);return s=mt(a,"script"),s.length>0&&dt(s,!u&&mt(e,"script")),a},buildFragment:function(e,t,n,r){var i,o,s,a,u,l,c=0,f=e.length,p=t.createDocumentFragment(),h=[];for(;f>c;c++)if(i=e[c],i||0===i)if("object"===x.type(i))x.merge(h,i.nodeType?[i]:i);else if(rt.test(i)){o=o||p.appendChild(t.createElement("div")),s=(nt.exec(i)||["",""])[1].toLowerCase(),a=ct[s]||ct._default,o.innerHTML=a[1]+i.replace(tt,"<$1></$2>")+a[2],l=a[0];while(l--)o=o.firstChild;x.merge(h,o.childNodes),o=p.firstChild,o.textContent=""}else h.push(t.createTextNode(i));p.textContent="",c=0;while(i=h[c++])if((!r||-1===x.inArray(i,r))&&(u=x.contains(i.ownerDocument,i),o=mt(p.appendChild(i),"script"),u&&dt(o),n)){l=0;while(i=o[l++])at.test(i.type||"")&&n.push(i)}return p},cleanData:function(e){var t,n,r,i,o,s,a=x.event.special,u=0;for(;(n=e[u])!==undefined;u++){if(F.accepts(n)&&(o=n[H.expando],o&&(t=H.cache[o]))){if(r=Object.keys(t.events||{}),r.length)for(s=0;(i=r[s])!==undefined;s++)a[i]?x.event.remove(n,i):x.removeEvent(n,i,t.handle);H.cache[o]&&delete H.cache[o]}delete L.cache[n[L.expando]]}},_evalUrl:function(e){return x.ajax({url:e,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0})}});function ft(e,t){return x.nodeName(e,"table")&&x.nodeName(1===t.nodeType?t:t.firstChild,"tr")?e.getElementsByTagName("tbody")[0]||e.appendChild(e.ownerDocument.createElement("tbody")):e}function pt(e){return e.type=(null!==e.getAttribute("type"))+"/"+e.type,e}function ht(e){var t=ut.exec(e.type);return t?e.type=t[1]:e.removeAttribute("type"),e}function dt(e,t){var n=e.length,r=0;for(;n>r;r++)H.set(e[r],"globalEval",!t||H.get(t[r],"globalEval"))}function gt(e,t){var n,r,i,o,s,a,u,l;if(1===t.nodeType){if(H.hasData(e)&&(o=H.access(e),s=H.set(t,o),l=o.events)){delete s.handle,s.events={};for(i in l)for(n=0,r=l[i].length;r>n;n++)x.event.add(t,i,l[i][n])}L.hasData(e)&&(a=L.access(e),u=x.extend({},a),L.set(t,u))}}function mt(e,t){var n=e.getElementsByTagName?e.getElementsByTagName(t||"*"):e.querySelectorAll?e.querySelectorAll(t||"*"):[];return t===undefined||t&&x.nodeName(e,t)?x.merge([e],n):n}function yt(e,t){var n=t.nodeName.toLowerCase();"input"===n&&ot.test(e.type)?t.checked=e.checked:("input"===n||"textarea"===n)&&(t.defaultValue=e.defaultValue)}x.fn.extend({wrapAll:function(e){var t;return x.isFunction(e)?this.each(function(t){x(this).wrapAll(e.call(this,t))}):(this[0]&&(t=x(e,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){var e=this;while(e.firstElementChild)e=e.firstElementChild;return e}).append(this)),this)},wrapInner:function(e){return x.isFunction(e)?this.each(function(t){x(this).wrapInner(e.call(this,t))}):this.each(function(){var t=x(this),n=t.contents();n.length?n.wrapAll(e):t.append(e)})},wrap:function(e){var t=x.isFunction(e);return this.each(function(n){x(this).wrapAll(t?e.call(this,n):e)})},unwrap:function(){return this.parent().each(function(){x.nodeName(this,"body")||x(this).replaceWith(this.childNodes)}).end()}});var vt,xt,bt=/^(none|table(?!-c[ea]).+)/,wt=/^margin/,Tt=RegExp("^("+b+")(.*)$","i"),Ct=RegExp("^("+b+")(?!px)[a-z%]+$","i"),kt=RegExp("^([+-])=("+b+")","i"),Nt={BODY:"block"},Et={position:"absolute",visibility:"hidden",display:"block"},St={letterSpacing:0,fontWeight:400},jt=["Top","Right","Bottom","Left"],Dt=["Webkit","O","Moz","ms"];function At(e,t){if(t in e)return t;var n=t.charAt(0).toUpperCase()+t.slice(1),r=t,i=Dt.length;while(i--)if(t=Dt[i]+n,t in e)return t;return r}function Lt(e,t){return e=t||e,"none"===x.css(e,"display")||!x.contains(e.ownerDocument,e)}function Ht(t){return e.getComputedStyle(t,null)}function qt(e,t){var n,r,i,o=[],s=0,a=e.length;for(;a>s;s++)r=e[s],r.style&&(o[s]=H.get(r,"olddisplay"),n=r.style.display,t?(o[s]||"none"!==n||(r.style.display=""),""===r.style.display&&Lt(r)&&(o[s]=H.access(r,"olddisplay",Rt(r.nodeName)))):o[s]||(i=Lt(r),(n&&"none"!==n||!i)&&H.set(r,"olddisplay",i?n:x.css(r,"display"))));for(s=0;a>s;s++)r=e[s],r.style&&(t&&"none"!==r.style.display&&""!==r.style.display||(r.style.display=t?o[s]||"":"none"));return e}x.fn.extend({css:function(e,t){return x.access(this,function(e,t,n){var r,i,o={},s=0;if(x.isArray(t)){for(r=Ht(e),i=t.length;i>s;s++)o[t[s]]=x.css(e,t[s],!1,r);return o}return n!==undefined?x.style(e,t,n):x.css(e,t)},e,t,arguments.length>1)},show:function(){return qt(this,!0)},hide:function(){return qt(this)},toggle:function(e){var t="boolean"==typeof e;return this.each(function(){(t?e:Lt(this))?x(this).show():x(this).hide()})}}),x.extend({cssHooks:{opacity:{get:function(e,t){if(t){var n=vt(e,"opacity");return""===n?"1":n}}}},cssNumber:{columnCount:!0,fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":"cssFloat"},style:function(e,t,n,r){if(e&&3!==e.nodeType&&8!==e.nodeType&&e.style){var i,o,s,a=x.camelCase(t),u=e.style;return t=x.cssProps[a]||(x.cssProps[a]=At(u,a)),s=x.cssHooks[t]||x.cssHooks[a],n===undefined?s&&"get"in s&&(i=s.get(e,!1,r))!==undefined?i:u[t]:(o=typeof n,"string"===o&&(i=kt.exec(n))&&(n=(i[1]+1)*i[2]+parseFloat(x.css(e,t)),o="number"),null==n||"number"===o&&isNaN(n)||("number"!==o||x.cssNumber[a]||(n+="px"),x.support.clearCloneStyle||""!==n||0!==t.indexOf("background")||(u[t]="inherit"),s&&"set"in s&&(n=s.set(e,n,r))===undefined||(u[t]=n)),undefined)}},css:function(e,t,n,r){var i,o,s,a=x.camelCase(t);return t=x.cssProps[a]||(x.cssProps[a]=At(e.style,a)),s=x.cssHooks[t]||x.cssHooks[a],s&&"get"in s&&(i=s.get(e,!0,n)),i===undefined&&(i=vt(e,t,r)),"normal"===i&&t in St&&(i=St[t]),""===n||n?(o=parseFloat(i),n===!0||x.isNumeric(o)?o||0:i):i}}),vt=function(e,t,n){var r,i,o,s=n||Ht(e),a=s?s.getPropertyValue(t)||s[t]:undefined,u=e.style;return s&&(""!==a||x.contains(e.ownerDocument,e)||(a=x.style(e,t)),Ct.test(a)&&wt.test(t)&&(r=u.width,i=u.minWidth,o=u.maxWidth,u.minWidth=u.maxWidth=u.width=a,a=s.width,u.width=r,u.minWidth=i,u.maxWidth=o)),a};function Ot(e,t,n){var r=Tt.exec(t);return r?Math.max(0,r[1]-(n||0))+(r[2]||"px"):t}function Ft(e,t,n,r,i){var o=n===(r?"border":"content")?4:"width"===t?1:0,s=0;for(;4>o;o+=2)"margin"===n&&(s+=x.css(e,n+jt[o],!0,i)),r?("content"===n&&(s-=x.css(e,"padding"+jt[o],!0,i)),"margin"!==n&&(s-=x.css(e,"border"+jt[o]+"Width",!0,i))):(s+=x.css(e,"padding"+jt[o],!0,i),"padding"!==n&&(s+=x.css(e,"border"+jt[o]+"Width",!0,i)));return s}function Pt(e,t,n){var r=!0,i="width"===t?e.offsetWidth:e.offsetHeight,o=Ht(e),s=x.support.boxSizing&&"border-box"===x.css(e,"boxSizing",!1,o);if(0>=i||null==i){if(i=vt(e,t,o),(0>i||null==i)&&(i=e.style[t]),Ct.test(i))return i;r=s&&(x.support.boxSizingReliable||i===e.style[t]),i=parseFloat(i)||0}return i+Ft(e,t,n||(s?"border":"content"),r,o)+"px"}function Rt(e){var t=o,n=Nt[e];return n||(n=Mt(e,t),"none"!==n&&n||(xt=(xt||x("<iframe frameborder='0' width='0' height='0'/>").css("cssText","display:block !important")).appendTo(t.documentElement),t=(xt[0].contentWindow||xt[0].contentDocument).document,t.write("<!doctype html><html><body>"),t.close(),n=Mt(e,t),xt.detach()),Nt[e]=n),n}function Mt(e,t){var n=x(t.createElement(e)).appendTo(t.body),r=x.css(n[0],"display");return n.remove(),r}x.each(["height","width"],function(e,t){x.cssHooks[t]={get:function(e,n,r){return n?0===e.offsetWidth&&bt.test(x.css(e,"display"))?x.swap(e,Et,function(){return Pt(e,t,r)}):Pt(e,t,r):undefined},set:function(e,n,r){var i=r&&Ht(e);return Ot(e,n,r?Ft(e,t,r,x.support.boxSizing&&"border-box"===x.css(e,"boxSizing",!1,i),i):0)}}}),x(function(){x.support.reliableMarginRight||(x.cssHooks.marginRight={get:function(e,t){return t?x.swap(e,{display:"inline-block"},vt,[e,"marginRight"]):undefined}}),!x.support.pixelPosition&&x.fn.position&&x.each(["top","left"],function(e,t){x.cssHooks[t]={get:function(e,n){return n?(n=vt(e,t),Ct.test(n)?x(e).position()[t]+"px":n):undefined}}})}),x.expr&&x.expr.filters&&(x.expr.filters.hidden=function(e){return 0>=e.offsetWidth&&0>=e.offsetHeight},x.expr.filters.visible=function(e){return!x.expr.filters.hidden(e)}),x.each({margin:"",padding:"",border:"Width"},function(e,t){x.cssHooks[e+t]={expand:function(n){var r=0,i={},o="string"==typeof n?n.split(" "):[n];for(;4>r;r++)i[e+jt[r]+t]=o[r]||o[r-2]||o[0];return i}},wt.test(e)||(x.cssHooks[e+t].set=Ot)});var Wt=/%20/g,$t=/\[\]$/,Bt=/\r?\n/g,It=/^(?:submit|button|image|reset|file)$/i,zt=/^(?:input|select|textarea|keygen)/i;x.fn.extend({serialize:function(){return x.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var e=x.prop(this,"elements");return e?x.makeArray(e):this}).filter(function(){var e=this.type;return this.name&&!x(this).is(":disabled")&&zt.test(this.nodeName)&&!It.test(e)&&(this.checked||!ot.test(e))}).map(function(e,t){var n=x(this).val();return null==n?null:x.isArray(n)?x.map(n,function(e){return{name:t.name,value:e.replace(Bt,"\r\n")}}):{name:t.name,value:n.replace(Bt,"\r\n")}}).get()}}),x.param=function(e,t){var n,r=[],i=function(e,t){t=x.isFunction(t)?t():null==t?"":t,r[r.length]=encodeURIComponent(e)+"="+encodeURIComponent(t)};if(t===undefined&&(t=x.ajaxSettings&&x.ajaxSettings.traditional),x.isArray(e)||e.jquery&&!x.isPlainObject(e))x.each(e,function(){i(this.name,this.value)});else for(n in e)_t(n,e[n],t,i);return r.join("&").replace(Wt,"+")};function _t(e,t,n,r){var i;if(x.isArray(t))x.each(t,function(t,i){n||$t.test(e)?r(e,i):_t(e+"["+("object"==typeof i?t:"")+"]",i,n,r)});else if(n||"object"!==x.type(t))r(e,t);else for(i in t)_t(e+"["+i+"]",t[i],n,r)}x.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(e,t){x.fn[t]=function(e,n){return arguments.length>0?this.on(t,null,e,n):this.trigger(t)}}),x.fn.extend({hover:function(e,t){return this.mouseenter(e).mouseleave(t||e)},bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)},delegate:function(e,t,n,r){return this.on(t,e,n,r)},undelegate:function(e,t,n){return 1===arguments.length?this.off(e,"**"):this.off(t,e||"**",n)
}});var Xt,Ut,Yt=x.now(),Vt=/\?/,Gt=/#.*$/,Jt=/([?&])_=[^&]*/,Qt=/^(.*?):[ \t]*([^\r\n]*)$/gm,Kt=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Zt=/^(?:GET|HEAD)$/,en=/^\/\//,tn=/^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,nn=x.fn.load,rn={},on={},sn="*/".concat("*");try{Ut=i.href}catch(an){Ut=o.createElement("a"),Ut.href="",Ut=Ut.href}Xt=tn.exec(Ut.toLowerCase())||[];function un(e){return function(t,n){"string"!=typeof t&&(n=t,t="*");var r,i=0,o=t.toLowerCase().match(w)||[];if(x.isFunction(n))while(r=o[i++])"+"===r[0]?(r=r.slice(1)||"*",(e[r]=e[r]||[]).unshift(n)):(e[r]=e[r]||[]).push(n)}}function ln(e,t,n,r){var i={},o=e===on;function s(a){var u;return i[a]=!0,x.each(e[a]||[],function(e,a){var l=a(t,n,r);return"string"!=typeof l||o||i[l]?o?!(u=l):undefined:(t.dataTypes.unshift(l),s(l),!1)}),u}return s(t.dataTypes[0])||!i["*"]&&s("*")}function cn(e,t){var n,r,i=x.ajaxSettings.flatOptions||{};for(n in t)t[n]!==undefined&&((i[n]?e:r||(r={}))[n]=t[n]);return r&&x.extend(!0,e,r),e}x.fn.load=function(e,t,n){if("string"!=typeof e&&nn)return nn.apply(this,arguments);var r,i,o,s=this,a=e.indexOf(" ");return a>=0&&(r=e.slice(a),e=e.slice(0,a)),x.isFunction(t)?(n=t,t=undefined):t&&"object"==typeof t&&(i="POST"),s.length>0&&x.ajax({url:e,type:i,dataType:"html",data:t}).done(function(e){o=arguments,s.html(r?x("<div>").append(x.parseHTML(e)).find(r):e)}).complete(n&&function(e,t){s.each(n,o||[e.responseText,t,e])}),this},x.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(e,t){x.fn[t]=function(e){return this.on(t,e)}}),x.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:Ut,type:"GET",isLocal:Kt.test(Xt[1]),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":sn,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":x.parseJSON,"text xml":x.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(e,t){return t?cn(cn(e,x.ajaxSettings),t):cn(x.ajaxSettings,e)},ajaxPrefilter:un(rn),ajaxTransport:un(on),ajax:function(e,t){"object"==typeof e&&(t=e,e=undefined),t=t||{};var n,r,i,o,s,a,u,l,c=x.ajaxSetup({},t),f=c.context||c,p=c.context&&(f.nodeType||f.jquery)?x(f):x.event,h=x.Deferred(),d=x.Callbacks("once memory"),g=c.statusCode||{},m={},y={},v=0,b="canceled",T={readyState:0,getResponseHeader:function(e){var t;if(2===v){if(!o){o={};while(t=Qt.exec(i))o[t[1].toLowerCase()]=t[2]}t=o[e.toLowerCase()]}return null==t?null:t},getAllResponseHeaders:function(){return 2===v?i:null},setRequestHeader:function(e,t){var n=e.toLowerCase();return v||(e=y[n]=y[n]||e,m[e]=t),this},overrideMimeType:function(e){return v||(c.mimeType=e),this},statusCode:function(e){var t;if(e)if(2>v)for(t in e)g[t]=[g[t],e[t]];else T.always(e[T.status]);return this},abort:function(e){var t=e||b;return n&&n.abort(t),k(0,t),this}};if(h.promise(T).complete=d.add,T.success=T.done,T.error=T.fail,c.url=((e||c.url||Ut)+"").replace(Gt,"").replace(en,Xt[1]+"//"),c.type=t.method||t.type||c.method||c.type,c.dataTypes=x.trim(c.dataType||"*").toLowerCase().match(w)||[""],null==c.crossDomain&&(a=tn.exec(c.url.toLowerCase()),c.crossDomain=!(!a||a[1]===Xt[1]&&a[2]===Xt[2]&&(a[3]||("http:"===a[1]?"80":"443"))===(Xt[3]||("http:"===Xt[1]?"80":"443")))),c.data&&c.processData&&"string"!=typeof c.data&&(c.data=x.param(c.data,c.traditional)),ln(rn,c,t,T),2===v)return T;u=c.global,u&&0===x.active++&&x.event.trigger("ajaxStart"),c.type=c.type.toUpperCase(),c.hasContent=!Zt.test(c.type),r=c.url,c.hasContent||(c.data&&(r=c.url+=(Vt.test(r)?"&":"?")+c.data,delete c.data),c.cache===!1&&(c.url=Jt.test(r)?r.replace(Jt,"$1_="+Yt++):r+(Vt.test(r)?"&":"?")+"_="+Yt++)),c.ifModified&&(x.lastModified[r]&&T.setRequestHeader("If-Modified-Since",x.lastModified[r]),x.etag[r]&&T.setRequestHeader("If-None-Match",x.etag[r])),(c.data&&c.hasContent&&c.contentType!==!1||t.contentType)&&T.setRequestHeader("Content-Type",c.contentType),T.setRequestHeader("Accept",c.dataTypes[0]&&c.accepts[c.dataTypes[0]]?c.accepts[c.dataTypes[0]]+("*"!==c.dataTypes[0]?", "+sn+"; q=0.01":""):c.accepts["*"]);for(l in c.headers)T.setRequestHeader(l,c.headers[l]);if(c.beforeSend&&(c.beforeSend.call(f,T,c)===!1||2===v))return T.abort();b="abort";for(l in{success:1,error:1,complete:1})T[l](c[l]);if(n=ln(on,c,t,T)){T.readyState=1,u&&p.trigger("ajaxSend",[T,c]),c.async&&c.timeout>0&&(s=setTimeout(function(){T.abort("timeout")},c.timeout));try{v=1,n.send(m,k)}catch(C){if(!(2>v))throw C;k(-1,C)}}else k(-1,"No Transport");function k(e,t,o,a){var l,m,y,b,w,C=t;2!==v&&(v=2,s&&clearTimeout(s),n=undefined,i=a||"",T.readyState=e>0?4:0,l=e>=200&&300>e||304===e,o&&(b=fn(c,T,o)),b=pn(c,b,T,l),l?(c.ifModified&&(w=T.getResponseHeader("Last-Modified"),w&&(x.lastModified[r]=w),w=T.getResponseHeader("etag"),w&&(x.etag[r]=w)),204===e||"HEAD"===c.type?C="nocontent":304===e?C="notmodified":(C=b.state,m=b.data,y=b.error,l=!y)):(y=C,(e||!C)&&(C="error",0>e&&(e=0))),T.status=e,T.statusText=(t||C)+"",l?h.resolveWith(f,[m,C,T]):h.rejectWith(f,[T,C,y]),T.statusCode(g),g=undefined,u&&p.trigger(l?"ajaxSuccess":"ajaxError",[T,c,l?m:y]),d.fireWith(f,[T,C]),u&&(p.trigger("ajaxComplete",[T,c]),--x.active||x.event.trigger("ajaxStop")))}return T},getJSON:function(e,t,n){return x.get(e,t,n,"json")},getScript:function(e,t){return x.get(e,undefined,t,"script")}}),x.each(["get","post"],function(e,t){x[t]=function(e,n,r,i){return x.isFunction(n)&&(i=i||r,r=n,n=undefined),x.ajax({url:e,type:t,dataType:i,data:n,success:r})}});function fn(e,t,n){var r,i,o,s,a=e.contents,u=e.dataTypes;while("*"===u[0])u.shift(),r===undefined&&(r=e.mimeType||t.getResponseHeader("Content-Type"));if(r)for(i in a)if(a[i]&&a[i].test(r)){u.unshift(i);break}if(u[0]in n)o=u[0];else{for(i in n){if(!u[0]||e.converters[i+" "+u[0]]){o=i;break}s||(s=i)}o=o||s}return o?(o!==u[0]&&u.unshift(o),n[o]):undefined}function pn(e,t,n,r){var i,o,s,a,u,l={},c=e.dataTypes.slice();if(c[1])for(s in e.converters)l[s.toLowerCase()]=e.converters[s];o=c.shift();while(o)if(e.responseFields[o]&&(n[e.responseFields[o]]=t),!u&&r&&e.dataFilter&&(t=e.dataFilter(t,e.dataType)),u=o,o=c.shift())if("*"===o)o=u;else if("*"!==u&&u!==o){if(s=l[u+" "+o]||l["* "+o],!s)for(i in l)if(a=i.split(" "),a[1]===o&&(s=l[u+" "+a[0]]||l["* "+a[0]])){s===!0?s=l[i]:l[i]!==!0&&(o=a[0],c.unshift(a[1]));break}if(s!==!0)if(s&&e["throws"])t=s(t);else try{t=s(t)}catch(f){return{state:"parsererror",error:s?f:"No conversion from "+u+" to "+o}}}return{state:"success",data:t}}x.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/(?:java|ecma)script/},converters:{"text script":function(e){return x.globalEval(e),e}}}),x.ajaxPrefilter("script",function(e){e.cache===undefined&&(e.cache=!1),e.crossDomain&&(e.type="GET")}),x.ajaxTransport("script",function(e){if(e.crossDomain){var t,n;return{send:function(r,i){t=x("<script>").prop({async:!0,charset:e.scriptCharset,src:e.url}).on("load error",n=function(e){t.remove(),n=null,e&&i("error"===e.type?404:200,e.type)}),o.head.appendChild(t[0])},abort:function(){n&&n()}}}});var hn=[],dn=/(=)\?(?=&|$)|\?\?/;x.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=hn.pop()||x.expando+"_"+Yt++;return this[e]=!0,e}}),x.ajaxPrefilter("json jsonp",function(t,n,r){var i,o,s,a=t.jsonp!==!1&&(dn.test(t.url)?"url":"string"==typeof t.data&&!(t.contentType||"").indexOf("application/x-www-form-urlencoded")&&dn.test(t.data)&&"data");return a||"jsonp"===t.dataTypes[0]?(i=t.jsonpCallback=x.isFunction(t.jsonpCallback)?t.jsonpCallback():t.jsonpCallback,a?t[a]=t[a].replace(dn,"$1"+i):t.jsonp!==!1&&(t.url+=(Vt.test(t.url)?"&":"?")+t.jsonp+"="+i),t.converters["script json"]=function(){return s||x.error(i+" was not called"),s[0]},t.dataTypes[0]="json",o=e[i],e[i]=function(){s=arguments},r.always(function(){e[i]=o,t[i]&&(t.jsonpCallback=n.jsonpCallback,hn.push(i)),s&&x.isFunction(o)&&o(s[0]),s=o=undefined}),"script"):undefined}),x.ajaxSettings.xhr=function(){try{return new XMLHttpRequest}catch(e){}};var gn=x.ajaxSettings.xhr(),mn={0:200,1223:204},yn=0,vn={};e.ActiveXObject&&x(e).on("unload",function(){for(var e in vn)vn[e]();vn=undefined}),x.support.cors=!!gn&&"withCredentials"in gn,x.support.ajax=gn=!!gn,x.ajaxTransport(function(e){var t;return x.support.cors||gn&&!e.crossDomain?{send:function(n,r){var i,o,s=e.xhr();if(s.open(e.type,e.url,e.async,e.username,e.password),e.xhrFields)for(i in e.xhrFields)s[i]=e.xhrFields[i];e.mimeType&&s.overrideMimeType&&s.overrideMimeType(e.mimeType),e.crossDomain||n["X-Requested-With"]||(n["X-Requested-With"]="XMLHttpRequest");for(i in n)s.setRequestHeader(i,n[i]);t=function(e){return function(){t&&(delete vn[o],t=s.onload=s.onerror=null,"abort"===e?s.abort():"error"===e?r(s.status||404,s.statusText):r(mn[s.status]||s.status,s.statusText,"string"==typeof s.responseText?{text:s.responseText}:undefined,s.getAllResponseHeaders()))}},s.onload=t(),s.onerror=t("error"),t=vn[o=yn++]=t("abort"),s.send(e.hasContent&&e.data||null)},abort:function(){t&&t()}}:undefined});var xn,bn,wn=/^(?:toggle|show|hide)$/,Tn=RegExp("^(?:([+-])=|)("+b+")([a-z%]*)$","i"),Cn=/queueHooks$/,kn=[An],Nn={"*":[function(e,t){var n=this.createTween(e,t),r=n.cur(),i=Tn.exec(t),o=i&&i[3]||(x.cssNumber[e]?"":"px"),s=(x.cssNumber[e]||"px"!==o&&+r)&&Tn.exec(x.css(n.elem,e)),a=1,u=20;if(s&&s[3]!==o){o=o||s[3],i=i||[],s=+r||1;do a=a||".5",s/=a,x.style(n.elem,e,s+o);while(a!==(a=n.cur()/r)&&1!==a&&--u)}return i&&(n.unit=o,n.start=+s||+r||0,n.end=i[1]?s+(i[1]+1)*i[2]:+i[2]),n}]};function En(){return setTimeout(function(){xn=undefined}),xn=x.now()}function Sn(e,t,n){var r,i=(Nn[t]||[]).concat(Nn["*"]),o=0,s=i.length;for(;s>o;o++)if(r=i[o].call(n,t,e))return r}function jn(e,t,n){var r,i,o=0,s=kn.length,a=x.Deferred().always(function(){delete u.elem}),u=function(){if(i)return!1;var t=xn||En(),n=Math.max(0,l.startTime+l.duration-t),r=n/l.duration||0,o=1-r,s=0,u=l.tweens.length;for(;u>s;s++)l.tweens[s].run(o);return a.notifyWith(e,[l,o,n]),1>o&&u?n:(a.resolveWith(e,[l]),!1)},l=a.promise({elem:e,props:x.extend({},t),opts:x.extend(!0,{specialEasing:{}},n),originalProperties:t,originalOptions:n,startTime:xn||En(),duration:n.duration,tweens:[],createTween:function(t,n){var r=x.Tween(e,l.opts,t,n,l.opts.specialEasing[t]||l.opts.easing);return l.tweens.push(r),r},stop:function(t){var n=0,r=t?l.tweens.length:0;if(i)return this;for(i=!0;r>n;n++)l.tweens[n].run(1);return t?a.resolveWith(e,[l,t]):a.rejectWith(e,[l,t]),this}}),c=l.props;for(Dn(c,l.opts.specialEasing);s>o;o++)if(r=kn[o].call(l,e,c,l.opts))return r;return x.map(c,Sn,l),x.isFunction(l.opts.start)&&l.opts.start.call(e,l),x.fx.timer(x.extend(u,{elem:e,anim:l,queue:l.opts.queue})),l.progress(l.opts.progress).done(l.opts.done,l.opts.complete).fail(l.opts.fail).always(l.opts.always)}function Dn(e,t){var n,r,i,o,s;for(n in e)if(r=x.camelCase(n),i=t[r],o=e[n],x.isArray(o)&&(i=o[1],o=e[n]=o[0]),n!==r&&(e[r]=o,delete e[n]),s=x.cssHooks[r],s&&"expand"in s){o=s.expand(o),delete e[r];for(n in o)n in e||(e[n]=o[n],t[n]=i)}else t[r]=i}x.Animation=x.extend(jn,{tweener:function(e,t){x.isFunction(e)?(t=e,e=["*"]):e=e.split(" ");var n,r=0,i=e.length;for(;i>r;r++)n=e[r],Nn[n]=Nn[n]||[],Nn[n].unshift(t)},prefilter:function(e,t){t?kn.unshift(e):kn.push(e)}});function An(e,t,n){var r,i,o,s,a,u,l=this,c={},f=e.style,p=e.nodeType&&Lt(e),h=H.get(e,"fxshow");n.queue||(a=x._queueHooks(e,"fx"),null==a.unqueued&&(a.unqueued=0,u=a.empty.fire,a.empty.fire=function(){a.unqueued||u()}),a.unqueued++,l.always(function(){l.always(function(){a.unqueued--,x.queue(e,"fx").length||a.empty.fire()})})),1===e.nodeType&&("height"in t||"width"in t)&&(n.overflow=[f.overflow,f.overflowX,f.overflowY],"inline"===x.css(e,"display")&&"none"===x.css(e,"float")&&(f.display="inline-block")),n.overflow&&(f.overflow="hidden",l.always(function(){f.overflow=n.overflow[0],f.overflowX=n.overflow[1],f.overflowY=n.overflow[2]}));for(r in t)if(i=t[r],wn.exec(i)){if(delete t[r],o=o||"toggle"===i,i===(p?"hide":"show")){if("show"!==i||!h||h[r]===undefined)continue;p=!0}c[r]=h&&h[r]||x.style(e,r)}if(!x.isEmptyObject(c)){h?"hidden"in h&&(p=h.hidden):h=H.access(e,"fxshow",{}),o&&(h.hidden=!p),p?x(e).show():l.done(function(){x(e).hide()}),l.done(function(){var t;H.remove(e,"fxshow");for(t in c)x.style(e,t,c[t])});for(r in c)s=Sn(p?h[r]:0,r,l),r in h||(h[r]=s.start,p&&(s.end=s.start,s.start="width"===r||"height"===r?1:0))}}function Ln(e,t,n,r,i){return new Ln.prototype.init(e,t,n,r,i)}x.Tween=Ln,Ln.prototype={constructor:Ln,init:function(e,t,n,r,i,o){this.elem=e,this.prop=n,this.easing=i||"swing",this.options=t,this.start=this.now=this.cur(),this.end=r,this.unit=o||(x.cssNumber[n]?"":"px")},cur:function(){var e=Ln.propHooks[this.prop];return e&&e.get?e.get(this):Ln.propHooks._default.get(this)},run:function(e){var t,n=Ln.propHooks[this.prop];return this.pos=t=this.options.duration?x.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):Ln.propHooks._default.set(this),this}},Ln.prototype.init.prototype=Ln.prototype,Ln.propHooks={_default:{get:function(e){var t;return null==e.elem[e.prop]||e.elem.style&&null!=e.elem.style[e.prop]?(t=x.css(e.elem,e.prop,""),t&&"auto"!==t?t:0):e.elem[e.prop]},set:function(e){x.fx.step[e.prop]?x.fx.step[e.prop](e):e.elem.style&&(null!=e.elem.style[x.cssProps[e.prop]]||x.cssHooks[e.prop])?x.style(e.elem,e.prop,e.now+e.unit):e.elem[e.prop]=e.now}}},Ln.propHooks.scrollTop=Ln.propHooks.scrollLeft={set:function(e){e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now)}},x.each(["toggle","show","hide"],function(e,t){var n=x.fn[t];x.fn[t]=function(e,r,i){return null==e||"boolean"==typeof e?n.apply(this,arguments):this.animate(Hn(t,!0),e,r,i)}}),x.fn.extend({fadeTo:function(e,t,n,r){return this.filter(Lt).css("opacity",0).show().end().animate({opacity:t},e,n,r)},animate:function(e,t,n,r){var i=x.isEmptyObject(e),o=x.speed(t,n,r),s=function(){var t=jn(this,x.extend({},e),o);s.finish=function(){t.stop(!0)},(i||H.get(this,"finish"))&&t.stop(!0)};return s.finish=s,i||o.queue===!1?this.each(s):this.queue(o.queue,s)},stop:function(e,t,n){var r=function(e){var t=e.stop;delete e.stop,t(n)};return"string"!=typeof e&&(n=t,t=e,e=undefined),t&&e!==!1&&this.queue(e||"fx",[]),this.each(function(){var t=!0,i=null!=e&&e+"queueHooks",o=x.timers,s=H.get(this);if(i)s[i]&&s[i].stop&&r(s[i]);else for(i in s)s[i]&&s[i].stop&&Cn.test(i)&&r(s[i]);for(i=o.length;i--;)o[i].elem!==this||null!=e&&o[i].queue!==e||(o[i].anim.stop(n),t=!1,o.splice(i,1));(t||!n)&&x.dequeue(this,e)})},finish:function(e){return e!==!1&&(e=e||"fx"),this.each(function(){var t,n=H.get(this),r=n[e+"queue"],i=n[e+"queueHooks"],o=x.timers,s=r?r.length:0;for(n.finish=!0,x.queue(this,e,[]),i&&i.cur&&i.cur.finish&&i.cur.finish.call(this),t=o.length;t--;)o[t].elem===this&&o[t].queue===e&&(o[t].anim.stop(!0),o.splice(t,1));for(t=0;s>t;t++)r[t]&&r[t].finish&&r[t].finish.call(this);delete n.finish})}});function Hn(e,t){var n,r={height:e},i=0;for(t=t?1:0;4>i;i+=2-t)n=jt[i],r["margin"+n]=r["padding"+n]=e;return t&&(r.opacity=r.width=e),r}x.each({slideDown:Hn("show"),slideUp:Hn("hide"),slideToggle:Hn("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(e,t){x.fn[e]=function(e,n,r){return this.animate(t,e,n,r)}}),x.speed=function(e,t,n){var r=e&&"object"==typeof e?x.extend({},e):{complete:n||!n&&t||x.isFunction(e)&&e,duration:e,easing:n&&t||t&&!x.isFunction(t)&&t};return r.duration=x.fx.off?0:"number"==typeof r.duration?r.duration:r.duration in x.fx.speeds?x.fx.speeds[r.duration]:x.fx.speeds._default,(null==r.queue||r.queue===!0)&&(r.queue="fx"),r.old=r.complete,r.complete=function(){x.isFunction(r.old)&&r.old.call(this),r.queue&&x.dequeue(this,r.queue)},r},x.easing={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2}},x.timers=[],x.fx=Ln.prototype.init,x.fx.tick=function(){var e,t=x.timers,n=0;for(xn=x.now();t.length>n;n++)e=t[n],e()||t[n]!==e||t.splice(n--,1);t.length||x.fx.stop(),xn=undefined},x.fx.timer=function(e){e()&&x.timers.push(e)&&x.fx.start()},x.fx.interval=13,x.fx.start=function(){bn||(bn=setInterval(x.fx.tick,x.fx.interval))},x.fx.stop=function(){clearInterval(bn),bn=null},x.fx.speeds={slow:600,fast:200,_default:400},x.fx.step={},x.expr&&x.expr.filters&&(x.expr.filters.animated=function(e){return x.grep(x.timers,function(t){return e===t.elem}).length}),x.fn.offset=function(e){if(arguments.length)return e===undefined?this:this.each(function(t){x.offset.setOffset(this,e,t)});var t,n,i=this[0],o={top:0,left:0},s=i&&i.ownerDocument;if(s)return t=s.documentElement,x.contains(t,i)?(typeof i.getBoundingClientRect!==r&&(o=i.getBoundingClientRect()),n=qn(s),{top:o.top+n.pageYOffset-t.clientTop,left:o.left+n.pageXOffset-t.clientLeft}):o},x.offset={setOffset:function(e,t,n){var r,i,o,s,a,u,l,c=x.css(e,"position"),f=x(e),p={};"static"===c&&(e.style.position="relative"),a=f.offset(),o=x.css(e,"top"),u=x.css(e,"left"),l=("absolute"===c||"fixed"===c)&&(o+u).indexOf("auto")>-1,l?(r=f.position(),s=r.top,i=r.left):(s=parseFloat(o)||0,i=parseFloat(u)||0),x.isFunction(t)&&(t=t.call(e,n,a)),null!=t.top&&(p.top=t.top-a.top+s),null!=t.left&&(p.left=t.left-a.left+i),"using"in t?t.using.call(e,p):f.css(p)}},x.fn.extend({position:function(){if(this[0]){var e,t,n=this[0],r={top:0,left:0};return"fixed"===x.css(n,"position")?t=n.getBoundingClientRect():(e=this.offsetParent(),t=this.offset(),x.nodeName(e[0],"html")||(r=e.offset()),r.top+=x.css(e[0],"borderTopWidth",!0),r.left+=x.css(e[0],"borderLeftWidth",!0)),{top:t.top-r.top-x.css(n,"marginTop",!0),left:t.left-r.left-x.css(n,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var e=this.offsetParent||s;while(e&&!x.nodeName(e,"html")&&"static"===x.css(e,"position"))e=e.offsetParent;return e||s})}}),x.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(t,n){var r="pageYOffset"===n;x.fn[t]=function(i){return x.access(this,function(t,i,o){var s=qn(t);return o===undefined?s?s[n]:t[i]:(s?s.scrollTo(r?e.pageXOffset:o,r?o:e.pageYOffset):t[i]=o,undefined)},t,i,arguments.length,null)}});function qn(e){return x.isWindow(e)?e:9===e.nodeType&&e.defaultView}x.each({Height:"height",Width:"width"},function(e,t){x.each({padding:"inner"+e,content:t,"":"outer"+e},function(n,r){x.fn[r]=function(r,i){var o=arguments.length&&(n||"boolean"!=typeof r),s=n||(r===!0||i===!0?"margin":"border");return x.access(this,function(t,n,r){var i;return x.isWindow(t)?t.document.documentElement["client"+e]:9===t.nodeType?(i=t.documentElement,Math.max(t.body["scroll"+e],i["scroll"+e],t.body["offset"+e],i["offset"+e],i["client"+e])):r===undefined?x.css(t,n,s):x.style(t,n,r,s)},t,o?r:undefined,o,null)}})}),x.fn.size=function(){return this.length},x.fn.andSelf=x.fn.addBack,"object"==typeof module&&module&&"object"==typeof module.exports?module.exports=x:"function"==typeof define&&define.amd&&define("jquery",[],function(){return x}),"object"==typeof e&&"object"==typeof e.document&&(e.jQuery=e.$=x)})(window);/// <reference path="jQuery.d.ts" />
var SDL;
(function (SDL) {
    SDL.jQuery;
})(SDL || (SDL = {}));

SDL.jQuery = jQuery.noConflict(true);

(function ($) {
    if (!$.browser) {
        function uaMatch(ua) {
            ua = ua.toLowerCase();

            var match = /(chrome)[ \/]([\w.]+)/.exec(ua) || /(webkit)[ \/]([\w.]+)/.exec(ua) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) || /(msie) ([\w.]+)/.exec(ua) || (ua.indexOf("trident\/") > -1 && [null, "msie", (/(\brv\:([\w.]+))/.exec(ua) || [])[2]]);
            ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];

            return {
                browser: match[1] || "",
                version: match[2] || "0"
            };
        }
        ;

        var matched = uaMatch(navigator.userAgent);
        var browser = {};

        if (matched.browser) {
            browser[matched.browser] = true;
            browser.version = matched.version;
        }

        if (browser.chrome) {
            browser.webkit = true;
        } else if (browser.webkit) {
            browser.safari = true;
        }

        $.browser = browser;
    }
    $.browser.macintosh = navigator.userAgent.indexOf("Macintosh") > -1;
    $.browser.mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
})(SDL.jQuery);
//@ sourceMappingURL=SDL.jQuery.js.map
/*! @namespace {SDL.Client.Type} */
if (!window.SDL) SDL = {};
if (!SDL.Client) SDL.Client = {Types: {}};
if (!SDL.Client) SDL.Client = { UI: {} };

Array.prototype.isArray = true;
Date.prototype.isDate = true;
Function.prototype.isFunction = true;

SDL.Client.Type = {
	registerNamespace: function SDL$Client$Type$registerNamespace(text)
	{
		var arr = text.split(".");
		var length = arr.length;

		if (length > 0)
		{
			var base = window;
			var partName;
			for (var i = 0, l = arr.length; i < l; i++)
			{
				if (base[partName = arr[i]])
				{
					base = base[partName];
				}
				else if (i == 0)
				{
					base = this._registerTopLevelNamespace(partName);
				}
				else
				{
					base[partName] = {};
					base = base[partName];
				}
			}
		}
	},
	_registerTopLevelNamespace: function SDL$Client$Type$registerNamespace()
	{
		// no window's property, which may cause circular references and memory leaks
		// no argument names nor local variables to prevent name conflicts to make sure the variable is global
		return window.eval(arguments[0] + "={}");
	},
	resolveNamespace: function SDL$Client$Type$resolveNamespace(typeName)
	{
		var typeNames = typeName.split(".");
		var base = window;
		for (var i = 0, l = typeNames.length; i < l && base; i++)
		{
			base = base[typeNames[i]];
		}
		return base;
	},

	/**
	 * Returns a value indicating whether the supplied value is an array.
	 * @return {Boolean} <c>true</c> if the supplied value is an array, otherwise <c>false</c>.
	 */
	isArray: function SDL$Client$Type$isArray(value)
	{
		return (value &&
				(value.isArray ||
					(
						// return true for 'arguments' object too
						this.isObject(value) && this.isNumber(value.length) && !this.isNumber(value.nodeType) && !SDL.jQuery.isWindow(value)
					)
				)
			) || false;
	},

	/**
	 * Returns a value indicating whether the supplied value is a date.
	 * @return {Boolean} <c>true</c> if the supplied value is an date, otherwise <c>false</c>.
	 */
	isDate: function SDL$Client$Type$isDate(value)
	{
		return value && value.isDate || false;
	},

	/**
	 * Returns a value indicating whether the supplied value is a boolean.
	 * @return {Boolean} <c>true</c> if the supplied value is a boolean, otherwise <c>false</c>.
	 */
	isBoolean: function SDL$Client$Type$isBoolean(value)
	{
		return typeof value === "boolean" ||
			(typeof value == "object" && value !== null && this.isFunction(value.valueOf) && (typeof value.valueOf() === "boolean"));
	},

	/**
	 * Returns a value indicating whether the supplied value is a function.
	 * @return {Boolean} <c>true</c> if the supplied value is a function, otherwise <c>false</c>.
	 */
	isFunction: function SDL$Client$Type$isFunction(value)
	{
		return (value && value.isFunction == true) || false;
	},

	/**
	 * Returns a value indicating whether the supplied value is a number.
	 * @return {Boolean} <c>true</c> if the supplied value is a number, otherwise <c>false</c>.
	 */
	isNumber: function SDL$Client$Type$isNumber(value)
	{
		return typeof value === "number" ||
			(typeof value == "object" && value !== null && !this.isDate(value) && this.isFunction(value.valueOf) && (typeof value.valueOf() === "number"));
	},

	/**
	 * Returns a value indicating whether the supplied value is an object.
	 * @return {Boolean} <c>true</c> if the supplied value is an object, otherwise <c>false</c>.
	 */
	isObject: function SDL$Client$Type$isObject(value)
	{
		if (typeof value == 'object' && value !== null)
		{
			if (!this.isDate(value) && this.isFunction(value.valueOf))
			{
				var typeOfValue = typeof value.valueOf();
				return typeOfValue !== "number" && typeOfValue !== "string" && typeOfValue !== "boolean";
			}
			return true;
		}
		return false;
	},

	/**
	 * Returns a value indicating whether the supplied value is a string.
	 * @return {Boolean} <c>true</c> if the supplied value is a string, otherwise <c>false</c>.
	 */
	isString: function SDL$Client$Type$isString(value)
	{
		return typeof value === "string" ||
			(typeof value == "object" && value !== null && this.isFunction(value.valueOf) && (typeof value.valueOf() === "string"));
	},

	/**
	 * Returns a value indicating whether the supplied value is an xml or html node.
	 * @return {Boolean} <c>true</c> if the supplied value is an xml or html node, otherwise <c>false</c>.
	 */
	isNode: function SDL$Client$Type$isNode(value)
	{
		return typeof value == 'object' && value !== null && this.isNumber(value.nodeType);
	},

	/**
	 * Returns a value indicating whether the supplied value is an HTML element.
	 * @return {Boolean} <c>true</c> if the supplied value is an HTML element, otherwise <c>false</c>.
	 */
	isHtmlElement: function SDL$Client$Type$isHtmlElement(value)
	{
		return this.isElement(value) && (typeof value.style == "object") && value.style !== null;
	},

	/**
	 * Returns a value indicating whether the supplied value is an element.
	 * @return {Boolean} <c>true</c> if the supplied value is an element, otherwise <c>false</c>.
	 */
	isElement: function SDL$Client$Type$isElement(value)
	{
		return this.isNode(value) && value.nodeType == 1;
	},

	/**
	 * Returns a value indicating whether the supplied value is an xml or html document.
	 * @return {Boolean} <c>true</c> if the supplied value is an xml or html document, otherwise <c>false</c>.
	 */
	isDocument: function SDL$Client$Type$isDocument(value)
	{
		return this.isNode(value) && value.nodeType == 9;
	}
};/*! @namespace {SDL.Client.Diagnostics.Assert} */
SDL.Client.Type.registerNamespace("SDL.Client.Diagnostics.Assert");

/**
 * Asserts that the supplied value is <code>true</code>, and it throws an Error if it isn't.
 * @param {Object} value The value to check.
 * @param {String} description Optional description of this assertion.
 * @return {Boolean} The result of assertion.
 */
SDL.Client.Diagnostics.Assert.isTrue = function SDL$Client$Diagnostics$Assert$isTrue(value, description)
{
	if (value !== true)
	{
		this.raiseError(SDL.Client.Types.String.format(description || ("Expression should be true."), value));
	}
};

/**
 * Asserts that the supplied value is <code>false</code>, and it throws an Error if it isn't.
 * @param {Object} value The value to check.
 * @param {String} description Optional description of this assertion.
 * @return {Boolean} The result of assertion.
 */
SDL.Client.Diagnostics.Assert.isFalse = function SDL$Client$Diagnostics$Assert$isFalse(value, description)
{
	if (value !== false)
	{
		this.raiseError(SDL.Client.Types.String.format(description || ("Expression should be false."), value));
	}
};

/**
 * Asserts that the supplied value is a <code>boolean</code>, and it throws an Error if it isn't.
 * @param {Object} value The value to check.
 * @param {String} description Optional description of this assertion.
 * @return {Boolean} The result of assertion.
 */
SDL.Client.Diagnostics.Assert.isBoolean = function SDL$Client$Diagnostics$Assert$isBoolean(value, description)
{
	if (!SDL.Client.Type.isBoolean(value))
	{
		this.raiseError(SDL.Client.Types.String.format(description || ("Expression should be a boolean."), value));
	}
};

/**
 * Asserts that the supplied value is defined, and it throws an Error if it isn't.
 * @param {Object} value The value to check.
 * @param {String} description Optional description of this assertion.
 * @return {Boolean} The result of assertion.
 */
SDL.Client.Diagnostics.Assert.isDefined = function SDL$Client$Diagnostics$Assert$isDefined(value, description)
{
	if (value === undefined)
	{
		this.raiseError(SDL.Client.Types.String.format(description || ("Expression should be defined."), value));
	}
};

/**
 * Asserts that the supplied value is not <code>null</code>, and it throws an Error if it is.
 * @param {Object} value The value to check.
 * @param {String} description Optional description of this assertion.
 * @return {Boolean} The result of assertion.
 */
SDL.Client.Diagnostics.Assert.isNotNull = function SDL$Client$Diagnostics$Assert$isNotNull(value, description)
{
	if (value === null)
	{
		this.raiseError(SDL.Client.Types.String.format(description || ("Value should not be null."), value));
	}
};

/**
 * Asserts that the supplied value is not <code>null</code> or <code>undefined</code>, and it throws an Error if it is.
 * @param {Object} value The value to check.
 * @param {String} description Optional description of this assertion.
 * @return {Boolean} The result of assertion.
 */
SDL.Client.Diagnostics.Assert.isNotNullOrUndefined = function SDL$Client$Diagnostics$Assert$isNotNullOrUndefined(value, description)
{
	if (value == null)
	{
		this.raiseError(SDL.Client.Types.String.format(description || ("Value should not be null or undefined."), value));
	}
};

/**
 * Asserts that the supplied value1 and value2 are equal, and it throws an Error if they aren't.
 * @param {Object} value1 First value to check.
 * @param {Object} value2 Second value to check.
 * @param {String} description Optional description of this assertion.
 * @return {Boolean} The result of assertion.
 */
SDL.Client.Diagnostics.Assert.areEqual = function SDL$Client$Diagnostics$Assert$areEqual(value1, value2, description)
{
	if (value1 !== value2)
	{
		this.raiseError(SDL.Client.Types.String.format(description || ("Values should be equal."), value1, value2));
	}
};

/**
 * Asserts that the supplied value1 and value2 are not equal, and it throws an Error if they aren't.
 * @param {Object} value1 First value to check.
 * @param {Object} value2 Second value to check.
 * @param {String} description Optional description of this assertion.
 * @return {Boolean} The result of assertion.
 */
SDL.Client.Diagnostics.Assert.areNotEqual = function SDL$Client$Diagnostics$Assert$areNotEqual(value1, value2, description)
{
	if (value1 === value2)
	{
		this.raiseError(SDL.Client.Types.String.format(description || ("Values should not be equal."), value1, value2));
	}
};

/**
 * Asserts that the supplied value is a string, and it throws an Error if it isn't.
 * @param {Object} value A value to check.
 * @param {String} description Optional description of this assertion.
 * @return {Boolean} The result of assertion.
 */
SDL.Client.Diagnostics.Assert.isString = function SDL$Client$Diagnostics$Assert$isString(value, description)
{
	if (!SDL.Client.Type.isString(value))
	{
		this.raiseError(SDL.Client.Types.String.format(description || ("Value should be a string."), value));
	}
};

/**
 * Asserts that the supplied value is a number, and it throws an Error if it isn't.
 * @param {Object} value A value to check.
 * @param {String} description Optional description of this assertion.
 * @return {Boolean} The result of assertion.
 */
SDL.Client.Diagnostics.Assert.isNumber = function SDL$Client$Diagnostics$Assert$isNumber(value, description)
{
	if (!SDL.Client.Type.isNumber(value))
	{
		this.raiseError(SDL.Client.Types.String.format(description || ("Value should be a number."), value));
	}
};

/**
* Asserts that the supplied value is a date, and it throws an Error if it isn't.
* @param {Object} value A value to check.
* @param {String} description Optional description of this assertion.
* @return {Boolean} The result of assertion.
*/
SDL.Client.Diagnostics.Assert.isDate = function SDL$Client$Diagnostics$Assert$isDate(value, description)
{
	if (!SDL.Client.Type.isDate(value))
	{
		this.raiseError(SDL.Client.Types.String.format(description || ("Value should be a date."), value));
	}
};

/**
 * Asserts that the supplied value is a number or can be converted to a number, and it throws an Error if negative.
 * @param {Object} value A value to check.
 * @param {String} description Optional description of this assertion.
 * @return {Boolean} The result of assertion.
 */
SDL.Client.Diagnostics.Assert.isNumeric = function SDL$Client$Diagnostics$Assert$isNumeric(value, description)
{
	if (!SDL.jQuery.isNumeric(value))
	{
		this.raiseError(SDL.Client.Types.String.format(description || ("Value should be numeric."), value));
	}
};

/**
 * Asserts that the supplied value is an object, and it throws an Error if it isn't.
 * @param {Object} value A value to check.
 * @param {String} description Optional description of this assertion.
 * @return {Boolean} The result of assertion.
 */
SDL.Client.Diagnostics.Assert.isObject = function SDL$Client$Diagnostics$Assert$isObject(value, description)
{
	if (!SDL.Client.Type.isObject(value))
	{
		this.raiseError(SDL.Client.Types.String.format(description || ("Value should be an object."), value));
	}
};

/**
 * Asserts that the supplied value is a array, and it throws an Error if it isn't.
 * @param {Object} value A value to check.
 * @param {String} description Optional description of this assertion.
 * @return {Boolean} The result of assertion.
 */
SDL.Client.Diagnostics.Assert.isArray = function SDL$Client$Diagnostics$Assert$isArray(value, description)
{
	if (!SDL.Client.Type.isArray(value))
	{
		this.raiseError(SDL.Client.Types.String.format(description || ("Value should be an array."), value));
	}
};

/**
 * Asserts that the supplied value is a function, and it throws an Error if it isn't.
 * @param {Object} value A value to check.
 * @param {String} description Optional description of this assertion.
 * @return {Boolean} The result of assertion.
 */
SDL.Client.Diagnostics.Assert.isFunction = function SDL$Client$Diagnostics$Assert$isFunction(value, description)
{
	if (!SDL.Client.Type.isFunction(value))
	{
		this.raiseError(SDL.Client.Types.String.format(description || ("Value should be a function."), value));
	}
};

/**
 * Asserts that the supplied object implements the specified interface, and it throws an Error if it doesn't.
 * @param {Object} object An object to check.
 * @param {Object} interfaceName The name of the interface that the specified object should implement.
 * @param {String} description Optional description of this assertion.
 * @return {Boolean} The result of assertion.
 */
SDL.Client.Diagnostics.Assert.implementsInterface = function SDL$Client$Diagnostics$Assert$implementsInterface(object, interfaceName, description)
{
	if (!SDL.Client.Types.OO.implementsInterface(object, interfaceName))
	{
		this.raiseError(description || ("Object should implement " + interfaceName));
	}
};

/**
 * Asserts that the supplied object is an HTML or XML node, and it throws an Error if it isn't.
 * @param {Object} object An object to check.
 * @param {String} description Optional description of this assertion.
 * @return {Boolean} The result of assertion.
 */
SDL.Client.Diagnostics.Assert.isNode = function SDL$Client$Diagnostics$Assert$isNode(object, description)
{
	if (!SDL.Client.Type.isNode(object))
	{
		this.raiseError(SDL.Client.Types.String.format(description || "Object should be a node.", object));
	}
};

/**
 * Asserts that the supplied object is an HTML or XML element, and it throws an Error if it isn't.
 * @param {Object} object An object to check.
 * @param {String} description Optional description of this assertion.
 * @return {Boolean} The result of assertion.
 */
SDL.Client.Diagnostics.Assert.isElement = function SDL$Client$Diagnostics$Assert$isElement(object, description)
{
	if (!SDL.Client.Type.isElement(object))
	{
		this.raiseError(SDL.Client.Types.String.format(description || "Object should be an element node.", object));
	}
};

/**
 * Asserts that the supplied object is an HTML element, and it throws an Error if it isn't.
 * @param {Object} object An object to check.
 * @param {String} description Optional description of this assertion.
 * @return {Boolean} The result of assertion.
 */
SDL.Client.Diagnostics.Assert.isHtmlElement = function SDL$Client$Diagnostics$Assert$isHtmlElement(object, description)
{
	if (!SDL.Client.Type.isHtmlElement(object))
	{
		this.raiseError(SDL.Client.Types.String.format(description || "Object should be an html element.", object));
	}
};

/**
 * Asserts that the supplied object is an HTML or XML element, and it throws an Error if it isn't.
 * @param {Object} object An object to check.
 * @param {String} description Optional description of this assertion.
 * @return {Boolean} The result of assertion.
 */
SDL.Client.Diagnostics.Assert.isDocument = function SDL$Client$Diagnostics$Assert$isDocument(object, description)
{
	if (!SDL.Client.Type.isDocument(object))
	{
		this.raiseError(SDL.Client.Types.String.format(description || "Object should be a document node", object));
	}
};

/**
 * Asserts that the supplied object is a browser Window, and it throws an Error if it isn't.
 * @param {Object} object An object to check.
 * @param {String} description Optional description of this assertion.
 * @return {Boolean} The result of assertion.
 */
SDL.Client.Diagnostics.Assert.isWindow = function SDL$Client$Diagnostics$Assert$isWindow(object, description)
{
	if (!SDL.jQuery.isWindow(object))
	{
		this.raiseError(SDL.Client.Types.String.format(description || "Object should be a window.", object));
	}
};

SDL.Client.Diagnostics.Assert.raiseError = function SDL$Client$Diagnostics$Assert$raiseError(description)
{
	throw new Error(description);
};/*! @namespace {SDL.Client.Types.String} */
SDL.Client.Type.registerNamespace("SDL.Client.Types.String");

// all unicode characters are split into bytes and each byte is represented by a single character
SDL.Client.Types.String.utf8encode = function SDL$Client$Types$String$utf8encode(string)
{
	if (string)
	{
		var b10000000 = 0x80;
		var b11000000 = 0xC0;
		var b11100000 = 0xE0;
		var b11110000 = 0xF0;
		var b00111111 = 0x3F;
		var b00011111 = 0x1F;
		var b00001111 = 0x0F;
		var b00000111 = 0x07;

		return string.replace(/[\u0080-\uffff]/g, function(c)
		{
			var c = c.charCodeAt(0);
			if (c <= 0x7ff)	// c >= 0x80
			{
				return String.fromCharCode(
					b11000000 | (b00011111 & (c >>> 6)),
					b10000000 | (b00111111 & c));
			}
			else if (c <= 0xffff)
			{
				return String.fromCharCode(
					b11100000 | (b00001111 & (c >>> 12)),
					b10000000 | (b00111111 & (c >>> 6)),
					b10000000 | (b00111111 & c));
			}
			else if (c <= 0x10ffff)
			{
				return String.fromCharCode(
					b11110000 | (b00000111 & (c >>> 18)),
					b10000000 | (b00111111 & (c >>> 12)),
					b10000000 | (b00111111 & (c >>> 6)),
					b10000000 | (b00111111 & c));
			}
			else
			{
				return c;
			}
		})
	}
	else
	{
		return string;
	}
};

SDL.Client.Types.String.base64encode = function SDL$Client$Types$String$base64encode(string)
{
	if (string)
	{
		string = this.utf8encode(string);

		var i2a  = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		var length = string.length;
		var groupCount = Math.floor(length/3);
		var remaining = length - 3 * groupCount;
		var result = [];

		var idx = 0;
		for (var i = 0; i < groupCount; i++)
		{
			var b0 = string.charCodeAt(idx++);
			var b1 = string.charCodeAt(idx++);
			var b2 = string.charCodeAt(idx++);
			result.push(
				i2a[b0 >> 2],
				i2a[(b0 << 4) & 0x3f | (b1 >> 4)],
				i2a[(b1 << 2) & 0x3f | (b2 >> 6)],
				i2a[b2 & 0x3f]);
		}

		if (remaining == 1)
		{
			var b0 = string.charCodeAt(idx++);
			result.push(
				i2a[b0 >> 2],
				i2a[(b0 << 4) & 0x3f],
				"==");
		}
		else if (remaining == 2)
		{
			var b0 = string.charCodeAt(idx++);
			var b1 = string.charCodeAt(idx++);
			result.push(
				i2a[b0 >> 2],
				i2a[(b0 << 4) & 0x3f | (b1 >> 4)],
				i2a[(b1 << 2) & 0x3f],
				'=');
		}
		return result.join("");
	}
	else
	{
		return string;
	}
};


/**
* Replaces the designated placeholders in supplied string with the supplied arguments.
* <p>Any arguments that follow the <c>value</c> argument will be interpreted as values to
* replace the template string with.</p>
* <p>The format of a placeholder is the zero-based index of the value to insert, surrounded with
* braces: <c>{0}</c>. Additionally, the format placeholders can contain padding instructions for both strings
* and numbers. Placeholder <c>{0#4-}</c> indicates that the value should be padded with zeros on its left side
* until its total length reaches 4. Placeholder <c>{0$10+}</c> indicates that the value should be padded with
* spaces on its right side until its total length reaches 10. {{ and }} output { and } respectively.</p>
* <p>Examples: <br/>
* <code>String.format("Hello mister {0}", "John"); // outputs: Hello mister John</code>
* <code>String.format("The cost of {0} is {1#4-}", "Apples", 2); // outputs: The cost of Apples is 0002.</code>
* <code>String.format("Character: {0$4-}.", "A"); // outputs: Character:   A.</code>
* <code>String.format("Escaped {{0}}"); // outputs: Escaped {0}</code>
* </p>
* @param {String} value The template string to replace.
* @arguments {Object} [1...n] The values to insert into the template string. Additionally, if the first argument is an array,
* it will be used as the arguments array.
* @return The formatted string.
*/
SDL.Client.Types.String.format = function SDL$Client$Types$String$format(value)
{
	var args = SDL.Client.Types.Array.fromArguments(arguments, 1);

	function applyPadding(string, count, character, direction) 
	{
		var string = '' + string;
		var diff = count - string.length;
		var output = new String();
		while (output.length < diff)
		{
			output += character;
		}

		return (direction == 2 ? string + output : output + string);
	}
	function applyFormat() 
	{
		var value;
		if (arguments[1])
		{
			value = "{";
		}
		else if (arguments[2])
		{
			value = "}";
		}
		else
		{
			if (args[arguments[3]] == undefined)
			{
				value = "";
			}
			else
			{
				value = new String(args[arguments[3]]);
				if (arguments[4] != "" && arguments[5] != "")
				{
					var direction = arguments[6] == "+" ? 2 : 1;
					value = applyPadding(value, arguments[5], arguments[4] == "#" ? "0" : " ", direction);
				}
			}
		}
		return value;
	}

	// compile and save the regex when needed and not before
	if (this.$rxFormat == null)
	{
		this.$rxFormat = /\{(\{)|(\})\}|\{(\d+)([$#])?(\d+)?([+-])?\}/g;
	}

	return (String(value).replace(this.$rxFormat, applyFormat));
};/*! @namespace {SDL.Client.Xml} */
SDL.Client.Type.registerNamespace("SDL.Client.Xml");

SDL.Client.Xml = function SDL$Client$Xml(document)
{
	return SDL.Client.Xml.getOuterXml(document);
};

/**
* Defines several common namespaces in use throughout the system.
*/
SDL.Client.Xml.Namespaces =
{
	xsl: "http://www.w3.org/1999/XSL/Transform",
	xlink: "http://www.w3.org/1999/xlink",
	models: "http://wwww.sdlcommonui.com/core/models",
	apphost: "http://www.sdl.com/2013/ApplicationHost",
	list: "http://www.sdlcommonui.com/2009/GUI/extensions/List"
};


SDL.Client.Xml.containsNode = function SDL$Client$Xml$containsNode(parent, child)
{
	if (parent)
	{
		if (parent.nodeType == 2)
		{
			return child == parent;
		}
		else if (child && child.nodeType == 2)
		{
			child = this.selectSingleNode(child, "..");
		}

		while (child && child != parent)
		{
			child = child.parentNode;
		}
		return child == parent;
	}
	return false;
};

SDL.Client.Xml.createResolver = function SDL$Client$Xml$createResolver(namespaces)
{
	return function Xml$resolvePrefix(prefix)
	{
		if (namespaces && namespaces[prefix])
		{
			return namespaces[prefix];
		}
		return SDL.Client.Xml.Namespaces[prefix];
	}
};

SDL.Client.Xml.createElementNS = function SDL$Client$Xml$createElementNS(xmlDoc, ns, name)
{
	SDL.Client.Diagnostics.Assert.isDocument(xmlDoc);
	SDL.Client.Diagnostics.Assert.isString(ns);
	SDL.Client.Diagnostics.Assert.isString(name);

	if (xmlDoc.createElementNS)
	{
		return xmlDoc.createElementNS(ns, name);
	}
	else
	{
		return xmlDoc.createNode(1, name, ns);
	}
};

SDL.Client.Xml.createAttributeNS = function SDL$Client$Xml$createAttributeNS(xmlDoc, ns, name)
{
	SDL.Client.Diagnostics.Assert.isDocument(xmlDoc);
	SDL.Client.Diagnostics.Assert.isString(ns);
	SDL.Client.Diagnostics.Assert.isString(name);

	if (xmlDoc.createAttributeNS)
	{
		return xmlDoc.createAttributeNS(ns, name);
	}
	else
	{
		return xmlDoc.createNode(2, name, ns);
	}
};

SDL.Client.Xml.setAttributeNodeNS = function SDL$Client$Xml$setAttributeNodeNS(element, attribute, ns)
{
	if (element.setAttributeNodeNS)
	{
		element.setAttributeNodeNS(attribute, ns);
	}
	else
	{
		element.setAttributeNode(attribute);
	}
};

SDL.Client.Xml.escape = function SDL$Client$Xml$escape(string, attribute)
{
	if (string != null)
	{
		string = string.toString();
		string = string.replace(/&/g, "&amp;");
		string = string.replace(/</g, "&lt;");
		string = string.replace(/>/g, "&gt;");
		if (attribute)
		{
			string = string.replace(/\'/g, "&apos;");
			string = string.replace(/\"/g, "&quot;");
		}
	}
	return string;
};

SDL.Client.Xml.getInnerText = function SDL$Client$Xml$getInnerText(node, xpath, defaultValue, namespaces)
{
	if (node && xpath)
	{
		node = this.selectSingleNode(node, xpath, namespaces);
		if (!node)
		{
			return defaultValue;
		}
	}

	if (node)
	{
		if (node.nodeType == 9)
		{
			node = node.documentElement;
		}

		if (node.textContent != undefined)
		{
			return node.textContent;
		}
		else
		{
			return node.text;
		}
	}
};

SDL.Client.Xml.getInnerXml = function SDL$Client$Xml$getInnerXml(node, xpath, namespaces)
{
	if (node)
	{
		var selection = xpath ? this.selectSingleNode(node, xpath, namespaces) : node;
		if (selection)
		{
			var stringBuilder = [];
			var childNode = selection.firstChild;
			while (childNode)
			{
				stringBuilder.push(this.getOuterXml(childNode));
				childNode = childNode.nextSibling;
			}
			return stringBuilder.join("");
		}
	}
};

SDL.Client.Xml.getNewXmlDocument = function SDL$Client$Xml$getNewXmlDocument(xml, async, freeThreaded)
{
	var xmlDoc = null;
	var errorText = null;
	try
	{
		if (window.DOMParser && !SDL.jQuery.browser.msie)
		{
			xmlDoc = (new window.DOMParser()).parseFromString(xml, "text/xml");
			var namespaceURI = xmlDoc.documentElement.namespaceURI;
			if (xmlDoc.documentElement.nodeName == "parsererror" && (namespaceURI == "http://www.w3.org/1999/xhtml" || namespaceURI == "http://www.mozilla.org/newlayout/xml/parsererror.xml"))
			{
				errorText = this.getInnerText(xmlDoc);
			}
			else if (SDL.jQuery.browser.webkit)
			{
				var firstChild = xmlDoc.documentElement.firstChild;
				if (firstChild && firstChild.nodeName == "parsererror" && firstChild.namespaceURI == "http://www.w3.org/1999/xhtml")
				{
					errorText = this.getInnerText(firstChild);
				}
				else if (firstChild && (firstChild = firstChild.firstChild) && firstChild.nodeName == "parsererror" && firstChild.namespaceURI == "http://www.w3.org/1999/xhtml")
				{
					errorText = this.getInnerText(firstChild);
				}
			}
		}
		else
		{
			var progIDs = this.progIDs();
			if (!freeThreaded && progIDs.domDocument || freeThreaded && progIDs.freeThreadedDOMDocument)
			{
				xmlDoc = new ActiveXObject(freeThreaded ? progIDs.freeThreadedDOMDocument : progIDs.domDocument);
				xmlDoc.async = async ? true : false;
				xmlDoc.preserveWhiteSpace = true;

				var namespaces = [];
				for (var prefix in SDL.Client.Xml.Namespaces)
				{
					namespaces.push(SDL.Client.Types.String.format("xmlns:{0}=\"{1}\"", prefix, SDL.Client.Xml.Namespaces[prefix]));
				}

				if (namespaces.length > 0)
				{
					xmlDoc.setProperty("SelectionNamespaces", namespaces.join(" "));
				}
				xmlDoc.setProperty("SelectionLanguage", "XPath");

				if (progIDs.domDocument == "MSXML2.DOMDocument.6.0")
				{
					xmlDoc.setProperty("AllowXsltScript", true);
				}

				if (xml)
				{
					xmlDoc.loadXML(xml);
				}
			}
			else
			{
				errorText = "Could not find appropriate progID";
			}
		}
	}
	catch (err)
	{
		SDL.Client.Diagnostics.Assert.raiseError(err.message);
		errorText = err.message;
	}

	if (errorText !== null)
	{
		xmlDoc = { parseError: { errorCode: 1, reason: errorText, srcText: xml} };
	}

	return xmlDoc;
};

SDL.Client.Xml.getNewXsltProcessor = function SDL$Client$Xml$getNewXsltProcessor(xslt)
{
	SDL.Client.Diagnostics.Assert.isNotNullOrUndefined(xslt);

	var stylesheetXml = SDL.Client.Type.isString(xslt)
		? this.getNewXmlDocument(xslt)
		: xslt;

	if (window.XSLTProcessor)
	{
		var processor = new XSLTProcessor();
		if (SDL.jQuery.browser.mozilla)	// in FF output method="html" causes the generated output to be in xhtml namespace. Typically we don't want that.
		{
			var htmlMethodAttribute = this.selectSingleNode(stylesheetXml, "/xsl:stylesheet/xsl:output/@method[.='html']");
			if (htmlMethodAttribute)
			{
				htmlMethodAttribute.value = "xml";
			}
		}

		try
		{
			processor.importStylesheet(stylesheetXml);
		}
		catch (e)
		{
			SDL.Client.Diagnostics.Assert.raiseError(e.message);
			throw e;
		}
		return processor;
	}
	else
	{
		var progIDs = this.progIDs();
		if (progIDs.xslTemplate)
		{
			var xslt = new ActiveXObject(progIDs.xslTemplate);
			var freeTheadedXml = this.getNewXmlDocument(stylesheetXml.xml, true, true);

			xslt.stylesheet = freeTheadedXml;
			return xslt.createProcessor();
		}
		else
		{
			throw Error("Unable to create xsltProcessor");
		}
	}
};

SDL.Client.Xml.getParentNode = function SDL$Client$Xml$getParentNode(child)
{
	return child.nodeType == 2 ? this.selectSingleNode(child, "..") : child.parentNode;
};

SDL.Client.Xml.getOuterXml = function SDL$Client$Xml$getOuterXml(node, xpath)
{
	if (node)
	{
		var selection = xpath ? this.selectSingleNode(node, xpath) : node;
		if (selection)
		{
			if (SDL.Client.Type.isString(selection.xml))
			{
				return selection.xml;
			}
			else
			{
				return (new XMLSerializer()).serializeToString(selection);
			}
		}
	}
};

/**
* Returns a string that provides information about a document's parse error, if it has one.
* @param {XMLDocument} document The document for which to generate parse error text.
* @return {String} An error text associated with the specified document's parse error, if it has one; otherwise
* the return value is <c>null</c>.
*/
SDL.Client.Xml.getParseError = function SDL$Client$Xml$getParseError(document)
{
	if (document && this.hasParseError(document))
	{
		return SDL.Client.Types.String.format("{0}: ({1})", document.url, document.parseError.reason);
	}
	SDL.Client.Diagnostics.Assert.isDocument(document);
	return null;
};

/**
* Returns <c>true</c> if the specified documen has a parse error.
* @param {XMLDocument} document The document to check.
* @return {Boolean} <c>true</c> if the specified documen has a parse error; otherwise <c>false</c>.
*/
SDL.Client.Xml.hasParseError = function SDL$Client$Xml$hasParseError(document)
{
	return (document.parseError && document.parseError.errorCode != 0) || false;
};

SDL.Client.Xml.progIDs = function SDL$Client$Xml$progIDs()
{
	var progIDs = this.progIDs;
	if (!progIDs.initialized)
	{
		progIDs.initialized = true;
		var msXmlProgIDs = [".6.0", ".3.0"];
		for (var i = 0, l = msXmlProgIDs.length; i < l; i++)
		{
			var ver = msXmlProgIDs[i];

			if (!progIDs.domDocument)
			{
				try
				{
					new ActiveXObject("MSXML2.DOMDocument" + ver);
					progIDs.domDocument = "MSXML2.DOMDocument" + ver;
				}
				catch (err) { }
			}
			if (!progIDs.freeThreadedDOMDocument)
			{
				try
				{
					new ActiveXObject("MSXML2.FreeThreadedDOMDocument" + ver);
					progIDs.freeThreadedDOMDocument = "MSXML2.FreeThreadedDOMDocument" + ver;
				}
				catch (err) { }
			}
			if (!progIDs.xslTemplate)
			{
				try
				{
					new ActiveXObject("MSXML2.XSLTemplate" + ver);
					progIDs.xslTemplate = "MSXML2.XSLTemplate" + ver;
				}
				catch (err) { }
			}
			if (progIDs.domDocument && progIDs.freeThreadedDOMDocument && progIDs.xslTemplate)
			{
				break;
			}
		}
	}
	return progIDs;
};

SDL.Client.Xml.selectStringValue = function SDL$Client$Xml$selectStringValue(parent, xPath, namespaces)
{
	var doc = (!parent || parent.nodeType == 9) ? parent : parent.ownerDocument;
	if (doc)
	{
		if (doc.evaluate)
		{
			var xPathResult = doc.evaluate(xPath, parent, this.createResolver(namespaces),
				XPathResult.STRING_TYPE, null);

			return xPathResult ? xPathResult.stringValue : null;
		}
		else
		{
			if (namespaces)
			{
				var nsList = String(doc.getProperty("SelectionNamespaces") || "").split(" ");
				for (var prefix in namespaces)
				{
					var spec = SDL.Client.Types.String.format("xmlns:{0}=\"{1}\"", prefix, namespaces[prefix]);
					if (SDL.jQuery.inArray(spec, nsList) == -1)
					{
						nsList.push(spec);
					}
				}
				doc.setProperty("SelectionNamespaces", nsList.join(" "));
			}
			var result = parent.selectSingleNode(xPath);
			return result ? result.nodeValue : null;
		}
	}
};

SDL.Client.Xml.selectSingleNode = function SDL$Client$Xml$selectSingleNode(parent, xPath, namespaces)
{
	var doc = (!parent || parent.nodeType == 9) ? parent : parent.ownerDocument;
	if (doc)
	{
		if (doc.evaluate)
		{
			var xPathResult = doc.evaluate(xPath, parent, this.createResolver(namespaces),
				XPathResult.FIRST_ORDERED_NODE_TYPE, null);

			return xPathResult.singleNodeValue;
		}
		else
		{
			if (namespaces)
			{
				var nsList = String(doc.getProperty("SelectionNamespaces") || "").split(" ");
				for (var prefix in namespaces)
				{
					var spec = SDL.Client.Types.String.format("xmlns:{0}=\"{1}\"", prefix, namespaces[prefix]);
					if (SDL.jQuery.inArray(spec, nsList) == -1)
					{
						nsList.push(spec);
					}
				}
				doc.setProperty("SelectionNamespaces", nsList.join(" "));
			}
			return parent.selectSingleNode(xPath);
		}
	}
};

SDL.Client.Xml.selectNodes = function SDL$Client$Xml$selectNodes(parent, xPath, namespaces)
{
	var result = [];
	var doc = (!parent || parent.nodeType == 9) ? parent : parent.ownerDocument;
	if (doc)
	{
		if (doc.evaluate)
		{
			var xPathResult = doc.evaluate(xPath, parent, this.createResolver(namespaces),
				XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);

			var node = xPathResult.iterateNext();
			while (node)
			{
				result[result.length] = node;
				node = xPathResult.iterateNext();
			}
		}
		else
		{
			if (namespaces)
			{
				var nsList = String(doc.getProperty("SelectionNamespaces") || "").split(" ");
				for (var prefix in namespaces)
				{
					var spec = SDL.Client.Types.String.format("xmlns:{0}=\"{1}\"", prefix, namespaces[prefix]);
					if (SDL.jQuery.inArray(spec, nsList) == -1)
					{
						nsList.push(spec);
					}
				}
				doc.setProperty("SelectionNamespaces", nsList.join(" "));
			}
			result = parent.selectNodes(xPath);
		}
	}
	return result;
};

SDL.Client.Xml.removeAll = function SDL$Client$Xml$removeAll(nodeList)
{
	if (typeof (nodeList.context) != "undefined")  // xml node list
	{
		nodeList.removeAll();
	}
	else
	{
		for (var i = 0, len = nodeList.length; i < len; i++)
		{
			var node = nodeList[i];
			switch (node.nodeType)
			{
				case 2: //node.ATTRIBUTE_NODE:
					this.getParentNode(node).removeAttributeNode(node);
					break;
				default:
					node.parentNode.removeChild(node);
					break;
			}
		}
	}
};

SDL.Client.Xml.setInnerText = function SDL$Client$Xml$setInnerText(node, value)
{
	if (node == null)
	{
		return null;
	}

	if (node.nodeType == 9)
	{
		node = node.documentElement;
	}

	if (node.textContent != undefined)
	{
		node.textContent = value;
	}
	else
	{
		node.text = value;
	}
};

SDL.Client.Xml.setInnerXml = function SDL$Client$Xml$setInnerXml(node, xml)
{
	if (node)
	{
		this.setInnerText(node, "");
		if (xml)
		{
			var doc = this.getNewXmlDocument("<r>" + xml + "</r>");

			var docElement = this.importNode(node.ownerDocument, doc.documentElement, true);
			var child = docElement.firstChild;
			while (child)
			{
				node.appendChild(child);
				child = docElement.firstChild;
			}
		}
	}
};

SDL.Client.Xml.importNode = function SDL$Client$Xml$importNode(document, node, deep)
{
	if (SDL.jQuery.browser.msie && this.progIDs().domDocument == "MSXML2.DOMDocument.3.0")	// msxml 3.0 does not support importNode() method
	{
		return node.cloneNode(deep);
	}
	else if (document && node)
	{
		return document.importNode(node, deep);
	}
};

SDL.Client.Xml.setOuterXml = function SDL$Client$Xml$setOuterXml(node, xml)
{
	if (node && node.nodeType == 1)
	{
		var parent = node.parentNode;
		if (xml)
		{
			var doc = this.getNewXmlDocument(xml);
			var newNode = this.importNode(node.ownerDocument, doc.documentElement, true);
			parent.replaceChild(newNode, node);
			return newNode;
		}
		else
		{
			// xml is null - remove node
			parent.removeChild(node);
		}
	}
	return null;
};

/**
* Transforms the supplied xml document and returns the result as a new <c>XMLDocument</c>
* @param {XMLDocument} inputDoc The document to transform.
* @param {XSLTProcessor} xslProcessor The stylesheet to transform with.
* @param {Object} parameters The name/value hash of arguments to supply to the processor prior to transforming.
* @returns {XMLDocument} The result of the transformation.
*/
SDL.Client.Xml.transformToXmlDocument = function SDL$Client$Xml$transformToXmlDocument(inputDoc, xslProcessor, parameters)
{
	SDL.Client.Diagnostics.Assert.isNode(inputDoc);
	SDL.Client.Diagnostics.Assert.isNotNullOrUndefined(xslProcessor);

	return this.xsltTransform(xslProcessor, inputDoc, parameters, true);
};

/**
* Transforms the supplied xml document and returns the result as a string.
* @param {XMLDocument} inputDoc The document to transform
* @param {XSLTProcessor} xslProcessor The stylesheet to transform with.
* @param {Object} parameters The name/value hash of arguments to supply to the processor prior to transforming.
* @returns {String} The result of the transformation.
*/
SDL.Client.Xml.transformToString = function SDL$Client$Xml$transformToString(inputDoc, xslProcessor, parameters)
{
	SDL.Client.Diagnostics.Assert.isNode(inputDoc);
	SDL.Client.Diagnostics.Assert.isNotNullOrUndefined(xslProcessor);

	return this.xsltTransform(xslProcessor, inputDoc, parameters, false);
};

/**
* Transforms the supplied xml document and returns the result as a new <c>XsltProcessor</c>
* @param {XMLDocument} inputDoc The document to transform
* @param {XSLTProcessor} xslProcessor The stylesheet to transform with.
* @param {Object} parameters The name/value hash of arguments to supply to the processor prior to transforming.
* @returns {XSLTProcessor} The result of the transformation.
*/
SDL.Client.Xml.transformToXslProcessor = function SDL$Client$Xml$transformToXslProcessor(inputDoc, xslProcessor, parameters, namespaceSelectors)
{
	SDL.Client.Diagnostics.Assert.isNode(inputDoc);
	SDL.Client.Diagnostics.Assert.isNotNullOrUndefined(xslProcessor);

	var nsDeclares = new Array;
	var nsExcludes = new Array;
	if (namespaceSelectors)
	{
		for (var prefix in namespaceSelectors)
		{
			nsExcludes.push(prefix);
			nsDeclares.push(SDL.Client.Types.String.format('xmlns:{0}="{1}"', prefix, namespaceSelectors[prefix]));
		}
	}

	var xslText = this.transformToString(inputDoc, xslProcessor, parameters);
	if (xslText.match(/xmlns:xsl/))
	{
		xslText = xslText.replace(/xmlns:out="[^\"]+"/g, "");
	}

	xslText = xslText.replace(/XSL\/Transform\/Generated/, "XSL/Transform");
	xslText = xslText.replace(/<out:/g, "<xsl:");
	xslText = xslText.replace(/<\/out:/g, "</xsl:");
	xslText = xslText.replace(/xmlns:out/g, "xmlns:xsl");

	xslText = xslText.replace(/[\s\S]*(<xsl:stylesheet .*?)>/,
		"$1 " + nsDeclares.join(" ") +
		' exclude-result-prefixes="' + nsExcludes.join(" ") + '">');

	var xslDocument = this.getNewXmlDocument(xslText);
	var xslProcessor = this.getNewXsltProcessor(xslDocument);
	return xslProcessor;
};

SDL.Client.Xml.xsltTransform = function SDL$Client$Xml$xsltTransform(xsltProcessor, xml, parameters, toDocument)
{
	var output = null;

	try
	{
		if (xsltProcessor && xml)
		{
			if (typeof (parameters) == "object")
			{
				for (var key in parameters)
				{
					if (parameters[key] == null)
					{
						continue;
					}
					if (xsltProcessor.setParameter)
					{
						xsltProcessor.setParameter(null, key, parameters[key]);
					}
					else
					{
						xsltProcessor.addParameter(key, parameters[key]);
					}
				}
			}

			if (xsltProcessor.transformToDocument)
			{
				output = xsltProcessor.transformToDocument(xml);
				if (!toDocument)
				{
					output = this.getOuterXml(output);
				}
				xsltProcessor.clearParameters();
			}
			else
			{
				xsltProcessor.reset();
				xsltProcessor.input = xml;
				if (toDocument)
				{
					output = this.getNewXmlDocument();
					xsltProcessor.output = output;
					xsltProcessor.transform();
				}
				else
				{
					xsltProcessor.transform();
					output = xsltProcessor.output;
				}
				xsltProcessor.output = null;
			}
		}
	}
	catch (e)
	{
		SDL.Client.Diagnostics.Assert.raiseError(e.message);
		throw e;
	}
	return output;
};

SDL.Client.Xml.getAttributes = function SDL$Client$Xml$getAttributes(xmlNode)
{
	if (xmlNode)
	{
		return this.selectNodes(xmlNode, "@*");
	}
};

SDL.Client.Xml.toJson = function SDL$Client$Xml$toJson(xmlNode, attrPrefix)
{
	if (xmlNode)
	{
		var nodeType = xmlNode.nodeType;
		if (nodeType == 9)
		{
			xmlNode = xmlNode.documentElement;
			if (xmlNode)
			{
				nodeType = xmlNode.nodeType;
			}
			else
			{
				return;
			}
		}

		var result;

		if (nodeType == 2)	// attribute
		{
			result = xmlNode.value;
		}
		else if (nodeType == 1)	// element
		{
			if (attrPrefix == null)
			{
				attrPrefix = "@";
			}

			var attribs = this.getAttributes(xmlNode);
			var attrLen = attribs.length
			var childNode = this.getFirstElementChild(xmlNode);

			if (attrLen || childNode)
			{
				var propCount = 0;
				var arrayProp;
				var first = true;

				result = {};

				for (var i = 0; i < attrLen; i++)
				{
					propCount++;
					result[attrPrefix + this.getLocalName(attribs[i])] = this.toJson(attribs[i]);
				}

				while (childNode)
				{
					var propName = this.getLocalName(childNode);
					if (propName in result)
					{
						var existProp = result[propName];
						if (!SDL.Client.Type.isArray(existProp))
						{
							arrayProp = propName;
							existProp = result[propName] = [existProp];
						}
						existProp.push(this.toJson(childNode, attrPrefix));
					}
					else
					{
						propCount++;
						result[propName] = this.toJson(childNode, attrPrefix);
					}

					childNode = this.getNextElementSibling(childNode);
				}
				if (propCount == 1 && arrayProp)
				{
					result = result[arrayProp];
				}
			}
			else
			{
				result = this.getInnerText(xmlNode);
			}
		}
		return result;
	}
};

SDL.Client.Xml.getLocalName = function SDL$Client$Xml$getLocalName(node)
{
	if (node)
	{
				// standard   || IE XML DOM
		return node.localName || node.baseName;
	}
};

SDL.Client.Xml.getNextElementSibling = function SDL$Client$Xml$getNextElementSibling(node)
{
	if (node)
	{
		node = node.nextSibling;
		while (node && node.nodeType != 1)
		{
			node = node.nextSibling;
		}
	}
	return node;
};

SDL.Client.Xml.getFirstElementChild = function SDL$Client$Xml$getFirstElementChild(node)
{
	if (node)
	{
		node = node.firstChild;
		if (node && node.nodeType != 1)
		{
			node = this.getNextElementSibling(node);
		}
	}
	return node;
};/*! @namespace {SDL.Client.Event.Event} */
SDL.Client.Type.registerNamespace("SDL.Client.Event");

/**
 * Represents the event that was fired.
 * @param {String} eventType The name of the event being fired.
 * @param {Object} eventTarget The object that fires the event.
 * @param {Object} eventData Additional data that this event passes.
 */
SDL.Client.Event.Event = function SDL$Client$Event$Event(eventType, eventTarget, eventData)
{
	SDL.Client.Diagnostics.Assert.isString(eventType);
	SDL.Client.Diagnostics.Assert.isObject(eventTarget);

	this.type = eventType;
	this.target = eventTarget;
	this.data = eventData;
	this.timeStamp = SDL.jQuery.now();
	this.defaultPrevented = false;
	this.preventDefault = function()
	{
		this.defaultPrevented = true;
	}
};(function($)
{
	var orig_inArray = $.inArray;
	$.inArray = function SDL$Client$Types$Array$indexOf(value, array, fromIndex, compareFunc)
	{
		if (!compareFunc)
		{
			return orig_inArray.apply(this, arguments);
		}
		else
		{
			for (var len = array.length, i = (fromIndex ? (fromIndex < 0 ? Math.max(0, len + fromIndex) : fromIndex) : 0); i < len; i++)
			{
				if ((i in array) && compareFunc(array[i], value))
				{
					return i;
				}
			}
			return -1;
		}
	};
})(SDL.jQuery);
/*! @namespace {SDL.Client.Types.Array} */
SDL.Client.Type.registerNamespace("SDL.Client.Types.Array");

/**
 * Returns an array of arguments.
 * Use this method to extract the arguments for use in functions that operate on either a single argument or on
 * multiple arguments, packed in an array and passed in as a single argument.
 * @param {Array} args The original arguments object.
 * @param {Number} startIndex The index from which to start copying. Optional.
 * @param {Number} stopIndex The index before which to stop copying. Optional.
 * @example var params = Array.fromArguments(arguments);
 * @example var params = Array.fromArguments(arguments, 1);
 * @example var params = Array.fromArguments(arguments, 0, 1);
 */
SDL.Client.Types.Array.fromArguments = function SDL$Client$Types$Array$fromArguments(args, startIndex, stopIndex)
{	
	var result = [];
	var start = startIndex || 0;

	if (args == null)
	{
		return result;
	}

	if (SDL.Client.Type.isArray(args[start]))
	{
		result = args[start];
	}
	else
	{
		var stop = SDL.Client.Type.isNumber(stopIndex) ? stopIndex : args.length;
		for (var i = start; i < stop; i++)
		{
			result.push(args[i]);
		}
	}

	return result;
};

/**
* Creates a copy of the passed array in the local context of the caller.
* @param {Array} array The array to clone.
* @return {Array} The cloned array.
*/
SDL.Client.Types.Array.clone = function SDL$Client$Types$Array$clone(array)
{
	if (SDL.Client.Type.isArray(array))
	{
		var clonedArray = [];
		for (var i = 0, len = array.length; i < len; i++)
		{
			clonedArray.push(array[i]);
		}
		return clonedArray;
	}
};

/**
* Returns a value indicating whether these arrays contains the same values.
* @param {Array} array The first array to check.
* @param {Array} array The second array to check.
* @return {Boolean} <c>true</c> if these arrays are equal, otherwise <c>false</c>.
*/
SDL.Client.Types.Array.areEqual = function SDL$Client$Types$Array$areEqual(array1, array2)
{
	if (array1 == array2)
	{
		return true;
	}
	else if (SDL.Client.Type.isArray(array1) && SDL.Client.Type.isArray(array2))
	{
		array1 = this.normalize(array1.slice());
		array2 = this.normalize(array2.slice());
		if (array1.length == array2.length)
		{
			for (var i = 0, l = array1.length; i < l; i++)
			{
				if (array1[i] !== array2[i])
				{
					return false;
				}
			}
			return true;
		}
	}
	return false;
};

/**
* Returns true if the specified value is found within the array
* @param {Array} array The array to be searched.
* @param {Object} value The value to look for.
* @param {Function} compareFunc The compare function.
* @return {Boolean} True if the value has been found
*/
SDL.Client.Types.Array.contains = function SDL$Client$Types$Array$contains(array, value, compareFunc)
{
	return SDL.jQuery.inArray(value, array, 0, compareFunc) != -1;
};

SDL.Client.Types.Array.normalize = function SDL$Client$Types$Array$normalize(array)
{
	array = array.sort();
	for (var i = array.length - 2; i >= 0; i--)
	{
		if (array[i] === array[i + 1])
		{
			this.removeAt(array, i);
		}
	}
	return array;
};

SDL.Client.Types.Array.removeAt = function SDL$Client$Types$Array$removeAt(array, index)
{
	if (index < 0)
	{
		return;
	}
	var l = array.length;
	if (index < l)
	{
		array.splice(index, 1);
	}
};

/**
	* Moves a value to another position within this array
*/
SDL.Client.Types.Array.move = function SDL$Client$Types$Array$move(array, fromIndex, toIndex)
{
	if (fromIndex < 0 || toIndex < 0 || fromIndex == toIndex)
	{
		return;
	}

	var l = array.length;
	if (fromIndex >= l || toIndex >= l)
	{
		return;
	}

	var tmp = array[fromIndex];
	if (fromIndex < toIndex)
	{
		for(var i = fromIndex; i < toIndex; i++)
		{
			array[i] = array[i+1];
		}

	}
	else
	{
		for(var i = fromIndex; i > toIndex; i--)
		{
			array[i] = array[i-1];
		}
	}
	array[toIndex] = tmp;
};

SDL.Client.Types.Array.insert = function SDL$Client$Types$Array$insert(array, value, index)
{
	var i = array.length;
	if (i > index)
	{
		do
		{
			this[i] = this[i-1];
			i--;
		}
		while (i > index);
	}
	this[i] = value;
};/*! @namespace {SDL.Client.Types.Function} */
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
};/*! @namespace {SDL.Client.Types.OO} */
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
/*! @namespace {SDL.Client.Types.Object} */
SDL.Client.Type.registerNamespace("SDL.Client.Types.Object");

// differs from window.JSON.stringify in how Date is serialized
// JSON.parse(window.JSON.stringify(new Date())) will result in a string, while
// SDL.Client.Types.Object.deserialize(SDL.Client.Types.Object.serialize(new Date())) will yield a Date object
SDL.Client.Types.Object.serialize = function SDL$Client$Types$Object$serialize(object, handleDates)
{
	if (!handleDates && window.JSON && window.JSON.stringify)
	{
		return window.JSON.stringify(object);
	}
	else
	{
		var i;
		switch (typeof object)
		{
			case "object":
				if (object)
				{
					if (SDL.Client.Type.isArray(object))
					{
						var arr = [];
						for (var i = 0, l = object.length; i < l; i++)
						{
							var value = object[i];
							if (!value || !value.isFunction)
							{
								arr.push(SDL.Client.Types.Object.serialize(value));
							}
						}
						return "[" + arr.join(",") + "]";
					}
					else if (SDL.Client.Type.isDate(object))
					{
						// Work in server time coordinate (remove the GMT difference that exists in the Date object by default)
						return "\"\\/Date(" + (object.getTime() - object.getTimezoneOffset() * 60000) + ")\\/\"";
					}
					else
					{
						var arr = [];
						for (var name in object)
						{
							var value = object[name];
							if (!value || !value.isFunction)
							{
								arr.push([SDL.Client.Types.Object.serialize(name), SDL.Client.Types.Object.serialize(object[name])].join(":"));
							}
						}
						return "{" + arr.join(",") + "}";
					}
				}
				else
				{
					return "null";
				}
				break;

			case "number":
				return String(object);

			case "string":
				if (navigator.userAgent.indexOf(" Safari/") > -1 || (/[\"\b\f\n\r\t\\\\\x00-\x1F]/i).test(object))
				{
					var arr = [];
					var length = object.length;
					for (i = 0; i < length; ++i)
					{
						var curChar = object.charAt(i);
						if (curChar >= " ")
						{
							if (curChar === "\\" || curChar === "\"")
							{
								arr.push("\\");
							}
							arr.push(curChar);
						}
						else
						{
							switch (curChar)
							{
								case "\b":
									arr.push("\\b");
									break;
								case "\f":
									arr.push("\\f");
									break;
								case "\n":
									arr.push("\\n");
									break;
								case "\r":
									arr.push("\\r");
									break;
								case "\t":
									arr.push("\\t");
									break;
								default:
									arr.push("\\u00");
									if (curChar.charCodeAt() < 16)
									{
										arr.push("0");
									}
									arr.push(curChar.charCodeAt().toString(16));
							}
						}
					}
					return "\"" + arr.join("") + "\"";
				}
				else
				{
					return "\"" + object + "\"";
				}

			case "boolean":
				return object.toString();

			default:
				return "null";
		}
	}
};

// differs from window.JSON.parse in the way it treats Date objects serialized with SDL.Client.Types.Object.serialize()
SDL.Client.Types.Object.deserialize = function SDL$Client$Types$Object$deserialize(text, handleDates)
{
	if (text.length == 0)
	{
		return undefined;
	}
	else if (!handleDates && window.JSON && window.JSON.parse)
	{
		return window.JSON.parse(text);
	}
	else
	{
		if (this.rxpDeserialize == null)
		{
			this.rxpSecureDeserialize = /\(/g;
			this.rxpDateDeserialize = /(^|[^\\])\"\\\/Date\\\((-?[0-9]+)(?:[a-zA-Z]|(?:\\+|-)[0-9]{4})?\)\\\/\"/g;
		}

		return eval("(" + text.replace(this.rxpSecureDeserialize, "\\(").replace(this.rxpDateDeserialize, "$1new Date($2)") + ")");		
	}
};

/**
* Creates a shallow copy of the passed object in the local context of the caller.
* @param {Array} object The object to clone.
* @return {Array} The cloned object.
*/
SDL.Client.Types.Object.clone = function SDL$Client$Types$Object$clone(object)
{
	if (SDL.Client.Type.isObject(object))
	{
		var clonedObject = {};
		for (var i in object)
		{
			var k = (i == null ? "" : i);
			clonedObject[k] = object[k];
		}
		return clonedObject;
	}
	return (typeof object == "object" && object !== null && this.isFunction(object.valueOf)) ? object.valueOf() : object;
};

SDL.Client.Types.Object.find = function SDL$Client$Types$Object$find(object, value)
{
	if (object)
	{
		for (var p in object)
		{
			if (object[p] == value)
			{
				return p;
			}
		}
	}
};

SDL.Client.Types.Object.getUniqueId = function SDL$Client$Types$Object$getUniqueId(object)
{
	if (object)
	{
		if (SDL.jQuery.isWindow(object))
		{
			// create uniqueId under SDL namespace, to prevent creating a global variable
			if (!object.SDL)
			{
				object.SDL = {};
			}

			return object.SDL.uniqueID || (object.SDL.uniqueID = "obj_" + SDL.Client.Types.Object.getNextId());
		}
		else if (SDL.Client.Type.isDocument(object))	// uniqueID for a document in IE(8) is changing every time you ask for it
		{
			return object.documentUniqueID || (object.documentUniqueID = "obj_" + SDL.Client.Types.Object.getNextId());
		}
		else
		{
			return object.uniqueID || (object.uniqueID = "obj_" + SDL.Client.Types.Object.getNextId());
		}
	}
};

SDL.Client.Types.Object.getNextId = function SDL$Client$Types$Object$getNextId()
{
	return this.$$uniqueID ? ++this.$$uniqueID : (this.$$uniqueID = 1);
};/*! @namespace {SDL.Client.Types.DisposableObject} */
SDL.Client.Types.OO.createInterface("SDL.Client.Types.DisposableObject");

//Copy the block within the comment below to a class implementing SDL.Client.Types.DisposableObject
/*
	// [optional]
	// implement disposeInterface if the current interface needs to be disposed
	// interfaces don't have to remove properties from this.properties,
	// it will be done by SDL.Client.Types.DisposableObject at the end of dispose
	this.disposeInterface = SDL.Client.Types.OO.nonInheritable(function()
	{
	});
*/

SDL.Client.Types.DisposableObject.prototype.dispose = function SDL$Client$Types$DisposableObject$dispose()
{
	var p = this.properties;
	if (!p.disposed && !p.disposing)
	{
		this._setDisposing();
		this.callInterfaces("disposeInterface");

		for (var x in p)
		{
			p[x] = undefined;	// this will release the properties even if 'p' itself is referenced some where
		}

		var interfaces = this.interfaces;
		var newProperties = {disposed:true};
		for (var i in interfaces)
		{
			if (i != "type")
			{
				interfaces[i].properties = newProperties;	// set new properties for each interface
			}
		}
	}
};

SDL.Client.Types.DisposableObject.prototype.getDisposed = function SDL$Client$Types$DisposableObject$getDisposed()
{
	return this.properties.disposed;
};

SDL.Client.Types.DisposableObject.prototype._setDisposing = function SDL$Client$Types$UI$DisposableObject$_setDisposing()
{
	this.properties.disposing = true;
};

SDL.Client.Types.DisposableObject.prototype.getDisposing = function SDL$Client$Types$DisposableObject$getDisposing()
{
	return this.properties.disposing;
};var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
if (SDL.jQuery.inArray("data", (SDL.jQuery).event.props) == -1) {
    (SDL.jQuery).event.props.push("data");
}

var SDL;
(function (SDL) {
    (function (Client) {
        (function (Types) {
            ;

            eval(SDL.Client.Types.OO.enableCustomInheritance);
            var ObjectWithEvents = (function (_super) {
                __extends(ObjectWithEvents, _super);
                function ObjectWithEvents() {
                    _super.call(this);
                    var p = this.properties;
                    p.handlers = {};
                    p.timeouts = {};
                }
                ObjectWithEvents.prototype.addEventListener = function (event, handler) {
                    var handlers = this.properties.handlers;
                    if (handlers) {
                        var e = handlers[event];
                        if (!e) {
                            e = handlers[event] = [];
                        }
                        e.push({ fnc: handler });
                    }
                };

                ObjectWithEvents.prototype.removeEventListener = function (event, handler) {
                    var handlers = this.properties.handlers;
                    if (handlers) {
                        var e = handlers[event];
                        if (e) {
                            var l = e.length;
                            for (var i = 0; i < l; i++) {
                                if (e[i].fnc == handler) {
                                    if (l == 1) {
                                        delete handlers[event];
                                    } else {
                                        for (var j = i + 1; j < l; j++) {
                                            e[j - 1] = e[j];
                                        }
                                        e.pop();
                                    }
                                    return;
                                }
                            }
                        }
                    }
                };

                ObjectWithEvents.prototype.fireGroupedEvent = function (event, eventData, delay) {
                    var properties = this.properties;
                    if (event in properties.timeouts) {
                        clearTimeout(properties.timeouts[event]);
                    }
                    if (delay >= 0) {
                        var self = this;
                        properties.timeouts[event] = setTimeout(function () {
                            delete properties.timeouts[event];
                            self.fireEvent(event, eventData);
                        }, delay);
                    } else {
                        delete properties.timeouts[event];
                        this.fireEvent(event, eventData);
                    }
                };

                ObjectWithEvents.prototype.fireEvent = function (eventType, eventData) {
                    if (this.properties.handlers) {
                        var eventObj;
                        if (SDL.Client.Type.isObject(eventType)) {
                            eventObj = eventType;
                            eventObj.target = this;
                            eventType = eventObj.type;
                            SDL.Client.Diagnostics.Assert.isString(eventType);
                        } else {
                            eventObj = new SDL.Client.Event.Event(eventType, this, eventData);
                        }

                        var result = this._processHandlers(eventObj, eventType);
                        if (result !== false) {
                            result = this._processHandlers(eventObj, "*");
                        }

                        if (result === false) {
                            eventObj.defaultPrevented = true;
                        }

                        return eventObj;
                    }
                };

                ObjectWithEvents.prototype._processHandlers = function (eventObj, handlersCollectionName) {
                    var handlers = this.properties.handlers && this.properties.handlers[handlersCollectionName];
                    if (handlers) {
                        // handlers can be added/removed while handling an event
                        // thus have to recheck them if at least one handler has been executed
                        var needPostprocess;
                        var processedHandlers = [];

                        do {
                            needPostprocess = false;

                            for (var i = 0; handlers && (i < handlers.length); i++) {
                                var handler = handlers[i];
                                if (SDL.jQuery.inArray(handler, processedHandlers) == -1) {
                                    needPostprocess = true;
                                    processedHandlers.push(handler);

                                    if (handler.fnc.call(this, eventObj) === false) {
                                        return false;
                                    }

                                    handlers = this.properties.handlers && this.properties.handlers[handlersCollectionName];
                                }
                            }
                        } while(needPostprocess);
                    }
                };

                ObjectWithEvents.prototype._setDisposing = function (suppressEvent) {
                    this.fireEvent("beforedispose");
                    this.callBase("SDL.Client.Types.DisposableObject", "_setDisposing");
                    this.fireEvent("dispose");
                };
                return ObjectWithEvents;
            })(Types.DisposableObject);
            Types.ObjectWithEvents = ObjectWithEvents;
            ;

            SDL.Client.Types.OO.createInterface("SDL.Client.Types.ObjectWithEvents", ObjectWithEvents);
        })(Client.Types || (Client.Types = {}));
        var Types = Client.Types;
    })(SDL.Client || (SDL.Client = {}));
    var Client = SDL.Client;
})(SDL || (SDL = {}));
//@ sourceMappingURL=ObjectWithEvents.js.map
/*! @namespace {SDL.Client.Event.EventRegisterClass} */
SDL.Client.Types.OO.createInterface("SDL.Client.Event.EventRegisterClass");

SDL.Client.Event.EventRegisterClass.$constructor = function SDL$Client$Event$EventRegisterClass$constructor()
{
	this.addInterface("SDL.Client.Types.ObjectWithEvents");

	var self = this;
	var registryIndex = {};
	var loading = true;
	var unloading = false;

	/**
	* Adds the supplied event handler to the specified element
	* @param {Object} element Either a single HTML element, or an array of HTML elements.
	* @param {String} eventName The name of the event for which to add the binding.
	* @param {Function} eventHandler The function that habdles the event.
	*/
	this.addEventHandler = function SDL$Client$Event$EventRegisterClass$addEventHandler(object, event, handler, useCapture)
	{
		if (registryIndex && !this.getDisposing())
		{
			SDL.Client.Diagnostics.Assert.isObject(object, "SDL.Client.Event.EventRegister.addEventHandler: value should be an object. Provided value is: " + object);
			SDL.Client.Diagnostics.Assert.isString(event);
			SDL.Client.Diagnostics.Assert.isFunction(handler);
			addHandler(object, event, handler, useCapture);
		}
	};

    this.removeEventHandler = function SDL$Client$Event$EventRegisterClass$removeEventHandler(object, event, handler, useCapture)
	{
		if (registryIndex && !this.getDisposing())
		{
			SDL.Client.Diagnostics.Assert.isObject(object, "SDL.Client.Event.EventRegister.removeEventHandler: value should be an object. Provided value is: " + object);
			SDL.Client.Diagnostics.Assert.isString(event);
			removeHandler(object, event, handler, useCapture);
		}
	};

    this.removeAllEventHandlers = function SDL$Client$Event$EventRegisterClass$removeAllEventHandlers(object, event)
	{
		if (registryIndex && object && !this.getDisposing())
		{
			var uniqueId = SDL.Client.Types.Object.getUniqueId(object) || "";
			var registry = registryIndex[uniqueId];
			if (registry)
			{
				var l = registry.length;
				for (var i = 0; i < l; i++)
				{
					if (object == registry[i].object)
					{
						var events = registry[i].events;
						var toUnregister = true;
						if (events)
						{
							for (var e in events)
							{
								if (!event || e == event)
								{
									var listener = events[e];
									if (listener.hasNullHandler)
									{
										toUnregister = false;
										if (listener.handlers.length > 0)
										{
											listener.handlers = [];
										}
									}
									else
									{
										removeListener(object, e, events);
									}
								}
								else
								{
									toUnregister = false;
								}
							}
						}

						if (toUnregister)	// all events have been removed -> unregister
						{
							if (l == 1)
							{
								delete registryIndex[uniqueId];
							}
							else
							{
								SDL.Client.Types.Array.removeAt(registry, i);
							}
						}
						return;
					}
				}
			}
		}
	};

	// returns true while the window is still being loaded
    this.isLoading = function SDL$Client$Event$EventRegisterClass$isLoading()
	{
		return loading;
	};

	// returns true when the window is being unloaded
    this.isUnloading = function SDL$Client$Event$EventRegisterClass$isUnloading()
	{
		return unloading;
	};

	// ------- SDL.Client.Types.DisposableObject methods overrides
    this.disposeInterface = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Event$EventRegisterClass$disposeInterface()
	{
		if (registryIndex)
		{
			for (var id in registryIndex)
			{
				var registry = registryIndex[id];
				delete registryIndex[id];

				while (registry.length > 0)
				{
					var entry = registry.shift();
					var events = entry.events;
					var object = entry.object;
					if (events)
					{
						for (var e in events)
						{
							removeListener(object, e, events);
						}
					}
				}
			}
			registryIndex = null;
			self = null;
		}
	});

	// Private members

	// get object events from the registry
	function getFromRegistry(object, create)
	{
		if (registryIndex && object)
		{
			var isMarshallable = SDL.Client.Types.OO.implementsInterface(object, "SDL.Client.Models.MarshallableObject");
			if (isMarshallable)
			{
				var marshalObject = object.getMarshalObject();
				if (marshalObject)
				{
					object = marshalObject;
				}
			}

			var uniqueId = SDL.Client.Types.Object.getUniqueId(object) || "";
			var registry = registryIndex[uniqueId];
			if (registry)
			{
				for (var i = 0; i < registry.length; i++)
				{
					if (object == registry[i].object)
					{
						return registry[i];
					}
				}
			}
			else if (create)
			{
				registry = registryIndex[uniqueId] = [];
			}

			if (registry)
			{
				var entry = { object: object, events: {} };
				registry.push(entry);

				if (SDL.Client.Types.OO.implementsInterface(object, "SDL.Client.Types.DisposableObject"))
				{
					addHandler(object, "dispose", null); //this is to get notified when the object is being disposed to remove it from the register
					if (isMarshallable)
					{
						addHandler(object, "marshal", null);
					}
				}
				else if (SDL.jQuery.isWindow(object))
				{
					addHandler(object, "unload", null); //this is to get notified when the target window is being unloaded to remove it from the register
				}
				return entry;
			}
		}
	};

	function getObjectEvents(object, create)
	{
		var registryEntry = getFromRegistry(object, create);
		return registryEntry ? registryEntry.events : undefined;
	};

	this._executeListener = function SDL$Client$Event$EventRegisterClass$_executeListener(args, event, registryEntry, listener)
	{
		if (!self.getDisposing())
		{
			var object = registryEntry.object;

			if (event == "dispose" && registryIndex && args[0].target != object)
			{
				// the object might have already been marshalled, ignore the event then
				return;
			}

			if (event == "unload" && object == window)
			{
				unloading = true; // this is a way to indicate that the window is being unloaded
			}

			var handlers = listener.handlers;
			if (handlers && handlers.length)
			{
				if (!args.length)
				{
					args = [window.event];
				}

				var eventObj = args[0] = SDL.jQuery.event.fix(args[0]);

				// handlers can be added/removed while handling an event, thus have to recheck them when at least one handler has been executed
				var needPostprocess;
				var processedHandlers = [];
				var combinedResult;
				var returnFalse = false;

				do
				{
					needPostprocess = false;
					if (handlers)
					{
						for (var i = 0; handlers && (i < handlers.length); i++)
						{
							var handler = handlers[i];
							if (SDL.jQuery.inArray(handler, processedHandlers) == -1)
							{
								needPostprocess = true;
								processedHandlers.push(handler);
								
								handler = handler.fnc;
								
								var err;
								var result;

								if (!unloading)
								{
									result = handler.apply(object, args);
								}
								else
								{
									//try
									{
										result = handler.apply(object, args);
									}
									//catch (err)
									{
										//ignore errors during unloading
										//result = undefined;
									}
								}

								combinedResult = combinedResult || result;
								if (result === false)
								{
									returnFalse = true;
									eventObj.preventDefault();
									eventObj.stopPropagation();
									needPostprocess = false;
									break;
								}
								//while event handling the handlers object may get removed (when detaching the last handler) -> need to reset the local variable
								handlers = listener.handlers;
							}
						}
					}
				}
				while (needPostprocess);
			}

			switch (event)
			{
				case "marshal":
					if (registryIndex && args[0].target == registryEntry.object)	// the object might have already been marshalled, so have to check that
					{
						var uniqueId = SDL.Client.Types.Object.getUniqueId(registryEntry.object) || "";
						var registry = registryIndex[uniqueId];
						if (registry)
						{
							if (registry.length > 1)
							{
								SDL.Client.Types.Array.removeAt(registry, SDL.jQuery.inArray(registryEntry, registry));
							}
							else if (registry.length == 0 || registry[0] == registryEntry)
							{
								delete registryIndex[uniqueId];
							}
						}

						var marshalTarget = registryEntry.object = registryEntry.object.getMarshalObject();

						uniqueId = SDL.Client.Types.Object.getUniqueId(marshalTarget) || "";
						registry = registryIndex[uniqueId];
						if (!registry)
						{
							registryIndex[uniqueId] = [registryEntry];
						}
						else
						{
							registry.push(registryEntry);
						}
					}
					break;
				case "dispose":
					if (registryIndex && args[0].target == registryEntry.object)	// the object might have already been marshalled, so have to check that
					{
						this.removeAllEventHandlers(registryEntry.object);
					}
					break;
				case "load":
					if (registryEntry.object == window)
					{
						loading = false; // done loading
						removeListener(window, "load", registryEntry.events);
					}
					break;
				case "DOMContentLoaded":
					if (registryEntry.object == document)
					{
						loading = false; // done loading
						removeListener(document, "DOMContentLoaded", registryEntry.events);
					}
					break;
				case "unload":
					if (registryEntry.object == window)
					{
						self.dispose();
					}
					else if (SDL.jQuery.isWindow(registryEntry.object))
					{
						this.removeAllEventHandlers(registryEntry.object);
					}
					break;
			}
			if (returnFalse)
			{
				return false;
			}
			else
			{
				return combinedResult;
			}
		}
	};
	
	//add an event handler
	function addHandler(object, event, handler, useCapture)
	{
		var registryEntry = getFromRegistry(object, true);
		var events = registryEntry.events;
		var listener = events[event];
		if (!listener)
		{
			listener = events[event] = self._generateListener(event, registryEntry);
			addListener(object, event, listener, useCapture);
		}
		if (handler)
		{
			listener.handlers.push({fnc:handler});
		}
		else
		{
			listener.hasNullHandler = true;
		}
	};

	//remove an event handler
	function removeHandler(object, event, handler)
	{
		var events = getObjectEvents(object);
		if (events)
		{
			var listener = events[event];
			if (listener)
			{
				var handlers = listener.handlers;
				for (var i = 0; i < handlers.length; i++)
				{
					if (handlers[i].fnc == handler)
					{
						if (handlers.length == 1 && !listener.hasNullHandler)	//last handler -> remove event listener
						{
							removeListener(object, event, events);
						}
						else
						{
							SDL.Client.Types.Array.removeAt(handlers, i);
						}
						return;
					}
				}
			}
		}
	};

	// add an event listener, that will dispatch all the handlers for the event
	function addListener(object, event, listener, useCapture)
	{
		var result = false;
		if (object)
		{
			if (object.attachEvent)
			{
				result = object.attachEvent("on" + event, listener)
			}
			else if (object.addEventListener)
			{
				result = object.addEventListener(event, listener, useCapture || false);
			}
		}
		return result;
	};

	//remove an event listeners
	function removeListener(object, event, events, useCapture)
	{
		var result = false;
		if (object && events)
		{
			var listener = events[event];
			try
			{
				if (object.detachEvent)
				{
					result = object.detachEvent("on" + event, listener)
				}
				else if (object.removeEventListener)
				{
					result = object.removeEventListener(event, listener, useCapture || false);
				}
			}
			catch (ex)
			{ }
			finally
			{
				delete listener["handlers"];
				delete events[event];
			}
		}
		return result;
	};

	addHandler(document, "DOMContentLoaded", null); 	//listen to document.onDOMContentLoaded if supported to detect when the document is loaded; OR ->
	addHandler(window, "load", null); 	//listen to window.onload to detect when the window is loaded, if document.onDOMContentLoaded is not supported
	addHandler(window, "unload", null); 	//listen to window.onunload to dispose the object before destruction
};

SDL.Client.Event.EventRegisterClass.prototype._generateListener = function SDL$Client$Event$EventRegisterClass$_generateListener(event, registryEntry)
{
	var self = this;
	var listener = function()
	{
		return self._executeListener(SDL.Client.Types.Array.fromArguments(arguments), event, registryEntry, listener);
	}
	listener.handlers = [];
	return listener;
};

SDL.Client.Event.EventRegister = new SDL.Client.Event.EventRegisterClass();/*! @namespace {SDL.Client.Net} */
SDL.Client.Type.registerNamespace("SDL.Client.Net");

SDL.Client.Net.WebRequest = function SDL$Client$Net$WebRequest()
{
	this.xmlHttp;
	this.url;
	this.body;
	this.httpVerb;
	this.invokeCalled;
	this.responseText;
	this.requestContentType;
	this.responseContentType;
	this.hasError;
	this.statusCode;
	this.statusText;
	this.onComplete;
	this.onPartialLoad;
	this.webRequest = SDL.Client.Net.WebRequest;
};

SDL.Client.Net.WebRequest.prototype =
{
	invoke: function SDL$Client$Net$WebRequest$invoke()
	{
		if (!this.invokeCalled)
		{
			this.invokeCalled = true;

			if (window.XMLHttpRequest)
			{
				this.xmlHttp = new window.XMLHttpRequest();
			}
      
			if (!this.synchronous)		// IE will call onreadystatechange even for synchronous calls, but FF doesn't seem to do this
			{
				this.xmlHttp.onreadystatechange = SDL.jQuery.proxy(this.completed, this);
			}

			this.responseText = null;
			this.responseContentType = null;
			this.statusCode = 0;
			this.statusText = "";
			this.hasError = false;

			try
			{
				this.xmlHttp.open(this.httpVerb, this.url, !this.synchronous);
			}
			catch (err)
			{
				this.hasError = true;
				this.statusText = err.message;
				this.completed();
			}

			if (!this.hasError)
			{
				if (this.requestContentType)
				{
					this.xmlHttp.setRequestHeader("Content-Type", this.requestContentType);

					if (this.xmlHttp.sendAsBinary)
					{
						// .send() adds "; charset=UTF-8" to Content-Type header in FF, .sendAsBinary() doesn't
						this.xmlHttp.sendAsBinary(SDL.Client.Types.String.utf8encode(this.body));
					}
					else
					{
						this.xmlHttp.send(this.body);
					}
				}
				else
				{
					this.xmlHttp.send(this.body);
				}

				if (this.synchronous)		// IE will call onreadystatechange even for synchronous calls, but FF doesn't seem to do this -> call it explicitly
				{
					this.completed();
				}
			}
			return this;
		}
	},
	completed: function SDL$Client$Net$WebRequest$completed()
	{
		if (typeof SDL != "undefined")	// sometimes breaks (in IE9) after iframe has been unloaded
		{
			if (this.onPartialLoad && this.xmlHttp && this.xmlHttp.readyState == 3)
			{
				this.onPartialLoad(this);
			}
			else if (this.hasError || (this.xmlHttp && this.xmlHttp.readyState == 4))
			{
				var xmlHttp = this.xmlHttp;

				if (!this.synchronous)
				{
					xmlHttp.onreadystatechange = SDL.jQuery.noop;
				}

				this.xmlHttp = null;
      
				if (!this.hasError)
				{
					this.responseContentType = xmlHttp.getResponseHeader("Content-Type");
					var statusCode = this.statusCode = xmlHttp.status;
					try
					{
						this.statusText = xmlHttp.statusText;
					}
					catch (err)
					{
						// fails in FF sometimes
						this.statusText = "";
					}
					this.hasError = (statusCode < 200 || statusCode >= 300 || xmlHttp.getResponseHeader("jsonerror") == "true");
					this.responseText = xmlHttp.responseText;
				}

				if (this.onComplete)
				{
					this.onComplete(this);
				}
			}
		}
	}
};

SDL.Client.Net.callWebMethod = function SDL$Client$Net$callWebMethod(url, body, httpVerb, contentType, sync, onSuccess, onFailure, onPartialLoad)
{
	if (typeof SDL != "undefined")	// sometimes breaks (in IE9) after iframe has been unloaded
	{
		function SDL$Client$Net$callWebMethod$onComplete(request) 
		{
			if (request.hasError)
			{
				var error = "\"" + url + "\" failed to load (" + request.statusCode + "):" + request.statusText;
				if (onFailure)
				{
					onFailure(error, request);
				}
				else
				{
					SDL.Client.Diagnostics.Assert.raiseError(error);
				}
			}
			else if (onSuccess)
			{
				onSuccess(request.responseText, request);
			}
		};

		var request = new SDL.Client.Net.WebRequest();
		request.url = url;
		request.body = body || "";
		request.httpVerb = httpVerb;
		request.requestContentType = contentType;
		request.synchronous = sync;
		request.onComplete = SDL$Client$Net$callWebMethod$onComplete;
		request.onPartialLoad = onPartialLoad;
		request.invoke();

		return request;
	}
};

SDL.Client.Net.getRequest = function SDL$Client$Net$getRequest(url, onSuccess, onFailure, onPartialLoad)
{
	return this.callWebMethod(url, "", "GET", null, false, onSuccess, onFailure, onPartialLoad);
};

SDL.Client.Net.putRequest = function SDL$Client$Net$putRequest(url, body, mimeType, onSuccess, onFailure, onPartialLoad)
{
	return this.callWebMethod(url, body, "PUT", mimeType, false, onSuccess, onFailure, onPartialLoad);
};

SDL.Client.Net.postRequest = function SDL$Client$Net$postRequest(url, body, mimeType, onSuccess, onFailure, onPartialLoad)
{
	return this.callWebMethod(url, body, "POST", mimeType, false, onSuccess, onFailure, onPartialLoad);
};

SDL.Client.Net.deleteRequest = function SDL$Client$Net$deleteRequest(url, onSuccess, onFailure, onPartialLoad)
{
	return this.callWebMethod(url, "", "DELETE", null, false, onSuccess, onFailure, onPartialLoad);
};/*! @namespace {SDL.Client.Types.RegExp} */
SDL.Client.Type.registerNamespace("SDL.Client.Types.RegExp");

SDL.Client.Types.RegExp.escape = function SDL$Client$Types$RegExp$escape(string)
{
	return string ? string.replace(/([\(\)\{\}\[\]\\\^\$\?\.\:\|\+\*])/g, "\\$1") : string;
};/*! @namespace {SDL.Client.Types.Url} */
SDL.Client.Type.registerNamespace("SDL.Client.Types.Url");

SDL.Client.Types.Url.isAbsoluteUrl = function SDL$Client$Types$URL$Document$getAbsoluteUrl(url)
{
	return /^[\w]+\:[^\d]/i.test(url);
};

SDL.Client.Types.Url.getAbsoluteUrl = function SDL$Client$Types$URL$Document$getAbsoluteUrl(path)
{
	return (path && !this.isAbsoluteUrl(path))
		? this.combinePath(location.protocol + "//" + location.host + "/", path)
		: path;
};

SDL.Client.Types.Url.makeRelativeUrl = function SDL$Client$Types$URL$Document$makeRelativeUrl(base, url)
{
	if (!url || url == base)
	{
		url = "";
	}
	else if (!this.getDomain(url) || (this.getDomain(base) && this.isSameDomain(base, url)))
	{
		var urlParts = this.parseUrl(url);

		if (urlParts[this.UrlParts.PATH].charAt(0) == "/")	// given url is not relative -> process
		{
			var baseParts = this.parseUrl(base);
			url = "";

			if (baseParts[this.UrlParts.PATH] == urlParts[this.UrlParts.PATH])	// same path
			{
				if (urlParts[this.UrlParts.FILE] != baseParts[this.UrlParts.FILE] ||			// different file
					!urlParts[this.UrlParts.SEARCH] &&
						(baseParts[this.UrlParts.SEARCH] ||										// or same file, but need overwrite search param
						(!urlParts[this.UrlParts.HASH] && baseParts[this.UrlParts.HASH])))		//								or hash param
				{
					url = urlParts[this.UrlParts.FILE] || "./";
				}
			}
			else
			{
				var baseDirs = baseParts[this.UrlParts.PATH].split("/");
				var urlDirs = urlParts[this.UrlParts.PATH].split("/");
				var i = 0;
				while (i < baseDirs.length && i < urlDirs.length && baseDirs[i] == urlDirs[i])
				{
					i++;
				}
				
				for (var j = baseDirs.length - 1; j > i; j--)
				{
					url += "../";
				}

				while (i < urlDirs.length - 1)
				{
					url += (urlDirs[i] + "/");
					i++;
				}
				url += (urlParts[this.UrlParts.FILE] || (url ? "" : "./"));
			}

			if (url || (urlParts[this.UrlParts.SEARCH] != baseParts[this.UrlParts.SEARCH]) ||
				(!urlParts[this.UrlParts.HASH] && baseParts[this.UrlParts.HASH]))
			{
				url += urlParts[this.UrlParts.SEARCH];
			}

			if (url || (urlParts[this.UrlParts.HASH] != baseParts[this.UrlParts.HASH]))
			{
				url += urlParts[this.UrlParts.HASH];
			}
		}
	}
	return url;
};

SDL.Client.Types.Url.combinePath = function SDL$Client$Types$URL$Document$combinePath(base, path)
{
	if (!path || path == ".")
	{
		return base;
	}
	else if (!base || this.isAbsoluteUrl(path))
	{
		return path;
	}
	else
	{
		var hashIndx = base.indexOf("#");
		if (hashIndx != -1)
		{
			base = base.slice(0, hashIndx);	// removed the hash from the base if present
		}

		var charAt0 = path.charAt(0);
		if (charAt0 == "#")
		{
			return base + path;
		}
		else if (charAt0 == "?")
		{
			var searchIndx = base.indexOf("?");
			if (searchIndx != -1)
			{
				return base.slice(0, searchIndx) + path;
			}
			else
			{
				return base + path;
			}
		}
		else
		{
			var baseParts = SDL.Client.Types.Url.parseUrl(base);

			if (charAt0 != "/")
			{
				path = SDL.Client.Types.Url.normalize(baseParts[SDL.Client.Types.Url.UrlParts.PATH] + path);
			}
			else if (path.charAt(1) == "/")
			{
				// path starts with // (a hostname without the protocol)
				return baseParts[SDL.Client.Types.Url.UrlParts.PROTOCOL] + path;
			}
			return baseParts[SDL.Client.Types.Url.UrlParts.DOMAIN] + path;
		}
	}
};

SDL.Client.Types.Url.normalize = function SDL$Client$Types$Url$normailize(url)
{
	// get rid of /../ and /./
	if (url)
	{
		var parts = SDL.Client.Types.Url.parseUrl(url);
		var path = parts[SDL.Client.Types.Url.UrlParts.PATH];
		if (path)
		{
			var pathParts = path.match(/[^\/]+/g);
			if (pathParts)
			{
				var i = 0;
				while (i < pathParts.length)
				{
					if (pathParts[i] == "..")
					{
						if (i > 0 && pathParts[i - 1] != "..")
						{
							pathParts.splice(i - 1, 2);
							i--;
							continue;
						}
					}
					else if (pathParts[i] == ".")
					{
						pathParts.splice(i, 1);
						continue;
					}

					i++;
				}

				if (path.charAt(path.length - 1) == "/")
				{
					pathParts.push("");		// will add / at the end
				}

				if (path.charAt(0) == "/" && (pathParts.length <= 1 || pathParts[0] != ""))
				{
					pathParts.unshift("");	// will add / at the start
				}
				path = pathParts.join("/");
			}
		}
		url = parts[SDL.Client.Types.Url.UrlParts.DOMAIN] + path + parts[SDL.Client.Types.Url.UrlParts.FILE] +
			parts[SDL.Client.Types.Url.UrlParts.SEARCH] + parts[SDL.Client.Types.Url.UrlParts.HASH];
	}
	return url;
};

SDL.Client.Types.Url.getFileExtension = function SDL$Client$Types$Url$getFileExtension(file)
{
	var dotIndex = file ? file.lastIndexOf(".") : -1;
	return (dotIndex > -1 ? file.slice(dotIndex + 1) : "");
};

SDL.Client.Types.Url.getFileName = function SDL$Client$Types$Url$getFileName(file)
{
	return file && file.match(/[^\\//]*$/)[0];
};

SDL.Client.Types.Url.getUrlParameter = function SDL$Client$Types$Url$getUrlParameter(url, parameterName)
{
	var m = SDL.Client.Types.Url.parseUrl(url);
	var params = m[SDL.Client.Types.Url.UrlParts.SEARCH];
	if (params)
	{
		m = params.match(new RegExp("(\\?|&)\\s*" + SDL.Client.Types.RegExp.escape(parameterName) + "\\s*=([^&]+)(&|$)"));
		if (m)
		{
			return decodeURIComponent(m[2]);
		}
	}
};

SDL.Client.Types.Url.getHashParameter = function SDL$Client$Types$Url$getUrlParameter(url, parameterName)
{
	var m = SDL.Client.Types.Url.parseUrl(url);
	var params = m[SDL.Client.Types.Url.UrlParts.HASH];
	if (params)
	{
		m = params.match(new RegExp("(#|&)\s*" + SDL.Client.Types.RegExp.escape(parameterName) + "\s*=([^&]+)(&|$)"));
		if (m)
		{
			return decodeURIComponent(m[2]);
		}
	}
};

SDL.Client.Types.Url.setHashParameter = function SDL$Client$Types$Url$setUrlParameter(url, parameterName, value)
{
	var prevValue;
	var parts = SDL.Client.Types.Url.parseUrl(url);
	var hash = parts[SDL.Client.Types.Url.UrlParts.HASH];
	var paramMatch;
	var paramRegExp;

	if (hash)
	{
		paramRegExp = new RegExp("(#|&)(\s*" + SDL.Client.Types.RegExp.escape(parameterName) + "\s*=)([^&]*)(&|$)");
		paramMatch = hash.match(paramRegExp);
		if (paramMatch)
		{
			prevValue = decodeURIComponent(paramMatch[3]);
		}
	}

	if ((value || prevValue) && value != prevValue)
	{
		if (!value)
		{
			if (paramMatch[4] == "&")
			{
				hash = hash.replace(paramRegExp, "$1");
			}
			else
			{
				hash = hash.replace(paramRegExp, "");
			}
		}
		else
		{
			value = encodeURIComponent(value);
			if (paramMatch)
			{
				hash = hash.replace(paramRegExp, "$1$2" + value + "$4");
			}
			else
			{
				if (hash && hash.length > 1)
				{
					hash += ("&" + parameterName + "=" + value);
				}
				else
				{
					hash = "#" + parameterName + "=" + value;
				}
			}
		}
		
		url = parts[SDL.Client.Types.Url.UrlParts.DOMAIN] + parts[SDL.Client.Types.Url.UrlParts.PATH] +
			parts[SDL.Client.Types.Url.UrlParts.FILE] + parts[SDL.Client.Types.Url.UrlParts.SEARCH] + hash;
	}
	return url;
};

SDL.Client.Types.Url.isSameDomain = function SDL$Client$Types$Url$isSameDomain(url1, url2)
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
					(m1[4] == null && m2[4] == (m1[1] == "http" ? "80" : "443")) ||
					(m2[4] == null && m1[4] == (m2[1] == "http" ? "80" : "443"))
				)
			);
		}
	}
	return false;
};

SDL.Client.Types.Url.getDomain = function SDL$Client$Types$Url$getDomain(url)
{
	var parts = this.parseUrl(url);
	return parts ? parts[SDL.Client.Types.Url.UrlParts.DOMAIN] : null;
};

SDL.Client.Types.Url.parseUrl = function SDL$Client$Types$Url$parseUrl(url)
{
	if (url != null)
	{
		var m = url.toString().match(/^(([\w]+:)?\/{2,}([^\/?#:]+)(:(\d+))?)?([^?#]*\/)*([^\/?#]*)?(\?[^#]*)?(#.*)?$/);
		var parts = [];
		var typesUrlParts = SDL.Client.Types.Url.UrlParts;
		parts[typesUrlParts.PROTOCOL] = m[2] || "";
		parts[typesUrlParts.HOSTNAME] = m[3] || "";
		parts[typesUrlParts.PORT] = m[5] || "";
		parts[typesUrlParts.DOMAIN] = m[1] || "";
		parts[typesUrlParts.PATH] = m[6] || (m[1] ? "/" : "");
		parts[typesUrlParts.FILE] = m[7] || "";
		parts[typesUrlParts.SEARCH] = m[8] || "";
		parts[typesUrlParts.HASH] = m[9] || "";
		return parts;
	}
};

SDL.Client.Types.Url.UrlParts = {
	PROTOCOL: 0,
	HOSTNAME: 1,
	PORT: 2,
	DOMAIN: 3,
	PATH: 4,
	FILE: 5,
	SEARCH: 6,
	HASH: 7
};var SDL;
(function (SDL) {
    (function (Client) {
        /// <reference path="../Libraries/jQuery/SDL.jQuery.ts" />
        /// <reference path="../Net/Ajax.d.ts" />
        /// <reference path="../Xml/Xml.d.ts" />
        /// <reference path="../Types/Types.d.ts" />
        /// <reference path="../Types/Url.d.ts" />
        (function (Configuration) {
            ;

            var ConfigurationManagerClass = (function () {
                function ConfigurationManagerClass() {
                    this.loadingCounter = 0;
                    this.confFiles = [];
                    this.initialized = false;
                }
                ConfigurationManagerClass.prototype.init = function (settingsUrl, callback) {
                    var _this = this;
                    if (SDL.Client.Type.isString(settingsUrl)) {
                        Configuration.settingsFile = settingsUrl;
                    } else {
                        if (!callback) {
                            callback = settingsUrl;
                        }

                        if (!Configuration.settingsFile) {
                            Configuration.settingsFile = "/configuration.xml";
                        }
                    }

                    if (Configuration.settingsFile.charAt(0) != "/") {
                        Configuration.settingsFile = Client.Types.Url.combinePath(window.location.pathname, Configuration.settingsFile);
                    }

                    if (!this.initialized) {
                        if (callback) {
                            if (this.initCallbacks) {
                                this.initCallbacks.push(callback);
                            } else {
                                this.initCallbacks = [callback];
                            }
                        }

                        this.confFiles.push(Configuration.settingsFile);

                        if (Configuration.settingsVersion) {
                            Configuration.settingsFile = Client.Types.Url.combinePath(Configuration.settingsFile, "?" + Configuration.settingsVersion);
                        }

                        this.loadingCounter = 1;

                        Client.Net.getRequest(Configuration.settingsFile, function (result) {
                            return _this.processConfigurationFile(result, Configuration.settingsFile);
                        }, null);
                    } else if (callback) {
                        callback();
                    }
                };

                ConfigurationManagerClass.prototype.processConfigurationFile = function (xmlString, baseUrl, parentElement) {
                    var _this = this;
                    var document = Client.Xml.getNewXmlDocument(xmlString);
                    if (Client.Xml.hasParseError(document)) {
                        throw Error("Invalid xml loaded: " + baseUrl + "\n" + Client.Xml.getParseError(document));
                    }

                    var data = document.documentElement;

                    if (!this.configuration) {
                        this.configuration = data;
                    }

                    if (!this.corePath) {
                        var corePath = Client.Xml.getInnerText(data, "//configuration/appSettings/setting[@name='corePath']/@value");
                        if (corePath != null) {
                            if (!corePath) {
                                corePath = "/";
                            } else if (corePath.slice(-1) != "/") {
                                corePath += "/";
                            }
                            this.corePath = Client.Types.Url.combinePath(baseUrl, corePath);
                        }
                    }

                    if (this.coreVersion == null) {
                        this.coreVersion = Client.Xml.getInnerText(data, "//configuration/appSettings/setting[@name='coreVersion']/@value");
                    }

                    var includeNodes = Client.Xml.selectNodes(data, "//configuration/include[not(configuration)]");

                    if (parentElement) {
                        parentElement.appendChild(data);
                    }

                    this.loadingCounter += includeNodes.length;

                    SDL.jQuery.each(includeNodes, function (i, node) {
                        var url = node.getAttribute("src");
                        var resolvedUrl;
                        var version;

                        if (url.indexOf("~/") != 0) {
                            url = Client.Types.Url.combinePath(baseUrl, url);
                        }

                        if (url.indexOf("~/") == 0) {
                            resolvedUrl = Client.Types.Url.combinePath(_this.corePath, url.slice(2));
                            version = _this.coreVersion;
                        } else {
                            resolvedUrl = url;
                        }

                        if (_this.confFiles.indexOf(resolvedUrl) != -1) {
                            // file is already included, skip it here
                            _this.loadingCounter--;
                            return;
                        }

                        _this.confFiles.push(resolvedUrl);

                        if (!version) {
                            var appVersionNodes = Client.Xml.selectNodes(node, "ancestor::configuration/appSettings/setting[@name='version']/@value");
                            version = appVersionNodes.length ? appVersionNodes[appVersionNodes.length - 1].nodeValue : "";
                        }

                        var modification = node.getAttribute("modification");
                        version = (version && modification) ? (version + "." + modification) : (version || modification);

                        if (version) {
                            resolvedUrl = Client.Types.Url.combinePath(resolvedUrl, "?" + version);
                        }

                        Client.Net.getRequest(resolvedUrl, function (result) {
                            return _this.processConfigurationFile(result, url, node);
                        }, null);
                    });

                    if (baseUrl) {
                        data.setAttribute("baseUrl", baseUrl);
                    }

                    this.loadingCounter--;

                    if (this.loadingCounter == 0) {
                        this.initialized = true;
                        this.callbacks();
                    }
                };

                ConfigurationManagerClass.prototype.toString = function () {
                    return Client.Xml.getOuterXml(this.configuration, null);
                };

                ConfigurationManagerClass.prototype.getAppSetting = function (name) {
                    return Client.Xml.getInnerText(this.configuration, "//configuration/appSettings/setting[@name='" + name + "']/@value");
                };

                ConfigurationManagerClass.prototype.callbacks = function () {
                    if (this.initCallbacks) {
                        SDL.jQuery.each(this.initCallbacks, function (i, callback) {
                            callback();
                        });
                        this.initCallbacks = null;
                    }
                };
                return ConfigurationManagerClass;
            })();
            ;

            Configuration.ConfigurationManager = new ConfigurationManagerClass();
        })(Client.Configuration || (Client.Configuration = {}));
        var Configuration = Client.Configuration;
    })(SDL.Client || (SDL.Client = {}));
    var Client = SDL.Client;
})(SDL || (SDL = {}));
//@ sourceMappingURL=ConfigurationManager.js.map
var SDL;
(function (SDL) {
    (function (Client) {
        /// <reference path="../Libraries/jQuery/SDL.jQuery.ts" />
        /// <reference path="../Types/Types.d.ts" />
        /// <reference path="../Types/Url.d.ts" />
        /// <reference path="../Types/Object.d.ts" />
        (function (CrossDomainMessaging) {
            if (SDL.jQuery.inArray("origin", (SDL.jQuery).event.props) == -1) {
                (SDL.jQuery).event.props.push("origin");
            }
            if (SDL.jQuery.inArray("source", (SDL.jQuery).event.props) == -1) {
                (SDL.jQuery).event.props.push("source");
            }

            var reqId = new Date().getTime();
            var callbacks = {};
            var trustedDomains = [Client.Types.Url.getDomain(window.location.href)];
            var allowedHandlerBases;
            var parentXdm = undefined;

            function addTrustedDomain(url) {
                if (trustedDomains[0] != "*") {
                    if (url == "*") {
                        trustedDomains = ["*"];
                    } else {
                        for (var i = 0, len = trustedDomains.length; i < len; i++) {
                            if (Client.Types.Url.isSameDomain(trustedDomains[i], url)) {
                                return;
                            }
                        }
                        trustedDomains.push(url);
                    }
                }
            }
            CrossDomainMessaging.addTrustedDomain = addTrustedDomain;

            function clearTrustedDomains() {
                trustedDomains = [];
            }
            CrossDomainMessaging.clearTrustedDomains = clearTrustedDomains;

            function addAllowedHandlerBase(handler) {
                if (!allowedHandlerBases) {
                    allowedHandlerBases = [handler];
                } else {
                    allowedHandlerBases.push(handler);
                }
            }
            CrossDomainMessaging.addAllowedHandlerBase = addAllowedHandlerBase;

            function call(target, method, args, callback) {
                if (args) {
                    for (var i = 0, len = args.length; i < len; i++) {
                        if (Client.Type.isFunction(args[i])) {
                            var callbackId = (++reqId);
                            callbacks[callbackId.toString()] = args[i];
                            args[i] = {
                                __callbackId: callbackId
                            };
                        }
                    }
                }

                var obj = {
                    method: method,
                    args: args
                };

                if (callback) {
                    obj.reqId = (++reqId);
                    callbacks[obj.reqId.toString()] = callback;
                }

                _postMessage(target, obj);
            }
            CrossDomainMessaging.call = call;

            function executeMessage(message, source, origin) {
                if (message) {
                    var execute;
                    if (message.method) {
                        var parts = message.method.split(".");
                        var lastIdx = parts.length - 1;
                        var base = window;
                        for (var i = 0; (i < lastIdx) && base; i++) {
                            base = base[parts[i]];
                        }

                        if (!base) {
                            throw Error("XDM: Unable to evaluate " + message.method);
                        } else if (!base[parts[lastIdx]]) {
                            throw Error("XDM: Unable to evaluate " + message.method + ". Method '" + parts[lastIdx] + "' is not defined.");
                        } else if (!allowedHandlerBases || allowedHandlerBases.indexOf(base) == -1) {
                            throw Error("XDM: Access denied to " + message.method);
                        } else {
                            var result;
                            var args = message.args;

                            if (Client.Type.isArray(args)) {
                                for (var i = 0, len = args.length; i < len; i++) {
                                    if (Client.Type.isObject(args[i]) && args[i].__callbackId) {
                                        args[i] = _createCallback(source, origin, args[i].__callbackId);
                                    }
                                }

                                execute = function () {
                                    return base[parts[lastIdx]].apply(base, message.args);
                                };
                            } else {
                                execute = function () {
                                    return base[parts[lastIdx]]();
                                };
                            }

                            execute.sourceWindow = source;
                            execute.sourceDomain = Client.Types.Url.getDomain(origin);

                            result = execute();

                            if (message.reqId) {
                                _postMessage(source, {
                                    respId: message.reqId,
                                    args: [result]
                                }, origin);
                            }
                        }
                    } else if (message.respId) {
                        var callback = callbacks[message.respId.toString()];
                        if (callback) {
                            if (message.retire != false) {
                                delete callbacks[message.respId.toString()];
                            }
                            if (message.execute != false) {
                                execute = function () {
                                    callback.apply(window, message.args || []);
                                };
                                execute.sourceWindow = source;
                                execute.sourceDomain = Client.Types.Url.getDomain(origin);
                                execute();
                            }
                        }
                    }
                }
            }
            CrossDomainMessaging.executeMessage = executeMessage;

            function _postMessage(target, message, origin) {
                if (!origin) {
                    origin = trustedDomains.length == 1 ? trustedDomains[0] : "*";
                }

                var remoteXdm;

                if (origin == "*") {
                    if (target == window.parent) {
                        if (parentXdm === undefined) {
                            try  {
                                parentXdm = (target).SDL.Client.CrossDomainMessaging;
                            } catch (err) {
                                parentXdm = null;
                            }
                        }

                        remoteXdm = parentXdm;
                    }
                } else if (Client.Types.Url.isSameDomain(origin, window.location.href)) {
                    try  {
                        remoteXdm = (target).SDL.Client.CrossDomainMessaging;
                    } catch (err) {
                    }
                }

                if (remoteXdm) {
                    remoteXdm.executeMessage(message, window, window.location.href);
                } else {
                    target.postMessage("sdl:" + Client.Types.Object.serialize(message), origin);
                }
            }

            function _createCallback(target, domain, callbackId) {
                var fnc = function () {
                    _postMessage(target, {
                        respId: callbackId,
                        retire: !fnc.reoccuring,
                        args: [].slice.call(arguments)
                    }, domain);
                };

                fnc.retire = function () {
                    _postMessage(target, {
                        respId: callbackId,
                        execute: false,
                        retire: true
                    }, domain);
                };

                return fnc;
            }

            function _messageHandler(e) {
                if (e && e.data && e.data.length > 4 && e.data.indexOf("sdl:") == 0) {
                    var allowed = trustedDomains[0] == "*";
                    if (!allowed) {
                        for (var i = 0, len = trustedDomains.length; i < len; i++) {
                            if (Client.Types.Url.isSameDomain(trustedDomains[i], e.origin)) {
                                allowed = true;
                                break;
                            }
                        }
                    }

                    if (allowed) {
                        executeMessage(Client.Types.Object.deserialize(e.data.slice(4)), e.source, e.origin);
                    }
                }
            }

            window.addEventListener("message", _messageHandler);
        })(Client.CrossDomainMessaging || (Client.CrossDomainMessaging = {}));
        var CrossDomainMessaging = Client.CrossDomainMessaging;
    })(SDL.Client || (SDL.Client = {}));
    var Client = SDL.Client;
})(SDL || (SDL = {}));
//@ sourceMappingURL=CrossDomainMessaging.js.map
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SDL;
(function (SDL) {
    (function (Client) {
        /// <reference path="..\Types\Types.d.ts" />
        /// <reference path="..\Types\ObjectWithEvents.ts" />
        /// <reference path="..\Resources\ResourceManager.ts" />
        /// <reference path="..\Resources\FileResourceHandler.ts" />
        /// <reference path="..\CrossDomainMessaging\CrossDomainMessaging.ts" />
        (function (Application) {
            ;

            ;

            eval(Client.Types.OO.enableCustomInheritance);
            var ApplicationHostProxyClass = (function (_super) {
                __extends(ApplicationHostProxyClass, _super);
                function ApplicationHostProxyClass() {
                    _super.apply(this, arguments);
                }
                ApplicationHostProxyClass.prototype.setCulture = function (culture) {
                    this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.setCulture", [culture]);
                };

                ApplicationHostProxyClass.prototype.applicationEntryPointLoaded = function (coreVersion, callback) {
                    var _this = this;
                    var _callback;
                    _callback = function (data) {
                        _this.libraryVersionSupported = data.libraryVersionSupported;
                        _this.activeApplicationEntryPointId = data.activeApplicationEntryPointId;
                        _this.activeApplicationId = data.activeApplicationId;
                        _this.culture = data.culture;
                        if (callback) {
                            _callback.sourceDomain = (arguments.callee.caller).sourceDomain;
                            _callback.sourceWindow = (arguments.callee.caller).sourceWindow;
                            callback(data);
                        }
                    };
                    this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.applicationEntryPointLoaded", [coreVersion, this.getDelegate(this.onHostEvent)], _callback);
                };

                ApplicationHostProxyClass.prototype.exposeApplicationFacade = function (applicationEntryPointId) {
                    if (!Application.ApplicationHost.isTrusted) {
                        throw Error("Unable to expose application facade: application host is untrusted.");
                    }

                    if (Application.isApplicationFacadeSecure === undefined) {
                        Application.isApplicationFacadeSecure = true;
                        this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.exposeApplicationFacade", [applicationEntryPointId]);
                    } else if (!Application.isApplicationFacadeSecure) {
                        throw Error("Application facade is already exposed as unsecure.");
                    }
                };

                ApplicationHostProxyClass.prototype.exposeApplicationFacadeUnsecure = function (applicationEntryPointId) {
                    if (Application.isApplicationFacadeSecure === undefined) {
                        Application.isApplicationFacadeSecure = false;
                        this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.exposeApplicationFacade", [applicationEntryPointId]);
                    } else if (Application.isApplicationFacadeSecure) {
                        throw Error("Application facade is already exposed as secure.");
                    }
                };

                ApplicationHostProxyClass.prototype.applicationEntryPointUnloaded = function () {
                    this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.applicationEntryPointUnloaded");
                };

                ApplicationHostProxyClass.prototype.resolveCommonLibraryResources = function (resourceGroupName, onSuccess) {
                    this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.resolveCommonLibraryResources", [resourceGroupName], onSuccess);
                };

                ApplicationHostProxyClass.prototype.getCommonLibraryResources = function (files, version, onFileLoad, onFailure) {
                    this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.getCommonLibraryResources", [files, version, onFileLoad, onFailure]);
                };

                ApplicationHostProxyClass.prototype.getCommonLibraryResource = function (file, version, onSuccess, onFailure) {
                    this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.getCommonLibraryResource", [file, version, onSuccess, onFailure]);
                };

                ApplicationHostProxyClass.prototype.setActiveApplicationEntryPoint = function (applicationEntryPointId, applicationId) {
                    this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.setActiveApplicationEntryPoint", [applicationEntryPointId, applicationId]);
                };

                ApplicationHostProxyClass.prototype.setApplicationEntryPointUrl = function (applicationEntryPointId, url, applicationId) {
                    if (!Application.ApplicationHost.isTrusted) {
                        throw Error("Unable to set application entry point Url: application host is untrusted.");
                    }

                    if (applicationId && applicationId != Application.applicationSuiteId && (Application.trustedApplications ? (applicationId != Application.applicationSuiteId && Application.trustedApplications.indexOf(applicationId) == -1) : !Application.trustedApplicationDomains)) {
                        throw Error("Unable to set application entry point Url: application \"" + applicationId + "\" is untrusted.");
                    }

                    this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.setApplicationEntryPointUrl", [
                        applicationEntryPointId,
                        url,
                        applicationId,
                        Application.trustedApplicationDomains ? this.getWithLocalDomain(Application.trustedApplicationDomains) : null
                    ]);
                };

                ApplicationHostProxyClass.prototype.setApplicationEntryPointUrlUnsecure = function (applicationEntryPointId, url, applicationId) {
                    this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.setApplicationEntryPointUrl", [applicationEntryPointId, url, applicationId]);
                };

                ApplicationHostProxyClass.prototype.callApplicationFacade = function (applicationEntryPointId, method, args, callback, applicationId) {
                    if (!Application.ApplicationHost.isTrusted) {
                        throw Error("Unable to call application facade: application host is untrusted.");
                    }

                    if (applicationId && applicationId != Application.applicationSuiteId && (Application.trustedApplications ? (applicationId != Application.applicationSuiteId && Application.trustedApplications.indexOf(applicationId) == -1) : !Application.trustedApplicationDomains)) {
                        throw Error("Unable to call application facade: application \"" + applicationId + "\" is untrusted.");
                    }

                    this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.callApplicationFacade", [
                        applicationEntryPointId,
                        method,
                        args,
                        callback,
                        applicationId,
                        Application.trustedApplicationDomains ? this.getWithLocalDomain(Application.trustedApplicationDomains) : null
                    ]);
                };

                ApplicationHostProxyClass.prototype.callApplicationFacadeUnsecure = function (applicationEntryPointId, method, args, callback, applicationId) {
                    this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.callApplicationFacade", [applicationEntryPointId, method, args, callback, applicationId]);
                };

                ApplicationHostProxyClass.prototype.initializeApplicationSuite = function (includeApplicationEntryPointIds, excludeApplicationEntryPointIds, domainDefinitions) {
                    this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.initializeApplicationSuite", [includeApplicationEntryPointIds, excludeApplicationEntryPointIds, domainDefinitions]);
                };

                ApplicationHostProxyClass.prototype.resetApplicationSuite = function () {
                    this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.resetApplicationSuite");
                };

                ApplicationHostProxyClass.prototype.call = function (method, args, callback) {
                    Client.CrossDomainMessaging.call(window.parent, method, args, callback);
                };

                ApplicationHostProxyClass.prototype.onHostEvent = function (e) {
                    switch (e.type) {
                        case "culturechange":
                            this.culture = e.data.culture;
                            break;
                        case "applicationentrypointactivate":
                            this.activeApplicationEntryPointId = e.data.applicationEntryPointId;
                            this.activeApplicationId = e.data.applicationId;
                            break;
                    }
                    this.fireEvent(e.type, e.data);
                };

                ApplicationHostProxyClass.prototype.getWithLocalDomain = function (domains) {
                    var localDomain = Client.Types.Url.getDomain(window.location.href);
                    if (!domains) {
                        domains = [localDomain];
                    } else if (!Client.Types.Array.contains(domains, localDomain, Client.Types.Url.isSameDomain)) {
                        domains = domains.concat(localDomain);
                    }
                    return domains;
                };
                return ApplicationHostProxyClass;
            })(Client.Types.ObjectWithEvents);
            Application.ApplicationHostProxyClass = ApplicationHostProxyClass;
            SDL.Client.Types.OO.createInterface("SDL.Client.Application.ApplicationHostProxyClass", ApplicationHostProxyClass);
        })(Client.Application || (Client.Application = {}));
        var Application = Client.Application;
    })(SDL.Client || (SDL.Client = {}));
    var Client = SDL.Client;
})(SDL || (SDL = {}));
//@ sourceMappingURL=ApplicationHost.js.map
var SDL;
(function (SDL) {
    (function (Client) {
        /// <reference path="..\Libraries\jQuery\SDL.jQuery.ts" />
        /// <reference path="..\Xml\Xml.d.ts" />
        /// <reference path="..\ConfigurationManager\ConfigurationManager.ts" />
        /// <reference path="..\CrossDomainMessaging\CrossDomainMessaging.ts" />
        /// <reference path="..\Event\EventRegister.d.ts" />
        /// <reference path="ApplicationHost.ts" />
        /// <reference path="ApplicationFacade.ts" />
        (function (Application) {
            Application.defaultApplicationEntryPointId;
            Application.defaultApplicationSuiteId;
            Application.isHosted;
            Application.applicationSuiteId;
            Application.isReloading;
            Application.defaultApplicationHostUrl;
            Application.trustedApplicationHostDomains;
            Application.trustedApplications;
            Application.trustedApplicationDomains;
            Application.ApplicationHost;
            Application.useHostedLibraryResources;

            var initialized = false;
            var initCallbacks;

            function initialize(callback) {
                if (!initialized) {
                    if (!Application.isReloading) {
                        if (callback) {
                            if (initCallbacks) {
                                initCallbacks.push(callback);
                            } else {
                                initCallbacks = [callback];
                            }
                        }

                        if (initialized === false) {
                            initialized = undefined;
                            initializeApplication();
                        }
                    }
                } else if (callback) {
                    callback();
                }
            }
            Application.initialize = initialize;
            ;

            function exposeApplicationFacade() {
                if (!Application.isHosted) {
                    throw Error("Cannot expose Application facade: application is not hosted.");
                }
                Application.ApplicationHost.exposeApplicationFacade(Client.Application.defaultApplicationEntryPointId);
            }
            Application.exposeApplicationFacade = exposeApplicationFacade;
            ;

            function exposeApplicationFacadeUnsecure() {
                if (!Application.isHosted) {
                    throw Error("Cannot expose Application facade: application is not hosted.");
                }
                Application.ApplicationHost.exposeApplicationFacadeUnsecure(Client.Application.defaultApplicationEntryPointId);
            }
            Application.exposeApplicationFacadeUnsecure = exposeApplicationFacadeUnsecure;
            ;

            function initializeApplication() {
                var callbacks = function () {
                    if (initCallbacks) {
                        SDL.jQuery.each(initCallbacks, function (i, callback) {
                            callback();
                        });
                        initCallbacks = null;
                    }
                };

                var hostingElement = Client.Xml.selectSingleNode(Client.Configuration.ConfigurationManager.configuration, "//configuration/hosting");

                if (!hostingElement) {
                    Client.Application.isHosted = false;
                    Client.Application.useHostedLibraryResources = false;
                    initialized = true;
                    callbacks();
                } else {
                    Client.Application.defaultApplicationEntryPointId = Client.Xml.getInnerText(hostingElement, "defaultApplicationEntryPointId");
                    Client.Application.defaultApplicationSuiteId = Client.Xml.getInnerText(hostingElement, "defaultApplicationSuiteId");

                    var hosted = (window.top != window);

                    if (hosted) {
                        var useHostedLibraryResources = !Client.Xml.selectSingleNode(hostingElement, "useHostedLibraryResources[.='false' or .='0']");

                        Application.trustedApplicationHostDomains = SDL.jQuery.map(Client.Xml.selectNodes(hostingElement, "restrictions/trustedApplicationHostDomains/domain"), function (node) {
                            return Client.Types.Url.getAbsoluteUrl(Client.Xml.getInnerText(node));
                        });

                        Application.trustedApplications = SDL.jQuery.map(Client.Xml.selectNodes(hostingElement, "restrictions/trustedApplications/applicationId"), function (node) {
                            return Client.Xml.getInnerText(node);
                        });

                        Application.trustedApplicationDomains = SDL.jQuery.map(Client.Xml.selectNodes(hostingElement, "restrictions/trustedApplicationDomains/domain"), function (node) {
                            return Client.Types.Url.getAbsoluteUrl(Client.Xml.getInnerText(node));
                        });

                        Client.CrossDomainMessaging.addTrustedDomain("*");

                        // notify the host the app is loaded, and see if the library version can be served by the host
                        var interval;
                        if (window.console) {
                            var intervalCount = 0;
                            interval = window.setInterval(function () {
                                intervalCount++;
                                console.log("NO REPLY FROM HOST AFTER " + intervalCount + " SECOND(S).");
                                if (intervalCount > 60) {
                                    window.clearInterval(interval);
                                    interval = null;
                                }
                            }, 1000);
                        }

                        var host = new Application.ApplicationHostProxyClass();
                        host.applicationEntryPointLoaded(Client.Configuration.ConfigurationManager.coreVersion, function (data) {
                            if (interval) {
                                window.clearInterval(interval);
                                interval = null;
                            }

                            Client.Application.applicationSuiteId = data.applicationSuiteId;

                            var applicationHostDomain = (arguments.callee.caller).sourceDomain;
                            host.isTrusted = Client.Types.Url.isSameDomain(window.location.href, applicationHostDomain) || (SDL.jQuery.inArray(applicationHostDomain, Application.trustedApplicationHostDomains, 0, Client.Types.Url.isSameDomain) != -1);

                            Client.CrossDomainMessaging.clearTrustedDomains();
                            Client.CrossDomainMessaging.addTrustedDomain(applicationHostDomain);
                            Client.CrossDomainMessaging.addAllowedHandlerBase(Application.ApplicationFacadeStub);

                            Client.Application.ApplicationHost = host;
                            Client.Application.isHosted = true;

                            if (data) {
                                if (data.libraryVersionSupported) {
                                    Client.Application.useHostedLibraryResources = useHostedLibraryResources;
                                }

                                if (data.culture) {
                                    Client.Localization.setCulture(data.culture);
                                }
                            }

                            Client.Event.EventRegister.addEventHandler(Application.ApplicationHost, "culturechange", function (e) {
                                Client.Localization.setCulture(e.data.culture);
                            });

                            initialized = true;
                            callbacks();
                        });

                        Client.Event.EventRegister.addEventHandler(window, "unload", function (e) {
                            host.applicationEntryPointUnloaded();
                        });
                    } else {
                        Application.defaultApplicationHostUrl = Client.Xml.getInnerText(hostingElement, "defaultApplicationHostUrl");
                        ;

                        if (Application.defaultApplicationHostUrl) {
                            initCallbacks = null;
                            Client.Application.isReloading = true;
                            window.location.replace(Application.defaultApplicationHostUrl + (Application.defaultApplicationSuiteId ? ("#app=" + encodeURIComponent(Application.defaultApplicationSuiteId) + (Application.defaultApplicationEntryPointId ? "&entry=" + encodeURIComponent(Client.Application.defaultApplicationEntryPointId) + "&url=" + encodeURIComponent(location.href) : "")) : ""));
                        } else {
                            Client.Application.isHosted = false;
                            Client.Application.useHostedLibraryResources = false;
                            initialized = true;
                            callbacks();
                        }
                    }
                }
            }
            ;
        })(Client.Application || (Client.Application = {}));
        var Application = Client.Application;
    })(SDL.Client || (SDL.Client = {}));
    var Client = SDL.Client;
})(SDL || (SDL = {}));
//@ sourceMappingURL=Application.js.map
var SDL;
(function (SDL) {
    (function (Client) {
        /// <reference path="Application.ts" />
        (function (Application) {
            Application.ApplicationFacade = {};
            Application.isApplicationFacadeSecure = undefined;

            (function (ApplicationFacadeStub) {
                function callApplicationFacade(method, arguments, caller) {
                    if (!Client.Application.isHosted) {
                        throw Error("Attempt to call Application facade failed: application is not hosted.");
                    } else if (!Application.ApplicationFacade[method]) {
                        throw Error("Attempt to call Application facade failed: method '" + method + "' is not defined.");
                    } else if (Application.isApplicationFacadeSecure == undefined) {
                        throw Error("Attempt to call Application facade failed: unable to determine security level of the Application facade.");
                    } else {
                        if (Application.isApplicationFacadeSecure) {
                            if (!Client.Application.ApplicationHost.isTrusted) {
                                throw Error("Attempt to call secured Application facade failed: appliction host is untrusted.");
                            } else if (!caller.applicationId || !caller.applicationDomain) {
                                throw Error("Attempt to call secured Application facade failed: unable to determine the caller.");
                            } else if (caller.applicationId != Client.Application.applicationSuiteId || !Client.Types.Url.isSameDomain(window.location.href, caller.applicationDomain)) {
                                if (!Client.Application.trustedApplications && !Client.Application.trustedApplicationDomains) {
                                    throw Error("Attempt to call secured Application facade failed: caller untrusted (" + caller.applicationId + ", " + caller.applicationDomain + ")");
                                } else {
                                    var allowed;
                                    var i, len;
                                    if (Client.Application.trustedApplications && caller.applicationId != Client.Application.applicationSuiteId && Application.trustedApplications.indexOf(caller.applicationId) == -1) {
                                        throw Error("Attempt to call secured Application facade failed: caller untrusted (" + caller.applicationId + ")");
                                    }

                                    if (Client.Application.trustedApplicationDomains && !Client.Types.Url.isSameDomain(window.location.href, caller.applicationDomain) && !Client.Types.Url.isSameDomain(window.location.href, caller.applicationDomain)) {
                                        allowed = false;
                                        for (i = 0, len = Application.trustedApplicationDomains.length; i < len; i++) {
                                            if (Client.Types.Url.isSameDomain(Application.trustedApplicationDomains[i], caller.applicationDomain)) {
                                                allowed = true;
                                                break;
                                            }
                                        }

                                        if (!allowed) {
                                            throw Error("Attempt to call secured Application facade failed: caller untrusted (" + caller.applicationDomain + ")");
                                        }
                                    }
                                }
                            }
                        }

                        var execute = function (args) {
                            return Application.ApplicationFacade[method].apply(Application.ApplicationFacade, args);
                        };
                        execute.applicationDomain = caller.applicationDomain;
                        execute.applicationId = caller.applicationId;
                        return execute(arguments || []);
                    }
                }
                ApplicationFacadeStub.callApplicationFacade = callApplicationFacade;
            })(Application.ApplicationFacadeStub || (Application.ApplicationFacadeStub = {}));
            var ApplicationFacadeStub = Application.ApplicationFacadeStub;
        })(Client.Application || (Client.Application = {}));
        var Application = Client.Application;
    })(SDL.Client || (SDL.Client = {}));
    var Client = SDL.Client;
})(SDL || (SDL = {}));
//@ sourceMappingURL=ApplicationFacade.js.map
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SDL;
(function (SDL) {
    /// <reference path="../Types/Types.d.ts" />
    /// <reference path="../Types/ObjectWithEvents.ts" />
    (function (Client) {
        eval(Client.Types.OO.enableCustomInheritance);
        var LocalizationClass = (function (_super) {
            __extends(LocalizationClass, _super);
            function LocalizationClass() {
                _super.apply(this, arguments);
            }
            LocalizationClass.prototype.setCulture = function (value) {
                if (this._culture != value) {
                    this._culture = value;
                    this.fireEvent("culturechange", { culture: value });
                }
            };

            LocalizationClass.prototype.getCulture = function () {
                return this._culture;
            };
            return LocalizationClass;
        })(Client.Types.ObjectWithEvents);
        Client.LocalizationClass = LocalizationClass;
        SDL.Client.Types.OO.createInterface("SDL.Client.LocalizationClass", LocalizationClass);
    })(SDL.Client || (SDL.Client = {}));
    var Client = SDL.Client;
})(SDL || (SDL = {}));

var SDL;
(function (SDL) {
    (function (Client) {
        // has to be in a separate module definition, otherwise creating an instance of the interface fails
        Client.Localization = new Client.LocalizationClass();
    })(SDL.Client || (SDL.Client = {}));
    var Client = SDL.Client;
})(SDL || (SDL = {}));
//@ sourceMappingURL=Localization.js.map
var SDL;
(function (SDL) {
    (function (Client) {
        /// <reference path="..\Application\Application.ts" />
        /// <reference path="..\Net/Ajax.d.ts" />
        /// <reference path="..\CrossDomainMessaging\CrossDomainMessaging.ts" />
        (function (Resources) {
            var CommonResourcesLoader = (function () {
                function CommonResourcesLoader() {
                }
                CommonResourcesLoader.load = function (file, corePath, sync, onSuccess, onFailure) {
                    var isCommonResource = (file.url.indexOf("~/") == 0);

                    if (isCommonResource && !sync && Client.Application.isHosted && Client.Application.useHostedLibraryResources && Client.Application.ApplicationHost.isTrusted) {
                        Client.Application.ApplicationHost.getCommonLibraryResource(file, Client.Configuration.ConfigurationManager.coreVersion, onSuccess, onFailure);
                    } else {
                        var url = file.url;
                        if (isCommonResource) {
                            url = Client.Types.Url.combinePath(corePath, url.slice(2));
                        }

                        if (file.version) {
                            url = Client.Types.Url.combinePath(url, "?" + file.version);
                        }

                        return Client.Net.callWebMethod(url, "", "GET", null, sync, onSuccess, onFailure);
                    }
                };
                return CommonResourcesLoader;
            })();
            Resources.CommonResourcesLoader = CommonResourcesLoader;
        })(Client.Resources || (Client.Resources = {}));
        var Resources = Client.Resources;
    })(SDL.Client || (SDL.Client = {}));
    var Client = SDL.Client;
})(SDL || (SDL = {}));
//@ sourceMappingURL=CommonResourcesLoader.js.map
var SDL;
(function (SDL) {
    (function (Client) {
        /// <reference path="../Libraries/jQuery/SDL.jQuery.ts" />
        /// <reference path="../Localization/Localization.ts" />
        /// <reference path="../Application/Application.ts" />
        /// <reference path="../Net/Ajax.d.ts" />
        /// <reference path="../Types/Array.d.ts" />
        /// <reference path="CommonResourcesLoader.ts" />
        (function (Resources) {
            ;

            var FileResourceHandler = (function () {
                function FileResourceHandler() {
                }
                FileResourceHandler.prototype._supports = function (url) {
                    return false;
                };
                FileResourceHandler.prototype._render = function (url, file) {
                };
                FileResourceHandler.prototype.supports = function (url) {
                    var m = url.match(/\.([^\.\/\?\#]+)(\?|\#|$)/);
                    var ext = m ? m[1].toLowerCase() : "";
                    return this._supports(ext);
                };

                FileResourceHandler.prototype.render = function (url) {
                    var file = FileResourceHandler.fileResources[url.toLowerCase()];

                    if (!file || (!file.rendering && !file.rendered)) {
                        if (!file || !file.loaded) {
                            throw Error("Cannot render file '" + url + "': file not loaded.");
                        } else {
                            file.rendering = true;
                            if (file.data) {
                                this._render(url, file);
                            }
                            file.rendered = true;
                            delete file.rendering;
                        }
                    }
                };

                FileResourceHandler.loadIfNotRendered = function (file, callback, errorcallback, sync) {
                    if (file && file.url) {
                        var key = file.url.toLowerCase();
                        var fileResource = FileResourceHandler.fileResources[key];
                        if (fileResource && fileResource.rendered) {
                            if (callback) {
                                callback(fileResource);
                            }
                            return;
                        }
                    }
                    FileResourceHandler.load(file, callback, errorcallback, sync);
                };

                FileResourceHandler.load = function (file, callback, errorcallback, sync) {
                    if (file && file.url) {
                        var key = file.url.toLowerCase();
                        var fileResource = FileResourceHandler.fileResources[key];

                        if (!fileResource) {
                            fileResource = FileResourceHandler.fileResources[key] = { url: file.url, version: file.version, context: file.context };
                        }

                        if (fileResource.error) {
                            if (errorcallback)
                                errorcallback(fileResource);
                        } else if (fileResource.loaded) {
                            if (callback)
                                callback(fileResource);
                        } else if (fileResource.loading) {
                            if (callback) {
                                // Handle same file being requested multiple times - add another callback to the list
                                FileResourceHandler.callbacks[key].add(function () {
                                    callback(fileResource);
                                });
                            }
                            if (errorcallback) {
                                // Handle same file being requested multiple times - add another callback to the list
                                FileResourceHandler.errorcallbacks[key].add(function (error) {
                                    errorcallback(fileResource);
                                });
                            } else {
                                FileResourceHandler.errorcallbacks[key].add(function (error) {
                                    throw Error(error);
                                });
                            }
                        } else {
                            fileResource.loading = true;

                            if (!FileResourceHandler.callbacks[key]) {
                                FileResourceHandler.callbacks[key] = SDL.jQuery.Callbacks("once");
                            }

                            if (!FileResourceHandler.errorcallbacks[key]) {
                                FileResourceHandler.errorcallbacks[key] = SDL.jQuery.Callbacks("once");
                            }

                            if (file.url.indexOf("{CULTURE}") != -1) {
                                FileResourceHandler.cultureResources[key] = fileResource;

                                var culture = Client.Localization.getCulture();
                                var filesToLoadCount = 1;
                                var _loadFileCallback = function (cultureFile) {
                                    if (cultureFile && !cultureFile.loaded && cultureFile.error) {
                                        cultureFile.loaded = true;
                                        cultureFile.rendered = true;
                                        if (window.console)
                                            window.console.log(cultureFile.error);
                                    }

                                    if (!--filesToLoadCount) {
                                        delete fileResource.loading;

                                        if (culture == Client.Localization.getCulture()) {
                                            fileResource.loaded = true;

                                            if (callback)
                                                callback(fileResource);

                                            // The call will execute all other components callbacks that requested same file after it started loading
                                            FileResourceHandler.callbacks[key].fire();
                                            FileResourceHandler.callbacks[key].empty();
                                            delete FileResourceHandler.callbacks[key];
                                        } else {
                                            // call load() on the same file resource again, now that culture has changed, to load the required culture files
                                            FileResourceHandler.load(file, callback, errorcallback, sync);
                                        }
                                    }
                                };

                                if (culture && culture != "en") {
                                    var dashIndex = culture.indexOf("-");
                                    if (dashIndex > 0) {
                                        var lang = culture.slice(0, dashIndex);
                                        if (lang != "en") {
                                            // load the neutral culture file
                                            filesToLoadCount++;
                                            FileResourceHandler.load(SDL.jQuery.extend({}, file, { url: file.url.replace(/\{CULTURE\}/g, lang), context: SDL }), _loadFileCallback, _loadFileCallback, sync);
                                        }
                                    }

                                    // load the culture file
                                    FileResourceHandler.load(SDL.jQuery.extend({}, file, { url: file.url.replace(/\{CULTURE\}/g, culture), context: SDL }), _loadFileCallback, _loadFileCallback, sync);
                                } else {
                                    _loadFileCallback();
                                }
                            } else if (FileResourceHandler.enablePackaging && fileResource.parentPackages) {
                                if (callback) {
                                    FileResourceHandler.callbacks[key].add(function () {
                                        callback(fileResource);
                                    });
                                }
                                if (errorcallback) {
                                    FileResourceHandler.errorcallbacks[key].add(function (packageResource) {
                                        fileResource.error = packageResource.error;
                                        errorcallback(fileResource);
                                    });
                                }

                                FileResourceHandler.loadPackage(FileResourceHandler.getPreferedPackage(fileResource.parentPackages), null, null, sync);
                            } else {
                                Resources.CommonResourcesLoader.load(file, FileResourceHandler.corePath, sync, function (data) {
                                    fileResource.data = data;
                                    fileResource.loaded = true;
                                    delete fileResource.loading;

                                    if (callback)
                                        callback(fileResource);

                                    // The call will execute callbacks for all other components that requested same file after it started loading
                                    FileResourceHandler.callbacks[key].fire();

                                    FileResourceHandler.callbacks[key].empty();
                                    delete FileResourceHandler.callbacks[key];
                                    FileResourceHandler.errorcallbacks[key].empty();
                                    delete FileResourceHandler.errorcallbacks[key];
                                }, function (error) {
                                    fileResource.error = file.url + ": " + error;
                                    if (errorcallback) {
                                        // This call will execute errorcallback of the first component that requested this file
                                        errorcallback(fileResource);

                                        // The call will execute errorcallbacks for all other components that requested same file after it started loading
                                        FileResourceHandler.errorcallbacks[key].fire();

                                        FileResourceHandler.callbacks[key].empty();
                                        delete FileResourceHandler.callbacks[key];
                                        FileResourceHandler.errorcallbacks[key].empty();
                                        delete FileResourceHandler.errorcallbacks[key];
                                    } else {
                                        throw Error(file.url + ": " + error);
                                    }
                                });
                            }
                        }
                    } else if (callback)
                        callback(null);
                };
                FileResourceHandler.renderWhenLoaded = function (file, callback, errorcallback, sync) {
                    if (file) {
                        var key = file.url.toLowerCase();
                        var fileResource = FileResourceHandler.fileResources[key];

                        if (fileResource && fileResource.rendered) {
                            if (callback) {
                                callback(fileResource);
                            }
                        } else if (!fileResource || !fileResource.loaded) {
                            FileResourceHandler.load(file, function (file) {
                                return FileResourceHandler.renderWhenLoaded(file, callback, errorcallback);
                            }, errorcallback, sync);
                        } else {
                            if (file.url.indexOf("{CULTURE}") != -1) {
                                var culture = Client.Localization.getCulture();
                                var filesToRenderCount = 1;
                                var _renderFileCallback = function (cultureFile) {
                                    if (cultureFile && !cultureFile.rendered && cultureFile.error) {
                                        cultureFile.loaded = true;
                                        cultureFile.rendered = true;
                                    }

                                    if (!--filesToRenderCount) {
                                        if (culture == Client.Localization.getCulture()) {
                                            fileResource.rendered = true;
                                            if (callback) {
                                                callback(fileResource);
                                            }
                                        } else {
                                            FileResourceHandler.renderWhenLoaded(file, callback, errorcallback, sync);
                                        }
                                    }
                                };
                                if (culture && culture != "en") {
                                    var dashIndex = culture.indexOf("-");
                                    if (dashIndex > 0) {
                                        var lang = culture.slice(0, dashIndex);
                                        if (lang != "en") {
                                            // render the neutral culture file
                                            filesToRenderCount++;
                                            FileResourceHandler.renderWhenLoaded(SDL.jQuery.extend({}, file, { url: file.url.replace(/\{CULTURE\}/g, lang), context: SDL }), _renderFileCallback, _renderFileCallback, sync);
                                        }
                                    }
                                    FileResourceHandler.renderWhenLoaded(SDL.jQuery.extend({}, file, { url: file.url.replace(/\{CULTURE\}/g, culture), context: SDL }), _renderFileCallback, _renderFileCallback, sync);
                                } else {
                                    _renderFileCallback();
                                }
                            } else {
                                for (var i = 0; i < FileResourceHandler.registeredResourceHandlers.length; i++) {
                                    var handler = FileResourceHandler.registeredResourceHandlers[i];
                                    if (handler.supports(file.url)) {
                                        if (errorcallback) {
                                            try  {
                                                handler.render(file.url);
                                            } catch (err) {
                                                fileResource.error = "Error executing '" + fileResource.url + "': " + err.message;
                                                errorcallback(fileResource);
                                                return;
                                            }
                                        } else {
                                            handler.render(file.url);
                                        }

                                        if (callback) {
                                            callback(fileResource);
                                            return;
                                        }
                                    }
                                }

                                throw Error("There is no handler registered for file '" + file.url + "'.");
                            }
                        }
                    } else if (callback) {
                        callback(null);
                    }
                };

                FileResourceHandler.getTemplateResource = function (templateId) {
                    return FileResourceHandler.templates[templateId];
                };

                FileResourceHandler.registerPackage = function (resourcesPackage) {
                    if (resourcesPackage) {
                        var registeredPackage = FileResourceHandler.packages[resourcesPackage.name];
                        if (resourcesPackage.files) {
                            var packageSetToRender = registeredPackage && registeredPackage.rendered && !registeredPackage.files;
                            if (!registeredPackage || packageSetToRender) {
                                FileResourceHandler.packages[resourcesPackage.name] = resourcesPackage;

                                var key;
                                var files = resourcesPackage.files;
                                var resourceFiles = FileResourceHandler.fileResources;
                                for (var i = 0, len = files.length; i < len; i++) {
                                    key = files[i].toLowerCase();
                                    var file = resourceFiles[key] || (resourceFiles[key] = { url: files[i] });
                                    if (!file.parentPackages) {
                                        file.parentPackages = [resourcesPackage];
                                    } else {
                                        file.parentPackages.push(resourcesPackage);
                                    }
                                }

                                key = resourcesPackage.url.toLowerCase();
                                var packageFile = FileResourceHandler.fileResources[key];
                                if (packageFile && packageFile.loaded) {
                                    FileResourceHandler.processPackageFileLoaded(resourcesPackage, packageFile);
                                }

                                if (packageSetToRender) {
                                    FileResourceHandler.setRenderedPackage(resourcesPackage);
                                }
                            }
                        } else if (!registeredPackage) {
                            FileResourceHandler.packages[resourcesPackage.name] = resourcesPackage;
                        }
                    }
                };

                FileResourceHandler.registerPackageRendered = function (packageName) {
                    var registeredPackage = FileResourceHandler.packages[packageName];
                    if (!registeredPackage) {
                        FileResourceHandler.registerPackage({ name: packageName, url: null, rendered: true });
                    } else if (registeredPackage.files) {
                        FileResourceHandler.setRenderedPackage(registeredPackage);
                    }
                };

                FileResourceHandler.getPreferedPackage = function (packages) {
                    var len = packages && packages.length;
                    if (!len) {
                        return null;
                    } else if (len == 1) {
                        return packages[0];
                    } else {
                        var parentPackage;
                        var parentPackageUrl;

                        for (var i = 0, len = packages.length; i < len; i++) {
                            var newPackage = packages[i];
                            var newPackageUrl = newPackage.url;
                            var newPackageFileResource = FileResourceHandler.fileResources[newPackageUrl.toLowerCase()];

                            if (newPackageFileResource && (newPackageFileResource.loading || newPackageFileResource.loaded)) {
                                return newPackage;
                            }

                            var useNewPackage = null;

                            if (!parentPackage) {
                                useNewPackage = true;
                            } else {
                                var parentPackageUrlCommon = (parentPackageUrl.indexOf("~/") == 0);
                                var newPackageUrlCommon = (newPackageUrl.indexOf("~/") == 0);
                                if (parentPackageUrlCommon != newPackageUrlCommon) {
                                    if (newPackageUrlCommon) {
                                        useNewPackage = true;
                                    } else {
                                        useNewPackage = false;
                                    }
                                } else if (newPackageUrlCommon && Client.Application.useHostedLibraryResources) {
                                } else if (newPackage.rendered) {
                                    if (!parentPackage.rendered) {
                                        useNewPackage = true;
                                    } else {
                                        var oldUrl = parentPackageUrl;
                                        var newUrl = newPackageUrl;

                                        if (parentPackageUrlCommon) {
                                            oldUrl = Client.Types.Url.combinePath(FileResourceHandler.corePath, oldUrl.slice(2));
                                        }
                                        oldUrl = Client.Types.Url.combinePath(window.location.href, oldUrl);

                                        if (newPackageUrlCommon) {
                                            newUrl = Client.Types.Url.combinePath(FileResourceHandler.corePath, newUrl.slice(2));
                                        }
                                        newUrl = Client.Types.Url.combinePath(window.location.href, newUrl);

                                        var scripts = SDL.jQuery("script[src]");
                                        var oldUrlFound = false;
                                        var newUrlFound = false;

                                        for (var i = 0, len = scripts.length; i < len && (!oldUrlFound || !newUrlFound); i++) {
                                            var src = (scripts[i]).src;
                                            var index = src.indexOf("?");
                                            if (index != -1) {
                                                src = src.slice(0, index);
                                            }

                                            if (src == oldUrl) {
                                                oldUrlFound = true;
                                            } else if (src == newUrl) {
                                                newUrlFound = true;
                                            }
                                        }

                                        if (newUrlFound != oldUrlFound) {
                                            useNewPackage = newUrlFound;
                                        }
                                    }
                                }

                                if (useNewPackage == null && newPackage.files) {
                                    //take the package with most files for better reuse
                                    useNewPackage = !parentPackage.files || (newPackage.files.length > parentPackage.files.length);
                                }
                            }

                            if (useNewPackage) {
                                parentPackage = newPackage;
                                parentPackageUrl = newPackageUrl;
                            }
                        }
                        return parentPackage;
                    }
                };

                FileResourceHandler.loadPackage = function (resourcesPackage, callback, errorcallback, sync) {
                    var key = resourcesPackage.url.toLowerCase();
                    var file = FileResourceHandler.fileResources[key];

                    if (!file || !file.loaded) {
                        FileResourceHandler.load(resourcesPackage, function (file) {
                            return FileResourceHandler.processPackageFileLoaded(resourcesPackage, file);
                        }, errorcallback, sync);
                    } else if (!resourcesPackage.unpackaged) {
                        FileResourceHandler.processPackageFileLoaded(resourcesPackage, file);
                    } else if (callback) {
                        callback();
                    }
                };

                FileResourceHandler.processPackageFileLoaded = function (resourcesPackage, file) {
                    if (file && file.loaded && resourcesPackage && !resourcesPackage.unpackaged) {
                        resourcesPackage.unpackaged = true;

                        var data = file.data;

                        //delete file.data;	// ApplicationHost needs the data stored, for hosted applications
                        var start;
                        var sizes;

                        var m = data && data.match(/^\/\*(\d+(?:,\d+)*)\*\//);
                        if (m) {
                            start = m[0].length;
                            sizes = m[1].split(",");
                        } else {
                            start = 0;
                            sizes = [data.length];
                        }

                        var allRendered = true;
                        var files = resourcesPackage.files;
                        var fileResources = FileResourceHandler.fileResources;
                        var calls = [];
                        for (var i = 0, len = files.length; i < len; i++) {
                            var key = files[i].toLowerCase();
                            var resourceFile = fileResources[key] || (fileResources[key] = { url: files[i] });
                            resourceFile.loaded = true;
                            delete resourceFile.loading;

                            if (allRendered) {
                                allRendered = resourceFile.rendered;
                            }

                            var size = sizes[i];
                            resourceFile.data = data.substr(start, size);
                            start += Number(size);

                            if (FileResourceHandler.callbacks[key]) {
                                calls.push(FileResourceHandler.callbacks[key]);
                                delete FileResourceHandler.callbacks[key];
                            }
                        }

                        if (allRendered) {
                            resourcesPackage.rendered = true;
                        }

                        for (var j = 0, lenj = calls.length; j < lenj; j++) {
                            calls[j].fire();
                            calls[j].empty();
                        }
                    }
                };

                FileResourceHandler.setRenderedPackage = function (resourcesPackage) {
                    if (resourcesPackage && !resourcesPackage.rendered) {
                        resourcesPackage.rendered = true;

                        var fileResources = FileResourceHandler.fileResources;
                        var key = resourcesPackage.url.toLowerCase();
                        var resourceFile = fileResources[key] || (fileResources[key] = { url: resourcesPackage.url });
                        resourceFile.rendered = true;

                        var files = resourcesPackage.files;

                        for (var i = 0, len = files.length; i < len; i++) {
                            key = files[i].toLowerCase();
                            resourceFile = fileResources[key] || (fileResources[key] = { url: files[i] });
                            resourceFile.rendered = true;
                        }
                    }
                };

                FileResourceHandler.updateCultureResources = function (callback) {
                    var culturesToRender = 1;
                    var cultureRenderedCallback = function () {
                        if (!--culturesToRender && callback) {
                            callback();
                        }
                    };

                    SDL.jQuery.each(FileResourceHandler.cultureResources, function (key, resource) {
                        var toRender = resource.rendered;
                        var toLoad = toRender || resource.loaded || resource.loading;

                        resource.loaded = false;
                        resource.rendered = false;

                        if (toLoad) {
                            FileResourceHandler.load({ url: resource.url, version: resource.version });
                        }

                        if (toRender) {
                            culturesToRender++;
                            FileResourceHandler.renderWhenLoaded({ url: resource.url, version: resource.version }, cultureRenderedCallback);
                        }
                    });

                    cultureRenderedCallback();
                };
                FileResourceHandler.registeredResourceHandlers = [];

                FileResourceHandler.templates = {};

                FileResourceHandler.fileResources = {};

                FileResourceHandler.packages = {};

                FileResourceHandler.cultureResources = {};

                FileResourceHandler.callbacks = {};
                FileResourceHandler.errorcallbacks = {};
                return FileResourceHandler;
            })();
            Resources.FileResourceHandler = FileResourceHandler;
        })(Client.Resources || (Client.Resources = {}));
        var Resources = Client.Resources;
    })(SDL.Client || (SDL.Client = {}));
    var Client = SDL.Client;
})(SDL || (SDL = {}));
//@ sourceMappingURL=FileResourceHandler.js.map
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SDL;
(function (SDL) {
    (function (Client) {
        (function (Resources) {
            /// <reference path="../../Libraries/jQuery/SDL.jQuery.ts" />
            /// <reference path="../FileResourceHandler.ts" />
            (function (FileHandlers) {
                var CssFileHandler = (function (_super) {
                    __extends(CssFileHandler, _super);
                    function CssFileHandler() {
                        _super.apply(this, arguments);
                    }
                    CssFileHandler.updatePaths = function (data, url, addHost) {
                        if (typeof addHost === "undefined") { addHost = false; }
                        if (data) {
                            var path;
                            if (url && url.indexOf("~/") == 0) {
                                url = Client.Types.Url.combinePath(Resources.FileResourceHandler.corePath, url.slice(2));
                            }

                            return data.replace(/\{(PATH|ROOT)\}(\/?)/g, function (substring, token, next) {
                                switch (token) {
                                    case "PATH":
                                        if (!path) {
                                            if (url) {
                                                var lastSlashPos = url.lastIndexOf("/");
                                                path = (lastSlashPos != -1) ? url.slice(0, lastSlashPos + 1) : (url + "/");
                                            } else {
                                                path = "/";
                                            }
                                        }
                                        return addHost ? Client.Types.Url.combinePath(window.location.href, path) : path;
                                    case "ROOT":
                                        return addHost ? Client.Types.Url.combinePath(window.location.href, Resources.FileResourceHandler.corePath) : Resources.FileResourceHandler.corePath;
                                }
                            });
                        }
                        return data;
                    };

                    CssFileHandler.supports = function (url) {
                        return (/\.css(\?|\#|$)/i).test(url);
                    };

                    CssFileHandler.prototype._supports = function (ext) {
                        return (ext == "css");
                    };

                    CssFileHandler.prototype._render = function (url, file) {
                        file.type = "text/css";
                        var $styles;

                        if (SDL.jQuery.browser.msie && ($styles = SDL.jQuery("link[type='text/css'], style")).length > 30) {
                            // IE has a problem with dealing with more than 31 css/text links + style-tags...
                            // if the number of styles exceed 31 in total,
                            // we will gather the rest of the style sheets in one embedded <style> element
                            var $lastStyle = $styles.last();
                            if ($lastStyle.is("style")) {
                                $lastStyle.text($lastStyle.text() + "\n\n/* APPENDED: (" + file.url + ") */\n\n" + CssFileHandler.updatePaths(file.data, file.url));
                            } else {
                                // this is unlikely that the last style is linked as long as we add embedded styles
                                // still, if for whatever reason it happens, load the linked style synchronously and replace the <link>
                                // with an embedded <style>
                                // 1. remove the linked style
                                var url = $lastStyle.remove().attr("href");

                                // 2. load its contents
                                SDL.Client.Net.callWebMethod(url, "", "GET", null, true, function (data) {
                                    // 3a. insert as a <style> element
                                    SDL.jQuery("head").append(SDL.jQuery("<style />", {
                                        id: url,
                                        text: CssFileHandler.updatePaths(data, url) + "\n\n/* APPENDED: (" + file.url + ") */\n\n" + CssFileHandler.updatePaths(file.data, file.url)
                                    }));
                                }, function (errorThrow) {
                                    // 3b. insert as a <style> element
                                    SDL.jQuery("head").append(SDL.jQuery("<style />", {
                                        id: url,
                                        text: "/* FAILED LOADING \"" + url + "\":\n" + errorThrow + "*/\n\n/* APPENDED: (" + file.url + ") */\n\n" + CssFileHandler.updatePaths(file.data, file.url)
                                    }));
                                });
                            }
                        } else {
                            SDL.jQuery("head").append(SDL.jQuery("<style />", {
                                id: file.url,
                                text: CssFileHandler.updatePaths(file.data, file.url)
                            }));
                        }
                    };
                    return CssFileHandler;
                })(Resources.FileResourceHandler);
                FileHandlers.CssFileHandler = CssFileHandler;
                Resources.FileResourceHandler.registeredResourceHandlers.push(new CssFileHandler());
            })(Resources.FileHandlers || (Resources.FileHandlers = {}));
            var FileHandlers = Resources.FileHandlers;
        })(Client.Resources || (Client.Resources = {}));
        var Resources = Client.Resources;
    })(SDL.Client || (SDL.Client = {}));
    var Client = SDL.Client;
})(SDL || (SDL = {}));
//@ sourceMappingURL=CssFileHandler.js.map
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SDL;
(function (SDL) {
    (function (Client) {
        (function (Resources) {
            /// <reference path="../../Libraries/jQuery/SDL.jQuery.ts" />
            /// <reference path="../FileResourceHandler.ts" />
            (function (FileHandlers) {
                var HtmlFileHandler = (function (_super) {
                    __extends(HtmlFileHandler, _super);
                    function HtmlFileHandler() {
                        _super.apply(this, arguments);
                    }
                    HtmlFileHandler.prototype._supports = function (ext) {
                        return (ext == "htm" || ext == "html");
                    };

                    HtmlFileHandler.prototype._render = function (url, file) {
                        var templ = SDL.jQuery(file.data);
                        file.type = templ.attr("type");
                        file.template = templ.html();
                        Resources.FileResourceHandler.templates[templ.attr("id")] = file;
                    };
                    return HtmlFileHandler;
                })(Resources.FileResourceHandler);
                Resources.FileResourceHandler.registeredResourceHandlers.push(new HtmlFileHandler());
            })(Resources.FileHandlers || (Resources.FileHandlers = {}));
            var FileHandlers = Resources.FileHandlers;
        })(Client.Resources || (Client.Resources = {}));
        var Resources = Client.Resources;
    })(SDL.Client || (SDL.Client = {}));
    var Client = SDL.Client;
})(SDL || (SDL = {}));
//@ sourceMappingURL=HtmlFileHandler.js.map
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SDL;
(function (SDL) {
    (function (Client) {
        (function (Resources) {
            /// <reference path="../../Libraries/jQuery/SDL.jQuery.ts" />
            /// <reference path="../FileResourceHandler.ts" />
            (function (FileHandlers) {
                var JsFileHandler = (function (_super) {
                    __extends(JsFileHandler, _super);
                    function JsFileHandler() {
                        _super.apply(this, arguments);
                    }
                    JsFileHandler.prototype._supports = function (ext) {
                        return (ext == "js");
                    };

                    JsFileHandler.prototype._render = function (url, file) {
                        file.type = "text/javascript";
                        if (file.context) {
                            (function () {
                                var url, file;
                                eval(arguments[0]);
                            }).apply(file.context, [file.data]);
                        } else {
                            SDL.jQuery.globalEval(file.data);
                        }
                    };
                    return JsFileHandler;
                })(Resources.FileResourceHandler);
                Resources.FileResourceHandler.registeredResourceHandlers.push(new JsFileHandler());
            })(Resources.FileHandlers || (Resources.FileHandlers = {}));
            var FileHandlers = Resources.FileHandlers;
        })(Client.Resources || (Client.Resources = {}));
        var Resources = Client.Resources;
    })(SDL.Client || (SDL.Client = {}));
    var Client = SDL.Client;
})(SDL || (SDL = {}));
//@ sourceMappingURL=JsFileHandler.js.map
var SDL;
(function (SDL) {
    (function (Client) {
        /// <reference path="FileResourceHandler.ts" />
        /// <reference path="..\ConfigurationManager\ConfigurationManager.ts" />
        /// <reference path="..\Xml\Xml.d.ts" />
        (function (Resources) {
            SDL.jQuery.ajaxSetup({
                // Enable caching of AJAX responses
                cache: true
            });

            (function (ResourceManagerMode) {
                ResourceManagerMode[ResourceManagerMode["NORMAL"] = 0] = "NORMAL";
                ResourceManagerMode[ResourceManagerMode["REVERSE"] = 1] = "REVERSE";

                ResourceManagerMode[ResourceManagerMode["SYNCHRONOUS"] = 2] = "SYNCHRONOUS";
            })(Resources.ResourceManagerMode || (Resources.ResourceManagerMode = {}));
            var ResourceManagerMode = Resources.ResourceManagerMode;

            var ResourceManagerClass = (function () {
                function ResourceManagerClass() {
                    this.mode = ResourceManagerMode.NORMAL;
                    // Collection of all registered resource groups
                    this.registeredResources = {};
                    this.callbacks = {};
                }
                ResourceManagerClass.prototype.setMode = function (mode) {
                    this.mode = mode;
                };

                ResourceManagerClass.prototype.newResourceGroup = function (options) {
                    if (!this.registeredResources[options.name]) {
                        this.registeredResources[options.name] = options;
                    } else {
                        throw Error("Resource group with name '" + options.name + "' is already registered.");
                    }
                };

                ResourceManagerClass.prototype.getTemplateResource = function (templateId) {
                    return Resources.FileResourceHandler.getTemplateResource(templateId);
                };

                ResourceManagerClass.prototype.resolveResources = function (resourceGroupName) {
                    var _this = this;
                    return SDL.jQuery.map(this._resolve(resourceGroupName), function (name) {
                        var resource = _this.registeredResources[name];
                        if (resource.files && resource.files.length) {
                            return {
                                name: resource.name,
                                files: SDL.jQuery.map(resource.files, function (file) {
                                    return file.url;
                                })
                            };
                        }
                    });
                };

                ResourceManagerClass.prototype.load = function (resourceGroupName, callback, errorcallback) {
                    this._render(resourceGroupName, callback, errorcallback);
                };

                ResourceManagerClass.prototype.readConfiguration = function () {
                    var _this = this;
                    var config = Client.Configuration.ConfigurationManager.configuration;

                    Resources.FileResourceHandler.corePath = Client.Configuration.ConfigurationManager.corePath;
                    Resources.FileResourceHandler.enablePackaging = Client.Configuration.ConfigurationManager.getAppSetting("debug") != "true";

                    SDL.jQuery.each(Client.Xml.selectNodes(config, "//resourceGroups[parent::configuration and resourceGroup]"), function (index, resourceGroupsElement) {
                        var appVersionNodes = Client.Xml.selectNodes(resourceGroupsElement, "ancestor::configuration/appSettings/setting[@name='version']/@value");
                        var appVersion = appVersionNodes.length ? appVersionNodes[appVersionNodes.length - 1].nodeValue : "";

                        var baseUrlNodes = Client.Xml.selectNodes(resourceGroupsElement, "ancestor::configuration/@baseUrl");
                        var baseUrl = baseUrlNodes.length ? baseUrlNodes[baseUrlNodes.length - 1].nodeValue : "";

                        SDL.jQuery.each(Client.Xml.selectNodes(resourceGroupsElement, "resourceGroup"), function (index, resourceGroupElement) {
                            var name = resourceGroupElement.getAttribute("name");
                            var resourceGroup = { name: name, files: [], dependencies: [], extensions: [] };

                            SDL.jQuery.each(Client.Xml.selectNodes(resourceGroupElement, "files/file[@name]"), function (index, fileElement) {
                                var modification = fileElement.getAttribute("modification");
                                var url = fileElement.getAttribute("name");
                                var file = {
                                    url: url.indexOf("~/") == 0 ? url : Client.Types.Url.combinePath(baseUrl, url),
                                    version: (appVersion && modification) ? (appVersion + "." + modification) : (appVersion || modification)
                                };
                                resourceGroup.files.push(file);
                            });

                            SDL.jQuery.each(Client.Xml.selectNodes(resourceGroupElement, "dependencies/dependency/@name"), function (index, dependency) {
                                resourceGroup.dependencies.push((dependency).value);
                            });

                            SDL.jQuery.each(Client.Xml.selectNodes(config, "//configuration/extensions/resourceExtension[@for = \"" + name + "\"]/insert[@position = 'before']/@name"), function (index, dependency) {
                                resourceGroup.dependencies.push((dependency).value);
                            });

                            SDL.jQuery.each(Client.Xml.selectNodes(config, "//configuration/extensions/resourceExtension[@for = \"" + name + "\"]/insert[not(@position) or @position = 'after']/@name"), function (index, extension) {
                                resourceGroup.extensions.push((extension).value);
                            });

                            _this.newResourceGroup(resourceGroup);
                        });
                    });

                    SDL.jQuery.each(Client.Xml.selectNodes(config, "//packages[parent::configuration and package]"), function (index, packagesNode) {
                        var appVersionNodes = Client.Xml.selectNodes(packagesNode, "ancestor::configuration/appSettings/setting[@name='version']/@value");
                        var appVersion = appVersionNodes.length ? appVersionNodes[appVersionNodes.length - 1].nodeValue : "";

                        var baseUrlNodes = Client.Xml.selectNodes(packagesNode, "ancestor::configuration/@baseUrl");
                        var baseUrl = baseUrlNodes.length ? baseUrlNodes[baseUrlNodes.length - 1].nodeValue : "";

                        SDL.jQuery.each(Client.Xml.selectNodes(packagesNode, "package"), function (index, packageElement) {
                            var url = packageElement.getAttribute("src");
                            var modification = packageElement.getAttribute("modification");

                            var resourcesPackage = {
                                name: packageElement.getAttribute("name"),
                                url: url.indexOf("~/") == 0 ? url : Client.Types.Url.combinePath(baseUrl, url),
                                version: (appVersion && modification) ? (appVersion + "." + modification) : (appVersion || modification),
                                files: []
                            };

                            SDL.jQuery.each(Client.Xml.selectNodes(packageElement, ".//resourceGroups/resourceGroup"), function (index, groupElement) {
                                SDL.jQuery.each(_this.registeredResources[groupElement.getAttribute("name")].files, function (index, file) {
                                    if (file.url.indexOf("{CULTURE}") == -1) {
                                        resourcesPackage.files.push(file.url);
                                    }
                                });
                            });
                            Resources.FileResourceHandler.registerPackage(resourcesPackage);
                        });
                    });
                };

                ResourceManagerClass.prototype.registerPackageRendered = function (packageName) {
                    Resources.FileResourceHandler.registerPackageRendered(packageName);
                };

                ResourceManagerClass.prototype._resolve = function (resourceGroupName, resources) {
                    var _this = this;
                    if (!resources) {
                        resources = [];
                    }

                    var resourceSettings = this.registeredResources[resourceGroupName];
                    if (!resourceSettings) {
                        throw Error("Resource group with name '" + resourceGroupName + "' does not exist");
                    }

                    if (resourceSettings.dependencies && resourceSettings.dependencies.length) {
                        SDL.jQuery.each((this.mode & ResourceManagerMode.REVERSE) ? resourceSettings.dependencies.reverse() : resourceSettings.dependencies, function (index, value) {
                            return _this._resolve(value, resources);
                        });
                    }

                    if (resources.indexOf(resourceGroupName) == -1) {
                        resources.push(resourceGroupName);
                    }

                    if (resourceSettings.extensions && resourceSettings.extensions.length) {
                        SDL.jQuery.each((this.mode & ResourceManagerMode.REVERSE) ? resourceSettings.extensions.reverse() : resourceSettings.extensions, function (index, value) {
                            return _this._resolve(value, resources);
                        });
                    }

                    return resources;
                };

                ResourceManagerClass.prototype._render = function (resourceGroupName, callback, errorcallback, callstack) {
                    var _this = this;
                    var resourceSettings = this.registeredResources[resourceGroupName];
                    if (!resourceSettings) {
                        var error = "Resource group with name '" + resourceGroupName + "' does not exist";
                        if (errorcallback) {
                            errorcallback(error);
                            return;
                        } else {
                            throw Error(error);
                        }
                    }

                    var extensions = resourceSettings.extensions;
                    if (extensions) {
                        var extensionsCount = extensions.length;
                        if (extensionsCount && (!callstack || SDL.jQuery.inArray(resourceGroupName, callstack) == -1)) {
                            // make sure the extensions get loaded too unless the current group is already in the callstack
                            // if it is, the extensions will be loaded by the earlier call in the callstack
                            var _callback = callback;
                            callback = function () {
                                var extensionInCallstack = -1;

                                var onExtensionLoaded;

                                if (_callback) {
                                    if (callstack) {
                                        for (var i = 0; i < extensionsCount; i++) {
                                            if (SDL.jQuery.inArray(extensions[i], callstack) != -1) {
                                                extensionInCallstack = i;
                                                break;
                                            }
                                        }
                                    }

                                    if (extensionInCallstack != -1) {
                                        // an extension in the callstack is waiting for a callback from the current group -> execute callback to prevent deadlocks
                                        // (could be smarter and call the callback only if other extensions are dependent on the extension in the callstack)
                                        _callback();
                                        errorcallback = null;
                                    } else {
                                        var renderedExtensions = 0;
                                        onExtensionLoaded = function () {
                                            if (++renderedExtensions == extensionsCount) {
                                                _callback();
                                            }
                                        };
                                    }
                                }

                                var ownCallstack = callstack ? callstack.concat([resourceGroupName]) : [resourceGroupName];

                                for (var i = 0; i < extensionsCount; i++) {
                                    if (extensionInCallstack != i) {
                                        _this._render(extensions[i], onExtensionLoaded, errorcallback, ownCallstack);
                                    }
                                }
                            };
                        }
                    }

                    if (resourceSettings.loaded) {
                        if (callback) {
                            callback();
                        }
                    } else if (resourceSettings.loading) {
                        if (callstack) {
                            var index = SDL.jQuery.inArray(resourceGroupName, callstack);
                            if (index != -1) {
                                index++;
                                for (var len = callstack.length; index < len; index++) {
                                    if (this.registeredResources[callstack[index]].loaded) {
                                        if (callback) {
                                            callback();
                                        }
                                        return;
                                    }
                                }

                                var error = "Circular dependency detected: " + callstack.join(" -> ") + " -> " + resourceGroupName;
                                if (errorcallback) {
                                    errorcallback(error);
                                } else {
                                    throw Error(error);
                                }
                                return;
                            }
                        }

                        if (callback)
                            this.callbacks[resourceGroupName].add(callback);
                    } else {
                        resourceSettings.loading = true;

                        this.callbacks[resourceGroupName] = SDL.jQuery.Callbacks("once");

                        var renderCallbackHandler = function () {
                            resourceSettings.loaded = true;
                            resourceSettings.loading = false;
                            if (callback)
                                callback();
                            _this.callbacks[resourceGroupName].fire();
                            _this.callbacks[resourceGroupName].empty();
                            delete _this.callbacks[resourceGroupName];
                        };

                        var dependenciesCount = resourceSettings.dependencies ? resourceSettings.dependencies.length : 0;
                        var filesCount = resourceSettings.files ? resourceSettings.files.length : 0;

                        if (dependenciesCount || filesCount) {
                            var renderedDependenciesCount = 0;
                            var nextFileToLoad = 0;

                            var renderNextFile = function () {
                                if (nextFileToLoad < filesCount) {
                                    var file = resourceSettings.files[nextFileToLoad];
                                    nextFileToLoad++;
                                    Resources.FileResourceHandler.renderWhenLoaded(file, renderNextFile, errorcallback ? function (file) {
                                        return errorcallback(file && file.error);
                                    } : null, (_this.mode & ResourceManagerMode.SYNCHRONOUS) != 0);
                                } else {
                                    renderCallbackHandler();
                                }
                            };

                            var dependencyCallbackHandler = function () {
                                if (++renderedDependenciesCount == dependenciesCount) {
                                    renderNextFile();
                                }
                            };

                            if (filesCount) {
                                // Start loading this resource group's files
                                SDL.jQuery.each(resourceSettings.files, function (index, value) {
                                    return Resources.FileResourceHandler.loadIfNotRendered(value, null, errorcallback ? function (file) {
                                        return errorcallback(file && file.error);
                                    } : null, (_this.mode & ResourceManagerMode.SYNCHRONOUS) != 0);
                                });
                            }

                            if (dependenciesCount) {
                                // add the resource group to the dependency callstack to be able to detect circular references
                                var ownCallstack = callstack ? callstack.concat([resourceGroupName]) : [resourceGroupName];

                                SDL.jQuery.each((this.mode & ResourceManagerMode.REVERSE) ? resourceSettings.dependencies.reverse() : resourceSettings.dependencies, function (index, value) {
                                    return _this._render(value, dependencyCallbackHandler, errorcallback, ownCallstack);
                                });
                            } else {
                                renderNextFile();
                            }
                        } else {
                            renderCallbackHandler();
                        }
                    }
                };
                return ResourceManagerClass;
            })();

            Resources.ResourceManager = new ResourceManagerClass();
        })(Client.Resources || (Client.Resources = {}));
        var Resources = Client.Resources;
    })(SDL.Client || (SDL.Client = {}));
    var Client = SDL.Client;
})(SDL || (SDL = {}));
//@ sourceMappingURL=ResourceManager.js.map
/// <reference path="../Resources/ResourceManager.ts" />
SDL.Client.Resources.ResourceManager.registerPackageRendered("SDL.Client.Base");
//@ sourceMappingURL=base.js.map
