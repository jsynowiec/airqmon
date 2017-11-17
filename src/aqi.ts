export const AQI_INDEX = [
  {
    values: {
      min: 0,
      max: 25,
    },
    label: 'Very low',

  },
  {
    values: {
      min: 25,
      max: 50,
    },
    label: 'Low',
  },
  {
    values: {
      min: 50,
      max: 75,
    },
    label: 'Medium',
  },
  {
    values: {
      min: 75,
      max: 100,
    },
    label: 'High',
  },
  {
    values: {
      min: 100,
      max: Number.MAX_VALUE,
    },
    label: 'Very High',
  },
];

export function humanize(aqi: number): string {
  return AQI_INDEX.find((elem) => {
    return aqi >= elem.values.min && aqi < elem.values.max;
  }).label;
}
