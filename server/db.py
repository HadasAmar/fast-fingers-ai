import sqlite3
from datetime import datetime

DB_PATH = "typing.db"

def get_connection():
    return sqlite3.connect(DB_PATH)

def init_db():
    with get_connection() as conn:
        with open("schema.sql", "r") as f:
            conn.executescript(f.read())

def insert_result(original_text, typed_text, accuracy, wpm, errors):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO results (original_text, typed_text, accuracy, wpm, errors)
        VALUES (?, ?, ?, ?, ?)
    """, (original_text, typed_text, accuracy, wpm, errors))
    conn.commit()
    conn.close()

def insert_letter_errors(result_id: int, letters_state: dict):
    with get_connection() as conn:
        cursor = conn.cursor()
        for expected, wrong_map in letters_state.items():
            for wrong_char, count in wrong_map.items():
                cursor.execute("""
                    INSERT INTO letters_errors (result_id, expected_char, wrong_char, count)
                    VALUES (?, ?, ?, ?)
                """, (result_id, expected, wrong_char, count))
        conn.commit()


def get_all_results():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM results ORDER BY CURRENT_TIMESTAMP DESC")
    rows = cursor.fetchall()
    conn.close()
    return [
        {
            "id": row[0],
            "original_text": row[1],
            "typed_text": row[2],
            "accuracy": row[3],
            "wpm": row[4],
            "errors": row[5],
            "CURRENT_TIMESTAMP": row[6]
        }
        for row in rows
    ]

def get_letter_stats():
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT expected_char, SUM(count) as total
            FROM letters_errors
            GROUP BY expected_char
            ORDER BY total DESC
        """)
        rows = cursor.fetchall()
    return {"letters": rows}
