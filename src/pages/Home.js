import { Link } from 'react-router-dom';
import { ReactComponent as CodenamesIcon } from '../images/codenames.svg';
import { ReactComponent as DecryptoIcon } from '../images/decrypto.svg';
import { ReactComponent as ChessIcon } from '../images/chess.svg';
import { ReactComponent as SplendorIcon } from '../images/splendor.svg';

function Home() {
  const codenameTileStyle = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/images/codenames.png)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  };
  
  const codenamesDuetTileStyle = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/images/codenames-duet.png)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  };

  const decryptoTileStyle = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/images/decrypto.png)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  };

  const splendorTileStyle = {
    backgroundColor: '#5c3d6a',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  };

  return (
    <div className="App">
      <header>
        <h1>Board Games Bond</h1>
        <p className="tagline">Connect with friends over strategic board games</p>
      </header>
      
      <div className="game-tiles">
        <Link 
          to="/codenames"
          className="game-tile" 
          role="button"
          aria-label="Codenames board game"
          style={codenameTileStyle}
        >
          <div className="game-info">
            <div className="icon-wrapper">
              <CodenamesIcon />
            </div>
            <h2>Codenames</h2>
            <p>A word association game of spies and secrets</p>
          </div>
        </Link>
        
        <Link 
          to="/codenames-duet"
          className="game-tile" 
          role="button"
          aria-label="Codenames Duet board game"
          style={codenamesDuetTileStyle}
        >
          <div className="game-info">
            <div className="icon-wrapper">
              <CodenamesIcon />
            </div>
            <h2>Codenames Duet</h2>
            <p>A cooperative word game for two players</p>
          </div>
        </Link>
        
        <Link 
          to="/decrypto"
          className="game-tile" 
          role="button"
          aria-label="Decrypto board game"
          style={decryptoTileStyle}
        >
          <div className="game-info">
            <div className="icon-wrapper">
              <DecryptoIcon />
            </div>
            <h2>Decrypto</h2>
            <p>Code-breaking team communication challenge</p>
          </div>
        </Link>
        
        <Link 
          to="/chess"
          className="game-tile" 
          role="button"
          aria-label="Chess board game"
        >
          <div className="game-info">
            <div className="icon-wrapper">
              <ChessIcon />
            </div>
            <h2>Chess</h2>
            <p>The classic strategy game of kings and queens</p>
          </div>
        </Link>

        <Link 
          to="/splendor"
          className="game-tile" 
          role="button"
          aria-label="Splendor board game"
          style={splendorTileStyle}
        >
          <div className="game-info">
            <div className="icon-wrapper">
              <SplendorIcon />
            </div>
            <h2>Splendor</h2>
            <p>Collect gems and build your jewelry empire</p>
          </div>
        </Link>
      </div>
      
      <footer>
        <p>Select a game to learn more or start playing!</p>
      </footer>
    </div>
  );
}

export default Home; 