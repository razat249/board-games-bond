import React, { useState, useEffect } from 'react';
import TeamBoard from './TeamBoard';
import GameControls from './GameControls';
import './DecryptoGame.css';

const DecryptoGame = () => {
  const [gameState, setGameState] = useState({
    round: 1,
    phase: 'setup', // setup, team1Encrypt, team1Guess, team2Encrypt, team2Guess, roundEnd
    currentTeam: 1,
    team1Name: 'Team 1',
    team2Name: 'Team 2',
    gameCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
    isTeam2: false, // Tracks whether this device is Team 2
    team1: {
      words: ['', '', '', ''],
      intercepted: 0,
      miscommunications: 0,
      codes: [],
      clues: [],
      guesses: []
    },
    team2: {
      words: ['', '', '', ''],
      intercepted: 0,
      miscommunications: 0,
      codes: [],
      clues: [],
      guesses: []
    }
  });

  const generateCode = () => {
    let code = [];
    for (let i = 0; i < 3; i++) {
      code.push(Math.floor(Math.random() * 4) + 1);
    }
    return code;
  };
  
  // Generate random words
  const generateRandomWords = () => {
    // Word bank for auto-generation
    const WORD_BANK = [
      "AGENT", "CODE", "SIGNAL", "CIPHER", "SECRET", "MISSION", "INTEL", "SECURE", 
      "ASSET", "SHADOW", "ENIGMA", "BREACH", "COVER", "HIDDEN", "TARGET", "SYSTEM",
      "DECODE", "ENCRYPT", "ACCESS", "KEY", "FILE", "NETWORK", "PROTOCOL", "DEVICE",
      "RADIO", "COMMAND", "SHIELD", "VECTOR", "STEALTH", "TACTICAL", "DEFENSE", "WIRE",
      "ORIGIN", "SOURCE", "TRACE", "DATA", "BACKUP", "MATRIX", "NODE", "EXTRACT", 
      "OMEGA", "ALPHA", "BEACON", "ECHO", "FOXTROT", "GAMMA", "HOTEL", "INDIA"
    ];
    
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

  const startGame = (team1Words, team2Words, team1Name, team2Name) => {
    setGameState(prev => {
      // Generate random words for Team 2 if not provided
      const finalTeam2Words = team2Words || generateRandomWords();
      
      return {
        ...prev,
        phase: 'team1Encrypt',
        team1Name: team1Name || 'Team 1',
        team2Name: team2Name || 'Team 2',
        team1: {
          ...prev.team1,
          words: team1Words || ['ALPHA', 'BRAVO', 'CHARLIE', 'DELTA'],
          codes: [...prev.team1.codes, generateCode()]
        },
        team2: {
          ...prev.team2,
          words: finalTeam2Words,
          codes: [...prev.team2.codes, generateCode()]
        }
      };
    });
  };
  
  const joinGame = (gameCode, teamName) => {
    // In a real implementation, this would make an API call to join a game with the provided code
    // For now, we'll simulate joining as Team 2
    
    // Generate random words for Team 2
    const team2Words = generateRandomWords();
    
    // Generate a first-round code for both teams
    const team1Code = generateCode();
    const team2Code = generateCode();
    
    setGameState(prev => ({
      ...prev,
      phase: 'team1Encrypt',
      team2Name: teamName || 'Team 2',
      isTeam2: true, // This device is now Team 2
      gameCode: gameCode,
      team1: {
        ...prev.team1,
        words: prev.team1.words,
        codes: [team1Code]
      },
      team2: {
        ...prev.team2,
        words: team2Words,
        codes: [team2Code]
      }
    }));
  };

  const submitTeamGuess = (guess) => {
    const team = gameState.currentTeam === 1 ? 'team1' : 'team2';
    const teamCodes = gameState[team].codes || [];
    const currentCode = teamCodes[gameState.round - 1];
    
    // If there's no code to compare against, just store the guess without evaluating
    const correct = currentCode ? 
      JSON.stringify(guess) === JSON.stringify(currentCode) : 
      false;
    
    setGameState(prev => {
      const prevGuesses = prev[team].guesses || [];
      const updatedTeam = {
        ...prev[team],
        guesses: [...prevGuesses, guess],
        miscommunications: correct ? prev[team].miscommunications : prev[team].miscommunications + 1
      };
      
      return {
        ...prev,
        [team]: updatedTeam,
        phase: gameState.currentTeam === 1 ? 'team2Encrypt' : 'roundEnd',
        currentTeam: gameState.currentTeam === 1 ? 2 : 1
      };
    });
  };

  const submitInterception = (guess) => {
    const targetTeam = gameState.currentTeam === 1 ? 'team2' : 'team1';
    const interceptingTeam = gameState.currentTeam === 1 ? 'team1' : 'team2';
    
    const targetCodes = gameState[targetTeam].codes || [];
    const currentCode = targetCodes[gameState.round - 1];
    
    // If there's no code to compare against, mark as incorrect
    const correct = currentCode ? 
      JSON.stringify(guess) === JSON.stringify(currentCode) : 
      false;
    
    setGameState(prev => {
      const updatedTeam = {
        ...prev[interceptingTeam],
        intercepted: correct ? prev[interceptingTeam].intercepted + 1 : prev[interceptingTeam].intercepted
      };
      
      return {
        ...prev,
        [interceptingTeam]: updatedTeam
      };
    });
  };

  const submitClues = (clues) => {
    const team = gameState.currentTeam === 1 ? 'team1' : 'team2';
    setGameState(prev => ({
      ...prev,
      [team]: {
        ...prev[team],
        clues: [...prev[team].clues, clues]
      },
      phase: gameState.currentTeam === 1 ? 'team1Guess' : 'team2Guess'
    }));
  };

  const nextRound = () => {
    setGameState(prev => ({
      ...prev,
      round: prev.round + 1,
      phase: 'team1Encrypt',
      currentTeam: 1,
      team1: {
        ...prev.team1,
        codes: [...prev.team1.codes, generateCode()]
      },
      team2: {
        ...prev.team2,
        codes: [...prev.team2.codes, generateCode()]
      }
    }));
  };

  const gameEnded = () => {
    return gameState.team1.intercepted >= 2 || 
           gameState.team2.intercepted >= 2 || 
           gameState.team1.miscommunications >= 2 ||
           gameState.team2.miscommunications >= 2;
  };

  const getWinner = () => {
    if (gameState.team1.intercepted >= 2) return `${gameState.team1Name} wins by intercepting ${gameState.team2Name}'s codes!`;
    if (gameState.team2.intercepted >= 2) return `${gameState.team2Name} wins by intercepting ${gameState.team1Name}'s codes!`;
    if (gameState.team1.miscommunications >= 2) return `${gameState.team2Name} wins due to ${gameState.team1Name}'s miscommunications!`;
    if (gameState.team2.miscommunications >= 2) return `${gameState.team1Name} wins due to ${gameState.team2Name}'s miscommunications!`;
    return null;
  };

  // Determine which team's board to show based on isTeam2 flag
  const teamToShow = gameState.isTeam2 ? 2 : 1;
  const opponentTeamNumber = teamToShow === 1 ? 2 : 1;

  return (
    <div className="decrypto-game">
      {gameState.phase === 'setup' ? (
        <div className="setup-phase">
          <div className="game-code-container">
            <h3>GAME CODE</h3>
            <div className="game-code-display">{gameState.gameCode}</div>
            <p className="game-code-instructions">
              Share this code with the other team. They should enter it on their device.
            </p>
          </div>
          <GameControls 
            gameState={gameState}
            startGame={startGame}
            submitClues={submitClues}
            submitTeamGuess={submitTeamGuess}
            submitInterception={submitInterception}
            nextRound={nextRound}
            gameEnded={gameEnded}
            winner={getWinner()}
            joinGame={joinGame}
          />
        </div>
      ) : (
        <>
          <div className="game-status-bar">
            <div className="game-info">
              <span className="game-code-label">GAME CODE: {gameState.gameCode}</span>
              <span className="game-round">ROUND: {gameState.round}</span>
              <span className="current-team">
                ACTIVE TEAM: {gameState.currentTeam === 1 ? gameState.team1Name : gameState.team2Name}
              </span>
            </div>
          </div>
          
          <div className="game-boards">
            <TeamBoard 
              teamNumber={teamToShow} 
              teamName={teamToShow === 1 ? gameState.team1Name : gameState.team2Name}
              teamData={teamToShow === 1 ? gameState.team1 : gameState.team2} 
              isCurrentTeam={gameState.currentTeam === teamToShow} 
              phase={gameState.phase}
              round={gameState.round}
              opponentTeamData={teamToShow === 1 ? gameState.team2 : gameState.team1}
              opponentTeamName={teamToShow === 1 ? gameState.team2Name : gameState.team1Name}
            />
          </div>
          
          <GameControls 
            gameState={gameState}
            startGame={startGame}
            submitClues={submitClues}
            submitTeamGuess={submitTeamGuess}
            submitInterception={submitInterception}
            nextRound={nextRound}
            gameEnded={gameEnded}
            winner={getWinner()}
            joinGame={joinGame}
          />
        </>
      )}
    </div>
  );
};

export default DecryptoGame; 