import React, { useEffect, useState } from "react";

import "react-vis/dist/style.css";

import "./App.css";
import { LocalExplanation, Table } from "./components";

function App() {
  const [selectedRowIndex, setSelectedRowIndex] = useState();
  const [features, setFeatures] = useState([]);
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    const dataFileName =
      searchParams.get("d") === "b"
        ? "hd_data_gam_local_output.json"
        : "output.json";

    fetch(dataFileName)
      .then((response) => response.json())
      .then((data) => {
        setFeatures(data[0]["feature_names"]);
        setData(
          data.map((row) => ({
            ...row["feature_names"].reduce(
              (object, current, index) => ({
                ...object,
                [current]: row["local_scores"][index],
              }),
              {}
            ),
            Actual: row["actual_score"],
            Predicted: row["predicted_score"],
            Difference: row["difference"],
            Intercept: row["intercept"],
          }))
        );
        setLoading(false);
      });
  }, []);

  return (
    <main>
      <LocalExplanation
        data={data}
        features={features}
        selectedRowIndex={selectedRowIndex}
      />
      <Table
        features={features}
        setSelectedRowIndex={setSelectedRowIndex}
        selectedRowIndex={selectedRowIndex}
        data={data}
      />
      {isLoading && <div id="loader">Loading data...</div>}
    </main>
  );
}

export default App;
