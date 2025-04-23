import React, { useState } from 'react';

const CodenamesCard = ({ card, onClick, showSolution }) => {
  const [isClicked, setIsClicked] = useState(false);
  
  const getCardClass = () => {
    let className = 'codenames-card';
    
    // Apply a visual "clicked" class immediately on click
    if (isClicked && !card.revealed) {
      className += ' clicked';
    }
    
    if (card.revealed) {
      className += ' revealed';
      className += ` ${card.type}`;
    } else if (showSolution) {
      className += ' solution';
      className += ` ${card.type}`;
    }
    
    return className;
  };

  const handleClick = () => {
    if (!card.revealed) {
      setIsClicked(true);
      // Call the parent onClick handler
      onClick();
    }
  };

  return (
    <div className={getCardClass()} onClick={handleClick}>
      <div className="card-content">
        <span className="card-word">{card.word}</span>
        {!card.revealed && showSolution && (
          <div className="solution-overlay"></div>
        )}
      </div>
    </div>
  );
};

export default CodenamesCard; 