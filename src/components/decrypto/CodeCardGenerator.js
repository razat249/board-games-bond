import React, { useState } from 'react';
import CodeCard from './CodeCard';
import './CodeCard.css';

const CodeCardGenerator = () => {
  const [codes, setCodes] = useState([]);
  
  // Generate a code with 3 unique digits from 1-4
  const generateUniqueDigitsCode = () => {
    // Create an array of the digits 1 through 4
    const availableDigits = [1, 2, 3, 4];
    let code = [];
    
    // Select 3 unique digits from the available digits
    for (let i = 0; i < 3; i++) {
      // Get a random index from the remaining available digits
      const randomIndex = Math.floor(Math.random() * availableDigits.length);
      // Add the digit at that index to our code
      code.push(availableDigits[randomIndex]);
      // Remove the used digit from available digits
      availableDigits.splice(randomIndex, 1);
    }
    
    return code;
  };
  
  const handleGenerateCode = () => {
    // Generate a new code
    const newCode = generateUniqueDigitsCode();
    
    // Always replace any existing code with the new one
    setCodes([newCode]);
  };
  
  return (
    <div className="code-card-generator">
      <button className="generate-code-button" onClick={handleGenerateCode}>
        Generate Code Card
      </button>
      
      <div className="code-cards-display">
        {codes.length === 0 ? (
          <div className="code-card-placeholder">
            <span>No code cards generated</span>
          </div>
        ) : (
          <div className="code-card-container">
            {codes.map((code, index) => (
              <CodeCard key={index} code={code} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeCardGenerator; 