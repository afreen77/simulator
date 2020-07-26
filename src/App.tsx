import React from 'react';
import './App.css';
import {Simulator} from "./app/pages/Simulator";
import Layout from "./app/layout/Layout";


function App() {
  return (
      <div className="App">
        <Layout>
          <Simulator/>
        </Layout>
      </div>
  );
}

export default App;
