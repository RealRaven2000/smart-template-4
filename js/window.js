"use strict"; // use ECMAScript5 strict mode

// call <a href="http://" title="mouseoverTitle" onclick="openURL(this.href,'WindowTitle','width','height');return false;">Linkname</a>

	function openURL(url, title, width, height) {

		var winLeft = (screen.availWidth / 2) - (width / 2);
		var winTop = (screen.availHeight / 2) - (height / 2);
/*
		while (title.search(/ /) != -1) {
			title = title.replace(/ /,"_");
		}
*/
		if (url == null) {
			url = 'about:blank';
		} 
		if (title == null) {
			title = location.href;
			var endpos = title.lastIndexOf("\\");
			if (endpos > 0) {
				title = title.substring(0, endpos - 1);
			}
			var slashpos = title.lastIndexOf("/");
			if (slashpos < 0) {
				title = 'No Title';
			}
			else {
				title = title.substring(slashpos + 1,title.length);
				endpos = title.indexOf(".");
				if (endpos >= 0) {
					title = title.substring(0,endpos - 1);
				}
			}
		}
		if (width == null){
			width = '700';
		}
		if (height == null){
			height = '700';
		}
		var baseLocation = location.href; // baseLocation results http://smarttemplate4.mozdev.org/
		var lastIndexOfLocation  = location.href.lastIndexOf("\\");
		if(lastIndexOfLocation >= 0) {
			baseLocation = baseLocation.substring(0, lastIndexOfLocation + 1);
		}
		else {
			lastIndexOfLocation = location.href.lastIndexOf("/");
			if(lastIndexOfLocation >= 0) {
				baseLocation = baseLocation.substring(0, lastIndexOfLocation + 1);
			}
		}
		var myWin = window.open(url, "myWindow", "width=" + width +
		                        ",height=" + height +
		                        ",top=" + winTop +
		                        ",left=" + winLeft +
		                        ",directories=0, titlebar=0, toolbar=0, location=0, status=0, menubar=0, dependent=yes, scrollbars=yes, resizable=no");
		myWin.document.open();
		myWin.document.writeln('<!DOCTYPE html>');
		myWin.document.writeln(' <head>');
		myWin.document.writeln('  <title>' + title + '<\/title>');
		myWin.document.writeln('  <meta http-equiv=\"content-type" content="text/html; charset=UTF-8\">');
		myWin.document.writeln('  <link rel=\"shortcut icon\" type=\"image/x-icon\" href=\"'+ baseLocation +'/img/favicon.ico\">');
		myWin.document.writeln('  <link rel=\"stylesheet\" type=\"text/css\" media=\"screen\" href=\"'+ baseLocation +'/css/window.css\">');
		myWin.document.writeln(' <\/head>');
		myWin.document.writeln(' <body>');
		myWin.document.writeln('  <div class=\"content\">');
		myWin.document.writeln('   <iframe id=\"myFrame\"');
		myWin.document.writeln('           src=\"'+ url +'\"');
		myWin.document.writeln('           width=\"0\"');
		myWin.document.writeln('           height=\"0\">');
		myWin.document.writeln('    <p id=\"noiframes\">');
		myWin.document.writeln('      Your browser does not support iframes, please <a href=\"'+ url +'\"');
		myWin.document.writeln('                                                       title=\"'+ title +'\"');
		myWin.document.writeln('                                                       target=\"_blank\">click here!<\/a>');
		myWin.document.writeln('    <\/p>');
		myWin.document.writeln('   <\/iframe>');
		myWin.document.writeln('  <\/div>');
		myWin.document.writeln('  <div class=\"buttonbar\">');
		myWin.document.writeln('   <div id=\"closeButton\">');
		myWin.document.writeln('    <a href=\"javascript:self.close();\"');
		myWin.document.writeln('       title=\"Close Window\">Close<\/a>');
		myWin.document.writeln('   <\/div>');
		myWin.document.writeln('  <\/div>');
		myWin.document.writeln(' <\/body>');
		myWin.document.writeln('<\/html>');
		myWin.document.close();
		if (window.self) {
			myWin.focus();
			if (window.opener == null) {
				window.opener = self;
			}
		}
		if (parseInt(navigator.appVersion) >= 4) {
			myWin.window.focus();
		}
	}