import { useNavigate, useLocation } from 'react-router-dom';
import CodenamesDuetGame from '../components/codenames-duet/CodenamesDuetGame';

function CodenamesDuet() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBackToHome = () => {
    if (window.confirm('Are you sure you want to leave the game?')) {
      navigate('/');
    }
  };
  
  // Extract the game code from URL if present
  const searchParams = new URLSearchParams(location.search);
  const gameCode = searchParams.get('game');

  return (
    <div className="game-page">
      <div className="game-header">
        <button onClick={handleBackToHome} className="back-link">
          ← Back to Games
        </button>
        <div className="game-title">
          <h1>Codenames Duet</h1>
          {gameCode && <div className="game-code-header">Game Code: {gameCode}</div>}
        </div>
      </div>
      
      <div className="game-content">
        <CodenamesDuetGame />
      </div>
    </div>
  );
}

export default CodenamesDuet; 