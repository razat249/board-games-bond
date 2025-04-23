import { Link } from 'react-router-dom';
import { ReactComponent as SplendorIcon } from '../images/splendor.svg';
import './Splendor.css';
import { useState } from 'react';

function Splendor() {
  const [gameStarted, setGameStarted] = useState(false);
  
  // Enhanced card data with illustrations
  const tier1Cards = [
    { id: 1, points: 0, cost: { white: 1, blue: 1, green: 1, red: 1 }, gem: 'black', image: 'mine' },
    { id: 2, points: 0, cost: { white: 1, blue: 2, green: 1, black: 1 }, gem: 'red', image: 'transport' },
    { id: 3, points: 0, cost: { blue: 2, green: 2, black: 1 }, gem: 'white', image: 'artisan' },
    { id: 4, points: 1, cost: { blue: 3, red: 2, black: 2 }, gem: 'black', image: 'mine' }
  ];
  
  const tier2Cards = [
    { id: 5, points: 1, cost: { white: 2, blue: 3, red: 3 }, gem: 'green', image: 'artisan' },
    { id: 6, points: 2, cost: { green: 5, black: 3 }, gem: 'red', image: 'transport' },
    { id: 7, points: 2, cost: { blue: 1, green: 4, red: 2 }, gem: 'blue', image: 'mine' },
    { id: 8, points: 3, cost: { white: 6 }, gem: 'white', image: 'artisan' }
  ];
  
  const tier3Cards = [
    { id: 9, points: 3, cost: { white: 3, green: 5, red: 3, black: 3 }, gem: 'black', image: 'noble' },
    { id: 10, points: 4, cost: { blue: 7 }, gem: 'red', image: 'castle' },
    { id: 11, points: 4, cost: { white: 3, green: 3, red: 6 }, gem: 'green', image: 'noble' },
    { id: 12, points: 5, cost: { white: 3, green: 7 }, gem: 'blue', image: 'castle' }
  ];

  // Noble cards (new addition)
  const nobleCards = [
    { id: 'n1', points: 3, requirements: { red: 4, green: 4 }, image: 'noble1' },
    { id: 'n2', points: 3, requirements: { white: 3, blue: 3, black: 3 }, image: 'noble2' },
    { id: 'n3', points: 3, requirements: { white: 4, blue: 4 }, image: 'noble3' }
  ];
  
  const startGame = () => {
    setGameStarted(true);
  };
  
  const renderCardCost = (costs) => {
    return (
      <div className="card-cost">
        {Object.entries(costs).map(([color, count]) => 
          count > 0 ? (
            <div key={color} className="cost-item">
              <span className={`gem ${color}`}></span>
              <span className="count">{count}</span>
            </div>
          ) : null
        )}
      </div>
    );
  };
  
  const renderCard = (card, tier) => {
    return (
      <div key={card.id} className={`splendor-card tier-${tier}`}>
        {card.points > 0 && <div className="card-points">{card.points}</div>}
        <div className="card-illustration">
          {card.image === 'mine' && <div className="illustration mine-illustration"></div>}
          {card.image === 'transport' && <div className="illustration transport-illustration"></div>}
          {card.image === 'artisan' && <div className="illustration artisan-illustration"></div>}
          {card.image === 'noble' && <div className="illustration noble-illustration"></div>}
          {card.image === 'castle' && <div className="illustration castle-illustration"></div>}
        </div>
        <div className={`card-gem ${card.gem}`}></div>
        {renderCardCost(card.cost)}
      </div>
    );
  };

  const renderNobleCard = (noble) => {
    return (
      <div key={noble.id} className="noble-card">
        <div className="card-points">{noble.points}</div>
        <div className="noble-illustration"></div>
        <div className="card-requirements">
          {Object.entries(noble.requirements).map(([color, count]) => 
            count > 0 ? (
              <div key={color} className="requirement-item">
                <span className={`gem ${color}`}></span>
                <span className="count">{count}</span>
              </div>
            ) : null
          )}
        </div>
      </div>
    );
  };
  
  const renderTier = (tier, cards) => {
    return (
      <div className="card-tier">
        <h3>Tier {tier}</h3>
        <div className="deck-placeholder">
          <div className={`tier-marker tier-${tier}`}>{tier}</div>
        </div>
        <div className="card-row">
          {cards.map(card => renderCard(card, tier))}
        </div>
      </div>
    );
  };

  return (
    <div className="game-page">
      <div className="game-header">
        <Link to="/" className="back-link">
          ← Back to Games
        </Link>
        <div className="game-title">
          <div className="icon-wrapper large">
            <SplendorIcon />
          </div>
          <h1>Splendor</h1>
        </div>
      </div>
      
      {!gameStarted ? (
        <div className="game-content">
          <section className="game-info-section">
            <h2>About Splendor</h2>
            <p>
              Splendor is an elegant gem-trading game where players take on the roles of Renaissance merchants, 
              trying to build prestige by acquiring mines, transportation, and artisans who can turn raw gems into beautiful jewels.
            </p>
            
            <h2>How to Play</h2>
            <p>
              On your turn, you may perform one of the following actions:
            </p>
            <ul>
              <li>Take up to three gem tokens of different colors</li>
              <li>Take two gem tokens of the same color (if there are at least 4 available)</li>
              <li>Reserve a development card and take a gold token (joker)</li>
              <li>Purchase a face-up development card or a previously reserved card</li>
            </ul>
            <p>
              The first player to reach 15 prestige points triggers the end of the game.
            </p>
          </section>
          
          <section className="game-action">
            <button className="action-button" onClick={startGame}>Start Game</button>
          </section>
        </div>
      ) : (
        <div className="splendor-game-board">
          <div className="game-layout">
            <div className="nobles-section">
              <h3>Nobles</h3>
              <div className="nobles-row">
                {nobleCards.map(noble => renderNobleCard(noble))}
              </div>
            </div>
            
            <div className="card-tiers">
              {renderTier(3, tier3Cards)}
              {renderTier(2, tier2Cards)}
              {renderTier(1, tier1Cards)}
            </div>
            
            <div className="tokens-section">
              <h3>Gem Tokens</h3>
              <div className="tokens-row">
                <div className="token white">
                  <span className="token-count">7</span>
                </div>
                <div className="token blue">
                  <span className="token-count">7</span>
                </div>
                <div className="token green">
                  <span className="token-count">7</span>
                </div>
                <div className="token red">
                  <span className="token-count">7</span>
                </div>
                <div className="token black">
                  <span className="token-count">7</span>
                </div>
                <div className="token gold">
                  <span className="token-count">5</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="game-controls">
            <button className="action-button" onClick={() => setGameStarted(false)}>End Game</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Splendor; 