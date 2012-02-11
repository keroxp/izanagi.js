
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
	allStatus : function()
	{
		var contents = {
			"OS" : this.OS,
			"Browser" : this.browser,
			"Version" : this.version
		};
		return contents;
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
	}
};

Izng.BrowserDetect = BrowserDetect;
Izng.Env = Env;
