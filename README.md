# Typing Trainer AI ✨
**Interactive typing trainer with AI‑powered personalized practice and real‑time performance tracking.**

## Overview 📖
This project is a **full‑stack interactive typing practice application** designed to help users improve their typing speed and accuracy.  
It combines **AI‑generated training texts** (using Google Gemini) that adapt not only to your typing mistakes but also to your **preferred topic** and **desired length** for a fully personalized experience.

Key Highlights:  
- **Frontend:** React – intuitive UI with interactive feedback and charts (React Router for navigation, Recharts for data visualization).  
- **Backend:** FastAPI – text analysis, personalized training, and data storage.  
- **Database:** SQLite – stores results and letter‑specific error stats.  
- **AI Integration:** Gemini AI – generates adaptive practice texts based on your chosen topic, desired length, and common typing errors.

---

## Features 🚀
- **Typing Test:** Measure speed (WPM) and accuracy in real time.  
- **Personalized Practice:** AI generates custom training texts focused on your mistakes **and** your preferred topic & length.  
- **Progress Tracking:** View performance history and trend charts for accuracy and WPM.  
- **Error Analytics:** Letter‑specific error tracking for targeted improvement.  
- **Clean & Responsive UI:** Smooth, modern design for desktop and mobile.

---

## Tech Stack 🛠
- **Frontend:** React, React Router, Recharts  
- **Backend:** FastAPI, Python  
- **Database:** SQLite  
- **AI:** Google Gemini (via `google-generativeai` library)

---

## Getting Started 💻

### Prerequisites
- Node.js & npm  
- Python 3.10+  
- Gemini API Key

### Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/HadasAmar/fast-fingers-ai.git
   cd fast-fingers-ai
   ```
2. **Backend setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```
3. **Frontend setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```
4. **Open the app**
   Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## Screenshots 🖼

<img width="863" height="719" alt="image" src="https://github.com/user-attachments/assets/f9a40417-3416-4bb8-a2d8-2d7f76a26542" />

<img width="836" height="796" alt="image" src="https://github.com/user-attachments/assets/6aed372f-9e4b-4aeb-b423-59e67daacc73" />

---

## License 📜
Feel free to use this project for **personal use and learning** – enjoy improving your typing skills and experimenting with AI-powered training!  
