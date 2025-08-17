import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import RegisterInterest from "./RegisterInterest";

function AppWithRouting() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/register-interest" element={<RegisterInterest />} />
      </Routes>
    </Router>
  );
}

export default AppWithRouting;
