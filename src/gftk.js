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

	/** @type {boolean} - if the toolkit is loaded */
	var _loaded = false;

	/** @type {string} - Base URL of toolkit files **/
	var _URL = './Toolkit/src/';

	/** @type {object} - GF Toolkit Panel */
	var _gftk = null;

	/**
	 * Toolkit Initialization
	 *
	 * Initializes the toolkit and loads necessary assets
	 */
	var _init = function()
	{
		if(_loaded == true) { return 0; }

		GFTK.loader('https://www.amobee.com/version.txt', 'html', function()
		{
			GFTK.loader(_URL + 'gftk.css', 'css');

			_gftk = document.createElement('div');
			_gftk.id = 'gf-toolkit-wrapper';
			_gftk.innerHTML = this.response;
		
			document.body.insertBefore(_gftk, document.getElementsByTagName('script')[0]);

			_addEventListener('click', '.gftk-save', GFTK.saveSettings); 
			
			_loaded = true;

			console.log('Glowforge Toolkit: Loaded (Have fun \'forging!)');
		});
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
	 * Open the GF Toolkit Panel
	 */
	GFTK.open = function()
	{
		_gftk.classList.add('open');
	}


	/**
	 * Close the GF Toolkit Panel
	 */
	GFTK.close = function()
	{
		_gftk.classList.remove('open');
	}

	/**
	 * Load a saved settings file
	 */
	GFTK.loadSettings = function()
	{

	}

	/**
	 * Save a settings file
	 */
	GFTK.saveSettings = function()
	{
		var settings = {};

		settings.items = [];

		settings.items.push({
			name: 'Item 1',
			order: 2,
			process: 'Manual Engrave',
			speed: 1000,
			power: 50,
			lpi: 225,
			focus: 0.267
		});

		settings.items.push({
			name: 'Item 2',
			order: 1,
			process: 'Proofgrade Score',
			speed: 500,
			power: 'FULL',
			lpi: 225,
			focus: 0.267
		});

		GFTK.export(settings, 'Test.settings');
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

				document.getElementsByTagName('head')[0].appendChild(el);
				break;

			case 'HTML':
				var async = (typeof callback == 'function') ? true : false;
				var request = new XMLHttpRequest();
				    request.open('GET', url, async);
				    request.send();

				if(async)
				{
					request.onload = callback;
					return;
				}
				else if(request.status === 200)
				{
					el = request.response;
				}
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
				var async = (typeof callback == 'function') ? true : false;
				var request = new XMLHttpRequest();

				request.open('GET', url, async);

				if(async) { request.responseType = 'json'; }

				request.send();

				if(async)
				{
					request.onload = callback;
					return;
				}
				else if(request.status === 200)
				{
					el = JSON.parse(request.response);
				}
				break;

			default:
				console.log('Glowforge Toolkit: Loader - missing or incorrect type definition.');
				break;
		}

		return el;
	}


	/**
	 * Save data as an external file.
	 * 
	 * @param {object|array} data - data to save
	 * @param {string} name - filename
	 */
	GFTK.export = function(data, name)
	{	
		var a = document.createElement('a');

console.log(data);
console.log(JSON.stringify(data));

		var f = new Blob([JSON.stringify(data)], {type: 'text/plain'});
		    a.href = URL.createObjectURL(f);
		    a.download = name;
		    a.click();
	}

	
	/**
	 * Add a delegated event listener
	 * 
	 * @param {string} type - event type
	 * @param {string} selector - delegation target selector
	 * @param {function} callback - event callback
	 */
	var _addEventListener = function(type, selector, callback)
	{
		window.addEventListener(type, function(e)
		{
			if(e.target && e.target.matches(selector))
			{
				callback.call(e.target);
			}
		});
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

