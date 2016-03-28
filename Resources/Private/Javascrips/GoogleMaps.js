// Google Maps Function
// To set the options, use the global variable GoogleMapsOptions
// To set the marker pin, use the global variable GoogleMapsPin
// To include functions, use GoogleMapsFunction
window.initJonnittoGoogleMaps = function() {
	var feedback = [];

	// We store eveything in one Object, so it's easier to inlclude functions
	var object = {
		Map: {
			elements: document.querySelectorAll('.google-map'),
			options: {
				zoom              : 15,
				mapTypeControl    : true,
				streetViewControl : false,
				zoomControl       : true,
				scrollwheel       : false
			}
		},
		Streetview: {
			elements: document.querySelectorAll('.google-streetview'),
			options: {
				scrollwheel: false
			}
		}
	};

	var extend = function(object, inject) {
		for (var key in inject) {
			if (inject.hasOwnProperty(key)) {
				object[key] = inject[key];
			}
		}
		return object;
	};

	var getNumber = function(element, value) {
		var number = parseInt(element.getAttribute('data-' + value));
		if (typeof number === 'number' && number) {
			return number;
		}
		return false;
	};

	var hasData = function(element, value) {
		return element.getAttribute('data-' + value) !== null;
	};

	var getLocation = function(element, callback) {
		var address = element.getAttribute('data-location');
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({
			address: address
		}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				callback(results[0].geometry.location);
			} else if (document.body.className.indexOf('neos-backend') > -1) {
				// We are in the backend of Neos
				alert('Geocode was not successful for the following reason: ' + status);
			}
			return false;
		});
	};

	var renderMap = function(location) {
		var mapOptions = object.Map.options;
		var zoom = getNumber(map, 'zoom');
		var storage = {
			content : map.innerHTML,
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

	var renderStreetview = function(location) {
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

		if (map.className.indexOf('init') === -1) {
			map.className += ' init';
			getLocation(map, renderMap);
		}
	}

	for (var s = 0; s < object.Streetview.index; s++) {
		var streetview = object.Streetview.elements[s];

		if (streetview.className.indexOf('init') === -1) {
			streetview.className += ' init';
			getLocation(streetview, renderStreetview);
		}
	}

	return feedback;

};
