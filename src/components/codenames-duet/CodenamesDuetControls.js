import React from 'react';

const CodenamesDuetControls = ({ 
  playerName,
  playerRole, 
  timerTokens, 
  gameState,
  agents,
  resetGame,
  toggleKeyCard,
  showKeyCard,
  gameCode
}) => {
  // Function to copy the game code to clipboard
  const copyGameCode = () => {
    navigator.clipboard.writeText(gameCode);
    alert('Game code copied to clipboard!');
  };

  // Function to copy the full game link to clipboard
  const copyGameLink = () => {
    const gameUrl = `${window.location.origin}/board-games-bond/codenames-duet?game=${gameCode}`;
    navigator.clipboard.writeText(gameUrl);
    alert('Game link copied to clipboard!');
  };

  return (
    <div className="codenames-duet-controls">
      <div className="game-status">
        <div className="current-player">
          <h3>Your Role:</h3>
          <div className={`player-indicator ${playerRole}`}>
            {playerName} ({playerRole === 'player1' ? 'Player 1' : 'Player 2'})
          </div>
          
          {gameCode && (
            <div className="game-code-info">
              <div className="game-code-value">
                Game Code: <strong>{gameCode}</strong>
              </div>
              <div className="game-code-actions">
                <button onClick={copyGameCode}>
                  Copy Code
                </button>
                <button onClick={copyGameLink}>
                  Copy Link
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="timer-tokens">
          <h3>Timer Tokens Remaining: {timerTokens}</h3>
          <div className="tokens-display">
            {Array(timerTokens).fill(null).map((_, i) => (
              <div key={i} className="token" />
            ))}
            {Array(9 - timerTokens).fill(null).map((_, i) => (
              <div key={i} className="token used" />
            ))}
          </div>
        </div>
        
        <div className="agents-found">
          <h3>Agents Found:</h3>
          <div className={`agents-counter ${agents.found === agents.total ? 'celebrate' : ''}`}>
            {agents.found} / {agents.total}
          </div>
        </div>
      </div>
      
      <div className="game-actions">
        <button 
          className={`key-card-toggle ${showKeyCard ? 'active' : ''}`} 
          onClick={toggleKeyCard}
        >
          {showKeyCard ? 'Hide Key Card' : 'Show Key Card'}
        </button>
        
        <button className="reset-game" onClick={resetGame}>
          New Game
        </button>
      </div>
      
      <div className="game-help">
        <h3>How to Play:</h3>
        <ul>
          <li>Look at your key card to see which words your partner needs to find</li>
          <li>Take turns giving one-word clues to help your partner find agents</li>
          <li>Find all 9 agents before running out of timer tokens</li>
          <li>Avoid the assassins!</li>
        </ul>
      </div>
    </div>
  );
};

export default CodenamesDuetControls; 