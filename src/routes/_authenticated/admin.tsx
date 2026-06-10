import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCompanyInfo, useProducts, useNews, type Product, type NewsPost, type CompanyInfo, formatRupiah, formatDate } from "@/lib/queries";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin · Crown Court" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

type Tab = "company" | "products" | "news";

function AdminPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("company");
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  const { data: roleData } = useQuery({
    queryKey: ["my-roles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("role");
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (!roleData) return;
    setIsAdmin(roleData.some((r) => r.role === "admin"));
  }, [roleData]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-background p-12">
        <h1 className="text-3xl">Akses ditolak</h1>
        <p className="mt-2 text-muted-foreground">Akun Anda bukan admin.</p>
        <button onClick={signOut} className="mt-4 underline">Keluar</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <Link to="/" className="font-display text-lg">Crown Court</Link>
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Admin Panel</span>
          </div>
          <button onClick={signOut} className="text-sm text-muted-foreground hover:text-foreground">
            Keluar
          </button>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <nav className="mb-8 flex gap-1 border-b border-border">
          {(["company", "products", "news"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-3 text-sm transition-colors ${
                tab === t
                  ? "border-b-2 border-foreground text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "company" ? "Info Perusahaan" : t === "products" ? "Unit / Produk" : "Berita"}
            </button>
          ))}
        </nav>
        {tab === "company" && <CompanyEditor />}
        {tab === "products" && <ProductsEditor />}
        {tab === "news" && <NewsEditor />}
      </div>
    </div>
  );
}

/* ---------------- Company ---------------- */
function CompanyEditor() {
  const { data: info, refetch } = useCompanyInfo();
  const [form, setForm] = useState<Partial<CompanyInfo>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (info) setForm(info);
  }, [info]);

  async function save() {
    if (!info?.id) return;
    setSaving(true);
    const { error } = await supabase.from("company_info").update(form).eq("id", info.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Tersimpan");
    refetch();
  }

  const fields: Array<[keyof CompanyInfo, string, boolean?]> = [
    ["tagline", "Tagline"],
    ["about", "Tentang", true],
    ["address", "Alamat", true],
    ["phone", "Telepon"],
    ["email", "Email"],
    ["whatsapp", "WhatsApp"],
    ["instagram", "Instagram"],
    ["tiktok", "TIKTOK"],
    ["website", "Website"],
  ];

  return (
    <div className="max-w-2xl space-y-5">
      {fields.map(([key, label, isArea]) => (
        <label key={key} className="block">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
          {isArea ? (
            <textarea
              rows={4}
              value={(form[key] as string) ?? ""}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          ) : (
            <input
              value={(form[key] as string) ?? ""}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          )}
        </label>
      ))}
      <button
        onClick={save}
        disabled={saving}
        className="rounded-md bg-foreground px-6 py-2.5 text-sm uppercase tracking-widest text-background disabled:opacity-50"
      >
        {saving ? "Menyimpan…" : "Simpan"}
      </button>
    </div>
  );
}

/* ---------------- Products ---------------- */
function ProductsEditor() {
  const { data: products } = useProducts();
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<Product> | null>(null);

  async function save() {
    if (!editing) return;
    const payload = {
      name: editing.name ?? "",
      unit_type: editing.unit_type ?? null,
      size_sqm: editing.size_sqm ?? null,
      bedrooms: editing.bedrooms ?? null,
      bathrooms: editing.bathrooms ?? null,
      price_from: editing.price_from ?? null,
      description: editing.description ?? null,
      features: editing.features ?? null,
      image_url: editing.image_url ?? null,
      is_featured: editing.is_featured ?? false,
    };
    const { error } = editing.id
      ? await supabase.from("products").update(payload).eq("id", editing.id)
      : await supabase.from("products").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Tersimpan");
    setEditing(null);
    qc.invalidateQueries({ queryKey: ["products"] });
  }

  async function remove(id: string) {
    if (!confirm("Hapus unit ini?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Dihapus");
    qc.invalidateQueries({ queryKey: ["products"] });
  }

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => setEditing({ is_featured: true })}
          className="rounded-md bg-foreground px-4 py-2 text-sm text-background"
        >
          + Tambah Unit
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Nama</th>
              <th className="px-4 py-3 text-left">Tipe</th>
              <th className="px-4 py-3 text-left">Luas</th>
              <th className="px-4 py-3 text-left">Mulai</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {(products ?? []).map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="px-4 py-3">{p.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.unit_type}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.size_sqm} m²</td>
                <td className="px-4 py-3 text-muted-foreground">{formatRupiah(p.price_from)}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setEditing(p)} className="mr-3 underline">Edit</button>
                  <button onClick={() => remove(p.id)} className="text-destructive underline">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-background p-8">
            <h3 className="text-2xl">{editing.id ? "Edit Unit" : "Tambah Unit"}</h3>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Inp label="Nama" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} />
              <Inp label="Tipe (Studio, 2BR…)" value={editing.unit_type ?? ""} onChange={(v) => setEditing({ ...editing, unit_type: v })} />
              <Inp label="Luas (m²)" type="number" value={editing.size_sqm ?? ""} onChange={(v) => setEditing({ ...editing, size_sqm: v === "" ? null : Number(v) })} />
              <Inp label="Harga mulai (IDR)" type="number" value={editing.price_from ?? ""} onChange={(v) => setEditing({ ...editing, price_from: v === "" ? null : Number(v) })} />
              <Inp label="Kamar tidur" type="number" value={editing.bedrooms ?? ""} onChange={(v) => setEditing({ ...editing, bedrooms: v === "" ? null : Number(v) })} />
              <Inp label="Kamar mandi" type="number" value={editing.bathrooms ?? ""} onChange={(v) => setEditing({ ...editing, bathrooms: v === "" ? null : Number(v) })} />
              <Inp label="URL Gambar" value={editing.image_url ?? ""} onChange={(v) => setEditing({ ...editing, image_url: v })} className="md:col-span-2" />
              <Inp label="Fitur (pisah dengan koma)" value={(editing.features ?? []).join(", ")} onChange={(v) => setEditing({ ...editing, features: v.split(",").map((s) => s.trim()).filter(Boolean) })} className="md:col-span-2" />
              <label className="md:col-span-2">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">Deskripsi</span>
                <textarea rows={4} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
              </label>
              <label className="md:col-span-2 flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editing.is_featured ?? false} onChange={(e) => setEditing({ ...editing, is_featured: e.target.checked })} />
                Tampilkan sebagai unit unggulan di beranda
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setEditing(null)} className="rounded-md border border-border px-4 py-2 text-sm">Batal</button>
              <button onClick={save} className="rounded-md bg-foreground px-4 py-2 text-sm text-background">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- News ---------------- */
function NewsEditor() {
  const { data: news } = useNews();
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<NewsPost> | null>(null);

  async function save() {
    if (!editing) return;
    const payload = {
      title: editing.title ?? "",
      excerpt: editing.excerpt ?? null,
      body: editing.body ?? null,
      image_url: editing.image_url ?? null,
      published: editing.published ?? true,
      published_at: editing.published_at ?? new Date().toISOString(),
    };
    const { error } = editing.id
      ? await supabase.from("news_posts").update(payload).eq("id", editing.id)
      : await supabase.from("news_posts").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Tersimpan");
    setEditing(null);
    qc.invalidateQueries({ queryKey: ["news"] });
  }

  async function remove(id: string) {
    if (!confirm("Hapus berita ini?")) return;
    const { error } = await supabase.from("news_posts").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["news"] });
  }

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <button onClick={() => setEditing({ published: true })} className="rounded-md bg-foreground px-4 py-2 text-sm text-background">
          + Tambah Berita
        </button>
      </div>

      <ul className="divide-y divide-border rounded-lg border border-border">
        {(news ?? []).map((n) => (
          <li key={n.id} className="flex items-center justify-between p-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                {formatDate(n.published_at)} {!n.published && "· Draft"}
              </p>
              <p className="mt-1">{n.title}</p>
            </div>
            <div className="text-sm">
              <button onClick={() => setEditing(n)} className="mr-3 underline">Edit</button>
              <button onClick={() => remove(n.id)} className="text-destructive underline">Hapus</button>
            </div>
          </li>
        ))}
      </ul>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-background p-8">
            <h3 className="text-2xl">{editing.id ? "Edit Berita" : "Tambah Berita"}</h3>
            <div className="mt-6 space-y-4">
              <Inp label="Judul" value={editing.title ?? ""} onChange={(v) => setEditing({ ...editing, title: v })} />
              <Inp label="Ringkasan" value={editing.excerpt ?? ""} onChange={(v) => setEditing({ ...editing, excerpt: v })} />
              <label>
                <span className="text-xs uppercase tracking-widest text-muted-foreground">Isi</span>
                <textarea rows={8} value={editing.body ?? ""} onChange={(e) => setEditing({ ...editing, body: e.target.value })} className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
              </label>
              <Inp label="URL Gambar" value={editing.image_url ?? ""} onChange={(v) => setEditing({ ...editing, image_url: v })} />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editing.published ?? true} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} />
                Publikasikan
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setEditing(null)} className="rounded-md border border-border px-4 py-2 text-sm">Batal</button>
              <button onClick={save} className="rounded-md bg-foreground px-4 py-2 text-sm text-background">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Inp({ label, value, onChange, type = "text", className = "" }: { label: string; value: string | number | null | undefined; onChange: (v: string) => void; type?: string; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
      />
    </label>
  );
}
