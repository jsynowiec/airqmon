# <img src="https://user-images.githubusercontent.com/1029142/32918679-7336704a-cb23-11e7-92b2-d8a7f2588055.png" width="60px" align="center" alt="Airqmon icon" /> Airqmon [![GitHub release][badge-github-release]][airqmon-latest-release]

[![Build Status][travis-badge]][travis-ci]
[![David][badge-david-deps]][david]
[![License][badge-license]][license]
[![Donate][badge-donate]][donate]

A menu bar app that displays live air quality informations from the nearest [Airly][airly] sensor station. It also notifies you when the air quality changes or when a new station that is closer to your current location was found.

<p align="center">
  <img width="140" alt="screen shot 2018-01-07 at 19 09 45" src="https://user-images.githubusercontent.com/1029142/34652449-7721515a-f3de-11e7-82e0-3af878ff3d58.png">
</p>

<p align="center">
  <img src="https://user-images.githubusercontent.com/1029142/36356674-6e1b0f3c-14f5-11e8-967d-79f8adba4ef2.png" width="412px" align="center" alt="Airqmon window with measurement details" />
</p>

<p align="center">
  <img src="https://user-images.githubusercontent.com/1029142/36537429-674931ba-17d0-11e8-88ee-c246226c1053.png" width="378px" align="center" alt="Airqmon notification about air quality" />
</p>

## Installation

Download the [latest release][airqmon-latest-release], unzip and drag to your `Applications` folder.

### Update

Simply overwrite previous application in your `Applications` folder with a newer version of Airqmon.

## Preferences

There are a few options available to customize on the preferences window that you can access by clicking on the button with a cog or by pressing the `⌘ + ,` shortcut.

<p align="center">
  <img src="https://user-images.githubusercontent.com/1029142/36497771-8bc2c00e-173c-11e8-8c97-7f307c041d56.png" width="632px" align="center" alt="Airqmon notification about air quality" />
</p>

## FAQ

### macOS doesn't allow me to start the app

Since macOS Sierra, if you try to open an app that is not registered with Apple by an identified developer you get a warning dialog. Airqmon is not signed nor was submitted to Apple for review.

To override your security settings and open the app:
1. In the Finder, locate the app you want to open.
2. Control-click the app icon, then choose Open from the shortcut menu.

Read more: [PH25088](https://support.apple.com/kb/PH25088?locale=en_US)

### API rate limit workaround

Unfortunately, Airly API has some enforced daily and hourly request limits. Because binary version that you can download has a single API key embedded, all users fall under the same rate restrictions. This results in Airly blocking access to sensor data at some point during the day (exact time depends on the number of concurrent users).

Since version 1.1.0, the user can provide his own Airly credentials that will be used instead of the shared key. This mitigates the request limit issue by allowing the application to use a separate request pool.

To configure own credentials, you have to:

1. Register for a developers account at the https://developer.airly.eu/login
2. After signing in copy the API key
3. Open Airqmon preferences by clicking on the cog icon or pressing `⌘+,`
4. Paste the copied API key into the _Airly API key_ text field

## Privacy

Airqmon tracks some usage data, like window displays or CAQI index changes, and reports errors using external services. No private data other than computer hostname is collected. The information that is collected is used to provide, maintain, protect and improve Airqmon. Collected data is not shared with anyone.

## License

Copyright 2018 Jakub Synowiec

Licensed under the [Apache License, Version 2.0 (the "License")][license]

[airly]: https://airly.eu/en/
[license]: https://raw.githubusercontent.com/jsynowiec/airqmon/master/LICENSE
[airqmon-latest-release]: https://github.com/jsynowiec/airqmon/releases/latest
[david]: http://david-dm.org/jsynowiec/airqmon
[donate]: http://bit.ly/donate-js

[badge-github-release]: https://img.shields.io/github/release/jsynowiec/airqmon.svg
[badge-license]: https://img.shields.io/github/license/jsynowiec/airqmon.svg
[badge-david-deps]: https://img.shields.io/david/jsynowiec/airqmon.svg
[badge-donate]: https://img.shields.io/badge/€-donate-brightgreen.svg

[travis-badge]: https://travis-ci.org/jsynowiec/airqmon.svg?branch=master
[travis-ci]: https://travis-ci.org/jsynowiec/airqmon
