# app/api/routes_events.py
from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query

from app.db.repo_events import EventsQuery, get_event, list_events
from app.models.events import EventOut, EventsListResponse

router = APIRouter(prefix="/api", tags=["events"])

@router.get("/events", response_model=EventsListResponse)
def api_list_events(
    q: str | None = Query(default=None, description="Keyword search (title contains)"),
    from_: str | None = Query(default=None, alias="from", description="YYYY-MM-DD"),
    to: str | None = Query(default=None, description="YYYY-MM-DD"),
    event_type: str | None = Query(default=None),
    department: str | None = Query(default=None),
    virtual: bool | None = Query(default=None),
    cme: bool | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    sort: str = Query(default="start_at", description="Phase1: start_at only"),
    order: str = Query(default="asc", pattern="^(asc|desc)$"),
) -> EventsListResponse:
    # sort whitelist
    if sort != "start_at":
        raise HTTPException(status_code=400, detail="sort must be start_at in Phase 1")

    query = EventsQuery(
        q=q,
        date_from=from_,
        date_to=to,
        event_type=event_type,
        department=department,
        virtual=virtual,
        cme=cme,
        sort=sort,
        order=order,
        page=page,
        page_size=page_size,
    )

    try:
        items, total = list_events(query)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return EventsListResponse(
        items=[EventOut(**it) for it in items],
        page=page,
        page_size=page_size,
        total=total,
    )

@router.get("/events/{event_id}", response_model=EventOut)
def api_get_event(event_id: int) -> EventOut:
    row = get_event(event_id)
    if not row:
        raise HTTPException(status_code=404, detail="Event not found")
    return EventOut(**row)
