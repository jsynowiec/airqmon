import * as React from 'react';
import { shallow } from 'enzyme';
import { Unit, MeasurementReadingUnit } from '../src/tray-window/measurement/MeasurementReadingUnit'

describe('MeasurementReadingUnit', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<MeasurementReadingUnit unit={Unit.PERCENT} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.hasClass('measurement__unit')).toBe(true);
  });

  it('doesn\'t render if no unit is given', () => {
    const wrapper = shallow(<MeasurementReadingUnit />);
    expect(wrapper.getElement()).toBeNull();
  });

  it('renders correct unit for Unit.PERCENT', () => {
    const wrapper = shallow(<MeasurementReadingUnit unit={Unit.PERCENT} />);
    expect(wrapper.text()).toMatchSnapshot();
  });

  it('renders correct unit for Unit.PM', () => {
    const wrapper = shallow(<MeasurementReadingUnit unit={Unit.PM} />);
    expect(wrapper.text()).toMatchSnapshot();
  });

  it('renders correct unit for Unit.PRESSURE_PA', () => {
    const wrapper = shallow(<MeasurementReadingUnit unit={Unit.PRESSURE_PA} />);
    expect(wrapper.text()).toMatchSnapshot();
  });

  it('renders correct unit for Unit.TEMP_C', () => {
    const wrapper = shallow(<MeasurementReadingUnit unit={Unit.TEMP_C} />);
    expect(wrapper.text()).toMatchSnapshot();
  });
});


