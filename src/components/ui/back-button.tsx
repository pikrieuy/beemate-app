import { ArrowLeft } from "lucide-react";

export function BackButton() {
  return (
    <button className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--t2)] transition-all duration-300 rounded-full hover:bg-[var(--bg2)] hover:text-[var(--t)] hover:shadow-sm border border-transparent hover:border-[var(--bdr)] active:scale-95">
      <ArrowLeft
        className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1"
        strokeWidth={2.5}
      />
      <span>Kembali</span>
    </button>
  );
}