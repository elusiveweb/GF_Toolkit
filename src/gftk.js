/**
 * Glowforge Toolkit
 *
 * Glowforge app toolkit developed by https://elusive-concepts.com
 *
 * @copyright 2018 Elusive Concepts, LLC. All rights reserved.
 * @author Roger Soucy <roger.soucy@elusive-concepts.com>
 */

console.log('Glowforge Toolkit - by Elusive Concepts, LLC. (https://elusive-concepts.com): Loading...');

// GF_TOOLKIT / GFTK Namespace
(function(GFTK, undefined){

	/**
	 * This callback type is called `requestCallback` and is displayed as a global symbol.
	 *
	 * @callback requestCallback
	 * @param {string} responseMessage
	 */

	/** @type {Boolean} - if the toolkit is loaded */
	var _loaded = false;


	/**
	 * Toolkit Initialization
	 *
	 * Initializes the toolkit and loads necessary assets
	 */
	var _init = function()
	{
		if(_loaded == true) { return 0; }

		console.log('Glowforge Toolkit: Loaded (Have fun \'forging!)');
	}

	/**
	 * Check if the toolkit is loaded and initialized
	 *
	 * @return {boolean}
	 */
	GFTK.isLoaded = function()
	{
		return _loaded;
	}

	/**
	 * Load an external file and either inject or return the response
	 * based on the type parameter.
	 * 
	 * @param {string} url  - external file to load
	 * @param {string} type - one of [CSS, SCRIPT, IMAGE, JSON]
	 * @param {requestCallback} callback - optional callback for ajax requests
	 * 
	 * @return {*}
	 */
	GFTK.loader = function(url, type, callback)
	{
		var el;

		switch(type.toUpperCase())
		{
			case 'CSS':
			case 'STYLE':
				el = document.createElement('link');
				el.type = 'text/css';
				el.rel  = 'stylesheet';
				el.href = url;
				el.media = 'screen';

				document.getElementsByTagName('head')[0].appendChild('el');
				break;

			case 'IMAGE':
				el = new Image();
				el.src = url;
				break;

			case 'SCRIPT':
				el = document.createElement('script');
				el.setAttribute('language', 'JavaScript');
				el.setAttribute('src', url);

				document.body.appendChild(el);
				break;

			case 'JSON':
				var request = new XMLHttpRequest();
				request.open('GET', url);
				request.responseType = 'json';
				request.send();

				if(typeof callback == 'function')
				{
					request.onload = callback;
					return;
				}
				else
				{
					request.onload = function() { el = request.response; }
				}
				break;

			default:
				console.log('Glowforge Toolkit: Loader - missing or incorrect type definition.');
				break;
		}

		return el;
	}

	// Initialize the toolkit on first load
	if(document.readyState === 'complete')
	{
		_init();
	}
	else
	{
		window.addEventListener('load', function() { _init(); }, true);
	}

}(window.GF_TOOLKIT || {}));

