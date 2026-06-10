import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  Link,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl">404</h1>
        <p className="mt-4 text-muted-foreground">Halaman tidak ditemukan.</p>
        <Link to="/" className="mt-6 inline-block underline">Kembali ke beranda</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h2 className="text-2xl">Terjadi kesalahan</h2>
        <p className="mt-2 text-sm text-muted-foreground">Silakan coba lagi.</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          Coba lagi
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Crown Court Executive Condominium - Cikarang" },
      { name: "description", content: "Crown Court Executive Condominium adalah Apartemen Exclusive yang berada di kawasan bisnis Lippo Cikarang dan dekat dengan area industri" },
      { property: "og:title", content: "Crown Court Executive Condominium - Cikarang" },
      { property: "og:description", content: "Crown Court Executive Condominium adalah Apartemen Exclusive yang berada di kawasan bisnis Lippo Cikarang dan dekat dengan area industri" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Crown Court" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Crown Court Executive Condominium - Cikarang" },
      { name: "twitter:description", content: "Crown Court Executive Condominium adalah Apartemen Exclusive yang berada di kawasan bisnis Lippo Cikarang dan dekat dengan area industri" },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/2vZwxhMVJya80WWawozZfDsRbt73/social-images/social-1781071191947-thumbnail.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/2vZwxhMVJya80WWawozZfDsRbt73/social-images/social-1781071191947-thumbnail.webp" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Inter:wght@300;400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        router.invalidate();
        if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
      }
    });
    return () => subscription.unsubscribe();
  }, [router, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster position="bottom-right" />
    </QueryClientProvider>
  );
}
