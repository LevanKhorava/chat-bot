import { useTranslation } from "react-i18next";

const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const current = i18n.language.startsWith("ka") ? "ka" : "en";

  const changeLanguage = (lng: "en" | "ka") => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center gap-1 rounded-full bg-white/10 p-1">
      <button
        type="button"
        onClick={() => changeLanguage("en")}
        className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
          current === "en"
            ? "bg-white text-aubergine"
            : "text-white/80 hover:text-white"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => changeLanguage("ka")}
        className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
          current === "ka"
            ? "bg-white text-aubergine"
            : "text-white/80 hover:text-white"
        }`}
      >
        ႥႤ
      </button>
    </div>
  );
};

export default LanguageToggle;
