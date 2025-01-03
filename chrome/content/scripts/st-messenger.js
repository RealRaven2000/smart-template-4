//original lds this after xul!!

// ChromeUtils.importESModule("chrome://smarttemplate4/content/smartTemplate-main.js", { global: "contextual" });
Services.scriptloader.loadSubScript("chrome://smarttemplate4/content/smartTemplate-main.js", window, "UTF-8");

Services.scriptloader.loadSubScript("chrome://smarttemplate4/content/scripts/hackToolbarbutton.js", window.SmartTemplate4, "UTF-8");
Services.scriptloader.loadSubScript("chrome://smarttemplate4/content/smartTemplate-util.js", window, "UTF-8");
Services.scriptloader.loadSubScript("chrome://smarttemplate4/content/smartTemplate-prefs.js", window, "UTF-8");
Services.scriptloader.loadSubScript("chrome://smarttemplate4/content/smartTemplate-fileTemplates.js", window, "UTF-8");

var mylisteners = {};

async function onLoad(activatedWhileWindowOpen) {
  let layout = WL.injectCSS("chrome://smarttemplate4/content/skin/smartTemplate-overlay.css");
  /** Main Toolbar **/
  WL.injectCSS("chrome://smartTemplate4/content/skin/common/smartTemplate-toolButton.css");
  WL.injectCSS("chrome://smartTemplate4/content/skin/common/smartTemplate-actionButton.css");

  const util = window.SmartTemplate4.Util;
  
  // for version specific code / style fixes
  if (util.versionGreaterOrEqual(util.AppverFull, "102")) {
    WL.injectCSS("chrome://smarttemplate4/content/skin/smartTemplate-overlay-102.css");
  }
  
  util.logDebug("st-messenger - onLoad(" + activatedWhileWindowOpen + ")...");

  // status bar button
  // <!-- #### STATUSBAR BUTTON OVERLAY IN MAIN WINDOW #### -->
  
  WL.injectElements(`<hbox id="status-bar">
    <toolbarbutton id="SmartTemplate4Messenger"
                   class="statusbarpanel-iconic"
                   label="__MSG_smartTemplate4.settings.label__"
                   tooltiptext="__MSG_smartTemplate4.settings.tooltip__"
                   insertafter="totalMessageCount"
                   oncommand="SmartTemplate4.Util.clickStatusIcon(this);"/>
  </hbox>
  `);

  window.SmartTemplate4.doCommand = async function (el, params={}) {
    if (!el) {
      return;

    }
    const SmartTemplates = window.SmartTemplate4;
    util.logHighlightDebug("SmartTemplates.doCommand()", "lightgreen", "rgb(0,80,0)",
      {id: el.id}, params
    );

    switch (el.id) {
      case "smartTemplates-checklicense":
        if (SmartTemplates.Preferences.getMyBoolPref("settings.html")) {
          SmartTemplates.Util.notifyTools.notifyBackground({ 
            func: "openPrefs", 
            page: "licenseKey"
          });
        } else {
          SmartTemplates.Util.openPreferences({element: el});
        }
        break;
        
      /* use last template */
      case "smartTemplates-write-last":
      case "smartTemplates-reply-last":
      case "smartTemplates-reply-list-last":
      case "smartTemplates-reply-all-last":
      case "smartTemplates-forward-last":
        // handled by event handler on menu item... 
        break;

      /* use account template / reset */
      case "smartTemplates-write-default":
      case "smartTemplates-reply-default":
      case "smartTemplates-reply-list-default":
      case "smartTemplates-reply-all-default":
      case "smartTemplates-forward-default":
        let entry;
        if (params.entry) {
          entry = params.entry;
        } else {
          // go up to the parent menu element (e.g. )
          let menuParent = el.parentNode.parentNode;
          entry = SmartTemplates.fileTemplates.uniMenus.find(e => e.id == menuParent.id);
        }
        if (entry) {
          SmartTemplates.Util.logDebug("Execute command for reply with account template: " + entry.command);
          SmartTemplates.fileTemplates.fireComposeCommand(entry);
        } else {
          SmartTemplates.Util.logDebug(`couldn't find an entry in fileTemplates.uniMenus for ${el.id}`);
        }
        break;
        
      case "smartTemplates-news":
        SmartTemplates.Util.notifyTools.notifyBackground({ func: "splashScreen" });
        SmartTemplates.Preferences.setMyBoolPref("hasNews", false);
        SmartTemplates.Util.notifyTools.notifyBackground({ func: "updateNewsLabels" }); 
        break;
      case "smartTemplates-setNewsFlag":
        SmartTemplates.Preferences.setMyBoolPref("hasNews", true);
        SmartTemplates.Util.notifyTools.notifyBackground({ func: "updateNewsLabels" }); 
        break;
      case "smartTemplates-settings-legacy": // fall-through
      case "smartTemplates-settings":
        // this will be always true once legacy settings are retired.
        let modernApiSettings = SmartTemplates.Preferences.getMyBoolPref("settings.html");
        if (params.option && params.option.includes("legacy") || el.id == "smartTemplates-settings-legacy")  {
          // force legacy
          modernApiSettings = false; 
        }

        if (modernApiSettings) { // new prefs
          const serverKey =  SmartTemplates.Util.currentServerInfo();
          let prefsObject = {
            func: "openPrefs", 
            server: serverKey
          }
          let isLicenseWarning = false;
          if (SmartTemplates.Util.licenseInfo.isExpired)  {
            isLicenseWarning=true;
          }
          if (params.mode) {
            prefsObject.page = params.mode;
          }
          if (isLicenseWarning) {
            prefsObject.page = "licenseKey";
          }
          if (params.option && params.option.includes("disableLicensePage")) {
            isLicenseWarning = false;
          }
          if (params.composeType) {
            prefsObject.composeType = params.composeType;
          }
          SmartTemplates.Util.logDebug(`Open new prefs tab, current server key: ${serverKey}`)
          SmartTemplates.Util.notifyTools.notifyBackground(prefsObject);
          return;
        }
        // legacy prefs
        if (params.hasOwnProperty("composeType")) {
          SmartTemplates.Util.openPreferences(params);
        } else {
          SmartTemplates.Util.openPreferences({element:el});
        }
        break;

      case "smartTemplates-settings-new":
        SmartTemplates.Util.notifyTools.notifyBackground({ func: "openPrefs" });
        break;
      case "smartTemplates-installed":
        SmartTemplates.Util.notifyTools.notifyBackground({ func: "splashInstalled" });
        break;
      case "smartTemplates-support":
        SmartTemplates.Util.showSupportPage();
        break;
      case "smartTemplates-home":
        SmartTemplates.Util.showHomePage();
        break;
      case "smartTemplates-issues":
        SmartTemplates.Util.showBugsAndFeaturesPage();
        break;
      case "smartTemplates-features":
        SmartTemplates.Util.showPremiumFeatures();
        break;
      case "smartTemplates-youtube":
        // 
        SmartTemplates.Util.showYouTubePage(params.videoId);
        break;
      case "smartTemplates-stationery":
        SmartTemplates.Util.showStationeryHelpPage(params.anchor);
        break;
      case "smartTemplates-variables":
        // SmartTemplates.Util.logIssue213("Show Variables Tab");
        if (SmartTemplates.Preferences.getMyBoolPref("settings.html")) {
          SmartTemplates.Util.notifyTools.notifyBackground({ func: "openPrefs", page: "variables" });
        } else {
          SmartTemplates.Util.openPreferences({element: null, mode: "variables"});
        }
        SmartTemplates.Util.showVariablesPage();
        break;
      case "smartTemplates-premium":
        SmartTemplates.Util.showPremiumFeatures();
        break
      case "smartTemplates-templatemenus":
        SmartTemplates.Util.notifyTools.notifyBackground({ func: "updateTemplateMenus" });
        break;
      case "smartTemplates-headerMenuAPI":
        // to test, first remove the old xul menu items:
        if (!SmartTemplates.fileTemplates.isAPIpatched) {
          // undo the patch once
          SmartTemplates.clearActionMenu(); // do this via the API instead!
        }
        // update the data in background
        await SmartTemplates.Util.notifyTools.notifyBackground({ 
          func: "updateFileTemplates",
          Entries: SmartTemplates.fileTemplates.Entries,
          MRU_Entries: SmartTemplates.fileTemplates.MRU_Entries
        });

        await SmartTemplates.Util.notifyTools.notifyBackground({ 
          func: "patchHeaderMenuAPI" 
        });
        SmartTemplates.fileTemplates.isAPIpatched = true;
        break;
      case "smartTemplates-MruMenuAPI":
        // update the data to the background first
        await SmartTemplates.Util.notifyTools.notifyBackground({ 
          func: "updateFileTemplates",
          Entries: SmartTemplates.fileTemplates.Entries,
          MRU_Entries: SmartTemplates.fileTemplates.MRU_Entries
        });        
        await SmartTemplates.Util.notifyTools.notifyBackground({ 
          func: "updateHeaderMenuMRU" 
        });        
        break;
      case "smartTemplates-onSelectAdhoc":
        SmartTemplates.fileTemplates.onSelectAdHoc.call(
          SmartTemplates.fileTemplates, 
          {
            composeType: null,
            controller: params.controller,
            context: params.context
          }
        );
        break;
      case "smartTemplates-showMessage": // show a specific message
        SmartTemplates.Message.display(
          params.text, 
          "centerscreen,titlebar,modal,dialog",
          { 
            showLicenseButton: params.showLicenseButton, 
            feature: params.feature,
            ok: function() { ; }
          },
          SmartTemplates.Util.Mail3PaneWindow
        );      
        break;
      case "smartTemplates-labelUpdate":
        SmartTemplates.Util.notifyTools.notifyBackground({func: "updateNewsLabels"});
        // update the status bar label too:
        SmartTemplates.Util.notifyTools.notifyBackground({func:"initLicensedUI"});  
        break;
      case "smartTemplates-toggle-label":
        let isHidden;
        if (params.hasOwnProperty("isHidden")) {
          isHidden = params.isHidden;
        } else {
          // toggle existing state
          isHidden = !SmartTemplates.Preferences.getMyBoolPref("toolbar.hideLabel");
        }
        SmartTemplates.Preferences.setMyBoolPref("toolbar.hideLabel", isHidden);
        let btn = el.parentElement ? 
          el.parentElement.parentElement : 
          SmartTemplates.Util.getCommandsButton("message_action");
        if (btn) {
          btn.classList.toggle("force-label-hidden");
        }
        break;
      case "smartTemplates-registration":
        {
          let featureName = params?.feature || "test menu";
          SmartTemplates.Util.showLicenseDialog(featureName);
        }
        break;
      case "smartTemplates-mru-save":
        await SmartTemplates.fileTemplates.storeMRU();
        break;
      case "smartTemplates-mru-load":
        await SmartTemplates.fileTemplates.loadMRU();
        SmartTemplates.Util.notifyTools.notifyBackground({ func: "updateTemplateMenus" });
        break;
      case "smartTemplates-updatestatusbar":
        SmartTemplates.updateStatusBar();
        break;
      default:
        console.log("Unknown SmartTemplates command", el.id || "id: N/A", el);
    }
  }

  window.SmartTemplate4.WL = WL; // we need this in patchUnifiedToolbar();
  window.SmartTemplate4.Util.notifyTools.enable();

  util.logDebug("Util.init...");
  await window.SmartTemplate4.Util.init();

  util.logDebug("startUp...");
  window.SmartTemplate4.startUp();

  // read custom templates data from disc
  await window.SmartTemplate4.fileTemplates.loadCustomMenu(false);
  await window.SmartTemplate4.fileTemplates.loadMRU();
  await window.SmartTemplate4.Util.notifyTools.notifyBackground({ 
    func: "updateFileTemplates",
    Entries: window.SmartTemplate4.fileTemplates.Entries,
    MRU_Entries: window.SmartTemplate4.fileTemplates.MRU_Entries
  });  

  // The following will only work if we are currently in a mail pane (ATN update)
  // otherwise, we need to call this again in a tab listener
  if (window.SmartTemplate4.patchUnifiedToolbar()) {
    await window.SmartTemplate4.fileTemplates.initMenus(true, { toolbarType:"unified", isMessenger: true });  
  }

  // [issue 253] update message action menu (API based) - default to this method from now!
  await window.SmartTemplate4.Util.notifyTools.notifyBackground({ 
    func: "patchHeaderMenuAPI" 
  });
  window.SmartTemplate4.fileTemplates.isAPIpatched = true;

  window.SmartTemplate4.addTabEventListener();

  // set up updating the label at midnight
  window.SmartTemplate4.Util.setMidnightTimer();
  
  // these events are repackaged in util-init() from notifications
  mylisteners["BackgroundUpdate"] = window.SmartTemplate4.initLicensedUI.bind(window.SmartTemplate4);
  mylisteners["updateTemplateMenus"] = window.SmartTemplate4.fileTemplates.initMenusWithReset.bind(window.SmartTemplate4.fileTemplates);
  mylisteners["updateNewsLabels"] = window.SmartTemplate4.updateNewsLabels.bind(window.SmartTemplate4);
  mylisteners["firstRun"] = util.firstRun.init.bind(util.firstRun);
  mylisteners["fileTemplateFromApi"] = (event) => {
    window.SmartTemplate4.fileTemplates.composeFromAPI.call(
      window.SmartTemplate4.fileTemplates,
      event.detail.menuObject
    );
  } 
  mylisteners["showAboutConfig"] = (event) => {
    window.SmartTemplate4.Util.showAboutConfig(null, event.detail.filter);
  }
    
    

  mylisteners["doCommand"] = (event) => {
    window.SmartTemplate4.doCommand.call(
      window.SmartTemplate4.doCommand,
      {id: event.detail.cmd},
      event.detail?.params
    );
  } 
  mylisteners["patchUnifiedToolbar"] = () => {
    if (window.SmartTemplate4.patchUnifiedToolbar()) {
      window.SmartTemplate4.updateNewsLabels();
      return "success";
    }
    return "failed";
  }

  mylisteners["forwardWithTemplate"] = 
    (event) => {
      window.SmartTemplate4.fileTemplates.onExternalMailProcess.call(
        window.SmartTemplate4.fileTemplates, event.detail, "fwd"
      ); 
    }

  mylisteners["replyWithTemplate"] = 
    (event) => { 
      window.SmartTemplate4.fileTemplates.onExternalMailProcess.call(
        window.SmartTemplate4.fileTemplates, event.detail, "rsp"
      ) 
    }; 

  for (let m in mylisteners) {
    if (m == "BackgroundUpdate") {
      window.addEventListener("SmartTemplates.BackgroundUpdate" , mylisteners[m]);
    } else {
      window.addEventListener(`SmartTemplates.BackgroundUpdate.${m}` , mylisteners[m]); 
      // add more listeners here...
    }
  }

  // initialise all menus
  window.SmartTemplate4.Util.notifyTools.notifyBackground({ func: "updateTemplateMenus" });



}

function onUnload(isAddOnShutDown) {
  const util = window.SmartTemplate4.Util;
  let isError = false;
  window.SmartTemplate4.Util.notifyTools.disable();
  
  for (let m in mylisteners) {
    try {
      if (m == "BackgroundUpdate") {
        window.removeEventListener("SmartTemplates.BackgroundUpdate", mylisteners[m]);
      } else {
        window.removeEventListener(`SmartTemplates.BackgroundUpdate.${m}`, mylisteners[m]);
      }
    } catch(ex) {
      console.error(`SmartTemplates - Error removing listener for ${m}:`, ex);
      isError = true;
    }
  }
  
  try {
    window.removeEventListener(
      "SmartTemplates.BackgroundUpdate",
      window.SmartTemplate4.initLicensedUI
    );
  } catch (ex) {
    console.error(`SmartTemplates - Error removing listener initLicensedUI:`, ex);
    isError = true;
  }
  try {
    window.removeEventListener(
      "SmartTemplates.BackgroundUpdate.updateTemplateMenus",
      window.SmartTemplate4.fileTemplates.initMenusWithReset
    );
  } catch (ex) {
    console.error(`SmartTemplates - Error removing listener initMenusWithReset:`, ex);
    isError = true;
  }
  
  util.logDebug("shutDown(true)...");
  // remove UI modifications + clean up all listeners
  try {
    window.SmartTemplate4.shutDown(true); // true = this is a main window - remove all message listeners established
  } catch(ex) {
    console.error(`SmartTemplates - Error running shutdown():`, ex);
    isError = true;
  }  
  util.logDebug(`onUnload(${isAddOnShutDown}) FINISHED. isError = ${isError}`);
}

