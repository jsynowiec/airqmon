import * as React from 'react';

import { CAQI_MIN_VAL, CAQI_MAX_VAL, ICAQIMetadata, getCAQIMeta } from '../caqi';

interface IAirQualityValueBarProps {
  value: number;
  meta: ICAQIMetadata;
}

interface IAirQualityValueBarState {
  hasRefs: boolean;
  elBoundingBox?: ClientRect;
  overlayElBoundingBox?: ClientRect;
  minCAQI: ICAQIMetadata;
  medCAQI: ICAQIMetadata;
  maxCAQI: ICAQIMetadata;
}

class AirQualityValueBar extends React.Component<
  IAirQualityValueBarProps,
  IAirQualityValueBarState
> {
  private valueBarNode: HTMLDivElement;
  private overlayNode: HTMLDivElement;

  constructor(props: IAirQualityValueBarProps) {
    super(props);

    this.state = {
      hasRefs: false,
      minCAQI: getCAQIMeta(CAQI_MIN_VAL),
      medCAQI: getCAQIMeta((CAQI_MIN_VAL + CAQI_MAX_VAL) / 2 + 1),
      maxCAQI: getCAQIMeta(CAQI_MAX_VAL + 1),
    };
  }

  componentDidMount() {
    const elBoundingBox = this.valueBarNode.getBoundingClientRect();

    this.setState({
      hasRefs: true,
      elBoundingBox,
      overlayElBoundingBox: this.overlayNode.getBoundingClientRect(),
    });
  }

  getOverlayStyle(): {
    visible: 'hidden' | 'visible';
    top: number;
    left: number;
  } {
    let top: number = 0;
    let left: number = 0;

    if (this.state.hasRefs) {
      const ratio: number =
        (this.valueBarNode.childElementCount - 1) / this.valueBarNode.childElementCount;

      top = (this.state.elBoundingBox.height - this.state.overlayElBoundingBox.height) / 2;
      left =
        this.props.value >= 125
          ? this.state.elBoundingBox.width - this.state.overlayElBoundingBox.width
          : (this.state.elBoundingBox.width * ratio - this.state.overlayElBoundingBox.width) *
            this.props.value /
            100;
    }

    return {
      visible: this.state.hasRefs ? 'visible' : 'hidden',
      top,
      left,
    };
  }

  render() {
    return (
      <div className="air-quality__value-bar">
        <div
          className="air-quality__value-bar__values"
          ref={(node) => {
            this.valueBarNode = node;
          }}
        >
          <div className="quality-0">0</div>
          <div className="quality-1" />
          <div className="quality-2" />
          <div className="quality-3" />
          <div className="quality-4">100+</div>
        </div>
        <div className="air-quality__value-bar__description">
          <div>{this.state.minCAQI.labels.airQuality}</div>
          <div>{this.state.medCAQI.labels.airQuality}</div>
          <div>{this.state.maxCAQI.labels.airQuality}</div>
        </div>
        <div
          className={`air-quality__value-bar__overlay quality-${this.props.meta.index}`}
          style={this.getOverlayStyle()}
          ref={(node) => {
            this.overlayNode = node;
          }}
        >
          {this.props.value.toFixed(0)}
        </div>
      </div>
    );
  }
}

export default AirQualityValueBar;
