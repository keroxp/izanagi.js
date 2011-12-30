jQuery(function(jQuery) {
	jQuery(window).hashchange(function() {
		//ハッシュをセット。その際保持しているハッシュを破棄
		var setHash = location.hash.replace('#!\/', '');

		if(!setHash) {
			setHash = "#!/";
		}
		//window.alert(setHash.indexOf('#wpcf7-f1-t1-o1'));
		if(setHash) {
			//document.title = 1;
			//コンテナーをクリーニング
			jQuery("#main div").fadeOut();
			jQuery("#main").addClass("loading");
			setTimeout(function() {
				jQuery("#book-body").empty()
				jQuery("#main").load(setHash + " #book-body", function(text, status) {
					if(status == 'error') {
						jQuery("#main").removeClass("loading");
						jQuery("#main").html('<div id="p404" style="display:none;"></div>');
						jQuery("#main div").fadeIn();
					} else {
						jQuery("#main div").hide();
						parseAnchor("#taskhead a");
						setTimeout(function() {
							jQuery("#main div").fadeIn();
							jQuery("#main").removeClass("loading");
						}, 700);
					}
				});
			}, 500);
		}
	});
	parseAnchor("#sub a");
	jQuery(window).hashchange();

	jQuery("#sub a").click(function() {
		var _this = jQuery(this);
		jQuery("#nav a").removeClass();
		jQuery(_this).addClass("selected");
	})
});

function parseAnchor(t){
	jQuery(t).each(function() {
		var setHref = jQuery(this).attr("href").replace("file:///Users/user/Documents/プロジェクト/scrivel-reader-v2", "#!");
		jQuery(this).attr({
			href : setHref
		});
	});	
}
