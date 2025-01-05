"use strict";
/* 
BEGIN LICENSE BLOCK

	SmartTemplates is released under the Creative Commons (CC BY-ND 4.0)
	Attribution-NoDerivatives 4.0 International (CC BY-ND 4.0) 
	For details, please refer to license.txt in the root folder of this extension

END LICENSE BLOCK 
*/
// [issue 184] Replacement for smartTemplate-compose.js - SmartTemplates
//             original namespace: SmartTemplate4.classSmartTemplate
//             was instanciated in: SmartTemplate4.smartTemplate

import {Preferences} from "./st-prefs.mjs.js";
import {Util} from "./st-util.mjs.js";
import {Parser} from "./st-parser.mjs.js"; // 

// INTERNAL ONLY FUNCTIONS
	// -----------------------------------
	// Delete DOMNode/textnode or BR
	// change: return the type of node:
	// "cite-prefix" - the original header texts
	// tag name: usually "br" | "div" | "#text"
	// "unknown" - no node or nodeName available
	function deleteNodeTextOrBR(node, idKey, isPlainText)	{
		let isCitation = false,
		    match=false,
		    theNodeName='',
		    cName = '';
		if (node && node.nodeName)
			theNodeName = node.nodeName.toLowerCase();
		else
			return 'unknown';

		let content = '';
		if (node.innerHTML)
			content += '\ninnerHTML: ' + node.innerHTML;
		if (node.nodeValue)
			content += '\nnodeValue: ' + node.nodeValue;
		if (!content)
			content = '\nEMPTY';
		switch(theNodeName) {
			case 'p':
				match = true;
				break;
			case 'br':
				match = true;
				break;
			case '#text':
        // the text "Axel wrote:" is also a plain text node! So we must delete this even in Text mode.
				if (!isPlainText) // AG change: only delete text nodes if we are in HTML mode.
					match = true;
				break;
			case 'div': // tb 13++
				if (node.className &&
				    node.className.indexOf('moz-cite-prefix')>=0) {
					if (Preferences.isDebugOption('composer')) debugger;
					cName = node.className;
					match = true;
					isCitation = true;
				}
				break;
		}

		if (match) {
				let msg = cName ? ('div class matched: ' + cName + '  ' + theNodeName) : theNodeName;
				Util.logDebugOptional('deleteNodes','deleteNodeTextOrBR() - deletes node ' + msg
						+ '\n_________' + node.nodeName + '_________' + content);
			if (isCitation) {
				// lets not remove it if the box [x] "Use instead of default quote header" is not checked
				if (!SmartTemplate4.pref.isDeleteHeaders(idKey, "rsp", false))
					return 'cite-prefix'; // we do not remove the citation prefix if this account doesn't have this option specified

			}
			orgQuoteHeaders.push(node);
			// rescue the signature from citation before deleting the node
			gMsgCompose.editor.deleteNode(node);
		}
		else
			Util.logDebugOptional('deleteNodes','deleteNodeTextOrBR() - ignored nonmatching ' + theNodeName);
		return isCitation ? 'cite-prefix' : theNodeName;
	};


	// -----------------------------------
	// Delete all consecutive whitespace nodes...
	function deleteWhiteSpaceNodes(node) {
		let match = true,
		    count = 0;
		while (node && match) {
			let nextNode = node.nextSibling;
			match = false;
			switch (node.nodeType) {
				case Node.TEXT_NODE:
					if (node.nodeValue == '\n' || node.nodeValue == '\r')
						match=true;
					break;
				case Node.ELEMENT_NODE:
					if (node.nodeName && node.nodeName.toLowerCase() == 'br')
						match = true;
					break;
				default:
					match = false;
			}
			if (match) {
				Util.logDebugOptional('deleteNodes','deleteWhiteSpaceNodes() - deletes node '
						+ '\n' + node.nodeName + '	' + node.nodeValue);
				gMsgCompose.editor.deleteNode(node);
				node = nextNode;
			}
		}
		Util.logDebugOptional('deleteNodes','deleteWhiteSpaceNodes() - deleted ' + count + ' nodes.');
	};

	function deleteHeaderNode(node) {
		if (node) {
			Util.logDebugOptional('functions','deleteHeaderNode() - deleting ' + node.nodeName
						+ '\n' + node.innerHTML);
			orgQuoteHeaders.push(node);
			gMsgCompose.editor.deleteNode(node);
		}
	};

	function isQuotedNode(node) {
		if (!node)
			return false;
// Note:  moz-cite-prefix might be the container for the headers (shown _before_ the quote)
// 		    node.className &&
// 		    node.className.indexOf('moz-cite-prefix')>=0
    if (node.nodeName && node.nodeName.toLowerCase() == 'blockquote')
			return true;
		if (!node.parentNode) return false;
		// make this recursive; if the node is child of a quoted parent, it is also considered to be quoted.
		return isQuotedNode(node.parentNode); 
	};

	// -----------------------------------
	// Get processed template getProcessedText() => moved to st-parser.mjs.js


export async function readSignatureFile(Ident) {
  
}

export async function extractSignature() {
  
}

export async function insertTemplate(startup, flags, fileTemplateSource)	{
    let rawTemplate = "";
    Util.logIssue184(`st-compose.mjs - insertTemplate() - WIP`);
    // convert this one later. we start with Parser.getProcessedText
    // rename st-parser.mjs to st-parser.mjs.js !
    /* LINE NUMBER in smartTemplate-compose.js - what it does */
    /* 900 - check and prepare "flags" to store states - see SmartTemplate4.initFlags()
       e.g. has signatur variable, omit sig, had cursor variable, has quote placeholder, 
       has template placeholder, is it a file template?
    */
    
    /* smartTemplate-compose:908 - check if another template insert process is running to avoid duplication and abort */
    
    /* smartTemplate-compose:909 - set a flag that we are now processing a template! (this is to avoid duplicate processing
             while files are streamed). THIS FLAG MUST BE PER COMPOSER WINDOW
       SmartTemplate4.PreprocessingFlags.isInsertTemplateRunning = true; */
    
    /* smartTemplate-compose:923 - retrieve identity from document / composer */
    let composeTab =  await messenger.tabs.getCurrent(),   // current tab if we are in composer.
        composeDetails = await messenger.compose.getComposeDetails(composeTab.id),
        idKey = composeDetails.identityId;
    // SmartTemplates.logDebug("retrieved identity key: " + idKey);
 
    /* smartTemplate-compose:1059 read file template  |  read thunderbird template  |  read account template */
    if (flags.isFileTemplate && fileTemplateSource && !fileTemplateSource.failed) {
			rawTemplate = fileTemplateSource.HTML || fileTemplateSource.Text;
    }
    else if (flags.isThunderbirdTemplate) {
      rawTemplate = editor.rootElement.innerHTML; // treat email as raw template
    }
    else {
      rawTemplate = flags.isThunderbirdTemplate ? "" : pref.getTemplate(idKey, st4composeType, ""); 
    }
    let parser = new Parser();
    let st4composeType = "", composeCase = "";
    switch (composeDetails.type) {
      case "draft":
        st4composeType = "new";
        composeCase = "draft";
        break;
      case "new":
        st4composeType = "new";
        break;
      case "redirect": // [issue 184] TO DO
        st4composeType = "fwd";  // NEW CASE WE PROBABLY NEED TO BYPASS ST FOR THIS ONE!!
        break;
      case "reply":
        composeCase = "reply";
        st4composeType = "rsp";
        break;
      case "forward":
        st4composeType = "fwd";
        break;
      case "template": // NOT SUPPORTED YET??
        composeCase = 'tbtemplate';
        break;
      default:
        break;
    }
    
    let processedText = await getProcessedText(template, idKey, info, ignoreHTML, flags);


 
}

 
export function resetDocument() {
  
}

