[![Latest Stable Version](https://poser.pugx.org/jonnitto/googlemaps/v/stable)](https://packagist.org/packages/jonnitto/googlemaps)
[![Total Downloads](https://poser.pugx.org/jonnitto/googlemaps/downloads)](https://packagist.org/packages/jonnitto/googlemaps)
[![License](https://poser.pugx.org/jonnitto/googlemaps/license)](LICENSE)
[![GitHub forks](https://img.shields.io/github/forks/jonnitto/Jonnitto.GoogleMaps.svg?style=social&label=Fork)](https://github.com/jonnitto/Jonnitto.GoogleMaps/fork)
[![GitHub stars](https://img.shields.io/github/stars/jonnitto/Jonnitto.GoogleMaps.svg?style=social&label=Stars)](https://github.com/jonnitto/Jonnitto.GoogleMaps/stargazers)
[![GitHub watchers](https://img.shields.io/github/watchers/jonnitto/Jonnitto.GoogleMaps.svg?style=social&label=Watch)](https://github.com/jonnitto/Jonnitto.GoogleMaps/subscription)
[![GitHub followers](https://img.shields.io/github/followers/jonnitto.svg?style=social&label=Follow)](https://github.com/jonnitto/followers)
[![Follow Jon on Twitter](https://img.shields.io/twitter/follow/jonnitto.svg?style=social&label=Follow)](https://twitter.com/jonnitto)

# Jonnitto.GoogleMaps Package for Neos CMS

With this package you can include Google Maps and / or Streetview and even Static Maps in a simple way into [Neos CMS](https://www.neos.io). Contributions are very welcome!

## Installation

Most of the time you have to make small adjustments to a package (e.g. configuration in Settings.yaml). Because of that, it is important to add the corresponding package to the composer from your theme package. Mostly this is the site packages located under Packages/Sites/. To install it correctly go to your theme package (e.g.Packages/Sites/Foo.Bar) and run following command:

```bash
composer require jonnitto/googlemaps --no-update
```

The --no-update command prevent the automatic update of the dependencies. After the package was added to your theme composer.json, go back to the root of the Neos installation and run composer update. Et voilà! Your desired package is now installed correctly.

## Google API
You'll need at least an API Key from Google, and if you want to use Static Maps, you need also a signing secret. [Read here how to get theese keys](https://developers.google.com/maps/documentation/maps-static/get-api-key)  
You will need following APIs:

* [Geocoding API](https://developers.google.com/maps/documentation/geocoding)
* [Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/)
* For static maps you'll also need the [Maps Static API
Go to Console
](https://developers.google.com/maps/documentation/maps-static/)

## Modification

* To set the options, use the global variable `GoogleMapsOptions`
* To set the marker pin, use the global variable `GoogleMapsPin`
* To include functions, use `GoogleMapsFunction`

In the Javscript of the package, following code gets executed:

```js

if (typeof GoogleMapsPin === "string") {
    marker.icon = GoogleMapsPin;
} else if (typeof GoogleMapsPin === "object") {
    extend(marker, GoogleMapsPin);
}
        
if (typeof GoogleMapsFunction === "function") {
    GoogleMapsFunction();
}

if (typeof GoogleMapsOptions === "object") {
    extend(object.Map.options, GoogleMapsOptions);
}

if (typeof GoogleStreetviewOptions === "object") {
    extend(object.Streetview.options, GoogleStreetviewOptions);
}
```

Like that, you can do almost everything with the map. 

### Example: Custom pin

```js
window.GoogleMapsFunction () => {
    window.GoogleMapsPin = {
        icon: {
            url: '/YOUR/PATH/TO/THE/MapPin.png',
            anchor: new google.maps.Point(10, 50),
            scaledSize: new google.maps.Size(22, 40)
        }
    };
}
```

or

```js
window.GoogleMapsPin = '/YOUR/PATH/TO/THE/MapPin.png';
```

### Example: Custom map options

```js
window.GoogleMapsOptions = {
    streetViewControl: false,
    mapTypeControl: false,
    scrollwheel: false,
    styles: [
        {
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#f5f5f5"
                }
            ]
        }
    ]
};
```


## License

Licensed under MIT, see [LICENSE](LICENSE)
