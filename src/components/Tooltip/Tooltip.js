import React, { PureComponent } from "react";

import { COLORS } from "../../constants";

import "./Tooltip.css";

export class Tooltip extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      position: { left: 0, top: 0 },
    };

    this.updatePosition = this.updatePosition.bind(this);
  }

  componentDidMount() {
    window.addEventListener("mousemove", this.updatePosition);
  }

  componentWillUnmount() {
    window.removeEventListener("mousemove", this.updatePosition);
  }

  render() {
    const { left, top } = this.state.position;
    const { data } = this.props;
    const valueSign = data && data.color === COLORS.red ? "-" : "";
    return data && data.size ? (
      <div id="tooltip" style={{ left, top, background: data.color }}>
        {data.title}:&nbsp;ca.&nbsp;
        {valueSign}
        {Math.round(data.size * 10000) / 10000}
      </div>
    ) : (
      <></>
    );
  }

  updatePosition(event) {
    const { clientX: left, clientY: top } = event;
    this.setState({ position: { left, top } });
  }
}
