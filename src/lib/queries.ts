import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type CompanyInfo = {
  id: string;
  tagline: string | null;
  about: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
  instagram: string | null;
  tiktok: string | null;
  youtube: string | null;
  website: string | null;
};

export type Product = {
  id: string;
  name: string;
  unit_type: string | null;
  size_sqm: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  price_from: number | null;
  description: string | null;
  features: string[] | null;
  image_url: string | null;
  is_featured: boolean;
  marketing_name: string | null;
  marketing_contact: string | null;
  created_at: string;
};

export type MarketingContact = {
  id: string;
  name: string;
  role: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  sort_order: number;
};

export type NewsPost = {
  id: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  image_url: string | null;
  published: boolean;
  published_at: string;
};

export function useCompanyInfo() {
  return useQuery({
    queryKey: ["company_info"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("company_info")
        .select("*")
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as CompanyInfo | null;
    },
  });
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Product[];
    },
  });
}

export function useNews() {
  return useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news_posts")
        .select("*")
        .order("published_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as NewsPost[];
    },
  });
}

export function useMarketingContacts() {
  return useQuery({
    queryKey: ["marketing_contacts"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("marketing_contacts")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as MarketingContact[];
    },
  });
}

export function formatRupiah(n: number | null | undefined) {
  if (n == null) return "—";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatDate(d: string) {
  return new Date(d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
