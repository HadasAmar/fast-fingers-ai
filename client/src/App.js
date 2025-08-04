import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import TypingTest from "./components/TypingTest";
import ResultsHistory from "./components/ResultsHistory";
import About from "./components/About";
import "./styles/App.css";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <nav className="navbar">
          <Link to="/" className="nav-link">
            Typing Test
          </Link>
          <Link to="/history" className="nav-link">
            History
          </Link>
          <Link to="/about" className="nav-link">
            About
          </Link>
        </nav>
        <Routes>
          <Route path="/" element={<TypingTest />} />
          <Route path="/history" element={<ResultsHistory />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
