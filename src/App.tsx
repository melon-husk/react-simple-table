import React from "react";

import "./App.css";
import SimpleTable from "./components/SimpleTable";

const mockData = require("./mock_data.json");

function App() {
  return <SimpleTable json_data={mockData} />;
}
export default App;
