[![GitHub release][badge-github-release]][airqmon-latest-release]
[![Build Status][travis-badge]][travis-ci]
[![David][badge-david-deps]][david]
[![License][badge-license]][license]
[![Donate][badge-donate]][donate]

# <img src="https://user-images.githubusercontent.com/1029142/32918679-7336704a-cb23-11e7-92b2-d8a7f2588055.png" width="60px" align="center" alt="Airqmon icon" /> Airqmon

A menu bar app that displays live air quality informations from the nearest sensor station. It also notifies you when the air quality changes or when a new station that is closer to your current location was found.

<p align="center">
  <img width="140" alt="screen shot 2018-01-07 at 19 09 45" src="https://user-images.githubusercontent.com/1029142/34652449-7721515a-f3de-11e7-82e0-3af878ff3d58.png">
</p>

<p align="center">
  <img width="412" align="center" alt="Airqmon window with measurement details, light apperance" src="https://user-images.githubusercontent.com/1029142/55006266-be43ec80-4fdd-11e9-8a44-624c8e32cb2f.png" /><img width="412" align="center" alt="Airqmon window with measurement details, dark apperance" src="https://user-images.githubusercontent.com/1029142/55006267-be43ec80-4fdd-11e9-82f4-d4f4e254e4bc.png" />
</p>

<p align="center">
  <img src="https://user-images.githubusercontent.com/1029142/36537429-674931ba-17d0-11e8-88ee-c246226c1053.png" width="378px" align="center" alt="Airqmon notification about air quality" />
</p>

Supported data providers:

- [Airly][airly] (Poland and a few sensors in different countries),

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

## Sponsors & donations

If you would like to show your appreciation, feel free to use the link below.

[![Donate][badge-donate]][donate]

### Credits

<p>This project is supported by:</p>
<p>
  <a href="https://m.do.co/c/38582030d6df">
    <img src="https://opensource.nyc3.cdn.digitaloceanspaces.com/attribution/assets/SVG/DO_Logo_horizontal_blue.svg" width="201px">
  </a>
</p>

My sincere thanks to the following individuals for helping to keep this project running and free.

- [thymikee](https://github.com/thymikee),
- [kdzwinel](https://github.com/kdzwinel),

## License

This app is an open-source software licensed under the [Apache License, Version 2.0][license]

[license]: https://raw.githubusercontent.com/jsynowiec/airqmon/master/LICENSE
[airqmon-latest-release]: https://github.com/jsynowiec/airqmon/releases/latest
[david]: http://david-dm.org/jsynowiec/airqmon
[donate]: https://paypal.me/jaqb/5eur
[badge-github-release]: https://img.shields.io/github/release/jsynowiec/airqmon.svg
[badge-license]: https://img.shields.io/github/license/jsynowiec/airqmon.svg
[badge-david-deps]: https://img.shields.io/david/jsynowiec/airqmon.svg
[badge-donate]: https://img.shields.io/badge/☕-buy%20me%20a%20coffee-46b798.svg
[travis-badge]: https://travis-ci.org/jsynowiec/airqmon.svg?branch=master
[travis-ci]: https://travis-ci.org/jsynowiec/airqmon
[airly]: https://airly.eu/
