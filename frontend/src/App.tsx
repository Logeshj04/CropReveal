import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { Home } from './pages/Home';
import { Diagnose } from './pages/Diagnose';
import { History } from './pages/History';
import { Knowledge } from './pages/Knowledge';
import { Chat } from './pages/Chat';
import { Help } from './pages/Help';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/diagnose" element={<Diagnose />} />
          <Route path="/history" element={<History />} />
          <Route path="/knowledge" element={<Knowledge />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/help" element={<Help />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;