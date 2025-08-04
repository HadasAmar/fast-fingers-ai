import { useState, useMemo } from "react";
import LetterStats from "./LetterStats";
import { fetchResults, fetchLetterStats } from "../api";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush
} from "recharts";
import "../styles/ResultsHistory.css";

export default function ResultsHistory() {
  const [view, setView] = useState("history");
  const [results, setResults] = useState([]);
  const [letterStats, setLetterStats] = useState([]);
  const [activeLines, setActiveLines] = useState({ accuracy: true, wpm: true });

  async function handleFetchResults() { setResults(await fetchResults() || []); }
  async function handleFetchLetterStats() { 
    const data = await fetchLetterStats(); 
    setLetterStats(data.letters || []);
  }

  const chartData = results.map((result, index) => ({
    name: `Test ${index + 1}`,
    accuracy: result.accuracy,
    wpm: result.wpm,
  }));

  const stats = useMemo(() => {
    if (results.length === 0) return { avgAcc: 0, maxAcc: 0, avgWpm: 0, maxWpm: 0 };
    const totalAcc = results.reduce((sum, r) => sum + r.accuracy, 0);
    const totalWpm = results.reduce((sum, r) => sum + r.wpm, 0);
    return {
      avgAcc: (totalAcc / results.length).toFixed(2),
      maxAcc: Math.max(...results.map((r) => r.accuracy)).toFixed(2),
      avgWpm: (totalWpm / results.length).toFixed(2),
      maxWpm: Math.max(...results.map((r) => r.wpm)).toFixed(2),
    };
  }, [results]);

  const toggleLine = (key) => setActiveLines((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="page-container">
      <div className="card">
        <h2 className="title">Results</h2>
        <div className="button-group">
          <button className="btn" onClick={() => { setView("letters"); handleFetchLetterStats(); }}>Letter Stats</button>
          <button className="btn btn-alt" onClick={() => { setView("graph"); handleFetchResults(); }}>Graph</button>
        </div>
        {view === "letters" && <LetterStats stats={letterStats} />}
        {view === "graph" && (
          <div style={{ width: "100%" }}>
            <div style={{ display: "flex", gap: "2rem", justifyContent: "center", marginBottom: "1rem" }}>
              <span onClick={() => toggleLine("accuracy")} style={{ cursor: "pointer", opacity: activeLines.accuracy ? 1 : 0.4, fontWeight: activeLines.accuracy ? "bold" : "normal" }}>
                <svg width="20" height="10" style={{ marginRight: "5px" }}><line x1="0" y1="5" x2="20" y2="5" stroke="#667eea" strokeWidth="2" /></svg>
                accuracy
              </span>
              <span onClick={() => toggleLine("wpm")} style={{ cursor: "pointer", opacity: activeLines.wpm ? 1 : 0.4, fontWeight: activeLines.wpm ? "bold" : "normal" }}>
                <svg width="20" height="10" style={{ marginRight: "5px" }}><line x1="0" y1="5" x2="20" y2="5" stroke="#764ba2" strokeWidth="2" /></svg>
                wpm
              </span>
            </div>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="accuracy" stroke="#667eea" dot={false} strokeOpacity={activeLines.accuracy ? 1 : 0.2} strokeWidth={activeLines.accuracy ? 1.5 : 1} />
                  <Line type="monotone" dataKey="wpm" stroke="#764ba2" dot={false} strokeOpacity={activeLines.wpm ? 1 : 0.2} strokeWidth={activeLines.wpm ? 1.5 : 1} />
                  <Brush dataKey="name" height={20} stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="stats-summary">
              <div className="stats-card"><h4>Accuracy</h4><p><strong>Average:</strong> {stats.avgAcc}%</p><p><strong>Max:</strong> {stats.maxAcc}%</p></div>
              <div className="stats-card"><h4>WPM</h4><p><strong>Average:</strong> {stats.avgWpm}</p><p><strong>Max:</strong> {stats.maxWpm}</p></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
