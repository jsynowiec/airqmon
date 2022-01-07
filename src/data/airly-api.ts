import axios from 'axios';
import { ApiError, Measurements, SensorStation } from 'data/airqmon-api';
import { userSettings } from 'common/user-settings';

export enum AirlyApiError {
  UNAUTHORIZED = 'UNAUTHORIZED'
}

const request = axios.create({
  baseURL: 'https://airapi.airly.eu/v2',
})

function errorHandler(code): void {
  switch (code) {
    case 404:
      throw ApiError.NO_STATION;
    case 401:
      throw AirlyApiError.UNAUTHORIZED;
    default:
      throw ApiError.CONNECTION_ERROR;
  }
}

export async function getInstallation(id: number): Promise<SensorStation> {
  let data;
  try {
    ({data} = await request.get(`/installations/${id}`, {
      headers: {
        'apikey': userSettings.get('airlyApiKey')
      }
    }));
  } catch (error) {
    errorHandler(error.response.status)
  }

  return {
    id: data.id,
    location: data.location,
    displayAddress: data.address.displayAddress1 + ',' + data.address.displayAddress2,
    elevation: data.elevation,
    provider: {
      name: data.sponsor.name,
      url: data.sponsor.link
    }
  }
}

export async function getStationMeasurements(id: number): Promise<Measurements> {
  let response;

  try {
    response = await request.get('/measurements/installation', {
        params: {
          'installationId': id
        },
        headers: {
          'apikey': userSettings.get('airlyApiKey')
        }
      }
    );
  } catch (error) {
    errorHandler(error.response.status);
  }

  const caqi = response.data.current.indexes.find(index => index.name === 'AIRLY_CAQI');

  return {
    caqi: caqi ? caqi.value : 0,
    values: response.data.current.values
  }
}
