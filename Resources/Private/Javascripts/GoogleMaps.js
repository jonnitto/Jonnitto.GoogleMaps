// Google Maps Function
// To set the options, use the global variable GoogleMapsOptions
// To set the marker pin, use the global variable GoogleMapsPin
// To include functions, use GoogleMapsFunction
window.initJonnittoGoogleMaps = function () {
    let feedback = [];
    const initClass = 'jonnitto-googlemaps-init';

    // We store eveything in one Object, so it's easier to include functions
    let object = {
        Map: {
            elements: document.querySelectorAll('.jonnitto-googlemaps-mapview'),
            options: {
                zoom: 15,
                mapTypeControl: true,
                streetViewControl: false,
                zoomControl: true,
                scrollwheel: false,
            },
        },
        Streetview: {
            elements: document.querySelectorAll('.jonnitto-googlemaps-streetview'),
            options: {
                scrollwheel: false,
            },
        },
    };

    // Check if String is a Float
    function isFloat(val) {
        const floatRegex = /^-?\d+(?:[.,]\d*?)?$/;
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
        for (let key in inject) {
            if (inject.hasOwnProperty(key)) {
                object[key] = inject[key];
            }
        }
        return object;
    }

    function getNumber(element, value) {
        const number = parseInt(element.getAttribute('data-' + value));
        if (typeof number === 'number' && number) {
            return number;
        }
        return false;
    }

    function hasData(element, value) {
        return element.getAttribute('data-' + value) !== null;
    }

    function getLocation(element, callback) {
        const address = element.getAttribute('data-location');
        const split = address.split(',');
        let coordinates;

        function successful(location) {
            element.classList.add(initClass);
            callback({ element: element, location: location });
        }

        function failed(status) {
            if (document.body.classList.contains('neos-backend')) {
                // We are in the backend of Neos
                const sentence = 'Geocode was not successful';
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
            coordinates.geocode(
                {
                    address: address,
                },
                function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        successful(results[0].geometry.location);
                    } else {
                        failed(status);
                    }
                    return false;
                }
            );
        }
    }

    function renderMap(options) {
        let mapOptions = object.Map.options;
        const zoom = getNumber(options.element, 'zoom');
        let content = options.element.content || null;
        if (content === null) {
            content = options.element.innerHTML.replace(/^\s+|\s+$/g, '') || false;
            options.element.content = content;
        }
        let storage = {
            content: content,
            LatLng: options.location,
            lat: options.location.lat(),
            lng: options.location.lng(),
        };

        if (zoom) {
            mapOptions.zoom = zoom;
        }
        mapOptions.center = storage.LatLng;
        storage.map = new google.maps.Map(options.element, mapOptions);

        if (storage.content) {
            storage.infowindow = new google.maps.InfoWindow({
                content: storage.content,
            });
        }

        // define marker
        let marker = {
            position: storage.LatLng,
            title: options.element.getAttribute('data-marker-title'),
            map: storage.map,
            draggable: false,
        };

        if (typeof GoogleMapsPin === 'string') {
            marker.icon = GoogleMapsPin;
        } else if (typeof GoogleMapsPin === 'object') {
            extend(marker, GoogleMapsPin);
        }

        storage.marker = new google.maps.Marker(marker);

        if (hasData(options.element, 'showinfo') && storage.content) {
            storage.infowindow.open(storage.map, storage.marker);
        }

        // jshint loopfunc:true
        if (typeof window.addEventListener === 'function') {
            (function (_storage) {
                google.maps.event.addListener(_storage.map, 'bounds_changed', function () {
                    _storage.center = _storage.map.getCenter();
                });
                google.maps.event.addDomListener(window, 'resize', function () {
                    _storage.map.setCenter(_storage.center);
                });
                google.maps.event.addListener(_storage.marker, 'click', function () {
                    if (_storage.content) {
                        _storage.infowindow.open(_storage.map, _storage.marker);
                    } else {
                        window.open('https://www.google.com/maps/dir//' + _storage.lat + ',' + _storage.lng);
                    }
                });
            })(storage);
        }
        // jshint loopfunc:false
    }

    function renderStreetview(options) {
        let streetStorage = object.Streetview.options;
        streetStorage.position = options.location;
        streetStorage.pov = {
            heading: getNumber(options.element, 'heading') || 0,
            pitch: getNumber(options.element, 'pitch') || 0,
        };
        new google.maps.StreetViewPanorama(options.element, streetStorage);
    }

    for (let key in object) {
        const num = object[key].elements.length;
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

    for (let m = 0; m < object.Map.index; m++) {
        const map = object.Map.elements[m];

        if (!map.classList.contains(initClass)) {
            getLocation(map, renderMap);
        }
    }

    for (let s = 0; s < object.Streetview.index; s++) {
        const streetview = object.Streetview.elements[s];

        if (!streetview.classList.contains(initClass)) {
            getLocation(streetview, renderStreetview);
        }
    }

    return feedback;
};
