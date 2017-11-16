export const AIRLY_API_URL = 'https://airapi.airly.eu';

export interface IAirlyCurrentMeasurement {
  airQualityIndex: number;
  pm1: number;
  pm25: number;
  pm10: number;
  pressure: number;
  humidity: number;
  temperature: number;
  pollutionLevel: number;
}
export interface IArilyNearestSensorMeasurement {
  airQualityIndex: number;
  pm25: number;
  pm10: number;
  distance: number;
  id: number;
  name: string;
  vendor: string;
  location: {
    latitude: number;
    longitude: number;
  };
  pollutionLevel: number;
  address: {
    streetNumber: number;
    route: string;
    locality: string;
    country: string;
  };
  measurementTime: string;
}
