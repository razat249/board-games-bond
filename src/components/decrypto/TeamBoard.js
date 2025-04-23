import React, { useState } from 'react';
import './TeamBoard.css';

const TeamBoard = ({ teamNumber, teamName, teamData, isCurrentTeam, phase, round, opponentTeamData, opponentTeamName }) => {
  const { words, intercepted, miscommunications, codes, clues, guesses } = teamData;

  const renderWordCards = () => {
    return (
      <div className="word-monitor-display">
        {words.map((word, index) => (
          <div key={index} className="word-monitor">
            <div className="monitor-screen">
              <div className="screen-content">{word}</div>
            </div>
            <div className="monitor-controls">
              <div className="control-knobs">
                <div className="knob"></div>
                <div className="knob"></div>
                <div className="knob"></div>
              </div>
            </div>
            <div className="monitor-number-container">
              <div className="monitor-number">{index + 1}</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderHistory = () => {
    if (round === 1 && (!clues || clues.length === 0)) return null;

    return (
      <div className="history-section">
        <h3>PREVIOUS ROUNDS</h3>
        <div className="history-list">
          {Array.from({ length: Math.min(round - 1, clues ? clues.length : 0) }).map((_, roundIndex) => (
            <div key={roundIndex} className="history-item">
              <div className="history-round">ROUND {roundIndex + 1}</div>
              <div className="history-code">
                CODE: {(codes && codes[roundIndex]) ? codes[roundIndex].join('-') : 'N/A'}
              </div>
              <div className="history-clues">
                CLUES: {(clues && clues[roundIndex]) ? clues[roundIndex].join(', ') : 'N/A'}
              </div>
              {guesses && guesses[roundIndex] && (
                <div className="history-guess">
                  TEAM GUESS: {guesses[roundIndex].join('-')}
                  {codes && codes[roundIndex] && JSON.stringify(guesses[roundIndex]) === JSON.stringify(codes[roundIndex]) 
                    ? ' ✓' 
                    : ' ✗'}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCurrentRound = () => {
    if (!clues || clues.length < round) return null;

    const currentClues = clues[round - 1];
    const currentCode = codes && codes[round - 1] ? codes[round - 1] : null;
    const currentGuess = guesses && guesses[round - 1] ? guesses[round - 1] : null;

    return (
      <div className="current-round">
        <h3>CURRENT ROUND</h3>
        <div className="current-code">
          {isCurrentTeam && (phase === 'team1Encrypt' || phase === 'team2Encrypt') && currentCode && (
            <div>CODE TO COMMUNICATE: {currentCode.join('-')}</div>
          )}
        </div>
        <div className="current-clues">
          {currentClues && (
            <div>
              <p>CLUES:</p>
              <ul>
                {currentClues.map((clue, index) => (
                  <li key={index}>{clue}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {currentGuess && currentCode && (
          <div className="current-guess">
            TEAM GUESS: {currentGuess.join('-')}
            {JSON.stringify(currentGuess) === JSON.stringify(currentCode) 
              ? ' ✓' 
              : ' ✗'}
          </div>
        )}
      </div>
    );
  };

  const renderStatus = () => {
    return (
      <div className="team-status">
        <div className="status-item">
          <span className="status-label">INTERCEPTIONS</span>
          <span className="status-value">{intercepted}/2</span>
        </div>
        <div className="status-item">
          <span className="status-label">MISCOMMUNICATIONS</span>
          <span className="status-value">{miscommunications}/2</span>
        </div>
      </div>
    );
  };

  const isSetup = phase === 'setup';
  const isMyTurnToEncrypt = (teamNumber === 1 && phase === 'team1Encrypt') || 
                            (teamNumber === 2 && phase === 'team2Encrypt');
  const isMyTurnToGuess = (teamNumber === 1 && phase === 'team1Guess') || 
                          (teamNumber === 2 && phase === 'team2Guess');

  // Special flag for the device's team (always Team 1)
  const isMyDevice = teamNumber === 1;

  return (
    <div className={`team-board team${teamNumber} ${isCurrentTeam ? 'active' : ''} ${isMyDevice ? 'my-device' : ''}`}>
      <div className="screw-top-left"></div>
      <div className="screw-top-right"></div>
      <div className="screw-bottom-left"></div>
      <div className="screw-bottom-right"></div>
      <div className="team-header">
        <h2>{teamName || `Team ${teamNumber}`}</h2>
        {renderStatus()}
      </div>
      
      {!isSetup && renderWordCards()}
      
      <div className="team-content">
        {renderCurrentRound()}
        {renderHistory()}
      </div>
      
      <div className="team-turn-indicator">
        {isMyTurnToEncrypt && <div className="turn-badge encrypt">GIVE CLUES</div>}
        {isMyTurnToGuess && <div className="turn-badge guess">GUESS CODE</div>}
      </div>
      
      {isMyDevice && <div className="your-team-badge">YOUR TEAM</div>}
    </div>
  );
};

export default TeamBoard; 