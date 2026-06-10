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
            <Field label="TIKTOK" value={info?.tiktok} />
            <Field label="Website" value={info?.website} href={info?.website ?? undefined} />
            <div className="rounded-xl bg-secondary p-8">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Jam Operasional</p>
              <p className="mt-3 text-sm leading-relaxed">
                Senin – Minggu<br />10.00 – 18.00 WIB
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20 border-t pt-16">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Marketing</p>
          <h2 className="mt-4 text-3xl md:text-4xl">Hubungi tim marketing kami.</h2>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Konsultasi langsung dengan marketing executive untuk informasi unit, harga, dan jadwal kunjungan.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <MarketingCard
              name="Sarah Wijaya"
              role="Senior Marketing Executive"
              phone="+62 812-3456-7890"
              whatsapp="6281234567890"
              email="sarah@crowncourt.id"
            />
            <MarketingCard
              name="Andre Pratama"
              role="Marketing Executive"
              phone="+62 813-9876-5432"
              whatsapp="6281398765432"
              email="andre@crowncourt.id"
            />
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

function MarketingCard({
  name,
  role,
  phone,
  whatsapp,
  email,
}: {
  name: string;
  role: string;
  phone: string;
  whatsapp: string;
  email: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-8">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{role}</p>
      <p className="mt-2 text-xl font-medium">{name}</p>
      <div className="mt-6 space-y-3 text-sm">
        <a href={`tel:${phone}`} className="block underline-offset-4 hover:underline">
          {phone}
        </a>
        <a
          href={`https://wa.me/${whatsapp}`}
          target="_blank"
          rel="noreferrer"
          className="block underline-offset-4 hover:underline"
        >
          WhatsApp · {whatsapp}
        </a>
        <a href={`mailto:${email}`} className="block underline-offset-4 hover:underline">
          {email}
        </a>
      </div>
    </div>
  );
}
