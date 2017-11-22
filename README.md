# <img src="https://user-images.githubusercontent.com/1029142/32918679-7336704a-cb23-11e7-92b2-d8a7f2588055.png" width="60px" align="center" alt="Airqmon icon" /> Airqmon [![GitHub release][badge-github-release]][airqmon-latest-release] [![GitHub release][badge-github-pre-release]][airqmon-latest-release]

[![David][badge-david-deps]][david]
[![License][badge-license]][license]
[![Donate][badge-donate]][donate]

A menu bar app that displays live air quality informations from the nearest [Airly][airly] sensor station. It also notifies you when the air quality changes or when a new station that is closer to your current location was found.

**Note:** This app is still in the work-in-progress-full-of-bugs state. No "stable" release, no docs, guides, etc. Moreover, [Airly][airly] sensor stations are probably only located in Poland (but I have plans to later add support for different APIs and data providers).

<p align="center">
  <img src="https://user-images.githubusercontent.com/1029142/33099907-d8edf8fc-cf12-11e7-814d-1df4ef140f9a.png" width="342px" align="center" alt="Airqmon window with measurement details" />
</p>

<p align="center">
  <img src="https://user-images.githubusercontent.com/1029142/33020102-3a72e41e-cdfd-11e7-84cd-abb6bbfb8c2d.png" width="378px" align="center" alt="Airqmon notification about air quality" />
</p>

## Installation

Download the [latest release][airqmon-latest-release], unpack and drag to your Applications folder.

### Update

Simply overwrite previous application with a newer one.

## Setup

Currently there is no configuration. This application uses geolocation to find out nearest sensor station.

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
