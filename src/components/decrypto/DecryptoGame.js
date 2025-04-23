import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TeamBoard from './TeamBoard';
import GameControls from './GameControls';
import CodeCardGenerator from './CodeCardGenerator';
import ClueTracker from './ClueTracker';
import './DecryptoGame.css';

const DecryptoGame = () => {
  const { gameCode: urlGameCode } = useParams();
  const navigate = useNavigate();
  
  // Generate a random 4-digit code
  const generateGameCode = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const [gameState, setGameState] = useState({
    round: 1,
    phase: 'setup', // setup, team1Encrypt, team1Guess, team2Encrypt, team2Guess, roundEnd
    currentTeam: 1,
    team1Name: 'Team 1',
    team2Name: 'Team 2',
    gameCode: urlGameCode || generateGameCode(),
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
  
  // Update URL when game code changes
  useEffect(() => {
    if (gameState.gameCode && !urlGameCode) {
      navigate(`/decrypto/${gameState.gameCode}`, { replace: true });
    }
  }, [gameState.gameCode, navigate, urlGameCode]);

  // Use game code as seed for random generation to ensure consistency
  const getSeededRandom = (seed) => {
    const x = Math.sin(parseInt(seed)) * 10000;
    return x - Math.floor(x);
  };
  
  // Generate code using the game code as seed
  const generateCode = (seed = gameState.gameCode, index = 0) => {
    let code = [];
    for (let i = 0; i < 3; i++) {
      // Use different parts of the seed for each number
      const seedVal = parseInt(seed) + (i * 10) + (index * 100);
      code.push(Math.floor(getSeededRandom(seedVal) * 4) + 1);
    }
    return code;
  };
  
  // Generate random words using the game code as seed
  const generateRandomWords = (seed = gameState.gameCode, teamNum = 1) => {
    // Word bank for auto-generation
    const WORD_BANK = [
      "AGENT", "CODE", "SIGNAL", "CIPHER", "SECRET", "MISSION", "INTEL", "SECURE", 
      "ASSET", "SHADOW", "ENIGMA", "BREACH", "COVER", "HIDDEN", "TARGET", "SYSTEM",
      "DECODE", "ENCRYPT", "ACCESS", "KEY", "FILE", "NETWORK", "PROTOCOL", "DEVICE",
      "RADIO", "COMMAND", "SHIELD", "VECTOR", "STEALTH", "TACTICAL", "DEFENSE", "WIRE",
      "ORIGIN", "SOURCE", "TRACE", "DATA", "BACKUP", "MATRIX", "NODE", "EXTRACT", 
      "OMEGA", "ALPHA", "BEACON", "ECHO", "FOXTROT", "GAMMA", "HOTEL", "INDIA",
      "APPLE", "BOOK", "CHAIR", "DOOR", "EARTH", "FISH", "GLASS", "HOUSE", "ICE", "JUMP",
      "KITE", "LAMP", "MOON", "NEST", "OCEAN", "PAPER", "QUEEN", "RIVER", "STAR", "TIME",
      "UNCLE", "VOICE", "WATCH", "XRAY", "YELLOW", "ZEBRA", "BALL", "CAT", "DOG", "EGG",
      "FLOWER", "GARDEN", "HAT", "ISLAND", "JUICE", "KING", "LION", "MONEY", "NIGHT", "ORANGE",
      "PENCIL", "QUIET", "ROAD", "SUN", "TABLE", "UMBRELLA", "VIOLIN", "WATER", "BOX", "YARD",
      "CLOUD", "DREAM", "FACE", "GOLD", "HEART", "INSECT", "JAR", "KEY", "LEAF", "MILK",
      "NORTH", "OWL", "PARK", "QUILT", "RAIN", "SOUTH", "TRAIN", "UP", "VASE", "WHEEL",
      "YEAR", "BABY", "CAKE", "DESK", "EAR", "FIRE", "GRASS", "HAND", "INK", "JAM",
      "KNIFE", "LAKE", "MAP", "NAIL", "OIL", "PLANT", "QUEEN", "RING", "SHIP", "TREE",
      "WINDOW", "BREAD", "CHEESE", "DOOR", "EYE", "FLAG", "GOAT", "HORSE", "IRON",
      "ANT", "AIR", "ARM", "AXE", "BAG", "BEE", "BED", "BELL", "BIRD", "BOAT",
      "BONE", "BOOT", "BOWL", "BUS", "CANDY", "CARD", "CLOCK", "COIN", "CORN", "COW",
      "CRAB", "CROW", "CUP", "DEER", "DISH", "DOLL", "DUCK", "DUST", "FAN", "FARM",
      "FEET", "FROG", "GAME", "GATE", "GIFT", "GIRL", "GRAPE", "GUN", "HAIR", "HALL",
      "HAMMER", "HILL", "HOME", "HOOK", "HORN", "HOSE", "JAIL", "JEEP", "JELLY", "JOKE",
      "KETTLE", "KIWI", "KNEE", "KNOT", "LACE", "LADY", "LEAF", "LEG", "LEMON", "LIME",
      "LIP", "LOCK", "LOG", "MAIL", "MASK", "MEAT", "MICE", "MIST", "MOP", "MOTH",
      "MOUTH", "MUD", "MULE", "NAME", "NECK", "NOSE", "NUT", "OAR", "OATS", "ONION",
      "OVEN", "OX", "PAD", "PAGE", "PAIL", "PAIN", "PAINT", "PAN", "PATH", "PEA",
      "PEACH", "PEAR", "PEN", "PENNY", "PET", "PIANO", "PIG", "PIN", "PINE", "PIPE",
      "PIT", "PLAY", "PLUM", "POLE", "POND", "PONY", "POOL", "PORCH", "POT", "POTATO",
      "PUFF", "PUMP", "PUPPY", "PURSE", "RABBIT", "RAT", "RICE", "RIDE", "ROCK", "ROOF",
      "ROOM", "ROPE", "ROSE", "RUG", "RUST", "SACK", "SAIL", "SALT", "SAND", "SAW",
      "SCALE", "SCARF", "SCHOOL", "SEED", "SHAPE", "SHELL", "SHOP", "SHORE", "SIGN", "SILK",
      "SINK", "SKIN", "SKIRT", "SKY", "SLED", "SLEEP", "SLIDE", "SMILE", "SMOKE", "SNAKE",
      "SNOW", "SOAP", "SOCK", "SODA", "SOFA", "SOIL", "SONG", "SOUP", "SPACE", "SPADE",
      "SPONGE", "SPOON", "SPOT", "SPRING", "STAMP", "STICK", "STONE", "STOOL", "STORE", "STORM",
      "STORY", "STOVE", "STRAW", "STREET", "STRING", "SUGAR", "SUIT", "SUMMER", "SWING", "SYRUP",
      "TAIL", "TEA", "TEAM", "TENT", "THREAD", "THUMB", "TIGER", "TIRE", "TOAST", "TOE",
      "TONGUE", "TOOTH", "TOP", "TOWEL", "TOY", "TRASH", "TRAY", "TRIP", "TRUCK", "TUB",
      "TURKEY", "TWIG", "TWIN", "VAN", "VEST", "VIEW", "VINE", "WASP", "WAX", "WEB",
      "WEED", "WELL", "WHALE", "WHIP", "WIND", "WING", "WISH", "WOLF", "WOOL", "WORM",
      "WRIST", "YACHT", "YOLK", "ZEBRA", "ZIPPER", "ZOO", "ANCHOR", "ANGLE", "ARCH", "ARROW",
      "AX", "BALANCE", "BARREL", "BASIN", "BASKET", "BATH", "BEACH", "BEAR", "BEAST", "BEETLE",
      "BEGGAR", "BERRY", "BRIDLE", "BROOM", "BUCKET", "BULB", "BUTTON", "CACTUS", "CAMEL", "CANDLE",
      "CANNON", "CANYON", "CAVE", "CHALK", "CHERRY", "CHEST", "CLIFF", "COTTON", "CRAYON", "CRICKET",
      "CRYSTAL", "DIAMOND", "DONKEY", "DRAGON", "EAGLE", "ELBOW", "ENGINE", "FEATHER", "FINGER", "FLAME",
      "FLOOD", "FOREST", "FORK", "FOX", "FUDGE", "GLOVE", "GRAVEL", "HONEY", "HORSE", "IGLOO",
      "JEWEL", "LADDER", "LANTERN", "LAVA", "LEATHER", "LETTER", "LEVEL", "MARKET", "MEDAL", "MELON",
      "METAL", "MONKEY", "MOSS", "MOTOR", "MOUND", "MOUSE", "MUSCLE", "NAPKIN", "NEEDLE", "NEST",
      "NEWT", "NOVEL", "OPAL", "PADDLE", "PEARL", "PEBBLE", "PEDAL", "PEPPER", "PICKLE", "PILLOW",
      "PIZZA", "PLANET", "POCKET", "PUMPKIN", "PUZZLE", "PYTHON", "QUARTZ", "RACCOON", "RADAR", "RADISH",
      "RIBBON", "RIDDLE", "ROCKET", "SADDLE", "SALMON", "SCISSORS", "SCOOTER", "SHADOW", "SHARK", "SHEEP"
    ];
    
    // Create a copy of the word bank to avoid duplicates
    const availableWords = [...WORD_BANK];
    const randomWords = [];
    
    // Add team number to seed to get different words for each team
    const teamSeed = parseInt(seed) + (teamNum * 1000);
    
    for (let i = 0; i < 4; i++) {
      // Get a seeded random index
      const seedVal = teamSeed + (i * 10);
      const randomIndex = Math.floor(getSeededRandom(seedVal) * availableWords.length);
      randomWords.push(availableWords[randomIndex]);
      availableWords.splice(randomIndex, 1);
    }
    
    return randomWords;
  };

  const [showControls, setShowControls] = useState(false);
  const [showCodeGenerator, setShowCodeGenerator] = useState(true);
  const [showClueTracker, setShowClueTracker] = useState(true);
  // New state for collapsible sections
  const [collapsibleState, setCollapsibleState] = useState({
    teamBoard: true,
    clueTracker: false,
    codeGenerator: true,
    controls: true
  });

  const toggleSection = (section) => {
    setCollapsibleState(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const startGame = (team1Words, team2Words, team1Name, team2Name) => {
    // If no words provided, generate them based on game code
    const finalTeam1Words = team1Words || generateRandomWords(gameState.gameCode, 1);
    const finalTeam2Words = team2Words || generateRandomWords(gameState.gameCode, 2);
    
    setGameState(prev => {
      return {
        ...prev,
        phase: 'team1Encrypt',
        team1Name: team1Name || 'Team 1',
        team2Name: team2Name || 'Team 2',
        team1: {
          ...prev.team1,
          words: finalTeam1Words,
          codes: [...prev.team1.codes, generateCode(prev.gameCode, prev.round)]
        },
        team2: {
          ...prev.team2,
          words: finalTeam2Words,
          codes: [...prev.team2.codes, generateCode(prev.gameCode, prev.round + 100)]
        }
      };
    });
  };
  
  const joinGame = (gameCode, teamName, isTeam2 = true) => {
    // Navigate to the game URL
    navigate(`/decrypto/${gameCode}`, { replace: true });
    
    // Generate team words using the provided game code as seed
    const team1Words = generateRandomWords(gameCode, 1);
    const team2Words = generateRandomWords(gameCode, 2);
    
    // Generate codes for both teams using the game code
    const team1Code = generateCode(gameCode, 1);
    const team2Code = generateCode(gameCode, 101); // Add offset for team 2
    
    setGameState(prev => ({
      ...prev,
      phase: 'team1Encrypt',
      team1Name: isTeam2 ? prev.team1Name : teamName,
      team2Name: isTeam2 ? teamName : prev.team2Name,
      isTeam2: isTeam2,
      gameCode: gameCode,
      team1: {
        ...prev.team1,
        words: team1Words,
        codes: [team1Code],
        guesses: []
      },
      team2: {
        ...prev.team2,
        words: team2Words,
        codes: [team2Code],
        guesses: []
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
        codes: [...prev.team1.codes, generateCode(prev.gameCode, prev.round)]
      },
      team2: {
        ...prev.team2,
        codes: [...prev.team2.codes, generateCode(prev.gameCode, prev.round + 100)]
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

  // Share game URL function
  const shareGameUrl = () => {
    const gameUrl = window.location.href;
    
    // Try to use the clipboard API if available
    if (navigator.clipboard) {
      navigator.clipboard.writeText(gameUrl)
        .then(() => {
          alert('Game URL copied to clipboard! Share it with your team members.');
        })
        .catch(err => {
          // Fallback for clipboard failure
          prompt('Copy this URL to share with your team:', gameUrl);
        });
    } else {
      // Fallback for browsers without clipboard API
      prompt('Copy this URL to share with your team:', gameUrl);
    }
  };

  return (
    <div className="decrypto-game">
      {gameState.phase === 'setup' ? (
        <div className="setup-phase">
          <div className="game-code-container">
            <h3>GAME CODE</h3>
            <div className="game-code-display">{gameState.gameCode}</div>
            <p className="game-code-instructions">
              {urlGameCode 
                ? "You're joining an existing game. Choose your team below."
                : "Share this code with the other team. They should enter it on their device."}
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
            hasUrlGameCode={Boolean(urlGameCode)}
          />
        </div>
      ) : (
        <>
          <div className="game-status-bar">
            <div className="game-info">
              <span className="game-code-label">GAME CODE: {gameState.gameCode}</span>
            </div>
            <div className="game-buttons">
              <button 
                className="share-game-button"
                onClick={shareGameUrl}
              >
                Share Game URL
              </button>

            </div>
          </div>
          
          <div className="game-layout">
            <div className="upper-section">
              <div className={`team-board-container collapsible-section ${collapsibleState.teamBoard ? 'section-expanded' : 'section-collapsed'}`}>
                <div className="section-header" onClick={() => toggleSection('teamBoard')}>
                  <h3>Team board</h3>
                  <span className="collapse-icon">{collapsibleState.teamBoard ? '−' : '+'}</span>
                </div>
                {collapsibleState.teamBoard && (
                  <div className="section-content">
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
                )}
              </div>
              
              <div className={`clue-tracker-container collapsible-section ${collapsibleState.clueTracker ? 'section-expanded' : 'section-collapsed'}`}>
                <div className="section-header" onClick={() => toggleSection('clueTracker')}>
                  <h3>Clue tracker</h3>
                  <span className="collapse-icon">{collapsibleState.clueTracker ? '−' : '+'}</span>
                </div>
                {collapsibleState.clueTracker && (
                  <div className="section-content">
                    <ClueTracker 
                      teamData={teamToShow === 1 ? gameState.team1 : gameState.team2}
                      opponentTeamData={teamToShow === 1 ? gameState.team2 : gameState.team1}
                      teamNumber={teamToShow}
                      teamName={teamToShow === 1 ? gameState.team1Name : gameState.team2Name}
                      opponentTeamName={teamToShow === 1 ? gameState.team2Name : gameState.team1Name}
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="lower-section">
              <div className={`code-generator-container collapsible-section ${collapsibleState.codeGenerator ? 'section-expanded' : 'section-collapsed'}`}>
                <div className="section-header" onClick={() => toggleSection('codeGenerator')}>
                  <h3>Code generator</h3>
                  <span className="collapse-icon">{collapsibleState.codeGenerator ? '−' : '+'}</span>
                </div>
                {collapsibleState.codeGenerator && (
                  <div className="section-content">
                    <CodeCardGenerator />
                  </div>
                )}
              </div>
\
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DecryptoGame; 