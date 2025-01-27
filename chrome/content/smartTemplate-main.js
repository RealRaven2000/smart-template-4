"use strict";
// name space these contents
/// not possible even with ChromeUtils.importESModule()
/* import * as SmartTemplates_Discounts from "../../popup/sales.js";   */
// Next Sale End Date  COPIED from sales.js until we find a better way
var SmartTemplates_Discounts = {
  sales_end: new Date("2024-11-29"),
  discountRate: {
    discountPro: "33%",
    discountUpgrade: "33%",
    discountRenewal: "25%",
  },
};



// used in update.js


/* 
BEGIN LICENSE BLOCK

  SmartTemplates is released under the Creative Commons (CC BY-ND 4.0)
  Attribution-NoDerivatives 4.0 International (CC BY-ND 4.0) 
  For details, please refer to license.txt in the root folder of this extension

END LICENSE BLOCK 
*/


/* Version History  (chronological) starting from v4.0

  The complete change log is available at the support site here:

  https://smarttemplates.quickfolders.org/version.htm

  == older history (pre Thunderbird 78, starting at 09/08/2011) was moved to change-log.txt (in the project root )==

#################################################

  Log below starts at 4.0 (for Thunderbird 115 and later)

  Version 4.0b1 - 10/07/2023
    # [issue 213] Compatibity with Thunderbird 115 (ESR 2023/24)
    # - new browser action button (WIP)
    # - messageServiceFromURI moved to MailServices
    # deprecated {OS} for file reading.
    // OS.File.read => IOUtils.read
    // OS.Constants.Path.profileDir -> PathUtils.profileDir
    // OS.Path.* -> PathUtils.*
    // OS.File.writeAtomic -> IOUtils.writeUTF8
    // JSON.parse(CustomMenuData) -> JSON.parse(new TextDecoder().decode(CustomMenuData))
    # b1 [issue 240] Regression (3.16) invalid HTML signature path can lead to problems in template 
    # b1 [issue 243] Menu item / Option for reusing last external template (defaultTemplateMethod)
    # b1 [issue 244] Allow replaceText and deleteText to affect html that was imported using %file()%
    # - new browser action button (WIP)
    # - messageServiceFromURI moved to MailServices

  Version 4.0b2 - 12/07/2023
    # b2 [issue 227] Avoid error when smartTemplates.json file does not exist

  Version 4.0b3 - 16/07/2023
    # b3 [issue 247] Regression - saving template menus saves invalid smartTemplates.json file
    # b3 [issue 248] %recipient% uses the original "from" address when replying

  Version 4.0.2 - 25/07/2023
    # [issue 249] composer: open snippet / change template from file directly inserts nothing
    # If cardbook support is enabled but cardbook disabled this will also prevent fallback to std AB
    #   (cardbook fallback throws error)
    # fixed missing panels in Common settings if no account was selected  (e.g. when opening 
    #       the settings from Local Folders)
    # replace obsolete messageListener.onEndHeaders() code (which looked at the visbility of reply/forward buttons) 
    # with an notification that reacts to the message header change API - 
    # remove SmartTemplate4.messageListener
    # use the onMessageDisplayed API instead

    
  Version 4.1 - 09/08/2023
    # [issue 79] Inject contents of <head> tags into composer's head section, merge body attributes
    # Remove console error “receiving end does not exist” if Cardbook enabled but not installed
    # Slightly improved settings layout (long template list tended to push the bottom 
      buttons outside of the window)
    # [issue 252] ST 4.0.2 Cannot open license website (or any external website links)

  Version 4.2.1 - 25/09/2023
    # [issue 254] Made the button above email preview less obtrusive:
      Shortened the text for the message display action button - "SmartTemplates" 
      Added an option to remove the label when in icon+text mode.
    # Add "settings" item to bottom of SmartTemplates thread tools menu
    # [issue 256] Fixed: account template not loaded when changing From address

  Version 4.3.1 - 16/10/2023
    # [issue 263] List most recent external template actions on top level of SmartTemplates menus
    # [issue 262] Add accelerator keys for template menus (Write, Forward, Reply, Reply All and Reply to List)
    # [issue 264] Support reading %clipboard% with "text/plain" content 
    # [issue 265] Support <div type='cite'> for raising quote level in commands that have quote level parameters    
    # [issue 268] Make registration screen less tall / easily resizable

  Version 4.3.2 - 23/10/2023
    # [issue 269] Regression: Insert Snippet and Change template buttons were missing the menu item "Open template file..."
  
  Version 4.3.3 - 08/11/2023
    # [issue 271] Sometimes the header menu is empty - patchHeaderPane() fails - 
                  - increased default delay for patching message 
                  - keeping a reference to local WindowListener in message window
    # [issue 273] Loading accounts settings doesn't work
    # [issue 272] SmartTemplates ignored when creating an email from the Thunderbird taskbar context menu
    #             or when clicking a mailto link on a website. This should load the template of the default account.

  Version 4.4 - 29/03/2024
    # [issue 274] Add %preheader()% variable for injecting preview
    # [issue 275] Auto-Fill content for %to%, %recipient% and %from% when 
                  clicking Contact context menu "Compose Message To" or writing new mail
    # Added documentation for dateformat(fstring,toclipboard)
    # Add Alias to register dialog if already set in a license
    # [issue 239] Use correct %recipient% when replying to own email
    # [issue 246] Support for other.custom1, other.custom2 etc. from address book fields
    # [issue 257] Cardbook: Deferred variable (clicking on the pink "to(name)" field not pulling data from B intermittently
    # [issue 278] failure looking up Cardbook with mixed case - forced lowercase emails
    # [issue 267] Support for extracting prefix and suffix from address book fields
    # [issue 276] Removed FileUtils.getFile for future compatibility (122 beta)
    # Removed duplicate tooltip on active fields in write new mail
    # [issue 280] You can now use escaped commas within commands that search or replace strings
    # %replaceText% and %deleteText% now work on the body of the email when used from the Smart Fragments menu
    # Opening support sites in a tab is now using API method
    ---------
    # [issue 253] WIP - recreate menus using API functions - converted message action button menus


  Version 4.4.1 - 01/04/2024
    # [issue 283] Fixed regression caused by API menu changes (only 1 MRU item)

  Version 4.4.2 - 10/04/2024
    # extended sale to April 20th (previous version was not reviewed in time)

  Version 4.4.3 - 15/04/2024
    # [issue 284] When sending email with unresolved from / recipient / to variables are not replaced automatically
    # [issue 286] Update MRU menu items with changed titles from template setup (if found)
    # [issue 285] Remove notification "load_template" is a Premium feature
    # Some layout fixes for notifications
    # Version history tab filed to open since using API to open URLs (v4.4)
    # added missing proFeature image for notification


  Version 4.5 - 14/05/2024
    # [issue 287] You can now use percent "%" sign within a text parameter, e.g. %header.set(subject,"save 25%")%
    # [issue 282] Added Edit Templates button
    # [issue 288] Added text transformation parameters for search functions (capitalize / uppercase / lowercase / camelcase)
    # [issue 289] Support selection as parameter for replaceText - so we can transform selected text from smart fragments    
    # [issue 290] Opening SmartTemplates settings in "Common" shows disabled UI underneath
    # [issue 291] Settings dialog is missing toolbar buttons (beside account selector) when opened from Add-ons manager
    # [issue 292] All spaces after/before text parameters in %header.set(subject," text ")% are trimmed away

    # Minor layout improvements in settings screen
    # improved templates scrolling when moving menu items up / down

  Version 4.6 - 14/07/2024
    # Made Add-on compatible with 128.*
    # [issue 259] Converted Settings screen to HTML, and move to Tab
    # [issue 295] Fix file picker which behaves differently from Thunderbird 125 [bug 1882701]
    # [issue 293] The variables %header.delete()% and %header.deleteFromSubject()%  now support multiple parameters. 
    # The licenser now performs faster (it omit folders when using the API function to iterate the mail accounts)

  Version 4.6.1 - 16/07/2024
    # [issue 297] Snippets - Configure menu items - should open "template files" page in settings (new settings dialog)
    # [issue 298] File Templates - Clicking [Add] when no file is opened 
               should display a instructions (not "undefined")
    # [issue 299] Larger fonts and minor layout improvements in settings dialog.

  Version 4.7 - 06/08/2024
    # [issue 300] Account Templates - new Identities could not be added in the new version of the settings dialog.
    # [issue 302] Improved Chinese translations for term "accounts" - thanks to Y.D.X.
    # [issue 304] Fixed: Clicking on Hide Button Label in header menu doesn't work as expected
    # [issue 307] Added Refresh button for accounts dropdown
    # [issue 308] in Tb128 - popup for restricted features: notification leads to exception + icon not displayed 
    # Removed vendor prefix from -moz-appearance
    # [issue 309] Reply with template from tab displays "cmd_reply not available in this context"


  Version 4.8 - 03/09/2024
    # Added compatibility with Thunderbird 130
    # [issue 317] Support text transformation parameters with %dateformat()%
    # [issue 310] improve icons theme support by eliminating 'context' attributes from svg images.
    # Removed font dependence in icons (converted all texts to path)
    # use keydown instead of deprecated keypress events
    # [issue 313] Implemented settings for statusbar icon in new settings tab
    # [issue 311] Template functions don't work when writing a new message in a newsgroup account
    # [issue 312] "expand all" inside new settings variables page doesn't work 
    # [issue 314] convert "expand all" in variables page into toggle
    # [issue 318] "Configure Menu item..." not working as expected.
    # [issue 315] WIP: F4 to repeat searching for a search text doesn't work in new variable page

  Version 4.8.1 - 09/09/2024
    # [issue 319] Fixed search highlighting and scrolling in variables tab.
    # Improved headline for Examples tab and added jump to support side.
    # Variables page now support dark mode.

  Version 4.9 - 11/11/2024
    # [issue 320] %tags% = new variable to insert tags in Email
    # [issue 330] Added preferred flavor parameter to %clipboard()%: plain, text, unicode, html
    # [issue 321] missing text in explanation of the %preHeader% parameter headerText 
    # [issue 327] support multiple address parameters in header.set / header.append
    # Added link to open Examples Page in browser.
    # [issue 322] SmartTemplates ignored when creating an email from the Thunderbird taskbar 
                  context menu (see also issue 272)
    # [issue 323] Spell Dutch months and days with lowercase letters
    # [issue 324] Make SmartTemplates compatible with new ESM modules (jsm will be removed in the next ESR)
    # [issue 328] Text search should include contents contained in tables. Also improved whitespace collapsing.
    # [issue 329] Sandbox script: Support reading variables without parameters (e.g. %from%) within script

  Version 4.10 - 24/01/2025
    # [issue 331] Add features to insert unquoted email and remove styles using %quotePlaceHolder% 
                  (implemented in 4.9)
    # [issue 340] Fixed: Common account settings for account were not stored
    # [issue 343] Improved Capitalization for double-barrelled names (such as Tyler-Smith)
    # [issue ] Compatibility: deal with removal of MozElements.NotificationBox.shown() 
    # [issue 344] %header.set(subject,clipboard)% and %matchTextFromBody(..,toclipboard)% fail at commas
    # [issue 347] Fixed Problems with messageRaw( ) function in Sandboxed script
    # [issue 349] Support "composite" ST variables in sandboxed script (e.g. header.set)
    # [issue 350] Support multiple parameters in sandboxed script (e.g. %from(name,uppercase)% ) 
    # [issue 351] Fixed: *selection* truncates content in text nodes
    # [issue 352] %header.set(from)% triggers unnecessary warning.
    # [issue 353] new %dateformat.received()% to retrieve date of original mail
    # made compatible with Tb 135.*

  Version 4.10.1 - 28/01/2025 ?
    # [issue 354] Regression in 4.10: automatic forwarding with FiltaQuilla fails




=========================
  KNOWN ISSUES / FUTURE FUNCTIONS
  Version 4.x - WIP
    # [issue 326] Feature request: retrieve an email address from AB using name / nickname (WIP)
    # [issue 285] remove: "load_template" is a Premium feature
    # [issue 277] "Reply All" from SmartTemplates menu behave the same as "Reply"
    # [issue 325] Add XNote++ variable.
    # [issue 253] recreate unified toolbar menu using API functions

    # New Idea: Add an account templates submenu - only for accounts with dedicated settings.

    # [issue 150] Remove "Nag Screens" in Composer for unlicensed users
    # [issue 27] Insert external HTML Templates from a web page URL
    # [issue 10] add %deliveryoptions% function to force Return Receipt.
    # The "clean up button" is not automatically installed in the composer toolbar.
    # ...
      
// investigate gMsgCompose.compFields!
=========================
*/

var SmartTemplate4 = {
  // definitions for whatIsX (time of %A-Za-z%)
  XisToday: 0,
  XisSent: 1,
  signature: null,
  sigInTemplate: false,
  PreprocessingFlags: {
    hasCursor: false,
    hasSignature: false,
    omitSignature: false,
    hasQuotePlaceholder: false,
    hasQuoteHeader: false, // WIP
    hasTemplatePlaceHolder: false, // future use
    isStationery: false,
    isThunderbirdTemplate: false,
    isFileTemplate: false,
    isFragment: false,
    preHeader: null, // [issue 274]
    modifiedHeaders: [], // list of header vars that may have received new content; need to be updated in deferredVars
  },

  initFlags: function initFlags(flags) {
    // independent initialisation so we can create an empty flags object
    flags.hasSignature = false;
    (flags.omitSignature = false), (flags.hasCursor = false);
    flags.isStationery = false;
    flags.hasQuotePlaceholder = false;
    flags.hasQuoteHeader = false;
    flags.hasTemplatePlaceHolder = false;
    flags.isThunderbirdTemplate = false;
    flags.isFileTemplate = false;
    flags.modifiedHeaders = [];
    flags.preHeader = null;
    flags.isFragment = false;
  },

  // -------------------------------------------------------------------
  // A handler to add template message
  // -------------------------------------------------------------------
  // isChangeTemplate: we need this for [isue 29] change template in composer window
  notifyComposeBodyReady: async function (
    isChangeTemplate = false,
    win = null
  ) {
    const prefs = SmartTemplate4.Preferences,
      util = SmartTemplate4.Util,
      Ci = Components.interfaces,
      msgComposeType = Ci.nsIMsgCompType;

    if (SmartTemplate4.Preferences.isBackgroundParser()) {
      // [issue 184] - this should never be called if this flag is set
      alert("To do: replace notifyComposeBodyReady() event - [issue 184]\n");
      return;
    }

    // maybe use    GetCurrentEditor() and find out  stuff from there
    // get last opened 3pane window - but we really need the owner of the "write button"
    // we clicked.
    // That window stores SmartTemplate4.fileTemplates.armedEntry
    // we need this to retrieve the file Template path and title!
    function getMsgComposetype() {
      switch (gMsgCompose.type) {
        case Ci.nsIMsgCompType.ForwardInline:
          return "fwd";
        case Ci.nsIMsgCompType.Reply:
          return "rsp";
      }
      return ""; // unknown
    }

    const ownerWin = win || util.Mail3PaneWindow; // for changing the template our current composer window is the context
    let  theQueue =
        ownerWin && ownerWin.SmartTemplate4
          ? ownerWin.SmartTemplate4.fileTemplates.armedQueue || []
          : [],
      flags = this.PreprocessingFlags;

    // check if a file template is active. we need to get the window from the originating event!
    let dbg = "SmartTemplate4.notifyComposeBodyReady()";
    this.initFlags(flags);

    let theFileTemplate = null,
      fileTemplateSource = null; // for fileTemplates, echeck if null and o.failed, otherwise o.HTML shoulde be the tempalte

    // retrieve and consume fileTemplate info
    // I will be very cautious in case composer is called from elsewhere (e.g. a mailto link, or a single message window)
    if (
      ownerWin &&
      ownerWin.SmartTemplate4 &&
      ownerWin.SmartTemplate4.fileTemplates &&
      ownerWin.SmartTemplate4.fileTemplates.armedEntry
    ) {
      theFileTemplate = ownerWin.SmartTemplate4.fileTemplates.armedEntry;
      // to avoid event triggering while we stream the message, postpone this one!
      if (SmartTemplate4.isStreamingMsg) {
        setTimeout(function () {
          SmartTemplate4.notifyComposeBodyReady(isChangeTemplate, win);
        }, 100);
        return;
      }
    } else if (theQueue.length) {
      util.logDebugOptional("fileTemplates", "Queued templates found", theQueue);
      let origUri = gMsgCompose.originalMsgURI;
      // try to find matching item from the queue
      let found = theQueue.find((el) => el.uri == origUri && el.composeType == getMsgComposetype());
      if (found) {
        theFileTemplate = found;
        theQueue = theQueue.filter((el) => el != found);
        util.logDebugOptional("fileTemplates", "found match, filtered queue:", theQueue);
      } else {
        theFileTemplate = theQueue.pop(); // if we can't find, let's take the last item instead and hope for the best.
      }
      ownerWin.SmartTemplate4.fileTemplates.armedQueue = theQueue; // store depleted queue back!
      util.logDebugOptional(
        "fileTemplates",
        "Found FileTemplate:",
        theFileTemplate,
        ownerWin.SmartTemplate4.fileTemplates.armedQueue
      );
    }

    // reuse last template for this specific composeType. [issue 243]
    if (!theFileTemplate && prefs.getMyIntPref("defaultTemplateMethod") == 2) {
      // reuse last external template!
      let composeType = "";
      if (!this.smartTemplate.composeCase) {
        composeType = this.smartTemplate.setComposeCase(gMsgCompose.type);
      }
      try {
        let setting = "fileTemplates.mru." + composeType;
        switch (composeType) {
          case "new":
            theFileTemplate = JSON.parse(SmartTemplate4.Preferences.getStringPref(setting));
            break;
          case "rsp":
            theFileTemplate = JSON.parse(SmartTemplate4.Preferences.getStringPref(setting));
            break;
          case "fwd":
            theFileTemplate = JSON.parse(SmartTemplate4.Preferences.getStringPref(setting));
            break;
        }
        if (theFileTemplate) {
          util.logHighlight(
            `Found previous FileTemplate: `,
            "yellow",
            "rgb(0,80,0)",
            theFileTemplate
          );
        }
      } catch (ex) {
        util.logHighlight(
          `Could not retrieve previous file template for composeType ${composeType}`,
          "yellow",
          "rgb(0,80,0)"
        );
      }
    }

    if (theFileTemplate) {
      // [issue 173]
      if (theFileTemplate.isAutoSend) {
        flags.isAutoSend = true;
      }

      ownerWin.SmartTemplate4.fileTemplates.armedEntry = null;
      util.logDebugOptional(
        "fileTemplates",
        "notifyComposeBodyReady: \n" +
          "Consuming fileTemplate: " +
          theFileTemplate.label +
          "\n" +
          "composeType:" +
          theFileTemplate.composeType +
          "\n" +
          "path:" +
          theFileTemplate.path
      );

      // composer context:
      fileTemplateSource = SmartTemplate4.fileTemplates.retrieveTemplate(theFileTemplate);
      if (fileTemplateSource.failed) {
        let text = util.getBundleString("st.fileTemplates.error.filePath");

        SmartTemplate4.Message.display(
          text.replace("{0}", theFileTemplate.label).replace("{1}", theFileTemplate.path),
          "centerscreen,titlebar,modal,dialog",
          {
            ok: function () {
              // get last composer window and bring to foreground
              let composerWin = Services.wm.getMostRecentWindow("msgcompose");
              if (composerWin) composerWin.focus();
            },
          },
          ownerWin
        );
      } else {
        flags.isFileTemplate = true; // !!! new Stationery substitution
        if (!flags.filePaths) flags.filePaths = [];
        util.logDebugOptional(
          "fileTemplates",
          `notifyComposeBodyReady: Add file to template stack: ${theFileTemplate.path}`
        );
        flags.filePaths.push(theFileTemplate.path); // remember the path. let's put it on a stack.
        /**********      GLOBAL VARIABLE!!! - SCOPED TO COMPOSER WINDOW      **********/
        // [issue 64] memorize the file template path in Composer! So we can change from address and reload it.
        window.SmartTemplate4.CurrentTemplate = theFileTemplate;
      }
    }

    // We must make sure that Thunderbird's own  NotifyComposeBodyReady has been ran FIRST!
    // https://searchfox.org/comm-central/source/mail/components/compose/content/MsgComposeCommands.js#343
    if (prefs.isDebugOption("composer")) debugger;

    dbg += "\ngMsgCompose type: " + gMsgCompose.type;
    // see https://dxr.mozilla.org/comm-central/source/comm/mailnews/compose/public/nsIMsgComposeParams.idl
    // New in Tb60 EditAsNew (15) and EditTemplate (16)
    if (
      gMsgCompose.type == (msgComposeType.EditAsNew || 15) ||
      gMsgCompose.type == (msgComposeType.EditTemplate || 16)
    )
      return; // let's do no processing in this case, so we can edit SmartTemplates variables

    // Tb 52 uses msgComposeType.Template for "Edit as New""
    if (
      gMsgCompose.type == msgComposeType.Template &&
      typeof msgComposeType.EditTemplate == "undefined"
    ) {
      util.logDebug(
        "omitting processing - composetype is set to Template and there is no EditTemplate defined (pre Tb60)"
      );
      return;
    }
    // this also means the hacky code around flags.isThunderbirdTemplate will now be obsolete.
    flags.isThunderbirdTemplate = gMsgCompose.type == msgComposeType.Template;
    SmartTemplate4.StationeryTemplateText = ""; // discard it to be safe?
    util.logDebug(dbg);
    // Add template message
    // guard against this being called multiple times from stationery
    // avoid this being called multiple times
    let editor = util.CurrentEditor.QueryInterface(Ci.nsIEditor),
      root = editor.rootElement,
      isInserted = false;
    try {
      // guard against forwarding my own message (body may have the smartTemplateInserted flag already)
      if (
        !root.getAttribute("smartTemplateInserted") ||
        gMsgCompose.type == msgComposeType.ForwardInline ||
        flags.isThunderbirdTemplate ||
        isChangeTemplate
      ) {
        isInserted = true;
        // [issue 108] avoid duplicating in case external Add-on changes from identity
        if (
          (gMsgCompose.type == msgComposeType.ForwardInline ||
            gMsgCompose.type == msgComposeType.ForwardAsAttachment) &&
          root.getAttribute("smartTemplateInserted")
        )
          isChangeTemplate = true;

        // if insertTemplate throws, we avoid calling it again
        let isStartup = isChangeTemplate ? false : !flags.isThunderbirdTemplate;
        if (isChangeTemplate && gMsgCompose.bodyModified) {
          let cancelled = false,
            w1 = util.getBundleString("st.notification.editedChangeWarning"),
            q1 = util.getBundleString("st.notification.editedChangeChallenge");
          SmartTemplate4.Message.display(
            w1.replace("{0}", fileTemplateSource.label) + "\n" + q1,
            "centerscreen,titlebar,modal,dialog",
            {
              ok: function () {},
              cancel: function () {
                cancelled = true;
              },
            },
            win
          );
          if (cancelled) {
            let popped = flags.filePaths.pop();
            util.logDebugOptional(
              "fileTemplates",
              `notifyComposeBodyReady: [cancelled] Removed file from template stack: ${popped}`
            );
            return;
          }
        }
        flags.isChangeTemplate = isChangeTemplate;
        await this.smartTemplate.insertTemplate(isStartup, flags, fileTemplateSource); // if a Tb template is opened, process without removal
        // store a flag in the document
        // [issue 108] Other Add-ons may accidentally duplicate template if they set from identity
        // root.setAttribute("smartTemplateInserted","true"); <== moved into the insertTemplate function!
        // window.smartTemplateInserted = true;
        this.smartTemplate.resetDocument(editor, true);
        if (isChangeTemplate) {
          util.logDebugOptional("functions", "Change Template: insertTemplate() complete.");
        } else {
          util.logDebugOptional("functions", "insertTemplate(startup) complete.");
        }
      } else {
        util.logDebug("smartTemplateInserted is already set");
      }

      //set focus to editor

      let FocusElement, FocusId;
      const messageEditorID = "messageEditor";

      // if we load a template ST4 processing will have been done before the template was saved.
      // composeCase is set during insertTemplate
      switch (this.smartTemplate.composeCase) {
        case "tbtemplate":
        case "new": // includes msgComposeType.Template and msgComposeType.MailToUrl
        case "forward":
          if (gMsgCompose.type == msgComposeType.MailToUrl)
            // this would have the to address already set
            FocusId = messageEditorID; // Editor
          else {
            FocusId = messageEditorID; // editor is fallback
            // find the "to" line
            let foundTo = false;
            let adContainer = window.document.getElementById("toAddrContainer");
            if (adContainer) {
              let adPill = adContainer.querySelector("mail-address-pill"); // first match if an address pill exists
              if (!adPill) {
                let input = window.document.getElementById("toAddrInput");
                if (input) {
                  FocusId = input.id;
                }
              }
            }
          }
          break;
        default: // 'reply'  - what about mailto?
          FocusId = messageEditorID; // Editor
      }
      FocusElement = window.document.getElementById(FocusId);
      if (FocusElement) {
        FocusElement.focus();
      }
    } catch (ex) {
      util.logException("notifyComposeBodyReady", ex);
      if (isInserted) root.setAttribute("smartTemplateInserted", "true");
    }
    util.logDebugOptional("composer", "notifyComposeBodyReady() ended.");
  },

  // -------------------------------------------------------------------
  // A handler to switch identity
  // -------------------------------------------------------------------
  loadIdentity: async function (options = {}) {
    const prefs = SmartTemplate4.Preferences,
      util = SmartTemplate4.Util;
    let isTemplateProcessed = false;
    let isChangeFromViaSmartTemplate = false;
    if (typeof options.setFromHeader != "undefined" && options.setFromHeader) {
      isChangeFromViaSmartTemplate = true;
    }
    SmartTemplate4.Util.logDebugOptional("functions", "SmartTemplate4.loadIdentity()");
    SmartTemplate4.Util.logHighlight("loadIdentity()", "yellow", "rgb(0,80,0)");
    {
      let isBodyModified = gMsgCompose.bodyModified,
        composeType = util.getComposeType();

      let newSig;
      // change identity on an existing message:
      // Check body modified or not
      // we can only reliable roll back the previous template and insert
      // a new one if the user did not start composing yet (otherwise danger
      // of removing newly composed content)
      // note I used (!isBodyModified) but this lies in Thunderbird 115 !!
      // LoadIdentity(), before calling compose-from-changed, sets gMsgCompose.identity,
      // which _always_ toggles the flag to true temporarily, so we cannot rely on it being correct.
      let isOverrideBodyModified = false;
      if (isBodyModified) {
        let question = util.getBundleString("st.notification.bodyModified"),
          detail,
          instructions = util.getBundleString("st.notification.bodyModified.instructions");

        if (window.SmartTemplate4.CurrentTemplate) {
          let templateName =
            window.SmartTemplate4.CurrentTemplate.label ||
            window.SmartTemplate4.CurrentTemplate.path;
          detail = util.getBundleString("st.notification.bodyModified.externalTemplate", [
            templateName,
          ]);
        } else {
          detail = util.getBundleString("st.notification.bodyModified.accountTemplate");
        }
        if (SmartTemplate4.PreprocessingFlags.isBodyUnmodified) {
          isOverrideBodyModified = true;
        } else {
          isOverrideBodyModified = confirm(question + "\n" + detail + "\n\n" + instructions);
        }
      }

      if (
        !isChangeFromViaSmartTemplate && // don't trigger a tempalte reload in case header.set(from) was called!!
        (!isBodyModified || isOverrideBodyModified)
      ) {
        // ask user it isBodyModified is really true...
        // [issue 51]
        // this.original_LoadIdentity(false); // make sure Tb does everything it needs to the from header!
        // Add template message - will also remove previous template and quoteHeader.
        if (window.SmartTemplate4.CurrentTemplate) {
          //[issue 64] reload the same template if it was remembered.
          let fileTemplateSource = SmartTemplate4.fileTemplates.retrieveTemplate(
            window.SmartTemplate4.CurrentTemplate
          );
          if (fileTemplateSource.failed) {
            // shouldn't actually happen as we just loaded it before
            let text = util.getBundleString("st.fileTemplates.error.filePath");
            alert(text);
          } else {
            if (isOverrideBodyModified) {
              window.SmartTemplate4.PreprocessingFlags.identitySwitched = true;
            }
            await this.smartTemplate.insertTemplate(
              false,
              window.SmartTemplate4.PreprocessingFlags,
              fileTemplateSource
            );
          }
        } else {
          await this.smartTemplate.insertTemplate(false);
        }
        // [Bug 25104] when switching identity, old sig does not get removed.
        //             (I think what really happens is that it is inserted twice)
        isTemplateProcessed = true;
      } else {
        // if previous id has added a signature, we should try to remove it from there now
        // we do not touch smartTemplate4-quoteHeader or smartTemplate4-template
        // as the user might have edited here already!
        // however, the signature is important as it should match the from address?
        if (prefs.getMyBoolPref("removeSigOnIdChangeAfterEdits")) {
          newSig = await this.smartTemplate.extractSignature(
            gMsgCompose.identity,
            false,
            composeType
          );
        }
      }
      // AG 31/08/2012 put this back as we need it!
      // AG 24/08/2012 we do not call this anymore if identity is changed before body is modified!
      //               as it messes up the signature (pulls it into the blockquote)
      // AG 27/11/2019 [issue 7] putting condition back as it can mess up signature.
      if (!isTemplateProcessed) {
        if (isBodyModified && composeType == "new") {
          // when Thunderbird changes identity, we cannot keep our JavaScript stuff / late resolved variables around.
          await util.cleanupDeferredFields(true); // remove the fields even if they can't be resolved!
        }
        // this.original_LoadIdentity(startup);
        // try replacing the (unprocessed) signature that Thunderbird has inserted.
        if (prefs.getMyBoolPref("parseSignature") && newSig) {
          // find and replace signature node.
          let sigNode = util.findChildNode(SmartTemplate4.composer.body, "moz-signature");
          if (sigNode) {
            sigNode.innerHTML = newSig.innerHTML;
          }
          gMsgCompose.bodyModified = isBodyModified; // restore body modified flag!
        }
      }
      if (!isBodyModified && gMsgCompose.bodyModified) {
        gMsgCompose.editor.resetModificationCount();
      } // for TB bug?
    }
  },

  // -------------------------------------------------------------------
  // Escape to HTML character references
  // -------------------------------------------------------------------
  escapeHtml: function escapeHtml(str) {
    return str
      .replace(/&/gm, "&amp;")
      .replace(/</gm, "&lt;")
      .replace(/>/gm, "&gt;")
      .replace(/\n/gm, "<br>"); // remove quote replacements
  },

  // -------------------------------------------------------------------
  // Initialize - we only call this from the compose window
  // -------------------------------------------------------------------
  init: function init() {
    // let prevIdentity = gCurrentIdentity;
    // let isBackgroundParser = SmartTemplate4.Preferences.isBackgroundParser(); // [issue 184]

    // http://mxr.mozilla.org/comm-central/source/mail/components/compose/content/MsgComposeCommands.js#3998
    SmartTemplate4.Util.logDebug("SmartTemplate4.init()");

    this.pref = new SmartTemplate4.classPref();

    // a class instance.
    this.smartTemplate = new SmartTemplate4.classSmartTemplate();
    // this.cal = new this.classCalIDateTimeFormatter(true);

    // Time of %A-Za-z% is today(default)
    this.whatIsX = this.XisToday;
    this.whatIsUtc = false;
    this.whatIsDateOffset = 0;
    this.whatIsHourOffset = 0;
    this.whatIsMinuteOffset = 0;
    this.whatIsTimezone = ""; //default timezone
    // flag for deferred vairables - once we add an event handler into the composer content script for clicking on
    // not (yet) existing headers [e.g. %To(Name)% in a new Email] we set this variable to true
    // (avoids having the function there multiple times)
    this.hasDeferredVars = false;

    SmartTemplate4.Util.logDebug("SmartTemplate4.init() ends.");
  },

  setStatusIconMode: function setStatusIconMode(elem) {
    try {
      this.Preferences.setMyIntPref("statusIconLabelMode", parseInt(elem.value));
      this.updateStatusBar(elem.parentNode.firstChild.checked);
    } catch (ex) {
      SmartTemplate4.Util.logException("setStatusIconMode", ex);
    }
  },

  updateStatusBar: function (show) {
    const prefs = SmartTemplate4.Preferences,
      util = SmartTemplate4.Util,
      licenseInfo = SmartTemplate4.Util.licenseInfo;
    try {
      util.logDebug(
        "SmartTemplate4.updateStatusBar(" + show + ") ... with licenseInfo = ",
        licenseInfo
      );
      let isDefault = typeof show == "undefined" || show == "default",
        isVisible = isDefault ? prefs.getMyBoolPref("showStatusIcon") : show,
        doc = isDefault ? document : util.Mail3PaneWindow.document,
        btn = doc.getElementById("SmartTemplate4Messenger");
      if (btn) {
        let labelMode = prefs.getMyIntPref("statusIconLabelMode");
        btn.classList.remove(...btn.classList); // clear classlist array
        btn.classList.add("statusbarpanel-iconic-text");
        if (SmartTemplate4.Preferences.getMyBoolPref("hasNews")) {
          btn.classList.add("newsflash"); // this should have precedence over other settings!
          btn.classList.add("always");
          return;
        }

        if (licenseInfo.licenseKey) {
          let days = licenseInfo.licensedDaysLeft,
            wrn = null;
          if (licenseInfo.isExpired) {
            wrn = util.getBundleString("licenseStatus.expired", [licenseInfo.expiredDays]);
            btn.classList.add("alertExpired");
          } else if (days < 15) {
            wrn = util.getBundleString("licenseStatus.willExpire", [days]);
            btn.classList.add("alert");
          }
          if (wrn) {
            btn.label = wrn;
            isVisible = true;
            labelMode = 2;
          } else {
            if (licenseInfo.keyType == 2) {
              btn.label = "SmartTemplates";
            } else {
              btn.label = "SmartTemplates Pro";
            }
          }
        } else {
          btn.label = "SmartTemplates";
        }
        btn.setAttribute("collapsed", !isVisible);

        switch (labelMode) {
          case 0:
            btn.classList.add("labelHidden");
            break;
          case 1:
            //NOP;
            break;
          case 2:
            btn.classList.add("always");
            break;
        }
        util.logDebugOptional(
          "functions",
          `SmartTemplate4Messenger btn.className = ${
            btn.className
          } , collapsed = ${btn.getAttribute("collapsed")}`
        );
      } else {
        util.logDebugOptional(
          "functions",
          "SmartTemplate4.updateStatusBar() - button SmartTemplate4Messenger not found in " + doc
        );
      }
    } catch (ex) {
      util.logException("SmartTemplate4.updateStatusBar() failed ", ex);
    }
  },

  // all main window elements that change depending on license status
  initLicensedUI: function ST_initLicensedUI() {
    SmartTemplate4.Util.logDebug("initLicensedUI()", SmartTemplate4.Util.licenseInfo);
    SmartTemplate4.updateStatusBar();
    SmartTemplate4.updateNewsLabels();
  },

  startUp: function ST_startUp() {
    const util = SmartTemplate4.Util;
    // let v = util.VersionProxy();

    //  a hack for the status bar icon:
    window.setTimeout(function () {
      if (window.document.URL.endsWith("messenger.xhtml"))
        window.SmartTemplate4.updateStatusBar("default");
    }, 2000);

    SmartTemplate4.Util.notifyTools.notifyBackground({ func: "updateNewsLabels" }); // initialize new-related buttons in case there was an ignored update!
    util.logDebug("startUp complete");
  },

  shutDown: function (isMainWindow = false) {
    const util = SmartTemplate4.Util;
    util.logDebug("Remove added custom UI elements …");
    let elements = Array.from(window.document.querySelectorAll("[st4uiElement]"));
    for (let element of elements) {
      element.remove();
    }
    SmartTemplate4.fileTemplates.tabConfigured = false;

    util.logDebug("shutDown complete");
  },

  signatureDelimiter: "-- <br>",

  // show news on update
  updateNewsLabels: function () {
    const util = SmartTemplate4.Util,
      licenseInfo = SmartTemplate4.Util.licenseInfo;
    let hasNews = SmartTemplate4.Preferences.getMyBoolPref("hasNews"),
      btn = document.getElementById("SmartTemplate4Button"),
      btnStatus = document.getElementById("SmartTemplate4Messenger");
    // for styling button parent background image
    //   in  Tb115 we need to add the class to the parent <div class="live-content">!
    function addClass(element, c) {
      element.classList.add(c);
      element.parentElement.classList.add(c);
    }
    function removeClass(element, c) {
      element.classList.remove(c);
      element.parentElement.classList.remove(c);
    }

    if (!btn) {
      return;
    }
    let txt = "",
      tooltip = "";

    if (licenseInfo.licenseKey) {
      let days = licenseInfo.licensedDaysLeft,
        wrn = null;
      if (licenseInfo.status == "Invalid") {
        addClass(btn, "expired");
        wrn = util.getBundleString("SmartTemplateMainButton.invalid");
      } else if (licenseInfo.isExpired) {
        wrn = util.getBundleString("SmartTemplateMainButton.expired");
        addClass(btn, "expired");
        removeClass(btn, "renew");
        tooltip = SmartTemplate4.Util.getBundleString("licenseStatus.expired", [
          licenseInfo.expiredDays,
        ]);
      } else if (days < 15) {
        wrn = util.getBundleString("SmartTemplateMainButton.renew", [days]);
        removeClass(btn, "expired");
        addClass(btn, "renew");
        tooltip = SmartTemplate4.Util.getBundleString("st.menu.license.tooltip", [
          "SmartTemplates",
        ]);
      } else {
        removeClass(btn, "expired");
        removeClass(btn, "renew");
      }
      if (wrn) {
        txt = wrn + util.salesLabel(licenseInfo);
      }
    }

    if (hasNews) {
      txt = util.getBundleString("SmartTemplateMainButton.updated");
      addClass(btn, "newsflash");
      tooltip = util.getBundleString("st.menu.update.tooltip", ["SmartTemplates"]);
      btnStatus.classList.add("newsflash");
      // add clarity - what to do. read news (resets button) or check out the sale
      // Show if a sale is active, but only for anyone who is not a Pro / Domain user with valid license
      // otherwise we show the standard "read news!"
      if (util.isSale && !(licenseInfo?.status == "Valid" && licenseInfo.keyType != 2)) {
        txt += util.salesLabel(licenseInfo);
      } else {
        txt += util.getBundleString("SmartTemplateMainButton.updated.read");
      }
    } else {
      removeClass(btn, "newsflash");
      btnStatus.classList.remove("newsflash");
    }
    if (!txt) {
      txt = util.getBundleString("smartTemplate4.settings.label");
      btnStatus.classList.remove("newsflash");
    }
    let newsMenu = document.getElementById("smartTemplates-news");
    newsMenu.classList.remove("checkLicense");
    if (util.isSale) {
      const salesNotificationTxt = util.salesLabel(licenseInfo),
        menuDefaultTxt = util.getBundleString("newsHead");
      if (!licenseInfo.licenseKey || !licenseInfo.isValid) {
        newsMenu.label = menuDefaultTxt + " " + salesNotificationTxt;
        newsMenu.classList.add("checkLicense");
      }
    }

    // uses browser.browserAction.setTitle()
    SmartTemplate4.Util.notifyTools.notifyBackground({ func: "setActionTip", text: tooltip });

    // used browser.browserAction.setLabel()
    SmartTemplate4.Util.notifyTools.notifyBackground({ func: "setActionLabel", text: txt });
  },

  get XML_replyMenus() {
    return `
      <menu label="__MSG_pref_rsp.tab__" id="smartTemplates-reply-menu" class="menu-iconic" controller="cmd_reply" accesskey="__MSG_st.menuaccess.reply__">
        <menupopup>
          <menuitem id="smartTemplates-reply-last" label="__MSG_st.menu.template.last__" class="menuitem-iconic st-last-rsp st-mru" oncommand="window.SmartTemplate4.doCommand(this);"  onclick="event.stopPropagation();"/>
          <menuitem id="smartTemplates-reply-default" label="__MSG_st.menu.template.default__" class="menuitem-iconic" oncommand="window.SmartTemplate4.doCommand(this);"  onclick="event.stopPropagation();"/>
        </menupopup>
      </menu>
      <menu label="__MSG_st.menu.replyAll__" id="smartTemplates-reply-all-menu" class="menu-iconic" controller="cmd_replyAll" accesskey="__MSG_st.menuaccess.replyAll__">
        <menupopup>
          <menuitem id="smartTemplates-reply-all-last" label="__MSG_st.menu.template.last__" class="menuitem-iconic st-last-rsp st-mru" oncommand="window.SmartTemplate4.doCommand(this);"  onclick="event.stopPropagation();"/>
          <menuitem id="smartTemplates-reply-all-default" label="__MSG_st.menu.template.default__" class="menuitem-iconic" oncommand="window.SmartTemplate4.doCommand(this);"  onclick="event.stopPropagation();"/>
        </menupopup>
      </menu>
      <menu label="__MSG_st.menu.replyList__" id="smartTemplates-reply-list-menu" class="menu-iconic" controller="cmd_replyList" accesskey="__MSG_st.menuaccess.replyList__">
        <menupopup>
          <menuitem id="smartTemplates-reply-list-last" label="__MSG_st.menu.template.last__" class="menuitem-iconic st-last-rsp st-mru" oncommand="window.SmartTemplate4.doCommand(this);"  onclick="event.stopPropagation();"/>
          <menuitem id="smartTemplates-reply-list-default" label="__MSG_st.menu.template.default__" class="menuitem-iconic" oncommand="window.SmartTemplate4.doCommand(this);"  onclick="event.stopPropagation();"/>
        </menupopup>
      </menu>
    `;
  },

  get XML_forwardMenus() {
    return `
            <menu label="__MSG_pref_fwd.tab__" id="smartTemplates-forward-menu" class="menu-iconic" controller="cmd_forward"  accesskey="__MSG_st.menuaccess.forward__">
              <menupopup>
                <menuitem id="smartTemplates-forward-last" label="__MSG_st.menu.template.last__" class="menuitem-iconic st-last-fwd st-mru" oncommand="window.SmartTemplate4.doCommand(this);"  onclick="event.stopPropagation();"/>
                <menuitem id="smartTemplates-forward-default" label="__MSG_st.menu.template.default__" class="menuitem-iconic" oncommand="window.SmartTemplate4.doCommand(this);"  onclick="event.stopPropagation();"/>
              </menupopup>
            </menu>
    `;
  },

  get XML_toggleLabelMenu() {
    let isDisabled = window.SmartTemplate4.Preferences.getMyBoolPref("toolbar.hideLabel")
      ? `checked="true"`
      : "";
    return `
      <menuitem id="smartTemplates-toggle-label" label="__MSG_st.menu.hideLabel__" class="menuitem-iconic st-toggle-label" oncommand="window.SmartTemplate4.doCommand(this);" type="checkbox" ${isDisabled} onclick="event.stopPropagation();" />
    `;
  },

  moveMenuItems: function (toolbarButton, newPopupSelector) {
    let activePopup = toolbarButton.querySelector("menupopup[data-action-menu]");
    let newPopup = toolbarButton.querySelector(newPopupSelector);

    if (newPopup) {
      let moveNodes = [];
      for (let e of newPopup.childNodes) {
        moveNodes.push(e);
      }
      for (let m of moveNodes) {
        activePopup.appendChild(m);
      }
      SmartTemplate4.Util.logDebug("Moved elements to popup:", moveNodes);
      newPopup.remove();
      return true;
    } else {
      SmartTemplate4.Util.logDebug(
        `moveMenuItems() - didn't find ${newPopupSelector}, so I couldn't patch the popup menu`
      );
      console.log(toolbarButton);
    }
  },

  patchUnifiedToolbar: function () {
    // THUNDERBIRD 115
    // fix selectors
    let mainButton = document.querySelector(
      "button[extension='smarttemplate4@thunderbird.extension']"
    );
    if (!mainButton) {
      return false; // no button found, we're probably in a content tab
    }

    mainButton.id = "SmartTemplate4Button";
    // mainButton.setAttribute("popup", "smartTemplatesMainPopup");

    if (mainButton.querySelector("#smartTemplates-reply-menu")) {
      return true; // this one is already patched.
    }

    // this method worked in quickFilters:
    // overload the menupopup based on the id we just added:
    // note: there is no command controller for write new
    //       - instead the menu item calls "MsgNewMessage(null);
    //        <button id="SmartTemplate4Button">
    //        </button>

    var XHTML_Markup = `<vbox id="titlebar">
  <div id="smartTemplatesMainPopup" style="display:none;">
    <menuitem id="smartTemplates-checklicense" label="__MSG_st.menu.license__" class="menuitem-iconic checkLicense marching-ants" oncommand="window.SmartTemplate4.doCommand(this);"  onclick="event.stopPropagation();"/>
    <menu label="__MSG_pref_new.tab__"  id="smartTemplates-write-menu" class="menu-iconic" controller="cmd_newMessage" accesskey="__MSG_st.menuaccess.write__">
      <menupopup>
        <menuitem id="smartTemplates-write-last" label="__MSG_st.menu.template.last__" class="menuitem-iconic st-last-new st-mru" oncommand="window.SmartTemplate4.doCommand(this);"  onclick="event.stopPropagation();"/>
        <menuitem id="smartTemplates-write-default" label="__MSG_st.menu.template.default__" class="menuitem-iconic" oncommand="window.SmartTemplate4.doCommand(this);"  onclick="event.stopPropagation();"/>
      </menupopup>
    </menu>
    ${this.XML_replyMenus}
    ${this.XML_forwardMenus}
    <menuitem id="smartTemplates-news" label="__MSG_newsHead__" class="menuitem-iconic" oncommand="window.SmartTemplate4.doCommand(this);"  onclick="event.stopPropagation();"/>
    <menuitem id="smartTemplates-settings" label="__MSG_pref_dialog.title__" class="menuitem-iconic" oncommand="window.SmartTemplate4.doCommand(this);"  onclick="event.stopPropagation();"/>

    <menu id="smartTemplates-docs" label="__MSG_st.menu.docs__" class="menu-iconic">
      <menupopup>
        <menuitem id="smartTemplates-support" label="__MSG_st.menu.supportSite__" class="menuitem-iconic" oncommand="window.SmartTemplate4.doCommand(this);"  onclick="event.stopPropagation();"/>
        <menuitem id="smartTemplates-variables" label="__MSG_st.menu.docs.variables__" class="menuitem-iconic" oncommand="window.SmartTemplate4.doCommand(this);"  onclick="event.stopPropagation();"/>
        <menuitem id="smartTemplates-premium" label="__MSG_st.menu.docs.premium__" class="menuitem-iconic" oncommand="window.SmartTemplate4.doCommand(this);"  onclick="event.stopPropagation();"/>
      </menupopup>
    </menu>

    <menu id="smartTemplates-tests" label="Test" class="menu-iconic">
      <menupopup>
        <menuitem id="smartTemplates-settings-legacy" label="__MSG_preferences_legacy__" class="menuitem-iconic" oncommand="window.SmartTemplate4.doCommand(this);"  onclick="event.stopPropagation();"/>
        <menuitem id="smartTemplates-setNewsFlag" label="Set News Flag!" class="menuitem-iconic" oncommand="window.SmartTemplate4.doCommand(this);"  onclick="event.stopPropagation();"/>
        <menuseparator class="st4templateSeparator"></menuseparator>
        <menuitem id="smartTemplates-headerMenuAPI" label="Create message Actions (API)" class="menuitem-iconic" oncommand="window.SmartTemplate4.doCommand(this);"  onclick="event.stopPropagation();"/>
        <menuitem id="smartTemplates-MruMenuAPI" label="Update MRU (API)" class="menuitem-iconic" oncommand="window.SmartTemplate4.doCommand(this);"  onclick="event.stopPropagation();"/>
        <menuitem id="smartTemplates-installed" label="Splashscreen - After Installation" class="menuitem-iconic" oncommand="window.SmartTemplate4.doCommand(this);"  onclick="event.stopPropagation();"/>
        <menuitem id="smartTemplates-templatemenus" label="Update Template Menus!" class="menuitem-iconic" oncommand="window.SmartTemplate4.doCommand(this);"  onclick="event.stopPropagation();"/>
        <menuitem id="smartTemplates-mru-save" label="Save MRU list" class="menuitem-iconic" oncommand="window.SmartTemplate4.doCommand(this);"  onclick="event.stopPropagation();"/>
        <menuitem id="smartTemplates-mru-load" label="Load MRU list" class="menuitem-iconic" oncommand="window.SmartTemplate4.doCommand(this);"  onclick="event.stopPropagation();"/>
        <menuitem id="smartTemplates-labelUpdate" label="Update Button labels" class="menuitem-iconic" oncommand="window.SmartTemplate4.doCommand(this);"  onclick="event.stopPropagation();"/>
        <menuitem id="smartTemplates-registration" label="License Screen" class="menuitem-iconic" oncommand="window.SmartTemplate4.doCommand(this);"  onclick="event.stopPropagation();"/>
      </menupopup>
    </menu>

  </div>
</vbox>`;

    this.WL.injectElements(XHTML_Markup);
    let theMenu = window.document.querySelector("div#smartTemplatesMainPopup");
    if (theMenu) {
      mainButton.appendChild(theMenu);
      this.moveMenuItems(mainButton, "#smartTemplatesMainPopup");
      return true;
    }
    return false;
  },

  patchHeaderPane: function (doc, message_display_action_btn) {
    if (SmartTemplate4.fileTemplates.isAPIpatched) {
      return false;
    }
    const PatchedBtnClass = "SmartTemplates_HeaderBtn"; // use this for styles & as flag for having been patched
    const isDebug = SmartTemplate4.Preferences.isDebugOption("fileTemplates.menus");
    if (isDebug) {
      SmartTemplate4.Util.logDebugOptional(
        "fileTemplates.menus",
        "Patching Header Pane for document [Legacy]",
        doc
      );
    }
    if (!doc) {
      doc = this.Util.documentMessageBrowser;
    }
    if (!message_display_action_btn) {
      message_display_action_btn = doc.querySelector(
        "#smarttemplate4_thunderbird_extension-messageDisplayAction-toolbarbutton"
      );
    }
    if (!message_display_action_btn) {
      SmartTemplate4.Util.logDebugOptional(
        "fileTemplates.menus",
        "Couldn't find message display action button. aborting patchHeaderPane()"
      );
      return false; // button not found
    }
    if (
      message_display_action_btn.classList.contains(PatchedBtnClass) &&
      message_display_action_btn.querySelector(
        "menupopup[data-action-menu] #smartTemplates-reply-menu"
      )
    ) {
      SmartTemplate4.Util.logDebugOptional(
        "fileTemplates.menus",
        "Header button is already patched. aborting patchHeaderPane()",
        message_display_action_btn
      );
      return true; // already patched
    }
    // data-extensionid="smarttemplate4@thunderbird.extension"

    var XHTML_Markup = `<toolbarbutton id="${message_display_action_btn.id}">
      <div id="SmartTemplates_HeaderMenu" style="display:none;">
        ${this.XML_replyMenus}
        ${this.XML_forwardMenus}
        ${this.XML_toggleLabelMenu}
        <menuseparator class="st4templateSeparator"/>
        <menuitem id="smartTemplates-settings" label="__MSG_pref_dialog.title__" class="menuitem-iconic" oncommand="window.SmartTemplate4.doCommand(this);"  onclick="event.stopPropagation();"/>
      </div>
    </toolbarbutton>
    `;
    var WL = doc.ownerGlobal?.SmartTemplate4_WLM || this.WL;
    SmartTemplate4.Util.logDebugOptional("fileTemplates.menus", "window loader injecting...", {
      XHTML_Markup,
    });
    WL.injectElements(XHTML_Markup);
    message_display_action_btn.classList.add(PatchedBtnClass);

    SmartTemplate4.moveMenuItems(message_display_action_btn, "#SmartTemplates_HeaderMenu");
  },

  // prepare the popup menu of header area.
  clearActionMenu: function () {
    let doc = SmartTemplate4.Util.getMessageBrowserDocument();
    let message_display_action_btn = doc.querySelector(
      "#smarttemplate4_thunderbird_extension-messageDisplayAction-toolbarbutton"
    );
    if (!message_display_action_btn) return;
    let menuitems = [
      ...message_display_action_btn.querySelector("menupopup[data-action-menu]").childNodes,
    ];
    if (!menuitems) return;
    // remove menus, menuitems and separators:
    let nodes = menuitems.filter((e) => e.tagName.startsWith("menu"));
    for (let n of nodes) {
      // only popups first
      // if (!n?.id.startsWith("smartTemplates-")) continue;
      // if (!(n.id.includes("-write") || n.id.includes("-reply") || n.id.includes("-forward"))) continue;
      n.remove();
    }
  },

  clearMenu_MRU: function () {},

  TabEventListeners: {}, // make a map of tab event listeners
  addTabEventListener: function () {
    try {
      let tabContainer = SmartTemplate4.Util.tabContainer;
      this.TabEventListeners["TabSelect"] = function (event) {
        SmartTemplate4.TabListener.selectTab(event);
      };
      this.TabEventListeners["TabOpen"] = function (event) {
        SmartTemplate4.TabListener.openTab(event);
      };
      for (let key in this.TabEventListeners) {
        tabContainer.addEventListener(key, this.TabEventListeners[key], false);
      }
    } catch (e) {
      Services.console.logStringMessage("SmartTemplates: No tabContainer available! ", e);
      SmartTemplate4._tabContainer = null;
    }
  },
  removeTabEventListener: function () {
    // this might not be necessary, as we iterate ALL event listeners when add-on shuts down
    // (see "undo monkey patch" in qFi-messenger.js)
    let tabContainer = SmartTemplate4.Util.tabContainer;
    for (let key in this.TabEventListeners) {
      tabContainer.removeEventListener(key, this.TabEventListeners[key]);
    }
  },
  TabListener: {
    selectTab: async function (evt) {
      const isMailPane = SmartTemplate4.Util.isTabMode(evt.detail.tabInfo, "mail");
      if (isMailPane) {
        const HEADERBARID =
          "smarttemplate4_thunderbird_extension-messageDisplayAction-toolbarbutton";

        let result = await SmartTemplate4.Util.notifyTools.notifyBackground({
          func: "patchUnifiedToolbar",
        });
        await SmartTemplate4.fileTemplates.initMenus(true, { toolbarType: "unified" });

        if (SmartTemplate4.fileTemplates.isAPIpatched) {
          return; // header Patch obsolete for API method
        }

        let doc;
        let currentTabMode = SmartTemplate4.Util.getTabMode(gTabmail.selectedTab);
        // there are tab modes that have no access to document3pane! e.g. contentTab
        switch (currentTabMode) {
          case "mailMessageTab":
            doc = SmartTemplate4.Util.document3pane;
            break;
          case "mail3PaneTab":
            let browser = SmartTemplate4.Util.document3pane.getElementById("messageBrowser");
            doc = browser.contentDocument;
            break;
        }
        if (doc) {
          let headerButton = doc.getElementById(HEADERBARID);
          if (SmartTemplate4.patchHeaderPane(doc, headerButton)) {
            await SmartTemplate4.fileTemplates.initMenus(true, { toolbarType: "messageheader" });
          }
        }
      }
    },
    openTab: function (evt) {
      function getTabDebugInfo(tab) {
        return `[ mode = ${tab.mode.name}, title = ${tab.title}, tabId = ${tab.tabId} ]`;
      }

      if (SmartTemplate4.fileTemplates.isAPIpatched) {
        return; // header Patch obsolete for API method
      }
      let tabmail = document.getElementById("tabmail");
      const newTabInfo = tabmail.tabInfo.find((e) => e == evt.detail.tabInfo);
      const RETRY_DELAY = 2500;
      if (newTabInfo) {
        const isMailPane = SmartTemplate4.Util.isTabMode(newTabInfo, "mail");
        // patching the toolbar may be not necessary in this case (?)
        // as I believe we cannot open a new mail in tab unless
        // we are already on a mail / folder tab.
        /*
        if (isMailPane) {
          SmartTemplate4.Util.notifyTools.notifyBackground({func: "patchUnifiedToolbar"});
        }
        */

        if (newTabInfo.SmartTemplates_patched) {
          SmartTemplate4.Util.logDebug("Tab is already patched: " + getTabDebugInfo(newTabInfo));
          return;
        }
        if (isMailPane) {
          // let's include single message tabs, let's see what happens
          try {
            if (typeof newTabInfo.chromeBrowser.contentWindow.commandController == "undefined") {
              SmartTemplate4.Util.logDebug(
                "commandController not defined, retrying later..." + getTabDebugInfo(newTabInfo)
              );
              setTimeout(() => {
                SmartTemplate4.TabListener.openTab(evt);
              }, RETRY_DELAY);
              return;
            }
          } catch (ex) {
            SmartTemplate4.Util.logException("Patching failed", ex);
            return;
          }

          newTabInfo.SmartTemplates_patched = true;
          SmartTemplate4.Util.logDebug("new Tab patched successfully.");
        }
      }
    },
  },
};  // Smarttemplate4

// -------------------------------------------------------------------
// Get day name and month name (localizable!)
// locale optional for locale
// -------------------------------------------------------------------
// this was classCalIDateTimeFormatter
// replace with --  const loc = new Localization(["toolkit/intl/regionNames.ftl"], true);
SmartTemplate4.calendar = {
    currentLocale : null, // whatever was passed into %language()%
    bundleLocale: null,
    bundle: null,
    list: function list() {
      let str = "";
      for (let i=0;i<7 ;i++){
        str+=(cal.dayName(i)  +"("+ cal.shortDayName(i) + ")/");
      } 
      str += "\n";
      for (let i=0;i<12;i++){
        str+=(cal.monthName(i)+"("+ cal.shortMonthName(i) + ")/");
      }
      return str;
    },
    
    init: function init(forcedLocale) {
      const util = SmartTemplate4.Util;

      // validate the passed locale name for existence
      // https://developer.mozilla.org/en-US/docs/How_to_enable_locale_switching_in_a_XULRunner_application
      if (forcedLocale) {
        let availableLocales = util.getAvailableLocales("smarttemplate4"), // smarttemplate4-locales
            found = false,
            fullMatch = false,
            listLocales = "";
        while (availableLocales.hasMore()) {
          let aLocale = availableLocales.getNext();
          listLocales += aLocale.toString() + ', ';
          if (aLocale == forcedLocale) { // match completely, e.g/ "en" or "en-GB"
            this.bundleLocale = aLocale;
            fullMatch = true;
            found = true;
          }
          if (!fullMatch && aLocale.indexOf(forcedLocale)==0) {  // allow en to match en-UK, en-US etc.
            this.bundleLocale = aLocale;
            found = true;
          }
        }
        if (!found) {
          let errorText =   "Unsupported %language% id: " + forcedLocale + "\n"
                          + "Available in SmartTemplate4: " + listLocales.substring(0, listLocales.length-2) + "\n"
                          + "This will affect the following variables: %A% %a% %B% %b% (week days and months) ";
          util.logToConsole(errorText);
          this.bundleLocale = null;
        }
        else {
          util.logDebug("calendar - found extension locales: " + listLocales + "\nconfiguring " + forcedLocale);
        }
      }     
      this.currentLocale = forcedLocale; // if not passed in, this will use the default locale for date translations 
      let bundleUri = this.bundleLocale 
        ? "chrome://smarttemplate4-locales/content/" + this.bundleLocale 
        : "chrome://smarttemplate4/locale"; // determined by currently active Thunderbird locale
      this.bundle = Services.strings.createBundle(bundleUri + "/calender.properties");
    },
    
    // the following functions retrieve strings from our own language packs (languages supported by SmartTemplate itself)
    // these will affect the following variables: %A% %a% %B% %b% (week days and months)
    // OTOH: %dateshort% and %datelocal% extract their names from the language packs installed
    dayName: function dayName(n){ 
      return this.bundle.GetStringFromName("day." + (n + 1) + ".name");
    },
    
    shortDayName: function shortDayName(n) { 
      return this.bundle.GetStringFromName("day." + (n + 1) + ".short");
    },
    
    monthName: function monthName(n){ 
      return this.bundle.GetStringFromName("month." + (n + 1) + ".name");
    },
    
    shortMonthName: function shortMonthName(n) { 
      return this.bundle.GetStringFromName("month." + (n + 1) + ".short");
    }
};   // SmartTemplate4.calendar 
  
