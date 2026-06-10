import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { useNews, formatDate } from "@/lib/queries";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "Berita · Crown Court Executive Condominium" },
      { name: "description", content: "Update terbaru mengenai progres pembangunan, promo, dan event Crown Court." },
      { property: "og:title", content: "Berita · Crown Court" },
      { property: "og:description", content: "Update progres pembangunan, promo, dan event." },
      { property: "og:url", content: "/news" },
    ],
    links: [{ rel: "canonical", href: "/news" }],
  }),
  component: NewsPage,
});

function NewsPage() {
  const { data: news, isLoading } = useNews();
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-16">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Update</p>
        <h1 className="mt-4 text-5xl md:text-6xl">Berita & Kabar Terbaru</h1>
      </section>
      <section className="mx-auto max-w-4xl px-6 pb-28">
        {isLoading && <p className="text-muted-foreground">Memuat…</p>}
        <ul className="divide-y divide-border border-y border-border">
          {(news ?? []).map((n) => (
            <li key={n.id} className="py-10">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                {formatDate(n.published_at)}
              </p>
              <h2 className="mt-3 text-3xl leading-snug">{n.title}</h2>
              {n.excerpt && (
                <p className="mt-3 leading-relaxed text-muted-foreground">{n.excerpt}</p>
              )}
              {n.body && (
                <p className="mt-4 leading-relaxed text-foreground/90 whitespace-pre-wrap">{n.body}</p>
              )}
            </li>
          ))}
        </ul>
      </section>
      <SiteFooter />
    </div>
  );
}
