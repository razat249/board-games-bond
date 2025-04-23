import { Link } from 'react-router-dom';
import { ReactComponent as ChessIcon } from '../images/chess.svg';

function Chess() {
  return (
    <div className="game-page">
      <div className="game-header">
        <Link to="/" className="back-link">
          ← Back to Games
        </Link>
        <div className="game-title">
          <div className="icon-wrapper large">
            <ChessIcon />
          </div>
          <h1>Chess</h1>
        </div>
      </div>
      
      <div className="game-content">
        <section className="game-info-section">
          <h2>How to Play</h2>
          <p>
            Chess is a two-player strategy board game played on a checkered board with 64 squares arranged in an 8×8 grid.
          </p>
          <p>
            Each player begins with 16 pieces: one king, one queen, two rooks, two knights, two bishops, and eight pawns. Each piece type moves differently, with the most powerful being the queen and the least powerful the pawn.
          </p>
          <p>
            The objective is to checkmate the opponent's king by placing it under an inescapable threat of capture. To this end, a player's pieces are used to attack and capture the opponent's pieces, while supporting one another.
          </p>
          <p>
            In addition to checkmate, the game can be won by voluntary resignation of the opponent, which typically occurs when too much material is lost or checkmate appears inevitable.
          </p>
        </section>
        
        <section className="game-action">
          <button className="action-button">Start Game</button>
        </section>
      </div>
    </div>
  );
}

export default Chess; 