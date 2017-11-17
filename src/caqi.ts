// tslint:disable:max-line-length
const CAQI_INDEX = [
  {
    values: {
      min: 0,
      max: 25,
    },
    labels: {
      pollution: 'Very low',
      airQuality: 'Excellent',
    },
    description: 'Air quality is considered satisfactory, and air pollution poses little or no risk.',
  },
  {
    values: {
      min: 25,
      max: 50,
    },
    labels: {
      pollution: 'Low',
      airQuality: 'Good',
    },
    description: 'Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution.',
  },
  {
    values: {
      min: 50,
      max: 75,
    },
    labels: {
      pollution: 'Medium',
      airQuality: 'Moderate',
    },
    description: 'Members of sensitive groups may experience health effects. The general public is not likely to be affected.',
  },
  {
    values: {
      min: 75,
      max: 100,
    },
    labels: {
      pollution: 'High',
      airQuality: 'Unhealthy',
    },
    description: 'Health alert: everyone may experience more serious health effects.',
  },
  {
    values: {
      min: 100,
      max: Number.MAX_VALUE,
    },
    labels: {
      pollution: 'Very high',
      airQuality: 'Hazardous',
    },
    description: 'Health warnings of emergency conditions. The entire population is more likely to be affected.',
  },
];

export function getCAQIMeta(val: number) {
  return CAQI_INDEX.find((elem) => {
    return val >= elem.values.min && val < elem.values.max;
  });
}
