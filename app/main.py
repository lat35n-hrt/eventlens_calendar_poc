# app/main.py
from __future__ import annotations

import os
import sqlite3
from pathlib import Path
from fastapi import FastAPI
from app.api.routes_events import router as events_router

APP_ROOT = Path(__file__).resolve().parent.parent
DB_PATH = Path(os.getenv("EVENTLENS_DB_PATH", APP_ROOT / "data" / "eventlens.db"))
SCHEMA_PATH = APP_ROOT / "app" / "db" / "schema.sql"

app = FastAPI(title="eventlens_calendar_poc")
# Register event routes
app.include_router(events_router)


def init_db() -> None:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    schema_sql = SCHEMA_PATH.read_text(encoding="utf-8")
    with sqlite3.connect(DB_PATH) as conn:
        conn.executescript(schema_sql)
        conn.commit()

@app.on_event("startup")
def on_startup() -> None:
    init_db()

@app.get("/health")
def health() -> dict:
    return {"status": "ok", "db_path": str(DB_PATH)}

