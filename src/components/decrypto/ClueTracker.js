import React, { useState, useEffect } from 'react';
import './ClueTracker.css';

const ClueTracker = () => {
  // Load initial state from localStorage if available
  const loadStoredValues = () => {
    try {
      const storedValues = localStorage.getItem('decryptoClueTracker');
      if (storedValues) {
        return JSON.parse(storedValues);
      }
    } catch (e) {
      console.error('Error loading stored clue tracker values:', e);
    }
    // Default values if no stored values or error
    return {
      upperGrid: Array(6).fill(''),
      lowerGrid: Array(4).fill('')
    };
  };

  const [gridValues, setGridValues] = useState(loadStoredValues);

  // Save to localStorage whenever values change
  useEffect(() => {
    try {
      localStorage.setItem('decryptoClueTracker', JSON.stringify(gridValues));
    } catch (e) {
      console.error('Error saving clue tracker values:', e);
    }
  }, [gridValues]);

  // Handle changes in text areas
  const handleUpperGridChange = (index, value) => {
    const newUpperGrid = [...gridValues.upperGrid];
    newUpperGrid[index] = value;
    setGridValues({ ...gridValues, upperGrid: newUpperGrid });
  };

  const handleLowerGridChange = (index, value) => {
    const newLowerGrid = [...gridValues.lowerGrid];
    newLowerGrid[index] = value;
    setGridValues({ ...gridValues, lowerGrid: newLowerGrid });
  };

  // Clear all text areas
  const handleClearAll = () => {
    setGridValues({
      upperGrid: Array(6).fill(''),
      lowerGrid: Array(4).fill('')
    });
  };

  return (
    <div className="clue-tracker">
      <div className="clue-tracker-header">
        <h4>Clue Tracker</h4>
        <button className="clear-button" onClick={handleClearAll}>Clear All</button>
      </div>
      
      {/* Upper grid - 3 rows x 2 columns */}
      <div className="upper-grid">
        {gridValues.upperGrid.map((value, index) => (
          <div key={`upper-${index}`} className="grid-cell">
            <textarea
              value={value}
              onChange={(e) => handleUpperGridChange(index, e.target.value)}
              placeholder="Enter opponent's clue here"
              className="grid-textarea"
            />
          </div>
        ))}
      </div>
      
      {/* Lower grid - 1 row x 4 columns */}
      <div className="lower-grid">
        {gridValues.lowerGrid.map((value, index) => (
          <div key={`lower-${index}`} className="grid-cell">
            <div className="number-label">{index + 1}</div>
            <textarea
              value={value}
              onChange={(e) => handleLowerGridChange(index, e.target.value)}
              placeholder="opponent's clues"
              className="grid-textarea"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClueTracker; 