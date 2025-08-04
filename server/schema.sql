CREATE TABLE IF NOT EXISTS results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    original_text TEXT,
    typed_text TEXT,
    accuracy REAL,
    wpm REAL,
    errors INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS letters_errors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    result_id INTEGER,
    expected_char TEXT,
    wrong_char TEXT,
    count INTEGER,
    FOREIGN KEY(result_id) REFERENCES results(id)
);



