import { useEffect, useMemo, useState } from "react";

type EventItem = {
  id: number;
  source: string;
  title: string;
  event_type?: string | null;
  departments?: string | null; // Phase 1: JSON string
  location?: string | null;
  is_virtual: number;
  cme_eligible: number;
  cme_credits?: number | null;
  start_at: string;
  end_at?: string | null;
};

type EventsResponse = {
  items: EventItem[];
  page: number;
  page_size: number;
  total: number;
};

function toQuery(params: Record<string, string | number | boolean | undefined>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined) continue;
    if (typeof v === "boolean") sp.set(k, v ? "true" : "false");
    else sp.set(k, String(v));
  }
  return sp.toString();
}

export default function App() {
  const [q, setQ] = useState("");
  const [department, setDepartment] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [cme, setCme] = useState(false);
  const [virtual, setVirtual] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const [data, setData] = useState<EventsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const queryString = useMemo(() => {
    return toQuery({
      q: q || undefined,
      department: department || undefined,
      from: from || undefined,
      to: to || undefined,
      cme: cme ? true : undefined,
      virtual: virtual ? true : undefined,
      page,
      page_size: pageSize,
      order: "asc"
    });
  }, [q, department, from, to, cme, virtual, page, pageSize]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setErr(null);
      try {
        const res = await fetch(`/api/events?${queryString}`);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const json = (await res.json()) as EventsResponse;
        if (!cancelled) setData(json);
      } catch (e: any) {
        if (!cancelled) setErr(e?.message ?? "Unknown error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [queryString]);

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.page_size)) : 1;

  return (
    <div style={{ maxWidth: 1100, margin: "24px auto", padding: 16, fontFamily: "system-ui, -apple-system" }}>
      <h1 style={{ marginBottom: 8 }}>EventLens Calendar PoC</h1>
      <p style={{ marginTop: 0, color: "#444" }}>
        Search / filter / paginate events from the backend API.
      </p>

      <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, marginBottom: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 8 }}>
          <label>
            Keyword (q)
            <input
              value={q}
              onChange={(e) => { setPage(1); setQ(e.target.value); }}
              placeholder="e.g. Oncology"
              style={{ width: "100%", padding: 8 }}
            />
          </label>

          <label>
            Department
            <input
              value={department}
              onChange={(e) => { setPage(1); setDepartment(e.target.value); }}
              placeholder='e.g. Medicine'
              style={{ width: "100%", padding: 8 }}
            />
          </label>

          <label>
            From
            <input
              type="date"
              value={from}
              onChange={(e) => { setPage(1); setFrom(e.target.value); }}
              style={{ width: "100%", padding: 8 }}
            />
          </label>

          <label>
            To
            <input
              type="date"
              value={to}
              onChange={(e) => { setPage(1); setTo(e.target.value); }}
              style={{ width: "100%", padding: 8 }}
            />
          </label>
        </div>

        <div style={{ display: "flex", gap: 16, marginTop: 10, alignItems: "center" }}>
          <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input
              type="checkbox"
              checked={cme}
              onChange={(e) => { setPage(1); setCme(e.target.checked); }}
            />
            CME only
          </label>

          <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input
              type="checkbox"
              checked={virtual}
              onChange={(e) => { setPage(1); setVirtual(e.target.checked); }}
            />
            Virtual only
          </label>

          <label style={{ marginLeft: "auto" }}>
            Page size
            <select
              value={pageSize}
              onChange={(e) => { setPage(1); setPageSize(Number(e.target.value)); }}
              style={{ marginLeft: 8, padding: 6 }}
            >
              <option value={20}>20</option>
              <option value={10}>10</option>
              <option value={5}>5</option>
              <option value={1}>1</option>
            </select>
          </label>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1 || loading}>
          Prev
        </button>
        <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages || loading}>
          Next
        </button>

        <div style={{ color: "#444" }}>
          Page {page} / {totalPages}{" "}
          {data ? `(total: ${data.total})` : ""}
        </div>

        <div style={{ marginLeft: "auto", color: "#666" }}>
          {loading ? "Loading..." : err ? `Error: ${err}` : ""}
        </div>
      </div>

      <div style={{ borderTop: "1px solid #ddd" }}>
        {data?.items?.map((ev) => (
          <div key={ev.id} style={{ padding: "12px 4px", borderBottom: "1px solid #eee" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
              <div style={{ fontWeight: 700 }}>{ev.title}</div>
              <div style={{ color: "#666" }}>{ev.event_type ?? ""}</div>
            </div>
            <div style={{ color: "#444", marginTop: 4 }}>
              <span>{ev.start_at}</span>
              {ev.location ? <span> · {ev.location}</span> : null}
              {ev.is_virtual === 1 ? <span> · Virtual</span> : null}
              {ev.cme_eligible === 1 ? <span> · CME{ev.cme_credits ? ` (${ev.cme_credits})` : ""}</span> : null}
            </div>
            {ev.departments ? (
              <div style={{ color: "#666", marginTop: 4 }}>
                Departments: {ev.departments}
              </div>
            ) : null}
          </div>
        ))}

        {!loading && !err && data && data.items.length === 0 ? (
          <div style={{ padding: 16, color: "#666" }}>No results.</div>
        ) : null}
      </div>
    </div>
  );
}
