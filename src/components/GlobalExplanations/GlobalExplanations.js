import React, { Component } from "react";
import { GlobalExplanation } from "./GlobalExplanation";

import "./GlobalExplanations.css";

export class GlobalExplanations extends Component {
  render() {
    const { features, selectedRowIndex, data } = this.props;
    return (
      <section id="global-explanations">
        {features.map((feature, index) => (
          <GlobalExplanation
            feature={feature}
            key={`chart-${index}`}
            selectedRowIndex={selectedRowIndex}
            data={data}
          />
        ))}
      </section>
    );
  }
}
