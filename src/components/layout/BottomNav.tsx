"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { PostModal } from "@/components/ui/PostModal";

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isPostOpen, setIsPostOpen] = useState(false);

  return (
    <>
      <div id="bottom-nav">
        <button
          className={`bnav-item ${pathname === '/explore' ? 'on' : ''}`}
          onClick={() => router.push('/explore')}
        >
          <i className="ph-fill ph-squares-four lc lc-lg" />Explore
        </button>
        <button
          className={`bnav-item ${pathname === '/people' ? 'on' : ''}`}
          onClick={() => router.push('/people')}
        >
          <i className="ph-fill ph-users lc lc-lg" />People
        </button>
        <button
          className="bnav-post"
          title="Post Project"
          onClick={() => setIsPostOpen(true)}
        >
          <i className="ph-fill ph-plus lc" style={{ width: 22, height: 22 }} />
        </button>
        <button
          className={`bnav-item ${pathname === '/competitions' ? 'on' : ''}`}
          onClick={() => router.push('/competitions')}
        >
          <i className="ph-fill ph-trophy lc lc-lg" />Lomba
        </button>
        <button
          className={`bnav-item ${pathname === '/myteams' ? 'on' : ''}`}
          onClick={() => router.push('/myteams')}
        >
          <i className="ph-fill ph-users-three lc lc-lg" />Tim
        </button>
      </div>

      <PostModal isOpen={isPostOpen} onClose={() => setIsPostOpen(false)} />
    </>
  );
}
