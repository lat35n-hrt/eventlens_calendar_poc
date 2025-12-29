# app/models/events.py
from __future__ import annotations

from typing import Any, Optional
from pydantic import BaseModel, Field

class EventOut(BaseModel):
    id: int
    source: str
    uid: Optional[str] = None
    fingerprint: str
    source_event_url: Optional[str] = None
    ics_url: Optional[str] = None
    external_url: Optional[str] = None

    title: str
    event_type: Optional[str] = None
    departments: Optional[str] = None  # JSON string in Phase 1
    location: Optional[str] = None
    is_virtual: int = Field(ge=0, le=1)
    cme_eligible: int = Field(ge=0, le=1)
    cme_credits: Optional[float] = None

    start_at: str
    end_at: Optional[str] = None
    timezone: Optional[str] = None

    first_seen_at: str
    last_seen_at: str
    status: str

class EventsListResponse(BaseModel):
    items: list[EventOut]
    page: int
    page_size: int
    total: int