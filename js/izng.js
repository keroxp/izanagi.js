/* IZANAGI
 * - Html document reader
 * - developed by @keroxp / Yusuke Sakurai
 * - http://keroxp.me/
 * - http://github.com/keroxp/izanagi.js/
 */

var Izng;

if(!Izng) {
	Izng = {};
}

/*
 * loaded initialization
 */

Izng.init = function()
{
	this.Util.loadIn();
	//this.Debugger.init();
	this.Drawer.init();
	this.Binder.init();
	this.Ajax.init();
	this.Util.loadOut();
}
var $main = $("#izng-main");
var $body = $("#izng-body");
var $article = $("#izng-article");
var $sidebar = $("#izng-sidebar");
var $header = $("#izng-header");
var $taskbar = $("#izng-taskbar");
var $infobar = $("#izng-infobar");

var DEFAULT_COLOR = {
	"forSet" : 37,
	"forDisp" : "#555555"
}
var DEFAULT_SIZE = {
	"forSet" : 40,
	"forDisp" : "14px"
};
var DEFAULT_LINEHEIGHT = {
	"forSet" : 40,
	"forDisp" : "2em"
};
var DEFAULT_FONT = {
	"forSet" : "gothic",
	"fotDisp" : "ゴシック（細）"
};
var DEFAULT_WIDTH = {
	"forSet" : 0,
	"visible" : 744,
	"full" : 1024,
	"taskbar" : 280,
	"canchange" : 200,
	"padOffset" : 100
};

var FONT_LIST = {
	"mincho" : "明朝（細）",
	"bold-mincho" : "明朝（太）",
	"gothic" : "ゴシック（細）",
	"bold-gothic" : "ゴシック（太）"
};

var Debugger = {
	init : function()
	{
		//windwo 情報をトレースするinput
		var i = this.windowInfo.all();
		var tr = Util.create("div", {
			id : "izng-log-trasor"
		})
		for(var key in i) {
			var label = Util.create("label", {
				"for" : key
			});
			var control = Util.create("span", {
				className : "text_f_control",
			}, key)
			var input = Util.create("input", {
				type : "text",
				id : "izng-log-" + key,
				name : key,
				value : i[key]
			})
			var field = Util.create("span", {
				className : "field text_f"
			})
			field.appendChild(input);
			label.appendChild(control);
			label.appendChild(field);
			tr.appendChild(label);
		}
		var log = Util.create("aside", {
			id : "izng-log"
		})
		log.appendChild(tr);
		document.body.appendChild(log);

		//windowオブジェクトにscroll,resize eventをバインド

		jQuery("#izng-main").scroll(function()
		{
			//Debugger.log("scrolling!");
			/*
			 jQuery("#izng-pageXOffset").val(Env.window.pageXOffset);
			 jQuery("#izng-pageYOffset").val(Env.window.pageYOffset);
			 */
		})
		jQuery(window).bind("resize", function()
		{
			jQuery("#izng-log-innerWidth").val(window.innerWidth);
			jQuery("#izng-log-innerHeight").val(window.innerHeight);
		})
		//随時追加するtextlog area を作成

		var textlog = document.createElement("textarea");
		textlog.id = "izng-log-text";
		var log = document.getElementById("izng-log");
		log.appendChild(textlog);

		//ブラウザ情報をプリント

		//this.log("Browser Info", BrowserDetect.allStatus());

	},
	log : function(title, obj)
	{
		var log = document.getElementById("izng-log-text");
		log.value += title + "\n";
		var add = "";
		if( typeof (obj) == "object") {
			for(var key in obj) {
				add += "- " + key + " : " + obj[key] + "\n";
			}
		}
		log.value += add;
	},
	traceor : function()
	{

	},
	windowInfo : {
		all : function()
		{
			var _innerWidth = this.innerWidth();
			var _innerHeight = this.innerHeight();
			var contents = {
				"name" : this.name,
				"innerWidth" : _innerWidth,
				"innerHeigth" : _innerHeight,
				"outerWidth" : this.outerWidth,
				"outerHeight" : this.outerHeight,
				"pageXOffset" : this.pageXOffset,
				"pageYOffset" : this.pageYOffset
			}
			return contents;
		},
		name : window.name,
		innerWidth : function()
		{
			return (navigator.appName.indexOf("msie") < 0 ) ? window.innerWidth : document.body.clientWidth;
		},
		innerHeight : function()
		{
			return (navigator.appName.indexOf("msie") < 0 ) ? window.innerHeight : document.body.clientHeight;
		},
		outerHeight : window.outerHeight,
		outerWidth : window.outerWidth,
		pageXOffset : window.pageXOffset,
		pageYOffset : window.pageYOffset
	}
}

/*
 * Task bar
 */

var Drawer = {
	init : function()
	{
		jQuery("#izng-article").removeAttr("style");
		this.fontface(DEFAULT_FONT["forSet"]);
		this.fontsize();
		this.fontcolor();
		this.lineheight();
		this.width();
		this.bg("default");
	},
	toggle : function(rel)
	{
		var _rel = "#izng-" + rel;
		if(jQuery(_rel).hasClass("hidden")) {
			jQuery(_rel).slideDown().removeClass("hidden");
		} else {
			jQuery(_rel).slideUp().addClass("hidden");
		}
	},
	slide : function(selector)
	{
		var speed = 500;	
		var distance = "280px";	
		var s = "#izng-" + selector;
		switch(selector){
			case "taskbar" :
				jQuery("#izng-taskbar").animate({
					zIndex : 200
				},speed);
				break;
			case "infobar" :
				jQuery("#izng-infobar").animate({
					zIndex : 200
				},speed);
				break;
			default :
				return;
				break;
		}
	},
	fontface : function(target)
	{
		var disp = FONT_LIST[target];
		var fonts = ["mincho", "gothic", "bold", "normal"];
		var fc = target.split("-");
		target = "#izng-" + target;
		for(var i = 0; i < fonts.length; i++) {
			jQuery("#izng-article").removeClass(fonts[i]);
		}
		jQuery("#izng-fontface").children().removeClass("radioSelected");
		jQuery(target).addClass("radioSelected");
		jQuery("#izng-article").addClass(fc[0]);
		if(fc.length > 1)
			jQuery("#izng-article").addClass(fc[1]);
		jQuery("#izng-fontface-value").val(disp);

	},
	fontcolor : function()
	{
		jQuery("#izng-fontcolor").slider({
			orientation : "horizontal",
			range : "min",
			min : 0,
			max : 150,
			value : DEFAULT_COLOR["forSet"],
			slide : function(event, ui)
			{
				var a = ui.value;
				var hexColor = Util.rgbToHex(a, a, a);
				var rgbColor = "r : " + a + "g : " + a + "b : " + a;
				jQuery("#izng-fontcolor-value").val(hexColor);
				jQuery("#izng-article").css("color", hexColor);
				//jQuery.cookie("user_color", color);
			}
		});
		jQuery("#izng-article").css("color", DEFAULT_COLOR["forDisp"]);
		jQuery("#izng-fontcolor-value").val(DEFAULT_COLOR["forDisp"]);
	},
	fontsize : function()
	{
		jQuery("#izng-fontsize").slider({
			orientation : "horizontal",
			range : "min",
			min : 00,
			max : 100,
			value : DEFAULT_SIZE["forSet"],
			slide : function(event, ui)
			{
				var size = 10 + Math.ceil(ui.value / 10);
				jQuery("#izng-fontsize-value").val(size + "px");
				jQuery("#izng-article").css("font-size", size + "px");
				//jQuery.cookie("user_font_size", size);
			}
		});
		jQuery("#izng-article").css("font-size", DEFAULT_SIZE["forDisp"]);
		jQuery("#izng-fontsize-value").val(DEFAULT_SIZE["forDisp"]);
	},
	lineheight : function()
	{
		jQuery("#izng-lineheight").slider({
			orientation : "horizontal",
			range : "min",
			min : 0,
			max : 100,
			value : DEFAULT_LINEHEIGHT["forSet"],
			slide : function(event, ui)
			{
				var lh = Math.ceil(ui.value / 10);
				var lh = 1 + lh / 4;
				jQuery("#izng-lineheight-value").val(lh + "em");
				jQuery("#izng-article").css("line-height", lh + "em");
				//jQuery.cookie("user_font_size", lh);
			}
		});
		jQuery("#izng-article").css("line-height", DEFAULT_LINEHEIGHT["forDisp"]);
		jQuery("#izng-lineheight-value").val(DEFAULT_LINEHEIGHT["forDisp"]);
	},
	width : function()
	{
		var dw = [];
		var iw = window.innerWidth || document.body.clientWidth;
		if(arguments.length > 0) {
			dw["forSet"] = arguments[0] - DEFAULT_WIDTH["visible"]
			dw["forDisp"] = arguments[0];
		} else {
			dw["forSet"] = (iw < DEFAULT_WIDTH["full"]) ? iw - DEFAULT_WIDTH["full"] : DEFAULT_WIDTH["forSet"];
			dw["forDisp"] = dw["forSet"] + DEFAULT_WIDTH["visible"];
		}
		if(dw < -DEFAULT_WIDTH["canchange"])
			dw = -DEFAULT_WIDTH["canchange"];
		jQuery("#izng-width").slider({
			orientation : "horizontal",
			range : "min",
			min : -DEFAULT_WIDTH["canchange"],
			max : iw - DEFAULT_WIDTH["visible"],
			value : dw["forSet"],
			slide : function(event, ui)
			{
				var w = DEFAULT_WIDTH["visible"] + ui.value;
				jQuery("#izng-width-value").val(w + "px");
				jQuery("#izng-main").css("width", w + "px");
				//jQuery.cookie("user_font_size", lh);
			}
		});
		jQuery("#izng-width-value").val(dw["forDisp"] + "px");
		jQuery("#izng-main").css("width", dw["forDisp"] + "px");//.css("height", "auto");
	},
	screen : function(type)
	{
		jQuery("#izng-screen > label").removeClass("radioSelected");
		jQuery("#izng-" + type).addClass("radioSelected");
		var transitTypes = ["full", "fit", "narrow", "defaultFit"];
		var _type;
		var iw = window.innerWidth || document.body.clientWidth;

		jQuery.each(transitTypes, function()
		{
			if(this == type)
				_type = this;
		})
		if(_type) {
			var w;
			if(_type == "full") {
				w = iw;
			} else if(_type == "fit") {
				w = iw;//- DEFAULT_WIDTH["taskbar"];
			} else if(_type == "narrow") {
				w = DEFAULT_WIDTH["visible"] - DEFAULT_WIDTH["canchange"];
			} else if(_type == "defaultFit") {
				w = DEFAULT_WIDTH["visible"];
			} else {
				w = 0;
			}
			this.width(w);			
		} else {
			return false;
		}

	},
	bg : function(im)
	{
		var bgs = ["novel", "kami1", "kami2", "kami3", "kami4"];
		for(var i = 0; i < bgs.length; i++) {
			$("#izng-article").removeClass(bgs[i]);
		}
		$("#izng-article").addClass(im)
	}
};

var Binder = {
	init : function()
	{
		/* bind event */
		jQuery("#izng-main").css({			
		})
		$(window).bind("resize", function()
		{			
			var h = window.innerHeight;
			jQuery("#izng-main").css({
			});
		});
		//jQuery("#izng-main").resizable({
			//constraint : "#izng-wrapper",
			//ghost : true,
			//minWidth : 544,
			//nstop : function(event, ui)
			//{
				//Izng.Drawer.width(ui.size.width);
			//}
		//});		
	}
}

var Util = {

	hexArray : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "a", "b", "c", "d", "e", "f"],
	decArray : {
		1 : 1,
		2 : 2,
		3 : 3,
		4 : 4,
		5 : 5,
		6 : 6,
		7 : 7,
		8 : 8,
		9 : 9,
		"a" : 10,
		"b" : 11,
		"c" : 12,
		"d" : 13,
		"e" : 14,
		"f" : 15,
	},
	decToHex : function(dec)
	{
		var a = dec, b = 16;
		var q = dec % 16, p = (a - q) / b;
		p = this.hexArray[p].toString();
		q = this.hexArray[q].toString();
		return p + q;
	},
	rgbToHex : function(r, g, b)
	{
		var _r = this.decToHex(r), _g = this.decToHex(g), _b = this.decToHex(b);
		var hex = "#" + _r.toString() + _g.toString() + _b.toString();
		return hex;
	},
	hexToDec : function(hex)
	{
		if(hex.toString().length > 2)
			return false;
		var p = hex.charAt(0);
		q = hex.charAt(1);
		return this.decArray[p] * 16 + this.decArray[q];
	},
	hexToRgb : function(hex)
	{
		var rgb = hex.replace("#", "");
		if(rgb.length < 6)
			rbg = rbg + rgb;
		var r = rgb.slice(0, 1), g = rgb.slice(2, 3), b = rgb.slice(4, 5);
		r = hexToDec(r);
		g = hexToDec(g);
		b = hexToDec(b);
		return (r, g, b);
	},
	loadIn : function()
	{
		jQuery("#izng-load-layer").show();
	},
	loadOut : function()
	{
		jQuery("#izng-load-layer").hide();
	},
	imageSize : function(image)
	{
		var w = image.width, h = image.height;

		if( typeof image.naturalWidth !== 'undefined') {// for Firefox, Safari, Chrome
			w = image.naturalWidth;
			h = image.naturalHeight;

		} else if( typeof image.runtimeStyle !== 'undefined') {// for IE
			var run = image.runtimeStyle;
			var mem = {
				w : run.width,
				h : run.height
			};
			// keep runtimeStyle
			run.width = "auto";
			run.height = "auto";
			w = image.width;
			h = image.height;
			run.width = mem.w;
			run.height = mem.h;

		} else {// for Opera
			var mem = {
				w : image.width,
				h : image.height
			};
			// keep original style
			image.removeAttribute("width");
			image.removeAttribute("height");
			w = image.width;
			h = image.height;
			image.width = mem.w;
			image.height = mem.h;
		}

		return {
			width : w,
			height : h
		};
	},
	create : function(element, options, innerHTML)
	{
		var _element = document.createElement(element);
		for(key in options) {
			jQuery(_element).attr(key, options[key]);
		}
		_element.innerHTML = innerHTML || "";
		return _element;
	}
}

var Ajax = {
	init : function()
	{
		jQuery(window).hashchange(function()
		{
			//URLに変化があれば、変化後のハッシュを含むURLから#!を削除 => 普通のアドレスへ
			var setHash = location.href;
			setHash = setHash.replace('#!/', '');
			if(!setHash) {
				setHash = "#!/";
			}
			//デバッガ => setHashの値をecho
			setHash = setHash.replace(/izanagi\.html/, "");
			//Debugger.log("Hash val => " + setHash);
			//対象のアドレスからhtmlをajaxロード
			Ajax.loadText(setHash);
		});
		//Ajax.setAnchor("#izng-toclist a");
		//location.hash = "#!/data/1.html";
	},
	setAnchor : function(a)
	{
		jQuery(a).each(function()
		{
			var setHref = jQuery(this).attr("href").replace("./", "#!/");
			jQuery(this).attr({
				href : setHref
			});
		});
	},
	loadText : function(url)
	{
		//Debugger.log("Request", {
		//"url" : url,
		//});
		Util.loadIn();
		var w = jQuery("#izng-article").css("width");
		jQuery("#izng-article").animate({
			display : "none"
		}, {
			duration : "slow",
			easing : "easeInQuint",
			complete : function()
			{
				jQuery.ajax({
					beforeSend : function()
					{
						jQuery("#izng-article").empty();
					},
					type : "GET",
					datatype : "html",
					url : url,
					success : function(data, datatype)
					{
						jQuery("#izng-article").append(data);
					},
					complete : function()
					{
						jQuery("#izng-article").animate({
							display : "block"
						}, {
							duration : "slow",
							easing : "easeInQuint"
						});
						Util.loadOut();
					},
					error : function(XMLHttpRequest, textStatus, errorThrown)
					{
						jQuery("#izng-article").html("error").slideDown();
						Util.loadOut();
						//Debugger.log("Status", {
						//"textStatus" : textStatus
						//});
					}
				});
			}
		})
	},
	parseArticle : function(data, datatype, src)
	{
		var _src = ["narou"];
		var f = true;

		for(var i = 0; i < _src.length; i++) {
			if(src == _src[i])
				f = true;
		}

		if(f) {
			if(src == "narou") {
				//book["info"] = $(data).find(".novel_bar").html();
				var header = "<h2>" + $(date).find(".novel_subtitle").html() + "</h2>";
				var contents = $(data).find("#novel_view").html().split("<br>");
				var append = header;
				//remoeve <br> tags and instead wrap lines with <p> tags.
				for(var i = 0; i < content.length; i++) {
					content[i] = "<p>" + book["body"][i] + "</p>";
					append += book["body"][i];
				}
			}
			return append;
		}
	},
	hashChange : function(hash)
	{
		$("#izng-toc-list label").removeClass("tocSelected");
		var _dec = hash.match(/[0-9]/);
		$("#izng-toc-" + _dec).addClass("tocSelected");
		var _hash = "#!" + hash;
		location.hash = _hash;
	}
};

/*
 * namespaces
 */
Izng.Debugger = Debugger;
Izng.Drawer = Drawer;
Izng.Binder = Binder;
Izng.Util = Util;
Izng.Ajax = Ajax;
