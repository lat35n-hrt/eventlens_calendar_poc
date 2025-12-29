# db/conn.py
from __future__ import annotations

import os
import sqlite3
from pathlib import Path

APP_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_DB_PATH = APP_ROOT / "data" / "eventlens.db"

def get_db_path() -> Path:
    return Path(os.getenv("EVENTLENS_DB_PATH", str(DEFAULT_DB_PATH)))

def connect() -> sqlite3.Connection:
    db_path = get_db_path()
    db_path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn
