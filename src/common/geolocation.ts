import { promisify } from 'util';
import { execFile as _execFile } from 'child_process';
import axios from 'axios';
import { omit } from 'lodash';
import getLogger from 'common/logger';

const execFile = promisify(_execFile);

const keys = require('@root/keys.json');

const logger = getLogger('geolocation');

function parseAirportAccessPoints(str: string) {
  const MAC_RE = /(?:[\da-f]{2}[:]{1}){5}[\da-f]{2}/i;

  return str.split('\n').reduce((acc, line) => {
    const mac = line.match(MAC_RE);

    if (!mac) {
      return acc;
    }

    const macStart = line.indexOf(mac[0]);
    const [macAddress, signalStrength, channel] = line
      .substr(macStart)
      .split(/[ ]+/)
      .map((el) => el.trim());

    return [
      ...acc,
      {
        ssid: line.substr(0, macStart).trim(),
        macAddress,
        signalStrength: parseInt(signalStrength, 10),
        channel: parseInt(channel, 10),
      },
    ];
  }, []);
}

async function getwifiAccessPoints() {
  const { stdout } = await execFile(
    '/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport',
    ['-s'],
  );
  return parseAirportAccessPoints(stdout);
}

type GoogleGeolocationResponse = {
  location: {
    lat: number;
    lng: number;
  };
  accuracy: number;
};

async function geolocate(wifiAccessPoints): Promise<GoogleGeolocationResponse> {
  const response = await axios.post<GoogleGeolocationResponse>(
    'https://www.googleapis.com/geolocation/v1/geolocate',
    { wifiAccessPoints },
    {
      params: {
        key: keys.google,
      },
    },
  );

  return response.data;
}

export type Location = {
  latitude: number;
  longitude: number;
};

async function getCurrentPosition(): Promise<Position> {
  const position = await new Promise<Position>((resolve, reject) => {
    return navigator.geolocation.getCurrentPosition(resolve, reject);
  });

  return position;
}

async function getLocationFromNavigator(): Promise<Location> {
  logger.debug('Using the default IP-based geolocation.');

  const position = await getCurrentPosition();
  const { latitude, longitude } = position.coords;

  return {
    latitude,
    longitude,
  } as Location;
}

export async function getLocation(): Promise<Location> {
  try {
    // geolocate using available WiFi acces points
    const wifiAccessPoints = await getwifiAccessPoints();

    if (wifiAccessPoints.length > 0) {
      const { location: { lat: latitude, lng: longitude }, accuracy } = await geolocate(
        wifiAccessPoints.reduce((acc, wifi) => [...acc, omit(wifi, ['ssid'])], []),
      );

      logger.debug(
        `Geolocated using WiFi APs: [${latitude}, ${longitude}], accuracy: ${accuracy}m.`,
      );

      if (accuracy < 1000) {
        logger.debug('Location accuracy is < 1km, returning.');

        return {
          latitude,
          longitude,
        } as Location;
      }
    }

    // fall back to IP geolocation if accurancy is more than 1km radius
    // fall back to IP geolocation if no WiFi access points
    return getLocationFromNavigator();
  } catch (err) {
    logger.warn(err);

    // fall back to IP geolocation on error
    return getLocationFromNavigator();
  }
}
