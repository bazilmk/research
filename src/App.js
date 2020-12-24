import React, { useState } from "react";

import "react-vis/dist/style.css";

import "./App.css";
import { GlobalExplanations, LocalExplanation, Table } from "./components";

const features = [
  "LotArea",
  "YearBuilt",
  "GrLivArea",
  "KitchenAbvGr",
  "FirstFlrSF",
  "PoolArea",
  "TotalBsmtSF",
  "BsmtFinSFOne",
  "BsmtUnfSF",
  "GarageYrBlt",
  "EnclosedPorch",
  "WoodDeckSF",
  "MSSubClass",
  "MiscVal",
  "OpenPorchSF",
  "ThreeSsnPorch",
  "YearRemodAdd",
  "YrSold",
  "GarageArea",
  "LowQualFinSF",
  "BsmtFinSFTwo",
  "OverallCond",
  "MoSold",
  "SecondFlrSF",
  "TotRmsAbvGrd",
  "ScreenPorch",
  "Fireplaces",
  "OverallQual",
  "HalfBath",
  "MasVnrArea",
  "GarageCars",
  "LotFrontage",
  "BsmtFullBath",
  "FullBath",
  "BedroomAbvGr",
  "BsmtHalfBath",
];

const data = new Array(features.length).fill(1).map(() => {
  const row = {};
  features.forEach((feature) => (row[feature] = Math.random() * 1000 - 500));
  return row;
});

function App() {
  const [selectedRowIndex, setSelectedRowIndex] = useState();

  return (
    <main>
      <GlobalExplanations
        data={data}
        features={features}
        selectedRowIndex={selectedRowIndex}
      />
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
    </main>
  );
}

export default App;
