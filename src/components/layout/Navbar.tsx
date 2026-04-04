"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const root = document.documentElement;
    const currentTheme = root.getAttribute("data-theme") || "dark";
    setTheme(currentTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <nav id="nav">
      <div className="logo" onClick={() => router.push("/")} style={{ gap: '8px' }}>
        <img 
          src="/logo.png" 
          alt="BeeMate Logo" 
          style={{ height: '48px', width: 'auto', objectFit: 'contain', transform: 'scale(1.1)', transformOrigin: 'left center' }} 
        />
      </div>
      
      <div className="nav-pills" id="nav-pills">
        <button className={`np ${pathname === '/explore' ? 'on' : ''}`} onClick={() => router.push("/explore")}>Explore</button>
        <button className={`np ${pathname === '/people' ? 'on' : ''}`} onClick={() => router.push("/people")}>People</button>
        <button className={`np ${pathname === '/competitions' ? 'on' : ''}`} onClick={() => router.push("/competitions")}>Lomba</button>
        <button className={`np ${pathname === '/myteams' ? 'on' : ''}`} onClick={() => router.push("/myteams")}>Tim Saya</button>
      </div>

      <div className="nav-r">
        <button className="nav-icon"><i className="ph-fill ph-bell lc"></i><span className="unread"></span></button>
        <button className="nav-icon" onClick={toggleTheme} title="Toggle tema">
          {theme === "dark" ? (
             <i className="ph-fill ph-sun lc"></i>
          ) : (
             <i className="ph-fill ph-moon lc"></i>
          )}
        </button>
        <button className="nav-icon"><i className="ph-fill ph-gear lc"></i></button>
        <button className="btn btn-honey btn-sm"><i className="ph-fill ph-plus lc"></i> Post</button>
        <div className="nav-av" onClick={() => router.push("/profile")}>RK</div>
      </div>
    </nav>
  );
}
