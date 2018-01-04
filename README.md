# Glowforge UI Toolkit
A bookmarklet based toolkit to add missing functionality to the Glowforge UI.

## Disclaimers:
I don't work for Glowforge, and this code is not oficially supported by Glowforge. This is a hack to add certain functionality to the Glowforge UI.

__USE THIS AT YOUR OWN RISK!__

This module hooks into the build in UI functionality of the Glowforge App, and performs some tasks directly (without user interaction). The outcome of these actions may not be as expected. Additionally, this code relies on the current implementation of the Glowforge UI. Any changes by Glowforge will likely break this plugin.

As this plugin has access to all the information you see when logged into the Glowforge App, it is possible for a malicious developer to steal that information. It is highly suggested that you review the source code before using this bookmarklet, and be wary of any forks of this code that may insert malicious functionality.

## Installation:
To install the bookmarklet, create a new bookmark and paste the following as the page URL:
```javascript
javascript:(function(){var gftk=document.createElement('script');gftk.setAttribute('src','https://elusive-concepts.com/projects/gf-toolkit/gftk.js');document.body.appendChild(gftk);}).call();
```

Alternatively, you can open the [bookmarklet.html](src/bookmarklet.html) file and drag the link to your bookmarks bar.

## Usage:
Open the Glowforge UI, load your design, and then click the GF Toolkit bookmark.  The toolkit will load as a (minimized) overlay with additional options for working with your designs.

## Tools:
Currently, there are two tools available. Hopefully, as time passes, more will be added.

### Save Settings
The save settings button polls the current settings in the UI, remaps them to a simple object/array structure, and saves the settings as a json file. By default, the name of the file is &lt;design_id&gt;.settings, but this can be changed to whatever you wish. As a JSON file, it is human readable, but the structure should not be changed or it will no longer work as intended.

#### Tips:
* You can save multiple settings files for a single design, all with different options
* Save your design settings for Proofgrade materials, or manual settings for easy loading
* try renaming your settings files for easier use (e.g. &lt;design&gt;.pg.settings or &lt;design&gt;.baltic-birch-ply.settings

### Load Settings
The load settings button allows you you browse locally for a settings file, which will then be loaded into the app and applied to the current design. This settings file must be properly structured, or else it will not work as intended.

#### Tips:
* Allow your design to fully load before attempting to load a settings file
* Settings are applied reasonably quickly, but it can take a long time for the UI to update the workspace, especially with complex designs
* When in doubt, give it some time (you can also look in the developer console for output, but the GF app puts out a lot of info/errors, so it can be hard to parse)
* Use Chrome (other browsers may work, but they may not)

## Issues:
* The placement of your designs __will NOT be saved__!!!!! I view this as preferred functionality (also, it would be really difficult to save placements).
* Settings are based on a unique design id, which means sharing settings files may or may not work (the plugin attempts to be smart about this, but it won't always get it right). This also mean that weird things will happen when using the "Add Artwork" button. This plugin is best used on designs that need nothing more than configuration in the app.
* This was built and tested in chrome (other browsers may or may not work)
* Occasionally, a settings file will fail to load without error, just try again
* If settings are applied incorrectly, do not use the file, reload the page and try again
* As the GF app uses a routing scheme to move around the app, the plugin persists throughout once loaded (e.g. when going home). It's best to reload the page, then restart the plugin when you've loaded a new design.
* I'm sure there's more issues. If you run into something, reload everything ant try again. If issues persist, let me know, but no guarantees are made about fixing them.

__This plugin is unsupported and may cease to function at any time__

