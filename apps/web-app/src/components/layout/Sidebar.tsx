"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  {
    href: "/intelligence",
    label: "Intelligence",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
  },
  {
    href: "/developer",
    label: "API",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
  },
  {
    href: "/billing",
    label: "Billing",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
      </svg>
    ),
  },
  {
    href: "/settings",
    label: "Settings",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

const OWNER_ITEMS = [
  { href: "/owner/engines", label: "Engine Control" },
  { href: "/owner/sites", label: "Site Connections" },
];

interface SidebarProps {
  role: string;
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isOwner = role === "owner" || role === "super_admin";

  const handleSignOut = async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/signin");
  };

  return (
    <>
      <style>{`
        .sidebar-root {
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 220px;
          min-width: 220px;
          background: #080809;
          border-right: 1px solid rgba(255,255,255,0.05);
          position: relative;
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 20px 16px 18px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }

        .sidebar-logo-icon {
          width: 26px;
          height: 26px;
          object-fit: contain;
          filter: drop-shadow(0 0 6px rgba(201,168,76,0.35));
          flex-shrink: 0;
        }

        .sidebar-logo-name {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: -0.02em;
          color: rgba(255,255,255,0.85);
        }

        .sidebar-nav {
          flex: 1;
          overflow-y: auto;
          padding: 10px 8px;
        }

        .sidebar-nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          border-radius: 8px;
          font-size: 13px;
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
          color: rgba(255,255,255,0.55);
          margin-bottom: 1px;
        }

        .sidebar-nav-item:hover {
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.85);
        }

        .sidebar-nav-item.active {
          background: rgba(201,168,76,0.07);
          color: rgba(201,168,76,0.9);
          border: 1px solid rgba(201,168,76,0.12);
        }

        .sidebar-section-label {
          padding: 12px 10px 6px;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
        }

        .sidebar-footer {
          padding: 10px 8px 14px;
          border-top: 1px solid rgba(255,255,255,0.04);
        }

        .sidebar-signout {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 8px 10px;
          border-radius: 8px;
          font-size: 13px;
          color: rgba(255,255,255,0.45);
          background: none;
          border: none;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
          text-align: left;
        }

        .sidebar-signout:hover {
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.7);
        }

        /* ── Mobile bottom nav ── */
        .mobile-nav {
          display: none;
        }

        @media (max-width: 767px) {
          .sidebar-root {
            display: none;
          }

          .mobile-nav {
            display: flex;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 100;
            background: #080809;
            border-top: 1px solid rgba(255,255,255,0.06);
            padding: 8px 0 calc(8px + env(safe-area-inset-bottom, 0px));
          }

          .mobile-nav-item {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 3px;
            padding: 4px 8px;
            font-size: 10px;
            font-weight: 500;
            letter-spacing: 0.01em;
            text-decoration: none;
            color: rgba(255,255,255,0.4);
            transition: color 0.15s;
          }

          .mobile-nav-item:hover,
          .mobile-nav-item.active {
            color: rgba(201,168,76,0.9);
          }

          .mobile-signout {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 3px;
            padding: 4px 8px;
            font-size: 10px;
            font-weight: 500;
            color: rgba(255,255,255,0.4);
            background: none;
            border: none;
            cursor: pointer;
            transition: color 0.15s;
          }

          .mobile-signout:hover {
            color: rgba(255,255,255,0.7);
          }
        }
      `}</style>

      <nav className="sidebar-root">
        {/* Logo */}
        <div className="sidebar-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-icon.png" alt="Chairman AI" className="sidebar-logo-icon" />
          <span className="sidebar-logo-name">Chairman AI</span>
        </div>

        {/* Nav */}
        <div className="sidebar-nav">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-nav-item${active ? " active" : ""}`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}

          {isOwner && (
            <>
              <p className="sidebar-section-label">Owner</p>
              {OWNER_ITEMS.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`sidebar-nav-item${active ? " active" : ""}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </>
          )}
        </div>

        {/* Sign out */}
        <div className="sidebar-footer">
          <button className="sidebar-signout" onClick={handleSignOut}>
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            Sign out
          </button>
        </div>
      </nav>

      {/* Mobile bottom navigation */}
      <nav className="mobile-nav">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href} className={`mobile-nav-item${active ? " active" : ""}`}>
              {item.icon}
              {item.label}
            </Link>
          );
        })}
        <button className="mobile-signout" onClick={handleSignOut}>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          Sign out
        </button>
      </nav>
    </>
  );
}
