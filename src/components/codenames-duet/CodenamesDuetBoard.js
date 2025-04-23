import React from 'react';
import CodenamesDuetCard from './CodenamesDuetCard';
import KeyCard from './KeyCard';

const CodenamesDuetBoard = ({ 
  board, 
  onCardClick, 
  playerView, 
  keyCard, 
  showKeyCard,
  gameState
}) => {
  const getCardType = (card) => {
    if (!card.revealed) {
      if (showKeyCard) {
        return playerView === 'player1' ? card.player2Type : card.player1Type;
      }
      return 'neutral';
    }
    return card.type;
  };

  return (
    <div className="codenames-duet-container">
      {showKeyCard && keyCard && (
        <div className="key-card-container">
          <KeyCard 
            keyCard={keyCard} 
            playerView={playerView} 
          />
        </div>
      )}
      
      <div className="codenames-duet-board">
        {board.map(card => (
          <CodenamesDuetCard 
            key={card.id}
            card={card}
            onClick={() => onCardClick(card.id)}
            cardType={getCardType(card)}
            disabled={gameState !== 'playing' || card.revealed}
          />
        ))}
      </div>
    </div>
  );
};

export default CodenamesDuetBoard; 