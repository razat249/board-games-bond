import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Codenames from './pages/Codenames';
import CodenamesDuet from './pages/CodenamesDuet';
import Decrypto from './pages/Decrypto';
import Chess from './pages/Chess';
import Splendor from './pages/Splendor';

function App() {
  return (
    <Router basename="/board-games-bond">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/codenames" element={<Codenames />} />
        <Route path="/codenames/:gameCode" element={<Codenames />} />
        <Route path="/codenames-duet" element={<CodenamesDuet />} />
        <Route path="/codenames-duet/:gameCode" element={<CodenamesDuet />} />
        <Route path="/decrypto" element={<Decrypto />} />
        <Route path="/decrypto/:gameCode" element={<Decrypto />} />
        <Route path="/chess" element={<Chess />} />
        <Route path="/splendor" element={<Splendor />} />
      </Routes>
    </Router>
  );
}

export default App;
