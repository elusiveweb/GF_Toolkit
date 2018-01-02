# Glowforge UI Toolkit
A bookmarklet based toolkit to add missing functionality to the Glowforge UI.

## Installation:
To install the bookmarklet, create a new bookmark and paste the following as the page URL:
```javascript
javascript:(function(){var gft_loader=document.createElement('script');gft_loader.setAttribute('src','https://elusive-concepts.com/demo/gf-tools/loader.js');document.body.appendChild(gft_loader);}).call(this);
```

Alternatively, you can open the [bookmarklet.html](src/bookmarklet.html) file and drag the link to your bookmarks bar.

## Usage
Open the Glowforge UI, load your design, and then click the GF Toolkit bookmark.  The toolkit will load as a (minimized) overlay with additional options for working with your designs.
