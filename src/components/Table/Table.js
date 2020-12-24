import React, { Component } from "react";

import "./Table.css";

export class Table extends Component {
  constructor(props) {
    super(props);

    const { features } = props;
    this.state = {
      columns: ["ID", "Actual", "Predicted", "Difference", ...features],
    };
  }

  render() {
    const { data, selectedRowIndex, setSelectedRowIndex } = this.props;
    const { columns } = this.state;
    return (
      <section>
        <table>
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={`feature-${index}`}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={`row-${index}`}
                className={index === selectedRowIndex ? "selected" : ""}
                onClick={() => setSelectedRowIndex(index)}
              >
                {columns.map((column, index) => (
                  <td key={`feature-${index}`}>{row[column]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    );
  }
}
