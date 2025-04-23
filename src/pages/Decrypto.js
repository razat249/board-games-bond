import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ReactComponent as DecryptoIcon } from '../images/decrypto.svg';
import DecryptoGame from '../components/decrypto/DecryptoGame';
import './Decrypto.css';

function Decrypto() {
  const [gameStarted, setGameStarted] = useState(false);
  const { gameCode } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Change body background when component mounts
    document.body.classList.add('decrypto-body');
    
    // Cleanup function to remove the class when component unmounts
    return () => {
      document.body.classList.remove('decrypto-body');
    };
  }, []);
  
  // If we have a game code in the URL, start the game immediately
  useEffect(() => {
    if (gameCode) {
      setGameStarted(true);
    }
  }, [gameCode]);
  
  const handleStartGame = () => {
    // Generate a random 4-digit code if none exists
    if (!gameCode) {
      const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
      navigate(`/decrypto/${randomCode}`);
    } else {
      setGameStarted(true);
    }
  };

  return (
    <div className="decrypto-page">

      
      {!gameStarted ? (
        <div className="decrypto-content">
          <section className="decrypto-info-section">
            <h2>HOW TO PLAY</h2>
            <p>
              Decrypto is a team-based game of code-breaking and communications where players attempt to transmit coded messages to their teammates without letting the opposing team intercept them.
            </p>
            <p>
              Each team has their own screen with four words, numbered 1-4, visible only to them. The clue giver must help their teammates guess a sequence of three numbers by giving three clues that relate to their team's words.
            </p>
            <p>
              Meanwhile, the opposing team will be trying to figure out the other team's secret words by watching what clues are given for which sequences.
            </p>
            <p>
              The first team to intercept two communications or the first team to get two miscommunications loses the game.
            </p>
          </section>
          
          <section className="decrypto-action">
            <button className="decrypto-action-button" onClick={handleStartGame}>
              START MISSION
            </button>
          </section>
        </div>
      ) : (
        <DecryptoGame />
      )}
    </div>
  );
}

export default Decrypto; 