// tslint:disable:max-line-length

export type AQIndexMetadata = {
  index: number;
  values: {
    min: number;
    max: number;
  };
  labels: {
    pollution: string;
    airQuality: string;
  };
  advisory: string;
  description: string;
};

export enum AQIndex {
  CAQI = 'CAQI',
}

export const DEFAULT_AQ_INDEX = AQIndex.CAQI;

export const CAQI_INDEX: AQIndexMetadata[] = [
  {
    index: 0,
    values: {
      min: 0,
      max: 25,
    },
    labels: {
      pollution: 'Very low',
      airQuality: 'Excellent',
    },
    advisory: 'Great air today! Don’t hesitate to go out.',
    description:
      'Air quality is considered satisfactory, and air pollution poses little or no risk.',
  },
  {
    index: 1,
    values: {
      min: 25,
      max: 50,
    },
    labels: {
      pollution: 'Low',
      airQuality: 'Good',
    },
    advisory: 'Good day for outdoor activities.',
    description:
      'Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution.',
  },
  {
    index: 2,
    values: {
      min: 50,
      max: 75,
    },
    labels: {
      pollution: 'Medium',
      airQuality: 'Moderate',
    },
    advisory: 'If possible, avoid spending too much time outside.',
    description:
      'Air quality is moderate. Members of sensitive groups may experience health effects. The general public is not likely to be affected.',
  },
  {
    index: 3,
    values: {
      min: 75,
      max: 100,
    },
    labels: {
      pollution: 'High',
      airQuality: 'Unhealthy',
    },
    advisory: 'If possible, avoid going out today.',
    description:
      'Air quality is considered unhealthy. Everyone may experience more serious health effects.',
  },
  {
    index: 4,
    values: {
      min: 100,
      max: Number.MAX_VALUE,
    },
    labels: {
      pollution: 'Severe',
      airQuality: 'Hazardous',
    },
    advisory: 'Stay today at home.',
    description:
      'Health warnings of emergency conditions. Air quality is hazardous. The entire population is more likely to be affected.',
  },
];

export function getAQIndexMetadata(index: AQIndex): AQIndexMetadata[] {
  return {
    [AQIndex.CAQI]: CAQI_INDEX,
  }[index];
}

export function getAQIndexMetadataForValue(index: AQIndex, val: number): AQIndexMetadata {
  const indexMetadata = getAQIndexMetadata(index);
  return indexMetadata.find((elem) => {
    return val >= elem.values.min && val <= elem.values.max;
  });
}
