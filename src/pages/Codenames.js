import { Link, useParams, useNavigate } from 'react-router-dom';
import { ReactComponent as CodenamesIcon } from '../images/codenames.svg';
import CodenamesGame from '../components/codenames/CodenamesGame';
import { useState, useEffect } from 'react';

function Codenames() {
  const [gameStarted, setGameStarted] = useState(false);
  const { gameCode } = useParams();
  const navigate = useNavigate();

  // If we have a game code in the URL, start the game immediately
  useEffect(() => {
    if (gameCode) {
      setGameStarted(true);
    }
  }, [gameCode]);

  const handleNewGame = () => {
    // Generate a random 4-digit code if none exists
    if (!gameCode) {
      const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
      navigate(`/codenames/${randomCode}`);
    } else {
      setGameStarted(true);
    }
  };

  const handleBackToInstructions = () => {
    if (gameCode) {
      navigate('/codenames');
    } else {
      setGameStarted(false);
    }
  };

  return (
    <div className="game-page">
      <div className="game-header">
        <Link to="/" className="back-link">
          ← Back to Games
        </Link>
        <div className="game-title">
          <h1>Codenames</h1>
        </div>
      </div>
      
      <div className="game-content">
        {!gameStarted ? (
          <>
            <section className="game-info-section">
              <h2>How to Play</h2>
              <p>
                Codenames is a game of guessing which code names (words) in a set are related to a hint-word given by another player.
              </p>
              <p>
                Players split into two teams: red and blue. One player of each team is selected as the team's spymaster; the others are field operatives.
              </p>
              <p>
                Twenty-five code name cards are laid out in a 5×5 grid. A number of these words represent red agents, a number represent blue agents, one represents an assassin, and the others represent innocent bystanders.
              </p>
              <p>
                The teams' spymasters know which words represent which cards and take turns giving one-word clues. Each clue may relate to multiple words on the board. The field operatives attempt to guess which words their spymaster meant.
              </p>
            </section>
            
            <section className="game-action">
              <button 
                className="action-button"
                onClick={handleNewGame}
              >
                Start Game
              </button>
            </section>
          </>
        ) : (
          <>
            <div className="game-navigation">
              <button 
                className="back-to-instructions"
                onClick={handleBackToInstructions}
              >
                Back to Instructions
              </button>
              {gameCode && (
                <div className="share-code">
                  <p>Share this game: <strong>{window.location.href}</strong></p>
                </div>
              )}
            </div>
            <CodenamesGame gameCode={gameCode} />
          </>
        )}
      </div>
    </div>
  );
}

export default Codenames; 