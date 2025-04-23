import React, { useState } from 'react';

const CodenamesDuetCard = ({ card, onClick, cardType, disabled }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getCardClass = () => {
    let className = 'codenames-duet-card';
    
    if (card.revealed) {
      className += ' revealed';
      className += ` ${card.type}`; // agent, assassin, or bystander
    }
    
    if (isHovered && !disabled) {
      className += ' hovered';
    }
    
    if (disabled && !card.revealed) {
      className += ' disabled';
    }
    
    return className;
  };
  
  const handleClick = () => {
    if (!disabled) {
      onClick();
    }
  };
  
  return (
    <div 
      className={getCardClass()} 
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="card-content">
        <span className="card-word">{card.word}</span>
      </div>
    </div>
  );
};

export default CodenamesDuetCard; 