[![Sponsor][sponsor-badge]][sponsor]
[![GitHub release][badge-github-release]][airqmon-latest-release]
[![David][badge-david-deps]][david]
[![GitHub Actions][badge-gh-actions]][gh-actions]
[![License][badge-license]][license]

# <img src="https://user-images.githubusercontent.com/1029142/32918679-7336704a-cb23-11e7-92b2-d8a7f2588055.png" width="38px" alt="Airqmon icon" align="top" /> Airqmon

A macOS menu bar application that displays live air quality data from the nearest sensor station. It can also notify you when the air quality index changes or when a new, closer station is found.

<p align="center">
  <img width="492" align="center" alt="Airqmon window with measurement details" src="https://airqmon.app/assets/airqmon-overview@2x.png" />
</p>

<p align="center">
  <img src="https://user-images.githubusercontent.com/1029142/36537429-674931ba-17d0-11e8-88ee-c246226c1053.png" width="378px" align="center" alt="Airqmon notification about air quality" />
</p>

Supported data providers:

- [Airly][airly] (lots of active sensors in 🇵🇱 and a few in main cities of 🇩🇪🇬🇧🇳🇱🇧🇪🇸🇮),

## Installation

Download the [latest release][airqmon-latest-release], unzip and drag to your `Applications` folder.

### Update

Simply overwrite previous application in your `Applications` folder with a newer version of Airqmon.

## Preferences

There are a few options available to customize on the preferences window that you can access by clicking on the button with a cog or by pressing the `⌘ + ,` shortcut.

## FAQ

### macOS doesn't allow me to start the app

Since macOS Sierra, if you try to open an app that is not registered with Apple by an identified developer you get a warning dialog. Airqmon is not signed nor was submitted to Apple for review.

To override your security settings and open the app:

1. In the Finder, locate the app you want to open.
2. Control-click the app icon, then choose Open from the shortcut menu.

Read more: [PH25088](https://support.apple.com/kb/PH25088?locale=en_US)

## Privacy

Airqmon tracks some usage data, like window displays or CAQI index changes, and reports errors using external services. No private data other than computer hostname is collected. The information that is collected is used to provide, maintain, protect and improve Airqmon. Collected data is not shared with anyone.

You can opt-out from sending the telemetry, but not from sending error reports.

## Sponsors

<p>This project is supported by:</p>
<p>
  <a href="https://m.do.co/c/38582030d6df">
    <img src="https://opensource.nyc3.cdn.digitaloceanspaces.com/attribution/assets/SVG/DO_Logo_horizontal_blue.svg" width="201px">
  </a>
</p>

### Credits

My sincere thanks to the following individuals for helping me with beta testing and for donating 🙏

| [![Michał Pierzchała](https://github.com/thymikee.png?size=50)](https://github.com/thymikee) | [![Konrad Dzwinel](https://github.com/kdzwinel.png?size=50)](https://github.com/kdzwinel) |
| -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| [Michał Pierzchała](https://github.com/thymikee)                                             | [Konrad Dzwinel](https://github.com/kdzwinel)                                             |

## License

This app is an open-source software licensed under the [Apache License, Version 2.0][license]

[license]: https://raw.githubusercontent.com/jsynowiec/airqmon/main/LICENSE
[airqmon-latest-release]: https://github.com/jsynowiec/airqmon/releases/latest
[david]: http://david-dm.org/jsynowiec/airqmon
[gh-actions]: https://actions-badge.atrox.dev/jsynowiec/airqmon/goto?ref=main
[badge-github-release]: https://img.shields.io/github/release/jsynowiec/airqmon.svg
[badge-license]: https://img.shields.io/github/license/jsynowiec/airqmon.svg
[badge-david-deps]: https://img.shields.io/david/jsynowiec/airqmon.svg
[badge-gh-actions]: https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Fjsynowiec%2Fairqmon%2Fbadge%3Fref%3Dmain&style=flat
[airly]: https://airly.eu/
[sponsor-badge]: https://img.shields.io/badge/♥-Sponsor-fc0fb5.svg
[sponsor]: https://github.com/sponsors/jsynowiec
