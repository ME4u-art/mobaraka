import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useLocale, useT, dirOf } from "@/i18n";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useLocation,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { type ReactNode } from "react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";

import appCss from "../styles.css?url";
import { FloatingRail } from "@/components/site/FloatingRail";
import { agency } from "@/config/agency";

function NotFoundComponent() {
  const lang = useLocale();
  const t = useT();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">{t("error.notFoundHeading")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t("error.notFoundText")}</p>
        <div className="mt-6">
          <Link
            to="/$lang" params={{ lang }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t("error.goHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const t = useT();
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">{t("error.genericTitle")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("error.genericBody")}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t("error.tryAgain")}
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            {t("error.goHome")}
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: agency.seo.title },
      { name: "description", content: agency.seo.description },
      { name: "author", content: agency.identity.name },
      { property: "og:title", content: agency.seo.title },
      { property: "og:description", content: agency.seo.description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  // Read from the URL so the server emits the right language and direction in
  // the very first byte. Setting these after mount instead would ship every
  // Arabic page as lang="en" dir="ltr" - a flash of left-to-right for the
  // reader, the wrong language for a screen reader, and the wrong one for a
  // crawler, which never runs the effect at all.
  const locale = useLocale();
  return (
    <html lang={locale} dir={dirOf(locale)}>
      <head>
        <HeadContent />
        <style>{`:root{--brand:${agency.theme.brand};--hand:${agency.theme.accent};--brand-yellow:${agency.theme.highlight};--navy:${agency.theme.navy};}`}</style>
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
  const location = useLocation();

  return (
    <QueryClientProvider client={queryClient}>
      <MotionConfig reducedMotion="user">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
            <Outlet />
          </motion.div>
        </AnimatePresence>
        {/* Floating social rail + scroll-to-top — persists across every route */}
        <FloatingRail />
      </MotionConfig>
    </QueryClientProvider>
  );
}
