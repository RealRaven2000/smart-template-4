/*******************************************************************
*                      File: environment.js                        *
*                                                                  *
*                  by Axel Grude & Marky Mark DE                   *
*                         Version 04/2014                          *
*                                                                  *
*                   Date: Tue 22/04/2014 01:64                     *
*                                                                  *
*******************************************************************/

"use strict"; // use ECMAScript5 strict mode

/******************************************************************/
/*************** Detect User Agents / Versions ********************/
/******************************************************************/

// see: http://www.quirksmode.org/js/detect.html

var Environment = {
    init: function () {
        this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
        this.version = this.searchVersion(navigator.userAgent)
            || this.searchVersion(navigator.appVersion)
            || "an unknown version";
        this.OS = this.searchString(this.dataOS) || "an unknown OS";
    },
    // see https://developer.mozilla.org/en-US/docs/Browser_detection_using_the_user_agent#Mobile.2C_Tablet_or_Desktop
    // call e.g. Environment.isMobile(any);
		isMobile : { 
				Android: function() { return navigator.userAgent.match(/Android/i); }, 
				BlackBerry: function() { return navigator.userAgent.match(/BlackBerry/i); }, 
				iOS: function() { return navigator.userAgent.match(/iPhone|iPad|iPod/i); }, 
				Opera: function() { return navigator.userAgent.match(/Opera Mini/i); }, 
				Windows: function() { return navigator.userAgent.match(/IEMobile/i); }, 
				mobile: function() { return navigator.userAgent.match(/Mobile/i); }, 
				test: function() { return true; },
				test2: function() { return this.test(); },
				any: function() { return (this.Android() || this.BlackBerry() || this.iOS() || this.Opera() || this.Windows() || this.mobile()); } 
		},
    searchString: function (data) {
        for (var i=0;i<data.length;i++) {
            var dataString = data[i].string;
            var dataProp = data[i].prop;
            this.versionSearchString = data[i].versionSearch || data[i].identity;
            if (dataString) {
                if (dataString.indexOf(data[i].subString) != -1)
                    return data[i].identity;
            }
            else if (dataProp)
                return data[i].identity;
        }
    },
    searchVersion: function (dataString) {
        var index = dataString.indexOf(this.versionSearchString);
        if (index == -1) return;
        return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
    },
    dataBrowser: [
        { string: navigator.userAgent, subString: "Chrome", identity: "Chrome" },
        { string: navigator.userAgent, subString: "OmniWeb", versionSearch: "OmniWeb/", identity: "OmniWeb"},
        { string: navigator.vendor, subString: "Apple", identity: "Safari", versionSearch: "Version" },
        { prop: window.opera, identity: "Opera", versionSearch: "Version" },
        { string: navigator.vendor, subString: "iCab", identity: "iCab" },
        { string: navigator.vendor, subString: "KDE", identity: "Konqueror" },
        { string: navigator.userAgent, subString: "Firefox", identity: "Firefox" },
        { string: navigator.vendor, subString: "Camino", identity: "Camino" },
        { string: navigator.userAgent, subString: "Netscape", identity: "Netscape" },// for newer Netscapes (6+)
        { string: navigator.userAgent, subString: "MSIE", identity: "Internet Explorer", versionSearch: "MSIE" }, // < IE 11
		{ string: navigator.userAgent, subString: "Trident", identity: "Internet Explorer", versionSearch: "Trident" }, // > IE 11
        { string: navigator.userAgent, subString: "Gecko", identity: "Mozilla", versionSearch: "rv" },
        { string: navigator.userAgent, subString: "Mozilla", identity: "Netscape", versionSearch: "Mozilla" } // for older Netscapes (4-)
    ],
    printInBrowser: function(whichOne, showWhat)  {
    // conditional document output depending on browser.
     if (this.browser.identity == whichOne) {
      document.write(showWhat);
     }
    },
    dataOS : [
        { string: navigator.platform, subString: "Win", identity: "Windows" },
        { string: navigator.platform, subString: "Mac", identity: "Mac" },
        { string: navigator.userAgent, subString: "iPhone", identity: "iPhone/iPod" },
        { string: navigator.platform, subString: "Linux", identity: "Linux" }
    ]
};
Environment.init();