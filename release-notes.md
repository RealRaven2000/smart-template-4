The full change log with screen shots [can be found here](https://smarttemplates.quickfolders.org/version.html#4.10) 

**Maintenance verfsion 4.10.1**
<ul>
  <li> Fixed regression in 4.10: automatic forwarding with FiltaQuilla fails [issue #354]</li>
</ul>

**Enhancements - 4.10**

*   Added features to insert unquoted email and remove styles using `%quotePlaceHolder(nostyles)%` [issue #331]
*   Improved Capitalization for double-barrelled names (such as Tyler-Smith) [issue #343]
*   `%header.set(from)%` triggers unnecessary warning. [issue #352]
*   new `%dateformat.received()%` to retrieve date of original mail [issue #353]


**Bug Fixes - 4.10** 

*   Fixed: Common account settings for account were not stored [issue #340]
*   Fixed problems with `messageRaw()` function in Sandboxed script [issue #347]
*   Fixed: `%header.set(subject,clipboard)%` and `%matchTextFromBody(..,toclipboard)%` fail at commas [issue #344]
*   Fixed: `*selection*` truncates content in text nodes [issue #351]


**Sandboxed Script - 4.10** 

For deeper programming using inline script, several major improvements were implemented. For information on how to enable scripting and use it please refer to <a href="https://smarttemplates.quickfolders.org/premium.html#javascript">this documentation section</a>.

*   Support "composite" ST variables in sandboxed script (e.g. `header.set`) via underscores (`header_set`) [issue #349]
*   Support *multiple parameters* in sandboxed script (e.g. `%from(name,uppercase)%` )  [issue #350]
*   Simplified using reserved parameter such as `firstname`, `lastname` etc. these can be used directly as parameter by prefixing with a "$" character. Previously these had to be wrapped in double quotes. 

For example: 
```js
  let a = await from($name,$mail);
```

This will return the value that `%from(name,mail)%` would generate within the template. Note that all replacement functions are now asynchronous and need to be "awaited" if they are used within the script. Only when the script returns a variable directly without need for evaluation, it can be passed back directly (the promise will be resolved by SmartTemplates). It is highly recommended to read about asynchonous JavaScript brefore attempting to write longer scripts. console.log can be used within the sandboxed script and is highly encouraged!


**Miscellaneous**

*   Compatibility: deal with removal of `MozElements.NotificationBox.shown()`
*   made SmartTemplates compatible with Thunderbird 135.*


