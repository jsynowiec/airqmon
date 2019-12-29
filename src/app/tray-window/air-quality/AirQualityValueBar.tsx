import * as React from 'react';

import {
  AQIndexMetadata,
  DEFAULT_AQ_INDEX,
  getAQIndexMetadata,
  getAQIndexMetadataForValue,
} from 'common/air-quality';

interface IAirQualityValueBarProps {
  airQualityIndex: number;
}

interface IAirQualityValueBarState {
  hasRefs: boolean;
  elBoundingBox?: ClientRect;
  overlayElBoundingBox?: ClientRect;
  minAQIndex: AQIndexMetadata;
  medAQIndex: AQIndexMetadata;
  maxAQIndex: AQIndexMetadata;
}

class AirQualityValueBar extends React.Component<
  IAirQualityValueBarProps,
  IAirQualityValueBarState
> {
  private valueBarNode: HTMLDivElement;
  private overlayNode: HTMLDivElement;

  constructor(props: IAirQualityValueBarProps) {
    super(props);

    const indexMetadata = getAQIndexMetadata(DEFAULT_AQ_INDEX);
    const AQIndexMinVal = indexMetadata[0].values.min;
    const AQIndexMaxVal = indexMetadata[indexMetadata.length - 1].values.min;

    this.state = {
      hasRefs: false,
      minAQIndex: getAQIndexMetadataForValue(DEFAULT_AQ_INDEX, AQIndexMinVal),
      medAQIndex: getAQIndexMetadataForValue(
        DEFAULT_AQ_INDEX,
        (AQIndexMinVal + AQIndexMaxVal) / 2 + 1,
      ),
      maxAQIndex: getAQIndexMetadataForValue(DEFAULT_AQ_INDEX, AQIndexMaxVal + 1),
    };
  }

  componentDidMount(): void {
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
    let top = 0;
    let left = 0;

    if (this.state.hasRefs) {
      const ratio: number =
        (this.valueBarNode.childElementCount - 1) / this.valueBarNode.childElementCount;

      top = (this.state.elBoundingBox.height - this.state.overlayElBoundingBox.height) / 2;
      left =
        this.props.airQualityIndex >= 125
          ? this.state.elBoundingBox.width - this.state.overlayElBoundingBox.width
          : ((this.state.elBoundingBox.width * ratio - this.state.overlayElBoundingBox.width) *
              this.props.airQualityIndex) /
            100;
    }

    return {
      visible: this.state.hasRefs ? 'visible' : 'hidden',
      top,
      left,
    };
  }

  render(): JSX.Element {
    const indexMetadata = getAQIndexMetadata(DEFAULT_AQ_INDEX);
    const airQualityMeta = getAQIndexMetadataForValue(
      DEFAULT_AQ_INDEX,
      Math.round(this.props.airQualityIndex),
    );

    const AQIndexHTMLElements: JSX.Element[] = indexMetadata.reduce((acc, cVal, cIdx) => {
      return [
        ...acc,
        <div key={cVal.index} className={`quality-${cVal.index}`}>
          {cIdx == 0 ? cVal.values.min : null}
          {cIdx == indexMetadata.length - 1 ? `${cVal.values.min}+` : null}
        </div>,
      ];
    }, []);

    return (
      <div className="air-quality__value-bar">
        <div
          className="air-quality__value-bar__values"
          ref={(node): void => {
            this.valueBarNode = node;
          }}
        >
          {AQIndexHTMLElements}
        </div>
        <div className="air-quality__value-bar__description">
          <div>{this.state.minAQIndex.labels.airQuality}</div>
          <div>{this.state.medAQIndex.labels.airQuality}</div>
          <div>{this.state.maxAQIndex.labels.airQuality}</div>
        </div>
        <div
          className={`air-quality__value-bar__overlay quality-${airQualityMeta.index}`}
          style={this.getOverlayStyle()}
          ref={(node): void => {
            this.overlayNode = node;
          }}
        >
          {this.props.airQualityIndex.toFixed(0)}
        </div>
      </div>
    );
  }
}

export default AirQualityValueBar;
