import React, { useState, useEffect } from 'react';

const PlayerSelection = ({ onStart }) => {
  const [playerName, setPlayerName] = useState('');
  const [playerRole, setPlayerRole] = useState('player1');
  const [gameLink, setGameLink] = useState('');
  const [isCreatingGame, setIsCreatingGame] = useState(true);
  const [gameCode, setGameCode] = useState('');
  
  useEffect(() => {
    // Check if there's a game code in the URL when the component mounts
    const urlParams = new URLSearchParams(window.location.search);
    const codeFromUrl = urlParams.get('game');
    
    if (codeFromUrl) {
      setIsCreatingGame(false);
      setGameCode(codeFromUrl);
    }
  }, []);
  
  // Generate a random 4-digit code
  const generateGameCode = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const handleCreateGame = () => {
    if (!playerName) {
      alert('Please enter your name');
      return;
    }
    
    const newGameCode = generateGameCode();
    const gameUrl = `${window.location.origin}/board-games-bond/codenames-duet?game=${newGameCode}`;
    setGameLink(gameUrl);
    
    // Start the game with player details
    onStart({
      playerName,
      playerRole,
      gameCode: newGameCode,
      isHost: true
    });
  };
  
  const handleJoinGame = () => {
    if (!playerName) {
      alert('Please enter your name');
      return;
    }
    
    let codeToUse = gameCode;
    
    if (!codeToUse) {
      // Extract game code from URL if it exists
      const urlParams = new URLSearchParams(window.location.search);
      codeToUse = urlParams.get('game');
    }
    
    if (codeToUse) {
      // Start the game with player details
      onStart({
        playerName,
        playerRole: 'player2', // Joining player is always player2
        gameCode: codeToUse,
        isHost: false
      });
    } else {
      alert('Please enter a valid 4-digit game code');
    }
  };
  
  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(gameLink);
    alert('Game link copied to clipboard!');
  };

  return (
    <div className="player-selection">
      <h2>Codenames Duet</h2>
      
      <div className="selection-tabs">
        <button 
          className={isCreatingGame ? 'active' : ''} 
          onClick={() => setIsCreatingGame(true)}
        >
          Create Game
        </button>
        <button 
          className={!isCreatingGame ? 'active' : ''} 
          onClick={() => setIsCreatingGame(false)}
        >
          Join Game
        </button>
      </div>
      
      <div className="player-form">
        <div className="form-group">
          <label htmlFor="playerName">Your Name:</label>
          <input 
            type="text" 
            id="playerName" 
            value={playerName} 
            onChange={(e) => setPlayerName(e.target.value)} 
            placeholder="Enter your name"
          />
        </div>
        
        {isCreatingGame ? (
          <div className="form-group">
            <label htmlFor="playerRole">Your Role:</label>
            <select 
              id="playerRole" 
              value={playerRole} 
              onChange={(e) => setPlayerRole(e.target.value)}
            >
              <option value="player1">Player 1</option>
              <option value="player2">Player 2</option>
            </select>
          </div>
        ) : (
          <div className="form-group">
            <label htmlFor="gameCode">Game Code:</label>
            <input 
              type="text" 
              id="gameCode"
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value)}
              placeholder="Enter 4-digit code"
              maxLength={4}
              pattern="\d{4}"
            />
          </div>
        )}
        
        {isCreatingGame ? (
          <button 
            className="start-game-btn" 
            onClick={handleCreateGame}
            disabled={!playerName}
          >
            Create Game
          </button>
        ) : (
          <button 
            className="start-game-btn" 
            onClick={handleJoinGame}
            disabled={!playerName || (gameCode && gameCode.length !== 4)}
          >
            Join Game
          </button>
        )}
        
        {gameLink && (
          <div className="game-link-container">
            <p>Share this link with your friend:</p>
            <div className="game-link">
              <input 
                type="text" 
                readOnly 
                value={gameLink} 
              />
              <button onClick={copyLinkToClipboard}>Copy</button>
            </div>
            <p className="game-code-display">
              Or share the code: <strong>{gameLink.split('game=')[1]}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerSelection; 