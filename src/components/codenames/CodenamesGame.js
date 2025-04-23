import React, { useState, useEffect } from 'react';
import CodenamesBoard from './CodenamesBoard';
import GameControls from './GameControls';
import './Codenames.css';

const WORD_LIST = [
  'AFRICA', 'AGENT', 'AIR', 'ALIEN', 'AMAZON', 'ANGEL', 'ANTARCTICA', 'APPLE',
  'ARM', 'BACK', 'BAND', 'BANK', 'BARK', 'BAT', 'BATTERY', 'BEACH', 'BEAR',
  'BEAT', 'BED', 'BEIJING', 'BELL', 'BELT', 'BERLIN', 'BERMUDA', 'BERRY',
  'BILL', 'BLOCK', 'BOARD', 'BOLT', 'BOMB', 'BOND', 'BOOM', 'BOOT',
  'BOTTLE', 'BOW', 'BOX', 'BRIDGE', 'BRUSH', 'BUCK', 'BUFFALO', 'BUG',
  'BUGLE', 'BUTTON', 'CALF', 'CANADA', 'CAP', 'CAPITAL', 'CAR', 'CARD',
  'CARROT', 'CASINO', 'CAST', 'CAT', 'CELL', 'CENTAUR', 'CENTER', 'CHAIR',
  'CHANGE', 'CHARGE', 'CHECK', 'CHEST', 'CHICK', 'CHINA', 'CHOCOLATE',
  'CHURCH', 'CIRCLE', 'CLIFF', 'CLOAK', 'CLUB', 'CODE', 'COLD', 'COMIC',
  'COMPOUND', 'CONCERT', 'CONDUCTOR', 'CONTRACT', 'COOK', 'COPPER', 'COTTON',
  'COURT', 'COVER', 'CRANE', 'CRASH', 'CRICKET', 'CROSS', 'CROWN', 'CYCLE',
  'CZECH', 'DANCE', 'DATE', 'DAY', 'DEATH', 'DECK', 'DEGREE', 'DIAMOND',
  'DICE', 'DINOSAUR', 'DISEASE', 'DOCTOR', 'DOG', 'DRAFT', 'DRAGON', 'DRESS',
  'DRILL', 'DROP', 'DUCK', 'DWARF', 'EAGLE', 'EGYPT', 'EMBASSY', 'ENGINE',
  'ENGLAND', 'EUROPE', 'EYE', 'FACE', 'FAIR', 'FALL', 'FAN', 'FENCE',
  'FIELD', 'FIGHTER', 'FIGURE', 'FILE', 'FILM', 'FIRE', 'FISH', 'FLUTE',
  'FLY', 'FOOT', 'FORCE', 'FOREST', 'FORK', 'FRANCE', 'GAME', 'GAS',
  'GENIUS', 'GERMANY', 'GHOST', 'GIANT', 'GLASS', 'GLOVE', 'GOLD', 'GRACE',
  'GRASS', 'GREECE', 'GREEN', 'GROUND', 'HAM', 'HAND', 'HAWK', 'HEAD',
  'HEART', 'HELICOPTER', 'HIMALAYAS', 'HOLE', 'HOLLYWOOD', 'HONEY', 'HOOD',
  'HOOK', 'HORN', 'HORSE', 'HORSESHOE', 'HOSPITAL', 'HOTEL', 'ICE', 'ICE CREAM',
  'INDIA', 'IRON', 'IVORY', 'JACK', 'JAM', 'JET', 'JUPITER', 'KANGAROO',
  'KETCHUP', 'KEY', 'KID', 'KING', 'KIWI', 'KNIFE', 'KNIGHT', 'LAB', 'LAP',
  'LASER', 'LAWYER', 'LEAD', 'LEMON', 'LEPRECHAUN', 'LIFE', 'LIGHT',
  'LIMOUSINE', 'LINE', 'LINK', 'LION', 'LITTER', 'LOCH NESS', 'LOCK', 'LOG',
  'LONDON', 'LUCK', 'MAIL', 'MAMMOTH', 'MAPLE', 'MARBLE', 'MARCH', 'MASS',
  'MATCH', 'MERCURY', 'MEXICO', 'MICROSCOPE', 'MILLIONAIRE', 'MINE', 'MINT',
  'MISSILE', 'MODEL', 'MOLE', 'MOON', 'MOSCOW', 'MOUNT', 'MOUSE', 'MOUTH',
  'MUG', 'NAIL', 'NEEDLE', 'NET', 'NEW YORK', 'NIGHT', 'NINJA', 'NOTE',
  'NOVEL', 'NURSE', 'NUT', 'OCTOPUS', 'OIL', 'OLIVE', 'OLYMPUS', 'OPERA',
  'ORANGE', 'ORGAN', 'PALM', 'PAN', 'PANDA', 'PAPER', 'PARACHUTE', 'PARK',
  'PART', 'PASS', 'PASTE', 'PENGUIN', 'PHOENIX', 'PIANO', 'PIE', 'PILOT',
  'PIN', 'PIPE', 'PIRATE', 'PISTOL', 'PIT', 'PITCH', 'PLANE', 'PLASTIC',
  'PLATE', 'PLATYPUS', 'PLAY', 'PLOT', 'POINT', 'POISON', 'POLE', 'POLICE',
  'POOL', 'PORT', 'POST', 'POUND', 'PRESS', 'PRINCESS', 'PUMPKIN', 'PUPIL',
  'PYRAMID', 'QUEEN', 'RABBIT', 'RACKET', 'RAY', 'REVOLUTION', 'RING', 'ROBIN',
  'ROBOT', 'ROCK', 'ROME', 'ROOT', 'ROSE', 'ROULETTE', 'ROUND', 'ROW', 'RULER',
  'SATELLITE', 'SATURN', 'SCALE', 'SCHOOL', 'SCIENTIST', 'SCORPION', 'SCREEN',
  'SCUBA DIVER', 'SEAL', 'SERVER', 'SHADOW', 'SHAKESPEARE', 'SHARK', 'SHIP',
  'SHOE', 'SHOP', 'SHOT', 'SINK', 'SKYSCRAPER', 'SLIP', 'SLUG', 'SMUGGLER',
  'SNOW', 'SNOWMAN', 'SOCK', 'SOLDIER', 'SOUL', 'SOUND', 'SPACE', 'SPELL',
  'SPIDER', 'SPIKE', 'SPINE', 'SPOT', 'SPRING', 'SPY', 'SQUARE', 'STADIUM',
  'STAFF', 'STAR', 'STATE', 'STICK', 'STOCK', 'STRAW', 'STREAM', 'STRIKE',
  'STRING', 'SUB', 'SUIT', 'SUPERHERO', 'SWING', 'SWITCH', 'TABLE', 'TABLET',
  'TAG', 'TAIL', 'TAP', 'TEACHER', 'TELESCOPE', 'TEMPLE', 'THEATER', 'THIEF',
  'THUMB', 'TICK', 'TIE', 'TIME', 'TOKYO', 'TOOTH', 'TORCH', 'TOWER', 'TRACK',
  'TRAIN', 'TRIANGLE', 'TRIP', 'TRUNK', 'TUBE', 'TURKEY', 'UNDERTAKER',
  'UNICORN', 'VACUUM', 'VAN', 'VET', 'WAKE', 'WALL', 'WAR', 'WASHER',
  'WASHINGTON', 'WATCH', 'WATER', 'WAVE', 'WEB', 'WELL', 'WHALE', 'WHIP',
  'WIND', 'WITCH', 'WORM', 'YARD', 'ZOO'
];

// Seeded random number generator
class SeededRandom {
  constructor(seed) {
    this.seed = this.hash(seed || Math.random().toString());
  }

  // Simple hash function to convert string to numeric seed
  hash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

  // Get next random value
  next() {
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }

  // Get random integer between min and max (inclusive)
  nextInt(min, max) {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  // Shuffle array using Fisher-Yates algorithm with our seeded random
  shuffle(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}

const CodenamesGame = ({ gameCode: initialGameCode }) => {
  const [gameState, setGameState] = useState({
    board: [],
    redTurn: true,
    gameOver: false,
    winner: null
  });
  
  const [gameCode, setGameCode] = useState(initialGameCode);
  const [showSolution, setShowSolution] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [playerRole, setPlayerRole] = useState(null); // 'spymaster' or 'agent'

  useEffect(() => {
    if (initialGameCode) {
      setGameCode(initialGameCode);
      initializeGame(initialGameCode);
    } else {
      const newCode = generateGameCode();
      setGameCode(newCode);
      initializeGame(newCode);
    }
  }, [initialGameCode]);

  // Generate a random 4-digit game code
  const generateGameCode = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const handleNewGame = () => {
    const newCode = generateGameCode();
    setGameCode(newCode);
    
    // Update the URL without reloading the page
    const url = new URL(window.location.href);
    const pathParts = url.pathname.split('/');
    
    // If we're on the codenames path already
    if (pathParts.includes('codenames')) {
      // Replace the last part with the new code or add it if not present
      if (pathParts[pathParts.length - 1] === 'codenames') {
        pathParts.push(newCode);
      } else {
        pathParts[pathParts.length - 1] = newCode;
      }
      
      const newPath = pathParts.join('/');
      window.history.pushState({}, '', `${url.origin}${newPath}${url.search}`);
    }
    
    initializeGame(newCode);
    setGameStarted(false); // Reset game started state
    setPlayerRole(null); // Reset player role
  };

  const initializeGame = (code = null) => {
    // Create seeded random generator
    const random = new SeededRandom(code);
    
    // Select 25 random words using seeded random
    const shuffledWords = random.shuffle([...WORD_LIST]).slice(0, 25);
    
    // Create card types (9 red, 8 blue, 7 neutral, 1 assassin)
    // Red always has more cards and goes first
    let cardTypes = [
      ...Array(9).fill('red'),
      ...Array(8).fill('blue'),
      ...Array(7).fill('neutral'),
      ...Array(1).fill('assassin')
    ];
    
    // Shuffle card types with seeded random
    cardTypes = random.shuffle(cardTypes);
    
    // Create board
    const board = shuffledWords.map((word, index) => ({
      word,
      type: cardTypes[index],
      revealed: false,
      id: index
    }));
    
    setGameState({
      board,
      redTurn: true, // Red team always starts
      gameOver: false,
      winner: null
    });
    
    // Set solution visibility based on role
    setShowSolution(playerRole === 'spymaster');
  };

  const handleCardClick = (cardId) => {
    if (gameState.gameOver) return;
    
    // Immediately reveal the card in the UI for instant feedback
    const newBoard = [...gameState.board];
    const clickedCard = newBoard[cardId];
    
    // If card is already revealed, do nothing
    if (clickedCard.revealed) return;
    
    // Reveal the card
    clickedCard.revealed = true;
    
    // Check win/lose conditions
    let gameOver = gameState.gameOver;
    let winner = gameState.winner;
    let redTurn = gameState.redTurn;
    
    // Assassin = game over
    if (clickedCard.type === 'assassin') {
      gameOver = true;
      winner = redTurn ? 'blue' : 'red';
    } 
    // Check if all red or blue cards are revealed
    else {
      const redCardsLeft = newBoard.filter(card => card.type === 'red' && !card.revealed).length;
      const blueCardsLeft = newBoard.filter(card => card.type === 'blue' && !card.revealed).length;
      
      if (redCardsLeft === 0) {
        gameOver = true;
        winner = 'red';
      } else if (blueCardsLeft === 0) {
        gameOver = true;
        winner = 'blue';
      }
    }
    
    // Switch turns if the revealed card isn't of the current team's color
    if (!gameOver && clickedCard.type !== (redTurn ? 'red' : 'blue')) {
      redTurn = !redTurn;
    }
    
    // Update state once with all changes
    setGameState({
      board: newBoard,
      redTurn,
      gameOver,
      winner
    });
  };

  const handleEndTurn = () => {
    if (gameState.gameOver) return;

    // Switch to the other team's turn
    setGameState(prevState => ({
      ...prevState,
      redTurn: !prevState.redTurn
    }));
  };

  const selectRole = (role) => {
    setPlayerRole(role);
    // Only spymasters can see the solution
    setShowSolution(role === 'spymaster');
    setGameStarted(true);
  };

  // Render role selection screen if game hasn't started
  if (!gameStarted) {
    return (
      <div className="codenames-role-selection">
        <h2>Choose Your Role</h2>
        <div className="role-buttons">
          <button 
            className="role-btn spymaster-btn" 
            onClick={() => selectRole('spymaster')}
          >
            Spymaster
            <span className="role-description">You'll see all card colors and help your team guess correctly</span>
          </button>
          <button 
            className="role-btn agent-btn" 
            onClick={() => selectRole('agent')}
          >
            Agent
            <span className="role-description">You'll try to guess which cards belong to your team</span>
          </button>
        </div>
        <div className="game-code-info">
          <p>Game Code: <strong>{gameCode}</strong></p>
          <p>Share this code with others to play the same board</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`codenames-game ${showSolution ? 'spymaster-mode' : ''}`}>
      <GameControls 
        redTurn={gameState.redTurn}
        gameOver={gameState.gameOver}
        winner={gameState.winner}
        onNewGame={handleNewGame}
        onEndTurn={handleEndTurn}
        showSolution={showSolution}
        gameCode={gameCode}
        playerRole={playerRole}
      />
      <CodenamesBoard 
        board={gameState.board}
        onCardClick={handleCardClick}
        showSolution={showSolution}
      />
    </div>
  );
};

export default CodenamesGame; 