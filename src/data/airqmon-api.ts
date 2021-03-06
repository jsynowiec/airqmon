import ApolloClient, { InMemoryCache, ApolloError, ApolloQueryResult } from 'apollo-boost';
import { getNearestLocationQuery, getStationMeasurementsQuery } from 'data/qgl-queries';
import getLogger from 'common/logger';
import { catcher } from 'common/helpers';

export const GQL_API_URL = 'https://api.airqmon.app/graphql';

export type Location = {
  latitude: number;
  longitude: number;
};

export enum ApiError {
  CONNECTION_ERROR = 'CONNECTION_ERROR',
  NO_STATION = 'NO_STATION',
  NO_MEASUREMENT = 'NO_MEASUREMENT',
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

export type NearestSensorStation = {
  distance: number;
  station: SensorStation;
};

type NearestSensorStationQueryResult = {
  nearestSensorStation: NearestSensorStation | null;
};

type StationMeasurementQueryResult = {
  sensorStation: { measurements: Measurements };
};

const logger = getLogger('airqmon-api');

const apolloClient: ApolloClient<InMemoryCache> = new ApolloClient({
  uri: GQL_API_URL,
});

const logApolloErrors = (reason: ApolloError): void => {
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

export async function findNearestStation(location: Location): Promise<NearestSensorStation> {
  const [queryResult, err] = await catcher<
    ApolloQueryResult<NearestSensorStationQueryResult>,
    ApolloError
  >(
    apolloClient.query<NearestSensorStationQueryResult>({
      query: getNearestLocationQuery(location),
      fetchPolicy: 'cache-first',
    }),
  );

  if (err) {
    logApolloErrors(err);
    throw ApiError.CONNECTION_ERROR;
  }

  const { nearestSensorStation: station } = queryResult.data;

  if (station == null) {
    throw ApiError.NO_STATION;
  }

  return station;
}

export async function getStationMeasurements(id: string): Promise<Measurements> {
  const [queryResult, err] = await catcher<
    ApolloQueryResult<StationMeasurementQueryResult>,
    ApolloError
  >(
    apolloClient.query<StationMeasurementQueryResult>({
      query: getStationMeasurementsQuery(id),
      fetchPolicy: 'network-only',
    }),
  );

  if (err) {
    logApolloErrors(err);
    throw ApiError.CONNECTION_ERROR;
  }

  const { sensorStation: station } = queryResult.data;

  if (station == null) {
    throw ApiError.NO_MEASUREMENT;
  }

  return station.measurements;
}
