import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// function noop() {}

// TODO: uncomment this when fully production
// if (process.env.NODE_ENV !== 'development') {
//   console.log = noop;
//   console.warn = noop;
//   console.error = noop;
// }

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);