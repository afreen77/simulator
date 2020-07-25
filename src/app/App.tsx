import React from "react";
import Layout from "../containers/Layout/Layout";
import "./App.css";
import { Simulator } from "./pages/Simulator";
import ErrorBoundary from "./ErrorBoundary";

function App() {
  return (
    <Layout>
      <ErrorBoundary>
      <Simulator />
      </ErrorBoundary>
    </Layout>
  );
}

export default App;
