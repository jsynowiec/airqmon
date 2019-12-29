// tslint:disable:max-line-length

export interface ICAQIMetadata {
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
}

export const CAQI_MIN_VAL = 0;
export const CAQI_MAX_VAL = 100;
export const CAQI_STEP = 25;

export const CAQI_INDEX: ICAQIMetadata[] = [
  {
    index: 0,
    values: {
      min: CAQI_MIN_VAL,
      max: CAQI_MIN_VAL + CAQI_STEP,
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
      min: CAQI_MIN_VAL + CAQI_STEP,
      max: CAQI_MIN_VAL + CAQI_STEP * 2,
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
      min: CAQI_MIN_VAL + CAQI_STEP * 2,
      max: CAQI_MIN_VAL + CAQI_STEP * 3,
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
      min: CAQI_MIN_VAL + CAQI_STEP * 3,
      max: CAQI_MAX_VAL,
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
      min: CAQI_MAX_VAL,
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

export function getCAQIMeta(val: number): ICAQIMetadata {
  return CAQI_INDEX.find((elem) => {
    return val >= elem.values.min && val <= elem.values.max;
  });
}
