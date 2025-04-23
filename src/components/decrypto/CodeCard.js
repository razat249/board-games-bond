import React from 'react';
import './CodeCard.css';

const CodeCard = ({ code }) => {
  // Format code as X.X.X with dots between numbers
  const formattedCode = code.join('.');
  
  return (
    <div className="code-card">
      <div className="code-card-screen">
        <div className="screen-content">
          {formattedCode}
        </div>
      </div>
      <div className="code-card-controls">
        <div className="slider-container">
          <div className="slider-track"></div>
          <div className="slider-knob"></div>
        </div>
        <div className="button-container">
          <div className="button blue"></div>
          <div className="button red"></div>
        </div>
      </div>
    </div>
  );
};

export default CodeCard; 