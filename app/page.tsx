"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  GitBranch,
  Plus,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

type Situation = {
  id: string;
  title: string;
  status: string;
  progress: number;
  documents?: unknown[];
  actions?: unknown[];
  missingItems?: unknown[];
};

const demo: Situation = {
  id: "demo",
  title: "Family document renewal",
  status: "ACTIVE",
  progress: 68,
  documents: [{}, {}],
  actions: [{}, {}],
  missingItems: [{}, {}],
};

export default function Home() {
  const [situations, setSituations] = useState<Situation[]>([]);
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  const load = () =>
    fetch("/api/situations")
      .then(async (r) => {
        if (!r.ok) throw new Error();
        const j = await r.json();
        setSituations(j.situations || []);
      })
      .catch(() => setSituations([demo]))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const add = async () => {
    const title = name.trim();
    if (!title) return;

    try {
      const r = await fetch("/api/situations", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title }),
      });

      if (!r.ok) throw new Error();

      setName("");
      setShow(false);
      load();
    } catch {
      setSituations((s) => [
        {
          id: "local-" + Date.now(),
          title,
          status: "ACTIVE",
          progress: 8,
          documents: [],
          actions: [],
          missingItems: [],
        },
        ...s,
      ]);
      setName("");
      setShow(false);
    }
  };

  return (
    <main>
      <header>
        <div className="brand">
          <div className="logo">C</div>
          <div>
            <b>CueMesh</b>
            <span>Situation intelligence</span>
          </div>
        </div>
        <button className="ghost">
          <ShieldCheck size={16} /> Human-controlled
        </button>
      </header>

      <section className="hero">
        <div>
          <div className="eyebrow">
            <Sparkles size={15} /> UNDERSTAND THE WHOLE SITUATION
          </div>
          <h1>
            From scattered information
            <br />
            <em>to clear next steps.</em>
          </h1>
          <p>
            CueMesh connects documents, people, deadlines and actions into one
            evidence-backed situation. AI proposes. You decide.
          </p>
          <button className="primary" onClick={() => setShow(true)}>
            <Plus size={18} /> New situation <ArrowRight size={17} />
          </button>
        </div>

        <div className="heroCard">
          <div className="miniTitle">Situation health</div>
          <div className="score">
            72<span>/100</span>
          </div>
          <div className="bar">
            <i style={{ width: "72%" }} />
          </div>
          <p>Connected context at a glance</p>
          <div className="chips">
            <span>✓ Evidence linked</span>
            <span>! Gaps visible</span>
          </div>
        </div>
      </section>

      <section className="content">
        <div className="sectionHead">
          <div>
            <h2>Your situations</h2>
            <p>
              {loading
                ? "Loading your situations…"
                : "Everything important, in context."}
            </p>
          </div>
          <button className="secondary" onClick={() => setShow(true)}>
            <Plus size={16} /> Create
          </button>
        </div>

        <div className="grid">
          {situations.map((s) => (
            <article className="card" key={s.id}>
              <div className="cardTop">
                <span className="status">
                  <span /> {s.status}
                </span>
                <span className="muted">Situation</span>
              </div>

              <h3>{s.title}</h3>

              <div className="progress">
                <div>
                  <span>Situation completeness</span>
                  <b>{s.progress}%</b>
                </div>
                <div className="bar">
                  <i style={{ width: s.progress + "%" }} />
                </div>
              </div>

              <div className="meta">
                <span>
                  <FileText size={15} />
                  {s.documents?.length || 0} documents ·{" "}
                  {s.actions?.length || 0} actions
                </span>
                <span className="warning">
                  <AlertTriangle size={15} />
                  {s.missingItems?.length || 0} gaps
                </span>
              </div>

              {s.id.startsWith("local-") ? (
                <button className="open" disabled>
                  Save when database is connected <ArrowRight size={16} />
                </button>
              ) : (
                <Link className="open" href={"/situations/" + s.id}>
                  Open situation <ArrowRight size={16} />
                </Link>
              )}
            </article>
          ))}

          {!loading && (
            <article className="empty" onClick={() => setShow(true)}>
              <div>
                <Plus />
              </div>
              <b>Start a new situation</b>
              <span>Family, work, travel, documents, anything important.</span>
            </article>
          )}
        </div>
      </section>

      <section className="features">
        <div>
          <GitBranch />
          <b>Life graph</b>
          <span>
            See how people, documents, events and actions connect.
          </span>
        </div>
        <div>
          <AlertTriangle />
          <b>Gap detection</b>
          <span>Find what is missing before it becomes a problem.</span>
        </div>
        <div>
          <CheckCircle2 />
          <b>Human approval</b>
          <span>Nothing important executes without your approval.</span>
        </div>
        <div>
          <Clock3 />
          <b>Follow-up</b>
          <span>Keep track after the immediate task is done.</span>
        </div>
      </section>

      {show && (
        <div className="modal">
          <div className="dialog">
            <button className="close" onClick={() => setShow(false)}>
              ×
            </button>
            <div className="eyebrow">
              <Sparkles size={14} /> NEW SITUATION
            </div>
            <h2>What are you dealing with?</h2>
            <p>
              Give the situation a simple name. You can add documents and
              details later.
            </p>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && add()}
              placeholder="e.g. Home loan application"
            />
            <button className="primary full" onClick={add}>
              Create situation <ArrowRight size={17} />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
