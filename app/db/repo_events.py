from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Optional

from app.db.conn import connect

@dataclass(frozen=True)
class EventsQuery:
    q: Optional[str] = None
    date_from: Optional[str] = None  # YYYY-MM-DD
    date_to: Optional[str] = None    # YYYY-MM-DD
    event_type: Optional[str] = None
    department: Optional[str] = None
    virtual: Optional[bool] = None
    cme: Optional[bool] = None
    sort: str = "start_at"
    order: str = "asc"
    page: int = 1
    page_size: int = 20

def _build_where(q: EventsQuery) -> tuple[str, list[Any]]:
    clauses: list[str] = ["status = 'active'"]
    params: list[Any] = []

    if q.q:
        clauses.append("title LIKE ?")
        params.append(f"%{q.q}%")

    # Phase 1: start_at is ISO8601 string. Filter by date prefix (YYYY-MM-DD).
    if q.date_from:
        clauses.append("substr(start_at, 1, 10) >= ?")
        params.append(q.date_from)
    if q.date_to:
        clauses.append("substr(start_at, 1, 10) <= ?")
        params.append(q.date_to)

    if q.event_type:
        clauses.append("event_type = ?")
        params.append(q.event_type)

    if q.department:
        # departments is stored as JSON string (e.g. ["Medicine","Neurology"])
        # naive containment check:
        clauses.append("departments LIKE ?")
        params.append(f'%"{q.department}"%')

    if q.virtual is not None:
        clauses.append("is_virtual = ?")
        params.append(1 if q.virtual else 0)

    if q.cme is not None:
        clauses.append("cme_eligible = ?")
        params.append(1 if q.cme else 0)

    where_sql = " AND ".join(clauses) if clauses else "1=1"
    return where_sql, params

def list_events(q: EventsQuery) -> tuple[list[dict[str, Any]], int]:
    if q.page < 1:
        raise ValueError("page must be >= 1")
    if q.page_size < 1 or q.page_size > 100:
        raise ValueError("page_size must be 1..100")

    sort_col = "start_at"  # whitelist
    order = "DESC" if q.order.lower() == "desc" else "ASC"

    where_sql, params = _build_where(q)

    offset = (q.page - 1) * q.page_size
    limit = q.page_size

    with connect() as conn:
        total_row = conn.execute(
            f"SELECT COUNT(1) AS cnt FROM events WHERE {where_sql}",
            params
        ).fetchone()
        total = int(total_row["cnt"]) if total_row else 0

        rows = conn.execute(
            f"""
            SELECT
              id, source, uid, fingerprint, source_event_url, ics_url, external_url,
              title, event_type, departments, location, is_virtual, cme_eligible, cme_credits,
              start_at, end_at, timezone,
              first_seen_at, last_seen_at, status
            FROM events
            WHERE {where_sql}
            ORDER BY {sort_col} {order}, id {order}
            LIMIT ? OFFSET ?
            """,
            [*params, limit, offset],
        ).fetchall()

        items = [dict(r) for r in rows]
        return items, total

def get_event(event_id: int) -> Optional[dict[str, Any]]:
    with connect() as conn:
        row = conn.execute(
            """
            SELECT
              id, source, uid, fingerprint, source_event_url, ics_url, external_url,
              title, event_type, departments, location, is_virtual, cme_eligible, cme_credits,
              start_at, end_at, timezone,
              first_seen_at, last_seen_at, status
            FROM events
            WHERE id = ?
            """,
            (event_id,),
        ).fetchone()
        return dict(row) if row else None
