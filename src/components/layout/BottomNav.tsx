"use client";

import { usePathname, useRouter } from "next/navigation";

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div id="bottom-nav">
      <button className={`bnav-item ${pathname === '/explore' ? 'on' : ''}`} onClick={() => router.push('/explore')}>
        <i className="ph-fill ph-squares-four lc lc-lg"></i>Explore
      </button>
      <button className={`bnav-item ${pathname === '/people' ? 'on' : ''}`} onClick={() => router.push('/people')}>
        <i className="ph-fill ph-users lc lc-lg"></i>People
      </button>
      <button className="bnav-post" title="Post Project">
        <i className="ph-fill ph-plus lc" style={{ width: 22, height: 22 }}></i>
      </button>
      <button className={`bnav-item ${pathname === '/competitions' ? 'on' : ''}`} onClick={() => router.push('/competitions')}>
        <i className="ph-fill ph-trophy lc lc-lg"></i>Lomba
      </button>
      <button className={`bnav-item ${pathname === '/myteams' ? 'on' : ''}`} onClick={() => router.push('/myteams')}>
        <i className="ph-fill ph-users-three lc lc-lg"></i>Tim
      </button>
    </div>
  );
}
