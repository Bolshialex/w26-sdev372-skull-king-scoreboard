import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PlayerCreation from "./pages/PlayerCreation";
import PlayerLookup from "./pages/PlayerLookup";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/player/create" element={<PlayerCreation />} />
          <Route path="/players" element={<PlayerLookup />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
