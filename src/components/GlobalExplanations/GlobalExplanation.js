import React, { Component } from "react";
import {
  FlexibleWidthXYPlot,
  HorizontalGridLines,
  LineSeries,
  MarkSeries,
  XAxis,
  YAxis,
} from "react-vis";

import "./GlobalExplanation.css";

export class GlobalExplanation extends Component {
  constructor(props) {
    super(props);

    const { feature, data } = props;
    this.state = {
      selectedDataPoint: [],
      dataPoints: data.reduce((previousRows, currentRow) => {
        const currentX = currentRow[feature];

        const firstBiggerElementIndex = previousRows.findIndex(
          (previousRow) => previousRow.x > currentX
        );

        const insertionIndex =
          firstBiggerElementIndex < 0
            ? previousRows.length
            : firstBiggerElementIndex;

        return [
          ...previousRows.slice(0, insertionIndex),
          {
            x: currentX,
            y: currentX * Math.random(),
          },
          ...previousRows.slice(insertionIndex),
        ];
      }, []),
    };
  }

  render() {
    const { feature } = this.props;
    const { dataPoints, selectedDataPoint } = this.state;
    return (
      <div className="global-explanation">
        {feature}

        <FlexibleWidthXYPlot height={200}>
          <HorizontalGridLines />
          <LineSeries color="blue" data={dataPoints} />
          <MarkSeries color="orange" data={selectedDataPoint} />
          <XAxis />
          <YAxis />
        </FlexibleWidthXYPlot>
      </div>
    );
  }

  componentDidUpdate(prevProps) {
    const { selectedRowIndex } = this.props;
    if (prevProps.selectedRowIndex !== selectedRowIndex) {
      const { feature, data } = this.props;
      const { dataPoints } = this.state;
      this.setState({
        selectedDataPoint: [
          dataPoints.find(
            (dataPoint) => dataPoint.x === data[selectedRowIndex][feature]
          ),
        ],
      });
    }
  }
}
