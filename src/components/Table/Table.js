import React, { Component } from "react";

import "./Table.css";

export class Table extends Component {
  constructor(props) {
    super(props);

    const { features } = props;
    this.state = {
      columns: ["Actual", "Predicted", "Difference", "Intercept", ...features],
      sort: {
        column: undefined,
        asc: false,
      },
      sortedData: props.data,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.setState({ data: this.props.data });
    }
    if (prevProps.features !== this.props.features) {
      this.setState({
        columns: [...this.state.columns, ...this.props.features],
      });
    }
  }

  render() {
    const { selectedRowIndex, setSelectedRowIndex } = this.props;
    const { columns, sort, sortedData } = this.state;
    return (
      <section>
        <table>
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={`feature-${index}`} style={{ whiteSpace: "nowrap" }}>
                  {column}
                  {(sort.column !== column || !sort.asc) && (
                    <button
                      onClick={() => {
                        const dataCopy = sortedData.slice();

                        dataCopy.sort((a, b) => a[column] > b[column]);

                        this.setState({
                          sortedData: dataCopy,
                          sort: { asc: true, column },
                        });

                        setSelectedRowIndex(undefined);
                      }}
                    >
                      &#9650;
                    </button>
                  )}
                  {sort.column === column && sort.asc && (
                    <button
                      onClick={() => {
                        const dataCopy = sortedData.slice();

                        dataCopy.sort((a, b) => a[column] < b[column]);

                        this.setState({
                          sortedData: dataCopy,
                          sort: { ...sort, asc: false },
                        });

                        setSelectedRowIndex(undefined);
                      }}
                    >
                      &#9660;
                    </button>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, index) => (
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
