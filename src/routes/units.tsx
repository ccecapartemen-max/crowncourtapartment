import { createFileRoute } from "@tanstack/react-router";
import unit1 from "@/assets/unit-1.jpg";
import unit2 from "@/assets/unit-2.jpg";
import unit3 from "@/assets/unit-3.jpg";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { useProducts, formatRupiah } from "@/lib/queries";

const fallback = [unit1, unit2, unit3];

export const Route = createFileRoute("/units")({
  head: () => ({
    meta: [
      { title: "Unit · Crown Court Executive Condominium" },
      { name: "description", content: "Pilihan unit Studio, 2 Bedroom, dan Penthouse di Crown Court Executive Condominium." },
      { property: "og:title", content: "Unit · Crown Court" },
      { property: "og:description", content: "Pilihan unit Studio, 2 Bedroom, dan Penthouse." },
      { property: "og:url", content: "/units" },
    ],
    links: [{ rel: "canonical", href: "/units" }],
  }),
  component: UnitsPage,
});

function UnitsPage() {
  const { data: products, isLoading } = useProducts();

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Produk</p>
        <h1 className="mt-4 text-5xl md:text-6xl">Unit Tersedia</h1>
        <p className="mt-6 max-w-xl text-muted-foreground">
          Setiap tipe dirancang dengan tata ruang efisien, material berkualitas, dan akses ke fasilitas premium.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-28">
        {isLoading && <p className="text-muted-foreground">Memuat…</p>}
        <div className="space-y-24">
          {(products ?? []).map((p, i) => {
            const reverse = i % 2 === 1;
            return (
              <article key={p.id} className="grid items-center gap-10 md:grid-cols-2">
                <div className={reverse ? "md:order-2" : ""}>
                  <div className="aspect-[5/4] overflow-hidden bg-muted">
                    <img
                      src={p.image_url ?? fallback[i % 3]}
                      alt={p.name}
                      width={1280}
                      height={960}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">{p.unit_type}</p>
                  <h2 className="mt-2 text-4xl leading-tight">{p.name}</h2>
                  <p className="mt-4 leading-relaxed text-muted-foreground">{p.description}</p>
                  <dl className="mt-8 grid grid-cols-3 gap-4 border-y border-border py-6 text-sm">
                    <div>
                      <dt className="text-xs uppercase tracking-widest text-muted-foreground">Luas</dt>
                      <dd className="mt-1">{p.size_sqm} m²</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-widest text-muted-foreground">Kamar</dt>
                      <dd className="mt-1">{p.bedrooms} KT · {p.bathrooms} KM</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-widest text-muted-foreground">Mulai</dt>
                      <dd className="mt-1">{formatRupiah(p.price_from)}</dd>
                    </div>
                  </dl>
                  {p.features && p.features.length > 0 && (
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {p.features.map((f) => (
                        <li key={f} className="rounded-full border border-border px-3 py-1 text-xs">
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
