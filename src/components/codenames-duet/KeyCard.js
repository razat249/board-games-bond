import React from 'react';

const KeyCard = ({ keyCard, playerView }) => {
  if (!keyCard) return null;
  
  // Get the opposite player's key information (Player 1 sees Player 2's agents and vice versa)
  const oppositePlayerKey = playerView === 'player1' ? keyCard.player2 : keyCard.player1;
  
  // Generate a 5x5 grid representing the key card
  const gridSize = 5;
  const grid = Array(gridSize * gridSize).fill(null).map((_, index) => {
    let cellType = 'bystander';
    if (oppositePlayerKey.agents.includes(index)) {
      cellType = 'agent';
    } else if (oppositePlayerKey.assassins.includes(index)) {
      cellType = 'assassin';
    }
    
    return { id: index, type: cellType };
  });
  
  return (
    <div className="keycard">
      <div className="keycard-title">
        <h3>{playerView === 'player1' ? 'Player 2 Cards' : 'Player 1 Cards'}</h3>
      </div>
      <div className="keycard-grid">
        {grid.map(cell => (
          <div 
            key={cell.id} 
            className={`keycard-cell ${cell.type}`}
            title={cell.type.charAt(0).toUpperCase() + cell.type.slice(1)}
          />
        ))}
      </div>
      <div className="keycard-legend">
        <div className="legend-item">
          <div className="legend-color agent"></div>
          <span>Agent</span>
        </div>
        <div className="legend-item">
          <div className="legend-color assassin"></div>
          <span>Assassin</span>
        </div>
        <div className="legend-item">
          <div className="legend-color bystander"></div>
          <span>Bystander</span>
        </div>
      </div>
    </div>
  );
};

export default KeyCard; 