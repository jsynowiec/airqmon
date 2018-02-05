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
  description: string;
}

export const CAQI_MIN_VAL = 0;
export const CAQI_MAX_VAL = 100;
export const CAQI_STEP = 25;

const CAQI_INDEX: ICAQIMetadata[] = [
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
    description:
      'Members of sensitive groups may experience health effects. The general public is not likely to be affected.',
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
    description: 'Health alert: everyone may experience more serious health effects.',
  },
  {
    index: 4,
    values: {
      min: CAQI_MAX_VAL,
      max: Number.MAX_VALUE,
    },
    labels: {
      pollution: 'Very high',
      airQuality: 'Hazardous',
    },
    description:
      'Health warnings of emergency conditions. The entire population is more likely to be affected.',
  },
];

export function getCAQIMeta(val: number): ICAQIMetadata {
  return CAQI_INDEX.find((elem) => {
    return val >= elem.values.min && val <= elem.values.max;
  });
}
