import React, { useState } from 'react';
import './GameControls.css';

// Word bank for auto-generation
const WORD_BANK = [
  "AGENT", "CODE", "SIGNAL", "CIPHER", "SECRET", "MISSION", "INTEL", "SECURE", 
  "ASSET", "SHADOW", "ENIGMA", "BREACH", "COVER", "HIDDEN", "TARGET", "SYSTEM",
  "DECODE", "ENCRYPT", "ACCESS", "KEY", "FILE", "NETWORK", "PROTOCOL", "DEVICE",
  "RADIO", "COMMAND", "SHIELD", "VECTOR", "STEALTH", "TACTICAL", "DEFENSE", "WIRE",
  "ORIGIN", "SOURCE", "TRACE", "DATA", "BACKUP", "MATRIX", "NODE", "EXTRACT", 
  "OMEGA", "ALPHA", "BEACON", "ECHO", "FOXTROT", "GAMMA", "HOTEL", "INDIA"
];

const GameControls = ({ 
  gameState, 
  startGame, 
  submitClues, 
  submitTeamGuess,
  submitInterception,
  nextRound,
  gameEnded,
  winner,
  joinGame
}) => {
  const [team1Words, setTeam1Words] = useState(['', '', '', '']);
  const [team2Words, setTeam2Words] = useState(['', '', '', '']);
  const [team1Name, setTeam1Name] = useState('Team 1');
  const [team2Name, setTeam2Name] = useState('Team 2');
  const [clues, setClues] = useState(['', '', '']);
  const [teamGuess, setTeamGuess] = useState([1, 1, 1]);
  const [interceptionGuess, setInterceptionGuess] = useState([1, 1, 1]);
  const [showInterception, setShowInterception] = useState(false);
  const [joinGameCode, setJoinGameCode] = useState('');
  const [joiningTeamName, setJoiningTeamName] = useState('Team 2');
  const [creatingNewGame, setCreatingNewGame] = useState(true);

  // Auto-generate random words from word bank
  const generateRandomWords = () => {
    // Create a copy of the word bank to avoid duplicates
    const availableWords = [...WORD_BANK];
    const randomWords = [];
    
    for (let i = 0; i < 4; i++) {
      // Get a random index and remove that word from available words
      const randomIndex = Math.floor(Math.random() * availableWords.length);
      randomWords.push(availableWords[randomIndex]);
      availableWords.splice(randomIndex, 1);
    }
    
    return randomWords;
  };

  const handleTeam1WordChange = (index, value) => {
    const newWords = [...team1Words];
    newWords[index] = value;
    setTeam1Words(newWords);
  };

  const handleTeam2WordChange = (index, value) => {
    const newWords = [...team2Words];
    newWords[index] = value;
    setTeam2Words(newWords);
  };

  const handleClueChange = (index, value) => {
    const newClues = [...clues];
    newClues[index] = value;
    setClues(newClues);
  };

  const handleTeamGuessChange = (index, value) => {
    const newGuess = [...teamGuess];
    newGuess[index] = parseInt(value);
    setTeamGuess(newGuess);
  };

  const handleInterceptionGuessChange = (index, value) => {
    const newGuess = [...interceptionGuess];
    newGuess[index] = parseInt(value);
    setInterceptionGuess(newGuess);
  };

  const handleStartGame = () => {
    // Validate that all words for Team 1 are entered or auto-generate them
    let finalTeam1Words = team1Words;
    
    // If any Team 1 word is empty, generate all of them
    if (team1Words.some(word => !word.trim())) {
      finalTeam1Words = generateRandomWords();
    }
    
    // Create a new game
    startGame(finalTeam1Words, null, team1Name, null);
  };

  const handleJoinGame = () => {
    if (!joinGameCode.trim()) {
      alert('Please enter a game code');
      return;
    }
    
    // Join existing game
    joinGame(joinGameCode.trim().toUpperCase(), joiningTeamName);
  };

  const autoGenerateTeam1Words = () => {
    setTeam1Words(generateRandomWords());
  };

  const handleSubmitClues = () => {
    // Validate all clues are entered
    if (clues.some(clue => !clue.trim())) {
      alert('Please enter all three clues');
      return;
    }
    submitClues(clues);
    setClues(['', '', '']); // Reset clues for next round
  };

  const handleSubmitTeamGuess = () => {
    submitTeamGuess(teamGuess);
    setTeamGuess([1, 1, 1]); // Reset for next round
  };

  const handleSubmitInterception = () => {
    submitInterception(interceptionGuess);
    setInterceptionGuess([1, 1, 1]); // Reset for next round
    setShowInterception(false);
  };

  const renderSetupControls = () => {
    return (
      <div className="setup-controls">
        <div className="game-mode-switch">
          <button 
            className={`mode-button ${creatingNewGame ? 'active' : ''}`}
            onClick={() => setCreatingNewGame(true)}
          >
            CREATE GAME
          </button>
          <button 
            className={`mode-button ${!creatingNewGame ? 'active' : ''}`}
            onClick={() => setCreatingNewGame(false)}
          >
            JOIN GAME
          </button>
        </div>

        {creatingNewGame ? (
          // Create new game
          <div className="team-setup team1-setup">
            <div className="team-name-input">
              <label>YOUR TEAM NAME:</label>
              <input
                type="text"
                value={team1Name}
                onChange={(e) => setTeam1Name(e.target.value)}
                placeholder="Enter your team name"
                className="team-name-field"
              />
            </div>
            
            <h3>YOUR TEAM WORDS</h3>
            {team1Words.map((word, index) => (
              <div key={index} className="word-input-group">
                <label>{index + 1}:</label>
                <input
                  type="text"
                  value={word}
                  onChange={(e) => handleTeam1WordChange(index, e.target.value)}
                  placeholder={`Word ${index + 1}`}
                />
              </div>
            ))}
            
            <button 
              className="secondary-button auto-generate-button"
              onClick={autoGenerateTeam1Words}
            >
              AUTO-GENERATE WORDS
            </button>
            
            <div className="opponent-info">
              <p className="opponent-note">
                The other team will join your game using the game code displayed above.
              </p>
            </div>
            
            <button 
              className="primary-button start-game-button"
              onClick={handleStartGame}
            >
              START MISSION
            </button>
          </div>
        ) : (
          // Join existing game
          <div className="join-game-section">
            <div className="game-code-input">
              <label>GAME CODE:</label>
              <input
                type="text"
                value={joinGameCode}
                onChange={(e) => setJoinGameCode(e.target.value.toUpperCase())}
                placeholder="Enter game code"
                className="game-code-field"
                maxLength={6}
              />
            </div>
            
            <div className="team-name-input">
              <label>YOUR TEAM NAME:</label>
              <input
                type="text"
                value={joiningTeamName}
                onChange={(e) => setJoiningTeamName(e.target.value)}
                placeholder="Enter your team name"
                className="team-name-field"
              />
            </div>
            
            <div className="join-info">
              <p className="join-note">
                Your team words will be automatically generated.
              </p>
            </div>
            
            <button 
              className="primary-button join-game-button"
              onClick={handleJoinGame}
            >
              JOIN MISSION
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderEncryptControls = () => {
    const currentTeam = gameState.currentTeam;
    const teamCodes = gameState[`team${currentTeam}`].codes || [];
    const currentCode = teamCodes[gameState.round - 1] || [1, 2, 3]; // Default code if undefined
    const teamName = currentTeam === 1 ? gameState.team1Name : gameState.team2Name;
    
    return (
      <div className="encrypt-controls">
        <h3>{teamName} - Create Clues</h3>
        <div className="code-display">
          Code to communicate: {currentCode.join('-')}
        </div>
        
        {currentCode.map((number, index) => (
          <div key={index} className="clue-input-group">
            <label>Clue for {number}:</label>
            <input
              type="text"
              value={clues[index]}
              onChange={(e) => handleClueChange(index, e.target.value)}
              placeholder={`Clue ${index + 1}`}
            />
          </div>
        ))}
        
        <button 
          className="primary-button submit-clues-button"
          onClick={handleSubmitClues}
        >
          SUBMIT CLUES
        </button>
      </div>
    );
  };

  const renderGuessControls = () => {
    const currentTeam = gameState.currentTeam;
    const otherTeam = currentTeam === 1 ? 2 : 1;
    const teamClues = gameState[`team${currentTeam}`].clues || [];
    const currentClues = teamClues[gameState.round - 1] || ['', '', ''];
    const teamName = currentTeam === 1 ? gameState.team1Name : gameState.team2Name;
    const otherTeamName = otherTeam === 1 ? gameState.team1Name : gameState.team2Name;
    
    return (
      <div className="guess-controls">
        <h3>{teamName} - Guess Your Code</h3>
        <div className="clues-display">
          <p>Clues:</p>
          <ul>
            {currentClues.map((clue, index) => (
              <li key={index}>{clue}</li>
            ))}
          </ul>
        </div>
        
        <div className="guess-inputs">
          {[0, 1, 2].map((index) => (
            <div key={index} className="guess-input-group">
              <label>Position {index + 1}:</label>
              <select
                value={teamGuess[index]}
                onChange={(e) => handleTeamGuessChange(index, e.target.value)}
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
              </select>
            </div>
          ))}
        </div>
        
        <button 
          className="primary-button submit-guess-button"
          onClick={handleSubmitTeamGuess}
        >
          SUBMIT GUESS
        </button>
        
        {!showInterception && (
          <button 
            className="secondary-button interception-button"
            onClick={() => setShowInterception(true)}
          >
            TRY TO INTERCEPT {otherTeamName}'S CODE
          </button>
        )}
        
        {showInterception && (
          <div className="interception-controls">
            <h4>ATTEMPT TO INTERCEPT {otherTeamName}'S CODE</h4>
            <div className="interception-inputs">
              {[0, 1, 2].map((index) => (
                <div key={index} className="guess-input-group">
                  <label>Position {index + 1}:</label>
                  <select
                    value={interceptionGuess[index]}
                    onChange={(e) => handleInterceptionGuessChange(index, e.target.value)}
                  >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                  </select>
                </div>
              ))}
            </div>
            
            <div className="interception-buttons">
              <button 
                className="secondary-button submit-interception-button"
                onClick={handleSubmitInterception}
              >
                SUBMIT INTERCEPTION
              </button>
              <button 
                className="cancel-button"
                onClick={() => setShowInterception(false)}
              >
                CANCEL
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderRoundEndControls = () => {
    return (
      <div className="round-end-controls">
        <h3>Round {gameState.round} Complete</h3>
        <button 
          className="primary-button next-round-button"
          onClick={nextRound}
        >
          START ROUND {gameState.round + 1}
        </button>
      </div>
    );
  };

  const renderGameOverControls = () => {
    const team1Name = gameState.team1Name || 'Team 1';
    const team2Name = gameState.team2Name || 'Team 2';
    
    return (
      <div className="game-over-controls">
        <h2>MISSION COMPLETE</h2>
        <h3>{winner.replace('Team 1', team1Name).replace('Team 2', team2Name)}</h3>
        <div className="final-scores">
          <div className="team-score">
            <h4>{team1Name}</h4>
            <p>Interceptions: {gameState.team1.intercepted}/2</p>
            <p>Miscommunications: {gameState.team1.miscommunications}/2</p>
          </div>
          <div className="team-score">
            <h4>{team2Name}</h4>
            <p>Interceptions: {gameState.team2.intercepted}/2</p>
            <p>Miscommunications: {gameState.team2.miscommunications}/2</p>
          </div>
        </div>
        <button 
          className="primary-button new-game-button"
          onClick={() => window.location.reload()}
        >
          NEW MISSION
        </button>
      </div>
    );
  };

  if (gameEnded() && winner) {
    return renderGameOverControls();
  }

  switch (gameState.phase) {
    case 'setup':
      return renderSetupControls();
    case 'team1Encrypt':
    case 'team2Encrypt':
      return renderEncryptControls();
    case 'team1Guess':
    case 'team2Guess':
      return renderGuessControls();
    case 'roundEnd':
      return renderRoundEndControls();
    default:
      return null;
  }
};

export default GameControls; 