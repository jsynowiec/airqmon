import { gql, DocumentNode } from 'apollo-boost';

export const getNearestLocationQuery = ({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}): DocumentNode => gql`
{
  nearestSensorStation(location: {latitude: ${latitude}, longitude: ${longitude}}) {
    distance
    station {
      id
      provider {
        name
        url
        stationDetails
      }
      location {
        latitude
        longitude
      }
      displayAddress
    }
  }
}
`;

export const getStationMeasurementsQuery = (id: string): DocumentNode => gql`
{
  sensorStation(id: "${id}") {
    measurements {
      caqi
      values {
        name
        value
      }
    }
  }
}
`;
