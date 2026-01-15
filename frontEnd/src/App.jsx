import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PlayerCreation from "./pages/PlayerCreation";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/player/create" element={<PlayerCreation />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
