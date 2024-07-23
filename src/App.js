// src/App.js
import React from "react";
import Map from "./Map";
import { CompassProvider } from "./context/CompassProvider";

function App() {
  return (
    <CompassProvider>
      <Map />
    </CompassProvider>
  );
}

export default App;
