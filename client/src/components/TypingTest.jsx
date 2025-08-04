import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { fetchLetterStats, fetchNextText, analyzeTyping } from "../api";
import "../styles/TypingTest.css";

export default function TypingTest() {
  // State variables
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  const [words, setWords] = useState(7);
  const [desc, setDesc] = useState("encourage typing practice");
  const [trainingText, setTrainingText] = useState("");
  const [progress, setProgress] = useState(0);
  const [showOptions, setShowOptions] = useState(false);

  const textRef = useRef(null);

  useEffect(() => {
    getNewText();
  }, []);

  // Scroll active character into view automatically
  useEffect(() => {
    if (textRef.current) {
      const cursorPos = input.length;
      const span = textRef.current.querySelector(`[data-index="${cursorPos}"]`);
      if (span) span.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [input]);

  async function getNewText() {
    const data = await fetchLetterStats();
    const letterErrors = {};
    (data.letters || []).forEach(([letter, count]) => {
      letterErrors[letter] = count;
    });

    const nextText = await fetchNextText(letterErrors, words, desc);
    setTrainingText(nextText.text);

    if (Object.keys(letterErrors).length > 0) {
      Swal.fire({
        title: "Personalized Practice",
        text: `The new text includes letters you need to improve on: ${Object.keys(letterErrors).join(", ")}`,
        icon: "info",
        confirmButtonText: "Let's go",
        confirmButtonColor: "#667eea",
      });
    }
    handleReset();
  }

  async function handleSubmit(value) {
    if (!startTime) return;
    const duration = (Date.now() - startTime) / 1000;

    const data = await analyzeTyping(trainingText, value, duration);
    setResult(data);
    setStartTime(null);
    setIsFinished(true);
  }

  function handleInputChange(e) {
    const value = e.target.value;
    if (isFinished) return;

    if (!startTime && value.length > input.length) {
      setStartTime(Date.now());
    }
    setInput(value);
    setProgress((value.length / trainingText.length) * 100);

    if (value.length >= trainingText.length) handleSubmit(value);
  }

  function handleReset() {
    setInput("");
    setResult(null);
    setStartTime(null);
    setIsFinished(false);
    setProgress(0);
  }

  function renderHighlightedText() {
    return trainingText.split("").map((char, index) => {
      let className = "";
      if (index < input.length) {
        className = input[index] === char ? "correct" : "wrong";
      }
      return (
        <span key={index} data-index={index} className={className}>
          {char}
        </span>
      );
    });
  }

  function handleCreateButton() {
    if (!showOptions) setShowOptions(true);
    else {
      getNewText();
      setShowOptions(false);
    }
  }

  return (
    <div className="page-container">
      <div className="card typing-card">
        <h1 className="title">Typing Practice</h1>

        <div className="text-container" ref={textRef}>
          <p className="text-to-type highlighted-text">{renderHighlightedText()}</p>
        </div>

        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>

        <textarea
          className="typing-input"
          rows={5}
          value={input}
          onChange={handleInputChange}
          readOnly={isFinished}
        />

        <div className="button-group">
          <button
            className={`btn toggle-btn ${showOptions ? "open" : ""}`}
            onClick={handleCreateButton}
          >
            {showOptions ? "🚀 Create" : "✏️ Create Personal Text"}
          </button>

          <div className={`options-box ${showOptions ? "show" : ""}`}>
            <label>
              Number of words:
              <input
                type="number"
                min="5"
                max="50"
                value={words}
                onChange={(e) => setWords(Number(e.target.value))}
                className="input-field"
              />
            </label>
            <label>
              Topic / Description:
              <input
                type="text"
                value={desc}
                placeholder="e.g. animals, technology..."
                onChange={(e) => setDesc(e.target.value)}
                className="input-field"
              />
            </label>
          </div>
        </div>

        {result && (
          <div className="result-box fade-in">
            <p><strong>Accuracy:</strong> {result.accuracy}%</p>
            <p><strong>WPM:</strong> {result.wpm}</p>
            <p><strong>Errors:</strong> {result.errors}</p>
          </div>
        )}
      </div>
    </div>
  );
}
