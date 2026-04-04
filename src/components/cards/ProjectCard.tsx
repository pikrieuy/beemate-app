"use client";

import { Project } from "@/lib/data";

export function ProjectCard({ project, onClick, onApply }: { project: Project; onClick: () => void; onApply: (e: React.MouseEvent) => void }) {
  return (
    <div className="proj-card" onClick={onClick}>
      <div className="proj-top">
        <span className={`bdg ${project.badge}`}>{project.type}</span>
        <span className={`proj-deadline ${project.urgent ? 'urgent' : ''}`}>
           <i className={`ph-fill ${project.urgent ? 'ph-clock' : 'ph-calendar-blank'}`}></i> {project.deadline}
        </span>
      </div>
      <div className="proj-title">{project.title}</div>
      <div className="proj-desc">{project.desc}</div>
      <div className="proj-needs-label">Slot Terbuka</div>
      <div className="proj-tags">
        {project.needs.map(n => (
          <span key={n} className={`proj-tag ${project.open.includes(n) ? 'open' : ''}`}>{n}</span>
        ))}
      </div>
      <div className="proj-foot">
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div className="av av-24" style={{ background: project.pcolor }}>{project.poster}</div>
          <span style={{ fontSize: "10px", color: "var(--t2)" }}>{project.posterName}</span>
        </div>
        <button className="apply-btn" onClick={onApply}>Apply →</button>
      </div>
    </div>
  );
}
