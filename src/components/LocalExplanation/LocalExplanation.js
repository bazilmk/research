import React, { Component } from "react";
import {
  FlexibleXYPlot,
  HorizontalGridLines,
  Treemap,
  VerticalBarSeries,
  XAxis,
  YAxis,
} from "react-vis";
import { Tooltip } from "..";

import "./LocalExplanation.css";

const COLORS = {
  red: "#bf212f",
  green: "#006f3c",
};

export class LocalExplanation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      dimensions: { width: 0, height: 0 },
      displayMode: "resquarify",
    };

    this.resetTooltipData = this.resetTooltipData.bind(this);
    this.updateTooltipData = this.updateTooltipData.bind(this);
    this.updateSize = this.updateSize.bind(this);

    this.getPositiveChildren = this.getPositiveChildren.bind(this);
    this.getNegativeChildren = this.getNegativeChildren.bind(this);
    this.getChildren = this.getChildren.bind(this);

    this.getDataForWaterfall = this.getDataForWaterfall.bind(this);
  }

  render() {
    const { selectedRowIndex } = this.props;
    const { data, dimensions, displayMode, tooltipData } = this.state;

    return (
      <section
        id="treemap-container"
        ref={this.updateSize}
        onMouseLeave={this.resetTooltipData}
      >
        {selectedRowIndex === undefined ? (
          "Select a row in the table below"
        ) : (
          <>
            {displayMode === "waterfall" ? (
              <FlexibleXYPlot xType="ordinal" yDomain={[data.minY, data.maxY]}>
                <HorizontalGridLines />
                <VerticalBarSeries
                  data={data.data}
                  colorType="literal"
                  onValueMouseOver={(data) =>
                    this.updateTooltipData({
                      title: data.x,
                      size: data.y - data.y0,
                      color: data.color,
                    })
                  }
                />
                <XAxis title="Feature" tickLabelAngle={270} />
                <YAxis title="Contribution" />
              </FlexibleXYPlot>
            ) : (
              <Treemap
                title={"Test"}
                data={data}
                mode={displayMode}
                hideRootNode
                colorType="literal"
                onLeafMouseOver={({ data }) => this.updateTooltipData(data)}
                onLeafClick={(...args) => console.log("klikk", [args])}
                padding={1}
                margin={0}
                {...dimensions}
              />
            )}
            <Tooltip data={tooltipData} />
          </>
        )}
      </section>
    );
  }

  resetTooltipData() {
    this.setState({ tooltipData: undefined });
  }

  updateTooltipData(data) {
    this.setState({ tooltipData: data });
  }

  updateSize(containerElement) {
    if (containerElement !== null) {
      const { clientWidth: width, clientHeight: height } = containerElement;
      this.setState({ dimensions: { width, height } });
    }
  }

  componentDidUpdate(prevProps) {
    const { selectedRowIndex } = this.props;
    if (selectedRowIndex !== prevProps.selectedRowIndex) {
      let data;
      if (this.state.displayMode === "waterfall") {
        data = this.getDataForWaterfall();
      } else {
        data = {
          children: [
            {
              title: "Negative",
              children: this.getPositiveChildren(),
              color: "none",
            },
            {
              title: "Positive",
              children: this.getNegativeChildren(),
              color: "none",
            },
          ],
        };
      }
      this.setState({
        data,
      });
    }
  }

  getDataForWaterfall() {
    const { selectedRowIndex } = this.props;

    if (selectedRowIndex === undefined) return [];

    const children = [];

    const selectedRow = this.props.data[selectedRowIndex];

    this.props.features.forEach((feature) => {
      const value = selectedRow[feature];
      const newChild = {
        x: feature,
        y: value,
        color: value < 0 ? COLORS.red : COLORS.green,
        y0: 0,
      };

      const insertIndex = children.findIndex(({ y }) => y > value);

      if (insertIndex === -1) {
        children.push(newChild);
      } else {
        children.splice(insertIndex, 0, newChild);
      }
    });

    const data = children.reduce(
      (collector, child, index) => [
        ...collector,
        index > 0
          ? {
              ...child,
              y: collector[index - 1].y + child.y,
              y0: collector[index - 1].y,
            }
          : {
              ...child,
              y: child.y + selectedRow["Intercept"],
              y0: child.y0 + selectedRow["Intercept"],
            },
      ],
      []
    );

    const minY = data.reduce((minValue, currentValue) => {
      const currentMinValue = Math.min(currentValue.y, currentValue.y0);

      console.log(currentMinValue, currentValue);

      return minValue === undefined || currentMinValue < minValue
        ? currentMinValue
        : minValue;
    }, undefined);

    const maxY = data.reduce((maxValue, currentValue) => {
      const currentMaxValue = Math.max(currentValue.y, currentValue.y0);

      return maxValue === undefined || currentMaxValue > maxValue
        ? currentMaxValue
        : maxValue;
    }, undefined);

    return {
      data,
      minY: Math.floor(minY),
      maxY: Math.ceil(maxY),
    };
  }

  getPositiveChildren() {
    return this.getChildren(true);
  }

  getNegativeChildren() {
    return this.getChildren(false);
  }

  getChildren(returnPositiveChilren) {
    const { selectedRowIndex } = this.props;

    if (selectedRowIndex === undefined) return [];

    const children = [];

    const selectedRow = this.props.data[selectedRowIndex];
    const color = returnPositiveChilren ? COLORS.green : COLORS.red;
    this.props.features.forEach((feature) => {
      const value = selectedRow[feature];
      if ((!returnPositiveChilren && value < 0) || returnPositiveChilren)
        children.push({ title: feature, size: Math.abs(value), color });
    });
    return children;
  }

  componentDidMount() {
    const searchParams = new URLSearchParams(window.location.search);

    let displayMode;
    switch (searchParams.get("v")) {
      case "b":
        displayMode = "circlePack";
        break;
      case "t":
        displayMode = "resquarify";
        break;
      default:
        displayMode = "waterfall";
        break;
    }
    this.setState({ displayMode });
  }
}
