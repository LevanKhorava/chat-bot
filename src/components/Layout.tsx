import { NavLink, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageToggle from "./LanguageToggle";
import CountrySelect from "./CountrySelect";

const Layout = () => {
  const { t } = useTranslation();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-xs font-medium uppercase tracking-[0.15em] transition-colors ${
      isActive
        ? "text-ink border-b-2 border-brand pb-1"
        : "text-muted hover:text-ink"
    }`;

  return (
    <div className="min-h-screen bg-white text-ink">
      <header className="border-b border-line bg-white">
        <nav className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-8">
            <span className="text-xl font-extrabold uppercase tracking-[0.3em] text-ink">
              {t("nav.brand")}
            </span>
            <div className="flex items-center gap-4">
              <NavLink to="/" end className={linkClass}>
                {t("nav.home")}
              </NavLink>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CountrySelect />
            <LanguageToggle />
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
