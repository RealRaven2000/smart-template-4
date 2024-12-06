/* global settings */
pref("extensions.smartTemplate4.sandbox", false); // disable sandboxed java
pref("extensions.smartTemplate4.firstRun", true);
pref("extensions.smartTemplate4.deferred.autoUpdate", true);
pref("extensions.smartTemplate4.hasNews", false);
pref("extensions.smartTemplate4.version", "?");
pref("extensions.smartTemplate4.breaksAtTop", 0);
pref("extensions.smartTemplate4.forceParagraph", true);
pref("extensions.smartTemplate4.showStatusIcon", true);
pref("extensions.smartTemplate4.statusIconLabelMode", 2); // 0 - no label; 1 - autohide; 2 - always show 
pref("extensions.smartTemplate4.font.size", 9); /* 8pt .templateBox font size */
pref("extensions.smartTemplate4.parseSignature", false);
pref("extensions.smartTemplate4.firstLastSwap", true);
pref("extensions.smartTemplate4.header.inject", true);
pref("extensions.smartTemplate4.defaultCharset", "ISO-8859-1");
pref("extensions.smartTemplate4.signature.encoding", "UTF-8");
pref("extensions.smartTemplate4.signature.insertDashes.plaintext", false);
pref("extensions.smartTemplate4.signature.insertDashes.html", false);
pref("extensions.smartTemplate4.signature.removeBlockQuotedSig.onFail", false); // we might have removeBlockQuotedSig.always later as a feature!#
pref("extensions.smartTemplate4.signature.replaceLF.plaintext.br", true);
pref("extensions.smartTemplate4.cursor.insertSpace", true);
pref("extensions.smartTemplate4.mime.resolveAB.CardBook", false); // CardBook support
pref("extensions.smartTemplate4.mime.resolveAB.CardBook.fallback", false); // Fallback to standard AB
pref("extensions.smartTemplate4.mime.resolveAB", true);
pref("extensions.smartTemplate4.mime.resolveAB.removeEmail", true);
pref("extensions.smartTemplate4.mime.resolveAB.preferNick", false);
pref("extensions.smartTemplate4.mime.resolveAB.displayName", false);
pref("extensions.smartTemplate4.mime.defaultFormat","name,bracketMail(angle)");
pref("extensions.smartTemplate4.identities.showAccountName", false);
pref("extensions.smartTemplate4.identities.showIdKey", false);
pref("extensions.smartTemplate4.toolbar.hideLabel", false);
pref("extensions.smartTemplate4.names.delimiter", ",");
pref("extensions.smartTemplate4.names.capitalize", true);
pref("extensions.smartTemplate4.names.quoteIfComma", false);
pref("extensions.smartTemplate4.names.guessFromMail", true); // [Bug 26595] do not guess Name from email address part
pref("extensions.smartTemplate4.names.extractNameFromParentheses", false); // [Bug 26596] Make extracting Name from (parentheses) optional
pref("extensions.smartTemplate4.mail.suppressLink", false);
pref("extensions.smartTemplate4.plainText.preserveTextNodes", false);
pref("extensions.smartTemplate4.forwardInlineImg.delay", 200); // [BUG 26434] delay for inline image replacement when forwarding 
pref("extensions.smartTemplate4.xtodaylegacy", false); // old way of processing which temporarily inserted  %X:=today% on _EVERY_ new line 
pref("extensions.smartTemplate4.cleanDeferredButton.installer", false);
pref("extensions.smartTemplate4.files.path", ""); // location of last saved / loaded json template  

pref("extensions.smartTemplate4.defaultTemplateMethod", 1); // 1 - use account template... 2 - use last template [issue 243]
pref("extensions.smartTemplate4.vars.file.fileTemplateMethod", false); // use the template loader for %file% variables
pref("extensions.smartTemplate4.fileTemplates.editor.path",""); // [issue 282]
pref("extensions.smartTemplate4.fileTemplates.menus.delayMessagePane", 8000); // delay patching the msg header buttons
pref("extensions.smartTemplate4.fileTemplates.path", ""); // location of external html templates "Stationery" for next menu config action 
pref("extensions.smartTemplate4.fileTemplates.instantPath", ""); // location for path used for adhoc html template selection 
pref("extensions.smartTemplate4.fileTemplates.sendTimeout", 200); // [issue 173] wait before pressing send button

pref("extensions.smartTemplate4.fileTemplates.mru.new", ""); // (json) template data for recently used cases
pref("extensions.smartTemplate4.fileTemplates.mru.rsp", "");
pref("extensions.smartTemplate4.fileTemplates.mru.rsp.all", ""); // extend with more choices
pref("extensions.smartTemplate4.fileTemplates.mru.rsp.list", ""); // extend with more choices
pref("extensions.smartTemplate4.fileTemplates.mru.fwd", "");
pref("extensions.smartTemplate4.fileTemplates.mru.max", 10); // [issue 263] max number for mru items (pro users only)

pref("extensions.smartTemplate4.dateformat.hour", "numeric"); // change to "2-digit" for forcing 2digit hours in datelocal / dateshort
pref("extensions.smartTemplate4.dateformat.day", "numeric"); // change to "2-digit" for forcing 2digit day in datelocal / dateshort
pref("extensions.smartTemplate4.dateformat.month", "numeric"); // change to "2-digit" for forcing 2digit month in dateshort
pref("extensions.smartTemplate4.dateformat.year", "numeric"); // change to "2-digit" for forcing 2digit dateshort only
pref("extensions.smartTemplate4.allowScripts", false); // prohibit running Javascript unless users know what they are doing and set this to true
/* this is a convenience function - if I change from after or during composing, delete sig */
pref("extensions.smartTemplate4.removeSigOnIdChangeAfterEdits", false);
/* header replacement rules */
pref("extensions.smartTemplate4.headers.unescape.quotes", true);
pref("extensions.smartTemplate4.expandSettings", false);

pref("extensions.smartTemplate4.BackgroundParser", false); // [issue 184] new background processing - TEST ONLY for now

pref("extensions.smartTemplate4.changeTemplate.button.install", true); /* add change template button automatically when installing for first time */
pref("extensions.smartTemplate4.insertSnippet.button.install", true); /* add insert snippets button automatically when installing for first time */

/* debug settings */
pref("extensions.smartTemplate4.settings.html",true); // test
pref("extensions.smartTemplate4.debug", false);
pref("extensions.smartTemplate4.debug.default", true); // to disable standard log messages 
pref("extensions.smartTemplate4.hideExamples", false);
pref("extensions.smartTemplate4.debug.events", false);
pref("extensions.smartTemplate4.debug.functions", false);
pref("extensions.smartTemplate4.debug.functions.delReplyHeader", false);
pref("extensions.smartTemplate4.debug.functions.delForwardHeader", false);
pref("extensions.smartTemplate4.debug.functions.insertTemplate", false);
pref("extensions.smartTemplate4.debug.functions.extractSignature", false);
pref("extensions.smartTemplate4.debug.functions.getProcessedText", false);
pref("extensions.smartTemplate4.debug.adressbook", false);
pref("extensions.smartTemplate4.debug.API.menus", false);
pref("extensions.smartTemplate4.debug.replaceReservedWords", false);
pref("extensions.smartTemplate4.debug.deleteNodes", false);
pref("extensions.smartTemplate4.debug.composer", false);
pref("extensions.smartTemplate4.debug.images", false);
pref("extensions.smartTemplate4.debug.headerPane", false);
pref("extensions.smartTemplate4.debug.settings", false);
pref("extensions.smartTemplate4.debug.settings.prefs", false);
pref("extensions.smartTemplate4.debug.signatures", false);
pref("extensions.smartTemplate4.debug.regularize", false);
pref("extensions.smartTemplate4.debug.tokens", false);
pref("extensions.smartTemplate4.debug.tokens.deferred", false);
pref("extensions.smartTemplate4.debug.transformStrings", false);
pref("extensions.smartTemplate4.debug.mime", false);
pref("extensions.smartTemplate4.debug.mime.split", false);
pref("extensions.smartTemplate4.debug.msg",false);
pref("extensions.smartTemplate4.debug.parseModifier", false);
pref("extensions.smartTemplate4.debug.fileTemplates",false);
pref("extensions.smartTemplate4.debug.fileTemplates.menus",false);
pref("extensions.smartTemplate4.debug.firstRun", false);
pref("extensions.smartTemplate4.debug.test.update", false);
pref("extensions.smartTemplate4.debug.identities", false);
pref("extensions.smartTemplate4.debug.css.styleSheets", false);
pref("extensions.smartTemplate4.debug.css.detailed", false);
pref("extensions.smartTemplate4.debug.css.AddRule", false);
pref("extensions.smartTemplate4.debug.timeZones", false);
pref("extensions.smartTemplate4.debug.timeStrings", false);
pref("extensions.smartTemplate4.debug.headers", false);
pref("extensions.smartTemplate4.debug.sandbox", false);
pref("extensions.smartTemplate4.debug.notifications", false);
pref("extensions.smartTemplate4.debug.notifications.menus", false);
pref("extensions.smartTemplate4.debug.premium.licenser", false);
pref("extensions.smartTemplate4.debug.premium.rsa", false);
pref("extensions.smartTemplate4.debug.premium.testNotification", false);
pref("extensions.smartTemplate4.debug.variables.search", false);

// SmartTemplate License specific:
pref("extensions.smartTemplate4.license.gracePeriodDate","");
pref("extensions.smartTemplate4.licenser.forceSecondaryIdentity",false);
pref("extensions.smartTemplate4.licenseType", 0); // private license, 1-domain
pref("extensions.smartTemplate4.LicenseKey", "");
pref("extensions.smartTemplate4.silentUpdate", true); // can be changed by everyone from now.
