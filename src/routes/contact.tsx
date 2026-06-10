import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { useCompanyInfo } from "@/lib/queries";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Kontak · Crown Court Executive Condominium" },
      { name: "description", content: "Alamat, telepon, WhatsApp, dan email Crown Court Executive Condominium." },
      { property: "og:title", content: "Kontak · Crown Court" },
      { property: "og:description", content: "Hubungi tim Crown Court untuk informasi dan reservasi." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { data: info } = useCompanyInfo();
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-28">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Kontak</p>
        <h1 className="mt-4 text-5xl md:text-6xl">Mari berbincang.</h1>
        <p className="mt-6 max-w-xl text-muted-foreground">
          Tim sales kami siap membantu Anda menjadwalkan kunjungan ke show unit dan menjelaskan opsi pembiayaan.
        </p>

        <div className="mt-16 grid gap-12 md:grid-cols-2">
          <div className="space-y-8">
            <Field label="Alamat" value={info?.address} />
            <Field label="Telepon" value={info?.phone} href={info?.phone ? `tel:${info.phone}` : undefined} />
            <Field
              label="WhatsApp"
              value={info?.whatsapp}
              href={info?.whatsapp ? `https://wa.me/${info.whatsapp.replace(/\D/g, "")}` : undefined}
            />
            <Field label="Email" value={info?.email} href={info?.email ? `mailto:${info.email}` : undefined} />
          </div>
          <div className="space-y-8">
            <Field label="Instagram" value={info?.instagram} />
            <Field label="Facebook" value={info?.facebook} />
            <Field label="Website" value={info?.website} href={info?.website ?? undefined} />
            <div className="rounded-xl bg-secondary p-8">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Jam Operasional</p>
              <p className="mt-3 text-sm leading-relaxed">
                Senin – Minggu<br />10.00 – 18.00 WIB
              </p>
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

function Field({ label, value, href }: { label: string; value?: string | null; href?: string }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      {href ? (
        <a href={href} className="mt-2 inline-block text-lg underline-offset-4 hover:underline">
          {value}
        </a>
      ) : (
        <p className="mt-2 text-lg">{value}</p>
      )}
    </div>
  );
}
