import React from 'react'
import './loader.scss';

const ProgressBar = require('react-progress-bar-plus');
require('react-progress-bar-plus/lib/progress-bar.css');


const App = (props) => {

  return (
    <div>
      <ProgressBar autoIncrement={true} percent={props.asLoading ? 10 : 100} />
    </div>
  )
}

export default App
