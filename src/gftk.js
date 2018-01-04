/**
 * Glowforge Toolkit
 *
 * Glowforge app toolkit developed by https://elusive-concepts.com
 *
 * @copyright 2018 Elusive Concepts, LLC. All rights reserved.
 * @author Roger Soucy <roger.soucy@elusive-concepts.com>
 */

console.log('GF Toolkit - by Elusive Concepts, LLC. (https://elusive-concepts.com): Loading...');

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
	var _URL = 'https://elusive-concepts.com/projects/gf-toolkit/';

	/** @type {object} - GF Toolkit Panel */
	var _gftk = null;

	/** @type {string} - GF Design ID */
	var _design_id = null;

	/** @type {object} - file input for loading settings */
	var _file_selector = null;

	/**
	 * Toolkit Initialization
	 *
	 * Initializes the toolkit and loads necessary assets
	 */
	var _init = function()
	{
		if(_loaded == true) { return 0; }

		GFTK.loader(_URL + 'gftk.html', 'html', function()
		{
			GFTK.loader(_URL + 'gftk.css', 'css');

			_gftk = document.createElement('div');
			_gftk.id = 'gftk';
			_gftk.innerHTML = this.response;

			document.body.appendChild(_gftk);

			_addEventListener('click', '.gftk-title', GFTK.togglePanel);
			_addEventListener('click', '.gftk-toggle', GFTK.togglePanel);
			_addEventListener('click', '.gftk-save-settings', GFTK.saveSettings);
			_addEventListener('click', '.gftk-load-settings', GFTK.loadSettings);

			_design_id = window.design_id || document.location.pathname.replace('/designs/','').replace('/edit','');

			_loaded = true;

			console.log('GF Toolkit: Loaded for design ID [' + _design_id + '] (Have fun \'forging!)');
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
	 * Toggle the GF Toolkit Panel
	 */
	GFTK.togglePanel = function()
	{
		if(_gftk.classList.contains('open')) { GFTK.close(); }
		else                                 { GFTK.open();  }
	}



	/**
	 * Open the GF Toolkit Panel
	 */
	GFTK.open = function()
	{
		var toggle = _gftk.querySelector('.gftk-toggle');
		toggle.innerHTML = toggle.getAttribute('data-open');
		_gftk.classList.add('open');
	}


	/**
	 * Close the GF Toolkit Panel
	 */
	GFTK.close = function()
	{
		var toggle = _gftk.querySelector('.gftk-toggle');
		toggle.innerHTML = toggle.getAttribute('data-closed');
		_gftk.classList.remove('open');
	}


	/**
	 * Ignore all steps
	 */
	GFTK.ignoreAll = function()
	{
		var steps = GFTK.getReactComponent('.steps');
		var settings = GFTK.getSettings();

		for(var i in settings.steps)
		{
			steps.props.onChangeType(settings.steps[i].id, 'ignore');
		}
	}


	/**
	 * Load a saved settings file
	 */
	GFTK.loadSettings = function()
	{
		if(window.File && window.FileReader && window.FileList && window.Blob)
		{
			if(!_isset(_file_selector))
			{
				_file_selector = document.createElement('input');
				_file_selector.setAttribute('type', 'file');
				_file_selector.addEventListener('change', function(e)
				{
					var reader = new FileReader();
					reader.addEventListener('load', function()
					{
						GFTK.applySettings(JSON.parse(this.result));
					});
					reader.readAsText(e.target.files[0]);
				}, false);
			}

			_file_selector.click();
		}
		else
		{
			console.log('The File APIs are not fully supported in this browser.');
		}
	}


	/**
	 * Apply Settings
	 *
	 * This function attempts to apply the settings specified in the passed data
	 * object. This expects the object to have two members, "material" which is
	 * a material settings object containing the material id and nominal_thickness
	 * and a steps object which contains settings for individual step operations.
	 *
	 * This attempts to hook into the React components and issue the proper
	 * React APIs for updating settings. There are a LOT of caveats to this, and
	 * bugs are likely if the React components change, or something unexpected
	 * is found in the settings object
	 *
	 * @param {object} settings - setting data object
	 *
	 * @todo Proper ordering of steps
	 */
	GFTK.applySettings = function(settings)
	{
		console.log('GF Toolkit: Processing settings file...', settings);

		if(typeof settings.material == 'undefined' || settings.material == null)
		{
			console.log('GF Toolkit: Missing material settings - aborting.');
			return false;
		}

		// Load Material Settings
		//
		// material.props.onChangeMaterial(type)
		// material.props.onChangeUnknownMaterialThickness(value)
		//
		var material = GFTK.getReactComponent('.tool-area .start');

		material.props.onChangeMaterial(settings.material.id);

		if(settings.material.id == 'UNKNOWN')
		{
			material.props.onChangeUnknownMaterialThickness(settings.material.nominal_thickness);
		}

		if(typeof settings.steps == 'undefined' || settings.steps == null)
		{
			console.log('GF Toolkit: Missing step settings - aborting.');
			return false;
		}

		// Load Step Settings
		//
		// target = s_ + _design_id + _ item_id
		// steps.props.onChangeDitherSetting(target, value, ?(r))
		// steps.props.onChangeEngraveLevel(target, value)
		// steps.props.onChangeEngraveScanGap(target, value)
		// steps.props.onChangeManualMaterialThickness(target, value)
		// steps.props.onChangeManualNumberOfPasses(target, value)
		// steps.props.onChangeManualPower(target, value)
		// steps.props.onChangeManualScanGap(target, value)
		// steps.props.onChangeManualSpeed(target, value)
		// steps.props.onChangeManualType(target, value)
		// steps.props.onChangeSubType(target, value)
		// steps.props.onChangeType(target, value)
		// steps.props.onMoveCardToTop(target)
		// steps.props.onMoveCardToBottom(target)
		//
		var steps = GFTK.getReactComponent('.steps');

		for(var s in settings.steps)
		{
			// lets attempt to use the given ID, but build our own if it doesn't
			// exist (which would happen when sharing a settings file or using
			// the "add artwork" button)
			var group = document.getElementById('group-' + settings.steps[s].id);

			if(typeof group == 'object' && group !== null)
			{
				id = settings.steps[s].id;
			}
			else
			{
				id = 's_' + _design_id + '_' + settings.steps[s].baseId;
			}

			// This is lazy. The app tends to save settings in ascending order,
			// so reordering them this way is fast and simple, but it'll probably break
			if(settings.steps[s].order == s)
			{
				steps.props.onMoveCardToBottom(id);
			}

			// Proofgrade Settings
			if(settings.steps[s].type != "manual")
			{
				steps.props.onChangeType(id,    settings.steps[s].type);
				steps.props.onChangeSubType(id, settings.steps[s].subType);

				if(_isset(settings.steps[s].engraveType) && settings.steps[s].engraveType == 'raster')
				{
					steps.props.onChangeSubType(id, settings.steps[s].engraveType);
				}

				if(settings.steps[s].type != 'cut')
				{
					steps.props.onChangeEngraveLevel(id, settings.steps[s].engraveLevel)
				}
			}

			// Manual Settings
			else
			{
				// Manual score requires we set type to engrave and sybtype to vector
				// before we actually set the type to manual.
				if(_isset(settings.steps[s].engraveType) && settings.steps[s].engraveType == 'vector')
				{
					steps.props.onChangeType(id,    settings.steps[s].manualDefaultType);
					steps.props.onChangeSubType(id, settings.steps[s].engraveType);
				}

				steps.props.onChangeType(id,    settings.steps[s].type);
				steps.props.onChangeSubType(id, settings.steps[s].subType);

				steps.props.onChangeManualPower(id, settings.steps[s].manualSettings.power);
				steps.props.onChangeManualSpeed(id, settings.steps[s].manualSettings.speed);

				if(_isset(settings.steps[s].manualSettings.scangap))
				{
					steps.props.onChangeManualScanGap(id, settings.steps[s].manualSettings.scangap);
				}

				if(_isset(settings.steps[s].manualSettings.passes))
				{
					steps.props.onChangeManualNumberOfPasses(id, settings.steps[s].manualSettings.passes);
				}

				if(_isset(settings.steps[s].engraveType) && settings.steps[s].engraveType == 'raster')
				{
					steps.props.onChangeDitherSetting(id, 'dither_method', settings.steps[s].manualSettings.raster.dither_method);
					steps.props.onChangeDitherSetting(id, 'min_power', settings.steps[s].manualSettings.raster.min_power);
					steps.props.onChangeDitherSetting(id, 'min_gray_percent', settings.steps[s].manualSettings.raster.min_gray_percent);
					steps.props.onChangeDitherSetting(id, 'max_gray_percent', settings.steps[s].manualSettings.raster.max_gray_percent);
				}
			}
		}

		console.log('GF Toolkit: Finished loading settings.');
	}


	/**
	 * get current usable settings as multi-dimensional array
	 *
	 * @param {boolean} full - return full settings array if true
	 *
	 * @return {array} - settings array
	 */
	GFTK.getSettings = function(full)
	{
		full = full || false;

		var settings = {};

		var material = GFTK.getReactComponent('.tool-area .start');
		    material = material.props.selectedMaterial;

			material = _remap(material);

		if(!full)
		{
			material = {
				id:                    material.id,
				title:                 material.title,
				thickness_name:        material.thickness_name,
				nominal_thickness:     material.nominal_thickness,
				thickness_millimeters: material.nominal_thickness,
				thickness_inches:      material.nominal_thickness / 25.4
			};
		}

		var steps = GFTK.getReactComponent('.steps');
		    steps = steps.props.steps;

		    steps = _remap(steps);

		if(!full)
		{
			for(var s in steps)
			{
				var baseId = steps[s].id.substr(steps[s].id.lastIndexOf('_')+1);

				steps[s] = {
					id:                steps[s].id,
					baseId:            baseId,
			    	order:             steps[s].order,
			   		type:              steps[s].type,
			   		subType:           steps[s].subType,
			   		engraveLevel:      steps[s].engraveLevel,
			   		engraveType:       steps[s].engraveType,
			   		manualType:        steps[s].manualType,
			   		manualDefaultType: steps[s].manualDefaultType,
			   		manualSettings:    steps[s].manualSettings
			   	};
			}
		}

		settings.material = material;
		settings.steps    = _remap(steps);

		return settings;
	}


	/**
	 * Save a settings file
	 */
	GFTK.saveSettings = function()
	{
		var settings = GFTK.getSettings();

		console.log('GF Toolkit: Settings', settings);

		GFTK.export(settings, _design_id + '.settings');
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
		var f = new Blob([JSON.stringify(data)], {type: 'text/plain'});
		    a.href = URL.createObjectURL(f);
		    a.download = name;
		    a.click();
	}


	/**
	 * Select React Component
	 *
	 * @param {string} selector - query selector
	 *
	 * @return {ReactComponent} - React Component
	 */
	GFTK.getReactComponent = function(selector)
	{
		var obj = document.querySelector(selector);

		if(obj === null) { return false; }

		for (var key in obj)
		{
			if (key.startsWith("__reactInternalInstance$"))
			{
				var compInternals = obj[key]._currentElement;
				var compWrapper = compInternals._owner;
				var comp = compWrapper._instance;
				return comp;
			}
		}

		return false;
	}


	/**
	 * Recursively remap collections into arrays and objects
	 *
	 * @param  {object|array} obj - Collection, object, or array to remap
	 *
	 * @return {array}
	 */
	var _remap = function(obj)
	{
		var obj_2 = null;

		if(obj === null) { return obj; }

		if(typeof obj == 'object' && typeof obj.forEach == 'function')
		{
			obj.forEach(function(v, k)
			{
				if(typeof k == 'number')
				{
					if(obj_2 === null) { obj_2 = []; }
					obj_2.push(_remap(v));
				}
				else
				{
					if(obj_2 === null) { obj_2 = {}; }
					obj_2[k] = _remap(v);
				}
			});
		}
		else
		{
			obj_2 = obj;
		}

		return obj_2;
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



	/**
	 * Check if a variable is set
	 *
	 * @param {*} v - variable to check
	 *
	 * @return {boolean}
	 */
	var _isset = function(v, name)
	{
		return (v !== null && typeof v != 'undefined')
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

}(window.GF_TOOLKIT = window.GF_TOOLKIT || {}));
