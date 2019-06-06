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

## License

Licensed under MIT, see [LICENSE](LICENSE)
