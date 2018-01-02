# Glowforge UI Toolkit
A bookmarklet based toolkit to add missing functionality to the Glowforge UI.

## Installation:
To install the bookmarklet, simply drag the following link to your bookmarks bar:
[GF Toolkit](javascript:(function(\){var gft_loader=document.createElement('script'\);gft_loader.setAttribute('src','https://elusive-concepts.com/demo/gf-tools/loader.js'\);document.body.appendChild(gft_loader\);}\).call(this\);)

Alternatively, you can create a new bookmark, and paste the following as the page URL:
```javascript
javascript:(function(){var gft_loader=document.createElement('script');gft_loader.setAttribute('src','https://elusive-concepts.com/demo/gf-tools/loader.js');document.body.appendChild(gft_loader);}).call(this);
```

## Usage
Open the Glowforge UI, load your design, and then click the GF Toolkit bookmark.  The toolkit will load as a (minimized) overlay with additional options for working with your designs.
