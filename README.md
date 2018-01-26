# <img src="https://user-images.githubusercontent.com/1029142/32918679-7336704a-cb23-11e7-92b2-d8a7f2588055.png" width="60px" align="center" alt="Airqmon icon" /> Airqmon

[![Build Status][travis-badge]][travis-ci]
[![GitHub release][badge-github-release]][airqmon-latest-release]
[![GitHub release][badge-github-pre-release]][airqmon-latest-release]
[![Downloads total][badge-downloads-total]][airqmon-latest-release]

[![David][badge-david-deps]][david]
[![License][badge-license]][license]
[![Donate][badge-donate]][donate]

A menu bar app that displays live air quality informations from the nearest [Airly][airly] sensor station. It also notifies you when the air quality changes or when a new station that is closer to your current location was found.

**Note:** This app is still in the work-in-progress state. No stable release, no docs, guides, etc.

<p align="center">
  <img width="140" alt="screen shot 2018-01-07 at 19 09 45" src="https://user-images.githubusercontent.com/1029142/34652449-7721515a-f3de-11e7-82e0-3af878ff3d58.png">
</p>

<p align="center">
  <img src="https://user-images.githubusercontent.com/1029142/34644991-ea2fcb00-f342-11e7-9700-c43505f3eca2.png" width="342px" align="center" alt="Airqmon window with measurement details" />
</p>

<p align="center">
  <img src="https://user-images.githubusercontent.com/1029142/33020102-3a72e41e-cdfd-11e7-84cd-abb6bbfb8c2d.png" width="378px" align="center" alt="Airqmon notification about air quality" />
</p>

## Installation

Download the [latest release][airqmon-latest-release], unzip and drag to your `Applications` folder.

### Update

Simply overwrite previous application in your `Applications` folder with a newer version of Airqmon.

## Setup

Currently there is no configuration. This application uses geolocation to find out nearest sensor station.

## FAQ

### macOS doesn't allow me to start the app

Since macOS Sierra, if you try to open an app that is not registered with Apple by an identified developer you get a warning dialog. Airqmon is not signed nor was submitted to Apple for review.

To override your security settings and open the app:
1. In the Finder, locate the app you want to open.
2. Control-click the app icon, then choose Open from the shortcut menu.

Read more: [PH25088](https://support.apple.com/kb/PH25088?locale=en_US)

### There is no data or displayed station is very far away

[Airly][airly] sensor stations are probably located only in Poland (but I plan to add support for different APIs and data providers at some point).

## Privacy

Airqmon tracks some usage data, like window displays or CAQI index changes, and reports errors using external services. No private data other than computer hostname is collected. The information that is collected is used to provide, maintain, protect and improve Airqmon. Collected data is not shared with anyone.

## License

Copyright 2017 Jakub Synowiec

Licensed under the [Apache License, Version 2.0 (the "License")][license]

[airly]: https://airly.eu/en/
[license]: https://raw.githubusercontent.com/jsynowiec/airqmon/master/LICENSE
[airqmon-latest-release]: https://github.com/jsynowiec/airqmon/releases/latest
[david]: http://david-dm.org/jsynowiec/airqmon
[donate]: http://bit.ly/donate-js

[badge-downloads-total]: https://img.shields.io/github/downloads/jsynowiec/airqmon/total.svg
[badge-github-release]: https://img.shields.io/github/release/jsynowiec/airqmon.svg
[badge-github-pre-release]: https://img.shields.io/github/release/jsynowiec/airqmon/all.svg
[badge-license]: https://img.shields.io/github/license/jsynowiec/airqmon.svg
[badge-david-deps]: https://img.shields.io/david/jsynowiec/airqmon.svg
[badge-donate]: https://img.shields.io/badge/€-donate-brightgreen.svg

[travis-badge]: https://travis-ci.org/jsynowiec/airqmon.svg?branch=master
[travis-ci]: https://travis-ci.org/jsynowiec/airqmon
