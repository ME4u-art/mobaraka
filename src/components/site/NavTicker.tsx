import { Link } from "@tanstack/react-router";
import { nav } from "./Header";
import { useLocale, useT } from "@/i18n";

export function NavTicker() {
  const lang = useLocale();
  const t = useT();
  const loop = [...nav, ...nav, ...nav];
  return (
    <div className="overflow-hidden bg-brand-yellow py-4">
      <div className="partners-track">
        {loop.map((n, i) => (
          <div key={`${n.to}-${i}`} className="flex shrink-0 items-center gap-8 px-4">
            <Link to={n.to} params={{ lang }} className="text-sm font-bold uppercase tracking-wide text-foreground">
              {t(n.key)}
            </Link>
            <span aria-hidden className="text-foreground">
              •
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
