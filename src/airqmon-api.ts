import ApolloClient, { InMemoryCache, ApolloError } from 'apollo-boost';
import { getNearestLocationQuery, getStationMeasurementsQuery } from './qgl-queries';
import getLogger from './logger';

export const GQL_API_URL = 'http://127.0.0.1:8080/graphql';

export type Location = {
  latitude: number;
  longitude: number;
};

export enum ApiError {
  CONNECTION_ERROR,
}

export type SensorStation = {
  id: string;
  provider: {
    name: string;
    url?: string;
    stationDetails?: string;
  };
  elevation: number | null;
  location: Location;
  displayAddress: string;
  measurements?: Measurements;
};

export enum MeasurementValueNames {
  PM1 = 'PM1',
  PM25 = 'PM25',
  PM10 = 'PM10',
  PRESSURE = 'PRESSURE',
  HUMIDITY = 'HUMIDITY',
  TEMPERATURE = 'TEMPERATURE',
}

export type MeasurementValue = {
  name: MeasurementValueNames;
  value: number;
};

export type Measurements = {
  caqi: number;
  values: MeasurementValue[];
};

const logger = getLogger('airqmon-api');

const apolloClient: ApolloClient<InMemoryCache> = new ApolloClient({
  uri: GQL_API_URL,
});

const logApolloErrors = (reason: ApolloError) => {
  if (reason.graphQLErrors) {
    reason.graphQLErrors.forEach((err) => {
      logger.error(err);
    });
  } else if (reason.networkError) {
    logger.error(reason.networkError);
  } else {
    logger.error(reason.message);
  }
};

export const findNearestStation = (
  location: Location,
): Promise<{ distance: number; station: SensorStation }> => {
  return new Promise((resolve, reject) => {
    apolloClient
      .query<{ nearestSensorStation: { distance: number; station: SensorStation } | null }>({
        query: getNearestLocationQuery(location),
        fetchPolicy: 'cache-first',
      })
      .then((result) => {
        const { nearestSensorStation: queryResult } = result.data;

        if (queryResult != null) {
          resolve(queryResult);
        } else {
          reject();
        }
      })
      .catch((reason: ApolloError) => {
        logApolloErrors(reason);
        reject(ApiError.CONNECTION_ERROR);
      });
  });
};

export const getStationMeasurements = (id: string): Promise<Measurements> => {
  return new Promise((resolve, reject) => {
    apolloClient
      .query<{ sensorStation: { measurements: Measurements } }>({
        query: getStationMeasurementsQuery(id),
        fetchPolicy: 'network-only',
      })
      .then((result) => {
        if (result.data.sensorStation != null) {
          resolve(result.data.sensorStation.measurements);
        } else {
          reject();
        }
      })
      .catch((reason) => {
        logApolloErrors(reason);
        reject(ApiError.CONNECTION_ERROR);
      });
  });
};
