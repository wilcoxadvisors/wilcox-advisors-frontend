import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // Optional: You can create this later for styling
import App from './App';
import reportWebVitals from './reportWebVitals'; // Optional: You can create this later for performance monitoring

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
