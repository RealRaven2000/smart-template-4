/*******************************************************************
*                        File: navibar.js                          *
*                                                                  *
*                  by Axel Grude & Marky Mark DE                   *
*                         Version 08/2013                          *
*                                                                  *
*                   Date: Fri 30/08/2013 14:57                     *
*                                                                  *
*******************************************************************/

"use strict"; // use ECMAScript5 strict mode

/******************************************************************/
/***************** Subfunctions in footer navbar ******************/
/******************************************************************/

// page trail
var PageTrail = [
        {'id': 0 , 'page':'index.html' }
      , {'id': 1 , 'page':'variables.html' }
      , {'id': 2 , 'page':'variableTable.html' }
      , {'id': 3 , 'page':'templates.html?jquery=on' }
      , {'id': 4 , 'page':'screenshots.html' }
      , {'id': 5 , 'page':'version.html' }
      , {'id': 6 , 'page':'faq.html' }
      , {'id': 7 , 'page':'stationery.html' }
      , {'id': 8 , 'page':'support.html' }
      , {'id': 9 , 'page':'bugs.html' }
      , {'id':10 , 'page':'contribute.html' }
      , {'id':11 , 'page':'index.html' }
    ];
// get current page function for page trail
function getCurrentPage() {
  var sPath = window.location.pathname;
  return sPath.substring(sPath.lastIndexOf('/') + 1);
}
// go forward function
function goForward() {
  var here = getCurrentPage();
  var i;
  for(i=0; i<PageTrail.length; i++) {
   if (here.indexOf(PageTrail[i].page)>=0) {
     window.location.href=PageTrail[i+1].page;
     break;
   }
  }
}
// go back function
function goBack() {
  var here = getCurrentPage();
  var i;
   for(i=PageTrail.length-1; i>=0; i--) {
    if (here.indexOf(PageTrail[i].page)>=0) {
     window.location.href=PageTrail[i-1].page;
     break;
    }
  }
}

// change font-size
// see: http://davidwalsh.name/change-text-size-onclick-with-javascript

// this resize the complete body (original code)
/*function resizeText(multiplier) {
  if (document.body.style.fontSize == "") {
    document.body.style.fontSize = "1.0em";
  }
  document.body.style.fontSize = parseFloat(document.body.style.fontSize) + (multiplier * 0.2) + "em";
}*/
// this resize the content only (modified code)
function resizeText(multiplier) {
  if (document.getElementById('main-content-no-nav').style.fontSize == "") {
    document.getElementById('main-content-no-nav').style.fontSize = "1.0em";
  }
  document.getElementById('main-content-no-nav').style.fontSize = parseFloat(document.getElementById('main-content-no-nav').style.fontSize) + (multiplier * 0.2) + "em";
}