/*******************************************************************
*                        File: scripts.js                          *
*                                                                  *
*                  by Axel Grude & Marky Mark DE                   *
*                         Version 04/2014                          *
*                                                                  *
*                   Date: Tue 22/04/2014 02:07                     *
*                                                                  *
*******************************************************************/

"use strict"; // use ECMAScript5 strict mode

/******************************************************************/
/******************** Date / Time constructor *********************/
/******************************************************************/

var now = new Date();
var day = now.getDate();
var dayPre0 = (day < 10) ? '0' : ''; // If Day <10 then add leading zero
var month = now.getMonth() + 1; // Month default digit 0=January +1 to the result set digit 1 to January
var monthPre0 = (month < 10) ? '0' : ''; // If Month <10 then add leading zero
var yearNow = now.getFullYear(); // Year default 4-digits
var hours = now.getHours(); // Hours default without leading zero
var hoursPre0 = (hours < 10) ? '0' : ''; // If Hour <10 then add leading zero
var minutes = now.getMinutes(); // Minutes default without leading zero
var minutesPre0 = (minutes < 10) ? '0' : ''; // If Minutes <10 then add leading zero
var seconds = now.getSeconds(); // Seconds default without leading zero
var secondsPre0 = (seconds < 10) ? '0' : ''; // If Seconds <10 then add leading zero

/******************************************************************/
/***************** Weekday and Month constructor ******************/
/******************************************************************/

var weekdayNameShort = new Array('Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'); // weekdayNameShort[now.getDay()]
var weekdayNameLong = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'); // weekdayNameLong[now.getDay()]
var monthNameShort = new Array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'); // monthNameShort[now.getMonth()]
var monthNameLong = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'); // monthNameLong[now.getMonth()]

/******************************************************************/
/********************** Own Date constructor **********************/
/******************************************************************/

var dateUK_normal = dayPre0 + day + '\/' + monthPre0 + month + '\/' + yearNow; // dd/mm/yyyy
var dateUK_MonthNameLong = dayPre0 + day + '\/' + monthNameLong[now.getMonth()] + '\/' + yearNow; // dd/monthNameLong/yyyy
var dateUK_WeekdayNameLong = weekdayNameLong[now.getDay()] + ', ' + dayPre0 + day + '\/' + monthPre0 + month + '\/' + yearNow; // weekdayNameLong, dd/mm/yyyy

/******************************************************************/
/*********************** Phrase constructor ***********************/
/******************************************************************/

// vanilla's
var vanillaWelcome = 'Welcome to the SmartTemplates Project'; // basic greeting phrase without "!" on end
var vanillaThanks = 'Thanks for updating SmartTemplates'; // basic thanks phrase without "!" on end
// additional for seasons
var halloween = ' and a Spooky Halloween everyone!'; // additional halloween phrase
var christmas = ' and a Merry Christmas everyone!'; // additional christmas phrase
var newYearsEve = ' and a Happy '+ yearNow +' everyone!'; // additional happy new year phrase
// tooltip
var tooltipDonation = 'If this page displays within Thunderbird: right-click and choose <i>Open in Browser<\/i>!'; // tooltip on Donation Buttons

/******************************************************************/
/***************** Subfunctions in html_body.html *****************/
/******************************************************************/

function welcomeHTMLBody() {
  if (month == 10 && day == 31) // valid at 31/10 only
    document.write(vanillaWelcome + halloween);
  else if (month == 12 && day > 23 && day < 27) // valid from 24/12 - 26/12
    document.write(vanillaWelcome + christmas);
  else if (month == 1 && day == 1) // valid at 01/01 only
    document.write(vanillaWelcome + newYearsEve);
  else document.write(vanillaWelcome + '!'); // default phrase with additional "!" on end
}

function seasonImgHTMLBody() {
  if (month == 10 && day == 31) // valid at 31/10 only
    document.write('<span class="halloween"><img src="/img/season/vampbat.gif" alt="vampbat"><\/span>');
  else if (month == 12 && day > 23 && day < 27) // valid from 24/12 - 26/12
    document.write('<span class="christmas"><img src="/img/season/santa.gif" alt="santa"><\/span>');  
  else if (month == 1 && day == 1) // valid at 01/01 only
    document.write('<span class="newYear1"><img src="/img/season/firework.gif" alt="firework"><\/span><span class="newYear2"><img src="/img/season/firework2.gif" alt="firework2"><\/span>');
}

function dateHTMLBody() {
  document.write(dateUK_WeekdayNameLong);
}
 
/******************************************************************/
/******************* Subfunctions in index.html *******************/
/******************************************************************/

function whatsNewHeadline() {
    document.write('What&#39;s New (' + monthNameLong[now.getMonth()] + ' ' + yearNow + ')');
}

/******************************************************************/
/***************** Subfunctions in contribute.html ****************/
/******************************************************************/

function tooltipEuroButton() { // validator trick; input tag not allowed in a tag
  document.write('<a href="#" class="tooltip">');
  document.write('<input type="image" name="submit" src="/img/btn_donate_LG.gif" alt="PayPal - The safer, easier way to pay online!" id="euroButton">');
  document.write('<span> <img class="callout" src="/img/callout_black.gif" alt="callout bkg">'+ tooltipDonation +'<\/span>');
  document.write('<\/a>');
}

function tooltipDollarButton() { // validator trick; input tag not allowed in a tag
  document.write('<a href="#" class="tooltip">');
  document.write('<input type="image" name="submit" src="/img/donatemini-100.png" alt="PayPal - The safer, easier way to pay online!" id="paypalButton">');
  document.write('<span> <img class="callout" src="/img/callout_black.gif" alt="callout bkg">'+ tooltipDonation +'<\/span>');
  document.write('<\/a>');
}

function thanksForUpdate() {
  if (month == 10 && day == 31) // valid at 31/10 only
    document.write(vanillaThanks + halloween);
  else if (month == 12 && day > 23 && day < 27) // valid from 24/12 - 26/12
    document.write(vanillaThanks + ' and a Merry and <a href=\"#freesoftware\" title="The Free Software model"><em>Free<\/em> Christmas everyone<\/a>!');  
  else if (month == 1 && day == 1) // valid at 01/01 only
    document.write(vanillaThanks + newYearsEve);
  else document.write(vanillaThanks +  '!'); // default phrase with additional "!" on end
}

/******************************************************************/
/******************* Subfunction in versions.html *****************/
/******************************************************************/

function latestNewsHeadline() {
  document.write('Latest News (' + dateUK_MonthNameLong + ')');
}

/******************************************************************/
/****************** Subfunctions in footer.html *******************/
/******************************************************************/

/* inside our page & as url (http://smarttemplate4.mozdev.org/#contact) to contact us over AMOs detail page */

function mailtoLine(subject, body, text) {
  var mm1 = '&#115;&#109;&#97;&#114;&#116;';
  var mm2 = '&#116;&#101;&#109;&#112;&#108;&#97;&#116;&#101;4';
  var mm3 = '@post';
  var mm4 = 'eo.de';
  var ag1 = '&#97;&#120;&#101;l.gru';
  var ag2 = 'de@';
  var ag3 = 'gma';
  var ag4 = 'il.com';
  subject = subject ? subject : '[SmartTemplates] - <type subject here>';
  body = body ? body : 'Dear SmartTemplates Developers,';
  text = text ? text : 'Contact&nbsp;us&nbsp;via&nbsp;e-Mail'; // &nbsp; needed for mouseover
  document.write('<a href=\"mailto:' + mm1 + mm2 + mm3 + mm4 + '?cc=' + ag1 + ag2 + ag3 + ag4
                 + '&subject=' + subject 
                 + '&body=' + body 
                 + '\" title=' + text + '>' + text + '<\/a>');
}
 
function copyrightLine() {
  document.write('Mozilla&reg;, mozilla.org&reg;, Bugzilla&trade;, XUL&trade;, Camino&reg;, Sunbird&reg;, Firefox&reg;, Thunderbird&reg; and Seamonkey&reg; and their Icons and Logos are registered <a href=\"http://www.mozilla.org/foundation/licensing.html\" title="Mozilla Trademark" target="_blank">Trademarks<\/a> of the <a href=\"http://www.mozilla.org/foundation/about.html\" title="Mozilla Foundation" target="_blank">Mozilla Foundation<\/a>.<br>');
  document.write('Project Website contents &copy; <a href=\"http://www.mozdev.org/copyright.html\" title="Mozdev Copyright Notice" traget="_blank">Copyright<\/a> &copy; Axel Grude &amp; Marky Mark DE 2012 - '+ yearNow +', all rights reserved.');
  document.write('<a href=\"http://www.mozdev.org/community/terms.html\" title="Mozdev Terms of Use" target="_blank">Terms of Use<\/a> &amp; ');
  document.write('<a href=\"http://www.mozdev.org/community/privacy.html\" title="Mozdev Privacy Policy" target="_blank">Privacy Policy<\/a>.');
}

/******************************************************************/
/******************* Subfunctions in all html's *******************/
/******************************************************************/

/* Apply files to <head> Element site specific */

/* BASE: create base location */
function getBaseLocation() {
 var baseLocation = location.href; // baseLocation results http://smarttemplate4.mozdev.org/
 var lastIndexOfLocation = location.href.lastIndexOf("\\");
  if (lastIndexOfLocation >= 0)
      baseLocation = baseLocation.substring(0, lastIndexOfLocation + 1);
  else {
    lastIndexOfLocation = location.href.lastIndexOf("/");
    if (lastIndexOfLocation >= 0)
      baseLocation = baseLocation.substring(0, lastIndexOfLocation + 1);
  }
    return baseLocation;
}

/* function: apply css styles */
/* call: loadStyleSheet('xxx.css'); */ 
function loadStyleSheet(fileName) {
  var baseLocation = getBaseLocation();
    fileName = baseLocation + "/css/" + fileName;
 
 if (document.createStyleSheet) {
     document.createStyleSheet(fileName);
 } else {
     var styles = "@import url('" + fileName + "');";
     var newSS = document.createElement('link');
     newSS.rel = 'stylesheet';
     newSS.href = 'data:text/css,' + escape(styles);
     document.getElementsByTagName("head")[0].appendChild(newSS);
   }
}

/* function: apply javascript files */
/* call: loadScriptFile('xxx.js'); */
function loadScriptFile(fileName) {
  var baseLocation = getBaseLocation();
    fileName = baseLocation + "/js/" + fileName;
 
 if (document.createScriptFile) {
     document.createScriptFile(fileName);
 } else {
     var script = document.createElement('script');
     script.type = 'text/javascript';
     script.src = fileName;
     document.getElementsByTagName('head')[0].appendChild(script);
   }
}

// find a child which href attribute starts with /<attribute>
// el: parent element
// att: start of href (but without the /)
function findChildByHref(el, att) {
  if (el.childNodes) {
   for (var i = 0; i < el.childNodes.length; i++) {  // iterate kids
    var c = findChildByHref(el.childNodes[i], att);
    if (c) return c;
    var href = (el.childNodes[i].nodeType == 1) ? el.childNodes[i].getAttribute('href') : null; //eliminate text nodes
     if (href && (href.indexOf(att) == 0 || href.indexOf(att) == 1) ) {  // "starts with" so we can ignore queryString Parameters
     return el.childNodes[i];
     }
   }
  }
  return null;
}

function markActiveNavigation(attrName) {
	jQuery(document).ready(function markActiveNavigationDo(event) {
		var res = document.getElementById('resources');
		var item = findChildByHref(res, attrName);
		if (item)
			item.className = (item.className.length) ? item.className + ' active' : 'active';
		var isSupportPage = (attrName.indexOf('kb-')>=0 || attrName.indexOf('support')>=0);
		if (!isSupportPage) {
			// hide support navigation
			var nav = document.getElementById('navKB');
			if (nav) {
				while (nav.firstChild)
					nav.removeChild(nav.firstChild);
				nav.parentNode.removeChild(nav);
			}
		}
		else {
			// keep highlight on kbowledgebase "heading tab"
			item = findChildByHref(res, 'kb-main.html');
			item.className = "bugs active"
		}
	});
}

 /* get query string parameter */
function queryString(key) {
 var vars = [], hash;
 var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
 for(var i = 0; i < hashes.length; i++)
   {
       hash = hashes[i].split('=');
       vars.push(hash[0]);
       vars[hash[0]] = hash[1];
   }
   return vars[key];
}

// call embedVideo('src iframe', 'some title', height of frame, width of frame);
function embedVideo(src, title, width, height) {
	document.write('<iframe width="'+width+'" height="'+height+'" src="'+src+'" frameborder="0" class="video" allowfullscreen>');
	document.write(' <noframes>');
	document.write('  <p id="noiframes">');
	document.write('   Your browser does not support inline frames, please click <a href="'+src+'" title="'+title+'" target="_blank">here!<\/a>');
	document.write('  <\/p>');
	document.write(' <\/noframes>');
	document.write('<\/iframe>');
}