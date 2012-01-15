/*
 * Html document reader for "scrivel"
 * developed by @keroxp / Kaeru Yana / Yusuke Sakurai
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
	this.BrowserDetect.init();
	this.Env.init();
	this.Drawer.init();
	this.Taskbar.init();
	//this.Manga.init();
	//this.Ajax.init();
}

Izng.Debuger = {
	init : function()
	{
		BrowserDetect.dispStatus();
		Env.window.dispAllInfo();
		jQuery("body").append("<div id='notice'></div>")
	}
}
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

/*
 * browser detect
 */

var BrowserDetect = {
	init : function()
	{
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
	},
	searchString : function(data)
	{
		for(var i = 0; i < data.length; i++) {
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if(dataString) {
				if(dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			} else if(dataProp)
				return data[i].identity;
		}
	},
	searchVersion : function(dataString)
	{
		var index = dataString.indexOf(this.versionSearchString);
		if(index == -1)
			return;
		return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
	},
	dispStatus : function()
	{
		var to = "#notice";
		if(arguments.length > 0)
			to = arguments[0];
		var contents = ["Browser : " + this.browser, "Version : " + this.version, "OS : " + this.OS];
		jQuery.each(contents, function()
		{
			jQuery(to).append(this + "<br>");
		})
	},
	dataBrowser : [{
		string : navigator.userAgent,
		subString : "Chrome",
		identity : "Chrome"
	}, {
		string : navigator.userAgent,
		subString : "OmniWeb",
		versionSearch : "OmniWeb/",
		identity : "OmniWeb"
	}, {
		string : navigator.vendor,
		subString : "Apple",
		identity : "Safari",
		versionSearch : "Version"
	}, {
		prop : window.opera,
		identity : "Opera"
	}, {
		string : navigator.vendor,
		subString : "iCab",
		identity : "iCab"
	}, {
		string : navigator.vendor,
		subString : "KDE",
		identity : "Konqueror"
	}, {
		string : navigator.userAgent,
		subString : "Firefox",
		identity : "Firefox"
	}, {
		string : navigator.vendor,
		subString : "Camino",
		identity : "Camino"
	}, {// for newer Netscapes (6+)
		string : navigator.userAgent,
		subString : "Netscape",
		identity : "Netscape"
	}, {
		string : navigator.userAgent,
		subString : "MSIE",
		identity : "Explorer",
		versionSearch : "MSIE"
	}, {
		string : navigator.userAgent,
		subString : "Gecko",
		identity : "Mozilla",
		versionSearch : "rv"
	}, {// for older Netscapes (4-)
		string : navigator.userAgent,
		subString : "Mozilla",
		identity : "Netscape",
		versionSearch : "Mozilla"
	}],
	dataOS : [{
		string : navigator.platform,
		subString : "Win",
		identity : "Windows"
	}, {
		string : navigator.platform,
		subString : "Mac",
		identity : "Mac"
	}, {
		string : navigator.userAgent,
		subString : "iPhone",
		identity : "iPhone/iPod"
	}, {
		string : navigator.platform,
		subString : "Linux",
		identity : "Linux"
	}]
};

/*
 * client interface environment
 */

var Env = {
	init : function()
	{
		var browser = BrowserDetect.browser.toLowerCase();
		var version = BrowserDetect.version;
		var os = BrowserDetect.OS;

		this.isIE = (browser == "explorer");
		this.isWin = (os == "Windows");
		this.isMac = (os == "Mac");
		this.isIPhone = (navigator.platform == "iPhone");
		this.isIPad = (navigator.platform == "iPad");
		this.isIPod = (navigator.platform == "iPod");
		this.isMobileSafari = this.isIPhone || this.isIPad || this.isIPod;

		// check if browser can support transform method
		if(browser == "chrome") {
			this.canTransform = true;
		} else if(browser == "safari") {
			this.canTransform = true;
		} else if(browser == "firefox" && version >= 3.5) {
			this.canTransform = true;
		} else if(browser == "opera") {
			this.canTransform = true;
		} else if(this.isIE && version >= 6.0) {
			this.canTransform = true;
		} else {
			this.canTransform = false;
		}
	},
	window : {
		dispAllInfo : function()
		{
			var to = "#notice";
			if(arguments.length > 0)
				to = arguments[0];
			var _innerWidth = this.innerWidth();
			var _innerHeight = this.innerHeight();
			var contents = ["name : " + this.name, "innerWidth : " + _innerWidth, "innerHeigth : " + _innerHeight, "outerHeight : " + this.outerHeight, "outerHeight : " + this.outerHeight, "pageXOffset : " + this.pageXOffset, "pageYOffset" + this.pageYOffset]
			jQuery.each(contents, function()
			{
				jQuery(to).append(this + "<br>");
			})
		},
		name : window.name,
		innerWidth : function()
		{
			return (this.isIE) ? document.body.clientWidth : window.innerWidth;
		},
		innerHeight : function()
		{
			return (this.isIE) ? document.body.clientHeight : window.innerHeight;
		},
		outerHeight : window.outerHeight,
		outerWidth : window.outerWidth,
		pageXOffset : window.pageXOffset,
		pageYOffset : window.pageYOffset
	}
};

/*
 * Drawer
 */

var Drawer = {
	init : function()
	{

	},
	toggle : function(rel)
	{
		var _rel = "#" + rel;
		if(jQuery(_rel).hasClass("hidden")) {
			jQuery(_rel).slideDown().removeClass("hidden");
		} else {
			jQuery(_rel).slideUp().addClass("hidden");
		}
	},
	slide : function(dir)
	{
		var speed = 500;
		var distance;
		if(dir == "L") {
			distance = "+=280px";
		} else if(dir == "R") {
			distance = "-=280px";
		}
		jQuery("#slidepanel").animate({
			marginLeft : distance
		}, speed);
	}
}
/*
 * Task bar
 */

var Taskbar = {
	init : function()
	{
		jQuery("#article").removeAttr("style");
		jQuery("#article").removeAttr("style").removeClass();
		jQuery(".slider").removeClass();
		this.fontface(DEFAULT_FONT["forSet"]);
		this.fontsize();
		this.fontcolor();
		this.lineheight();
		this.width();
		this.bg("kami1");
	},
	setDefaultValue : function()
	{

	},
	fontface : function(target)
	{
		var disp = FONT_LIST[target];
		var fonts = ["mincho", "gothic", "bold", "normal"];
		var fc = target.split("-");
		target = "#" + target;
		for(var i = 0; i < fonts.length; i++) {
			jQuery("#article").removeClass(fonts[i]);
		}
		jQuery("#fontface").children().removeClass("radioSelected");
		jQuery(target).addClass("radioSelected");
		jQuery("#article").addClass(fc[0]);
		if(fc.length > 1)
			jQuery("#article").addClass(fc[1]);
		jQuery("#fontface-value").val(disp);

	},
	fontcolor : function()
	{
		jQuery("#fontcolor").slider({
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
				jQuery("#fontcolor-value").val(hexColor);
				jQuery("#article").css("color", hexColor);
				//jQuery.cookie("user_color", color);
			}
		});
		jQuery("#article").css("color", DEFAULT_COLOR["forDisp"]);
		jQuery("#fontcolor-value").val(DEFAULT_COLOR["forDisp"]);
	},
	fontsize : function()
	{
		jQuery("#fontsize").slider({
			orientation : "horizontal",
			range : "min",
			min : 00,
			max : 100,
			value : DEFAULT_SIZE["forSet"],
			slide : function(event, ui)
			{
				var size = 10 + Math.ceil(ui.value / 10);
				jQuery("#fontsize-value").val(size + "px");
				jQuery("#article").css("font-size", size + "px");
				//jQuery.cookie("user_font_size", size);
			}
		});
		jQuery("#article").css("font-size", DEFAULT_SIZE["forDisp"]);
		jQuery("#fontsize-value").val(DEFAULT_SIZE["forDisp"]);
	},
	lineheight : function()
	{
		jQuery("#lineheight").slider({
			orientation : "horizontal",
			range : "min",
			min : 0,
			max : 100,
			value : DEFAULT_LINEHEIGHT["forSet"],
			slide : function(event, ui)
			{
				var lh = Math.ceil(ui.value / 10);
				var lh = 1 + lh / 4;
				jQuery("#lineheight-value").val(lh + "em");
				jQuery("#article").css("line-height", lh + "em");
				//jQuery.cookie("user_font_size", lh);
			}
		});
		jQuery("#article").css("line-height", DEFAULT_LINEHEIGHT["forDisp"]);
		jQuery("#lineheight-value").val(DEFAULT_LINEHEIGHT["forDisp"]);
	},
	width : function()
	{
		jQuery("#article").removeAttr("style");
		var dw = [];
		if(arguments.length > 0) {
			dw["forDisp"] = arguments[0];
			dw["forSet"] = arguments[0] - DEFAULT_WIDTH["visible"] ;
		} else {
			dw["forSet"] = (Env.window.innerWidth() < DEFAULT_WIDTH["full"]) ? Env.window.innerWidth() - DEFAULT_WIDTH["full"] : DEFAULT_WIDTH["forSet"];
			dw["forDisp"] = dw["forSet"] + DEFAULT_WIDTH["visible"];
		}

		if(dw < -DEFAULT_WIDTH["canchange"]) 
			dw = -DEFAULT_WIDTH["canchange"];
		jQuery("#width").slider({
			orientation : "horizontal",
			range : "min",
			min : -DEFAULT_WIDTH["canchange"],
			max : Env.window.innerWidth() - DEFAULT_WIDTH["visible"],
			value : dw["forSet"],
			slide : function(event, ui)
			{
				var w = DEFAULT_WIDTH["visible"] + ui.value;
				jQuery("#width-value").val(w + "px");
				jQuery("#article").css("width", w - DEFAULT_WIDTH["padOffset"] + "px");
				//jQuery.cookie("user_font_size", lh);
			}
		});
		jQuery("#width-value").val(dw["forDisp"] + "px");
		jQuery("#article").css("width", dw["forDisp"]  - DEFAULT_WIDTH["padOffset"] + "px");
	},
	screen : function(type)
	{
		jQuery("#screen > label").removeClass("radioSelected");
		jQuery("#" + type).addClass("radioSelected");
		var transitTypes = ["full", "fit", "narrow", "defaultFit"];
		var _type;
		jQuery.each(transitTypes, function()
		{
			if(this == type)
				_type = this;
		})
		if(_type) {
			var w;
			if(_type == "full") {
				w = Env.window.innerWidth();
			} else if(_type == "fit") {
				w = Env.window.innerWidth() - DEFAULT_WIDTH["taskbar"];
			} else if(_type == "narrow") {
				w = DEFAULT_WIDTH["visible"] - DEFAULT_WIDTH["canchange"];
			} else if(_type == "defaultFit") {
				w = DEFAULT_WIDTH["visible"];
			} else {
				w = 0;
			}
			this.width(w);
			if(type == "full") {
				window.scroll(DEFAULT_WIDTH["taskbar"], 0);
				//var remover =　"<button class='button fullscreenRemover gBlue' onclick='Izng.Taskbar.width();jQuery(this).remove()'>フルスクリーンモードを終了</button>"
				//$("#wrapper").append(remover);
			}
		} else {
			return false;
		}

	},
	bg : function(im)
	{
		var bgs = ["novel", "kami1", "kami2", "kami3", "kami4"];
		for(var i = 0; i < bgs.length; i++) {
			$("#article").removeClass(bgs[i]);
		}
		$("#article").addClass(im)
	}
};

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
	notice : function()
	{
		var target = arguments[0];
		var to = "#notice";
		if(arguments.length > 1)
			to = arguments[1];
		jQuery(to).append(target);
	},
	loadIn : function(hash)
	{
		var _hash = hash
		if(arguments.length > 0)
			_hash = arguments[0];
		if(jQuery(_hash).css("display") == "none")
			jQuery("#load-layer").show();
	},
	loadOut : function(hash)
	{
		var _hash = hash
		if(arguments.length > 0)
			_hash = arguments[0];
		if(jQuery(_hash).css("display") != "none")
			jQuery("#load-layer").hide();
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
	}
}

var Ajax = {
	init : function()
	{
		/*
		 jQuery(window).hashchange(function()
		 {
		 //URLに変化があれば、変化後のハッシュを含むURLから#!を削除 => 普通のアドレスへ
		 var setHash = location.hash.replace('#!/', '');
		 if(!setHash) {
		 setHash = "#!/";
		 }
		 //デバッガ => setHashの値をecho
		 setHash = setHash.replace(/\/r.*?html/, "");
		 setHash = "file://localhost/Users/keroxp/github/izanagi.js/data/1.html";
		 $("#notice").append("hash : " + setHash + "<br>");
		 //対象のアドレスからhtmlをajaxロード
		 Ajax.loadText(setHash);
		 });
		 Ajax.setAnchor("#toclist a");
		 location.hash = "#!/data/1.html";
		 */
	},
	setAnchor : function(a)
	{
		jQuery(a).each(function()
		{
			$("#notice").append("setAnchor<br>")
			var setHref = jQuery(this).attr("href").replace("./", "#!/");
			jQuery(this).attr({
				href : setHref
			});
		});
	},
	loadText : function(url, src)
	{
		Util.loadIn("#load-layer");
		jQuery("#article").fadeOut().empty();
		setTimeout(function()
		{
			jQuery.ajax({
				beforeSend : function()
				{

				},
				type : "GET",
				datatype : "text/html",
				url : url,
				success : function(data, datatype)
				{
					jQuery("#article").append(parseArticle(data, datatype, src));
					jQuery("#article").fadeIn();
				},
				complete : function()
				{
					Util.loadOut("#load-layer");
				},
				error : function()
				{
					jQuery("#article").hide();
					jQuery("#article").html("error");
					jQuery("#article").fadeIn();
					Util.loadOut("#load-layer");
				}
			});
		}, 300);
	},
	parseArticle : function(data, datatype, src)
	{
		var _src = ["narou"];
		var f = true;
/*
		for(var i = 0; i < _src.length; i++) {
			if(src == _src[i])
				f = true;
		}
*/
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
		$("#toclist label").removeClass("tocSelected");
		var _dec = hash.match(/[0-9]/);
		$("#toc" + _dec).addClass("tocSelected");
		var _hash = "#!" + hash;
		location.hash = _hash;
	}
};

/*
 * namespaces
 */
Izng.BrowserDetect = BrowserDetect;
Izng.Env = Env;
Izng.Drawer = Drawer;
Izng.Taskbar = Taskbar;
Izng.Util = Util;
Izng.Ajax = Ajax;
