import { NavLink, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CountrySelect from "./CountrySelect";
import { openChat } from "../lib/chat";

const footerColumns = [
  { title: "Shop", links: ["Women", "Men", "Shoes", "Bags & Accessories"] },
  {
    title: "Customer care",
    links: ["Chat with a stylist", "Shipping", "Returns", "Size guide"],
  },
  { title: "Company", links: ["Our story", "Careers", "Sustainability", "Contact"] },
];

const Layout = () => {
  const { t } = useTranslation();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-xs font-medium uppercase tracking-[0.15em] transition-colors ${
      isActive
        ? "text-ink border-b-2 border-brand pb-1"
        : "text-muted hover:text-ink"
    }`;

  return (
    <div className="flex min-h-screen flex-col bg-white text-ink">
      {/* Promo bar */}
      <div className="bg-ink text-white">
        <p className="mx-auto max-w-7xl px-6 py-2 text-center text-[11px] font-medium uppercase tracking-[0.2em]">
          Free shipping over €50 · Live stylist 24/7 · Free 30-day returns
        </p>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-8">
            <span className="text-xl font-extrabold uppercase tracking-[0.3em] text-ink">
              {t("nav.brand")}
            </span>
            <div className="hidden items-center gap-6 md:flex">
              <NavLink to="/" end className={linkClass}>
                {t("nav.home")}
              </NavLink>
              <a href="#categories" className="text-xs font-medium uppercase tracking-[0.15em] text-muted transition-colors hover:text-ink">
                Categories
              </a>
              <a href="#new-in" className="text-xs font-medium uppercase tracking-[0.15em] text-muted transition-colors hover:text-ink">
                New in
              </a>
              <button
                type="button"
                onClick={openChat}
                className="text-xs font-medium uppercase tracking-[0.15em] text-brand-dark transition-colors hover:text-ink"
              >
                Search in chat
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CountrySelect />
          </div>
        </nav>
      </header>

      <main className="flex-1 bg-white">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-line bg-paper">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <div className="text-lg font-extrabold uppercase tracking-[0.3em] text-ink">
              {t("nav.brand")}
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted">
              Fashion, home design & lifestyle. Shop thousands of pieces live
              with a personal stylist.
            </p>
            <button
              type="button"
              onClick={openChat}
              className="mt-4 bg-brand px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-brand-light"
            >
              Shop live
            </button>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-ink">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-2">
                {column.links.map((link) => (
                  <li key={link}>
                    <button
                      type="button"
                      onClick={openChat}
                      className="text-sm text-muted transition-colors hover:text-ink"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-line">
          <p className="mx-auto max-w-7xl px-6 py-4 text-center text-xs text-muted">
            © 2026 Ventis. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
