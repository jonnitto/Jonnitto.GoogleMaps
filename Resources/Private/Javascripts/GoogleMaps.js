// Google Maps Function
// To set the options, use the global variable GoogleMapsOptions
// To set the marker pin, use the global variable GoogleMapsPin
// To include functions, use GoogleMapsFunction
window.initJonnittoGoogleMaps = function() {
	var feedback = [];
	var initClass = 'jonnitto-googlemaps-init';

	// We store eveything in one Object, so it's easier to include functions
	var object = {
		Map: {
			elements: document.querySelectorAll('.jonnitto-googlemaps-mapview'),
			options: {
				zoom              : 15,
				mapTypeControl    : true,
				streetViewControl : false,
				zoomControl       : true,
				scrollwheel       : false
			}
		},
		Streetview: {
			elements: document.querySelectorAll('.jonnitto-googlemaps-streetview'),
			options: {
				scrollwheel: false
			}
		}
	};

	// Check if String is a Float
	function isFloat(val) {
		var floatRegex = /^-?\d+(?:[.,]\d*?)?$/;
		if (!floatRegex.test(val)) {
			return false;
		}
		val = parseFloat(val);
		if (isNaN(val)) {
			return false;
		}
		return true;
	}

	function extend(object, inject) {
		for (var key in inject) {
			if (inject.hasOwnProperty(key)) {
				object[key] = inject[key];
			}
		}
		return object;
	}

	function getNumber(element, value) {
		var number = parseInt(element.getAttribute('data-' + value));
		if (typeof number === 'number' && number) {
			return number;
		}
		return false;
	}

	function hasData(element, value) {
		return element.getAttribute('data-' + value) !== null;
	}

	function getLocation(element, callback) {
		var address = element.getAttribute('data-location');
		var split = address.split(',');
		var coordinates;

		function successful(location) {
			element.className += ' ' + initClass;
			callback(location);
		}

		function failed(status) {
			if (document.body.className.indexOf('neos-backend') > -1) {
				// We are in the backend of Neos
				var sentence = 'Geocode was not successful';
				if (status) {
					alert(sentence + ' for the following reason: ' + status);
				} else {
					alert(sentence);
				}
			}
		}

		if (split.length == 2 && isFloat(split[0].trim()) && isFloat(split[1].trim())) {
			// Input are coordinates
			coordinates = new google.maps.LatLng(split[0].trim(), split[1].trim());
			successful(coordinates);
		} else {
			coordinates = new google.maps.Geocoder();
			coordinates.geocode({
				address: address
			}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					successful(results[0].geometry.location);
				} else {
					failed(status);
				}
				return false;
			});
		}
	}

	function renderMap(location) {
		var mapOptions = object.Map.options;
		var zoom = getNumber(map, 'zoom');
		var content = map.content || null;
		if (content === null) {
			content = map.innerHTML.replace(/^\s+|\s+$/g,'') || false;
			map.content = content;
		}
		var storage = {
			content : content,
			LatLng  : location,
			lat : location.lat(),
			lng : location.lng()
		};

		if (zoom) {
			mapOptions.zoom = zoom;
		}
		mapOptions.center = storage.LatLng;
		storage.map = new google.maps.Map(map, mapOptions);

		if (storage.content) {
			storage.infowindow = new google.maps.InfoWindow({
				content: storage.content
			});
		}

		// define marker
		var marker = {
			position: storage.LatLng,
			title : map.getAttribute('data-marker-title'),
			map: storage.map,
			draggable: false
		};

		if (typeof GoogleMapsPin === 'string') {
			marker.icon = GoogleMapsPin;
		} else if (typeof GoogleMapsPin === 'object') {
			extend(marker, GoogleMapsPin);
		}

		storage.marker = new google.maps.Marker(marker);

		if (hasData(map,'showinfo') && storage.content) {
			storage.infowindow.open(storage.map,storage.marker);
		}

		// jshint loopfunc:true
		if (typeof window.addEventListener === 'function') {
			(function(_storage) {
				google.maps.event.addListener(_storage.marker, 'click', function() {
					if (_storage.content) {
						_storage.infowindow.open(_storage.map, _storage.marker);
					} else {
						window.open('https://www.google.com/maps/dir//' + _storage.lat + ',' + _storage.lng);
					}
				});
			})(storage);
		}
		// jshint loopfunc:false
	};

	function renderStreetview(location) {
		var streetStorage = object.Streetview.options;
		streetStorage.position = location;
		streetStorage.pov = {
			heading: getNumber(streetview, 'heading') || 0,
			pitch: getNumber(streetview, 'pitch') || 0
		};
		new google.maps.StreetViewPanorama(streetview, streetStorage);
	};

	for (var key in object) {
		var num = object[key].elements.length;
		object[key].index = num;
		feedback[feedback.length] = num + ' ' + key + (num == 1 ? '' : 's') + ' found';
	}

	if (typeof GoogleMapsFunction === 'function') {
		GoogleMapsFunction();
	}

	if (typeof GoogleMapsOptions === 'object') {
		extend(object.Map.options, GoogleMapsOptions);
	}

	if (typeof GoogleStreetviewOptions === 'object') {
		extend(object.Streetview.options, GoogleStreetviewOptions);
	}

	for (var m = 0; m < object.Map.index; m++) {
		var map = object.Map.elements[m];

		if (map.className.indexOf(initClass) === -1) {
			getLocation(map, renderMap);
		}
	}

	for (var s = 0; s < object.Streetview.index; s++) {
		var streetview = object.Streetview.elements[s];

		if (streetview.className.indexOf(initClass) === -1) {
			getLocation(streetview, renderStreetview);
		}
	}

	return feedback;

};
