import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero.jpg";
import unit1 from "@/assets/unit-1.jpg";
import unit2 from "@/assets/unit-2.jpg";
import unit3 from "@/assets/unit-3.jpg";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { useCompanyInfo, useProducts, useNews, formatRupiah, formatDate } from "@/lib/queries";

const unitImages = [unit1, unit2, unit3];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Crown Court Executive Condominium — Hunian Eksekutif Premium" },
      { name: "description", content: "Hunian eksekutif minimalis modern di Jakarta Selatan. Studio, 2 Bedroom, dan Penthouse." },
      { property: "og:title", content: "Crown Court Executive Condominium" },
      { property: "og:description", content: "Hunian eksekutif minimalis modern di Jakarta Selatan." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  const { data: info } = useCompanyInfo();
  const { data: products } = useProducts();
  const { data: news } = useNews();
  const featured = (products ?? []).filter((p) => p.is_featured).slice(0, 3);
  const latestNews = (news ?? []).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      {/* Hero */}
      <section className="relative">
        <div className="relative h-[88vh] min-h-[560px] w-full overflow-hidden">
          <img
            src={heroImg}
            alt="Fasad Crown Court Executive Condominium"
            width={1920}
            height={1080}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/30 to-background" />
          <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-end px-6 pb-20">
            <p className="text-xs uppercase tracking-[0.3em] text-foreground/70">
              {"\n"}
            </p>
            <h1 className="mt-4 max-w-3xl text-5xl leading-[1.05] sm:text-6xl md:text-7xl">
              Crown Court
              <br />
              <span className="text-primary">Executive Condominium</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-foreground/80">
              {info?.tagline ?? "Hunian eksekutif yang menyatukan kenyamanan, privasi, dan ketenangan."}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/units"
                className="rounded-full bg-foreground px-6 py-3 text-sm uppercase tracking-widest text-background transition-colors hover:bg-primary"
              >
                Lihat Unit
              </Link>
              <Link
                to="/contact"
                className="rounded-full border border-foreground/40 px-6 py-3 text-sm uppercase tracking-widest text-foreground transition-colors hover:border-foreground"
              >
                Jadwalkan Kunjungan
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="mx-auto max-w-6xl px-6 py-28">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Tentang</p>
            <h2 className="mt-4 text-4xl leading-tight">Tenang. Tertata.<br />Tepat di pusat kota.</h2>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <p className="text-base leading-relaxed text-muted-foreground">
              {info?.about}
            </p>
            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-8">
              <Stat label={"\n"} value={"\n"} />
              <Stat label={"\n"} value={"\n"} />
              <Stat label={"\n"} value={"\n"} />
            </dl>
          </div>
        </div>
        {info?.about_video_url && (() => {
          const embed = youtubeEmbedUrl(info.about_video_url);
          if (!embed) return null;
          return (
            <div className="mt-16">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Video</p>
              <h3 className="mt-3 text-2xl">Lihat Lebih Dekat</h3>
              <div className="mt-6 aspect-video w-full overflow-hidden rounded-lg border border-border">
                <iframe
                  src={embed}
                  title="Video Tentang"
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          );
        })()}
      </section>

      {/* Units */}
      <section className="bg-secondary/40 py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Produk</p>
              <h2 className="mt-3 text-4xl">Pilihan Unit</h2>
            </div>
            <Link to="/units" className="hidden text-sm underline-offset-4 hover:underline md:inline">
              Semua unit →
            </Link>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {featured.map((p, i) => (
              <article key={p.id} className="group">
                <div className="aspect-[4/5] overflow-hidden bg-muted">
                  <img
                    src={p.image_url ?? unitImages[i % 3]}
                    alt={p.name}
                    width={1280}
                    height={960}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="mt-5">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">{p.unit_type}</p>
                  <h3 className="mt-1 text-2xl">{p.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {p.size_sqm} m² · {p.bedrooms} KT · {p.bathrooms} KM
                  </p>
                  <p className="mt-3 text-sm">Mulai {formatRupiah(p.price_from)}</p>
                  {(p.marketing_name || p.marketing_contact) && (
                    <div className="mt-4 border-t border-border pt-3">
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">Marketing</p>
                      {p.marketing_name && <p className="mt-1 text-sm">{p.marketing_name}</p>}
                      {p.marketing_contact && (
                        <a
                          href={`tel:${p.marketing_contact}`}
                          className="text-sm text-muted-foreground hover:text-foreground"
                        >
                          {p.marketing_contact}
                        </a>
                      )}
                    </div>
                  )}
                </div>

              </article>
            ))}
          </div>
        </div>
      </section>

      {/* News */}
      <section className="mx-auto max-w-6xl px-6 py-28">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Update</p>
            <h2 className="mt-3 text-4xl">Berita Terkini</h2>
          </div>
          <Link to="/news" className="hidden text-sm underline-offset-4 hover:underline md:inline">
            Semua berita →
          </Link>
        </div>
        <ul className="mt-12 divide-y divide-border border-y border-border">
          {latestNews.map((n) => (
            <li key={n.id}>
              <Link to="/news" className="grid gap-6 py-8 transition-colors hover:bg-secondary/40 md:grid-cols-12">
                <p className="text-xs uppercase tracking-widest text-muted-foreground md:col-span-3">
                  {formatDate(n.published_at)}
                </p>
                <div className="md:col-span-8">
                  <h3 className="text-2xl leading-snug">{n.title}</h3>
                  {n.excerpt && <p className="mt-2 text-sm text-muted-foreground">{n.excerpt}</p>}
                </div>
                <span className="text-right text-sm text-muted-foreground md:col-span-1">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-28">
        <div className="rounded-2xl bg-primary p-12 text-primary-foreground md:p-20">
          <h2 className="max-w-2xl text-4xl leading-tight md:text-5xl">
            Siap melihat langsung show unit kami?
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-primary-foreground/80">
            Tim kami siap mengantarkan Anda berkeliling, menjelaskan rencana pembiayaan, dan menjawab semua pertanyaan.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-block rounded-full bg-background px-6 py-3 text-sm uppercase tracking-widest text-foreground transition-colors hover:bg-accent"
          >
            Hubungi Kami
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-widest text-muted-foreground">{label}</dt>
      <dd className="mt-2 font-display text-3xl">{value}</dd>
    </div>
  );
}
