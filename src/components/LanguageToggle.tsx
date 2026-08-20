import { useTranslation } from "react-i18next";

const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const current = i18n.language.startsWith("ka") ? "ka" : "en";

  const changeLanguage = (lng: "en" | "ka") => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center border border-line">
      <button
        type="button"
        onClick={() => changeLanguage("en")}
        className={`px-3 py-1.5 text-xs font-medium uppercase tracking-[0.1em] transition-colors ${
          current === "en"
            ? "bg-ink text-white"
            : "text-muted hover:text-ink"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => changeLanguage("ka")}
        className={`px-3 py-1.5 text-xs font-medium uppercase tracking-[0.1em] transition-colors ${
          current === "ka"
            ? "bg-ink text-white"
            : "text-muted hover:text-ink"
        }`}
      >
        KA
      </button>
    </div>
  );
};

export default LanguageToggle;
