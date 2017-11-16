export const AQI_INDEX = [
  {
    min: 0,
    max: 25,
    label: 'Very low',
  },
  {
    min: 25,
    max: 50,
    label: 'Low',
  },
  {
    min: 50,
    max: 75,
    label: 'Medium',
  },
  {
    min: 75,
    max: 100,
    label: 'High',
  },
  {
    min: 100,
    max: Number.MAX_VALUE,
    label: 'Very High',
  },
];

export function humanize(aqi: number): string {
  return AQI_INDEX.find((elem) => {
    return aqi >= elem.min && aqi < elem.max;
  }).label;
}
