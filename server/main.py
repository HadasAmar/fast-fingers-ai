from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from models import TypingResult
from db import get_connection, init_db, insert_result, get_all_results, insert_letter_errors, get_letter_stats
import google.generativeai as genai 
from dotenv import load_dotenv
load_dotenv()
import os

init_db()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
def analyze_typing(typing_result: TypingResult):
    errors = 0
    mistakes = []
    for i, (a, b) in enumerate(zip(typing_result.text, typing_result.typed)):
        if a != b:
            errors += 1
            mistakes.append({"position": i, "expected": a, "got": b})

    length_diff = abs(len(typing_result.text) - len(typing_result.typed))
    errors += length_diff

    total_chars = max(len(typing_result.text), len(typing_result.typed))
    accuracy = round(((total_chars - errors) / total_chars) * 100, 2)

    minutes = typing_result.duration / 60
    correct_chars = max(len(typing_result.typed) - errors, 0)
    wpm = round((correct_chars / 5) / minutes, 2) if minutes > 0 else 0

    letters_state = {}
    for a, b in zip(typing_result.text, typing_result.typed):
        if a != b:
            if a not in letters_state:
                letters_state[a] = {}
            letters_state[a][b] = letters_state[a].get(b, 0) + 1

    result_id = insert_result(
        original_text=typing_result.text,
        typed_text=typing_result.typed,
        accuracy=accuracy,
        wpm=wpm,
        errors=errors
    )
    insert_letter_errors(result_id, letters_state)

    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT original_text, typed_text
            FROM results
            ORDER BY timestamp DESC
            LIMIT 3
        """)
    recent_results = cursor.fetchall()

    recent_errors = set()
    for original, typed in recent_results:
        for a, b in zip(original, typed):
            if a != b:
                recent_errors.add(a)

    with get_connection() as conn:
        cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT expected_char FROM letters_errors")
    all_letters = [row[0] for row in cursor.fetchall()]

    improved_letters = [letter for letter in all_letters if letter not in recent_errors]

    if improved_letters:
        with get_connection() as conn:
            cursor = conn.cursor()
            for letter in improved_letters:
                cursor.execute("DELETE FROM letters_errors WHERE expected_char = ?", (letter,))
            conn.commit()

    improvement_message = ""
    if improved_letters:
        print(f"Improved letters: {', '.join(improved_letters)}")
        improvement_message = f"Great job! You improved on letters: {', '.join(improved_letters)}"

    return {"accuracy": accuracy, "wpm": wpm, "errors": errors, "letter_errors": letters_state, "improvement_message": improvement_message}


@app.get("/results")
def get_results():
    return get_all_results()

@app.get("/letter-stats")
def get_letter():
    return get_letter_stats()


class NewText(BaseModel):
    letter_errors: dict
    words: float
    desc: str= "encorage typing practice"
    

@app.post("/next-text-ai")
def next_text_ai(data: NewText):

   
    if not data.letter_errors:
        # פרומפט למוטיבציה כשאין טעויות
        prompt = f"""
        Generate a text for touch typing learning (blind typing).
        Return ONLY the practice text with EXACTLY {int(data.words)} words separated by spaces.
        the content will be about {data.desc}.
        Use only lowercase letters and spaces, no punctuation marks, no commas, no dots, no exclamation marks.
        Output ONLY the sentence.

        """
    else:
        prompt = f"""
        You are creating text for touch typing learning (blind typing).
        The user made typing mistakes with these letters: {data.letter_errors}.
        the content will be about {data.desc}.
        Focus on these problematic letters.
        Generate a natural-looking typing practice text 
        Return ONLY the practice text with EXACTLY {int(data.words)} words separated by spaces.
        Use only lowercase letters and spaces, no punctuation marks, no commas, no dots, no exclamation marks.
        Output ONLY the practice text.
        """

    try:
        model = genai.GenerativeModel('gemini-2.0-flash')
        response = model.generate_content(prompt)
        text = response.text.strip()

    except Exception as e:
        print(f"Gemini API error: {e}")
        text = "keep practicing typing you are doing great"

    return {"text": text}

@app.delete("/delete-letter-stats")
def delete_letter_stats():
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM letters_errors")
        conn.commit()
    return {"message": "All letter stats deleted successfully"}

@app.delete("/delete-results")
def delete_results():
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM results")
        conn.commit()
    return {"message": "All results deleted successfully"}