import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import './index.css';
import TestComponent from './test.jsx'; // 假设 test.jsx 中的组件名为 TestComponent

ReactDOM.render(
  <React.StrictMode>
    <TestComponent />
  </React.StrictMode>,
  document.getElementById('root')
);
