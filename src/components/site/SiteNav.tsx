import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const links = [
  { to: "/", label: "Beranda" },
  { to: "/units", label: "Unit" },
  { to: "/news", label: "Berita" },
  { to: "/contact", label: "Kontak" },
] as const;

export function SiteNav() {
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setHasSession(!!data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setHasSession(!!s));
    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="font-display text-xl tracking-tight">Crown Court</span>
          <span className="hidden text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:inline">
            Executive Condominium
          </span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to={hasSession ? "/admin" : "/auth"}
            className="rounded-full border border-foreground/80 px-4 py-1.5 text-xs uppercase tracking-widest text-foreground transition-colors hover:bg-foreground hover:text-background"
          >
            {hasSession ? "Admin" : "Masuk"}
          </Link>
        </nav>
        <nav className="flex gap-4 md:hidden">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="text-xs text-muted-foreground">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
