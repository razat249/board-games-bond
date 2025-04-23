import React, { useState, useEffect } from 'react';
import './ClueTracker.css';

const ClueTracker = ({ teamData, opponentTeamData, teamNumber, teamName, opponentTeamName }) => {
  const { codes, clues, guesses, intercepted, miscommunications } = teamData;
  const opponentCodes = opponentTeamData?.codes || [];
  const opponentClues = opponentTeamData?.clues || [];
  const opponentIntercepted = opponentTeamData?.intercepted || 0;
  const opponentMiscommunications = opponentTeamData?.miscommunications || 0;
  
  // State for tracking user's notes about opponent's words
  const [wordNotes, setWordNotes] = useState(['', '', '', '']);
  
  // State for tracking user's round notes
  const [roundNotes, setRoundNotes] = useState(Array(8).fill(''));
  
  // State for tracking which rounds had interceptions and miscommunications
  const [interceptionMarks, setInterceptionMarks] = useState(Array(8).fill(false));
  const [miscommunicationMarks, setMiscommunicationMarks] = useState(Array(8).fill(false));
  
  // State for editable clues
  const [editableOwnClues, setEditableOwnClues] = useState(Array(4).fill().map(() => Array(3).fill('')));
  const [editableOpponentClues, setEditableOpponentClues] = useState(Array(4).fill().map(() => Array(3).fill('')));
  
  // State for editable codes
  const [editableOwnCodes, setEditableOwnCodes] = useState(Array(4).fill().map(() => Array(3).fill('')));
  const [editableOpponentCodes, setEditableOpponentCodes] = useState(Array(4).fill().map(() => Array(3).fill('')));
  
  // State for word hypotheses
  const [wordHypotheses, setWordHypotheses] = useState(Array(4).fill().map(() => ({ 
    confirmed: false, 
    possibilities: ['', '', ''] 
  })));
  
  // Create an array of 8 rounds for display
  const rounds = Array.from({ length: 8 }, (_, i) => i + 1);
  
  // Helper to get the clue for a specific round and code position
  const getClueForCode = (roundClues, code, position) => {
    if (!roundClues) return '';
    return code && code[position] ? roundClues[position] : '';
  };
  
  // Helper to format the round number with leading zero
  const formatRound = (num) => {
    return num < 10 ? `0${num}` : num;
  };
  
  // Update interception mark for a specific round
  const toggleInterception = (roundIndex) => {
    const newMarks = [...interceptionMarks];
    newMarks[roundIndex] = !newMarks[roundIndex];
    setInterceptionMarks(newMarks);
  };
  
  // Update miscommunication mark for a specific round
  const toggleMiscommunication = (roundIndex) => {
    const newMarks = [...miscommunicationMarks];
    newMarks[roundIndex] = !newMarks[roundIndex];
    setMiscommunicationMarks(newMarks);
  };
  
  // Update note for a specific word
  const updateWordNote = (index, value) => {
    const newNotes = [...wordNotes];
    newNotes[index] = value;
    setWordNotes(newNotes);
  };
  
  // Update note for a specific round
  const updateRoundNote = (index, value) => {
    const newNotes = [...roundNotes];
    newNotes[index] = value;
    setRoundNotes(newNotes);
  };
  
  // Update editable clue
  const updateOwnClue = (roundIndex, clueIndex, value) => {
    const newClues = [...editableOwnClues];
    newClues[roundIndex][clueIndex] = value;
    setEditableOwnClues(newClues);
  };
  
  // Update editable opponent clue
  const updateOpponentClue = (roundIndex, clueIndex, value) => {
    const newClues = [...editableOpponentClues];
    newClues[roundIndex][clueIndex] = value;
    setEditableOpponentClues(newClues);
  };
  
  // Update editable code
  const updateOwnCode = (roundIndex, codeIndex, value) => {
    // Only allow numbers 1-4
    if (value !== '' && (isNaN(value) || value < 1 || value > 4)) return;
    
    const newCodes = [...editableOwnCodes];
    newCodes[roundIndex][codeIndex] = value;
    setEditableOwnCodes(newCodes);
  };
  
  // Update editable opponent code
  const updateOpponentCode = (roundIndex, codeIndex, value) => {
    // Only allow numbers 1-4
    if (value !== '' && (isNaN(value) || value < 1 || value > 4)) return;
    
    const newCodes = [...editableOpponentCodes];
    newCodes[roundIndex][codeIndex] = value;
    setEditableOpponentCodes(newCodes);
  };
  
  // Toggle confirmed status for a word hypothesis
  const toggleWordConfirmed = (index) => {
    const newHypotheses = [...wordHypotheses];
    newHypotheses[index].confirmed = !newHypotheses[index].confirmed;
    setWordHypotheses(newHypotheses);
  };
  
  // Update word hypothesis possibility
  const updateWordPossibility = (wordIndex, possibilityIndex, value) => {
    const newHypotheses = [...wordHypotheses];
    newHypotheses[wordIndex].possibilities[possibilityIndex] = value;
    setWordHypotheses(newHypotheses);
  };
  
  // Initialize editable clues and codes from game data
  useEffect(() => {
    const newOwnClues = [...editableOwnClues];
    const newOwnCodes = [...editableOwnCodes];
    
    // Initialize with existing clues and codes
    for (let i = 0; i < 4; i++) {
      if (codes[i] && clues[i]) {
        for (let j = 0; j < 3; j++) {
          if (clues[i][j]) newOwnClues[i][j] = clues[i][j];
          if (codes[i][j]) newOwnCodes[i][j] = codes[i][j];
        }
      }
    }
    
    setEditableOwnClues(newOwnClues);
    setEditableOwnCodes(newOwnCodes);
    
    // Do the same for opponent
    const newOpponentClues = [...editableOpponentClues];
    const newOpponentCodes = [...editableOpponentCodes];
    
    for (let i = 0; i < 4; i++) {
      if (opponentCodes[i] && opponentClues[i]) {
        for (let j = 0; j < 3; j++) {
          if (opponentClues[i][j]) newOpponentClues[i][j] = opponentClues[i][j];
          if (opponentCodes[i][j]) newOpponentCodes[i][j] = opponentCodes[i][j];
        }
      }
    }
    
    setEditableOpponentClues(newOpponentClues);
    setEditableOpponentCodes(newOpponentCodes);
    
  }, [codes, clues, opponentCodes, opponentClues]);
  
  // Update the marks based on actual game state
  useEffect(() => {
    // Update interception and miscommunication marks based on game state if needed
    const newInterceptionMarks = [...interceptionMarks];
    newInterceptionMarks[0] = intercepted > 0;
    newInterceptionMarks[1] = intercepted > 1;
    setInterceptionMarks(newInterceptionMarks);
    
    const newMiscommunicationMarks = [...miscommunicationMarks];
    newMiscommunicationMarks[0] = miscommunications > 0;
    newMiscommunicationMarks[1] = miscommunications > 1;
    setMiscommunicationMarks(newMiscommunicationMarks);
  }, [intercepted, miscommunications]);
  
  return (
    <div className="clue-tracker">
      <div className="tracker-header">
        <h3 className="tracker-title">CLUES TRACKER</h3>
        <div className="tracker-scores">
          <div className="tracker-score">
            <span className="score-label">INTERCEPTIONS</span>
            <span className="score-value">{intercepted}/2</span>
          </div>
          <div className="tracker-score">
            <span className="score-label">MISCOMMUNICATIONS</span>
            <span className="score-value">{miscommunications}/2</span>
          </div>
        </div>
      </div>
      
      <div className="tracker-grid">
        {/* Left column (Own team's clues) */}
        <div className="tracker-column own-team">
          <div className="column-header">{teamName} CLUES</div>
          {rounds.slice(0, 4).map((round, roundIndex) => (
            <div key={round} className="tracker-round">
              <div className="round-header">
                <span className="round-number">#{formatRound(round)}</span>
                <div className="round-indicators">
                  <span 
                    className={`interception-indicator ${interceptionMarks[roundIndex] ? 'marked' : ''}`}
                    onClick={() => toggleInterception(roundIndex)}
                  >
                    ?
                  </span>
                  <span 
                    className={`miscommunication-indicator ${miscommunicationMarks[roundIndex] ? 'marked' : ''}`}
                    onClick={() => toggleMiscommunication(roundIndex)}
                  >
                    !
                  </span>
                </div>
              </div>
              
              <div className="clue-lines">
                {Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className="clue-line">
                    <input
                      type="text"
                      className="clue-text-input"
                      value={editableOwnClues[roundIndex][i]}
                      onChange={(e) => updateOwnClue(roundIndex, i, e.target.value)}
                      placeholder="Enter clue..."
                    />
                    <input
                      type="text"
                      className="code-box-input"
                      value={editableOwnCodes[roundIndex][i]}
                      onChange={(e) => updateOwnCode(roundIndex, i, e.target.value)}
                      maxLength={1}
                    />
                  </div>
                ))}
              </div>
              
              <div className="round-notes">
                <input
                  type="text"
                  value={roundNotes[roundIndex]}
                  onChange={(e) => updateRoundNote(roundIndex, e.target.value)}
                  placeholder="Add notes..."
                  className="round-notes-input"
                />
              </div>
            </div>
          ))}
        </div>
        
        {/* Right column (Opponent team's clues) */}
        <div className="tracker-column opponent-team">
          <div className="column-header">{opponentTeamName} CLUES</div>
          {rounds.slice(4, 8).map((round, roundIndex) => (
            <div key={round} className="tracker-round">
              <div className="round-header">
                <span className="round-number">#{formatRound(round)}</span>
                <div className="round-indicators">
                  <span 
                    className={`interception-indicator ${interceptionMarks[roundIndex+4] ? 'marked' : ''}`}
                    onClick={() => toggleInterception(roundIndex+4)}
                  >
                    ?
                  </span>
                  <span 
                    className={`miscommunication-indicator ${miscommunicationMarks[roundIndex+4] ? 'marked' : ''}`}
                    onClick={() => toggleMiscommunication(roundIndex+4)}
                  >
                    !
                  </span>
                </div>
              </div>
              
              <div className="clue-lines">
                {Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className="clue-line">
                    <input
                      type="text"
                      className="clue-text-input"
                      value={editableOpponentClues[roundIndex][i]}
                      onChange={(e) => updateOpponentClue(roundIndex, i, e.target.value)}
                      placeholder="Enter clue..."
                    />
                    <input
                      type="text"
                      className="code-box-input"
                      value={editableOpponentCodes[roundIndex][i]}
                      onChange={(e) => updateOpponentCode(roundIndex, i, e.target.value)}
                      maxLength={1}
                    />
                  </div>
                ))}
              </div>
              
              <div className="round-notes">
                <input
                  type="text"
                  value={roundNotes[roundIndex+4]}
                  onChange={(e) => updateRoundNote(roundIndex+4, e.target.value)}
                  placeholder="Add notes..."
                  className="round-notes-input"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="word-codes-section">
        <div className="word-codes-header">
          OPPONENT WORD DEDUCTIONS
        </div>
        <div className="word-codes-container">
          {[1, 2, 3, 4].map((num, index) => (
            <div key={num} className="word-code">
              <div className="word-header">
                <span className="word-number">{num}</span>
                <label className="word-confirmed">
                  <input 
                    type="checkbox" 
                    checked={wordHypotheses[index].confirmed}
                    onChange={() => toggleWordConfirmed(index)}
                  />
                  <span>Confirmed</span>
                </label>
              </div>
              <textarea
                className={`word-space ${wordHypotheses[index].confirmed ? 'confirmed' : ''}`}
                value={wordNotes[index]}
                onChange={(e) => updateWordNote(index, e.target.value)}
                placeholder="Main deduction..."
              ></textarea>
              <div className="word-possibilities">
                {wordHypotheses[index].possibilities.map((possibility, possIndex) => (
                  <input
                    key={possIndex}
                    type="text"
                    className="possibility-input"
                    value={possibility}
                    onChange={(e) => updateWordPossibility(index, possIndex, e.target.value)}
                    placeholder={`Possibility ${possIndex + 1}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="pattern-notes-section">
        <div className="pattern-notes-header">PATTERN NOTES</div>
        <textarea 
          className="pattern-notes-textarea"
          placeholder="Track patterns across rounds and clues..."
        ></textarea>
      </div>
      
      <div className="tracker-instructions">
        <ul>
          <li>Click on ? to mark an interception</li>
          <li>Click on ! to mark a miscommunication</li>
          <li>Enter clues and code numbers in the boxes</li>
          <li>Use bottom boxes to track possible words</li>
          <li>Check "Confirmed" when you're sure about a word</li>
        </ul>
      </div>
    </div>
  );
};

export default ClueTracker; 