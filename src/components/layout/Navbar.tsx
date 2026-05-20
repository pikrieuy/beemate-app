"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { PostModal } from "@/components/ui/PostModal";
import { motion, AnimatePresence } from "framer-motion";
import { NotificationBell } from "./NotificationBell";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [theme, setTheme] = useState(() => {
    if (typeof document === "undefined") {
      return "dark";
    }
    return document.documentElement.getAttribute("data-theme") || "dark";
  });
  const [isPostOpen, setIsPostOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const navLinks = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "People", path: "/people" },
    { label: "Teams", path: "/teams" },
    { label: "Competitions", path: "/competitions" }
  ];

  return (
    <>
    <nav id="nav">
      <div className="logo" onClick={() => router.push("/")} style={{ gap: '8px' }}>
        <Image
          src={theme === "dark" ? "/logo-dark.png" : "/logo.png"}
          alt="BeeMate Logo"
          width={120}
          height={44}
          style={{
            height: "44px",
            width: "auto",
            objectFit: "contain",
            transform: "scale(1)",
            transformOrigin: "left center",
            transition: "opacity 0.3s ease",
          }}
        />
      </div>
      
      
      <div className="nav-pills hide-on-mobile" id="nav-pills" style={{ display: 'flex' }}>
        {navLinks.map(link => (
          <button 
            key={link.path}
            className={`np ${pathname === link.path ? 'on' : ''}`} 
            onClick={() => router.push(link.path)}
          >
            {link.label}
          </button>
        ))}
      </div>

      <div className="nav-r">
        <NotificationBell />
        <button className="nav-icon hide-on-mobile" onClick={toggleTheme} title="Toggle tema">
          {theme === "dark" ? (
             <i className="ph-fill ph-sun lc"></i>
          ) : (
             <i className="ph-fill ph-moon lc"></i>
          )}
        </button>
        <button className="nav-icon hide-on-mobile" onClick={() => router.push("/settings")}>
          <i className="ph-fill ph-gear lc"></i>
        </button>
        <button className="btn btn-honey btn-sm hide-on-mobile" onClick={() => setIsPostOpen(true)}>
          <i className="ph-fill ph-plus lc"></i> Post
        </button>
        
        {/* Hamburger Toggle (Mobile Only) */}
        <button 
          className="nav-icon show-on-mobile" 
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <i className="ph-fill ph-list lc" style={{ fontSize: '24px' }}></i>
        </button>

        {status === "loading" ? (
          <div className="nav-av hide-on-mobile">...</div>
        ) : session?.user ? (
          <div style={{ position: "relative", display: "inline-flex" }} className="hide-on-mobile">
            <div className="nav-av" onClick={() => router.push("/profile")}>
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt="Avatar"
                  width={40}
                  height={40}
                  unoptimized
                  style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                />
              ) : (
                session.user.name?.charAt(0).toUpperCase() || 'U'
              )}
            </div>
            {(session.user as any).role === "ADMIN" && (
              <div style={{
                position: "absolute", bottom: "-2px", right: "-2px",
                background: "#ef4444", color: "#fff",
                fontSize: "8px", fontWeight: 800,
                padding: "1px 4px", borderRadius: "4px",
                border: "1.5px solid var(--bg)",
                lineHeight: 1.4, letterSpacing: "0.03em",
                pointerEvents: "none",
              }}>
                ADMIN
              </div>
            )}
          </div>
        ) : (
          <button className="btn btn-honey btn-sm hide-on-mobile" onClick={() => signIn("google", { callbackUrl: "/profile" })}>
            Login
          </button>
        )}
      </div>
    </nav>

    {/* MOBILE FULLSCREEN MENU */}
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: 'var(--bg)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Image
                src={theme === "dark" ? "/logo-dark.png" : "/logo.png"}
                alt="Logo"
                width={88}
                height={32}
                style={{ height: "32px", width: "auto" }}
              />
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ background: 'transparent', border: 'none', color: 'var(--t)', fontSize: '28px' }}
            >
              <i className="ph-bold ph-x"></i>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
            {navLinks.map(link => (
              <button
                key={link.path}
                onClick={() => {
                  router.push(link.path);
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  background: pathname === link.path ? 'var(--bg2)' : 'transparent',
                  border: 'none',
                  color: pathname === link.path ? 'var(--t)' : 'var(--t2)',
                  fontSize: '24px',
                  fontWeight: pathname === link.path ? 800 : 500,
                  textAlign: 'left',
                  padding: '12px 16px',
                  borderRadius: '12px'
                }}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: 'auto' }}>
            {session?.user ? (
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div className="nav-av" onClick={() => { setIsMobileMenuOpen(false); router.push("/profile"); }}>
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt="Avatar"
                      width={40}
                      height={40}
                      unoptimized
                      style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                    />
                  ) : (
                    session.user.name?.charAt(0).toUpperCase() || 'U'
                  )}
                </div>
                <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => { setIsMobileMenuOpen(false); router.push("/profile"); }}>
                  <div style={{ fontWeight: 700, color: 'var(--t)' }}>{session.user.name || 'User'}</div>
                  <div style={{ fontSize: '13px', color: 'var(--t2)' }}>{session.user.email}</div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="nav-icon" onClick={() => { setIsMobileMenuOpen(false); router.push("/notifications"); }}>
                     <i className="ph-fill ph-bell lc"></i><span className="unread"></span>
                  </button>
                  <button className="nav-icon" onClick={() => { setIsMobileMenuOpen(false); router.push("/settings"); }}>
                     <i className="ph-fill ph-gear lc"></i>
                  </button>
                  <button className="nav-icon" onClick={toggleTheme}>
                     {theme === "dark" ? <i className="ph-fill ph-sun lc"></i> : <i className="ph-fill ph-moon lc"></i>}
                  </button>
                  <button className="nav-icon" onClick={() => signOut({ callbackUrl: "/" })}>
                    <i className="ph-fill ph-sign-out lc"></i>
                  </button>
                </div>
              </div>
            ) : (
              <button 
                className="btn btn-honey btn-lg" 
                style={{ width: '100%', marginBottom: '16px' }}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  signIn("google", { callbackUrl: "/profile" });
                }}
              >
                Login with Google
              </button>
            )}
            <button 
              className="btn btn-honey btn-lg" 
              style={{ width: '100%' }}
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsPostOpen(true);
              }}
            >
              <i className="ph-fill ph-plus"></i> Post Project
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    <PostModal isOpen={isPostOpen} onClose={() => setIsPostOpen(false)} />
    </>
  );
}
