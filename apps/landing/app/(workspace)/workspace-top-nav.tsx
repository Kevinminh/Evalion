"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

import { revalidateAuthState } from "@/lib/auth-actions";
import { authClient } from "@/lib/auth-client";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function WorkspaceTopNav() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (open && !menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && open) setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function handleLogout() {
    startTransition(async () => {
      await authClient.signOut();
      await revalidateAuthState();
      router.push("/");
    });
  }

  const userName = session?.user?.name ?? "Bruker";
  const initials = getInitials(userName);

  return (
    <>
      <nav className="workspace-top-nav">
        <Link href="/" className="workspace-top-nav-link" aria-label="Til forsiden">
          <img
            className="workspace-top-nav-logo"
            src="/assets/CO-LAB (Hoved) - uten skygge.png"
            alt="CO-LAB"
          />
        </Link>
      </nav>

      <div className="workspace-profile-menu" ref={menuRef}>
        <button
          type="button"
          className="workspace-profile-btn"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={(e) => {
            e.stopPropagation();
            setOpen((v) => !v);
          }}
          disabled={pending}
        >
          <span className="workspace-profile-initials">{initials}</span>
          <svg
            className="workspace-profile-chevron"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        <div className="workspace-profile-dropdown" role="menu" hidden={!open}>
          <Link href="/lag-pastander" className="workspace-profile-dropdown-item" role="menuitem">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 2 14.39 8.26 21 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.61-1.01L12 2z" />
            </svg>
            Lag påstander
          </Link>
          <div className="workspace-profile-dropdown-divider" />
          <button
            type="button"
            className="workspace-profile-dropdown-item"
            role="menuitem"
            onClick={handleLogout}
            disabled={pending}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logg ut
          </button>
        </div>
      </div>
    </>
  );
}
