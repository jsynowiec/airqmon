# <img src="https://user-images.githubusercontent.com/1029142/32918679-7336704a-cb23-11e7-92b2-d8a7f2588055.png" width="60px" align="center" alt="Airqmon icon" /> Airqmon [![GitHub release][badge-github-release]][airqmon-latest-release]

[![Build Status][travis-badge]][travis-ci]
[![David][badge-david-deps]][david]
[![License][badge-license]][license]

[![Donate][badge-donate]][donate]

A menu bar app that displays live air quality informations from the nearest sensor station. It also notifies you when the air quality changes or when a new station that is closer to your current location was found.

<p align="center">
  <img width="140" alt="screen shot 2018-01-07 at 19 09 45" src="https://user-images.githubusercontent.com/1029142/34652449-7721515a-f3de-11e7-82e0-3af878ff3d58.png">
</p>

<p align="center">
  <img width="412" align="center" alt="Airqmon window with measurement details, light apperance" src="https://user-images.githubusercontent.com/1029142/54989495-f4bb4080-4fb8-11e9-8f8b-85d74db5bf13.png" /><img width="412" align="center" alt="Airqmon window with measurement details, dark apperance" src="https://user-images.githubusercontent.com/1029142/54989497-f4bb4080-4fb8-11e9-9a3c-bcaa5b38066d.png" />
</p>

<p align="center">
  <img src="https://user-images.githubusercontent.com/1029142/36537429-674931ba-17d0-11e8-88ee-c246226c1053.png" width="378px" align="center" alt="Airqmon notification about air quality" />
</p>

Supported data providers:

- [Airly][airly],

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

## License

Copyright 2019 Jakub Synowiec

Licensed under the [Apache License, Version 2.0 (the "License")][license]

[license]: https://raw.githubusercontent.com/jsynowiec/airqmon/master/LICENSE
[airqmon-latest-release]: https://github.com/jsynowiec/airqmon/releases/latest
[david]: http://david-dm.org/jsynowiec/airqmon
[donate]: https://ko-fi.com/X8X8N42K
[badge-github-release]: https://img.shields.io/github/release/jsynowiec/airqmon.svg
[badge-license]: https://img.shields.io/github/license/jsynowiec/airqmon.svg
[badge-david-deps]: https://img.shields.io/david/jsynowiec/airqmon.svg
[badge-donate]: https://img.shields.io/badge/☕-buy%20me%20a%20coffee-46b798.svg
[travis-badge]: https://travis-ci.org/jsynowiec/airqmon.svg?branch=master
[travis-ci]: https://travis-ci.org/jsynowiec/airqmon
[airly]: https://airly.eu/
