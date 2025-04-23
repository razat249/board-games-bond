import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import CodenamesDuetBoard from './CodenamesDuetBoard';
import CodenamesDuetControls from './CodenamesDuetControls';
import PlayerSelection from './PlayerSelection';
import wordsList from './wordsList';
import './CodenamesDuet.css';

const CodenamesDuetGame = () => {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [board, setBoard] = useState([]);
  const [keyCard, setKeyCard] = useState(null);
  const [playerInfo, setPlayerInfo] = useState(null);
  const [timerTokens, setTimerTokens] = useState(9);
  const [gameState, setGameState] = useState('playing'); // playing, won, lost
  const [agents, setAgents] = useState({ found: 0, total: 9 });
  const [showKeyCard, setShowKeyCard] = useState(false);
  const isProcessingClick = useRef(false);
  const lastClickedId = useRef(null);
  const processingTimestamp = useRef(0);
  
  useEffect(() => {
    // Check if we're joining an existing game
    const urlParams = new URLSearchParams(window.location.search);
    const gameCode = urlParams.get('game');
    
    // If there's a game code in the URL and the game isn't started yet,
    // auto-switch to "Join Game" mode
    if (gameCode && !gameStarted) {
      console.log(`Game code detected in URL: ${gameCode}`);
    }
    
    // If the user refreshes the page during a game, try to recover the game state
    const savedPlayerInfo = localStorage.getItem('codenames_duet_player_info');
    if (savedPlayerInfo) {
      try {
        const parsedInfo = JSON.parse(savedPlayerInfo);
        if (parsedInfo.gameCode === gameCode) {
          setPlayerInfo(parsedInfo);
          setGameStarted(true);
          initializeGame(parsedInfo.gameCode);
        }
      } catch (e) {
        console.error("Error parsing saved player info:", e);
        localStorage.removeItem('codenames_duet_player_info');
      }
    }
  }, [gameStarted]);
  
  const handleStartGame = (playerDetails) => {
    setPlayerInfo(playerDetails);
    setGameStarted(true);
    
    // Save player info to localStorage for game persistence
    localStorage.setItem('codenames_duet_player_info', JSON.stringify(playerDetails));
    
    // Update URL with game code if not already there
    const urlParams = new URLSearchParams(window.location.search);
    const currentGameCode = urlParams.get('game');
    if (currentGameCode !== playerDetails.gameCode) {
      // Using relative path that will be correctly prefixed by the router's basename
      navigate(`/codenames-duet?game=${playerDetails.gameCode}`, { replace: true });
    }
    
    initializeGame(playerDetails.gameCode);
  };
  
  const initializeGame = (gameCode) => {
    // Use the game code as a seed for the random generator
    // This ensures both players see the same board
    let seed;
    
    // For numeric game codes, use the numeric value directly
    if (/^\d+$/.test(gameCode)) {
      seed = parseInt(gameCode, 10);
    } else {
      // For non-numeric codes, use a deterministic hash
      seed = gameCode.split('').reduce((acc, char, index) => {
        return acc + (char.charCodeAt(0) * (index + 1));
      }, 0);
    }
    
    // Generate a 5x5 board with random words
    const words = getRandomWords(25, seed);
    const newBoard = words.map((word, index) => ({
      id: index,
      word,
      revealed: false,
      type: 'neutral'
    }));
    
    // Generate the key card (which defines agent/assassin/bystander locations)
    const newKeyCard = generateKeyCard(seed);
    
    // Apply the key card to the board
    const boardWithTypes = applyKeyCardToBoard(newBoard, newKeyCard);
    
    setBoard(boardWithTypes);
    setKeyCard(newKeyCard);
    setTimerTokens(9);
    setGameState('playing');
    setAgents({ found: 0, total: 9 });
    setShowKeyCard(false);
  };
  
  // Custom random function with seed
  const seededRandom = (seed) => {
    // Using Mulberry32 algorithm for better distribution
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
  
  const getRandomWords = (count, seed) => {
    // Make a copy of the words list
    const words = [...wordsList];
    let currentSeed = seed;
    
    // Implement Fisher-Yates shuffle algorithm with seeded random
    for (let i = words.length - 1; i > 0; i--) {
      // Generate random index based on the current seed
      const j = Math.floor(seededRandom(currentSeed++) * (i + 1));
      // Swap elements
      [words[i], words[j]] = [words[j], words[i]];
    }
    
    return words.slice(0, count);
  };
  
  const generateKeyCard = (seed) => {
    // Create arrays for card positions (0-24)
    const positions = Array.from({ length: 25 }, (_, i) => i);
    let currentSeed = seed;
    
    // Shuffle positions using Fisher-Yates algorithm
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom(currentSeed++) * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }
    
    // For player 1
    const player1Agents = positions.slice(0, 9);
    const player1Assassins = positions.slice(9, 12);
    
    // For player 2 - ensure some overlap with player 1's agents
    // In Duet, typically 3-5 cards are agents for both players
    const sharedAgentsCount = 3 + Math.floor(seededRandom(currentSeed++) * 3); // 3-5 shared agents
    const sharedAgents = player1Agents.slice(0, sharedAgentsCount);
    
    // Remaining unique agents for player 2
    const uniqueAgentsCount = 9 - sharedAgents.length;
    const availablePositions = positions.filter(
      pos => !player1Agents.includes(pos) && !player1Assassins.includes(pos)
    );
    
    // Shuffle available positions for deterministic selection
    const shuffledAvailable = [...availablePositions];
    for (let i = shuffledAvailable.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom(currentSeed++) * (i + 1));
      [shuffledAvailable[i], shuffledAvailable[j]] = [shuffledAvailable[j], shuffledAvailable[i]];
    }
    
    // Select unique agents for player 2
    const uniquePlayer2Agents = shuffledAvailable.slice(0, uniqueAgentsCount);
    
    // Player 2 agents (shared + unique)
    const player2Agents = [...sharedAgents, ...uniquePlayer2Agents];
    
    // Some of player 1's agents should be assassins for player 2
    const nonSharedAgents = player1Agents.filter(agent => !sharedAgents.includes(agent));
    
    // Shuffle non-shared agents for deterministic selection
    const shuffledNonShared = [...nonSharedAgents];
    for (let i = shuffledNonShared.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom(currentSeed++) * (i + 1));
      [shuffledNonShared[i], shuffledNonShared[j]] = [shuffledNonShared[j], shuffledNonShared[i]];
    }
    
    const agentsAsAssassins = shuffledNonShared.slice(0, 3);
    
    // Remaining positions for player 2 assassins
    const remainingAssassinPositions = positions.filter(
      pos => !player2Agents.includes(pos) && !agentsAsAssassins.includes(pos)
    );
    
    // Shuffle remaining assassin positions for deterministic selection
    const shuffledRemaining = [...remainingAssassinPositions];
    for (let i = shuffledRemaining.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom(currentSeed++) * (i + 1));
      [shuffledRemaining[i], shuffledRemaining[j]] = [shuffledRemaining[j], shuffledRemaining[i]];
    }
    
    const additionalAssassins = shuffledRemaining.slice(0, 3 - agentsAsAssassins.length);
    
    const player2Assassins = [...agentsAsAssassins, ...additionalAssassins];
    
    return {
      player1: {
        agents: player1Agents,
        assassins: player1Assassins
      },
      player2: {
        agents: player2Agents,
        assassins: player2Assassins
      }
    };
  };
  
  const applyKeyCardToBoard = (board, keyCard) => {
    return board.map((card, index) => {
      const p1Type = keyCard.player1.agents.includes(index) 
        ? 'agent' 
        : keyCard.player1.assassins.includes(index) 
          ? 'assassin' 
          : 'bystander';
          
      const p2Type = keyCard.player2.agents.includes(index) 
        ? 'agent' 
        : keyCard.player2.assassins.includes(index) 
          ? 'assassin' 
          : 'bystander';
      
      return {
        ...card,
        player1Type: p1Type,
        player2Type: p2Type,
        type: 'neutral' // Will be updated based on playerView when revealed
      };
    });
  };
  
  const handleCardClick = (cardId) => {
    if (gameState !== 'playing') return;
    
    // Prevent rapid clicks or duplicate click processing
    const now = Date.now();
    if (isProcessingClick.current && now - processingTimestamp.current < 500) return;
    if (lastClickedId.current === cardId && now - processingTimestamp.current < 1000) return;
    
    isProcessingClick.current = true;
    lastClickedId.current = cardId;
    processingTimestamp.current = now;
    
    setBoard(prev => {
      const newBoard = [...prev];
      const card = newBoard[cardId];
      
      if (card.revealed) {
        isProcessingClick.current = false;
        return newBoard;
      }
      
      // Determine the card type based on current player's view
      const cardType = playerInfo.playerRole === 'player1' 
        ? card.player1Type 
        : card.player2Type;
      
      // Update the card
      newBoard[cardId] = {
        ...card,
        revealed: true,
        type: cardType
      };
      
      // Update game state based on revealed card
      if (cardType === 'assassin') {
        setGameState('lost');
      } else if (cardType === 'agent') {
        // Count ALL revealed agents for both players, without double-counting
        const uniqueRevealedAgentIds = new Set();
        
        // Add all revealed player1 agents to the set
        newBoard.forEach(c => {
          if (c.revealed && c.player1Type === 'agent') {
            uniqueRevealedAgentIds.add(c.id);
          }
        });
        
        // Add all revealed player2 agents to the set
        newBoard.forEach(c => {
          if (c.revealed && c.player2Type === 'agent') {
            uniqueRevealedAgentIds.add(c.id);
          }
        });
        
        const totalRevealedAgents = uniqueRevealedAgentIds.size;
        
        // Update the agents found counter for display
        setAgents(prev => ({ ...prev, found: totalRevealedAgents }));
        
        // Check win condition
        if (totalRevealedAgents >= 9) {
          setGameState('won');
        }
      } else if (cardType === 'bystander') {
        // Use a fixed, explicit new token value to avoid stacking updates
        const newTokenValue = timerTokens - 2; // Reduce by 2 for bystander
        console.log(`Bystander clicked. Tokens: ${timerTokens} -> ${newTokenValue}`);
        
        // Set the absolute value instead of using a function update
        setTimerTokens(newTokenValue > 0 ? newTokenValue : 0);
        
        if (newTokenValue <= 0) {
          setGameState('lost');
        }
      }
      
      // Reset processing flag after a longer delay
      setTimeout(() => {
        isProcessingClick.current = false;
      }, 300);
      
      return newBoard;
    });
  };
  
  const toggleKeyCard = () => {
    setShowKeyCard(prev => !prev);
  };
  
  const resetGame = () => {
    if (playerInfo && playerInfo.gameCode) {
      initializeGame(playerInfo.gameCode);
    }
  };
  
  const startNewGame = () => {
    // Clear saved game state
    localStorage.removeItem('codenames_duet_player_info');
    setGameStarted(false);
    navigate('/codenames-duet', { replace: true });
  };

  if (!gameStarted) {
    return <PlayerSelection onStart={handleStartGame} />;
  }

  return (
    <div className="codenames-duet-game">
      {gameState === 'won' && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={true}
          numberOfPieces={500}
          gravity={0.1}
        />
      )}
      
      <CodenamesDuetControls 
        playerName={playerInfo.playerName}
        playerRole={playerInfo.playerRole}
        timerTokens={timerTokens}
        gameState={gameState}
        agents={agents}
        resetGame={resetGame}
        toggleKeyCard={toggleKeyCard}
        showKeyCard={showKeyCard}
        gameCode={playerInfo.gameCode}
      />
      
      <CodenamesDuetBoard 
        board={board}
        onCardClick={handleCardClick}
        playerView={playerInfo.playerRole}
        keyCard={keyCard}
        showKeyCard={showKeyCard}
        gameState={gameState}
      />
      
      {gameState === 'won' && (
        <div className="game-result win">
          <h2>🎉 Victory! 🎉</h2>
          <p>You found all the agents!</p>
          <div className="game-result-actions">
            <button onClick={resetGame}>Play Again</button>
            <button onClick={startNewGame} className="new-game-btn">New Game</button>
          </div>
        </div>
      )}
      
      {gameState === 'lost' && (
        <div className="game-result lose">
          <h2>Game Over</h2>
          <p>
            {timerTokens <= 0 
              ? "You ran out of time!" 
              : "You contacted an assassin!"}
          </p>
          <div className="game-result-actions">
            <button onClick={resetGame}>Try Again</button>
            <button onClick={startNewGame} className="new-game-btn">New Game</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodenamesDuetGame; 