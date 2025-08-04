import { clearLetterStats } from "../api";
import "../styles/ResultsHistory.css";

export default function LetterStats({ stats }) {
  async function handleClear() {
    if (!window.confirm("Are you sure you want to clear all letter stats?")) return;
    const success = await clearLetterStats();
    alert(success ? "Letter stats cleared successfully" : "Failed to clear letter stats");
  }

  return (
    <div className="letter-stats">
      <div className="stats-header">
        <h3 className="subtitle">Letter Errors</h3>
        <button className="btn btn-danger" onClick={handleClear}>Clear Stats</button>
      </div>
      <h4>
        You need to improve on these {stats.reduce((sum, item) => sum + item[1], 0)} letters
      </h4>
      <table className="stats-table">
        <thead>
          <tr>
            <th>Expected</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((item, index) => (
            <tr key={index}>
              <td>{item[0]}</td>
              <td>{item[1]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
