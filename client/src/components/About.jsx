import "../styles/App.css";
import "../styles/About.css";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="page-container about-page">
      <div className="card about-card fade-in">
        <h1 className="title about-title">About This App</h1>
        <p className="about-intro">
          Welcome to our <strong>Typing Practice App</strong> – a fun and interactive way 
          to improve your typing skills with personalized content and progress tracking.
        </p>

        <h2 className="subtitle about-subtitle">Key Features:</h2>
        <ul className="about-list">
          <li>
            <strong>Typing Tests:</strong> Practice with random texts to measure your speed (WPM) and accuracy.
          </li>
          <li>
            <strong>Personalized Text Creation:</strong> Generate custom text based on your chosen topic and number of words.
          </li>
          <li>
            <strong>Error-Based Adaptation:</strong> The app analyzes your typing mistakes and focuses on the letters you need to improve.
          </li>
          <li>
            <strong>Automatic Reset:</strong> After three sessions, your stored letter mistakes are cleared for fresh practice.
          </li>
          <li>
            <strong>History & Graphs:</strong> Track your progress visually with accuracy and speed charts.
          </li>
        </ul>

        <p className="about-footer">
          The goal is to make learning typing faster, smarter, and tailored just for you!
        </p>

        <Link to="/" className="btn about-back-btn">← Back to Home</Link>
      </div>
    </div>
  );
}
