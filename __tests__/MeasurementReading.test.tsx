import * as React from 'react';
import { shallow } from 'enzyme';
import { MeasurementReading } from '../src/tray-window/measurement/MeasurementReading';
import { Unit } from '../src/tray-window/measurement/MeasurementReadingUnit';

jest.mock('../src/tray-window/measurement/MeasurementReadingUnit', () => ({
  ...require.requireActual('../src/tray-window/measurement/MeasurementReadingUnit'),
  MeasurementReadingUnit: 'MeasurementReadingUnit',
}));

describe('MeasurementReading', () => {
  const reading = 1.23;
  const formatter = jest.fn((val) => val.toFixed(0));

  afterEach(() => {
    formatter.mockClear();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<MeasurementReading reading={reading} formatter={formatter} />);
    expect(wrapper).toMatchSnapshot();
    expect(formatter).toHaveBeenCalledTimes(1);
    expect(formatter).toHaveBeenCalledWith(reading);
    expect(wrapper.childAt(0).hasClass('measurement__reading')).toBe(true);
  });

  it('renders correctly without formatter', () => {
    const wrapper = shallow(<MeasurementReading reading={reading} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders passed children', () => {
    const wrapper = shallow(
      <MeasurementReading reading={reading}>
        <div>A children node</div>
      </MeasurementReading>,
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('Renders MeasurementReadingUnit if unit is provided', () => {
    const wrapper = shallow(
      <MeasurementReading reading={reading} unit={Unit.PRESSURE_PA} />,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
