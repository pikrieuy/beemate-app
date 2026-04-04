"use client";

import { Person } from "@/lib/data";

export function PersonCard({ person, onInvite }: { person: Person; onInvite: (e: React.MouseEvent) => void }) {
  return (
    <div className="person-card" onClick={() => {}}>
      <div className="av av-52" style={{ background: person.color, margin: "0 auto 10px" }}>{person.init}</div>
      <div className="pc-name">{person.n}</div>
      <div className="pc-major">{person.major}</div>
      <div className="pc-campus">{person.campus}</div>
      <div className="pc-skills">
        {person.skills.map((s, i) => (
          <span key={i} className="chip on" style={{ fontSize: "9px", padding: "2px 7px", cursor: "default" }}>{s}</span>
        ))}
      </div>
      <div className="pc-score">
        <i className="ph-fill ph-star" style={{ color: "var(--ho)", fontSize: "11px" }}></i> 
        <b>{person.score}</b> · {person.collabs} kolaborasi
      </div>
      <div style={{ marginBottom: "8px" }}>
        <span className={`status ${person.status === 'open' ? 'status-open' : 'status-busy'}`}>
          {person.status === 'open' ? 'Open to Team' : 'Sedang Sibuk'}
        </span>
      </div>
      <button className="invite-btn" onClick={onInvite}>Invite to Team</button>
    </div>
  );
}
