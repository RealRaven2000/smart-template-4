import {Licenser, licenseValidationDescription} from "./scripts/Licenser.mjs.js";

import {SmartTemplates} from "./scripts/st-main.mjs.js";
import {SmartTemplatesProcess} from "./scripts/st-process.mjs.js";
import {compareVersions} from "./scripts/mozilla-version-comparator.js";



var stProcess = new SmartTemplatesProcess(); // use stProcess.composer
console.log(SmartTemplates, stProcess);
SmartTemplates.Util.log("test", "test2");

var currentLicense;
const GRACEPERIOD_DAYS = 28;
const GRACEDATE_STORAGE = "extensions.smartTemplate4.license.gracePeriodDate";
const DEBUGLICENSE_STORAGE = "extensions.smartTemplate4.debug.premium.licenser";
const CARDBOOK_APPNAME = "cardbook@vigneau.philippe";

var startupFinished = false;
var MenuCounter = {
  MRUheader: 0,
  MRUunified: 0,
  MRUcomposer: 0
}

var callbacks = [];

var fileTemplates = {
  Entries: [], 
  MRU_Entries: []
}; // copy of recent and configured file templates from SmartTemplate4.fileTemplates

// Remove console error “receiving end does not exist”
function logReceptionError(x) {
  if (x.message.includes("Receiving end does not exist.")) {
    // no need to log - CardBook is not installed or disabled.
  } else { 
    console.log(x); 
  }  
}

const ControllerMap = new Map([
  ["cmd_newMessage", "new"], 
  ["cmd_reply", "rsp"],
  ["cmd_replyAll", "rsp.all"],
  ["cmd_replyList", "rsp.list"],
  ["cmd_forward", "fwd"]
]);

// all .last    items had classList:"menuitem-iconic st-last-<CType> st-mru"
// all .default items had classList:"menuitem-iconic"
const writeMenus = [
  { type:"menu", id:"smartTemplates-write-menu", classList:"menu-iconic", 
    label:"pref_new.tab", accesskey:"st.menuaccess.write",
    controller:"cmd_newMessage", 
    popupItems: [
      { id:"smartTemplates-write-last", label:"st.menu.template.last", controller:"cmd_newMessage", ctr_type: "most-recent" },
      { id:"smartTemplates-write-default", label:"st.menu.template.default", controller:"cmd_newMessage", ctr_type: "account" }
    ]
  }
];

const replyMenus = [
  { type:"menu", id:"smartTemplates-reply-menu", classList:"menu-iconic", 
    label:"pref_rsp.tab", accesskey:"st.menuaccess.reply",
    controller:"cmd_reply", 
    popupItems: [
      { id:"smartTemplates-reply-last", label:"st.menu.template.last", controller:"cmd_reply", ctr_type: "most-recent" },
      { id:"smartTemplates-reply-default", label:"st.menu.template.default", controller:"cmd_reply", ctr_type: "account" }
    ]
  }, 
  { type:"menu", id:"smartTemplates-reply-all-menu", classList:"menu-iconic", 
    label:"st.menu.replyAll", accesskey:"st.menuaccess.replyAll",
    controller:"cmd_replyAll", 
    popupItems: [
      { id:"smartTemplates-reply-all-last", label:"st.menu.template.last", controller:"cmd_replyAll", ctr_type: "most-recent" },
      { id:"smartTemplates-reply-all-default", label:"st.menu.template.default", controller:"cmd_replyAll", ctr_type: "account" }
    ]
  }, 
  { type:"menu", id:"smartTemplates-reply-list-menu", classList:"menu-iconic", 
    label:"st.menu.replyList", accesskey:"st.menuaccess.replyList",
    controller:"cmd_replyList", 
    popupItems: [
      { id:"smartTemplates-reply-list-last", label:"st.menu.template.last", controller:"cmd_replyList", ctr_type: "most-recent" },
      { id:"smartTemplates-reply-list-default", label:"st.menu.template.default", controller:"cmd_replyList", ctr_type: "account" }
    ]
  }, 
];


const forwardMenus = [
  { type:"menu", id:"smartTemplates-forward-menu", classList:"menu-iconic", 
    label:"pref_fwd.tab", accesskey:"st.menuaccess.forward",
    controller:"cmd_forward", 
    popupItems: [
      { id:"smartTemplates-forward-last", label:"st.menu.template.last", controller:"cmd_forward", ctr_type: "most-recent" },
      { id:"smartTemplates-forward-default", label:"st.menu.template.default", controller:"cmd_forward", ctr_type: "account" }
    ]
  }  
];


// a class to manage restricitons of number of supported menu items
// use to keep count across menus with addItem / countMenuItems
class MenuRestrictions {
  LicenseInfo;
  menuCount = 0;
  Categories=[];
  constructor(isMRU, licenseInfo) {
    this.LicenseInfo = licenseInfo;
    this.MAX_FREE_TEMPLATES = isMRU ? 3 : 5;
    this.MAX_STANDARD_TEMPLATES = isMRU ? 5 : 25;
    this.MAX_STANDARD_CATEGORIES = 3;
  }
  async initPrefs() {
    this.MAX_MRU_CEILING = await messenger.LegacyPrefs.getPref("extensions.smartTemplate4.fileTemplates.mru.max");
  }

  get countMenuItems() {
    return this.menuCount;
  }

  get maxTemplates() {
    const isLicensed = this.LicenseInfo.status == "Valid";
    const hasProLicense = this.LicenseInfo.keyType != 2;
    if (isLicensed && hasProLicense) return 100000;
    if (isLicensed && !hasProLicense) return this.MAX_STANDARD_TEMPLATES;
    // no license
    return this.MAX_FREE_TEMPLATES;
  }

  get maxCategories() {
    const isLicensed = this.LicenseInfo.status == "Valid";
    const hasProLicense = this.LicenseInfo.keyType != 2;
    if (isLicensed && hasProLicense) return 1000;
    return this.MAX_STANDARD_CATEGORIES;
  }

  get isCategoryMaximum() {
    return (this.Categories.length>=this.maxCategories);
  }

  // adding a new template, also keeps track of how many categories are used in this menu
  addTemplateMenuItem(category) {
    this.menuCount++;
    if (category && !this.Categories.includes(category)) {
      this.Categories.push(category);
    }
  }

  removeTemplateMenuItem() { // probably not used.
    if (this.menuCount>0) {
      this.menuCount--;
    }
    if (!menuCount) { 
      // categero management = incomplete / not quite right, we would need to sanity 
      // check each item really.... so only works correctly if we remove all items
      this.Categories=[];
    }
  }
}


/* from root:icons.css
--icon-new-mail: url("chrome://messenger/skin/icons/new/compact/new-mail.svg");
--icon-reply-all: url("chrome://messenger/skin/icons/new/compact/reply-all.svg");
--icon-reply-list: url("chrome://messenger/skin/icons/new/compact/reply-list.svg");
--icon-reply: url("chrome://messenger/skin/icons/new/compact/reply.svg");
--icon-forward: url("chrome://messenger/skin/icons/new/compact/forward.svg");
*/
function getIconOfController(controller) {
  // replaces rules in smartTemplates-toolButton.css
  const baseURI = //  "chrome://messenger/skin/icons/new/compact/";
    "../chrome/content/skin/icons/thunderbird/";
  switch(controller) {
    case "cmd_newMessage":      
      return baseURI + "new-mail.svg";
    case "cmd_reply":  
      return baseURI + "reply.svg";
    case "cmd_replyAll":
      return baseURI + "reply-all.svg";
    case "cmd_replyList":
      return baseURI + "reply-list.svg";
    case "cmd_forward":
      return baseURI + "forward.svg";
  }
  return null;
}

async function executeFileMenu(menuObject) {
  // SmartTemplate4.doCommand(this);
  console.log("executeFileMenu()", menuObject);
  switch(menuObject.controller) {
    case "cmd_newMessage":
    case "cmd_reply":
    case "cmd_replyAll":
    case "cmd_replyList":
    case "cmd_forward":
      messenger.NotifyTools.notifyExperiment({
        event:"fileTemplateFromApi", 
        detail: {
          menuObject: menuObject,
          test: "123"
        }
      });
      break;
    default:
  }
}

async function getTargetTemplate(controller, type) {
  // file Template example
  const example = {
    cmd: "reply",
    composeType: "rsp",
    label: "SmartTemplate4 mail validation", 
    path: "N:\\templates\\SmartTemplate4 mail validation.html"
  }

  if (controller.startsWith("cmd_")) {
    switch (type) {
      case "most-recent" :
        // not from MRU list but stored separately in legacy prefs
        // ControllerMap returns the full composeType, e.g. rsp.all or rsp.list
        let jsonTemplate = 
          await messenger.LegacyPrefs.getPref(`extensions.smartTemplate4.fileTemplates.mru.${ControllerMap.get(controller)}`),
          sEmptyLabel = "(not set)";   

        let lastEntry = jsonTemplate ? JSON.parse(jsonTemplate) : {path:"", label:sEmptyLabel, category:""};
        return lastEntry;
      case "account" : // account template
        return {
          controller: controller, 
          path: "", 
          label: "" 
        };
    }
  }
  return `test - ${controller} [${type}] ` ;
}

function openLegacyPrefs() {
  messenger.NotifyTools.notifyExperiment({
    event: "doCommand", 
    detail: {
      cmd: "smartTemplates-settings", // will be re-packaged as el.id
      params: { option:"legacy" } 
    }
  });
}

var MenuHelper = {
  injectAccessKey: function(txt, accesskey=null) {
    if (accesskey) {
      let p = txt.indexOf(accesskey);
      if (p>=0) {
        // inject "&"
        txt = txt.slice(0, p) + "&" + txt.slice(p);
      } else {
        txt = `&${accesskey} ${txt}`; // for non-latin languages or non-matchint translations
      }
    }
    return txt;
  }, 

  getComposeType: function(template) {
    return ControllerMap.get(template.controller).substring(0,3); // first three letters (new,rsp,fwd)
  },

  // make single key "A","B","C" or single-numeric 1,2,3,4 followed by a space.
  getAccessKey: function (acCode) {
    if (acCode<10) { return `&${acCode.toString()} `; }
    if (acCode>34) { return ""; }
    return `&${String.fromCharCode(65+acCode-10)} `; // continue with A,B,C
  }  ,

  getTemplateListForController: function (controller) {
    switch(ControllerMap.get(controller)) {
      case "new": 
        return fileTemplates.Entries.templatesNew;
      case "rsp": 
      case "rsp.all": 
      case "rsp.list": 
        return fileTemplates.Entries.templatesRsp;
      case "fwd": 
        return fileTemplates.Entries.templatesFwd;
    }
    return [];
  } ,

  getController: function (template) {
    if (template?.command) {
      return template.command;
    }
    if (template?.cmd) {
      return "cmd_" + template.cmd;
    }
    return null;
  }, 

  getCmd: function (template) {
    if (template.cmd) return template.cmd;

    switch (template?.command.toLowerCase()) {
      case "cmd_replyall": return "replyAll"; 
      case "cmd_replylist": return "replyList"; 
      case "cmd_reply": return "reply"; 
      case "cmd_forward": return "forward"; 
      case "cmd_newMessage": return "write"; 
    } 

    switch(template?.composeType) {
      case "rsp": return "reply";
      case "fwd": return "forward";
      case "new": return "write";
    }

    return null;
  },

  // get identifier for localization / label from cmd.
  getActionId: function (cmd) {
    switch(cmd) {
      case "forward":
        return "pref_fwd.tab";
      case "reply":
        return "pref_rsp.tab";
      case "replyAll":
        return "st.menu.replyAll";
      case "replyList":
        return "st.menu.replyList";
      case "write":
        return "pref_new.tab";
    }
    return null;
  }
}


async function addMenus(menuArray, context) {
  // helper function to insert accelerator key
  let isDebug = await messenger.LegacyPrefs.getPref("extensions.smartTemplate4.debug.API.menus");
  if (isDebug) {
    console.log("SmartTemplates addMenus()\n", {menuArray:menuArray, context:context})
  }

  for (let m of menuArray) { // iterate all popups.
    let menuRestrict = new MenuRestrictions(false, currentLicense.info);  // not mru restricted
    await menuRestrict.initPrefs(); // configurable stuff
  
    //
    let ak = (m?.accesskey) ? messenger.i18n.getMessage(m?.accesskey) : null ;
    let menuProps = {
      contexts: [context],
      enabled: true,
      id: m.id, // string
      title: MenuHelper.injectAccessKey(messenger.i18n.getMessage(m.label), ak),
      visible: true  
    }
    let icon = getIconOfController(m.controller);
    if (icon) { menuProps.icons = icon; }
    // remove old menu if necessary:
    try {
      await messenger.menus.remove(`${m.id}`);
    } catch (ex) {
      if (isDebug) {
        console.log(`API menus.remove(${m?.id}) failed\n`, ex);
      }
    }

    let popupId = await messenger.menus.create(menuProps);
    if (m.popupItems?.length) {
      for(let p of m.popupItems) {
        ak = (p?.accesskey) ? messenger.i18n.getMessage(p?.accesskey) : null ;
        let template =
          await getTargetTemplate(p?.controller, p?.ctr_type);
        if (!template) { 
          continue;
        }

        let title;

        if(template.label) {
          title = `${messenger.i18n.getMessage(p.label)}: ${template.label}`;
        } else {
          title = MenuHelper.injectAccessKey(messenger.i18n.getMessage(p.label), ak);
        }
        
        let itemProps = {
          contexts: [context],
          enabled: true,
          // icons: ...,
          id: p.id, // string
          parentId: popupId, // string
          title: title,
          visible: true,  
          onclick: (e) => {
            // account (default) template
            if (p?.ctr_type == "account") {
              // account template
              messenger.NotifyTools.notifyExperiment({
                event: "doCommand", 
                detail: {
                  cmd: p.id, // will be re-packaged as el.id
                  params: {
                    entry: {
                      command: m.controller,
                      composeType: MenuHelper.getComposeType(m)
                    }
                  } 
                }
              });
              return;     
            } 
            // html template
            executeFileMenu( {
              controller: p?.controller,
              control_type: p?.ctr_type,
              target: template // file template entry or mru entry - see fileTemplates.js
            });
            
          }
        }
        await messenger.menus.create(itemProps);
      }
      // append file templates: (either one of new, rsp or fwd ) using ControllerMap
      let templateList = MenuHelper.getTemplateListForController(m.controller);
      if (!templateList.length) continue;

      // ========================================
      await messenger.menus.create({
        contexts: [context],
        parentId: popupId,
        type: "separator"
      });

      // we need to iterate categories (= submenus) first!
      // then items without category!
      // the categories get their own accelerator which is A,B,C etc.
      let accCount = 1;
      let CatMap = new Map(); // [category.toLowerCase() , {id: catId, akc: accCount}]
      let catAccelerator = 10; // A, B, C etc.

      // display catecory popups on top, then items without category
      let sortedTemplates = [
        ...templateList.filter(e => (e.category)),
        ...templateList.filter(e => (!e.category))
      ];      

      // check if anything had to be disabled because of license restrictions:
      let hasRestrictions = false;
      let parentPopupId;
      const CategoryOverFlowId = "****other****";
      for (let t of sortedTemplates) {
        let catId = null;
        let catEl = null;

        let isEnabled = (menuRestrict.countMenuItems <= menuRestrict.maxTemplates);
        if (!isEnabled) {
          hasRestrictions = true;
        }

        if (t.category) {
          catEl = CatMap.get(t.category.toLowerCase()) || null;
          // 0. existing category was found
          if (catEl) { 
            catId = catEl.id;
            catEl.akc++;
            catEl = {id: catId, akc: catEl.akc}
            CatMap.set(t.category, catEl);
          }

          // 1. category is new - create one.
          if (!catEl && !menuRestrict.isCategoryMaximum) {
            // new category!
            let CA = MenuHelper.getAccessKey(catAccelerator++);
            catId = await messenger.menus.create({
              contexts: [context],
              parentId: popupId,
              title: `${CA}${t.category}`
            }); 
            catEl = {id: catId, akc: 1}
            CatMap.set(t.category.toLowerCase(), catEl); // this may lead to category maximum.
          }

          // 2. maximum categories is reached, use "Other"
          if (!catEl && menuRestrict.isCategoryMaximum) {
            // does "Other" category exist?
            catEl = CatMap.get(CategoryOverFlowId);
            if (!catEl) {
              // other doesn't exist, create it!
              let CA = MenuHelper.getAccessKey(catAccelerator++);
              catId = await messenger.menus.create({
                contexts: [context],
                parentId: popupId,
                title: `${CA}${messenger.i18n.getMessage("template.category.other")}`
              }); 
              catEl = {id: catId, akc: 0}
              await messenger.menus.create({
                contexts: [context],
                parentId: catId,
                icons:  "../chrome/content/skin/icons/warning.svg",
                title: messenger.i18n.getMessage(
                  "st.fileTemplates.restrictTemplateCats", 
                  [menuRestrict.maxCategories.toString()]),
                onclick: (e) => {
                  messenger.NotifyTools.notifyExperiment({
                    event: "doCommand", 
                    detail: {
                      cmd: "smartTemplates-registration", // will be re-packaged as el.id
                      params: {
                        feature: "MAX_STANDARD_CATEGORIES"
                      } 
                    },
                  });              
                }

              })
            } else {
              catId = catEl.id;
            }
            catEl.akc++;
            CatMap.set(CategoryOverFlowId, catEl);
          }
        }

        parentPopupId = catId || popupId;

        let accelKeyString;
        if (catEl) {
          accelKeyString = MenuHelper.getAccessKey(catEl.akc);
        } else {
          accelKeyString = MenuHelper.getAccessKey(accCount);
          accCount++
        }
       
        // this step is temporary until we can create submenus:
        let title = `${accelKeyString}${t.label}`;
        let itemProps = {
          contexts: [context],
          enabled: isEnabled,
          // icons: ...,
          parentId: parentPopupId, // string
          title: title,
          visible: true,  
          onclick: (e) => {
            executeFileMenu( {
              controller: m.controller,
              control_type: m?.ctr_type, // optional
              target: t // file template entry or mru entry - see fileTemplates.js
            })
          }
        }
        await messenger.menus.create(itemProps); 
        menuRestrict.addTemplateMenuItem(t?.category || null); // sum up all items {id: catId, akc: accCount}
      }

      if (hasRestrictions) {
        // add an explanation about why some template items are disabled.
        await messenger.menus.create({
          contexts: [context],
          icons:  "../chrome/content/skin/icons/warning.svg",
          title: messenger.i18n.getMessage("st.fileTemplates.restrictionQuestion"),
          parentId: parentPopupId,
          onclick: (e) => {
            let txt = messenger.i18n.getMessage(
              "st.fileTemplates.restrictTemplates",
              [
                menuRestrict.MAX_FREE_TEMPLATES.toString(), 
                menuRestrict.MAX_STANDARD_TEMPLATES.toString()
              ]);
            messenger.NotifyTools.notifyExperiment({
              event: "doCommand", 
              detail: {
                cmd: "smartTemplates-showMessage", // will be re-packaged as el.id
                params: {
                  text: txt,
                  showLicenseButton: true,
                  feature: "FileTemplatesRestricted"
                } 
              },
            });              
          }
        });
      }

      // one more ========================================
      await messenger.menus.create({
        contexts: [context],
        parentId: popupId,
        type: "separator"
      });      
    }

    // open file adhoc
    // ["smarttemplate4-changeTemplate","smarttemplate4-insertSnippet"].includes(parentId) || SmartTemplate4.fileTemplates.getController(msgPopup);
    const hasOpenFileItem = m.hasOwnProperty("controller");
    if (hasOpenFileItem) {
      await messenger.menus.create({
        contexts: [context],
        enabled: true,
        parentId: popupId,
        id: `${m.controller}-openTemplate`,
        icons: "../chrome/content/skin/icons/template-load.png",
        title: messenger.i18n.getMessage("st.fileTemplates.openFile"),
        onclick: (e) => {
          messenger.NotifyTools.notifyExperiment({
            event: "doCommand", 
            detail: {
              cmd: "smartTemplates-onSelectAdhoc", // will be re-packaged as el.id
              params: {
                controller: m.controller,
                context: context
              } 
            }
          });
        }
      });
    }

    // configure menu...
    await messenger.menus.create( 
      {
        contexts: [context],
        id: `configure-${m.controller}`,
        icons: "../chrome/content/skin/icons/settings.svg",
        parentId: popupId,
        title: messenger.i18n.getMessage("st.fileTemplates.configureMenu"),
        onclick: (e) => {
          messenger.NotifyTools.notifyExperiment({
            event: "doCommand", 
            detail: {
              cmd: "smartTemplates-settings", 
              params: {
                mode:"fileTemplates", 
                composeType: MenuHelper.getComposeType(m),
                tab: -1
              }  // toggle
            }
          });
        }
      }
    );
    
    
  }
}

async function createHeaderMenu() {
  let isDebug = await messenger.LegacyPrefs.getPref("extensions.smartTemplate4.debug.API.menus");
  if (isDebug) {
    console.log("SmartTemplates: createHeaderMenu (through API)")
  }

  let Context = "message_display_action_menu";

  await addMenus([...replyMenus, ...forwardMenus], Context); 
  // Toggle Label (optional)
  let isLabelHidden = (await messenger.LegacyPrefs.getPref("extensions.smartTemplate4.toolbar.hideLabel"));
  await messenger.menus.remove("toggleLabel");
  await messenger.menus.create({
    contexts: [Context],
    enabled: true,
    id: "toggleLabel",
    title: messenger.i18n.getMessage("st.menu.hideLabel"),
    type: "checkbox",
    checked: isLabelHidden,
    onclick: async (e) => {
      // [issue 304] action button needs to be updated!
      var isHidden = (await messenger.LegacyPrefs.getPref("extensions.smartTemplate4.toolbar.hideLabel"));
      messenger.NotifyTools.notifyExperiment({
        event: "doCommand", 
        detail: {
          cmd: "smartTemplates-toggle-label", // will be re-packaged as el.id
          params: { isHidden: !isHidden}  // toggle
        }
      });
    }
  });

  // SmartTemplates Settings
  await messenger.menus.remove("smartTemplates-settings");
  await messenger.menus.create({
    contexts: [Context],
    enabled: true,
    id: "smartTemplates-settings",
    title: messenger.i18n.getMessage("pref_dialog.title"),
    icons: "../chrome/content/skin/icons/settings.svg",
    onclick: (e) => {
      messenger.NotifyTools.notifyExperiment({
        event: "doCommand", 
        detail: {
          cmd: "smartTemplates-settings", // will be re-packaged as el.id
          params: {} 
        }
      });
    }
  });

  // ========================================
  await messenger.menus.remove("templateSeparator");
  await messenger.menus.create({
    contexts: [Context],
    enabled: true,
    id: "templateSeparator",
    type: "separator"
  });

  // MRU List

  // let menuProps = {
  //   contexts: ["message_display_action_menu"],
  //   onclick: async (event) => {    
  //     if (isDebug) { console.log("SmartTemplates header context menu", event); }
  //     // const menuItem = { id: TOGGLEICON_ID };   // fake menu item to pass to doCommand

  //     // determine email of email(s) shown in preview pane:
  //     // const selectedMail = event?.selectedMail || null;

  //     messenger.NotifyTools.notifyExperiment( 
  //       { 
  //         event: "checkMailAction", 
  //         detail: { 
  //           commandItem: menuItem, 
  //           selectedMail: event?.selectedMail
  //         } 
  //       } 
  //     );
  //   },
  //   icons: { // list-style-image: var(--icon-reply);
  //     "16": "chrome://messenger/skin/icons/new/compact/reply.svg"
  //   } ,

  // how to retrieve a css variable (according to Arndt)
  // getComputedStyle(document.documentElement).getPropertyValue('--icon-reply')
  // getComputedStyle(document.documentElement).setProperty('--icon-reply', 'whatever-value')
  // let idToggle = await messenger.menus.create(menuProps); // id of menu item

  // https://webextension-api.thunderbird.net/en/latest/menus.html#create-createproperties-callback

}

//
async function updateMruMenu(Context) {
   // default is 10 but can be raised in Pro
  let isDebug = await messenger.LegacyPrefs.getPref("extensions.smartTemplate4.debug.API.menus");
  if (isDebug) {
    console.log(`SmartTemplates updateMruMenu(${Context})\n`);
  }


  const isMRUmenu = true;
  const menuRestrict = new MenuRestrictions(isMRUmenu, currentLicense.info);
  await menuRestrict.initPrefs(); // configurable stuff


  let templates, popupId;
  let countOldMruItems = 0;

  let menuHasRestrictions = false; // set this if any maximum is exceeded!
  const delimiter = "\u00BB".toString(); // »



  // let oldPrefix = "";
  switch(Context) {
    case "browser_action_menu": // not sure whether there is an official ContextType for the unified toolbar.
      templates = fileTemplates.MRU_Entries.filter(e => e.composeType == "new");
      popupId = null; // top level
      countOldMruItems = MenuCounter.MRUunified;
      break;
    case "message_display_action_menu":
      templates = fileTemplates.MRU_Entries.filter(e => e.composeType == "rsp" || e.composeType == "fwd");
      countOldMruItems = MenuCounter.MRUheader;
      break;
    case "compose_action_menu":
      templates = []; // Snippets = recents? - change template = depends on compose Case!
      countOldMruItems = MenuCounter.MRUcomposer; // obsolete?
      break;
  }

  // starting with idx=1
  for (let i=1; i<=countOldMruItems; i++) {
    try {
      let id = `mru-${i}`; // ${oldPrefix}
      if (isDebug) { console.log(`removing ${id} ... `); }
      await messenger.menus.remove(id);
    } catch (ex) {
      console.log(ex);
    }
  }

  let accelerator = 1,
      generatedId = null;

  for (let i=0; i<templates.length; i++) {
    if (i>menuRestrict.MAX_MRU_CEILING) {
      break;
    }    
    let theTemplate = templates[i];

    // get identifier for localization / label
    let actionId = MenuHelper.getActionId(MenuHelper.getCmd(theTemplate));
    if (!actionId) continue;
    let accelKeyString = MenuHelper.getAccessKey(accelerator),
        action = messenger.i18n.getMessage(actionId);

    let title = `${accelKeyString}${action}: ${theTemplate.label}`;
    let item ={
      contexts: [Context],
      // icons: ...,
      title: title,
      id: `mru-${accelerator}`, 
      onclick: (e) => {
        executeFileMenu( {
          controller: MenuHelper.getController(theTemplate), 
          composeType: theTemplate?.composeType, //  "rsp" "new" "fwd" - added for later?
          target: theTemplate // file template entry or mru entry - see fileTemplates.js
        })
      }
    };
    if (popupId) {
      item.parentId = popupId;
    }
    // the return value is the same id I passed in (not prefixed by API!!)
    // BUGGY??
    generatedId = await messenger.menus.create(item); 
    accelerator++; 
  }
  if (!generatedId) {
    if (isDebug) { console.log("No MRU items were generated. "); }
    return;
  }

  // update last items 
  let latestMenus;
  switch(Context) {
    case "browser_action_menu":
      latestMenus = [...writeMenus, ...replyMenus, ...forwardMenus];
      break;
    case "message_display_action_menu":
      latestMenus = [...replyMenus, ...forwardMenus];
      break;
  }
  let enableLastUpdate = true; // test
  for (let menus of latestMenus) {
    for (let menu of menus.popupItems.filter((e) => (e.ctr_type == "most-recent"))) {
      let template = await getTargetTemplate(menu.controller, "most-recent"),
          title = `${messenger.i18n.getMessage(menu.label)}: ${template.label}`;

      let itemProps = {
        title: title,
        onclick: (e) => {
          // html template
          executeFileMenu( {
            controller: menu.controller,
            control_type: menu.ctr_type,
            target: template // file template entry or mru entry - see fileTemplates.js
          });
        }
      }
      if (!enableLastUpdate) continue;
      await messenger.menus.update(menu.id, itemProps);
    }
  }
  
  // remember how many MRU items each menu type has
  // let prefixMatch = generatedId.match("(.*_)mru-");
  // let prefix = prefixMatch?.length>1 ? prefixMatch[1] : "";
  // if (!prefix ) {
  //   // API bug...
  //   prefix = "smarttemplate4_thunderbird_extension-menuitem-_";
  //   if (isDebug) { 
  //     console.log(`Nothing was prefixed to menu.id from API generated menu item.\n Using hardcoded fallback: ${prefix}` ); 
  //   }
  // }  
  switch(Context) {
    case "browser_action_menu":
      MenuCounter.MRUunified = accelerator-1;
      break;
    case "message_display_action_menu": // not sure whether there is an official ContextType for the unified toolbar.
      MenuCounter.MRUheader = accelerator-1;
      break;
    case "compose_action_menu":
      MenuCounter.MRUcomposer = accelerator-1; // Snippets = recents? - change template = depends on compose Case!
      break;
  }  
  
}

async function updateSubMenus(messages, tab) {
  if (messages.length!=1) {
    return; // button not displayed, so we do not change anything.
  }

  let isReplyList = true;
  let isReplyAll = true;
  let isForward = true;
  let gotReply;

  // Ask the experimental code for now!
  try {
    // this calls the experiement code but returns nothing?
    let results = await messenger.Utilities.getCommandsEnabled(
      ["cmd_replylist", "cmd_replyall", "cmd_forward"],
      tab.id
    );

    isReplyList = results[0];
    isReplyAll = results[1];
    isForward =  results[2];
    gotReply = true;
  } catch (ex) {
    console.log(ex);
  }

  // fallback code...
  if (!gotReply) {
    let accounts = await messenger.accounts.list(false)
    let msg = messages[0];
    if (msg.recipients > 1) {
      isReplyAll = true;
    }
    // if I am the sender (sender in my identities) and there is only a single recipient, we do not need replyall.
    for (let ac of accounts) {
      if (ac?.identities.length) {
        if (msg.author.includes(ac.identities[0].email) || msg.recipients[0].includes(ac.identities[0].email)) {
          // do I need to check ccList and bccList? What are the rules?
          if (msg.recipients.length == 1) {
            isReplyAll = false;
            isReplyList = false;
          }
          break;
        }
      }
    }    
  }

  await messenger.menus.update("smartTemplates-reply-list-menu", {visible: isReplyList}); 
  await messenger.menus.update("smartTemplates-reply-all-menu", {visible: isReplyAll}); 
  await messenger.menus.update("smartTemplates-forward-menu", {visible: isForward}); 
}
 

  messenger.runtime.onInstalled.addListener(async ({ reason, temporary }) => {
    let isDebug = await messenger.LegacyPrefs.getPref("extensions.smartTemplate4.debug");
    // Wait until the main startup routine has finished!
    await new Promise((resolve) => {
      if (startupFinished) {
        if (isDebug) console.log("SmartTemplates - startup code finished.");
        resolve();
        // Looks like we missed the one sent by main()
      }
      callbacks.push(resolve);
    });
    if (isDebug) {
      console.log("SmartTemplates Startup has finished\n"
        + "currentLicense", currentLicense);
    }
    
    switch (reason) {
      case "install":
        {
          const url = browser.runtime.getURL("popup/installed.html");
          await messenger.windows.create({ url, type: "popup", width: 910, height: 750, allowScriptsToClose : true});
          messenger.NotifyTools.notifyExperiment({event: "firstRun"});
        }
        break;
      // see below
      case "update":
        {
          setTimeout(
            async function() {
              let ver = await messenger.LegacyPrefs.getPref("extensions.smartTemplate4.version","0");
              const manifest = await messenger.runtime.getManifest();
              // get pure version number / remove pre123 indicator
              let installedVersion = manifest.version.replace(/pre.*/,""); 
              if (isDebug) console.log(`SmartTemplates Update:  old=${ver}  new=${installedVersion}`);
              // compare versions to support beta builds
              // we probably need to manage prerelease installs with a separate flag!
              if (compareVersions(installedVersion,ver)>0) { 
                if (isDebug) console.log("Setting hasNews flag!");
                messenger.LegacyPrefs.setPref("extensions.smartTemplate4.hasNews", true);
              }
              if (ver != installedVersion ) {
                if (isDebug) console.log("Storing new version number " + manifest.version);
                // STORE VERSION CODE!
                // prefs.setMyStringPref("version", pureVersion); // store sanitized version! (no more alert on pre-Releases + betas!)
                messenger.LegacyPrefs.setPref("extensions.smartTemplate4.version", installedVersion);
              }              
              
              messenger.NotifyTools.notifyExperiment({event: "updateNewsLabels"});
              messenger.NotifyTools.notifyExperiment({event: "firstRun"});
            },
            200
          ); 
          
          // TypeError: currentLicense is undefined
          if (isDebug) console.log("2. update() case");
          let currentLicenseInfo = currentLicense.info;
          let isLicensed = (currentLicenseInfo.status == "Valid"); 
          if (isLicensed) {
            // suppress update popup for users with licenses that have been recently renewed
            let gpdays = currentLicenseInfo.licensedDaysLeft; 
            if (isDebug) console.log("Licensed - " + gpdays  + " Days left.");
          }
        }
        break;
      default:
        messenger.NotifyTools.notifyExperiment({event: "updateNewsLabels"});
      // see below
    }
  });


function showSplash() {
  // alternatively display this info in a tab with browser.tabs.create(...)  
  const url = browser.runtime.getURL("popup/update.html");
  let screenH = window.screen.height,
      windowHeight = (screenH > 870) ? 870 : screenH-20;  
  messenger.windows.create({ url, type: "popup", width: 1000, height: windowHeight, allowScriptsToClose: true,});
}

function showSplashInstalled() {
  const url = browser.runtime.getURL("popup/installed.html");
  let screenH = window.screen.height,
      windowHeight = (screenH > 870) ? 870 : screenH-20;  
  messenger.windows.create({ url, type: "popup", width: 910, height: windowHeight, allowScriptsToClose : true});
}


async function main() {
  
  // we need these helper functions for calculating an extension to License.info
  async function getGraceDate() {
    let graceDate = "", isResetDate = false, isDebug = false;
    try {
      graceDate = await messenger.LegacyPrefs.getPref(GRACEDATE_STORAGE);
      isDebug =  await messenger.LegacyPrefs.getPref(DEBUGLICENSE_STORAGE);
    }
    catch(ex) { 
      isResetDate = true; 
    }
    let today = new Date().toISOString().substr(0, 10); // e.g. "2019-07-18"
    if (!graceDate || graceDate>today) {
      graceDate = today; // cannot be in the future
      isResetDate = true;
    }
    else {
      // if a license exists & is expired long ago, use the last day of expiration date.
      if (currentLicense.info.status == "Expired") {
        if (graceDate < currentLicense.info.expiryDate) {
          if (isDebug) console.log("Extending graceDate from {0} to {1}".replace("{0}",graceDate).replace("{1}", currentLicense.info.expiryDate)); 
          graceDate = currentLicense.info.expiryDate;
          isResetDate = true;
        }
      }
    }
    if (isResetDate)
      await messenger.LegacyPrefs.setPref(GRACEDATE_STORAGE, graceDate);
    if (isDebug) console.log("Returning Grace Period Date: " + graceDate); 
    return graceDate;
  }
  
  async function getTrialDays() {
    let graceDate; // actually the install date for 2.1 or later.
    const period = GRACEPERIOD_DAYS,
          SINGLE_DAY = 1000*60*60*24; 
    try {
      if (currentLicense.info.status == "Expired") {
        // [issue 100] Trial period should restart on license expiry
        graceDate = currentLicense.info.expiryDate;
      }
      else
        graceDate = await messenger.LegacyPrefs.getPref(GRACEDATE_STORAGE);
      if (!graceDate) graceDate = getGraceDate(); // create the date
    }
    catch(ex) { 
      // if it's not there, set it now!
      graceDate = getGraceDate(); 
    }
    let today = (new Date()),
        installDate = new Date(graceDate),
        days = Math.floor( (today.getTime() - installDate.getTime()) / SINGLE_DAY);
    // later.setDate(later.getDate()-period);
    return (period-days); // returns number of days left, or -days since trial expired if past period
  }

  
  /* There is a general race condition between onInstall and our main() startup:
   * - onInstall needs to be registered upfront (otherwise we might miss it)
   * - but onInstall needs to wait with its execution until our main function has
   *   finished the init routine
   * -> emit a custom event once we are done and let onInstall await that
   */

  messenger.WindowListener.registerDefaultPrefs("chrome/content/scripts/smartTemplate-defaults.js");
   
  let key = await messenger.LegacyPrefs.getPref("extensions.smartTemplate4.LicenseKey"),
      forceSecondaryIdentity = await messenger.LegacyPrefs.getPref("extensions.smartTemplate4.licenser.forceSecondaryIdentity"),
      isDebug = await messenger.LegacyPrefs.getPref("extensions.smartTemplate4.debug"),
      isDebugLicenser = await messenger.LegacyPrefs.getPref("extensions.smartTemplate4.debug.premium.licenser");

  currentLicense = new Licenser(key, { forceSecondaryIdentity, debug: isDebugLicenser});
  await currentLicense.validate();
  currentLicense.GraceDate = await getGraceDate();
  currentLicense.TrialDays = await getTrialDays();
  
  // All important stuff has been done.
  // resolve all promises on the stack
  if (isDebug) console.log("Finished setting up license startup code");
  callbacks.forEach(callback => callback());
  startupFinished = true;
  
  
  messenger.runtime.onMessage.addListener(async (data, sender) => {
    if (data.command) {
      switch (data.command) {
        case "getLicenseInfo": 
          return currentLicense.info;
        case "updateLicenseKey":
          return await updateLicenseKey(data.key);
        case "showAboutConfig":
          // to do: create an API for this one
          messenger.NotifyTools.notifyExperiment({
            event: "showAboutConfig", 
            detail: {
              element: null,
              filter: data.filter,
              readOnly: data.readOnly,
              updateUI: data.updateUI || false
            }
          });
          break;
        case "showRegistrationDialog":
          messenger.NotifyTools.notifyExperiment({
            event: "doCommand", 
            detail: {
              cmd: "smartTemplates-registration", // will be re-packaged as el.id
              params: {
                feature: data.feature || ""
              } 
            },
          });
          break;
        case "showSplashMsg":
          showSplash();
          break;
        case "showHomePage":
          messenger.NotifyTools.notifyExperiment({
            event: "doCommand", 
            detail: { cmd: "smartTemplates-support" }
          });
          break;
        case "showATNHomePage":
          messenger.NotifyTools.notifyExperiment({
            event: "doCommand", 
            detail: { cmd: "smartTemplates-home" }
          });
          break;
        case "showIssuesPage":
          messenger.NotifyTools.notifyExperiment({
            event: "doCommand", 
            detail: { cmd: "smartTemplates-issues" }
          });
          break;
        case "showPremiumFeaturePage":
          messenger.NotifyTools.notifyExperiment({
            event: "doCommand", 
            detail: { cmd: "smartTemplates-features" }
          });
          break;
        case "showYouTubePage":
          messenger.NotifyTools.notifyExperiment({
            event: "doCommand", 
            detail: { 
              cmd: "smartTemplates-youtube",
              params: { videoId: data.video }
            }
          });
          break;
        case "showStationeryePage":
          messenger.NotifyTools.notifyExperiment({
            event: "doCommand", 
            detail: { 
              cmd: "smartTemplates-stationery",
              params: { anchor: data.topic }
            }
          });
          break;
        case "showLegacyPreferences":
          openLegacyPrefs();
          break;
        case "updateStatusbarIcon":
          messenger.NotifyTools.notifyExperiment({
            event: "doCommand", 
            detail: { 
              cmd: "smartTemplates-updatestatusbar"
            }
          });          
          break;
      }
    }
  });  

  async function updateLicenseKey(newLicenseKey) {
    let forceSecondaryIdentity = await messenger.LegacyPrefs.getPref("extensions.smartTemplate4.licenser.forceSecondaryIdentity"),
    isDebugLicenser = await messenger.LegacyPrefs.getPref("extensions.smartTemplate4.debug.premium.licenser");
    // we create a new Licenser object for overwriting, this will also ensure that key_type can be changed.
    let newLicense = new Licenser(newLicenseKey, { forceSecondaryIdentity, debug:isDebugLicenser });
    await newLicense.validate();
    newLicense.GraceDate = await getGraceDate();
    newLicense.TrialDays = await getTrialDays();

    // Check new license and accept if ok.
    // You may return values here, which will be send back to the caller.
    // return false;

    // Update background license.
    await messenger.LegacyPrefs.setPref("extensions.smartTemplate4.LicenseKey", newLicense.info.licenseKey);
    currentLicense = newLicense;
    // Broadcast
    messenger.NotifyTools.notifyExperiment({licenseInfo: currentLicense.info}); // part of generic onBackgroundUpdates called in Util.init()
    return  licenseValidationDescription(newLicense.ValidationStatus, currentLicense.info);
  }
   
  messenger.NotifyTools.onNotifyBackground.addListener(async (data) => {
    let isLog = await messenger.LegacyPrefs.getPref("extensions.smartTemplate4.debug.notifications");
    if (isLog && data.func) {
      console.log ("=========================\n" +
                   "BACKGROUND LISTENER received: " + data.func + "\n" +
                   "=========================");
    }
    switch (data.func) {
      case "getLicenseInfo":
        return currentLicense.info;

      case "getPlatformInfo":
        return messenger.runtime.getPlatformInfo();

      case "getBrowserInfo":
        return messenger.runtime.getBrowserInfo();

      case "getAddonInfo":
        return messenger.management.getSelf();

      case "initKeyListeners": // might be needed
        // messenger.NotifyTools.notifyExperiment({event: "initKeyListeners"});
        break;

      case "splashScreen":
        showSplash();
        break;

      case "splashInstalled":
        showSplashInstalled();
        break;

      case "updateLicense":
        await updateLicenseKey(data.key);
        return true;

      case "updateTemplateMenus":
        // Broadcast main windows to run updateTemplateMenus
        messenger.NotifyTools.notifyExperiment({ event: "updateTemplateMenus" });
        break;

      case "updateFileTemplates":
        if (await messenger.LegacyPrefs.getPref("extensions.smartTemplate4.debug.API.menus")) {
          console.log("SmartTemplates updateFileTemplates() [API] data\n");
        }
        fileTemplates.Entries = data.Entries;
        fileTemplates.MRU_Entries = data.MRU_Entries;
        break;

      case "patchHeaderMenuAPI":
        if (await messenger.LegacyPrefs.getPref("extensions.smartTemplate4.debug.API.menus")) {
          console.log("SmartTemplates patchHeaderMenuAPI [API] data\n");
        }
        await createHeaderMenu(); // use API to build the menu
        await updateMruMenu("message_display_action_menu"); // API to update MRU items
        break;

      case "updateHeaderMenuMRU":
        await updateMruMenu("message_display_action_menu"); // API to update MRU items
        break;

      case "updateSnippetMenus":
        messenger.NotifyTools.notifyExperiment({ event: "updateSnippetMenus" });
        break;

      case "updateNewsLabels":
        messenger.NotifyTools.notifyExperiment({ event: "updateNewsLabels" });
        break;

      case "setActionTip":
        // https://webextension-api.thunderbird.net/en/stable/browserAction.html#settitle-details
        messenger.browserAction.setTitle({ title: data.text });
        break;

      case "setActionLabel":
        // https://webextension-api.thunderbird.net/en/stable/browserAction.html#setlabel-details
        messenger.browserAction.setLabel({ label: data.text });
        break;

      // refresh license info (at midnight) and update label afterwards.
      case "updateLicenseTimer":
        {
          await currentLicense.updateLicenseDates();

          messenger.NotifyTools.notifyExperiment({ licenseInfo: currentLicense.info });
          messenger.NotifyTools.notifyExperiment({ event: "updateNewsLabels" });
          // update the status bar label too:
          messenger.NotifyTools.notifyExperiment({ event: "initLicensedUI" });
        }
        break;

      case "initLicensedUI":
        // main window update reacting to license status change
        messenger.NotifyTools.notifyExperiment({ event: "initLicensedUI" });
        break;

      case "parseVcard": {
        // https://webextension-api.thunderbird.net/en/stable/how-to/contacts.html
        // Get JSON representation of the vCard data (jCal).
        let dataString = data.vCard;
        return ICAL.parse(dataString);
      }

      case "cardbook.getContactsFromSearch":
      {
        let cards;
        try {
          let queryObject = {
            query: "smartTemplates.getContactsFromSearch",
            string: data.text, // new object
            field: data.field, // default "fn" = display name, or  "nickname" or "firstname" or whatever CardBook fields
            term: data?.operator || "Is", // default "Contains", might also be "Is", "Isnt" and others Thunderbird usual terms
            case: data?.case || "dig" // default "dig", possibilities ["dig", "ignoreCaseIgnoreDiacriticLabel"], ["ig", "ignoreCaseMatchDiacriticLabel"], ["dg", "matchCaseIgnoreDiacriticLabel"], ["g", "matchCaseMatchDiacriticLabel"]
          };
          if (data.preferredDirId) {
            queryObject.dirPrefId = data.preferredDirId;
          }

          cards = await messenger.runtime.sendMessage(CARDBOOK_APPNAME, queryObject).catch((x) => {
            logReceptionError(x);
            cards = null;
          });
          return cards;
        } catch (ex) {
          console.exception(ex);
          console.log({ cards });
          return null;
        }
      }

      case "cardbook.getContactsFromMail": {
        let cards;
        try {
          let queryObject = {
            query: "smartTemplates.getContactsFromMail",
            mail: data.mail,
          };
          if (data.preferredDirId) {
            queryObject.dirPrefId = data.preferredDirId;
          }

          cards = await messenger.runtime.sendMessage(CARDBOOK_APPNAME, queryObject).catch((x) => {
            logReceptionError(x);
            cards = null;
          });
          return cards;
        } catch (ex) {
          console.exception(ex);
          console.log({ cards });
          return null;
        }
      }
      

      case "getContactsFromSearch": {
        let cards;
        return null;

      }
        

      case "openPrefs":
        {
          const settingsUrl = "/html/smartTemplate-settings.html";
          // Add the current accountid for context?
          let url = browser.runtime.getURL(settingsUrl) + "*";
          let [oldTab] = await browser.tabs.query({ url }); // dereference first
          let queryString = "";
          let searchParams = new URLSearchParams();
          if (data.server) {
            searchParams.append("id", data.server);
          }
          if (data.page) {
            searchParams.append("mode", data.page);
          }
          if (data.composeType) {
            searchParams.append("composeType", data.composeType);
          }
          if (searchParams.size) {
            queryString = "?" + searchParams.toString();
          }

          if (oldTab) {
            await browser.tabs.update(oldTab.id, {
              active: true,
              url: browser.runtime.getURL(settingsUrl + queryString),
            });
            // TO DO
            const txt = "Select a specific page after activating existing Settings Tab.";
            console.log(
              `%c[issue 259] to do: \n%c${txt}\n`,
              "color:red",
              "background: darkblue; color:yellow;",
              data
            );
            // await browser.windows.update(oldTab.windowId, {focused:true});
          } else {
            // open a new tab with settings
            browser.tabs.create({
              active: true,
              url: browser.runtime.getURL(settingsUrl + queryString),
            });
          }
        }
        break;

      case "patchUnifiedToolbar":
        return await messenger.NotifyTools.notifyExperiment({ event: "patchUnifiedToolbar" });

      case "openLinkInTab":
        // https://webextension-api.thunderbird.net/en/stable/tabs.html#query-queryinfo
        {
          let baseURI = data.baseURI || data.URL;
          let found = await browser.tabs.query({ url: baseURI });
          if (found.length) {
            let tab = found[0]; // first result
            await browser.tabs.update(tab.id, { active: true, url: data.URL });
            return;
          }
          browser.tabs.create({ active: true, url: data.URL });
        }
        break;
    }
  });
  
  
  browser.runtime.onMessageExternal.addListener( async  (message, sender) =>  
  {
    // { command: "forwardMessageWithTemplate", messageHeader: msgKey, templateURL: data.fileURL }
    let isDebug = await messenger.LegacyPrefs.getPref("extensions.smartTemplate4.debug");
    switch(message.command) {
      case "forwardMessageWithTemplate":
        messenger.NotifyTools.notifyExperiment(
            {event: "forwardWithTemplate", 
             detail : { messageHeader: message.messageHeader, templateURL: message.templateURL} }
        ).then(
          (data) => {
            if (isDebug) console.log (`SmartTemplates forwarded '${message.messageHeader.subject}' successfully.`);
            return true;
          }
        );
        break;
      case "replyMessageWithTemplate":
        messenger.NotifyTools.notifyExperiment(
          {event: "replyWithTemplate", detail : { messageHeader: message.messageHeader, templateURL: message.templateURL} }).then(
          (data) => {
            if (isDebug) console.log (`SmartTemplates replied to '${message.messageHeader.subject}' successfully.`);
            return true;
          }
        );
        break;      
    }
  }); 


  // content smarttemplate4-locales locale/
  // we still need this for explicitely setting locale for Calender localization!
  messenger.WindowListener.registerChromeUrl([ 
      ["content",  "smarttemplate4", "chrome/content/"],
      ["resource", "smarttemplate4", "chrome/content/"],
      ["content", "smarttemplate4-locales", "chrome/locale/"],
      ["locale", "smarttemplate4", "en", "chrome/locale/en/"],
      ["locale", "smarttemplate4", "ca", "chrome/locale/ca/"],
      ["locale", "smarttemplate4", "cs", "chrome/locale/cs/"],
      ["locale", "smarttemplate4", "de", "chrome/locale/de/"],
      ["locale", "smarttemplate4", "es", "chrome/locale/es/"],
      ["locale", "smarttemplate4", "fi", "chrome/locale/fi/"],
      ["locale", "smarttemplate4", "fr", "chrome/locale/fr/"],
      ["locale", "smarttemplate4", "id-ID", "chrome/locale/id-ID/"],
      ["locale", "smarttemplate4", "it", "chrome/locale/it/"],
      ["locale", "smarttemplate4", "ja", "chrome/locale/ja/"],
      ["locale", "smarttemplate4", "nl", "chrome/locale/nl/"],
      ["locale", "smarttemplate4", "pl", "chrome/locale/pl/"],
      ["locale", "smarttemplate4", "pt-BR", "chrome/locale/pt-BR/"],
      ["locale", "smarttemplate4", "ru", "chrome/locale/ru/"],
      ["locale", "smarttemplate4", "sl", "chrome/locale/sl/"],
      ["locale", "smarttemplate4", "sr", "chrome/locale/sr/"],
      ["locale", "smarttemplate4", "sv", "chrome/locale/sv/"],
      ["locale", "smarttemplate4", "uk", "chrome/locale/uk/"],
      ["locale", "smarttemplate4", "zh-CN", "chrome/locale/zh-CN/"],
      ["locale", "smarttemplate4", "zh-TW", "chrome/locale/zh-TW/"],
  ]);

  //attention: each target window (like messenger.xhtml) can appear only once
  // this is different from chrome.manifest
  // xhtml for Tb78
  
  messenger.WindowListener.registerWindow("chrome://messenger/content/messageWindow.xhtml", "chrome/content/scripts/st-messageWindow.js");  
  messenger.WindowListener.registerWindow("chrome://messenger/content/messenger.xhtml", "chrome/content/scripts/st-messenger.js");
  // inject a separate script for header pane!
  messenger.WindowListener.registerWindow("about:message", "chrome/content/scripts/st-messagePane.js");


  messenger.WindowListener.registerWindow("chrome://messenger/content/messengercompose/messengercompose.xhtml", "chrome/content/scripts/st-composer.js");
  messenger.WindowListener.registerWindow("chrome://messenger/content/customizeToolbar.xhtml", "chrome/content/scripts/st-customizetoolbar.js");
  
  /* add a background script to the settings window - needed for browser element! */
  messenger.WindowListener.registerWindow("chrome://smarttemplate4/content/settings.xhtml", "chrome/content/scripts/st-settings.js");  
  
  
  /*
  TbSync "As manipulating Thunderbirds own preference page is probably not going to be possible with 
          WebExtensions, I also did not add support for that into the WL. 
          Your own options have to go in your own options dialog."
    NICE TO HAVE: A panel under Composition & addressing going to 
  
    messenger.WindowListener.registerWindow("chrome://messenger/content/am-addressing.xhtml", "chrome/content/scripts/st-am-adressing.js");
    messenger.WindowListener.registerWindow("chrome://messenger/content/am-identity-edit.xhtml", "chrome/content/scripts/st-am-adressing.js");
  */

 /*
  * Start listening for opened windows. Whenever a window is opened, the registered
  * JS file is loaded. To prevent namespace collisions, the files are loaded into
  * an object inside the global window. The name of that object can be specified via
  * the parameter of startListening(). This object also contains an extension member.
  */

  messenger.WindowListener.startListening();
  
  // [issue 209] Exchange account validation
  messenger.accounts.onCreated.addListener( async(id, account) => {
    if (currentLicense.info.status == "MailNotConfigured") {
      // redo license validation!
      if (isDebugLicenser) console.log("Account added, redoing license validation", id, account); // test
      currentLicense = new Licenser(key, { forceSecondaryIdentity, debug: isDebugLicenser });
      await currentLicense.validate();
      if(currentLicense.info.status != "MailNotConfigured") {
        if (isDebugLicenser) console.log("notify experiment code of new license status: " + currentLicense.info.status);
        messenger.NotifyTools.notifyExperiment({licenseInfo: currentLicense.info});
      }
      if (isDebugLicenser) console.log("SmartTemplates license info:", currentLicense.info); // test
    } else {
      if (isDebugLicenser) console.log("SmartTemplates license state after adding account:", currentLicense.info)
    }
  });

  // [issue 284] resolve all variables automatically before send
  messenger.compose.onBeforeSend.addListener (
    async(tab, details) => {
      let retVal = null;
      let isDebug
      try {
        retVal = await messenger.Utilities.beforeSend(tab.id, details);
      } catch(ex) {
        console.log(ex);
      } finally {
        isDebug = await messenger.LegacyPrefs.getPref("extensions.smartTemplate4.debug");
        if (isDebug) {
          console.log("after messenger.Utilities.beforeSend()", {returnValue: retVal, composeDetail: details, tab});
        }
        return retVal;
      }
    }
  );
  

  messenger.messageDisplay.onMessageDisplayed.addListener(async (tab, message) => {
    let isDebug = await messenger.LegacyPrefs.getPref("extensions.smartTemplate4.debug");
    if (isDebug) {
      console.log(`Message displayed in tab ${tab.id}: ${message.subject}`);
    }
    await updateSubMenus([message], tab);
  });
  

  /// message selection listener
  browser.mailTabs.onSelectedMessagesChanged.addListener(
    async (tab, selectedMessages) => {
      // selectedMessages = list - see messages member. add logic to decide whether to show:
      // replyAll
      // replyList
      // redirect

      /* only 1 message may be selected */
      await updateSubMenus(selectedMessages.messages, tab);

    }
  )
  
  

}

main();
