import axios from 'axios';
import getLogger from 'common/logger';

const logger = getLogger('geolocation');

export type Location = {
  latitude: number;
  longitude: number;
};

type IPIFYResponse = {
  ip: string;
};

type IPAPIResponse = {
  status: 'success' | 'fail';
  lat: number;
  lon: number;
};

async function getPublicIP(): Promise<string> {
  logger.debug('Obtaining public IP address.');
  const response = await axios.get<IPIFYResponse>('https://api.ipify.org?format=json');
  return response.data.ip;
}

async function geolocatePublicIP(): Promise<Location> {
  const ip = await getPublicIP();
  logger.debug(`Using the ip-api geolocation with public IP address, ${ip}.`);
  const response = await axios.post<IPAPIResponse>(
    `http://ip-api.com/json/${ip}?fields=status,lat,lon`,
  );

  if (response.data.status != 'success') {
    throw new GeolocationError(
      GeolocationPositionError.POSITION_UNAVAILABLE,
    ) as GeolocationPositionError;
  }

  const { lat: latitude, lon: longitude } = response.data;

  return {
    latitude,
    longitude,
  } as Location;
}

export async function getLocation(): Promise<Location> {
  return geolocatePublicIP();
}

class GeolocationError implements GeolocationPositionError {
  readonly code: number;
  readonly message: string;
  readonly PERMISSION_DENIED: number = GeolocationPositionError.PERMISSION_DENIED;
  readonly POSITION_UNAVAILABLE: number = GeolocationPositionError.POSITION_UNAVAILABLE;
  readonly TIMEOUT: number = GeolocationPositionError.TIMEOUT;

  constructor(code: number, message?: string) {
    this.code = code;
    this.message = message;
  }
}
