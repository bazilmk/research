import React, { PureComponent } from "react";

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
    return data && data.size ? (
      <div id="tooltip" style={{ left, top, background: data.color }}>
        {data.title}
        <br />
        {data.size}
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
