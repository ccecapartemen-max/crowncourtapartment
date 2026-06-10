import { Link } from "@tanstack/react-router";
import { useCompanyInfo } from "@/lib/queries";

export function SiteFooter() {
  const { data: info } = useCompanyInfo();
  return (
    <footer className="mt-32 border-t border-border/60 bg-secondary/40">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-3">
        <div>
          <h3 className="font-display text-2xl">Crown Court</h3>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Executive Condominium
          </p>
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted-foreground">
            {info?.tagline ?? "Hunian eksekutif yang menyatukan kenyamanan, privasi, dan ketenangan."}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Kunjungi</p>
          <p className="mt-4 text-sm leading-relaxed">{info?.address ?? ""}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Hubungi</p>
          <ul className="mt-4 space-y-1.5 text-sm">
            {info?.phone && <li>{info.phone}</li>}
            {info?.email && <li>{info.email}</li>}
            {info?.whatsapp && <li>WhatsApp · {info.whatsapp}</li>}
            {info?.instagram && <li>Instagram · {info.instagram}</li>}
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Crown Court Executive Condominium. All rights reserved.</p>
          <Link to="/auth" className="hover:text-foreground">Area Admin</Link>
        </div>
      </div>
    </footer>
  );
}
