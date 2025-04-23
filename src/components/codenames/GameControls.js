import React from 'react';

const GameControls = ({ 
  redTurn, 
  gameOver, 
  winner, 
  onNewGame, 
  onToggleSolution, 
  onEndTurn,
  showSolution,
  gameCode,
  playerRole
}) => {
  const getStatusText = () => {
    if (gameOver) {
      return `Game Over! ${winner.toUpperCase()} Team Wins!`;
    }
    return `${redTurn ? 'RED' : 'BLUE'} Team's Turn`;
  };

  const copyGameLink = () => {
    const url = `${window.location.origin}/codenames/${gameCode}`;
    navigator.clipboard.writeText(url)
      .then(() => {
        alert('Game link copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  return (
    <div className="game-controls">
      <div className="game-status">
        <div className={`status-indicator ${gameOver ? winner : (redTurn ? 'red' : 'blue')}`}>
          {getStatusText()}
        </div>
        
        <div className="role-indicator">
          Playing as: <span className={`role-badge ${playerRole}`}>{playerRole === 'spymaster' ? 'Spymaster' : 'Agent'}</span>
        </div>
        
        {gameCode && (
          <div className="game-code-display">
            <span>Game #{gameCode}</span>
            <button 
              className="copy-link-btn" 
              onClick={copyGameLink}
              title="Copy game link to clipboard"
            >
              Share
            </button>
          </div>
        )}
      </div>
      
      <div className="control-buttons">
        <button 
          className="control-btn new-game-btn" 
          onClick={onNewGame}
        >
          New Game
        </button>
        
        {!gameOver && (
          <button 
            className={`control-btn end-turn-btn ${redTurn ? 'red' : 'blue'}`} 
            onClick={onEndTurn}
          >
            End {redTurn ? 'Red' : 'Blue'} Turn
          </button>
        )}
      </div>
    </div>
  );
};

export default GameControls; 