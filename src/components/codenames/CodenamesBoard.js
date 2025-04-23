import React from 'react';
import CodenamesCard from './CodenamesCard';

const CodenamesBoard = ({ board, onCardClick, showSolution }) => {
  return (
    <div className="codenames-board">
      {board.map(card => (
        <CodenamesCard 
          key={card.id}
          card={card}
          onClick={() => onCardClick(card.id)}
          showSolution={showSolution}
        />
      ))}
    </div>
  );
};

export default CodenamesBoard; 