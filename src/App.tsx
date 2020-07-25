import React from 'react';
import './App.css';
import {Simulator} from "./app/pages/Simulator";
import Layout from "./containers/Layout/Layout";


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
