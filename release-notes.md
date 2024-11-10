The full change log with screen shots [can be found here](https://smarttemplates.quickfolders.org/version.html#4.9) 

**Enhancements**

*   Added %tags% variable to insert tags in Email. This is a SmartTemplates Pro feature. [issue #320] Full documentation of this feature: [the support website](https://smarttemplates.quickfolders.org/premium.html#tags)
*   Variables Page: added missing text in explanation of the `%preHeader%` parameter  
*   Examples Page: added link to open Examples Page in browser.
*   Fixed spelling in Dutch months and days - these now start with lowercase letters
*   Support for multiple address parameters in `%header.set()%` / `%header.append()%` [issue #327]
*   Text search now includes text contained in tables. Also improved whitespace collapsing. [issue #328]
*   Support reading variables without parameters (e.g. `%from%`) within Sandbox script [issue #329] Examples for the new behavior can be [found here](https://smarttemplates.quickfolders.org/premium.html#javascript).
*   Optional preferred flavor parameter to %clipboard()%: plain, text, unicode, html. [issue #330]




**Bug Fixes** 

*   Fixed: SmartTemplates ignored when creating an email from the Thunderbird taskbar context menu [issue #322] - see also issue #272

**Miscellaneous**

*   Make SmartTemplates compatible with new ESM modules (jsm will be removed in the next ESR) [issue #324]


