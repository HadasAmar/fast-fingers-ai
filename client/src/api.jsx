
// Centralized API calls using base URL from environment variable
const BASE_URL = process.env.REACT_APP_API_URL || "https://fast-fingers-ai.onrender.com";
console.log("API Base URL:", BASE_URL);
console.log("Full process.env", process.env);

export async function fetchLetterStats() {
  const res = await fetch(`${BASE_URL}/letter-stats`);
  return res.json();
}

export async function fetchNextText(letterErrors, words, desc) {
  const payload = { letter_errors: letterErrors, words, desc };
  const res = await fetch(`${BASE_URL}/next-text-ai`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function analyzeTyping(text, typed, duration) {
  const res = await fetch(`${BASE_URL}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, typed, duration }),
  });
  return res.json();
}

export async function clearLetterStats() {
  const res = await fetch(`${BASE_URL}/delete-letter-stats`, { method: "DELETE" });
  return res.ok;
}

export async function fetchResults() {
  const res = await fetch(`${BASE_URL}/results`);
  return res.json();
}
