import "./App.css";
import React from "react";
import { Calendar } from "./components/Calendar";
import "bootstrap/dist/css/bootstrap.min.css"

const App = () => {
  return (
    <div className="App">
      <h1>Fancy Calendar</h1>
      <Calendar />
    </div>
  );
};

export default App;
