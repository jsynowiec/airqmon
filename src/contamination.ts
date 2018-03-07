export enum Contaminants {
  PM1 = 'PM1',
  PM10 = 'PM10',
  PM25 = 'PM25',
}

export const CONTAMINATION_THRESHOLDS = {
  [Contaminants.PM10]: [
    {
      index: 0,
      values: {
        min: 0,
        max: 20,
      },
    },
    {
      index: 1,
      values: {
        min: 20,
        max: 60,
      },
    },
    {
      index: 2,
      values: {
        min: 60,
        max: 100,
      },
    },
    {
      index: 3,
      values: {
        min: 100,
        max: 140,
      },
    },
    {
      index: 4,
      values: {
        min: 140,
        max: 200,
      },
    },
    {
      index: 5,
      values: {
        min: 200,
        max: Number.MAX_VALUE,
      },
    },
  ],
  [Contaminants.PM25]: [
    {
      index: 0,
      values: {
        min: 0,
        max: 12,
      },
    },
    {
      index: 1,
      values: {
        min: 12,
        max: 36,
      },
    },
    {
      index: 2,
      values: {
        min: 36,
        max: 60,
      },
    },
    {
      index: 3,
      values: {
        min: 60,
        max: 84,
      },
    },
    {
      index: 4,
      values: {
        min: 84,
        max: 120,
      },
    },
    {
      index: 5,
      values: {
        min: 120,
        max: Number.MAX_VALUE,
      },
    },
  ],
};

export const CONTAMINATION_NORM_VALUES = {
  [Contaminants.PM10]: 25,
  [Contaminants.PM25]: 50,
};

export function getContaminationThresholdIndex(contaminate: Contaminants, val: number): number {
  return CONTAMINATION_THRESHOLDS[contaminate].find((elem) => {
    return val >= elem.values.min && val <= elem.values.max;
  }).index;
}
